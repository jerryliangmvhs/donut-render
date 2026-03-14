import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = 0.5;
camera.position.z = 1;
camera.rotation.x = -1;
camera.rotation.y = 0;
scene.background = new THREE.Color('rgb(0, 0, 0)');

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight( 'rgb(255, 233, 192)', 3 );
const ambientLight = new THREE.AmbientLight('rgb(255, 209, 209)',0.2);

directionalLight.castShadow = true;
directionalLight.position.set(-1.4,1.7,0.6);

directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);
scene.add(ambientLight);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );

/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);
*/



loader.load('models/Donut.glb', function ( gltf ) {
  const model = gltf.scene;
  model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );

} );

function animate( time ) {
  renderer.render( scene, camera );
  console.log("Camera Position X:", camera.position.x);
console.log("Camera Position Y:", camera.position.y);
console.log("Camera Position Z:", camera.position.z);
 console.log(
        "Pitch (X):", camera.rotation.x,
        "Yaw (Y):", camera.rotation.y
    );
}
renderer.setAnimationLoop( animate );