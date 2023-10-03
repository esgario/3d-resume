import os
import dotenv
from commons import (
    workdir,
    get_texts,
    get_logger,
    make_audio_path,
    check_already_processed,
)
from elevenlabs import set_api_key, generate, save

dotenv.load_dotenv()
logger = get_logger(__name__)

API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

set_api_key(API_KEY)


@workdir
def run():
    for lang, key, answers, _ in get_texts():
        for i, text in enumerate(answers):
            logger.info(f"Processing {key} {lang}-{i}")

            audio_path = make_audio_path(lang, key, i, "mp3")
            json_path = make_audio_path(lang, key, i, "json")

            if check_already_processed(json_path, text):
                logger.info("Already processed, skipping")
                continue

            audio = generate(text=text, voice="Josh", model="eleven_multilingual_v2")
            save(audio, audio_path)


if __name__ == "__main__":
    run()
