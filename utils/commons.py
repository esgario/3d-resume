import os
import json
import logging
from contextlib import contextmanager

ASSETS_PATH = "../src/assets"
AUDIOS_PATH = "../src/assets/audios"
TEXTS_PATH = "../src/assets/texts.json"
EMBEDDINGS_PATH = "../src/assets/embeddings.json"


@contextmanager
def workdir():
    """Change dir to the current file's directory using context manager"""
    original_dir = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    yield
    os.chdir(original_dir)


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
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger


def make_audio_path(lang, key, i, fmt):
    """Make audio path"""
    return f"{AUDIOS_PATH}/{key}_{lang}-{i}.{fmt}"