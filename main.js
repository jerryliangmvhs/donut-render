import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById("exhibit");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = 11;
camera.position.z = 23;
camera.rotation.x = -1;
camera.rotation.y = 0;
scene.background = new THREE.Color('rgb(7, 16, 53)');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.shadowMap.enabled = true;

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight( 'rgb(255, 255, 255)', 3 );
const innerLightTest = new THREE.DirectionalLight('rgb(255,255,255)',0.25);
const ambientLight = new THREE.AmbientLight('rgb(255, 209, 209)',0.25);

directionalLight.castShadow = true;
directionalLight.position.set(-7,18,16);

innerLightTest.castShadow = true;
innerLightTest.position.set(-1,1,-1);

directionalLight.shadow.bias = -0.0001;
innerLightTest.shadow.bias = -0.0001;
scene.add(directionalLight);
scene.add(ambientLight);
scene.add(innerLightTest);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );

/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);
*/



loader.load('models/HouseTestFile.glb', function ( gltf ) {
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
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
renderer.setAnimationLoop( animate );