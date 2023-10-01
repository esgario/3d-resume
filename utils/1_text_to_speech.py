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

with workdir():
    for lang, key, answers, questions in get_texts():
        logger.info(f"Processing {key}")
        for i, text in enumerate(answers):
            logger.info(f"\t{lang}-{i}: {text}")

            audio_path = make_audio_path(lang, key, i, "mp3")
            json_path = make_audio_path(lang, key, i, "json")

            if check_already_processed(json_path, text):
                logger.info("\t\tAlready processed, skipping")
                continue

            audio = generate(text=text, voice="Josh", model="eleven_multilingual_v2")
            save(audio, audio_path)
