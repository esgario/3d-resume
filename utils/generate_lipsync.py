"""Generate lipsync data using rhubarb-lip-sync"""
import os
import json
import subprocess
from contextlib import contextmanager
from commons import get_audios, get_logger

logger = get_logger(__name__)

RHUBARB_VERSION = "1.13.0"
RHUBARB_FILE = f"Rhubarb-Lip-Sync-{RHUBARB_VERSION}-Linux"

AUDIOS_PATH = "../src/assets/audios"
REFERENCE_PATH = "../src/assets/audios_reference.json"


@contextmanager
def workdir():
    """Change dir to the current file's directory using context manager"""
    original_dir = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    yield
    os.chdir(original_dir)


def download_rhubarb():
    """Download rhubarb and unzip it"""
    if os.path.exists(RHUBARB_FILE):
        logger.info("%s already exists, skipping download" % RHUBARB_FILE)
        return

    base_url = "https://github.com/DanielSWolf/rhubarb-lip-sync"
    url = f"{base_url}/releases/download/v{RHUBARB_VERSION}/{RHUBARB_FILE}.zip"

    subprocess.run(["wget", url], check=True)
    subprocess.run(["unzip", RHUBARB_FILE + ".zip"], check=True)


def run_rhubarb():
    """Generate lipsync data using rhubarb"""

    for audio_name, lang, i, text in get_audios(REFERENCE_PATH):
        audio_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.ogg"
        json_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.json"

        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as file:
                data = json.load(file)
            if data["metadata"].get("text", "") == text:
                logger.info("%s already exists, skipping" % json_path)
                continue

        rhubarb_command = [
            f"{RHUBARB_FILE}/rhubarb",
            "-f",
            "json",
            audio_path,
            "-o",
            json_path,
        ]

        logger.info("Generating lipsync data for %s to %s" % (audio_path, json_path))

        rhubarb_process = subprocess.Popen(
            rhubarb_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
        )
        rhubarb_process.wait()

        with open(json_path, "r", encoding="utf-8") as file:
            data = json.load(file)
            data["metadata"]["text"] = text
            data["metadata"]["soundFile"] = json_path

        with open(json_path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=4)


with workdir():
    download_rhubarb()
    run_rhubarb()
