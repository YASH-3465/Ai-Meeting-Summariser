import re
from .schema import MoMResult
from datetime import datetime
from .schema import MoMResult, MoMActionItem

ACTION_VERBS = [
    "instructed", "suggested", "proposed",
    "directed", "requested", "asked",
    "ensure", "arrange", "coordinate"
]

RESPONSIBILITY_RULES = {
    "Faculty": ["faculty", "faculty members"],
    "Department": ["department"],
    "Placement Cell": ["placement cell"],
    "Placement Coordinators": ["placement coordinators"],
    "Students": ["students"]
}

DATE_PATTERN = r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}"




def extract_responsibility(text: str) -> str:
    text_lower = text.lower()

    for role, keywords in RESPONSIBILITY_RULES.items():
        if any(k in text_lower for k in keywords):
            return role

    return "Committee"



def extract_deadline(text: str):
    match = re.search(DATE_PATTERN, text)
    if not match:
        return None

    try:
        date_obj = datetime.strptime(match.group(), "%B %d, %Y")
        return date_obj.strftime("%Y-%m-%d")
    except ValueError:
        return None


def generate_mom_summary(agenda_items, action_items) -> str:
    if not agenda_items and not action_items:
        return "No significant discussions or actions were recorded during the meeting."

    # --- Infer meeting focus areas ---
    focus_keywords = {
        "academics": ["academic", "course", "outcome", "co-po", "assessment"],
        "placements": ["placement", "industry", "training"],
        "students": ["student", "employability", "remedial"],
        "development": ["workshop", "guest lecture", "value-added"]
    }

    detected_focus = set()
    combined_text = " ".join(agenda_items).lower()

    for focus, keywords in focus_keywords.items():
        if any(k in combined_text for k in keywords):
            detected_focus.add(focus)

    # --- Build focus sentence ---
    if detected_focus:
        focus_sentence = ", ".join(sorted(detected_focus))
        focus_line = f"The meeting focused on {focus_sentence} related activities."
    else:
        focus_line = "The meeting focused on key departmental and academic activities."

    # --- Build final summary ---
    summary = (
        "PAC Meeting – Summary\n"
        f"{focus_line} "
        f"A total of {len(agenda_items)} agenda points were discussed, "
        f"resulting in {len(action_items)} key action items assigned for follow-up."
    )

    return summary


def extract_agenda_and_actions(text: str) -> MoMResult:
    agenda_items = []
    action_items = []

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    for line in lines:
        # --- Agenda Detection ---
        agenda_match = re.match(r"(Item\s*No\.\s*\d+):(.*)", line, re.IGNORECASE)
        if agenda_match:
            agenda_text = agenda_match.group(2).strip()
            agenda_items.append(agenda_text)

        # --- Action Detection ---
        lower_line = line.lower()
        if any(verb in lower_line for verb in ACTION_VERBS):
            cleaned = _clean_action_line(line)
            deadline = extract_deadline(cleaned)

            responsibility = extract_responsibility(cleaned)

            action_items.append(
                MoMActionItem(
                    text=cleaned,
                    deadline=deadline,
                    responsibility=responsibility
                )
            )


    return MoMResult(
        agenda_items=agenda_items,
        action_items=action_items
    )


def _clean_action_line(line: str) -> str:
    # Remove Item No.X prefix
    line = re.sub(r"Item\s*No\.\s*\d+:\s*", "", line, flags=re.IGNORECASE)

    # Remove "The Committee"
    line = re.sub(r"the committee\s*", "", line, flags=re.IGNORECASE)

    return line.strip()

