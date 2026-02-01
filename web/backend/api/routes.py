from fastapi import APIRouter, UploadFile, BackgroundTasks,Form
import os
import shutil
import uuid
import logging


from services.meeting_service import process_meeting
from core.job_store import create_job, update_job, get_job

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/process")
async def process_file(
    file: UploadFile,
    background_tasks: BackgroundTasks,
    translate: bool = Form(False),
    notify: bool = Form(False),
    
):
    # 1️⃣ Create job
    job_id = create_job()

    # 2️⃣ Save file immediately
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3️⃣ Start background task
    background_tasks.add_task(
        run_pipeline,
        job_id,
        file_path,
        translate,
        notify
    )

    return {"job_id": job_id}

def run_pipeline(job_id: str, file_path: str,translate: bool, notify: bool):
    try:
        update_job(job_id, status="processing", progress=10)

        result = process_meeting(
            file_path=file_path,
            translate=translate,
            notify=notify
        )

        update_job(
            job_id,
            status="completed",
            progress=100,
            result=result
        )
        print(f"✅ Job {job_id} completed — frontend will update now")



    except Exception as e:
        update_job(
            job_id,
            status="failed",
            error=str(e)
        )


@router.get("/status/{job_id}")
async def get_status(job_id: str):
    job = get_job(job_id)
    if not job:
        return {"error": "Invalid job id"}
    return job
