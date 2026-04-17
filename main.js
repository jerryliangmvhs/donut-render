import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById("exhibit");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, sizes.width / sizes.height, 0.1, 1000 );
if(sizes.width <768){
  camera.position.x = 0;
  camera.position.y = 20;
  camera.position.z = 51.5;
}
else{
  camera.position.x = 0.3;
  camera.position.y = 11.4;
  camera.position.z = 19.2;
}

scene.background = new THREE.Color('rgb(248, 181, 163)');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.shadowMap.enabled = false;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.update();
const loader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight( 'rgb(255, 255, 255)', 3 );
const innerLightTest = new THREE.DirectionalLight('rgb(255,255,255)',0.5);
const ambientLight = new THREE.AmbientLight('rgb(255, 220, 193)',0.5);

directionalLight.castShadow = false;
directionalLight.position.set(-7,18,16);
directionalLight.shadow.camera.left = -200;
directionalLight.shadow.camera.right = 200;
directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -200;
directionalLight.shadow.camera.far = 1000;
directionalLight.shadow.mapSize.width = 8192;
directionalLight.shadow.mapSize.height = 8192;
directionalLight.shadow.camera.updateProjectionMatrix();



innerLightTest.castShadow = true;
innerLightTest.position.set(-1,1,-1);

directionalLight.shadow.bias = -0.0001;
innerLightTest.shadow.bias = -0.0001;
scene.add(directionalLight);
scene.add(ambientLight);
//scene.add(innerLightTest);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);

const cameraXInfo = document.getElementById("cameraXInfo");
const cameraYInfo = document.getElementById("cameraYInfo");
const cameraZInfo = document.getElementById("cameraZInfo");
const cameraPitchInfo = document.getElementById("cameraPitchInfo");
const cameraYawInfo = document.getElementById("cameraYawInfo");
const cameraRollInfo = document.getElementById("cameraRollInfo");

controls.maxPolarAngle = Math.PI/2;
controls.minPolarAngle = 0;

document.body.appendChild( renderer.domElement );

/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);
*/

let mixer;

loader.load('models/My House.glb', function ( gltf ) {
  const model = gltf.scene;
  model.traverse((child) => {
        if (child.isMesh) {
            //child.castShadow = true;
            //child.receiveShadow = true;
        }
    });
  scene.add( gltf.scene );
}, undefined, function ( error ) {
  console.error( error );

} );

function getCameraX(){
  return "X: " + camera.position.x.toFixed(2);
}
function getCameraY(){
  return "Y: " + camera.position.y.toFixed(2);
}
function getCameraZ(){
  return "Z: " + camera.position.z.toFixed(2);
}
function getCameraPitch(){
  return "Pitch: " + camera.rotation.x.toFixed(2);
}
function getCameraYaw(){
  return "Yaw: " + camera.rotation.y.toFixed(2);
}
function getCameraRoll(){
  return "Roll: " + camera.rotation.z.toFixed(2);
}
function getCameraTarget(){
  return "TargetX: " + controls.target.x.toFixed(2) + " TargetY: " + controls.target.y.toFixed(2) + " TargetZ: " + controls.target.z.toFixed(2);
}
function animate( time ) {
  renderer.render( scene, camera );
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
window.addEventListener("click",()=>{
   console.log(getCameraX());
   console.log(getCameraY());
   console.log(getCameraZ());
   console.log(getCameraTarget());
});
document.addEventListener('keydown', (event) => {
  if(event.key === '0'){
    //spawn
    controls.target.set(0,0,0);
    camera.position.x = 0.3;
    camera.position.y = 11.4;
    camera.position.z = 19.2;
    controls.update();
  }
  if (event.key === '1') {
    //jerry's room
    camera.position.x = -3;
    camera.position.y = 4;
    camera.position.z = 0;
    controls.target.set(-3,3.75,1);
    controls.update();
  }
  if (event.key === '2') {
    //bathroom 2
    camera.position.x = -1.13;
    camera.position.y = 4;
    camera.position.z = 0.7;
    controls.target.set(-1.13,4,1.2);
    controls.update();
  }
  if(event.key === '3'){
    //second floor main area
    camera.position.set(0,3.75,-2.1);
    controls.target.set(0,3.7,-1.25);
    controls.update();
  }
  if(event.key === '4'){
    //bathroom 3
    camera.position.set(3.8,4.08,0.71);
    controls.target.set(3.82,4,1.4);
    controls.update();
  }
  if(event.key === '5'){
    //jason's room
    camera.position.set(-2.35,4,-2.5);
    controls.target.set(-3.16,4,-2.5);
    controls.update();
  }
  if(event.key === '6'){
    //parent's room
    camera.position.set(3.25,4,-2.35);
    controls.target.set(3.25,4,-1.5);
    controls.update();
  }
  if(event.key === '7'){
    //living room + kitchen
    camera.position.set(-0.5,1.6,-3);
    controls.target.set(-0.85,1.6,-2.29);
    controls.update();
  }
  if(event.key === '8'){
    //piano study room
    camera.position.set(2.56,1.55,-2.47);
    controls.target.set(3.43,1.55,-2.46);
    controls.update();
  }
  if(event.key === '9'){
    //garage
    camera.position.set(3.52,1.23,2.34);
    controls.target.set(3.56,1.23,1.19);
    controls.update();
  }
  if(event.key === '-'){
    //lower bathroom
    camera.position.set(-3.26,2,0.36);
    controls.target.set(-3.28,2,0.36);
    controls.update();
  }
  if(event.key === "="){
    //dad's office
    camera.position.set(-2.63,1.8,1.93);
    controls.target.set(-3.32,1.8,2.4);
    controls.update();
  }
  
});
/*
  IMPORTANT INFORMATION: ROOM COORDS
  Jerry's Room
  - Camera Position: (-4.15,4,0.79)
  - Target Position: (-3,4.3,1)



X: -2.63
main.js:136 Y: 1.87
main.js:137 Z: 1.93
main.js:138 TargetX: -3.32 TargetY: 1.74 TargetZ: 2.40
*/
renderer.setAnimationLoop( animate );