// CUET Cutoff & Merit Eligibility Engine for DDUC (University of Delhi)

export const coursesCatalog = [
  {
    id: "bsc_cs",
    name: "B.Sc. (Hons.) Computer Science",
    stream: "Science & Technology",
    maxMarks: 800,
    cutoffs: {
      UR: 728,
      OBC: 685,
      SC: 620,
      ST: 560,
      EWS: 705,
      PwD: 490
    },
    intake: 60,
    subjectCriteria: "Any one language from List A + Mathematics + Any two subjects from List B1",
    previousYearTrends: [
      { round: "Round 1", score: 742 },
      { round: "Round 2", score: 735 },
      { round: "Round 3", score: 728 }
    ]
  },
  {
    id: "bcom_hons",
    name: "B.Com. (Hons.)",
    stream: "Commerce & Management",
    maxMarks: 800,
    cutoffs: {
      UR: 735,
      OBC: 690,
      SC: 625,
      ST: 550,
      EWS: 715,
      PwD: 505
    },
    intake: 154,
    subjectCriteria: "Any one language + Mathematics/Accountancy + Any two subjects from List B",
    previousYearTrends: [
      { round: "Round 1", score: 752 },
      { round: "Round 2", score: 741 },
      { round: "Round 3", score: 735 }
    ]
  },
  {
    id: "bms",
    name: "Bachelor of Management Studies (BMS)",
    stream: "Commerce & Management",
    maxMarks: 650,
    cutoffs: {
      UR: 518,
      OBC: 472,
      SC: 410,
      ST: 360,
      EWS: 495,
      PwD: 340
    },
    intake: 60,
    subjectCriteria: "Any one Language + Mathematics/Applied Mathematics + General Test (Section III)",
    previousYearTrends: [
      { round: "Round 1", score: 535 },
      { round: "Round 2", score: 524 },
      { round: "Round 3", score: 518 }
    ]
  },
  {
    id: "bsc_math",
    name: "B.Sc. (Hons.) Mathematics",
    stream: "Mathematical Sciences",
    maxMarks: 800,
    cutoffs: {
      UR: 682,
      OBC: 635,
      SC: 565,
      ST: 505,
      EWS: 660,
      PwD: 440
    },
    intake: 78,
    subjectCriteria: "Any one language + Mathematics + Any two subjects from List B1",
    previousYearTrends: [
      { round: "Round 1", score: 704 },
      { round: "Round 2", score: 692 },
      { round: "Round 3", score: 682 }
    ]
  },
  {
    id: "bsc_physics",
    name: "B.Sc. (Hons.) Physics",
    stream: "Science & Technology",
    maxMarks: 600,
    cutoffs: {
      UR: 432,
      OBC: 395,
      SC: 340,
      ST: 290,
      EWS: 415,
      PwD: 250
    },
    intake: 60,
    subjectCriteria: "Physics + Chemistry + Mathematics (30% qualifying in any one language)",
    previousYearTrends: [
      { round: "Round 1", score: 455 },
      { round: "Round 2", score: 442 },
      { round: "Round 3", score: 432 }
    ]
  },
  {
    id: "bsc_chemistry",
    name: "B.Sc. (Hons.) Chemistry",
    stream: "Science & Technology",
    maxMarks: 600,
    cutoffs: {
      UR: 420,
      OBC: 380,
      SC: 330,
      ST: 280,
      EWS: 405,
      PwD: 240
    },
    intake: 46,
    subjectCriteria: "Physics + Chemistry + Mathematics (30% qualifying in any one language)",
    previousYearTrends: [
      { round: "Round 1", score: 440 },
      { round: "Round 2", score: 428 },
      { round: "Round 3", score: 420 }
    ]
  },
  {
    id: "ba_english",
    name: "B.A. (Hons.) English",
    stream: "Humanities & Arts",
    maxMarks: 800,
    cutoffs: {
      UR: 712,
      OBC: 665,
      SC: 600,
      ST: 540,
      EWS: 690,
      PwD: 475
    },
    intake: 40,
    subjectCriteria: "English from List A + Any two subjects from List B1 + Any one from List B1/B2",
    previousYearTrends: [
      { round: "Round 1", score: 730 },
      { round: "Round 2", score: 720 },
      { round: "Round 3", score: 712 }
    ]
  }
];

export function calculateEligibility(courseId, category, userScore) {
  const course = coursesCatalog.find((c) => c.id === courseId);
  if (!course) return null;

  const targetCutoff = course.cutoffs[category] || course.cutoffs["UR"];
  const diff = userScore - targetCutoff;
  const percentage = ((userScore / course.maxMarks) * 100).toFixed(1);

  let status = "High Chance";
  let statusColor = "text-emerald-400";
  let badgeBg = "bg-emerald-500/20 border-emerald-500/40";
  let message = "Your score exceeds the projected cutoff comfortably. You have a very strong chance in Round 1/2 of CSAS allocations!";

  if (diff >= 15) {
    status = "Very High (Round 1 Likely)";
    statusColor = "text-emerald-400";
    badgeBg = "bg-emerald-500/20 border-emerald-500/50";
    message = "Outstanding score! You stand a top-tier chance of securing DDUC in the premier CSAS round.";
  } else if (diff >= 0) {
    status = "High Chance (Round 1-2)";
    statusColor = "text-teal-400";
    badgeBg = "bg-teal-500/20 border-teal-500/40";
    message = "Your score matches or marginally exceeds the previous closing cutoff. High probability of allotment.";
  } else if (diff >= -15) {
    status = "Competitive / Moderate (Round 2-3)";
    statusColor = "text-amber-400";
    badgeBg = "bg-amber-500/20 border-amber-500/40";
    message = "You are within the competitive buffer. Strong probability in Round 2, Round 3, or subsequent spot rounds.";
  } else {
    status = "Challenging / Spot Round";
    statusColor = "text-rose-400";
    badgeBg = "bg-rose-500/20 border-rose-500/40";
    message = "Current score is below the historic third-round threshold. Keep DDUC in your CSAS preference sheet for mop-up and spot rounds.";
  }

  return {
    courseName: course.name,
    userScore,
    maxMarks: course.maxMarks,
    targetCutoff,
    diff,
    percentage,
    status,
    statusColor,
    badgeBg,
    message,
    subjectCriteria: course.subjectCriteria,
    intake: course.intake,
    trends: course.previousYearTrends
  };
}
