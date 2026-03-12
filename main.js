import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = new THREE.Color('rgb(0, 0, 0)');

const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
scene.add( directionalLight );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );

/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);
*/
camera.position.z = 5;


loader.load( 'Donut.glb', function ( gltf ) {

  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

function animate( time ) {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );