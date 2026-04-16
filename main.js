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
controls.enablePan = true;
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
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    camera.position.x = -4.15;
    camera.position.y = 4;
    camera.position.z = 0.79;
    controls.target.set(-3,4,1);
    controls.update();
  }
});
/*
  IMPORTANT INFORMATION: ROOM COORDS
  Jerry's Room
  - Camera Position: (-4.15,4,0.79)
  - Target Position: (-3,4.3,1)


*/
renderer.setAnimationLoop( animate );