import * as THREE from "three";
import { config } from "./config.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { addAvatar, updateAvatar, playAudio } from "./avatar.js";
import { generateEmbedding, getMostSimilarEmbedding } from "./text_embedding.js";
import Stats from "stats.js";

let scene, camera, renderer, controls, clock, embeddings, lang;
let controlsActive = false;

const stats = new Stats();
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

/**
 * Initializes the scene, camera, renderer, and controls.
 * Adds lights and the avatar to the scene.
 * Sets up keyboard controls.
 * Starts the animation loop.
 * @returns {void}
 */
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(50, 200, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.addEventListener("start", () => (controlsActive = true));
    controls.addEventListener("end", () => (controlsActive = false));

    window.addEventListener("resize", onResize, false);

    fetch(config.EMBEDDINGS_PATH)
        .then((res) => res.json())
        .then((data) => {
            embeddings = data;
        })
        .catch((err) => {
            console.error(err);
        });

    lang = "en";
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupInspector() {
    window.scene = scene;
    window.THREE = THREE;
}

/**
 * Adds a hemisphere light and a point light to the scene.
 * @param {THREE.Scene} scene - The scene to add the lights to.
 */
function addLights(scene) {
    // Add hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.05);
    scene.add(hemiLight);

    // Add point light
    const plWhite = new THREE.PointLight(0xeec9cc, 20);
    plWhite.position.set(1, 2, 3);
    scene.add(plWhite);

    const plPurple = new THREE.PointLight(0x8a2be2, 80);
    plPurple.position.set(2.5, 3, -3);
    scene.add(plPurple);

    const plBlue = new THREE.PointLight(0x0000ff, 80);
    plBlue.position.set(-2.5, 3, -3);
    scene.add(plBlue);
}

function getCurrentLanguage() {
    const langDiv = document.getElementById("pt-lang");
    if (langDiv.classList.contains("chosen")) {
        return "pt";
    } else {
        return "en";
    }
}

function setupInputText() {
    const inputText = document.getElementById("inputText");
    inputText.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const value = event.target.value.toLowerCase();
            lang = getCurrentLanguage();

            generateEmbedding(value)
                .then((embedding) => {
                    const audioKey = getMostSimilarEmbedding(embedding, embeddings[lang]);
                    const audioMap = `${audioKey}_${lang}-0`;
                    const audioFile = audioMap;
                    playAudio(audioFile);
                    event.target.value = "";
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}

/**
 * Force camera to get smoothly back to the initial position and rotation
 * @returns {void}
 */
function updateCamera(delta) {
    const targetPosition = new THREE.Vector3(...config.CAMERA_POSITION);
    if (camera.position.distanceTo(targetPosition) > 0.01) {
        const step = Math.min(Math.max(delta, 1 / 60), 1 / 10) * 2.0;
        camera.position.lerp(targetPosition, step * 1);
    }
}

function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    const delta = clock.getDelta();
    updateAvatar(delta, camera);
    if (!controlsActive) {
        updateCamera(delta);
        controls.update();
    }
    renderer.render(scene, camera);
    stats.end();
}

init();
addLights(scene);
addAvatar(scene);
setupInputText();
setupInspector();
animate();
