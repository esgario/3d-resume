import { config } from "./config.js";
import { playAudio } from "./avatar.js";
import { pipeline, cos_sim } from "@xenova/transformers";

// EMBEDDING GENERATION
// ----------------------------------------------------------------------------------

// Create a pipeline with the feature-extraction and gte-small components
const pipe = await pipeline("feature-extraction", "Supabase/gte-small");

export async function generateEmbedding(text) {
    // Generate the embedding from text
    const output = await pipe(text, {
        pooling: "mean",
        normalize: true,
    });

    // Extract the embedding output
    const embedding = Array.from(output.data);

    return embedding;
}

export function getMostSimilarEmbedding(embedding, ref_embeddings, threshold = 0.93) {
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

// INPUT TEXT
// ----------------------------------------------------------------------------------

const inputText = document.getElementById("inputText");
let embeddings,
    lang = "en";

async function askQuestion(question) {
    lang = getCurrentLanguage();
    try {
        const embedding = await generateEmbedding(question);
        const audioKey = getMostSimilarEmbedding(embedding, embeddings[lang]);
        const audioMap = `${audioKey}_${lang}-0`;
        const audioFile = audioMap;
        playAudio(audioFile);
        return true;
    } catch (err) {
        return false;
    }
}

export function setupInputText() {
    fetch(config.EMBEDDINGS_PATH)
        .then((res) => res.json())
        .then((data) => {
            embeddings = data;
        })
        .catch((err) => {
            console.error(err);
        });

    inputText.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const value = event.target.value;

            askQuestion(value)
                .then((success) => {
                    if (success) {
                        event.target.value = "";
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}

// LANGUAGE
// ----------------------------------------------------------------------------------

function changeLang(language, el) {
    let container = document.querySelector(".chooseLang").classList;
    el = el.classList;
    if (container.contains("open")) {
        container.remove("open");
        if (!el.contains("chosen")) {
            document.querySelector(".chooseLang .chosen").classList.remove("chosen");
            el.add("chosen");
            console.log(language + " chosen");
            setRecognitionLang(language);
        }
        return;
    }
    container.add("open");
}

export function setupChangeLanguage() {
    let langs = ["pt", "en"];
    for (let i = 0; i < langs.length; i++) {
        let lang = langs[i];
        let langDiv = document.getElementById(lang + "-lang");
        langDiv.onclick = function () {
            changeLang(lang, this);
        };
    }
}

export function getCurrentLanguage() {
    const langDiv = document.getElementById("pt-lang");
    if (langDiv.classList.contains("chosen")) {
        return "pt";
    } else {
        return "en";
    }
}

// SPEECH RECOGNITION
// ----------------------------------------------------------------------------------
let recognition;
let recognitionState = "inactive";

function setRecognitionLang(lang) {
    if (recognition) {
        let lastState = recognitionState;
        recognition.abort();
        if (lang == "pt") {
            setTimeout(() => {
                recognition.lang = "pt-BR";
                if (lastState == "active") {
                    recognition.start();
                }
            }, 1000);
        } else {
            setTimeout(() => {
                recognition.lang = "en-US";
                if (lastState == "active") {
                    recognition.start();
                }
            }, 1000);
        }
    }
}

export function setupSpeechRecognition() {
    if ("webkitSpeechRecognition" in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;
        recognition.interimResults = true;
        recognition.addEventListener("result", (event) => {
            const results = event.results[event.results.length - 1];
            inputText.value = results[0].transcript;

            if (results.isFinal) {
                askQuestion(results[0].transcript)
                    .then((success) => {
                        if (success) {
                            setTimeout(() => {
                                inputText.value = "";
                            }, 1500);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        });

        recognition.addEventListener("start", () => {
            const speechIcon = document.getElementById("speechIcon");
            speechIcon.classList.remove("bi-mic");
            speechIcon.classList.add("bi-mic-fill");
            recognitionState = "active";
        });

        recognition.addEventListener("end", () => {
            const speechIcon = document.getElementById("speechIcon");
            speechIcon.classList.remove("bi-mic-fill");
            speechIcon.classList.add("bi-mic");
            recognitionState = "inactive";
        });

        // setup speechButton
        const speechButton = document.getElementById("speechButton");
        speechButton.onclick = () => {
            console.log("speechButton clicked");
            recognition.start();
        };
    } else {
        console.log("Speech recognition not supported");
        recognition = null;

        const speechIcon = document.getElementById("speechIcon");
        speechIcon.classList.remove("bi-mic");
        speechIcon.classList.add("bi-mic-mute");

        const speechButton = document.getElementById("speechButton");
        speechButton.disabled = true;
    }
}
