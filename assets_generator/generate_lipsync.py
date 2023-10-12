"""Generate lipsync data using rhubarb-lip-sync"""
import os
import json
import subprocess
from commons import (
    get_texts,
    get_logger,
    workdir,
    make_audio_path,
    check_already_processed,
)

logger = get_logger(__name__)

RHUBARB_VERSION = "1.13.0"
RHUBARB_FILE = f"Rhubarb-Lip-Sync-{RHUBARB_VERSION}-Linux"


def _download_rhubarb():
    """Download rhubarb and unzip it"""
    if os.path.exists(RHUBARB_FILE):
        logger.info("%s already exists, skipping download" % RHUBARB_FILE)
        return

    base_url = "https://github.com/DanielSWolf/rhubarb-lip-sync"
    url = f"{base_url}/releases/download/v{RHUBARB_VERSION}/{RHUBARB_FILE}.zip"

    subprocess.run(["wget", url], check=True)
    subprocess.run(["unzip", RHUBARB_FILE + ".zip"], check=True)


def _improve_mouth_pauses(data):
    """Improve mouth pauses by splitting long pauses into smaller ones"""
    max_movement_time = 0.5
    new_mouth_cues = []
    for cue in data["mouthCues"]:
        new_cue = None
        if (cue["end"] - cue["start"]) > max_movement_time:
            new_cue_end = cue["end"]
            cue["end"] = cue["start"] + max_movement_time
            new_cue = {"start": cue["end"], "end": new_cue_end, "value": "X"}

        new_mouth_cues.append(cue)
        if new_cue is not None:
            new_mouth_cues.append(new_cue)
    data["mouthCues"] = new_mouth_cues
    return data


def _generate_lipsync():
    """Generate lipsync data using rhubarb"""
    for lang, key, answers, _ in get_texts():
        for i, text in enumerate(answers):
            audio_path = make_audio_path(lang, key, i, "ogg")
            json_path = make_audio_path(lang, key, i, "json")

            # if check_already_processed(json_path, text):
            #     logger.info("%s already exists, skipping" % json_path)
            #     continue

            rhubarb_command = [
                f"{RHUBARB_FILE}/rhubarb",
                "-f",
                "json",
                audio_path,
                "-o",
                json_path,
            ]

            logger.info(
                "Generating lipsync data for %s to %s" % (audio_path, json_path)
            )

            rhubarb_process = subprocess.Popen(
                rhubarb_command,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
            )
            rhubarb_process.wait()

            with open(json_path, "r", encoding="utf-8") as file:
                data = json.load(file)
                data = _improve_mouth_pauses(data)
                data["metadata"]["text"] = text
                data["metadata"]["soundFile"] = json_path

            with open(json_path, "w", encoding="utf-8") as file:
                json.dump(data, file, indent=4)


@workdir
def run():
    logger.info("Downloading rhubarb")
    _download_rhubarb()

    logger.info("Generating lipsync data")
    _generate_lipsync()


if __name__ == "__main__":
    run()
