from fastapi import APIRouter, UploadFile, File, Form
from services.meeting_service import process_meeting
import os
import shutil
import uuid

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/api/process")
async def process_meeting_api(
    file: UploadFile = File(...),
    translate: bool = Form(False),
    notify: bool = Form(False)
):
    # 🔹 1. Create a unique file name
    file_ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4()}{file_ext}"

    # 🔹 2. Define file path
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # 🔹 3. Save uploaded file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔹 4. Call your ML pipeline
    result = process_meeting(
        file_path=file_path,
        translate=translate,
        notify=notify
    )

    return result