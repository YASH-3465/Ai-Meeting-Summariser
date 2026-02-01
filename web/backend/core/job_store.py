import uuid
from typing import Dict

JOBS: Dict[str, dict] = {}

def create_job():
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "status": "queued",
        "progress": 0,
        "result": None,
        "error": None
    }
    return job_id

def update_job(job_id, **kwargs):
    if job_id in JOBS:
        JOBS[job_id].update(kwargs)

def get_job(job_id):
    return JOBS.get(job_id)
