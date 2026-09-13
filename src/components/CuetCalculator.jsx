import React, { useState, useMemo, useEffect } from "react";
import DDUC_CUTOFF_DATA from "../data/dducCutoffs2026.json";

// Category options mapping
export const CATEGORIES = [
  { id: "UR", label: "UR / Unreserved", short: "UR" },
  { id: "OBC", label: "OBC-NCL", short: "OBC" },
  { id: "SC", label: "Scheduled Caste", short: "SC" },
  { id: "ST", label: "Scheduled Tribe", short: "ST" },
  { id: "EWS", label: "Economically Weaker", short: "EWS" },
  { id: "PwBD", label: "PwBD", short: "PwBD" },
  { id: "KM", label: "Kashmiri Migrant", short: "KM" },
  { id: "SGC", label: "Single Girl Child", short: "SGC" },
  { id: "Orphan_F", label: "Orphan (Female)", short: "Orphan F" },
  { id: "Orphan_M", label: "Orphan (Male)", short: "Orphan M" }
];

export const ROUNDS = [
  { id: "round1", label: "Round 01", sub: "First Allocation" },
  { id: "round2", label: "Round 02", sub: "Second Allocation" },
  { id: "spot", label: "Spot Round", sub: "Mop-Up Quota" }
];

export default function CuetCalculator() {
  const [selectedCourseName, setSelectedCourseName] = useState("B.Com. (Hons.)");
  const [selectedOptionId, setSelectedOptionId] = useState("opt1");
  const [selectedCategory, setSelectedCategory] = useState("UR");
  const [selectedRound, setSelectedRound] = useState("round1");

  const [scores, setScores] = useState({ 0: 215, 1: 220, 2: 210, 3: 205 });
  const [qualifyingLangScore, setQualifyingLangScore] = useState(165);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const activeCourse = DDUC_CUTOFF_DATA[selectedCourseName] || DDUC_CUTOFF_DATA["B.Com. (Hons.)"];

  const activeOption = useMemo(() => {
    if (activeCourse.hasOptions && activeCourse.options) {
      return activeCourse.options.find((o) => o.id === selectedOptionId) || activeCourse.options[0];
    }
    return null;
  }, [activeCourse, selectedOptionId]);

  const activeSubjectList = useMemo(() => {
    if (activeOption) return activeOption.subjects || ["Subject 1", "Subject 2", "Subject 3", "Subject 4"];
    if (activeCourse.subjects) return activeCourse.subjects;
    return ["Language / Domain 1", "Domain 2", "Domain 3", "Domain 4"];
  }, [activeCourse, activeOption]);

  const activeMaxMarks = activeOption ? activeOption.maxMarks : activeCourse.maxMarks;
  const activeSubjectCount = activeOption ? activeOption.countedSubjects : activeCourse.countedSubjects;

  useEffect(() => {
    setScores((prev) => {
      const next = { ...prev };
      for (let i = 0; i < activeSubjectCount; i++) {
        if (next[i] === undefined) next[i] = 200;
      }
      return next;
    });
  }, [activeSubjectCount]);

  const totalScore = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < activeSubjectCount; i++) {
      sum += scores[i] !== undefined ? Number(scores[i]) : 0;
    }
    return sum;
  }, [scores, activeSubjectCount]);

  const isLanguageDisqualified = useMemo(() => {
    if (activeCourse.requiresLanguageQualifying) {
      return qualifyingLangScore < 75;
    }
    return false;
  }, [activeCourse, qualifyingLangScore]);

  const activeRoundCutoffs = activeCourse[selectedRound] || {};
  const targetCutoff = activeRoundCutoffs[selectedCategory];
  const hasSeatAllocated = targetCutoff !== null && targetCutoff !== undefined;
  const delta = hasSeatAllocated ? totalScore - targetCutoff : null;
  const isQualified = hasSeatAllocated && delta >= 0 && !isLanguageDisqualified;

  const handleReset = () => {
    const defaultScore = Math.round((activeMaxMarks / activeSubjectCount) * 0.85);
    const resetObj = {};
    for (let i = 0; i < activeSubjectCount; i++) {
      resetObj[i] = defaultScore;
    }
    setScores(resetObj);
    setQualifyingLangScore(165);
  };

  const handleCopyReport = () => {
    const report = `// DEEN DAYAL UPADHYAYA COLLEGE (DU) // ADMISSION TELEMETRY REPORT
Course: ${selectedCourseName} ${activeOption ? `(${activeOption.label})` : ""}
Category: ${selectedCategory} | Round: ${ROUNDS.find((r) => r.id === selectedRound)?.label}
Total Merit Score: ${totalScore} / ${activeMaxMarks} (${((totalScore / activeMaxMarks) * 100).toFixed(2)}%)
DDUC Closing Cutoff: ${hasSeatAllocated ? targetCutoff.toFixed(4) : "No Seat Allocated"}
Verdict: ${
      isLanguageDisqualified
        ? "DISQUALIFIED (Failed 30% Language Qualifying Threshold)"
        : hasSeatAllocated
        ? delta >= 0
          ? `QUALIFIED / ADMISSION LIKELY (+${delta.toFixed(2)} marks)`
          : `AWAY FROM CUTOFF (${delta.toFixed(2)} marks)`
        : "SEAT QUOTA EXHAUSTED / UNALLOCATED"
    }
Generated via DDUC CUET Telemetry Engine // University of Delhi`;

    navigator.clipboard.writeText(report).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2600);
    });
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] font-sans antialiased p-4 lg:p-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="font-mono text-xs text-[#67E8F9] tracking-widest uppercase mb-1">
              // ADMISSION_TELEMETRY_ENGINE • DEEN DAYAL UPADHYAYA COLLEGE
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight uppercase">
              CUET DU Merit & Cutoff Telemetry
            </h1>
          </div>
          <div className="font-mono text-xs text-slate-400 text-right">
            <div>UNIVERSITY OF DELHI // 2026</div>
            <div className="text-[#67E8F9]">[DDUC_DWARKA_CAMPUS]</div>
          </div>
        </div>

        {/* Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (8 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Course Selector */}
            <div className="bg-[#0E1015]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <label className="block font-mono text-xs text-slate-400 mb-2 uppercase">
                Select Degree Program
              </label>
              <select
                value={selectedCourseName}
                onChange={(e) => {
                  setSelectedCourseName(e.target.value);
                  setSelectedOptionId("opt1");
                }}
                className="w-full bg-[#08090C] border border-white/20 rounded-xl px-4 py-3 font-sans text-sm font-semibold text-white focus:outline-none focus:border-[#67E8F9]"
              >
                {Object.keys(DDUC_CUTOFF_DATA).map((name) => (
                  <option key={name} value={name}>
                    {name} ({DDUC_CUTOFF_DATA[name].maxMarks} Marks)
                  </option>
                ))}
              </select>

              {/* Options pills if program has options */}
              {activeCourse.hasOptions && activeCourse.options && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="font-mono text-xs text-slate-400 block mb-2">CRITERIA COMBINATION</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCourse.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`p-3 rounded-xl text-left border transition ${
                          selectedOptionId === opt.id
                            ? "bg-[#67E8F9]/10 border-[#67E8F9] text-white"
                            : "bg-[#08090C] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="font-mono text-xs font-bold uppercase">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rounds & Categories */}
            <div className="bg-[#0E1015]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-2 uppercase">Allocation Round</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROUNDS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRound(r.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        selectedRound === r.id
                          ? "bg-[#67E8F9]/10 border-[#67E8F9] text-white shadow-lg shadow-[#67E8F9]/10"
                          : "bg-[#08090C] border-white/10 text-slate-400"
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">{r.label}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-2 uppercase">Reservation Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-2 rounded-lg font-mono text-xs font-semibold border transition ${
                        selectedCategory === cat.id
                          ? "bg-white text-black border-white shadow-md"
                          : "bg-[#08090C] border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.short}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Marks Sliders */}
            <div className="bg-[#0E1015]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-[#67E8F9] tracking-wider uppercase">
                  Subject Marks Input (0 - 250 Each)
                </span>
                <button onClick={handleReset} className="font-mono text-xs text-slate-400 hover:text-[#67E8F9]">
                  Reset All
                </button>
              </div>

              {/* B.Sc Qualifying Language Slider */}
              {activeCourse.requiresLanguageQualifying && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <div>
                      <span className="font-mono font-bold text-white">Language Qualifying Paper</span>
                      <span className="ml-2 text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded">
                        MIN 30% (75)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#67E8F9]">{qualifyingLangScore} / 250</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    value={qualifyingLangScore}
                    onChange={(e) => setQualifyingLangScore(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Domain Subjects Sliders */}
              <div className="space-y-4">
                {activeSubjectList.map((name, idx) => {
                  const val = scores[idx] !== undefined ? scores[idx] : 200;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/5">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-white">{name}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="250"
                            value={val}
                            onChange={(e) => {
                              const n = Math.min(250, Math.max(0, Number(e.target.value) || 0));
                              setScores((prev) => ({ ...prev, [idx]: n }));
                            }}
                            className="w-16 bg-[#08090C] border border-white/20 rounded px-2 py-0.5 text-right font-mono text-xs text-white"
                          />
                          <span className="font-mono text-slate-500">/ 250</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="250"
                        value={val}
                        onChange={(e) => setScores((prev) => ({ ...prev, [idx]: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Verdict Panel (5 Cols) */}
          <div className="lg:col-span-5 sticky top-20">
            <div
              className={`bg-[#0E1015]/90 backdrop-blur-2xl rounded-3xl p-7 border shadow-2xl transition ${
                isLanguageDisqualified
                  ? "border-red-500/50 shadow-red-950/40"
                  : isQualified
                  ? "border-emerald-500/50 shadow-emerald-950/40"
                  : "border-white/10"
              }`}
            >
              <div className="font-mono text-xs text-slate-400 tracking-wider mb-2">// MERIT VERDICT</div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-mono font-black text-white">{totalScore.toFixed(2)}</span>
                <span className="text-slate-400 font-mono text-sm">/ {activeMaxMarks}</span>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 mb-6 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Closing Cutoff:</span>
                  <span className="text-white font-bold">
                    {hasSeatAllocated ? targetCutoff.toFixed(4) : "No Seat Allocated"}
                  </span>
                </div>
                {hasSeatAllocated && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-slate-400">Delta Score:</span>
                    <span className={`font-bold ${delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)} marks
                    </span>
                  </div>
                )}
              </div>

              {/* Status Banner */}
              <div className="mb-6">
                {isLanguageDisqualified ? (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-center font-mono text-xs text-red-300">
                    DISQUALIFIED ON LANGUAGE CRITERIA (&lt;30%)
                  </div>
                ) : !hasSeatAllocated ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center font-mono text-xs text-slate-300">
                    NO SEAT ALLOCATED IN THIS ROUND
                  </div>
                ) : delta >= 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center font-mono text-xs text-emerald-300">
                    QUALIFIED // ADMISSION LIKELY (+{delta.toFixed(2)})
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-center font-mono text-xs text-red-300">
                    AWAY FROM CUTOFF ({delta.toFixed(2)})
                  </div>
                )}
              </div>

              <button
                onClick={handleCopyReport}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 font-mono text-xs text-white transition"
              >
                {copiedToast ? "Copied Telemetry Report!" : "Copy Official Verdict"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
