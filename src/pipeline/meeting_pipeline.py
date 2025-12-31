from src.media.extractor import extract_audio
from src.speech.whisper_engine import WhisperEngine
from src.nlp.cleaner import clean_text
from src.nlp.summarizer import MeetingSummariser
from src.nlp.actions import extract_actions
from src.notification.dispatcher import dispatch


class MeetingPipeline:
    def __init__(self):
        self.whisper = WhisperEngine()
        self.summariser = MeetingSummariser()

    def run(self, media_path, notify=False):
        audio_path = extract_audio(media_path)
        text = self.whisper.transcribe(audio_path)
        cleaned_text = clean_text(text)

        raw_summary = self.summariser.summarize(cleaned_text)
        summary =("Below is a concise summary of the meeting discussion: "+raw_summary)

        actions = extract_actions(cleaned_text)

        dispatch(
            summary=summary,
            actions=actions,
            notify=notify
        )

        return {
            "summary": summary,
            "actions": actions
        }

    # 🔧 For notebook / testing only
    def run_from_text(self, text, notify=False):
        cleaned_text = clean_text(text)

        raw_summary = self.summariser.summarize(cleaned_text)
        summary =("Below is a concise summary of the meeting discussion: "+raw_summary)
        actions = extract_actions(cleaned_text)

        dispatch(
            summary=summary,
            actions=actions,
            notify=notify
        )

        return {
            "summary": summary,
            "actions": actions
        }