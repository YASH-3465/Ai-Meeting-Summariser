from typing import List, Optional
from dataclasses import dataclass

@dataclass
class MoMActionItem:
    text: str
    deadline: Optional[str]
    responsibility: str

@dataclass
class MoMResult:
    agenda_items: List[str]
    action_items: List[MoMActionItem]
