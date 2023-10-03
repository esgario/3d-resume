import generate_embeddings
import text_to_speech
import convert_audio
import generate_lipsync


def pipeline():
    generate_embeddings.run()
    text_to_speech.run()
    convert_audio.run()
    generate_lipsync.run()


if __name__ == "__main__":
    pipeline()
