import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let scene, camera, renderer, controls, clock;
let pointLight, hemiLight, model, rightEye, leftEye, head, mixer, audio;
let mouthCues;

// Settings
const MOTION_AMPLITUDE = 0.95;

const LIPSYNC_CORRESPONDENCE_ARRAYS = {
	default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	A: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // "viseme_PP": 1
	B: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // "viseme_kk": 5
	C: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // "viseme_I": 12
	D: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // "viseme_AA": 10
	E: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // "viseme_O": 13
	F: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // "viseme_U": 14
	G: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // "viseme_FF": 2
	H: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // "viseme_nn": 8
	X: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // "viseme_sil": 0
}

function init() {
	clock = new THREE.Clock();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 5000 );
	camera.position.set( 0, 0.1, 1.0 );

	// scene.add( new THREE.AxesHelper( 500 ) );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.toneMappingExposure = 2.3;
	renderer.shadowMap.enabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
	
	addLights();
	addAvatar();
	setupKeyboardControls();

	// setup for three js inspector
	window.scene = scene;
	window.THREE = THREE;
}


function addLights() {
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
	scene.add( hemiLight );

	pointLight = new THREE.PointLight( 0xeec9cc, 15 );
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.1 );
	pointLight.position.set( 0.5, 2, 3 );
	pointLight.castShadow = true;
	pointLight.shadow.bias = -0.001;
	pointLight.shadow.mapSize.set( 1024*4, 1024*4 );
	scene.add( pointLight, pointLightHelper );
}


function addAvatar() {
	const gltfloader = new GLTFLoader();
	gltfloader.load( 'assets/models/avatar.glb', result => {
		model = result.scene;
		model.position.set(0, -1.5, 0);
		model.traverse( n => {
			if ( n.isMesh ) {
				n.castShadow = true;
				n.receiveShadow = true;
				if (n.material.map) n.material.map.anisotropy = 16;
			}
		});

		// Create an AnimationMixer, and get the list of AnimationClip instances
		mixer = new THREE.AnimationMixer( model );

		// Load the idle animation
		const fbxloader = new FBXLoader();
		fbxloader.load( 'assets/animations/idle.fbx', anim => {
			const action = mixer.clipAction( anim.animations[0] );
			action.play();
		});

		// Get eyes
		const spine = model.getObjectByName('Hips').getObjectByName('Spine').children[0].children[0];
		leftEye = spine.getObjectByName('Neck').getObjectByName('Head').getObjectByName('LeftEye');
		rightEye = spine.getObjectByName('Neck').getObjectByName('Head').getObjectByName('RightEye');

		// Setup blinking eyes
		startBlinkingEyes();

		// Add model to scene
		scene.add( model );
	});
}

function playAudio(filename) {
	audio = new Audio(`assets/audios/${filename}.mp3`);
	audio.play();

	const loader = new THREE.FileLoader();
	loader.load(`assets/audios/${filename}.json`, data => {
		mouthCues = JSON.parse( data ).mouthCues;
	});

	audio.onended = () => {
		audio = null;
		mouthCues = null;
		resetMouth();
	}
}

function resetMouth() {
	const headMesh = model.getObjectByName('Wolf3D_Head');
	const teethMesh = model.getObjectByName('Wolf3D_Teeth');
	headMesh.morphTargetInfluences = LIPSYNC_CORRESPONDENCE_ARRAYS.default;
	teethMesh.morphTargetInfluences = LIPSYNC_CORRESPONDENCE_ARRAYS.default;
}

function calculateNewTargetInfluences(currentCue, nextCue) {
	const progress = (audio.currentTime - currentCue.start) / (currentCue.end - currentCue.start);
	const currentVec = LIPSYNC_CORRESPONDENCE_ARRAYS[currentCue.value];
	const nextVec = LIPSYNC_CORRESPONDENCE_ARRAYS[nextCue.value];
	const newVec = currentVec.map((v, i) => {
		return (v + (nextVec[i] - v) * progress) * MOTION_AMPLITUDE;
	});
	return newVec;
}


function processLipSync() {
	let currentCue = null;
	let nextCue = null;
	for (let cue of mouthCues) {
        if (audio.currentTime >= cue.start && audio.currentTime <= cue.end) {
            currentCue = cue;
			nextCue = mouthCues[Math.min(mouthCues.indexOf(cue) + 1, mouthCues.length - 1)];
            break;
        }
    }

	if (currentCue) {
		const headMesh = model.getObjectByName('Wolf3D_Head');
        const teethMesh = model.getObjectByName('Wolf3D_Teeth');
        if (headMesh && teethMesh) {
			const newTargetInfluences = calculateNewTargetInfluences(currentCue, nextCue);
			headMesh.morphTargetInfluences = newTargetInfluences.concat(headMesh.morphTargetInfluences.slice(-2));
			teethMesh.morphTargetInfluences = newTargetInfluences.concat(teethMesh.morphTargetInfluences.slice(-2));
		}
	}
}

function startBlinkingEyes() {
    const headMesh = model.getObjectByName('Wolf3D_Head');
    if (headMesh) {
        const leftEyeIndex = headMesh.morphTargetDictionary['eyeBlinkLeft'];
        const rightEyeIndex = headMesh.morphTargetDictionary['eyeBlinkRight'];
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

function lookAtCamera() {
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

function setupKeyboardControls() {
	document.addEventListener('keydown', e => {
		const key = e.key;
		switch (key) {
			case ' ': // space
				playAudio("welcome");
				break;
			case 'a':
				playAudio("about_me");
				break;
		}
	});
}

function animate() {
	requestAnimationFrame( animate );
	const delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );
	if ( audio && mouthCues) processLipSync();
    if ( model && camera ) lookAtCamera();

	renderer.render( scene, camera );
}

init();
animate();