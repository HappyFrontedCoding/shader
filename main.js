import * as THREE from "./lib/three.module.js";
import { RGBELoader } from "./lib/RGBELoader.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import { GUI } from "./lib/lil-gui.module.min.js";
import Stats from "./lib/stats.module.js";

let camera, scene, renderer, controls, stats, gui;

export function init() {
  //构建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 50;

  //构建基本场景
  scene = new THREE.Scene();
  new RGBELoader().load("./assets/ehingen_hillside_4k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    render();
  });

  //构建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  //添加控制
  controls = new OrbitControls(camera, renderer.domElement);

  //添加监测
  stats = Stats();
  document.body.appendChild(stats.dom);

  //添加GUI接口
  gui = new GUI();

  //配置窗口变化
  window.addEventListener("resize", onWindowResize);

  return { scene, gui, camera, renderer, controls, stats };
}

export function render() {
  renderer.render(scene, camera);
}

export function animate() {
  stats.update();
  render();
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
