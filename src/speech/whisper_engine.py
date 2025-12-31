import whisper

class WhisperEngine:
    def __init__(self, model_size="base"):
        self.model = whisper.load_model("small")

    def transcribe(self, audio_path):
        result = self.model.transcribe(audio_path)
        return result["text"]
