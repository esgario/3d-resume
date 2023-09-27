import { pipeline, cos_sim } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0";

// Create a pipeline with the feature-extraction and gte-small components
const pipe = await pipeline("feature-extraction", "Supabase/gte-small");

console.log(cos_sim);

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

function getMostSimilarEmbedding(embedding, ref_embeddings, threshold=0.835) {
    let max_sim = -1;
    let max_sim_idx = -1;

    // ref_embeddings is a dictionary
    for (const [idx, ref_embedding] of Object.entries(ref_embeddings)) {
        const sim = cos_sim(embedding, ref_embedding);
        if (sim > max_sim) {
            max_sim = sim;
            max_sim_idx = idx;
        }
    }

    if (max_sim < threshold) {
        return "unknown";
    }

    return max_sim_idx;
}

export { generateEmbedding, getMostSimilarEmbedding };
