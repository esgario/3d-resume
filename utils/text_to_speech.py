import os
import json
import dotenv
from tqdm import tqdm
from elevenlabs import set_api_key, generate, save

dotenv.load_dotenv()

REFERENCE_PATH = "./src/assets/audios_reference.json"
API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

set_api_key(API_KEY)

with open(REFERENCE_PATH, "r") as file:
    audios_reference = json.load(file)

for audio_name, texts_by_language in tqdm(audios_reference.items()):
    print("Processing", audio_name)
    for lang, texts in texts_by_language.items():
        for i, text in enumerate(texts):
            print(f"\t{lang}-{i}: {text}")
            audio = generate(text=text, voice="Josh", model="eleven_multilingual_v2")
            save(audio, f"./src/assets/audios/{audio_name}_{lang}-{i}.mp3")
