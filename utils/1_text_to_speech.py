import os
import dotenv
from commons import workdir, get_audios, REFERENCE_PATH, AUDIOS_PATH
from elevenlabs import set_api_key, generate, save

dotenv.load_dotenv()

API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

set_api_key(API_KEY)

with workdir():
    for lang, audio_name, answers, questions in get_audios(REFERENCE_PATH):
        print("Processing", audio_name)
        for i, text in enumerate(answers):
            print(f"\t{lang}-{i}: {text}")
            audio = generate(text=text, voice="Josh", model="eleven_multilingual_v2")
            save(audio, f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.mp3")
