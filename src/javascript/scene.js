import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { Stats } from 'three-stats';
import Selector from './selector'

const CUBE_SIZE = 10;
const COLUMNS = 6;
const ROWS = 100;
const CUBE_MARGIN = 1;
const CUBE_WITH_MARGIN = CUBE_SIZE + CUBE_MARGIN;

const ROLLING_SPEED = 20;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 10000);
camera.position.z = (CUBE_WITH_MARGIN) * ROWS;
camera.position.y = CUBE_WITH_MARGIN * 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const stats = new Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const cubes = new THREE.Object3D();
const geometry = new THREE.BoxBufferGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

for (let i = 0; i < COLUMNS; i++) {
  for (let j = 0; j < ROWS; j++) {
    const material = new THREE.MeshPhongMaterial({ color: 0xffadad, flatShading: true });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * (CUBE_WITH_MARGIN);
    cube.position.z = j * (CUBE_WITH_MARGIN);
    cubes.add(cube);
  }
}

var light = new THREE.AmbientLight(0x404040);
light.position.set(50, 0, 0);

scene.add(cubes);
scene.add(light);

cubes.position.x = .5 * (1 - COLUMNS) * (CUBE_WITH_MARGIN);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.target = cubes;
directionalLight.position.x = 10;
directionalLight.position.y = 10;
directionalLight.position.z = 10;

scene.add(directionalLight);

const selector = new Selector(camera, { objects: cubes.children });
selector.onMouseLeave(e => e.material.emissive.setHex(e.currentHex));
selector.onMouseEnter(e => {
  e.currentHex = e.material.emissive.getHex();
  e.material.emissive.setHex(Math.random() * 0xff00000 - 0xff00000);
});

window.addEventListener('resize', onWindowResize, false);

controls.update();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();
clock.start();

function animate() {
  stats.begin();
  let delta = ROLLING_SPEED * clock.getDelta();
  for (let cube of cubes.children) {
    cube.position.z += delta;

    if (cube.position.z > CUBE_WITH_MARGIN * ROWS) {
      cube.position.z -= CUBE_WITH_MARGIN * ROWS;
    }
  }
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}

animate();

export default scene
