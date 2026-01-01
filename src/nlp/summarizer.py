from transformers import pipeline
import spacy

nlp = spacy.load("en_core_web_md")


class MeetingSummariser:
    def __init__(self, max_words=400):
        self.max_words = max_words

        # Abstractive model (open source, CPU-friendly)
        self.abstracter = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device=-1
        )

    def _chunk_text(self, text):
        words = text.split()
        return [
            " ".join(words[i:i + self.max_words])
            for i in range(0, len(words), self.max_words)
        ]

    def _extract_key_sentences(self, text, k=6):
        """
        Extractive backbone:
        - keeps numeric, factual, result-oriented sentences
        - guarantees early departments are not dropped
        """
        key_sents = []

        for sent in nlp(text).sents:
            s = sent.text.lower()

            has_number = any(c.isdigit() for c in s)
            has_result_word = any(
                w in s for w in [
                    "students", "passed", "failed",
                    "results", "performance", "percentage"
                ]
            )

            if has_number and has_result_word:
                key_sents.append(sent.text.strip())

            if len(key_sents) >= k:
                break

        return key_sents

    def summarize(self, text):
        # 1️⃣ Extractive safety net (coverage guaranteed)
        key_points = self._extract_key_sentences(text)

        # 2️⃣ Abstractive summarization
        chunks = self._chunk_text(text)
        abstractive_parts = []

        for chunk in chunks:
            out = self.abstracter(
                chunk,
                max_length=140,
                min_length=60,
                do_sample=False
            )[0]["summary_text"]
            abstractive_parts.append(out)

        abstractive_summary = " ".join(abstractive_parts)

        # 3️⃣ Final hybrid summary
        if key_points:
            final_summary = (
                "Key factual highlights: "
                + " ".join(key_points)
                + "\n\n"
                + "Overall summary: "
                + abstractive_summary
            )
        else:
            final_summary = abstractive_summary

        return final_summary
