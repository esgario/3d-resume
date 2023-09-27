import os
import json
from collections import defaultdict
from sentence_transformers import SentenceTransformer
from commons import get_audios, get_logger, workdir, ASSETS_PATH

logger = get_logger(__name__)

model = SentenceTransformer("Supabase/gte-small")

with workdir():
    embeddings = defaultdict(dict)
    for lang, audio_name, _, questions in get_audios():
        if questions is None:
            continue

        text = ". ".join(questions)
        embeddings[lang][audio_name] = (
            model.encode(text, normalize_embeddings=True).tolist()
        )

    with open(os.path.join(ASSETS_PATH, "embeddings.json"), "w") as file:
        json.dump(embeddings, file, indent=4)
