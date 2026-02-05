import os
import pdfplumber
from docx import Document

def load_mom_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".docx":
        return _load_docx(file_path)
    elif ext == ".pdf":
        return _load_pdf(file_path)
    elif ext == ".txt":
        return _load_txt(file_path)
    else:
        raise ValueError("Unsupported MoM file format")

def _load_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join(p.text.strip() for p in doc.paragraphs if p.text.strip())

def _load_pdf(path: str) -> str:
    text = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)

def _load_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()
