import json
import logging


def get_audios(reference_path):
    """Get audios from reference file"""
    with open(reference_path, "r") as file:
        audios_reference = json.load(file)

    for audio_name, texts_by_language in audios_reference.items():
        for lang, texts in texts_by_language.items():
            for i, text in enumerate(texts):
                yield audio_name, lang, i, text


def get_logger(name):
    """Create a new logger"""
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger
