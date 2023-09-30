from collections import defaultdict
from sentence_transformers import SentenceTransformer, util
from commons import get_texts, workdir

model_name = "Supabase/gte-small"
model = SentenceTransformer(model_name)


def get_embeddings():
    """Get embeddings"""
    with workdir():
        embeddings = defaultdict(dict)
        for lang, key, _, questions in get_texts():
            if questions is None:
                continue
            embeddings[lang][key] = []
            for text in questions:
                embeddings[lang][key].append(model.encode(text, convert_to_tensor=True))
        return embeddings


embeddings = get_embeddings()

# Get language by user input
language = input("Enter language [pt, en]: ")

# Get user input texts in a while loop
while True:
    # Get user input
    text = input("Enter text: ")

    # If user input is empty, break the loop
    if text == "":
        break

    # Get embeddings for the user input
    embeddings_text = model.encode(text, convert_to_tensor=True)

    # Get the cosine similarity between the user input and the embeddings
    output = ""
    for key, emb_arr in embeddings[language].items():
        output += f"\n{key}:\n"
        for emb in emb_arr:
            sim = util.cos_sim(embeddings_text, emb)[0][0]
            output += f"{sim:.4f} "
        output += "\n"

    # Get the best sentence pair
    print(output)
