import os
from pydub import AudioSegment
from commons import get_audios

for audio_name, lang, i, _ in get_audios("./src/assets/audios_reference.json"):
    src_path = f"./src/assets/audios/{audio_name}_{lang}-{i}.mp3"
    dst_path = f"./src/assets/audios/{audio_name}_{lang}-{i}.ogg"
    print("Converting", src_path, "to", dst_path)

    # Convert mp3 to ogg
    sound = AudioSegment.from_file(src_path, format="mp3")
    sound.export(dst_path, format="ogg")

    # Remove mp3 file
    os.remove(src_path)
