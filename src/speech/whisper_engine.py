from faster_whisper import WhisperModel


class WhisperEngine:
    def __init__(self):
        """
        Faster-Whisper initialization
        Optimized for CPU using INT8 quantization
        """
        print("🔥 Loading faster-whisper (small, INT8, CPU) 🔥")

        self.model = WhisperModel(
            "small",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio_path, translate=False):
        """
        Single-pass transcription.

        translate=False:
            → Output in original language

        translate=True:
            → Output translated to English

        Returns ONLY text (safe for pipeline)
        """

        print("🔥 FAST WHISPER TRANSCRIPTION STARTED 🔥")

        segments, info = self.model.transcribe(
            audio_path,
            task="translate" if translate else "transcribe",
            beam_size=5
        )

        text = " ".join(segment.text for segment in segments)

        print(
            f"🔥 TRANSCRIPTION DONE | Language={info.language} | Duration={info.duration:.2f}s 🔥"
        )

        return text