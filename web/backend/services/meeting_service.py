import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

import os
import uuid
from src.pipeline.meeting_pipeline import MeetingPipeline

pipeline = MeetingPipeline()

def process_meeting(
    file_path: str,
    translate: bool = False,
    notify: bool = False
):
    return pipeline.run(
        media_path=file_path,
        translate=translate,
        notify=notify
    )
