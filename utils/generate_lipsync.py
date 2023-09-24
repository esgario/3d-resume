"""Generate lipsync data using rhubarb-lip-sync"""
import os
import json
import subprocess
from contextlib import contextmanager
from commons import get_audios


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
        print(f"{RHUBARB_FILE} already exists, skipping download")
        return

    base_url = "https://github.com/DanielSWolf/rhubarb-lip-sync"
    url = f"{base_url}/releases/download/v{RHUBARB_VERSION}/{RHUBARB_FILE}.zip"

    subprocess.run(["wget", url], check=True)
    subprocess.run(["unzip", RHUBARB_FILE + ".zip"], check=True)


def run_rhubarb():
    """Generate lipsync data using rhubarb"""

    for audio_name, lang, i, _ in get_audios(REFERENCE_PATH):
        audio_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.ogg"
        json_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.json"

        if os.path.exists(json_path):
            print(f"{json_path} already exists, skipping")
            continue

        rhubarb_command = [
            f"{RHUBARB_FILE}/rhubarb",
            "-f",
            "json",
            audio_path,
            "-o",
            json_path,
        ]

        print("Generating lipsync data for", audio_path, "to", json_path)

        rhubarb_process = subprocess.Popen(
            rhubarb_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
        )

        rhubarb_process.wait()


with workdir():
    download_rhubarb()
    run_rhubarb()
