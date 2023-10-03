import os
import json
import logging
from settings import AUDIOS_PATH, TEXTS_PATH


def workdir(func):
    """Decorator to change dir to the current file's directory"""

    def wrapper(*args, **kwargs):
        original_dir = os.getcwd()
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        result = func(*args, **kwargs)
        os.chdir(original_dir)
        return result

    return wrapper


def get_texts():
    """Get texts json file"""
    with open(TEXTS_PATH, "r") as file:
        data = json.load(file)

    for lang, content in data.items():
        for key, texts in content.items():
            yield lang, key, texts["answers"], texts["questions"]


def get_logger(name):
    """Create a new logger"""
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    handler = logging.StreamHandler()
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "%(module)s :: %(levelname)s :: %(asctime)s :: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger


def make_audio_path(lang, key, i, fmt):
    """Make audio path"""
    return f"{AUDIOS_PATH}/{key}_{lang}-{i}.{fmt}"


def check_already_processed(json_path: str, text: str):
    """Check if audios are already processed"""
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        if data["metadata"].get("text", "") == text:
            return True
    return False
