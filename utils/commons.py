import os
import json
import logging
from contextlib import contextmanager

ASSETS_PATH = "../src/assets"
AUDIOS_PATH = "../src/assets/audios"
REFERENCE_PATH = "../src/assets/audios_reference.json"


@contextmanager
def workdir():
    """Change dir to the current file's directory using context manager"""
    original_dir = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    yield
    os.chdir(original_dir)


def get_audios():
    """Get audios from reference file"""
    with open(REFERENCE_PATH, "r") as file:
        audios_reference = json.load(file)

    for lang, content in audios_reference.items():
        for audio_name, texts in content.items():
            yield lang, audio_name, texts["answers"], texts["questions"]


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
