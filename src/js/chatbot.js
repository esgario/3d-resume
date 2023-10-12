import { config } from "./config.js";
import { playAudio } from "./avatar.js";
import { pipeline, cos_sim } from "@xenova/transformers";

// EMBEDDING GENERATION
// ----------------------------------------------------------------------------------

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

// INPUT TEXT
// ----------------------------------------------------------------------------------

const inputText = document.getElementById("inputText");
let embeddings,
    lang = "en",
    audioIsPlaying = false;

async function askQuestion(question) {
    if (question == "") {
        inputText.disabled = false;
        return false;
    }

    if (audioIsPlaying == true) {
        return false;
    }

    lang = getCurrentLanguage();
    try {
        inputText.disabled = true;
        inputText.value = question;

        const embedding = await generateEmbedding(question);
        const audioKey = getMostSimilarEmbedding(embedding, embeddings[lang]);
        const audioMap = `${audioKey}_${lang}-0`;
        const audioFile = audioMap;

        const lastRecogState = recognitionState;
        let callback = () => {
            if (lastRecogState == "active") {
                recognition.start();
            }
            inputText.disabled = false;
            audioIsPlaying = false;
        };
        recognition.stop();
        audioIsPlaying = true;
        playAudio(audioFile, callback);
        setTimeout(() => {
            inputText.value = "";
        }, 1500);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function setupInputText() {
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
            askQuestion(value);
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

function setupChangeLanguage() {
    let langs = ["pt", "en"];
    for (let i = 0; i < langs.length; i++) {
        let lang = langs[i];
        let langDiv = document.getElementById(lang + "-lang");
        langDiv.onclick = function () {
            changeLang(lang, this);
        };
    }
}

function getCurrentLanguage() {
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
        recognition.stop();
        if (lang == "pt") {
            recognition.lang = "pt-BR";
        } else {
            recognition.lang = "en-US";
        }
    }
}

function setupSpeechRecognition() {
    if ("webkitSpeechRecognition" in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;
        recognition.interimResults = true;
        recognition.addEventListener("result", (event) => {
            let text = "";
            for (let i = 0; i < event.results.length; i++) {
                if (!event.results[i].isFinal) {
                    text += event.results[i][0].transcript;
                }
            }

            if (text == "") {
                text = event.results[event.results.length - 1][0].transcript;
                askQuestion(text);
            }
            inputText.value = text;
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
            if (recognitionState == "active") {
                recognition.stop();
            } else {
                recognition.start();
            }
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

// SUGGESTIONS MENU
// ----------------------------------------------------------------------------------
function setupSuggestionsMenu() {
    fetch(config.TEXTS_PATH)
        .then((res) => res.json())
        .then((data) => {
            for (const [key, value] of Object.entries(data[lang])) {
                if (value["questions"] == null) {
                    continue;
                }
                console.log(value["questions"][0]);
                const button = document.createElement("button");
                button.classList.add("btn", "btn-secondary", "sentence-button", "mb-2");
                button.textContent = value["questions"][0];

                button.onclick = () => {
                    askQuestion(value["questions"][0]);
                };

                const suggestionsMenu = document.getElementsByClassName("suggestions-menu-body");
                suggestionsMenu[0].appendChild(button);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

// ----------------------------------------------------------------------------------

export function setupChatbot() {
    setupSuggestionsMenu();
    setupInputText();
    setupChangeLanguage();
    setupSpeechRecognition();
}
