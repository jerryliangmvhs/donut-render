import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let location = 0;
let mixer;
const clock = new THREE.Clock();


const canvas = document.getElementById("exhibit");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, sizes.width / sizes.height, 0.1, 1000 );
if(sizes.width <768){
  camera.position.set(0,17.80,28.92);
}
else{
  camera.position.set(0,9.15,18.73);
}

scene.background = new THREE.Color('rgb(248, 181, 163)');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.shadowMap.enabled = false;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
camera.zoom = 1;
camera.updateProjectionMatrix();
controls.update();
const loader = new GLTFLoader();

const directionalLight = new THREE.DirectionalLight( 'rgb(255, 255, 255)', 1.2);
const innerLightTest = new THREE.DirectionalLight('rgb(255,255,255)',0.5);
const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)',4);

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
//scene.add(directionalLight);
scene.add(ambientLight);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

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

let model;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
loader.setDRACOLoader(dracoLoader);
const loadingScreen = document.getElementById("introScreen");
const loadingText = document.getElementById("loadingText");


loader.load('models/My House.glb', function(gltf){
  model = gltf.scene;
  model.colorSpace = THREE.SRGBColorSpace;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  requestAnimationFrame(() => {
    console.log("model loaded");
    loadingText.innerHTML = "Welcome!";
    setTimeout(()=>{
      loadingScreen.classList.add("hidden");
    },500);

  });
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
    });
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
  renderer.setAnimationLoop((time) => {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
});
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const instructions = document.getElementById("instructions");


window.addEventListener("mousedown",(event)=>{
   instructions.classList.add("hidden");
   console.log("camera.position.set("+camera.position.x.toFixed(2)+","+camera.position.y.toFixed(2)+","+camera.position.z.toFixed(2)+");\ncontrols.target.set("+controls.target.x.toFixed(2)+","+controls.target.y.toFixed(2)+","+controls.target.z.toFixed(2)+");\ncontrols.update();");
   //console.log("Polar Angle: " + controls.getPolarAngle().toFixed(2));

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (!model) return;
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj) {
            console.log("Object Name: " + obj.name);
            console.log("Camera Zoom: " + camera.zoom);

            if (obj.name === "Door_Main_Entrance"){
              if(location != 7){
                location = 7;
                camera.fov = 100;
                camera.position.set(-0.50,1.60,-3.00);
                controls.target.set(-0.85,1.60,-2.29);
                controls.update();
                camera.zoom = 1;
                camera.updateProjectionMatrix();
              }
              else if(location !=0){
                location = 0;
                camera.fov = 50;
                camera.position.set(0.06,9.15,18.73);
                controls.target.set(0.00,0.00,0.00);
                controls.update();
                camera.zoom = 1;
                camera.updateProjectionMatrix();
              }
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Outside_to_Garage") {
                if(location !=9){
                  location = 9;
                  camera.position.set(2.74,1.51,0.43);
                  controls.target.set(3.56,1.23,1.19);
                  camera.fov = 100;
                  camera.zoom = 1;
                  camera.updateProjectionMatrix();
                  controls.update();
                }
                else if(location !=0){
                  location = 0;
                  camera.position.set(0.06,9.15,18.73);
                  controls.target.set(0.00,0.00,0.00);
                  camera.fov = 50;
                  camera.zoom = 1;
                  camera.updateProjectionMatrix();
                  controls.update();
                }
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Dad_Office") {
                if(location !=11){
                  location = 11;
                  camera.position.set(-3.87,1.97,1.80);
                  controls.target.set(-3.32,1.80,2.40);
                  controls.update();
                }
                else if(location !=7){
                  location = 7;
                  camera.position.set(-0.50,1.60,-3.00);
                  controls.target.set(-0.85,1.60,-2.29);
                  controls.update();
                }
                camera.zoom = 1;
                camera.updateProjectionMatrix();
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Bathroom_1") {
                if(location !=10 ){
                    location = 10;
                    camera.position.set(-3.30,2.01,0.36);
                    controls.target.set(-3.28,2.00,0.36);
                    controls.update();
                  }
                else if(location !=7){
                  location = 7;
                  camera.position.set(-0.50,1.60,-3.00);
                  controls.target.set(-0.85,1.60,-2.29);
                  controls.update();
                }
                console.log("Mesh Clicked!");
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                break;
            }
            else if (obj.name === "Door_Garage_to_Living_Room"){
                if(location !=7){
                  location = 7;
                  camera.position.set(-0.50,1.60,-3.00);
                  controls.target.set(-0.85,1.60,-2.29);
                  controls.update();
                }
                else if(location !=9){
                  location = 9;
                  camera.position.set(2.74,1.51,0.43);
                  controls.target.set(3.56,1.23,1.19);
                  controls.update();
                }
                console.log("Mesh Clicked!");
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                break;
            }
            else if (obj.name === "Study_Room_Door"){
              if(location !=8){
                  location = 8;
                  camera.position.set(2.56,1.55,-2.47);
                  controls.target.set(3.43,1.55,-2.46);
                  controls.update();
                }
                else if(location !=7){
                  location = 7;
                  camera.position.set(-0.50,1.60,-3.00);
                  controls.target.set(-0.85,1.60,-2.29);
                  controls.update();
                }
                camera.zoom = 1;
                camera.updateProjectionMatrix();
                camera.fov = 100;
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Jason's_Room") {
              if(location !=5){
                  location = 5;
                  camera.position.set(-2.35,4.00,-2.52);
                  controls.target.set(-3.16,4.00,-2.50);
                  controls.update();
                }
                else if(location !=3){
                  location = 3;
                  camera.position.set(-0.00,3.75,-2.10);
                  controls.target.set(0.00,3.70,-1.25);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Jerry's_Room") {
                if(location !=3){
                  location = 3;
                  camera.position.set(-0.00,3.75,-2.10);
                  controls.target.set(0.00,3.70,-1.25);
                  controls.update();
                }
                else if(location !=1){
                  location = 1;
                  camera.position.set(-3.00,4.00,0.00);
                  controls.target.set(-3.00,3.75,1.00);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Bathroom_2") {
              if(location !=2){
                  location = 2;
                  camera.position.set(-1.13,4.00,0.70);
                  controls.target.set(-1.13,4.00,1.20);
                  controls.update();
                }
                else if(location !=3){
                  location = 3;
                  camera.position.set(-0.00,3.75,-2.10);
                  controls.target.set(0.00,3.70,-1.25);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                console.log("Mesh Clicked!");
                break;
            }
            else if (obj.name === "Door_Parents_Room") {
                console.log("Mesh Clicked!");
                if(location !=6){
                  location = 6;
                  camera.position.set(2.52,4.00,-1.07);
                  controls.target.set(3.25,4.00,-1.50);
                  controls.update();
                }
                else if(location !=3){
                  location = 3;
                  camera.position.set(-0.00,3.75,-2.10);
                  controls.target.set(0.00,3.70,-1.25);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                break;
            }
            else if (obj.name === "Door_Bathroom_3") {
                console.log("Mesh Clicked!");
                if(location !=6){
                  location = 6;
                  camera.position.set(2.52,4.00,-1.07);
                  controls.target.set(3.25,4.00,-1.50);
                  controls.update();
                }
                else if(location !=4){
                  location = 4;
                  camera.position.set(3.80,4.08,0.71);
                  controls.target.set(3.82,4.00,1.40);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                break;
            }
            else if (obj.name === "Door_Parent's_Closet") {
               //do this later
            }
             else if (obj.name === "Stairs") {
              if(location !=3){
                  location = 3;
                  camera.position.set(-0.00,3.75,-2.10);
                  controls.target.set(0.00,3.70,-1.25);
                  controls.update();
                }
                else if(location !=7){
                  location = 7;
                  camera.position.set(-0.50,1.60,-3.00);
                  controls.target.set(-0.85,1.60,-2.29);
                  controls.update();
                }
                camera.zoom = 1;
                camera.fov = 100;
                camera.updateProjectionMatrix();
                console.log("Mesh Clicked!");
                break;
            }
            else if(obj.name === "Cube009_6"){
               if(location !=9){
                  location = 9;
                  camera.position.set(2.74,1.51,0.43);
                  controls.target.set(3.56,1.23,1.19);
                  controls.update();
                  camera.fov = 100;
                  camera.zoom = 1;
                  camera.updateProjectionMatrix();
                }
                else if(location !=0){
                  location = 0;
                   camera.position.set(0.06,9.15,18.73);
                  controls.target.set(0.00,0.00,0.00);
                  controls.update();
                  camera.fov = 50;
                  camera.zoom = 1;
                  camera.updateProjectionMatrix();
                }
                
                console.log("Mesh Clicked!");
                break;
            }
            obj = obj.parent;
        }
      }
});


document.addEventListener('keydown', (event) => {
  if(event.key === '0'){
    //spawn
    controls.target.set(0,0,0);
    camera.position.set(0.14,9.15,18.73);
    if(sizes.width < 768){
      camera.position.set(0,17.80,28.92);
    }
    controls.update();
    camera.fov = 50;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 0;
  }
  if (event.key === '1') {
    //jerry's room
    location = 1;
    camera.position.x = -3;
    camera.position.y = 4;
    camera.position.z = 0;
    controls.target.set(-3,3.75,1);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }
  if (event.key === '2') {
    //bathroom 2
    camera.position.x = -1.13;
    camera.position.y = 4;
    camera.position.z = 0.7;
    controls.target.set(-1.13,4,1.2);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 2;
  }
  if(event.key === '3'){
    //second floor main area
    camera.position.set(0,3.75,-2.1);
    controls.target.set(0,3.7,-1.25);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 3;
  }
  if(event.key === '4'){
    //bathroom 3
    camera.position.set(3.8,4.08,0.71);
    controls.target.set(3.82,4,1.4);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 4;
  }
  if(event.key === '5'){
    //jason's room
    camera.position.set(-2.35,4,-2.5);
    controls.target.set(-3.16,4,-2.5);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 5;
  }
  if(event.key === '6'){
    //parent's room
    camera.position.set(2.52,4.00,-1.07);
    controls.target.set(3.25,4.00,-1.50);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 6;
  }
  if(event.key === '7'){
    //living room + kitchen
    camera.position.set(-0.50,1.60,-3.00);
    controls.target.set(-0.85,1.60,-2.29);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 7;
  }
  if(event.key === '8'){
    //piano study room
    camera.position.set(2.56,1.55,-2.47);
    controls.target.set(3.43,1.55,-2.46);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 8;
  }
  if(event.key === '9'){
    //garage
    camera.position.set(3.52,1.23,2.34);
    controls.target.set(3.56,1.23,1.19);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 9;
  }
  if(event.key === '-'){
    //lower bathroom
    camera.position.set(-3.26,2,0.36);
    controls.target.set(-3.28,2,0.36);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 10;
  }
  if(event.key === "="){
    //dad's office
    camera.position.set(-2.63,1.8,1.93);
    controls.target.set(-3.32,1.8,2.4);
    controls.update();
    camera.fov = 100;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    location = 11;
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