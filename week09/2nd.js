import * as THREE from '../three/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xCBEFFF,1);

document.body.appendChild( renderer.domElement );

var lightOne=new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffffff, 0.5);
scene.add(lightTwo);
lightTwo.position.set(-1.5, 0, -1);

const light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light3 );

camera.position.z = 3;

const progress = document.getElementById ("progress");


const loader = new GLTFLoader();

loader.load( '../assets/dog.glb', function ( dog ) {
	console.log(dog);
	scene.add( dog.scene );
	dog.scene.rotation.set(0, -Math.PI/2, 0);

}, function ( xhr ) {
	progress.innerHTML =  ( xhr.loaded / xhr.total * 100 ) + '% loaded';
	if (xhr.loaded == xhr.total)
		progress.innerHTML = "";
}, function ( error ) {
	console.error( error );
} );


function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();