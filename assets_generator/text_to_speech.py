import os
import dotenv
from commons import (
    workdir,
    get_texts,
    get_logger,
    make_audio_path,
    check_already_processed,
)
from elevenlabs import set_api_key, generate, save, voices, Voice, VoiceSettings

dotenv.load_dotenv()
logger = get_logger(__name__)

API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

set_api_key(API_KEY)


def get_voice_id(name: str) -> str:
    for voice in voices():
        if voice.name == name:
            return voice.voice_id
    raise ValueError(f"Voice {name} not found")


voices_by_lang = {
    "pt": Voice(
        voice_id=get_voice_id("guilherme-pt"),
        settings=VoiceSettings(
            stability=0.75, similarity_boost=0.1, style=0.0, use_speaker_boost=True
        ),
    ),
    "en": Voice(
        voice_id=get_voice_id("guilherme-en"),
        settings=VoiceSettings(
            stability=0.75, similarity_boost=0.1, style=0.0, use_speaker_boost=True
        ),
    ),
}


@workdir
def run():
    for lang, key, answers, _ in get_texts():
        for i, text in enumerate(answers):
            logger.info(f"Processing {key} {lang}-{i}")

            audio_path = make_audio_path(lang, key, i, "mp3")
            json_path = make_audio_path(lang, key, i, "json")

            if check_already_processed(json_path, text) or os.path.exists(audio_path):
                logger.info("Already processed, skipping")
                continue

            audio = generate(
                text=text, voice=voices_by_lang[lang], model="eleven_multilingual_v2"
            )
            save(audio, audio_path)


if __name__ == "__main__":
    run()
