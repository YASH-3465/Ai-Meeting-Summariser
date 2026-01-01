import re
import spacy

nlp = spacy.load("en_core_web_md")

EXCLUDE_PATTERNS = [
    "we will discuss",
    "there was a discussion",
    "it was discussed",
    "status update",
    "agenda",
    "overall discussion",
    "based on this discussion"
]

DATE_PATTERNS = [
    r"\bby\s+\d{1,2}\s+\w+\s+\d{4}\b",
    r"\bend\s+of\s+\w+\s+\d{4}\b",
    r"\bwithin\s+\d+\s+days?\b",
    r"\bnext\s+week\b"
]

EXECUTION_VERBS = [
    "submit", "conduct", "complete", "finish",
    "prepare", "implement", "organize",
    "schedule", "deploy", "coordinate",
    "run", "start", "begin", "provide"
]

FUTURE_MARKERS = [
    "will", "shall", "going to",
    "planned", "expected", "scheduled",
    "must", "should"
]


def extract_deadline(sentence):
    s = sentence.lower()
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, s)
        if match:
            return match.group()
    for ent in nlp(sentence).ents:
        if ent.label_ == "DATE":
            if ent.text.lower() in {"today", "now", "next meeting", "currently"}:
                return None
            return ent.text
    return None


def clean_review_clauses(sentence):
    # remove review-only parts safely
    sentence = re.sub(
        r"\band\s+.*review.*",
        "",
        sentence,
        flags=re.IGNORECASE
    )
    return sentence.strip()


def split_into_clauses(sentence):
    return re.split(r"\band\b|\bthen\b|,", sentence)


def extract_actions(text):
    actions = []
    doc = nlp(text)

    for sent in doc.sents:
        sentence = sent.text.strip()
        s = sentence.lower()

        if any(p in s for p in EXCLUDE_PATTERNS):
            continue

        deadline = extract_deadline(sentence)

        has_future = any(m in s for m in FUTURE_MARKERS)
        has_execution = any(v in s for v in EXECUTION_VERBS)

        if len(sentence.split()) < 6:
            continue

        # ✅ POLICY-LEVEL SENTENCES (FINAL FIX)
        if "all departments" in s or "all teams" in s:
            cleaned = clean_review_clauses(sentence)
            if extract_deadline(cleaned):
                actions.append({
                    "action": cleaned.lower(),
                    "deadline": extract_deadline(cleaned)
                })
            continue

        if not (has_execution and (has_future or deadline)):
            continue

        clauses = split_into_clauses(sentence)

        for clause in clauses:
            c = clause.strip().lower()
            if "review" in c or "discuss" in c:
                continue
            if len(c.split()) < 4:
                continue
            actions.append({
                "action": c,
                "deadline": deadline
            })

    return actions
