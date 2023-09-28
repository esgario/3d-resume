import { pipeline, cos_sim } from "@xenova/transformers";

// Create a pipeline with the feature-extraction and gte-small components
const pipe = await pipeline("feature-extraction", "Supabase/gte-small");

async function generateEmbedding(text) {
    // Generate the embedding from text
    const output = await pipe(text, {
        pooling: "mean",
        normalize: true,
    });

    // Extract the embedding output
    const embedding = Array.from(output.data);

    return embedding;
}

function getMostSimilarEmbedding(embedding, ref_embeddings, threshold = 0.93) {
    let max_sim = -1;
    let max_sim_idx = -1;

    // ref_embeddings is a dictionary
    for (const [idx, emb_array] of Object.entries(ref_embeddings)) {
        for (const emb of emb_array) {
            const sim = cos_sim(embedding, emb);
            if (sim > max_sim) {
                max_sim = sim;
                max_sim_idx = idx;
            }
        }
    }

    console.log(max_sim);

    if (max_sim < threshold) {
        return "unknown";
    }

    return max_sim_idx;
}

export { generateEmbedding, getMostSimilarEmbedding };
