import re
import spacy

nlp = spacy.load("en_core_web_md")

ACTION_VERBS = [
    "will", "must", "need to", "needs to",
    "has to", "have to", "will be"
]

EXCLUDE_PATTERNS = [
    "we will discuss",
    "there was a discussion",
    "the team agreed",
    "it was discussed",
    "status update",
    "agenda",
    "timeline"
]

DATE_PATTERNS = [
    r"\bby\s+next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
    r"\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
    r"\bby\s+\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
    r"\bby\s+\w+\s+\d{1,2}\b",
    r"\bwithin\s+\d+\s+days?\b",
    r"\b(one|two|three|four)\s+week(s)?\b"
]

def extract_deadline(sentence):
    s = sentence.lower()

    for pattern in DATE_PATTERNS:
        match = re.search(pattern, s)
        if match:
            return match.group()

    doc = nlp(sentence)
    for ent in doc.ents:
        if ent.label_ == "DATE":
            return ent.text

    return None


def extract_actions(text):
    actions = []
    doc = nlp(text)

    for sent in doc.sents:
        sentence = sent.text.strip()
        s_lower = sentence.lower()

        # ❌ Exclude discussions / agenda
        if any(p in s_lower for p in EXCLUDE_PATTERNS):
            continue

        # ❌ Must contain strong action verb
        if not any(v in s_lower for v in ACTION_VERBS):
            continue

        # ❌ Too short → status
        if len(sentence.split()) < 7:
            continue

        # ✅ Allow: named person OR "I will" OR passive assignment
        has_person = any(ent.label_ == "PERSON" for ent in nlp(sentence).ents)
        if not has_person:
            if not any(x in s_lower for x in ["i will", "we will", "will be"]):
                continue

        deadline = extract_deadline(sentence)

        actions.append({
            "action": sentence,
            "deadline": deadline
        })

    return actions
