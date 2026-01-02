from pydantic import BaseModel
from typing import List, Optional

class ActionItem(BaseModel):
    action: str
    deadline: Optional[str]

class MeetingResponse(BaseModel):
    summary: str
    actions: List[ActionItem]
