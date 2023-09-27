import os
from pydub import AudioSegment
from commons import workdir, get_audios, AUDIOS_PATH

with workdir():
    for lang, audio_name, answers, _ in get_audios():
        for i in range(len(answers)):
            src_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.mp3"
            dst_path = f"{AUDIOS_PATH}/{audio_name}_{lang}-{i}.ogg"
            print("Converting", src_path, "to", dst_path)

            # Convert mp3 to ogg
            sound = AudioSegment.from_file(src_path, format="mp3")
            sound.export(dst_path, format="ogg")

            # Remove mp3 file
            os.remove(src_path)
