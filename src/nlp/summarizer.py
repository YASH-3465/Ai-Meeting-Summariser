# src/summariser.py

from transformers import pipeline
import math

class MeetingSummariser:
    def __init__(self, max_words=450):
        self.max_words = max_words
        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device=-1
        )

    def _chunk_text(self, text):
        words = text.split()
        chunks = []
        for i in range(0, len(words), self.max_words):
            chunks.append(" ".join(words[i:i+self.max_words]))
        return chunks

    def summarize(self, text):
        chunks = self._chunk_text(text)

        partial_summaries = []
        for chunk in chunks:
            out = self.summarizer(
                chunk,
                max_length=140,
                min_length=60,
                do_sample=False
            )[0]["summary_text"]
            partial_summaries.append(out)

        if len(partial_summaries) == 1:
            return partial_summaries[0]

        combined = " ".join(partial_summaries)
        final = self.summarizer(
            combined,
            max_length=180,
            min_length=90,
            do_sample=False
        )[0]["summary_text"]

        final = final.replace(
            "There was also a discussion about",
            "The team identified"
        )
        return final
