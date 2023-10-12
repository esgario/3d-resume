import * as THREE from "three";
import { config } from "./config.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

let model, mixer, rightEye, leftEye, mouthCues, audio;

function addModelToScene(model, scene) {
    scene.add(model);
    // Remove loading spinner
    const spinner = document.querySelector(".spinner-border");
    spinner.parentNode.removeChild(spinner);
    // Show form
    const formContainer = document.getElementById("content");
    formContainer.style.visibility = "visible";
}

function addAvatar(scene) {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        console.log("Loading complete!");
    };

    const gltfloader = new GLTFLoader(loadingManager);
    gltfloader.load(config.AVATAR_PATH, (result) => {
        model = result.scene;
        model.position.set(0, -1.5, 0);
        model.traverse((n) => {
            if (n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if (n.material.map) n.material.map.anisotropy = 16;
            }
        });

        // Create an AnimationMixer, and get the list of AnimationClip instances
        mixer = new THREE.AnimationMixer(model);

        // Load the idle animation
        const fbxloader = new FBXLoader();
        fbxloader.load(`${config.ANIMATIONS_PATH}/idle.fbx`, (anim) => {
            const action = mixer.clipAction(anim.animations[0]);
            action.play();
            addModelToScene(model, scene);
        });

        // Get eyes
        const spine = model.getObjectByName("Hips").getObjectByName("Spine").children[0].children[0];
        leftEye = spine.getObjectByName("Neck").getObjectByName("Head").getObjectByName("LeftEye");
        rightEye = spine.getObjectByName("Neck").getObjectByName("Head").getObjectByName("RightEye");

        // Setup blinking eyes
        startBlinkingEyes();
    });
}

function startBlinkingEyes() {
    const headMesh = model.getObjectByName("Wolf3D_Head");
    if (headMesh) {
        const leftEyeIndex = headMesh.morphTargetDictionary["eyeBlinkLeft"];
        const rightEyeIndex = headMesh.morphTargetDictionary["eyeBlinkRight"];
        if (leftEyeIndex !== undefined && rightEyeIndex !== undefined) {
            const blinkValue = 1;
            const normalValue = 0;
            headMesh.morphTargetInfluences[leftEyeIndex] = blinkValue;
            headMesh.morphTargetInfluences[rightEyeIndex] = blinkValue;
            const blinkDuration = Math.random() * 100 + 100;
            setTimeout(() => {
                headMesh.morphTargetInfluences[leftEyeIndex] = normalValue;
                headMesh.morphTargetInfluences[rightEyeIndex] = normalValue;
                setTimeout(startBlinkingEyes, Math.random() * 4000 + 1000);
            }, blinkDuration);
        }
    }
}

/**
 * Plays an audio file and loads its corresponding mouth cues.
 * @param {string} filename - The name of the audio file to play.
 */
function playAudio(filename, callback) {
    // Play audio
    audio = new Audio(`${config.AUDIOS_PATH}/${filename}.ogg`);
    audio.play();

    // Load mouth cues
    const loader = new THREE.FileLoader();
    loader.load(`${config.AUDIOS_PATH}/${filename}.json`, (data) => {
        mouthCues = JSON.parse(data).mouthCues;
    });

    // Reset mouth when audio ends
    audio.onended = () => {
        audio = null;
        mouthCues = null;
        resetMouth();
        if (callback) callback();
    };
}

function resetMouth() {
    const headMesh = model.getObjectByName("Wolf3D_Head");
    const teethMesh = model.getObjectByName("Wolf3D_Teeth");
    headMesh.morphTargetInfluences = config.LIPSYNC_CORRESPONDENCE.default;
    teethMesh.morphTargetInfluences = config.LIPSYNC_CORRESPONDENCE.default;
}

function lookAtCamera(camera) {
    const opening = 0.1;
    const maxRotation = Math.PI / 8;

    if (leftEye && rightEye) {
        const cameraPosition = camera.position.clone();
        leftEye.lookAt(cameraPosition);
        rightEye.lookAt(cameraPosition);

        // add opening
        leftEye.rotation.y += opening;
        rightEye.rotation.y -= opening;

        leftEye.rotation.y = Math.max(-maxRotation, Math.min(maxRotation, leftEye.rotation.y));
        rightEye.rotation.y = Math.max(-maxRotation, Math.min(maxRotation, rightEye.rotation.y));

        leftEye.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, leftEye.rotation.x));
        rightEye.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, rightEye.rotation.x));
    }
}

/**
 * Calculates the new target influences for the mouth based on the current and next mouth cues.
 * @param {Object} currentCue - The current mouth cue.
 * @param {Object} nextCue - The next mouth cue.
 * @returns {Array} An array of new target influences for the mouth.
 */
function calculateNewTargetInfluences(currentCue, nextCue) {
    // Calculate progress between current and next cue
    const progress = (audio.currentTime - currentCue.start) / (currentCue.end - currentCue.start);

    // Get correspondence arrays for current and next cue
    const currentVec = config.LIPSYNC_CORRESPONDENCE[currentCue.value];
    const nextVec = config.LIPSYNC_CORRESPONDENCE[nextCue.value];

    // Calculate new target influences based on progress
    const newVec = currentVec.map((v, i) => {
        return (v + (nextVec[i] - v) * progress) * config.MOTION_AMPLITUDE;
    });

    return newVec;
}

/**
 * Processes the lip sync for the current audio cue.
 */
function processLipSync() {
    let currentCue = null;
    let nextCue = null;

    // Find the current and next cue based on the current audio time
    for (let cue of mouthCues) {
        if (audio.currentTime >= cue.start && audio.currentTime <= cue.end) {
            currentCue = cue;
            nextCue = mouthCues[Math.min(mouthCues.indexOf(cue) + 1, mouthCues.length - 1)];
            break;
        }
    }

    // Update the morph target influences for the head and teeth meshes
    if (currentCue) {
        const headMesh = model.getObjectByName("Wolf3D_Head");
        const teethMesh = model.getObjectByName("Wolf3D_Teeth");
        if (headMesh && teethMesh) {
            const newTargetInfluences = calculateNewTargetInfluences(currentCue, nextCue);
            headMesh.morphTargetInfluences = newTargetInfluences.concat(headMesh.morphTargetInfluences.slice(-2));
            teethMesh.morphTargetInfluences = newTargetInfluences.concat(teethMesh.morphTargetInfluences.slice(-2));
        }
    }
}

function updateAvatar(delta, camera) {
    if (mixer) mixer.update(delta);
    if (model && camera) lookAtCamera(camera);
    if (audio && mouthCues) processLipSync();
}

export { addAvatar, updateAvatar, playAudio };
