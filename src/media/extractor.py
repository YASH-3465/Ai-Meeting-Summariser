import subprocess
import os
import mimetypes

def extract_audio(input_path):
    input_path = os.path.abspath(input_path)
    output_path = os.path.abspath("data/processed/audio.wav")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    mime_type, _ = mimetypes.guess_type(input_path)
    is_audio_only = mime_type and mime_type.startswith("audio")

    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-ac", "1",
        "-ar", "16000",
        output_path
    ]

    # Only remove video stream if it is a video file
    if not is_audio_only:
        command.insert(4, "-vn")

    try:
        subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    except subprocess.CalledProcessError as e:
        print("FFmpeg FAILED")
        print("Command:", " ".join(command))
        print("FFmpeg stderr:\n", e.stderr.decode(errors="ignore"))
        raise RuntimeError("Audio extraction failed")

    return output_path
