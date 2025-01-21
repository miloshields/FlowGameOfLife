import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const rows = 10;
const cols = 10;

const cells: Cell[][] = Array.from({ length: rows }, () => 
  Array.from({ length: cols }, () => ({ alive: false }))
);

// code for a single cell pillar
const pillarGeometry = new THREE.BoxGeometry(1,1,1);
const pillarMaterial = new THREE.MeshStandardMaterial({color: 0xffff000});
const pillarObject = new THREE.Mesh(pillarGeometry, pillarMaterial);

interface Cell {
  alive: boolean;
}

function drawCells(cells: Cell[][], scene: THREE.Scene, cellMesh: THREE.Mesh): void {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (cells[i][j].alive) {
        console.log("I'm an alive cell!")
        let newMesh = cellMesh.clone();
        newMesh.position.set(i, 0, j);
        scene.add(newMesh);
      }
    }
  }
}
// scene and camera setup

const canvas = document.querySelector("#bg") as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error("Canvas element not found");
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.setZ(30);
camera.position.setX(5);
const controls = new OrbitControls(camera, renderer.domElement);

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0x00ffff)
// const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLight, ambientLight);

const gridHelper = new THREE.GridHelper(200,200);
scene.add(gridHelper);

// test: set an initial condition
console.log(JSON.stringify(cells));
cells[0][0].alive = true;
cells[1][1].alive = true;
cells[2][2].alive = true;

drawCells(cells, scene, pillarObject);


function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();