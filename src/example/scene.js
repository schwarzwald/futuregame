import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Stats } from 'three-stats';

const CUBE_SIZE = 1;
const PLACE_SIZE = 10;
const CUBE_MARGIN = .3;
const CUBE_RADIUS = PLACE_SIZE * (CUBE_SIZE + CUBE_MARGIN) / 2;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const place = new THREE.Object3D();
const geometry = new THREE.BoxBufferGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

for (let i = 0; i < PLACE_SIZE; i++) {
  let offsetX = Math.abs(i - PLACE_SIZE / 2);
  for (let j = 0; j < PLACE_SIZE; j++) {
    let offsetZ = Math.abs(j - PLACE_SIZE / 2);

    let dist = Math.sqrt(offsetX ** 2 + offsetZ ** 2) / Math.SQRT2 / PLACE_SIZE * 2;

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * (CUBE_SIZE + CUBE_MARGIN);
    cube.position.y = (1 - dist) * CUBE_RADIUS;
    cube.position.z = j * (CUBE_SIZE + CUBE_MARGIN);
    place.add(cube);
  }
}

var light = new THREE.AmbientLight(0x404040);
light.position.set(50, 0, 0);

scene.add(place);
scene.add(light);

place.position.x = .5 * (1 - PLACE_SIZE) * (CUBE_SIZE + CUBE_MARGIN);
place.position.z = .5 * (1 - PLACE_SIZE) * (CUBE_SIZE + CUBE_MARGIN);
place.position.y = - PLACE_SIZE / 2 * CUBE_SIZE;

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.target = place;
directionalLight.position.x = 10;
directionalLight.position.y = 10;
directionalLight.position.z = 10;

scene.add(directionalLight);



controls.update();

function animate() {
  stats.begin();
  renderer.render(scene, camera);
  controls.update();
  stats.end();
  requestAnimationFrame(animate);
}

animate();

export default scene
