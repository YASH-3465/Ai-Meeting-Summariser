
from transformers import MarianMTModel, MarianTokenizer

class TextTranslator:
    def __init__(self):
        self.models = {}

    def translate(self, text, target_lang):
        model_name = f"Helsinki-NLP/opus-mt-en-{target_lang}"

        if model_name not in self.models:
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            self.models[model_name] = (tokenizer, model)

        tokenizer, model = self.models[model_name]

        tokens = tokenizer(text, return_tensors="pt", truncation=True)
        translated = model.generate(**tokens)
        return tokenizer.decode(translated[0], skip_special_tokens=True)
