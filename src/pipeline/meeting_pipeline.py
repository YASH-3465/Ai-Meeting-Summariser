from src.media.extractor import extract_audio
from src.speech.whisper_engine import WhisperEngine
from src.nlp.cleaner import clean_text
from src.nlp.summarizer import MeetingSummariser
from src.nlp.actions import extract_actions
from src.notification.dispatcher import dispatch
from src.nlp.llm_actions import llm_extract_actions
from src.nlp.action_candidates import extract_action_candidates
import re



USE_LLM_ACTION_EXTRACTOR = False

class MeetingPipeline:

    def build_llm_candidate_text(self,cleaned_text: str) -> str:
        """
        Build a compact, high-signal text for LLM action refinement.
        Uses BOTH rule-based actions and candidate sentences.
        """

    # 1️⃣ Rule-based extraction (FAST, complete)
        rule_actions = extract_actions(cleaned_text)

        rule_lines = []
        for a in rule_actions:
            line = a["action"]
            if a.get("deadline"):
                line += f" by {a['deadline']}"
            rule_lines.append(line)

    # 2️⃣ Regex-based candidate sentences (FAST filter)
        candidate_text = extract_action_candidates(cleaned_text)
        candidate_sentences = re.split(r'(?<=[.!?])\s+', candidate_text)

    # 3️⃣ Merge + deduplicate
        combined = []
        seen = set()

        for line in rule_lines + candidate_sentences:
            l = line.strip()
            if not l:
                continue

            key = l.lower()
            if key in seen:
                continue

            seen.add(key)
            combined.append(l)

    # 4️⃣ HARD LIMIT (speed control)
        combined = combined[:8]   # 🔥 THIS keeps LLM fast

        return ". ".join(combined)

    def __init__(self):
        self.whisper = WhisperEngine()
        self.summariser = MeetingSummariser()

    def run(self, media_path, notify=False, translate=False):
        audio_path = extract_audio(media_path)

        # ✅ CORRECT whisper usage (matches WhisperEngine)
        text = self.whisper.transcribe(audio_path, translate=translate)

        cleaned_text = clean_text(text)

        raw_summary = self.summariser.summarize(cleaned_text)
        summary = "Below is a concise summary of the meeting discussion: " + raw_summary

        actions = []

        # ✅ Action extraction (English summaries only)
        try:
    # 1️⃣ ALWAYS run rule-based first (fast + stable)
            actions = extract_actions(cleaned_text)


            if USE_LLM_ACTION_EXTRACTOR:

    # 2️⃣ Build compact candidate text for LLM
                llm_input = self.build_llm_candidate_text(cleaned_text)

    # 3️⃣ Try LLM only if we have meaningful input
                if llm_input.strip():
                    llm_actions = llm_extract_actions(llm_input)

        # 4️⃣ Override ONLY if LLM gives valid actions
                    if llm_actions:
                        actions = llm_actions

        except Exception as e:
            print("⚠️ Action extraction failed:", e)

        dispatch(
            summary=summary,
            actions=actions,
            notify=notify
        )

        return {
            "summary": summary,
            "actions": actions
        }

    def run_from_text(self, text, notify=False, translate=False):
        cleaned_text = clean_text(text)

        raw_summary = self.summariser.summarize(cleaned_text)
        summary = "Below is a concise summary of the meeting discussion: " + raw_summary

        try:
            actions = extract_actions(cleaned_text)
        except Exception as e:
            print("⚠️ Action extraction failed:", e)
            actions = []

        dispatch(
            summary=summary,
            actions=actions,
            notify=notify
        )

        return {
            "summary": summary,
            "actions": actions
        }