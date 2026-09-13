// Atmospheric Particles, Dynamic Lighting & Blueprint Grid Setup
import * as THREE from "three";

export function createAtmosphere(scene) {
  // 1. Ambient & Directional Lighting Rig
  const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.75); // Cool institutional fill
  scene.add(ambientLight);

  // Warm golden rim light (Delhi golden hour)
  const goldenSun = new THREE.DirectionalLight(0xf59e0b, 1.8);
  goldenSun.position.set(35, 45, 25);
  goldenSun.castShadow = true;
  goldenSun.shadow.mapSize.width = 2048;
  goldenSun.shadow.mapSize.height = 2048;
  goldenSun.shadow.camera.near = 0.5;
  goldenSun.shadow.camera.far = 150;
  const d = 35;
  goldenSun.shadow.camera.left = -d;
  goldenSun.shadow.camera.right = d;
  goldenSun.shadow.camera.top = d;
  goldenSun.shadow.camera.bottom = -d;
  goldenSun.shadow.bias = -0.0005;
  scene.add(goldenSun);

  // Secondary cool blue directional rim light for high-contrast architectural edge highlights
  const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
  blueRimLight.position.set(-30, 20, -30);
  scene.add(blueRimLight);

  // Soft upward ground bounce light
  const bounceLight = new THREE.HemisphereLight(0xffedd5, 0x0f172a, 0.4);
  scene.add(bounceLight);

  // 2. Ambient Floating Dust Motes & Golden Air Particles
  const particleCount = 1400;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  const velocities = [];

  const spreadX = 70;
  const spreadY = 35;
  const spreadZ = 70;

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spreadX;
    positions[i3 + 1] = Math.random() * spreadY + 0.5;
    positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

    scales[i] = Math.random() * 0.8 + 0.3;

    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: Math.random() * 0.006 + 0.002,
      z: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2
    });
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

  // Particle Material
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.22,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // 3. Blueprint Holographic Floor Grid (Toggled during Section 3 & Blueprint Mode)
  const gridHelper = new THREE.GridHelper(90, 90, 0x38bdf8, 0x1e293b);
  gridHelper.position.y = -0.01;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.25;
  scene.add(gridHelper);

  // Ground plane with subtle shadow reception
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Slate navy matching theme
    roughness: 0.95,
    metalness: 0.05
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.05;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Animation ticker for particles
  function updateAtmosphere(time) {
    const posAttr = particleGeometry.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const vel = velocities[i];

      // Vertical drift with gentle sine wave oscillation
      array[i3 + 1] += vel.y;
      array[i3] += Math.sin(time * 0.8 + vel.phase) * 0.005;
      array[i3 + 2] += Math.cos(time * 0.6 + vel.phase) * 0.005;

      // Loop particles if they drift out of boundary
      if (array[i3 + 1] > spreadY) {
        array[i3 + 1] = 0.5;
        array[i3] = (Math.random() - 0.5) * spreadX;
        array[i3 + 2] = (Math.random() - 0.5) * spreadZ;
      }
    }
    posAttr.needsUpdate = true;
  }

  function setBlueprintMode(enabled) {
    if (enabled) {
      gridHelper.material.opacity = 0.85;
      gridHelper.material.color.setHex(0x38bdf8);
      groundMat.color.setHex(0x030712);
      groundMat.wireframe = false;
      particleMaterial.color.setHex(0x38bdf8);
      ambientLight.color.setHex(0x0284c7);
      ambientLight.intensity = 1.2;
      goldenSun.color.setHex(0x06b6d4);
      blueRimLight.color.setHex(0x3b82f6);
    } else {
      gridHelper.material.opacity = 0.25;
      groundMat.color.setHex(0x0f172a);
      particleMaterial.color.setHex(0xfef08a);
      ambientLight.color.setHex(0xdbeafe);
      ambientLight.intensity = 0.75;
      goldenSun.color.setHex(0xf59e0b);
      blueRimLight.color.setHex(0x38bdf8);
    }
  }

  return {
    update: updateAtmosphere,
    setBlueprintMode,
    gridHelper,
    particleSystem,
    goldenSun,
    blueRimLight
  };
}
