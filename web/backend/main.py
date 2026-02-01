
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
import logging
from logging_config import IgnoreStatusEndpointFilter


app = FastAPI(title="MeetWise API")
# 🔕 Hide noisy polling logs but keep access logs
access_logger = logging.getLogger("uvicorn.access")
access_logger.addFilter(IgnoreStatusEndpointFilter())


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router,prefix="/api")

@app.get("/")
def health():
    return {"status": "Backend running"}
