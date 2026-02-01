import re

# These are cheap string checks (VERY FAST)
ACTION_KEYWORDS = [
    "will", "must", "should", "needs to", "have to",
    "submit", "prepare", "complete", "finalize",
    "organize", "conduct", "repair", "share",
    "provide", "deliver", "coordinate"
]


def extract_action_candidates(text: str) -> str:
    """
    Extract only sentences that MAY contain action items.
    This is a FAST pre-filter (no ML, no spaCy).
    """

    if not text:
        return ""

    # Split into sentences (cheap regex)
    sentences = re.split(r'(?<=[.!?])\s+', text)

    candidates = []

    for sentence in sentences:
        s = sentence.lower()

        # Keep sentence ONLY if it contains action signals
        if any(keyword in s for keyword in ACTION_KEYWORDS):
            candidates.append(sentence.strip())

    # Join back into a short text block
    return " ".join(candidates)
