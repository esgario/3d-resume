import json

def get_audios(reference_path):
    with open(reference_path, "r") as file:
        audios_reference = json.load(file)

    for audio_name, texts_by_language in audios_reference.items():
        for lang, texts in texts_by_language.items():
            for i, text in enumerate(texts):
                yield audio_name, lang, i, text