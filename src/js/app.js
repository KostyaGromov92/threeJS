import * as THREE from 'three';
import { Scene } from 'three';

let OrbitControls = require('three-orbit-controls')(THREE);

let canvas = document.getElementById('myscene');

let width = 1200;
let height = 600;
let dots = 50;
let lines = 50;
let radius = 100;

let camera = new THREE.PerspectiveCamera(40, width/height, 1, 1000);

let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

let controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x999999);

let scene = new THREE.Scene();

let group = new THREE.Group();
scene.add(group);

let material = new THREE.LineBasicMaterial({
  color: 0xff0000
});

let materialGirl = new THREE.LineBasicMaterial({
  color: 0xff00ff
});

for (let index = 0; index < lines; index++) {
  let geometry = new THREE.Geometry();

  let line = new THREE.Line(geometry, material);

  for (let j = 0; j < dots; j++) {

    let coord = (j/dots) * radius * 2 - radius;

    let vector = new THREE.Vector3(coord, 0);
    
    geometry.vertices.push(vector);
  }

  line.rotation.z = Math.random() * Math.PI;
  line.rotation.x = Math.random() * Math.PI;
  line.rotation.y = Math.random() * Math.PI;

  group.add(line);
}


camera.position.set(0,0,300);

let canvasForPhoto = document.createElement('canvas');
let ctx = canvasForPhoto.getContext('2d');

canvasForPhoto.width = 200;
canvasForPhoto.height = 200;

let image = document.getElementById('photo');

ctx.drawImage(image, 0, 0, 200, 200);

document.body.appendChild(canvasForPhoto);

let size = 200;

let data = ctx.getImageData(0, 0, size, size);
data = data.data;



for (var y = 0; y < size; y++) {

  let geometry = new THREE.Geometry();
  let line = new THREE.Line(geometry, materialGirl);

  for (var x = 0; x < size; x++) {
    var bright = data[(size * y + x ) * 4];

    let vector = new THREE.Vector3(x - 150, y - 150, bright/10 - 100);
    
    geometry.vertices.push(vector);

  }

  group.add(line);
}

let time = 0;

function Render() {
  time++;
  renderer.render(scene, camera);
  UpdateLines(time);
  group.rotation.x = Math.PI;
  group.rotation.y = (time/500);
  window.requestAnimationFrame(Render);
}

function UpdateLines(time) {
  let line, vector, ratio;
  for (let i = 0; i < lines; i++) {
    line = group.children[i];
    
    for (let j = 0; j < dots; j++) {
      vector = line.geometry.vertices[j];
      ratio = 1 - (radius - Math.abs(vector.x))/radius;     
      vector.y = Math.sin(j/5 + time/100) * 20 * ratio;
    }
    line.geometry.verticesNeedUpdate = true;
  }
} 

Render();
