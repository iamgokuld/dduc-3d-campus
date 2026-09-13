// Procedural 3D Architectural Model of Deen Dayal Upadhyaya College (DDUC), Dwarka Campus
import * as THREE from "three";
import { campusLandmarks } from "./tourData.js";

export function createDDUCCampus(scene) {
  const campusGroup = new THREE.Group();
  campusGroup.name = "dduc_campus_group";

  // State
  let isBlueprintMode = false;
  const hotspotMeshes = [];

  // --- 1. Materials Palettes ---
  // Realistic Palette
  const materials = {
    brickPrimary: new THREE.MeshStandardMaterial({
      color: 0x8f2d2d, // Iconic DDUC terracotta red brick
      roughness: 0.85,
      metalness: 0.05
    }),
    brickAccent: new THREE.MeshStandardMaterial({
      color: 0x752020, // Darker brick bands & piers
      roughness: 0.9,
      metalness: 0.05
    }),
    concrete: new THREE.MeshStandardMaterial({
      color: 0xd6d3d1, // Clean architectural concrete lintels/fins
      roughness: 0.7,
      metalness: 0.1
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc, // Modern reflective sky-blue glass
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.65,
      transparent: true,
      opacity: 0.85
    }),
    solarCell: new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Monocrystalline solar blue
      roughness: 0.2,
      metalness: 0.8
    }),
    solarFrame: new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Aluminum mounting frames
      roughness: 0.4,
      metalness: 0.7
    }),
    lawn: new THREE.MeshStandardMaterial({
      color: 0x15803d, // Lush green campus lawns
      roughness: 0.95
    }),
    pathway: new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate paved stone walkways
      roughness: 0.8
    }),
    sportsTurf: new THREE.MeshStandardMaterial({
      color: 0x0284c7, // High-performance blue synthetic court
      roughness: 0.6
    }),
    foliage: new THREE.MeshStandardMaterial({
      color: 0x166534, // Stylized low-poly tree leaves
      roughness: 0.9,
      flatShading: true
    }),
    trunk: new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.9
    })
  };

  // Blueprint Cyber Materials
  const blueprintMaterials = {
    primary: new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    }),
    glass: new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    }),
    glow: new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true
    })
  };

  // Store original materials on meshes for seamless blueprint toggle
  function registerMesh(mesh, normalMat, blueprintMat = blueprintMaterials.primary) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      normalMaterial: normalMat,
      blueprintMaterial: blueprintMat
    };
    mesh.material = normalMat;
    return mesh;
  }

  // --- 2. Campus Ground Plinth & Landscaping ---
  const plinthGeo = new THREE.BoxGeometry(76, 0.6, 68);
  const plinth = new THREE.Mesh(plinthGeo, materials.concrete);
  plinth.position.set(0, 0.3, 0);
  campusGroup.add(registerMesh(plinth, materials.concrete));

  // Courtyard Lawn patches
  const lawnGeo1 = new THREE.BoxGeometry(32, 0.65, 26);
  const lawn1 = new THREE.Mesh(lawnGeo1, materials.lawn);
  lawn1.position.set(2, 0.32, 4);
  campusGroup.add(registerMesh(lawn1, materials.lawn));

  const lawnGeo2 = new THREE.BoxGeometry(22, 0.65, 18);
  const lawn2 = new THREE.Mesh(lawnGeo2, materials.lawn);
  lawn2.position.set(-20, 0.32, -18);
  campusGroup.add(registerMesh(lawn2, materials.lawn));

  // Cross Pathways
  const pathGeoX = new THREE.BoxGeometry(72, 0.66, 4);
  const pathX = new THREE.Mesh(pathGeoX, materials.pathway);
  pathX.position.set(0, 0.33, 0);
  campusGroup.add(registerMesh(pathX, materials.pathway));

  const pathGeoZ = new THREE.BoxGeometry(4, 0.66, 64);
  const pathZ = new THREE.Mesh(pathGeoZ, materials.pathway);
  pathZ.position.set(0, 0.33, 0);
  campusGroup.add(registerMesh(pathZ, materials.pathway));

  // --- 3. Building Blocks Construction Helper ---
  // Helper: Create multi-story stepped brick block with window bands and concrete louvers
  function createArchitecturalBlock(width, height, depth, x, y, z, options = {}) {
    const blockGroup = new THREE.Group();
    blockGroup.position.set(x, y + height / 2, z);

    // Main Brick Volume
    const brickGeo = new THREE.BoxGeometry(width, height, depth);
    const brickMesh = new THREE.Mesh(brickGeo, materials.brickPrimary);
    blockGroup.add(registerMesh(brickMesh, materials.brickPrimary));

    // Floor Slabs / Concrete Lintels
    const floors = options.floors || Math.max(2, Math.floor(height / 2.5));
    const floorHeight = height / floors;

    for (let f = 1; f < floors; f++) {
      const slabGeo = new THREE.BoxGeometry(width + 0.3, 0.25, depth + 0.3);
      const slabMesh = new THREE.Mesh(slabGeo, materials.concrete);
      slabMesh.position.y = -height / 2 + f * floorHeight;
      blockGroup.add(registerMesh(slabMesh, materials.concrete));
    }

    // Window Inset Ribbons (Glass bands on main faces)
    const windowDepth = 0.15;
    const windowH = floorHeight * 0.45;
    for (let f = 0; f < floors; f++) {
      const winY = -height / 2 + f * floorHeight + floorHeight * 0.55;

      // Front & Back Windows
      if (width >= 6) {
        const winFrontGeo = new THREE.BoxGeometry(width * 0.75, windowH, windowDepth);
        const winFront = new THREE.Mesh(winFrontGeo, materials.glass);
        winFront.position.set(0, winY, depth / 2 + 0.05);
        blockGroup.add(registerMesh(winFront, materials.glass, blueprintMaterials.glass));

        const winBack = winFront.clone();
        winBack.position.set(0, winY, -depth / 2 - 0.05);
        blockGroup.add(registerMesh(winBack, materials.glass, blueprintMaterials.glass));
      }

      // Left & Right Windows
      if (depth >= 6) {
        const winSideGeo = new THREE.BoxGeometry(windowDepth, windowH, depth * 0.75);
        const winSide = new THREE.Mesh(winSideGeo, materials.glass);
        winSide.position.set(width / 2 + 0.05, winY, 0);
        blockGroup.add(registerMesh(winSide, materials.glass, blueprintMaterials.glass));

        const winSide2 = winSide.clone();
        winSide2.position.set(-width / 2 - 0.05, winY, 0);
        blockGroup.add(registerMesh(winSide2, materials.glass, blueprintMaterials.glass));
      }
    }

    // Parapet roof border
    const parapetGeo = new THREE.BoxGeometry(width + 0.1, 0.4, depth + 0.1);
    const parapetMesh = new THREE.Mesh(parapetGeo, materials.concrete);
    parapetMesh.position.y = height / 2 + 0.2;
    blockGroup.add(registerMesh(parapetMesh, materials.concrete));

    // Roof HVAC unit
    if (options.hasHVAC) {
      const hvacGeo = new THREE.BoxGeometry(width * 0.3, 0.8, depth * 0.3);
      const hvacMesh = new THREE.Mesh(hvacGeo, materials.concrete);
      hvacMesh.position.set(width * 0.2, height / 2 + 0.5, 0);
      blockGroup.add(registerMesh(hvacMesh, materials.concrete));
    }

    campusGroup.add(blockGroup);
    return blockGroup;
  }

  // --- 4. Campus Architecture Blocks ---

  // BLOCK A: Main Academic Complex (Multi-story stepped L-shape)
  createArchitecturalBlock(22, 10, 12, 12, 0.6, 12, { floors: 4, hasHVAC: true });
  createArchitecturalBlock(14, 12.5, 10, 16, 0.6, 2, { floors: 5, hasHVAC: true });

  // BLOCK B: Science & Computer Labs Wing
  createArchitecturalBlock(18, 9, 10, 14, 0.6, -14, { floors: 4 });

  // Glass Sky-Bridge connecting Block A and Block B
  const skybridgeGeo = new THREE.BoxGeometry(4.5, 2.8, 16);
  const skybridgeMesh = new THREE.Mesh(skybridgeGeo, materials.glass);
  skybridgeMesh.position.set(15, 6.5, -3);
  campusGroup.add(registerMesh(skybridgeMesh, materials.glass, blueprintMaterials.glass));

  // Skybridge steel framing supports
  const bridgePillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 8), materials.concrete);
  bridgePillar1.position.set(13.5, 2.5, -3);
  campusGroup.add(registerMesh(bridgePillar1, materials.concrete));

  const bridgePillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 8), materials.concrete);
  bridgePillar2.position.set(16.5, 2.5, -3);
  campusGroup.add(registerMesh(bridgePillar2, materials.concrete));

  // BLOCK C: Dr. B.R. Ambedkar Auditorium (Distinct modern architectural massing)
  const audiGroup = new THREE.Group();
  audiGroup.position.set(-14, 0.6, -10);

  // Main acoustic shell volume
  const audiMainGeo = new THREE.BoxGeometry(16, 8.5, 14);
  const audiMainMesh = new THREE.Mesh(audiMainGeo, materials.brickAccent);
  audiMainMesh.position.y = 4.25;
  audiGroup.add(registerMesh(audiMainMesh, materials.brickAccent));

  // Curved entrance glass facade
  const audiGlassGeo = new THREE.CylinderGeometry(7, 7, 7, 24, 1, false, 0, Math.PI);
  const audiGlassMesh = new THREE.Mesh(audiGlassGeo, materials.glass);
  audiGlassMesh.rotation.y = Math.PI / 2;
  audiGlassMesh.position.set(8.1, 3.5, 0);
  audiGroup.add(registerMesh(audiGlassMesh, materials.glass, blueprintMaterials.glass));

  // Angular entrance canopy
  const canopyGeo = new THREE.BoxGeometry(5, 0.3, 10);
  const canopyMesh = new THREE.Mesh(canopyGeo, materials.concrete);
  canopyMesh.position.set(9.5, 3.8, 0);
  audiGroup.add(registerMesh(canopyMesh, materials.concrete));

  campusGroup.add(audiGroup);

  // BLOCK D: Digital Library & Administrative Wing
  createArchitecturalBlock(14, 7.5, 12, -14, 0.6, 12, { floors: 3 });

  // BLOCK E: Indoor Sports Arena & Gymnasium
  const sportsGroup = new THREE.Group();
  sportsGroup.position.set(-18, 0.6, 24);

  const sportsGeo = new THREE.BoxGeometry(18, 6, 12);
  const sportsMesh = new THREE.Mesh(sportsGeo, materials.concrete);
  sportsMesh.position.y = 3;
  sportsGroup.add(registerMesh(sportsMesh, materials.concrete));

  // Blue barrel vault roof
  const roofGeo = new THREE.CylinderGeometry(6, 6, 18.2, 16, 1, false, 0, Math.PI);
  const roofMesh = new THREE.Mesh(roofGeo, materials.brickAccent);
  roofMesh.rotation.z = Math.PI / 2;
  roofMesh.position.set(0, 6, 0);
  sportsGroup.add(registerMesh(roofMesh, materials.brickAccent));

  campusGroup.add(sportsGroup);

  // Outdoor Basketball & Tennis Synthetic Court
  const courtGeo = new THREE.BoxGeometry(16, 0.62, 10);
  const courtMesh = new THREE.Mesh(courtGeo, materials.sportsTurf);
  courtMesh.position.set(-20, 0.31, 6);
  campusGroup.add(registerMesh(courtMesh, materials.sportsTurf));

  // --- 5. Central Stepped Amphitheater (OAT - Open Air Theater) ---
  const amphitheaterGroup = new THREE.Group();
  amphitheaterGroup.position.set(0, 0.6, 0);

  // Concentric stepped tiers
  const tierCount = 5;
  for (let t = 0; t < tierCount; t++) {
    const innerRadius = 4.5 + t * 1.1;
    const outerRadius = 5.4 + t * 1.1;
    const tierGeo = new THREE.RingGeometry(innerRadius, outerRadius, 32, 1, 0, Math.PI * 1.6);
    const tierMesh = new THREE.Mesh(tierGeo, materials.concrete);
    tierMesh.rotation.x = -Math.PI / 2;
    tierMesh.position.y = t * 0.22;
    amphitheaterGroup.add(registerMesh(tierMesh, materials.concrete));

    // Vertical riser
    const riserGeo = new THREE.CylinderGeometry(innerRadius, innerRadius, 0.22, 32, 1, true, 0, Math.PI * 1.6);
    const riserMesh = new THREE.Mesh(riserGeo, materials.brickPrimary);
    riserMesh.position.y = t * 0.22 - 0.11;
    amphitheaterGroup.add(registerMesh(riserMesh, materials.brickPrimary));
  }

  // Circular Center Stage
  const stageGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.3, 32);
  const stageMesh = new THREE.Mesh(stageGeo, materials.brickAccent);
  stageMesh.position.y = 0.15;
  amphitheaterGroup.add(registerMesh(stageMesh, materials.brickAccent));

  campusGroup.add(amphitheaterGroup);

  // --- 6. 250 kWp Rooftop Solar Arrays ---
  const solarArraysGroup = new THREE.Group();
  // Array on Block A
  const rows = 3;
  const cols = 5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const panelGeo = new THREE.BoxGeometry(1.6, 0.08, 1.0);
      const panelMesh = new THREE.Mesh(panelGeo, materials.solarCell);
      panelMesh.rotation.x = -0.25; // 15 deg tilt toward south
      panelMesh.position.set(5.5 + c * 2.0, 10.9, 8.5 + r * 1.6);
      solarArraysGroup.add(registerMesh(panelMesh, materials.solarCell));
    }
  }
  campusGroup.add(solarArraysGroup);

  // --- 7. Campus Landscape Trees (Low-Poly Stylized) ---
  function createLowPolyTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0.6, z);
    treeGroup.scale.set(scale, scale, scale);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.8, 6);
    const trunkMesh = new THREE.Mesh(trunkGeo, materials.trunk);
    trunkMesh.position.y = 0.9;
    treeGroup.add(registerMesh(trunkMesh, materials.trunk));

    // Foliage cones (2 tiers)
    const folGeo1 = new THREE.ConeGeometry(1.6, 2.2, 7);
    const folMesh1 = new THREE.Mesh(folGeo1, materials.foliage);
    folMesh1.position.y = 2.4;
    treeGroup.add(registerMesh(folMesh1, materials.foliage));

    const folGeo2 = new THREE.ConeGeometry(1.2, 1.8, 7);
    const folMesh2 = new THREE.Mesh(folGeo2, materials.foliage);
    folMesh2.position.y = 3.6;
    treeGroup.add(registerMesh(folMesh2, materials.foliage));

    campusGroup.add(treeGroup);
  }

  // Plant trees along pathways and courtyard perimeter
  const treeCoords = [
    [-6, -8, 1.1], [-8, -6, 0.9], [-4, -16, 1.2],
    [-2, 12, 1.0], [-6, 14, 0.85], [-4, 20, 1.15],
    [4, -18, 1.0], [8, -20, 1.2], [14, -24, 0.9],
    [-24, -8, 1.1], [-26, 4, 1.0], [-25, 16, 1.2],
    [26, 10, 1.1], [26, -4, 1.0], [25, -16, 1.1]
  ];
  treeCoords.forEach(([x, z, s]) => createLowPolyTree(x, z, s));

  // --- 8. Campus Entrance Monument & Flagpole ---
  const signPillarGeo = new THREE.BoxGeometry(6, 1.8, 0.8);
  const signPillar = new THREE.Mesh(signPillarGeo, materials.brickAccent);
  signPillar.position.set(0, 1.5, 30);
  campusGroup.add(registerMesh(signPillar, materials.brickAccent));

  // Flagpole
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 10, 8);
  const poleMesh = new THREE.Mesh(poleGeo, materials.concrete);
  poleMesh.position.set(4, 5.6, 28);
  campusGroup.add(registerMesh(poleMesh, materials.concrete));

  // Flag
  const flagGeo = new THREE.PlaneGeometry(1.8, 1.1);
  const flagMat = new THREE.MeshStandardMaterial({
    color: 0xff9933, // Tiranga Saffron
    side: THREE.DoubleSide
  });
  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.position.set(4.9, 9.8, 28);
  campusGroup.add(flagMesh);

  // --- 9. Interactive 3D Hotspot Markers ---
  campusLandmarks.forEach((landmark) => {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(...landmark.position);
    markerGroup.userData = {
      isHotspot: true,
      landmarkData: landmark
    };

    // Inner glowing diamond pin
    const pinGeo = new THREE.OctahedronGeometry(0.55, 0);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // DDUC crimson
      emissive: 0x991b1b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.y = 1.0;
    markerGroup.add(pinMesh);

    // Vertical stalk
    const stalkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8);
    const stalkMat = new THREE.MeshBasicMaterial({ color: 0xf87171 });
    const stalkMesh = new THREE.Mesh(stalkGeo, stalkMat);
    stalkMesh.position.y = 0.5;
    markerGroup.add(stalkMesh);

    // Outer pulsing concentric ring
    const ringGeo = new THREE.RingGeometry(0.6, 0.85, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.05;
    markerGroup.add(ringMesh);

    campusGroup.add(markerGroup);
    hotspotMeshes.push({
      group: markerGroup,
      pin: pinMesh,
      ring: ringMesh,
      stalk: stalkMesh,
      data: landmark
    });
  });

  scene.add(campusGroup);

  // Animation ticker for hotspots and gentle campus movement
  function updateCampus(time) {
    // Animate hotspot pins (spin + bob + ring pulse)
    hotspotMeshes.forEach((h, idx) => {
      h.pin.rotation.y = time * 2.0 + idx;
      h.pin.position.y = 1.0 + Math.sin(time * 3.0 + idx) * 0.15;

      // Pulsing wave on floor ring
      const scale = 1.0 + Math.sin(time * 3.5 + idx) * 0.35;
      h.ring.scale.set(scale, scale, 1);
      h.ring.material.opacity = 0.7 - (scale - 1.0) * 0.9;
    });

    // Wave flag gently
    flagMesh.rotation.y = Math.sin(time * 4) * 0.2;
  }

  // Dynamic Blueprint Switcher
  function setBlueprint(enabled) {
    isBlueprintMode = enabled;
    campusGroup.traverse((child) => {
      if (child.isMesh && child.userData && child.userData.normalMaterial) {
        child.material = enabled
          ? child.userData.blueprintMaterial || blueprintMaterials.primary
          : child.userData.normalMaterial;
      }
    });

    // Adjust hotspots for blueprint visibility
    hotspotMeshes.forEach((h) => {
      if (enabled) {
        h.pin.material.color.setHex(0x00f2ff);
        h.pin.material.emissive.setHex(0x00c8ff);
        h.stalk.material.color.setHex(0x00f2ff);
        h.ring.material.color.setHex(0x00f2ff);
      } else {
        h.pin.material.color.setHex(0xef4444);
        h.pin.material.emissive.setHex(0x991b1b);
        h.stalk.material.color.setHex(0xf87171);
        h.ring.material.color.setHex(0xef4444);
      }
    });
  }

  return {
    campusGroup,
    hotspotMeshes,
    update: updateCampus,
    setBlueprintMode: setBlueprint
  };
}
