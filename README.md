# Deen Dayal Upadhyaya College (DDUC), University of Delhi
## Interactive 3D WebGL Campus Landing Page

An interactive, high-performance 3D architectural landing page celebrating **Deen Dayal Upadhyaya College (DDUC), University of Delhi**, Dwarka Sector-3 campus.

Built with **Three.js, React Three Fiber aesthetics, GSAP ScrollTrigger, and Tailwind CSS**.

---

## 🏛️ Key Features & Technical Specifications

### 1. 3D Procedural Architectural Centerpiece
- **Dwarka Campus Architecture:** Captures DDUC's signature exposed red-brick geometry, multi-story academic blocks, interconnected glass sky-bridges, concrete fins, and rooftop solar arrays.
- **Dr. B.R. Ambedkar Auditorium:** Distinctive curved glass entrance and acoustic shell geometry.
- **Central Stepped Amphitheater (OAT):** Concentric stepped terraces and outdoor gathering stage.
- **250 kWp Rooftop Solar Grid:** Reflects DDUC's 100% green net-zero campus identity with angled solar photovoltaic panels.
- **Landscaped Grounds:** Courtyards, stone walkways, low-poly stylized flora, entrance monument, and flagpole.

### 2. Dual Material System: Realistic vs. Cyber Blueprint Mode
- **Institutional Realistic Mode:** Warm terracotta red brick (`#8F2D2D`), light concrete lintels (`#D6D3D1`), reflective sky-tinted architectural glass (`#7DD3FC`), and lush green lawns.
- **Cyber Blueprint / Wireframe Mode:** Seamlessly swaps all building geometry into glowing holographic cyan wireframes (`#38BDF8`) over a dark neon coordinate grid. Automatically engages during Section 3 and can also be toggled anytime from the top HUD!

### 3. GSAP ScrollTrigger Camera Choreography
- **Hero Stage:** High-angle isometric wide shot with mouse parallax tracking.
- **Section 1 (Academics):** Camera swoops down into the Academic and Science wing with floating interactive department cards.
- **Section 2 (Campus Facilities):** Low-altitude pan across the central courtyard, amphitheater, and auditorium with pulsing 3D hotspot pins.
- **Section 3 (Admissions & Placements):** Camera pulls back and elevates into a technical top-down architectural wireframe view.

### 4. Interactive 3D Hotspot Pins & Raycasting
- 6 interactive pins on key landmarks:
  - Dr. B.R. Ambedkar Auditorium
  - Central Amphitheater & Courtyard
  - RFID Automated Digital Library
  - Main Academic Complex & Labs
  - Indoor Sports Arena & Gymnasium
  - 250 kWp Rooftop Solar Grid
- Real-time mouse raycasting with screen-space animated tooltip tags and "Fly To" camera transitions.

### 5. Interactive UI & Admissions Engine
- **Glassmorphic Floating HUD Navbar:** Quick links, official college crest, mode toggles, and Admissions portal CTAs.
- **Free 3D Orbit Mode:** Disengages the scroll lock to allow full 360-degree orbit, pan, and zoom with Drei-style OrbitControls.
- **Interactive CUET Cutoff & Merit Estimator:** Real-time eligibility calculator across DDUC's top programs (B.Sc. Hons Computer Science, B.Com Hons, BMS, Mathematics, Physics, Chemistry, English) with category filters (UR, OBC, SC, ST, EWS, PwD), score sliders, and instantaneous eligibility verdict analysis.
- **Synthesized Ambient Audio Engine:** Web Audio API synthesizer creating soft, warm futuristic atmospheric chords and chime sound effects with zero external audio assets.

---

## 🚀 How to Run

### Quick Start (Zero Dependencies via PowerShell)
Open PowerShell in this directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
This starts an instant local HTTP server at `http://localhost:3000/` and opens your default browser automatically!

### Alternative (Vite / Node if installed)
```bash
npm install
npm run dev
```

---

## 🎨 Color Palette
- **DDUC Crimson Accent:** `#8B0000` / `#991B1B` / `#DC2626`
- **Slate Navy:** `#0F172A` / `#020617`
- **Architectural Cyan (Blueprint):** `#38BDF8` / `#06B6D4`
- **Delhi Golden Hour Sunlight:** `#F59E0B`
