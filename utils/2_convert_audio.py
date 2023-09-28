import os
from pydub import AudioSegment
from commons import workdir, get_texts, make_audio_path

with workdir():
    for lang, key, answers, _ in get_texts():
        for i in range(len(answers)):
            src_path = make_audio_path(lang, key, i, "mp3")
            dst_path = make_audio_path(lang, key, i, "ogg")
            print("Converting", src_path, "to", dst_path)

            # Convert mp3 to ogg
            sound = AudioSegment.from_file(src_path, format="mp3")
            sound.export(dst_path, format="ogg")

            # Remove mp3 file
            os.remove(src_path)
