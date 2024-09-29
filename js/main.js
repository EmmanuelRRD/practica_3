import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

window.addEventListener('resize', onResize, false);

const stats = Stats();
document.body.appendChild( stats.dom);

//configuracion basica del escenario
const scene = new THREE.Scene();

//configuracion camara perspectiva
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

//configuraciones para el renderizado del escenario
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild( renderer.domElement);


//Es el control para poder mover la camara (cunciona como Blockbench para movernos por el espacio)
const orbitControl = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

//Creacion y agregacion de el plano
const planeGeometry = new THREE.PlaneGeometry(70,70,1,1);
const planeMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.0446,
    metalness: 0.3
});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);

// Lamparas de area para los planos
RectAreaLightUniformsLib.init();
var areaLight1 = new THREE.RectAreaLight(0xff0000,500,4,10);
areaLight1.position.set(-10,10,-35);
areaLight1.lookAt(scene.position);
scene.add(areaLight1);

var areaLight2 = new THREE.RectAreaLight(0x00ff00,500,4,10);
areaLight2.position.set(0,10,-35);
areaLight2.lookAt(scene.position);
scene.add(areaLight2);

var areaLight3 = new THREE.RectAreaLight(0x0000ff,500,4,10);
areaLight3.position.set(10,10,-35);
areaLight3.lookAt(scene.position);
scene.add(areaLight3);
//Agregando el plano y sus respectivas luces

const planeGeometry1 = new THREE.BoxGeometry(4,10,0);
var planeMaterial1 = new THREE.MeshBasicMaterial({color:0xff0000});
var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.position.copy(areaLight1.position);
scene.add(plane1);

const planeGeometry2 = new THREE.BoxGeometry(4,10,0);
var planeMaterial2 = new THREE.MeshBasicMaterial({color:0x00ff00});
var plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
plane2.position.copy(areaLight2.position);
scene.add(plane2);

const planeGeometry3 = new THREE.BoxGeometry(4,10,0);
var planeMaterial3 = new THREE.MeshBasicMaterial({color:0x0000ff});
var plane3 = new THREE.Mesh(planeGeometry3, planeMaterial3);
plane3.position.copy(areaLight3.position);
scene.add(plane3);


//camara posicion y agregarla a la escena
camera.position.set( -50,30,50 );
camera.lookAt(scene.position);


//Cambio de colores e intencidad de la luz
//Es el menú que podremos modificar despues en tiempos de ejecucion
const gui = new GUI();
const props = new function(){
    this.color1 = 0xff0000;
    this.intensity1 = 500;
    this.color2 = 0x00ff00;
    this.intensity2 = 500;
    this.color3 = 0x0000ff;
    this.intensity3 = 500;
}

gui.addColor(props, 'color1').onChange(function (e) {
    areaLight1.color = new THREE.Color(e);
    planeMaterial1.color = new THREE.Color(e);
    plane1.updateMatrix();
});

gui.add(props, 'intensity1', 0,1000).onChange(function (e){
    areaLight1.intensity = e;
});

gui.addColor(props, 'color2').onChange(function (e) {
    areaLight2.color = new THREE.Color(e);
    planeMaterial2.color = new THREE.Color(e);
    plane2.updateMatrix();
});

gui.add(props, 'intensity2', 0,1000).onChange(function (e){
    areaLight2.intensity = e;
});

gui.addColor(props, 'color3').onChange(function (e) {
    areaLight3.color = new THREE.Color(e);
    planeMaterial3.color = new THREE.Color(e);
    plane3.updateMatrix();
});

gui.add(props, 'intensity3', 0,1000).onChange(function (e){
    areaLight3.intensity = e;
});
//Cambio de colores e intencidad de la luz
function movimiento(){
    x += 0.3;
    let x2 = Math.sin(x);
    return x2;
}
//animacion
animate();

function animate(){
    requestAnimationFrame( animate );
    stats.update();
    orbitControl.update();
    
//-----------------------------
    renderer.render (scene, camera);
}

function onResize(){
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}