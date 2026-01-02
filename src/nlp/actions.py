import re
import spacy

# Load spaCy model once
nlp = spacy.load("en_core_web_md")

# ------------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------------


CONTEXT_ONLY_PHRASES = [
    "based on these results"
    "based on the current progress",
    "based on current progress",
    "based on this",
    "based on the discussion",
    "according to the discussion",
    "as discussed earlier",
    "from the above analysis",
    "as per the discussion"
]

EXCLUDE_PATTERNS = [
    "we will discuss",
    "there was a discussion",
    "it was discussed",
    "status update",
    "agenda",
    "overall discussion",
    "based on this discussion",
    "for information",
    "just to inform"
]

FUTURE_MARKERS = [
    "will", "shall", "going to",
    "planned", "expected", "scheduled",
    "must", "should", "needs to", "have to"
]

EXECUTION_VERBS = [
    "submit", "conduct", "complete", "finish",
    "prepare", "implement", "organize",
    "schedule", "deploy", "coordinate",
    "run", "start", "begin", "provide",
    "deliver", "update", "monitor", "review"
]

DATE_REGEX_PATTERNS = [
    r"\bby\s+\d{1,2}\s+\w+\s+\d{4}\b",
    r"\bend\s+of\s+\w+\s+\d{4}\b",
    r"\bwithin\s+\d+\s+days?\b",
    r"\bnext\s+week\b",
    r"\bnext\s+month\b"
]

NON_ACTION_DATES = {
    "today", "now", "currently", "next meeting"
}

# ------------------------------------------------------------------
# UTILITIES
# ------------------------------------------------------------------

def extract_deadline(sentence: str):
    s = sentence.lower()

    # Regex-based deadlines (strong signal)
    for pattern in DATE_REGEX_PATTERNS:
        match = re.search(pattern, s)
        if match:
            return match.group()

    # spaCy DATE entities (fallback)
    doc = nlp(sentence)
    for ent in doc.ents:
        if ent.label_ == "DATE":
            if ent.text.lower() not in NON_ACTION_DATES:
                return ent.text

    return None


def split_into_clauses(sentence: str):
    """
    Split complex sentences into independent action clauses
    """
    return re.split(r"\band\b|\bthen\b|,|;", sentence)


def normalize_action(text: str):
    """
    Normalize text for clean action output
    """
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    text = text.rstrip(".")
    return text.lower()


def is_excluded(sentence: str):
    s = sentence.lower()
    return any(p in s for p in EXCLUDE_PATTERNS)


def is_policy_level(sentence: str):
    s = sentence.lower()
    return (
        "all departments" in s
        or "all teams" in s
        or "everyone" in s
        or "all members" in s
    )

# ------------------------------------------------------------------
# CORE EXTRACTION LOGIC
# ------------------------------------------------------------------

def extract_actions(text: str):
    """
    High-precision action extraction using:
    - Future intent
    - Execution verbs
    - Deadline detection
    - Clause-level splitting
    """

    actions = []
    seen_actions = set()

    doc = nlp(text)

    for sent in doc.sents:
        sentence = sent.text.strip()

        if len(sentence.split()) < 6:
            continue

        if is_excluded(sentence):
            continue

        deadline = extract_deadline(sentence)
        s = sentence.lower()

        has_future = any(m in s for m in FUTURE_MARKERS)
        has_execution = any(v in s for v in EXECUTION_VERBS)

        # --------------------------------------------------------------
        # POLICY-LEVEL ACTIONS (VERY IMPORTANT)
        # --------------------------------------------------------------
        if is_policy_level(sentence) and deadline:
            action_text = normalize_action(sentence)

            if action_text not in seen_actions:
                actions.append({
                    "action": action_text,
                    "deadline": deadline
                })
                seen_actions.add(action_text)

            continue

        # --------------------------------------------------------------
        # NORMAL ACTION SENTENCES
        # --------------------------------------------------------------
        if not (has_execution and (has_future or deadline)):
            continue

        clauses = split_into_clauses(sentence)

        for clause in clauses:
            c = clause.strip()

            if len(c.split()) < 4:
                continue

            cl = c.lower()

            # ❌ Reject context-only clauses
            if any(p in cl for p in CONTEXT_ONLY_PHRASES):
                continue

            if "review" in cl or "discuss" in cl or "inform" in cl:
                continue

            action_text = normalize_action(c)

            if action_text in seen_actions:
                continue

            actions.append({
                "action": action_text,
                "deadline": deadline
            })
            seen_actions.add(action_text)

    return actions
