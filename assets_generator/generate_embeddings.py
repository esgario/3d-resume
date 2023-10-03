import json
from collections import defaultdict
from sentence_transformers import SentenceTransformer
from commons import get_texts, get_logger, workdir
from settings import EMBEDDINGS_PATH

logger = get_logger(__name__)

PRECISION = 6


def get_model():
    logger.info("Loading model")
    return SentenceTransformer("Supabase/gte-small")


@workdir
def run():
    model = get_model()
    embeddings = defaultdict(dict)
    for lang, key, _, questions in get_texts():
        if questions is None:
            continue

        embeddings[lang][key] = []
        for text in questions:
            emb = model.encode(text, normalize_embeddings=True).tolist()
            round_emb = [round(x, PRECISION) for x in emb]
            embeddings[lang][key].append(round_emb)

    with open(EMBEDDINGS_PATH, "w") as file:
        json.dump(embeddings, file)


if __name__ == "__main__":
    run()
