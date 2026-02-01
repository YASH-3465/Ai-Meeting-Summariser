import re
import spacy

# Load spaCy model once
nlp = spacy.load("en_core_web_md")

# ------------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------------


def is_process_only(sentence: str):
    PROCESS_PHRASES = [
        "keep up",
        "ensure",
        "make sure",
        "follow up",
        "adhere to",
        "maintain",
        "monitor progress"
    ]
    s = sentence.lower()
    return any(p in s for p in PROCESS_PHRASES)


def has_concrete_object(sentence: str):
    """
    Ensure the action has a concrete deliverable,
    not abstract phrases like 'keep up', 'move forward'.
    """
    OBJECT_KEYWORDS = [
        "report", "documents", "document", "tests", "testing",
        "modules", "apis", "features", "files",
        "list", "schedule", "submission"
    ]

    s = sentence.lower()
    return any(obj in s for obj in OBJECT_KEYWORDS)


def resolve_pronoun_owner(sentence: str, last_owner: str | None):
    """
    Replace pronoun-based ownership with last known named owner.
    """
    s = sentence.lower()

    if last_owner and any(p in s for p in [
        "i will", "i'll", "he will", "she will",
        "he must", "she must"
    ]):
        return sentence.replace("I ", f"{last_owner} ") \
                       .replace("i ", f"{last_owner} ") \
                       .replace("He ", f"{last_owner} ") \
                       .replace("he ", f"{last_owner} ") \
                       .replace("She ", f"{last_owner} ") \
                       .replace("she ", f"{last_owner} ")

    return sentence


def has_strong_action_verb(text: str) -> bool:
    s = text.lower()
    return any(v in s for v in EXECUTION_VERBS)


def is_academic_year_phrase(text: str) -> bool:
    s = text.lower()
    return any(p in s for p in [
        "first year",
        "second year",
        "third year",
        "final year"
    ])



def is_meeting_management_action(text: str) -> bool:
    s = text.lower()
    return any(p in s for p in [
        "organize the meeting",
        "schedule the meeting",
        "conduct the meeting",
        "next meeting",
        "coordination meeting"
    ])

def is_status_only_action(text: str) -> bool:
    s = text.lower()
    return any(p in s for p in [
        "status update",
        "provide an update",
        "keep us posted",
        "inform the team",
        "give an update"
    ])


def is_question_style(sentence: str) -> bool:
    s = sentence.lower().strip()
    return (
        s.startswith("could you")
        or s.startswith("can you")
        or s.startswith("would you")
        or s.endswith("?")
    )


def normalize_pronoun_action(sentence: str) -> str:
    """
    Convert first/second-person action statements into
    neutral, global action descriptions.
    """
    s = sentence.strip()

    replacements = [
        (r"^i\s+will\s+", ""),
        (r"^i\s+ll\s+", ""),
        (r"^i\s+", ""),
        (r"^you\s+will\s+", ""),
        (r"^you\s+", ""),
        (r"^we\s+will\s+", ""),
        (r"^we\s+", ""),
        (r"^he\s+will\s+", ""),
        (r"^she\s+will\s+", ""),
        (r"^they\s+will\s+", ""),
        (r"could you\s+", ""),
        (r"can you\s+", "")
    ]

    s_lower = s.lower()

    for pattern, repl in replacements:
        s_lower = re.sub(pattern, repl, s_lower)

    return s_lower.strip()


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
    "submit", "reach", "conduct", "complete", "finish",
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


OBJECT_KEYWORDS = [
    "report", "document", "documents",
    "submission", "files",
    "test", "tests", "testing",
    "module", "modules",
    "api", "apis",
    "schedule", "list",
    "papers", "question papers"
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
    last_owner = None

    for sent in doc.sents:

        sentence = sent.text.strip()
        deadline =None


        sent_doc =nlp(sentence)

        for ent in sent_doc.ents:
            if ent.label_ == "PERSON":
                last_owner =ent.text


        if last_owner:
            sentence = sentence.replace("I will", f"{last_owner} will") \
                       .replace("i will", f"{last_owner} will") \
                       .replace("I'll", f"{last_owner} will") \
                       .replace("He will", f"{last_owner} will") \
                       .replace("he will", f"{last_owner} will") \
                       .replace("She will", f"{last_owner} will") \
                       .replace("she will", f"{last_owner} will") \
                       .replace("i ll ", f"{last_owner} will")      

        if len(sentence.split()) < 6:
            continue

        if is_excluded(sentence):
            continue

        if is_question_style(sentence):
            continue

        if is_status_only_action(sentence):
            continue

        if is_meeting_management_action(sentence):
            continue

        if deadline and is_academic_year_phrase(deadline):
            deadline = None


        if not has_strong_action_verb(sentence):
            continue

        if not has_concrete_object(sentence):
            continue

        if is_process_only(sentence):
            continue

    




        deadline = extract_deadline(sentence)
        s = sentence.lower()

        has_future = any(m in s for m in FUTURE_MARKERS)
        has_execution = any(v in s for v in EXECUTION_VERBS)

        # --------------------------------------------------------------
        # POLICY-LEVEL ACTIONS (VERY IMPORTANT)
        # --------------------------------------------------------------
        if is_policy_level(sentence) and deadline:
            normalized = normalize_pronoun_action(sentence)
            action_text = normalize_action(normalized)


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
