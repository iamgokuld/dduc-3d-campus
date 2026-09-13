// Main Application Orchestrator for DDUC 3D Campus Experience
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { campusLandmarks, departmentData, placementStats } from "./tourData.js";
import { coursesCatalog, calculateEligibility } from "./calculator.js";
import { createDDUCCampus } from "./campusModel.js";
import { createAtmosphere } from "./atmosphere.js";
import { setupCameraRig } from "./cameraRig.js";
import { createAmbientAudio } from "./audioAmbience.js";

// --- State Variables ---
let scene, camera, renderer, controls;
let campus, atmosphere, cameraRig, audioAmbience;
let isBlueprintMode = false;
let isFreeOrbit = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);
let hoveredHotspot = null;

// --- Initialize Application ---
document.addEventListener("DOMContentLoaded", () => {
  initLoadingSequence();
  initThreeScene();
  initDOMComponents();
  initCalculator();
});

// 1. Loading Progress Simulation
function initLoadingSequence() {
  const progressBar = document.getElementById("loader-progress");
  const statusText = document.getElementById("loader-status");
  const loaderOverlay = document.getElementById("loader-overlay");

  const steps = [
    { progress: "25%", text: "Building DDUC Dwarka Architectural Volumes..." },
    { progress: "55%", text: "Simulating Solar Photovoltaic Grid & Terracotta Facades..." },
    { progress: "80%", text: "Igniting Golden Delhi Sunset Rim Lights & Dust Particles..." },
    { progress: "100%", text: "Calibrating 60 FPS Camera Rig..." }
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      progressBar.style.width = steps[currentStep].progress;
      statusText.textContent = steps[currentStep].text;
      currentStep++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        loaderOverlay.classList.add("fade-out");
      }, 400);
    }
  }, 220);
}

// 2. Three.js Scene Setup
function initThreeScene() {
  const canvas = document.getElementById("webgl-container");

  // Check WebGL availability
  try {
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
    if (!gl) throw new Error("WebGL Not Supported");
  } catch (err) {
    showWebGLFallback();
    return;
  }

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);
  scene.fog = new THREE.FogExp2(0x020617, 0.012);

  // Camera
  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.5, 300);
  camera.position.set(34, 26, 34);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // OrbitControls (Disengaged initially for ScrollTrigger)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera sinking under ground
  controls.minDistance = 8;
  controls.maxDistance = 90;
  controls.enabled = false;

  // Build Subsystems
  campus = createDDUCCampus(scene);
  atmosphere = createAtmosphere(scene);
  audioAmbience = createAmbientAudio();

  // Camera Rig & GSAP Scroll integration
  cameraRig = setupCameraRig(
    camera,
    campus.campusGroup,
    (sectionIndex) => {
      // Callback on section change
      updateActiveSectionUI(sectionIndex);
    },
    (blueprintActive, source) => {
      // Sync blueprint state
      if (source === "scroll") {
        setBlueprintMode(blueprintActive, false);
      }
    }
  );

  if (window.gsap && window.ScrollTrigger) {
    cameraRig.initScrollTrigger(window.gsap, window.ScrollTrigger);
  }

  // Window Resize
  window.addEventListener("resize", onWindowResize);

  // Raycasting & Hotspot Pointer Detection
  window.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("click", onCanvasClick);

  // Start Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (isFreeOrbit) {
      controls.update();
    } else {
      cameraRig.update(delta, time);
    }

    campus.update(time);
    atmosphere.update(time);

    updateHotspotRaycasting();
    renderer.render(scene, camera);
  }

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 3. Pointer Raycasting for 3D Hotspot Pins
function onPointerMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function updateHotspotRaycasting() {
  if (!campus || !campus.hotspotMeshes) return;

  raycaster.setFromCamera(mouse, camera);
  const targetMeshes = campus.hotspotMeshes.map((h) => h.pin);
  const intersects = raycaster.intersectObjects(targetMeshes);

  const tooltip = document.getElementById("hotspot-tooltip");

  if (intersects.length > 0) {
    const hitPin = intersects[0].object;
    const hitHotspot = campus.hotspotMeshes.find((h) => h.pin === hitPin);

    if (hitHotspot) {
      hoveredHotspot = hitHotspot;
      document.body.style.cursor = "pointer";

      // Project 3D position to 2D Screen Space
      const pos3D = hitHotspot.group.position.clone().add(new THREE.Vector3(0, 1.2, 0));
      pos3D.project(camera);

      const screenX = (pos3D.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-(pos3D.y * 0.5) + 0.5) * window.innerHeight;

      // Populate tooltip
      document.getElementById("tooltip-category").textContent = hitHotspot.data.category;
      document.getElementById("tooltip-title").textContent = hitHotspot.data.name;
      document.getElementById("tooltip-stats").textContent = hitHotspot.data.stats;

      tooltip.style.left = `${screenX}px`;
      tooltip.style.top = `${screenY}px`;
      tooltip.classList.remove("hidden");
      return;
    }
  }

  hoveredHotspot = null;
  document.body.style.cursor = "default";
  tooltip.classList.add("hidden");
}

function onCanvasClick() {
  if (hoveredHotspot) {
    openLandmarkModal(hoveredHotspot.data);
    audioAmbience.playChime();
  }
}

// 4. Blueprint & Free Orbit Mode Controllers
function setBlueprintMode(enabled, manual = true) {
  isBlueprintMode = enabled;
  campus.setBlueprintMode(enabled);
  atmosphere.setBlueprintMode(enabled);

  const btnText = document.getElementById("blueprint-btn-text");
  const toggleBtn = document.getElementById("toggle-blueprint-btn");

  if (enabled) {
    document.body.classList.add("blueprint-mode");
    if (btnText) btnText.textContent = "Exit Blueprint";
    toggleBtn.classList.add("border-cyan-400", "text-cyan-300", "shadow-lg", "shadow-cyan-900/50");
  } else {
    document.body.classList.remove("blueprint-mode");
    if (btnText) btnText.textContent = "Blueprint";
    toggleBtn.classList.remove("border-cyan-400", "text-cyan-300", "shadow-lg", "shadow-cyan-900/50");
  }
}

function setFreeOrbitMode(enabled) {
  isFreeOrbit = enabled;
  controls.enabled = enabled;
  cameraRig.setFreeOrbit(enabled);

  const banner = document.getElementById("free-orbit-banner");
  if (enabled) {
    banner.classList.remove("hidden");
    controls.target.copy(cameraRig.currentLookAt);
  } else {
    banner.classList.add("hidden");
  }
}

// 5. DOM & UI Components Binding
function initDOMComponents() {
  // Blueprint button
  const blueprintBtn = document.getElementById("toggle-blueprint-btn");
  blueprintBtn.addEventListener("click", () => {
    setBlueprintMode(!isBlueprintMode, true);
    audioAmbience.playChime();
  });

  // Free Orbit button & banner exit
  const orbitBtn = document.getElementById("toggle-orbit-btn");
  const exitOrbitBtn = document.getElementById("exit-orbit-btn");
  orbitBtn.addEventListener("click", () => {
    setFreeOrbitMode(!isFreeOrbit);
    audioAmbience.playChime();
  });
  exitOrbitBtn.addEventListener("click", () => {
    setFreeOrbitMode(false);
  });

  // Audio ambience button
  const audioBtn = document.getElementById("toggle-audio-btn");
  const audioIcon = document.getElementById("audio-icon");
  audioBtn.addEventListener("click", () => {
    const isPlaying = audioAmbience.toggle();
    if (isPlaying) {
      audioIcon.setAttribute("data-lucide", "volume-2");
      audioBtn.classList.add("text-emerald-400", "border-emerald-500/50");
    } else {
      audioIcon.setAttribute("data-lucide", "volume-x");
      audioBtn.classList.remove("text-emerald-400", "border-emerald-500/50");
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // Mobile Menu
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDropdown = document.getElementById("mobile-dropdown");
  mobileMenuBtn.addEventListener("click", () => {
    mobileDropdown.classList.toggle("hidden");
    mobileDropdown.classList.toggle("flex");
    if (window.lucide) window.lucide.createIcons();
  });

  // Reset Camera View button
  const resetViewBtn = document.getElementById("reset-view-btn");
  if (resetViewBtn) {
    resetViewBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Populate Section 1: Department Tabs
  renderDepartmentTabs();

  // Populate Section 2: Facilities Grid
  renderFacilitiesGrid();

  // Populate Section 3: Recruiters Grid
  renderRecruitersGrid();

  // Modals
  initModals();
}

// 6. Department Tabs Renderer
function renderDepartmentTabs() {
  const tabsContainer = document.getElementById("dept-tabs-container");
  const cardContainer = document.getElementById("dept-card");
  if (!tabsContainer || !cardContainer) return;

  tabsContainer.innerHTML = "";

  departmentData.forEach((dept, index) => {
    const btn = document.createElement("button");
    btn.className = `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
      index === 0
        ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-900/40"
        : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500"
    }`;
    btn.textContent = dept.name;
    btn.addEventListener("click", () => {
      // Highlight selected tab
      Array.from(tabsContainer.children).forEach((child) => {
        child.className =
          "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500";
      });
      btn.className =
        "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border bg-red-600 text-white border-red-500 shadow-md shadow-red-900/40";
      renderDepartmentCard(dept);
      audioAmbience.playChime();
    });
    tabsContainer.appendChild(btn);
  });

  renderDepartmentCard(departmentData[0]);
}

function renderDepartmentCard(dept) {
  const cardContainer = document.getElementById("dept-card");
  cardContainer.innerHTML = `
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <span class="text-xs uppercase font-mono tracking-widest text-red-400">Department Overview</span>
        <h3 class="text-2xl font-bold text-white">${dept.name}</h3>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-3 py-1 rounded-xl bg-slate-800/80 border border-white/5 text-center">
          <span class="block text-xs font-mono font-bold text-cyan-400">${dept.facultyCount}</span>
          <span class="text-[10px] text-slate-400">Faculty</span>
        </div>
        <div class="px-3 py-1 rounded-xl bg-slate-800/80 border border-white/5 text-center">
          <span class="block text-xs font-mono font-bold text-amber-400">${dept.labsCount}</span>
          <span class="text-[10px] text-slate-400">Labs</span>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Degrees Awarded</h4>
      <div class="flex flex-wrap gap-2">
        ${dept.degrees
          .map(
            (deg) =>
              `<span class="px-3 py-1 rounded-lg bg-red-950/50 border border-red-800/50 text-xs text-red-200 font-medium">${deg}</span>`
          )
          .join("")}
      </div>
    </div>

    <div class="mb-6">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Infrastructure & Pedagogy</h4>
      <p class="text-xs text-slate-300 leading-relaxed">${dept.highlights}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
      <div>
        <h5 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Prime Career Pathways</h5>
        <div class="flex flex-wrap gap-1.5">
          ${dept.careerPaths
            .map(
              (path) =>
                `<span class="px-2.5 py-0.5 rounded-md bg-slate-800/70 text-[11px] text-slate-300">${path}</span>`
            )
            .join("")}
        </div>
      </div>
      <div>
        <h5 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Recruitment Partners</h5>
        <div class="flex flex-wrap gap-1.5">
          ${dept.topRecruiters
            .map(
              (rec) =>
                `<span class="px-2.5 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">${rec}</span>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// 7. Facilities Grid Renderer
function renderFacilitiesGrid() {
  const container = document.getElementById("facilities-grid");
  if (!container) return;

  container.innerHTML = campusLandmarks
    .map(
      (landmark) => `
      <div class="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40">${landmark.category}</span>
            <button class="fly-to-btn text-xs text-slate-400 hover:text-white flex items-center gap-1 transition" data-pos='${JSON.stringify(landmark.position)}'>
              <span>Fly To in 3D</span>
              <i data-lucide="navigation" class="w-3 h-3 text-red-400"></i>
            </button>
          </div>
          <h3 class="text-base font-bold text-white mb-1 group-hover:text-red-400 transition">${landmark.name}</h3>
          <p class="text-xs text-slate-400 font-mono mb-3">${landmark.stats}</p>
          <p class="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">${landmark.description}</p>
        </div>
        <button class="inspect-landmark-btn w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/5 transition flex items-center justify-center gap-1.5" data-id="${landmark.id}">
          <i data-lucide="info" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span>Inspect Architecture & Specs</span>
        </button>
      </div>
    `
    )
    .join("");

  // Attach event listeners to Fly-To and Inspect buttons
  container.querySelectorAll(".fly-to-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pos = JSON.parse(btn.getAttribute("data-pos"));
      cameraRig.flyToLandmark(pos);
      audioAmbience.playChime();
    });
  });

  container.querySelectorAll(".inspect-landmark-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const landmark = campusLandmarks.find((l) => l.id === id);
      if (landmark) {
        openLandmarkModal(landmark);
        audioAmbience.playChime();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// 8. Recruiters Grid Renderer
function renderRecruitersGrid() {
  const container = document.getElementById("recruiters-grid");
  if (!container) return;

  container.innerHTML = placementStats.topRecruitersList
    .map(
      (r) => `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-white/5 hover:border-red-500/30 transition text-center">
        <h4 class="text-xs font-bold text-white truncate mb-0.5">${r.name}</h4>
        <span class="block text-[10px] text-slate-400 truncate mb-1">${r.role}</span>
        <span class="inline-block text-[11px] font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">${r.ctc}</span>
      </div>
    `
    )
    .join("");
}

// 9. Landmark Detail Modal
function openLandmarkModal(landmark) {
  const modal = document.getElementById("tour-modal");
  const content = document.getElementById("tour-modal-content");

  content.innerHTML = `
    <div class="mb-4">
      <span class="text-[10px] uppercase font-bold tracking-wider text-red-400 px-2.5 py-1 rounded bg-red-950/70 border border-red-800/40">${landmark.category}</span>
      <h3 class="text-2xl font-bold text-white mt-2">${landmark.name}</h3>
      <p class="text-xs text-slate-400 font-mono mt-0.5">${landmark.stats}</p>
    </div>

    <div class="relative h-48 w-full rounded-2xl overflow-hidden mb-6 border border-white/10">
      <img src="${landmark.image}" alt="${landmark.name}" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <div class="absolute bottom-3 left-3 text-xs text-slate-300 font-medium flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
        <i data-lucide="camera" class="w-3.5 h-3.5 text-cyan-400"></i>
        <span>Campus Photographic Archive</span>
      </div>
    </div>

    <p class="text-xs text-slate-300 leading-relaxed mb-6">${landmark.description}</p>

    <div class="mb-6">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Architectural & Operational Highlights</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${landmark.features
          .map(
            (f) => `
          <div class="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>
            <span>${f}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
      <button id="modal-fly-to-btn" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition flex items-center gap-2">
        <i data-lucide="compass" class="w-4 h-4"></i>
        <span>Fly 3D Camera to Structure</span>
      </button>
    </div>
  `;

  modal.classList.remove("hidden");

  // Hook Fly-to button inside modal
  document.getElementById("modal-fly-to-btn").addEventListener("click", () => {
    modal.classList.add("hidden");
    cameraRig.flyToLandmark(landmark.position);
    audioAmbience.playChime();
  });

  if (window.lucide) window.lucide.createIcons();
}

function initModals() {
  // Tour Modal Close
  const tourModal = document.getElementById("tour-modal");
  const closeTourBtn = document.getElementById("close-tour-modal-btn");
  closeTourBtn.addEventListener("click", () => tourModal.classList.add("hidden"));
  tourModal.addEventListener("click", (e) => {
    if (e.target === tourModal) tourModal.classList.add("hidden");
  });

  // Hero Virtual Tour Button
  const heroTourBtn = document.getElementById("hero-virtual-tour-btn");
  const openTourMobileBtn = document.getElementById("open-tour-mobile-btn");
  [heroTourBtn, openTourMobileBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        openLandmarkModal(campusLandmarks[0]);
      });
    }
  });

  // Calculator Modal Open/Close
  const calcModal = document.getElementById("calculator-modal");
  const openCalcBtn = document.getElementById("open-calculator-btn");
  const openCalcCta = document.getElementById("open-calculator-cta");
  const heroCutoffBtn = document.getElementById("hero-cutoff-btn");
  const closeCalcBtn = document.getElementById("close-calc-modal-btn");

  [openCalcBtn, openCalcCta, heroCutoffBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        calcModal.classList.remove("hidden");
        updateCalculatorView();
      });
    }
  });

  closeCalcBtn.addEventListener("click", () => calcModal.classList.add("hidden"));
  calcModal.addEventListener("click", (e) => {
    if (e.target === calcModal) calcModal.classList.add("hidden");
  });
}

// 10. CUET Cutoff & Merit Calculator Logic
let selectedCourseId = coursesCatalog[0].id;
let selectedCategory = "UR";
let userCUETScore = 730;

function initCalculator() {
  const courseSelect = document.getElementById("calc-course-select");
  const categoryContainer = document.getElementById("calc-category-tabs");
  const slider = document.getElementById("calc-score-slider");
  const confettiBtn = document.getElementById("calc-confetti-btn");

  if (!courseSelect || !categoryContainer || !slider) return;

  // Populate course dropdown
  courseSelect.innerHTML = coursesCatalog
    .map((c) => `<option value="${c.id}">${c.name} (Max: ${c.maxMarks})</option>`)
    .join("");

  courseSelect.addEventListener("change", (e) => {
    selectedCourseId = e.target.value;
    const course = coursesCatalog.find((c) => c.id === selectedCourseId);
    slider.max = course.maxMarks;
    document.getElementById("calc-max-label").textContent = course.maxMarks;
    if (userCUETScore > course.maxMarks) {
      userCUETScore = Math.floor(course.maxMarks * 0.9);
      slider.value = userCUETScore;
    }
    updateCalculatorView();
  });

  // Populate category buttons
  const categories = ["UR", "OBC", "SC", "ST", "EWS", "PwD"];
  categoryContainer.innerHTML = categories
    .map(
      (cat, idx) => `
      <button class="calc-cat-btn py-1.5 rounded-lg text-xs font-semibold border transition ${
        idx === 0
          ? "bg-red-600 text-white border-red-500"
          : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
      }" data-cat="${cat}">
        ${cat}
      </button>
    `
    )
    .join("");

  categoryContainer.querySelectorAll(".calc-cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.getAttribute("data-cat");
      categoryContainer.querySelectorAll(".calc-cat-btn").forEach((b) => {
        b.className =
          "calc-cat-btn py-1.5 rounded-lg text-xs font-semibold border transition bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500";
      });
      btn.className =
        "calc-cat-btn py-1.5 rounded-lg text-xs font-semibold border transition bg-red-600 text-white border-red-500";
      updateCalculatorView();
      audioAmbience.playChime();
    });
  });

  // Slider change
  slider.addEventListener("input", (e) => {
    userCUETScore = parseInt(e.target.value, 10);
    updateCalculatorView();
  });

  // Confetti trigger
  confettiBtn.addEventListener("click", () => {
    const res = calculateEligibility(selectedCourseId, selectedCategory, userCUETScore);
    if (res && res.diff >= 0 && window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });

  updateCalculatorView();
}

function updateCalculatorView() {
  const res = calculateEligibility(selectedCourseId, selectedCategory, userCUETScore);
  if (!res) return;

  document.getElementById("calc-score-display").textContent = `${res.userScore} / ${res.maxMarks} (${res.percentage}%)`;

  const resultBox = document.getElementById("calc-result-box");
  resultBox.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-3">
      <div>
        <span class="text-[10px] font-mono uppercase text-slate-400">Eligibility Verdict</span>
        <h4 class="text-base font-bold ${res.statusColor}">${res.status}</h4>
      </div>
      <div class="text-right">
        <span class="text-[10px] text-slate-400">Closing Cutoff</span>
        <span class="block text-xs font-mono font-bold text-white">${res.targetCutoff} (${selectedCategory})</span>
      </div>
    </div>

    <p class="text-xs text-slate-300 leading-relaxed mb-4">${res.message}</p>

    <div class="p-3 rounded-xl bg-slate-950/60 border border-white/5 mb-4">
      <div class="text-[10px] font-semibold uppercase text-slate-400 mb-1">Mandatory DU Subject Combination</div>
      <div class="text-xs text-slate-200 leading-normal">${res.subjectCriteria}</div>
    </div>

    <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
      <span>Intake Capacity: <strong class="text-white">${res.intake} Seats</strong></span>
      <span>Historical Delta: <strong class="${res.diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}">${res.diff >= 0 ? '+' : ''}${res.diff} pts</strong></span>
    </div>
  `;
}

// 11. Active Section HUD Update
function updateActiveSectionUI(index) {
  // Can be expanded to highlight current HUD link
}

// 12. WebGL Fallback Notification
function showWebGLFallback() {
  const container = document.getElementById("webgl-container");
  container.style.display = "none";

  const fallback = document.createElement("div");
  fallback.className = "fixed inset-0 z-0 bg-gradient-to-b from-slate-900 via-red-950 to-slate-950 flex items-center justify-center p-6";
  fallback.innerHTML = `
    <div class="max-w-md p-8 rounded-3xl glass-panel text-center border border-white/10">
      <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
        <i data-lucide="monitor-off" class="w-6 h-6"></i>
      </div>
      <h3 class="text-lg font-bold text-white mb-2">2D Compatibility Mode Active</h3>
      <p class="text-xs text-slate-300 leading-relaxed mb-4">
        Your browser has hardware acceleration disabled or does not support WebGL 2.0. The full institutional content, department guides, and CUET calculator remain 100% accessible.
      </p>
    </div>
  `;
  document.body.prepend(fallback);
  if (window.lucide) window.lucide.createIcons();
}
