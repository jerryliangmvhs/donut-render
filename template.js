import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let mixer;
const clock = new THREE.Clock();


const canvas = document.getElementById("element_name");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, sizes.width / sizes.height, 0.1, 1000 );

scene.background = new THREE.Color('rgb(255, 255, 255)');

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
camera.zoom = 1;
camera.updateProjectionMatrix();
controls.update();
const loader = new GLTFLoader();

const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)',5);
scene.add(ambientLight);

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

controls.maxPolarAngle = Math.PI/2;
controls.minPolarAngle = 0;

document.body.appendChild( renderer.domElement );

let model;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
loader.setDRACOLoader(dracoLoader);


loader.load('models/my_model.glb', function(gltf){
  model = gltf.scene;
  model.colorSpace = THREE.SRGBColorSpace;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  requestAnimationFrame(() => {
   //code to run after model loads
  });
  gltf.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
    });
}, undefined, function ( error ) {
  console.error( error );

} );

  
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


window.addEventListener("click",(event)=>{

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
        }
      }
});


document.addEventListener('keydown', (event) => {

  
});
renderer.setAnimationLoop( animate );