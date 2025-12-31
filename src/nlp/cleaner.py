import re

def clean_text(text):
    text = text.lower()

    text = re.sub(r'\[.*?\]|\(.*?\)', ' ', text)

    text = re.sub(r'\b(uh+|um+|umm+|ah+|like|you know|yeah+)\b', ' ', text)

    text = re.sub(r'(.)\1{2,}', r'\1', text)

    text = re.sub(r'\S+@\S+', ' ', text)

    text = re.sub(r'\+?\d[\d\s\-]{8,}', ' ', text)

    text = re.sub(r'[^a-z0-9\s\.\,]', ' ', text)

    text = re.sub(r'\s+', ' ', text).strip()

    return text
