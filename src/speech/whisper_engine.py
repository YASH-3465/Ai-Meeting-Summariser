import whisper

class WhisperEngine:
    def __init__(self):
        # Load Whisper model (small is fine for your project)
        self.model = whisper.load_model("small")

    def transcribe(self, audio_path, translate=False):
        """
        translate=False → English audio → English text
        translate=True  → Any language audio → English text
        """

        if translate:
            # 🔑 TRANSLATION MODE (German / Telugu / Hindi → English)
            result = self.model.transcribe(
                audio_path,
                task="translate"
            )
        else:
            # 🔑 NORMAL TRANSCRIPTION MODE (English → English)
            result = self.model.transcribe(audio_path)

        return result["text"]
