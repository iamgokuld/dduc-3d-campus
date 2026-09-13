// DDUC Campus Data & Landmark Metadata
export const campusLandmarks = [
  {
    id: "auditorium",
    name: "Dr. B.R. Ambedkar Auditorium",
    category: "Culture & Events",
    position: [-10, 3, -8],
    stats: "400 Seats • Dolby Acoustic Treatment • Green Rooms",
    description: "The premier cultural hub of DDUC, hosting annual fests (Kalrav), national symposiums, model UNs, and theatrical productions.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    features: ["Acoustically tuned shell", "Motorized rigging & stage lighting", "Centrally air conditioned", "VIP reception lounge"]
  },
  {
    id: "amphitheater",
    name: "Central Amphitheater & Courtyard",
    category: "Student Life",
    position: [0, 1.2, 0],
    stats: "1,200 Capacity • Stepped Terraces • Open Sky",
    description: "The vibrant heartbeat of student camaraderie where street play society Yugma rehearses, musical jams unfold, and casual discussions thrive.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    features: ["Acoustic radial stepped seating", "Lush surrounding native lawns", "Night floodlighting", "Direct access to Academic Wings"]
  },
  {
    id: "library",
    name: "RFID Automated Digital Library",
    category: "Academic Resource",
    position: [12, 4, -6],
    stats: "50,000+ Books • 3 Floors • N-LIST & DELNET Access",
    description: "A state-of-the-art automated knowledge repository with RFID self-checkouts, digital audio-visual labs, and 250+ dedicated research carrels.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    features: ["Koha integrated ILMS with RFID kiosks", "High-speed IEEE & JSTOR database terminals", "Centrally climate-controlled reading halls", "Differently-abled friendly Braille workstations"]
  },
  {
    id: "academic_wing",
    name: "Main Academic Complex & Labs",
    category: "Research & Pedagogy",
    position: [8, 5, 10],
    stats: "64 Smart Classrooms • 18 Advanced Laboratories",
    description: "Interconnected multi-storey red brick wings featuring smart interactive boards, IoT/Robotics labs, instrumentation centers, and faculty chambers.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    features: ["State-of-the-art CS, Physics & Chemistry labs", "Ducted Central Air Cooling", "Glass connector sky-bridges", "Ergonomic lecture theater seating"]
  },
  {
    id: "sports_complex",
    name: "Indoor Sports Complex & Arena",
    category: "Athletics",
    position: [-14, 2.5, 6],
    stats: "Wooden Badminton Courts • Table Tennis Hall • Gym",
    description: "Olympic-grade wooden indoor badminton courts, gymnasium with cardiovascular fitness equipment, and dedicated martial arts zones.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    features: ["Synthetic indoor badminton court flooring", "Full pneumatic gym circuit", "Table tennis championship tables", "Archery & outdoor cricket turf"]
  },
  {
    id: "solar_grid",
    name: "250 kWp Rooftop Solar Grid",
    category: "Green Campus",
    position: [4, 7, 2],
    stats: "100% Green Energy • Zero Net Carbon Footprint",
    description: "A benchmark of ecological stewardship, powering 100% of the campus's energy needs alongside full rainwater percolation systems.",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    features: ["250 kWp solar photovoltaic array", "Annual carbon offset of 320 tons", "Complete rainwater harvesting aquifer recharge", "Dual zero-discharge sewage recycling plant"]
  }
];

export const departmentData = [
  {
    id: "cs",
    name: "Computer Science",
    degrees: ["B.Sc. (Hons.) Computer Science"],
    facultyCount: 16,
    labsCount: 5,
    highlights: "Equipped with NVIDIA GPU deep learning servers, Apple Mac development lab, IoT sensor kits, and active open-source society (Sanganika).",
    careerPaths: ["Software Engineering", "AI/ML Research", "Cloud Architecture", "Data Science"],
    topRecruiters: ["DE Shaw", "Deloitte", "TresVista", "Wipro"],
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: "math",
    name: "Mathematical Sciences",
    degrees: ["B.Sc. (Hons.) Mathematics"],
    facultyCount: 14,
    labsCount: 2,
    highlights: "Rigorous focus on Pure & Applied Mathematics, Numerical Analysis, Cryptography, and Mathematical Modeling with Mathematica & MATLAB.",
    careerPaths: ["Actuarial Science", "Quantitative Finance", "Data Analytics", "Academia"],
    topRecruiters: ["EY India", "KPMG", "WNS Global", "Aon Hewitt"],
    color: "from-amber-600 to-red-700"
  },
  {
    id: "commerce",
    name: "Commerce & Management",
    degrees: ["B.Com. (Hons.)", "Bachelor of Management Studies (BMS)"],
    facultyCount: 18,
    labsCount: 2,
    highlights: "Consistently ranked among DU's premier management faculties. Case study methodology, Bloomberg Terminal exposure, and annual fin-tech conclaves.",
    careerPaths: ["Investment Banking", "Management Consulting", "Corporate Finance", "Chartered Accountancy"],
    topRecruiters: ["DE Shaw", "PwC", "Bain & Company (Capability Network)", "Genpact"],
    color: "from-emerald-600 to-teal-800"
  },
  {
    id: "physical_sciences",
    name: "Physics & Chemistry",
    degrees: ["B.Sc. (Hons.) Physics", "B.Sc. (Hons.) Chemistry", "B.Sc. Physical Sciences"],
    facultyCount: 24,
    labsCount: 8,
    highlights: "Research-grade spectroscopic equipment, UV-Vis spectrometers, Darkroom optics lab, and continuous DRDO/DST sponsored student research projects.",
    careerPaths: ["Material Science", "Nanotechnology", "Renewable Energy Research", "Semiconductors"],
    topRecruiters: ["Sun Pharma", "BARC Fellowships", "IIT Research Scholars", "Reliance Life Sciences"],
    color: "from-purple-600 to-pink-700"
  },
  {
    id: "life_sciences",
    name: "Botany & Zoology",
    degrees: ["B.Sc. (Hons.) Botany", "B.Sc. (Hons.) Zoology", "B.Sc. Life Sciences"],
    facultyCount: 20,
    labsCount: 6,
    highlights: "Automated climate-controlled greenhouse, tissue culture facility, museum of natural specimens, and herbal medicinal botanical gardens.",
    careerPaths: ["Biotechnology", "Genomics", "Environmental Conservation", "Pharmaceuticals"],
    topRecruiters: ["BioCon", "Dr. Reddy's", "WII Dehradun", "Genei Labs"],
    color: "from-green-600 to-emerald-700"
  },
  {
    id: "humanities",
    name: "Humanities & Languages",
    degrees: ["B.A. (Hons.) English", "B.A. Programme"],
    facultyCount: 12,
    labsCount: 1,
    highlights: "Digital language lab with phonetic training software, creative writing masterclasses, and prestigious student literary journal 'Reflections'.",
    careerPaths: ["Journalism & Media", "Publishing", "Civil Services (UPSC)", "Content Strategy"],
    topRecruiters: ["Penguin Random House", "NDTV", "Edelman", "Teach For India"],
    color: "from-rose-600 to-crimson-800"
  }
];

export const placementStats = {
  highestCTC: "₹21.5 LPA",
  averageCTC: "₹7.2 LPA",
  medianCTC: "₹6.8 LPA",
  recruitersCount: "140+",
  offersCount: "320+",
  topRecruitersList: [
    { name: "D. E. Shaw & Co.", role: "Financial Operations & Tech", ctc: "₹21.5 LPA" },
    { name: "Deloitte USI", role: "Risk Advisory & Tech Analyst", ctc: "₹9.0 LPA" },
    { name: "KPMG", role: "Audit & Forensic Accounting", ctc: "₹8.2 LPA" },
    { name: "PwC India", role: "Tax & Technology Advisory", ctc: "₹8.0 LPA" },
    { name: "TresVista", role: "Financial Analyst", ctc: "₹8.5 LPA" },
    { name: "Ernst & Young", role: "Assurance & Consulting", ctc: "₹7.8 LPA" },
    { name: "Willis Towers Watson", role: "Actuarial & Benefits Analyst", ctc: "₹7.5 LPA" },
    { name: "Wipro Technologies", role: "Software Project Engineer", ctc: "₹6.5 LPA" }
  ]
};
