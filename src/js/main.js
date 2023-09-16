import * as THREE from "three";
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
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 0.1, 1.0);

    // scene.add( new THREE.AxesHelper( 500 ) );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    addLights(scene);
    addAvatar(scene);
    setupKeyboardControls();
    setupInspector();
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
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    scene.add(hemiLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xeec9cc, 15);
    pointLight.position.set(0.5, 2, 3);
    pointLight.castShadow = true;
    pointLight.shadow.bias = -0.001;
    pointLight.shadow.mapSize.set(1024 * 4, 1024 * 4);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
    scene.add(pointLight, pointLightHelper);
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

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateAvatar(delta, camera);
    renderer.render(scene, camera);
}

init();
animate();
