import * as THREE from "three";
import { config } from "./config.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { addAvatar, updateAvatar, playAudio } from "./avatar.js";

let scene, camera, renderer, controls, clock;

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
    plWhite.castShadow = true;
    plWhite.shadow.bias = -0.0005;
    plWhite.shadow.mapSize.set(1024 * 4, 1024 * 4);
    scene.add(plWhite);

    const plYellow = new THREE.PointLight(0xffee77, 5);
    plYellow.position.set(-1, 2, 3);
    plYellow.castShadow = true;
    plYellow.shadow.bias = -0.0005;
    plYellow.shadow.mapSize.set(1024 * 4, 1024 * 4);
    scene.add(plYellow);

    const plPurple = new THREE.PointLight(0x8a2be2, 80);
    plPurple.position.set(2.5, 3, -3);
    scene.add(plPurple);

    const plBlue = new THREE.PointLight(0x0000ff, 80);
    plBlue.position.set(-2.5, 3, -3);
    scene.add(plBlue);
}

function setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
        const key = e.key;
        switch (key) {
            case " ": // space
                playAudio("welcome");
                break;
            case "a":
                playAudio("about_me");
                break;
        }
    });
}

/**
 * Force camera to get smoothly back to the initial position and rotation
 * @returns {void}
 */
function updateCamera() {
    const targetPosition = new THREE.Vector3(...config.CAMERA_POSITION);
    const lerp = 0.05;
    camera.position.lerp(targetPosition, lerp);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateAvatar(delta, camera);
    updateCamera();
    renderer.render(scene, camera);
    controls.update();
}

init();
addLights(scene);
addAvatar(scene);
setupKeyboardControls();
setupInspector();
animate();
