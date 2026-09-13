// GSAP ScrollTrigger Camera Choreography & Mouse Parallax Rig
import * as THREE from "three";

export function setupCameraRig(camera, campusGroup, onSectionChange, onBlueprintChange) {
  // Camera Waypoints corresponding to the 4 sections
  const waypoints = [
    {
      // Stage 0: Hero Isometric Wide Overview
      pos: new THREE.Vector3(34, 26, 34),
      lookAt: new THREE.Vector3(0, 3, 0),
      blueprint: false
    },
    {
      // Stage 1: Academics & Research (Zoom into Academic & Science Wing)
      pos: new THREE.Vector3(14, 11, 18),
      lookAt: new THREE.Vector3(8, 5, 2),
      blueprint: false
    },
    {
      // Stage 2: Campus Life & Facilities (Sweeping low angle across Courtyard & Auditorium)
      pos: new THREE.Vector3(-18, 9, 12),
      lookAt: new THREE.Vector3(-4, 3, -4),
      blueprint: false
    },
    {
      // Stage 3: Admissions & Placements (Top-Down Architectural Blueprint Elevation)
      pos: new THREE.Vector3(2, 42, 10),
      lookAt: new THREE.Vector3(0, 0, 0),
      blueprint: true
    }
  ];

  // Current interpolated state
  const currentPos = waypoints[0].pos.clone();
  const currentLookAt = waypoints[0].lookAt.clone();
  camera.position.copy(currentPos);
  camera.lookAt(currentLookAt);

  // Mouse Parallax Coordinates (Normalized -1 to +1)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isFreeOrbit = false;

  window.addEventListener("pointermove", (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // GSAP ScrollTimeline
  let activeSectionIndex = 0;

  function initScrollTrigger(gsap, ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll(".scroll-section");
    if (!sections || sections.length === 0) return;

    // Build timeline connecting all sections
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          if (isFreeOrbit) return;

          const progress = self.progress; // 0 to 1
          const totalSegments = waypoints.length - 1;
          const scaledProgress = progress * totalSegments;
          const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
          const segmentProgress = scaledProgress - segmentIndex;

          const startWP = waypoints[segmentIndex];
          const endWP = waypoints[segmentIndex + 1];

          // Smooth interpolation between waypoints
          currentPos.lerpVectors(startWP.pos, endWP.pos, segmentProgress);
          currentLookAt.lerpVectors(startWP.lookAt, endWP.lookAt, segmentProgress);

          // Detect active section
          const newSecIndex = Math.round(scaledProgress);
          if (newSecIndex !== activeSectionIndex) {
            activeSectionIndex = newSecIndex;
            if (onSectionChange) onSectionChange(activeSectionIndex);

            // Trigger blueprint transition automatically in section 3
            if (activeSectionIndex === 3) {
              if (onBlueprintChange) onBlueprintChange(true, "scroll");
            } else {
              if (onBlueprintChange) onBlueprintChange(false, "scroll");
            }
          }
        }
      }
    });

    return tl;
  }

  // Update loop called every frame in requestAnimationFrame
  function update(delta, time) {
    if (isFreeOrbit) return;

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Apply mouse parallax to camera position and subtle rotation on campus
    const parallaxOffset = new THREE.Vector3(
      mouse.x * 2.0,
      mouse.y * 1.5,
      mouse.x * 1.5
    );

    camera.position.copy(currentPos).add(parallaxOffset);
    camera.lookAt(currentLookAt);

    // Subtle breathing/rotation of campus model for lifelike feel
    if (campusGroup) {
      campusGroup.rotation.y = mouse.x * 0.04;
      campusGroup.rotation.x = -mouse.y * 0.02;
    }
  }

  function setFreeOrbit(enabled) {
    isFreeOrbit = enabled;
  }

  function flyToLandmark(landmarkPosition) {
    const targetLook = new THREE.Vector3(...landmarkPosition);
    const targetCam = new THREE.Vector3(
      targetLook.x + 8,
      targetLook.y + 6,
      targetLook.z + 8
    );

    // Smooth tween using GSAP
    if (window.gsap) {
      window.gsap.to(currentPos, {
        x: targetCam.x,
        y: targetCam.y,
        z: targetCam.z,
        duration: 1.8,
        ease: "power2.inOut"
      });
      window.gsap.to(currentLookAt, {
        x: targetLook.x,
        y: targetLook.y,
        z: targetLook.z,
        duration: 1.8,
        ease: "power2.inOut"
      });
    }
  }

  return {
    camera,
    update,
    initScrollTrigger,
    setFreeOrbit,
    flyToLandmark,
    get currentPos() { return currentPos; },
    get currentLookAt() { return currentLookAt; },
    get isFreeOrbit() { return isFreeOrbit; }
  };
}
