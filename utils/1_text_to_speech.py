import os
import dotenv
from commons import workdir, get_texts, make_audio_path
from elevenlabs import set_api_key, generate, save

dotenv.load_dotenv()

API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

set_api_key(API_KEY)

with workdir():
    for lang, key, answers, questions in get_texts():
        print("Processing", key)
        for i, text in enumerate(answers):
            print(f"\t{lang}-{i}: {text}")
            audio = generate(text=text, voice="Josh", model="eleven_multilingual_v2")
            audio_path = make_audio_path(lang, key, i, "mp3")
            save(audio, audio_path)
