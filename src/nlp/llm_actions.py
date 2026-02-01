import subprocess
import tempfile
import os
import re   # ✅ FIX 1: correct import

OLLAMA_PATH = r"C:\Users\yashw\AppData\Local\Programs\Ollama\ollama.exe"
OLLAMA_MODEL = "phi3"


def llm_extract_actions(text: str):

    if not text or len(text.strip()) < 20:
        print("⚠️ LLM received empty or too-short input")
        return []

    print("🔥 LLM ACTION EXTRACTOR CALLED 🔥")

    # --------------------------------------------------
    # POST-FILTER: strict validation
    # --------------------------------------------------
    def is_valid_action(action, owner, deadline):
        a = action.lower()
        o = owner.lower()

        # ❌ meeting facilitation
        if any(x in a for x in [
            "let us begin", "let's begin", "start the meeting"
        ]):
            return False

        # ❌ pure schedules ONLY (tightened)
        if "is scheduled" in a and not any(v in a for v in ["will", "must", "prepare", "submit", "complete"]):
            return False

        # ❌ pronoun owners
        if o in {"he", "she", "they", "someone"}:
            return False

        # ❌ vague placeholders
        if "this task" in a or "that task" in a:
            return False

        return True

    # --------------------------------------------------
    # PROMPT
    # --------------------------------------------------
    prompt = f"""
You are a strict action-item validator.

TASK:
From the input text, OUTPUT ONLY action items that are EXPLICITLY stated.
Do NOT summarize.
Do NOT infer.
Do NOT add urgency.
Do NOT add headers.
Do NOT rephrase into abstract statements.

RULES (VERY IMPORTANT):
- The action must be clearly stated as a task in the text
- The action must be executable (submit, prepare, complete, finalize, repair, organize, share)
- Do NOT invent words like "ASAP", "immediate", "important"
- Do NOT output vague or passive phrases (e.g., "completion of", "work on", "progress on")
- If a deadline is not explicitly mentioned, write null
- If the sentence does not clearly assign responsibility, discard it
- Do NOT output formatting lines, titles, or separators

OUTPUT FORMAT (STRICT):
ONE action per line.
NO numbering.
NO bullets.
NO headings.

FORMAT:
ACTION | OWNER | DEADLINE

EXAMPLES (VALID):
Finalize question papers | Dr. Anil | October 10, 2026
Submit activity reports | All departments | April 12, 2026

EXAMPLES (INVALID – DO NOT OUTPUT):
Completion of dashboard & settings
Start final testing ASAP
ACTION — DEADLINE

INPUT TEXT:
{text}
""".strip()

    # --------------------------------------------------
    # 🔥 WINDOWS-SAFE PROMPT FILE
    # --------------------------------------------------
    with tempfile.NamedTemporaryFile(
        mode="w",
        delete=False,
        encoding="utf-8",
        suffix=".txt"
    ) as f:
        f.write(prompt)
        prompt_file = f.name

    try:
        process = subprocess.run(
            [OLLAMA_PATH, "run", OLLAMA_MODEL],
            input=prompt,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="ignore",
            timeout=60  # ⏱ unchanged
        )

        raw = ((process.stdout or "") + "\n" + (process.stderr or "")).strip()


        actions = []

        for line in raw.splitlines():
            if "|" not in line:
                continue

            parts = [p.strip() for p in re.split(r"\s*\|\s*", line, maxsplit=2)]
            if len(parts) != 3:
                continue

            action, owner, deadline = parts

            if not is_valid_action(action, owner, deadline):
                continue

            actions.append({
                "action": action,
                "owner": owner,
                "deadline": None if deadline.lower() == "null" else deadline
            })

        if not actions:
            print("ℹ️ No valid actions extracted by LLM")

        return actions
    


    except subprocess.TimeoutExpired:
        print("⏱️ LLM timed out — using rule-based actions")
        return None
    except Exception as e:
        print("⚠️ LLM action extraction failed:", e)
        return None

    finally:
        os.remove(prompt_file)
