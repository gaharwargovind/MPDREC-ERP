import React, { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Compass, 
  Clock, 
  Calculator, 
  Code2, 
  FileText, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Sliders, 
  ArrowRight,
  Printer,
  Share2
} from 'lucide-react';
import { AiArtifact, StudyRoadmapData, TimetableCountdownData, GradeSimulatorData, CodeSandboxData, OrdinanceDocData } from './types';

interface ArtifactCanvasProps {
  artifact: AiArtifact | null;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ArtifactCanvas: React.FC<ArtifactCanvasProps> = ({
  artifact,
  onClose,
  isExpanded = false,
  onToggleExpand
}) => {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'output' | 'trace'>('code');
  const [simulatedExecution, setSimulatedExecution] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<Record<number, boolean>>({ 1: true });

  // State for interactive Grade Simulator
  const [gradeData, setGradeData] = useState<GradeSimulatorData | null>(null);

  React.useEffect(() => {
    if (artifact?.type === 'grade_simulator' && artifact.data) {
      setGradeData(artifact.data as GradeSimulatorData);
    }
  }, [artifact]);

  if (!artifact) return null;

  const handleCopyMarkdown = () => {
    let content = `# ${artifact.title}\n\n${artifact.subtitle}\n\n`;
    if (artifact.type === 'code_sandbox') {
      content += `\`\`\`${(artifact.data as CodeSandboxData).language}\n${(artifact.data as CodeSandboxData).code}\n\`\`\``;
    } else {
      content += JSON.stringify(artifact.data, null, 2);
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMilestone = (week: number) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const getArtifactIcon = () => {
    switch (artifact.type) {
      case 'roadmap': return <Compass className="w-4 h-4 text-violet-400" />;
      case 'timetable_countdown': return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'grade_simulator': return <Calculator className="w-4 h-4 text-emerald-400" />;
      case 'code_sandbox': return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'ordinance_doc': return <FileText className="w-4 h-4 text-rose-400" />;
      default: return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  // SGPA Calculation Formula for interactive Grade Simulator
  const calculateSimulatedSgpa = () => {
    if (!gradeData || !gradeData.subjects) return 8.5;
    let totalCredits = 0;
    let totalWeightedPoints = 0;

    gradeData.subjects.forEach(sub => {
      // Internal is best 2 CT average (scaled to 30) + Assignment (20) = 50 marks internal
      // End sem is 100 scaled to 50
      const internalMarks = ((sub.ct1 + sub.ct2) / 2) + sub.assignment;
      const totalMarksOutOf100 = (internalMarks * 0.5) + (sub.endSem * 0.5);
      
      let gradePoint = 0;
      if (totalMarksOutOf100 >= 90) gradePoint = 10;
      else if (totalMarksOutOf100 >= 80) gradePoint = 9;
      else if (totalMarksOutOf100 >= 70) gradePoint = 8;
      else if (totalMarksOutOf100 >= 60) gradePoint = 7;
      else if (totalMarksOutOf100 >= 50) gradePoint = 6;
      else if (totalMarksOutOf100 >= 40) gradePoint = 5;
      else if (totalMarksOutOf100 >= 33) gradePoint = 4;
      else gradePoint = 0;

      totalCredits += sub.credits;
      totalWeightedPoints += (gradePoint * sub.credits);
    });

    return totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : '8.50';
  };

  const handleSubjectScoreChange = (index: number, field: 'ct1' | 'ct2' | 'assignment' | 'endSem', value: number) => {
    if (!gradeData) return;
    const newSubjects = [...gradeData.subjects];
    newSubjects[index] = {
      ...newSubjects[index],
      [field]: value
    };
    setGradeData({
      ...gradeData,
      subjects: newSubjects
    });
  };

  return (
    <div className={`flex flex-col h-full rounded-3xl bg-white dark:bg-[#0b0f19]/90 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50 bg-white/95 dark:bg-[#080b11]/95' : 'relative w-full'
    }`}>
      {/* Top Glass Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
            {getArtifactIcon()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {artifact.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 whitespace-nowrap">
                {artifact.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {artifact.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors text-xs flex items-center gap-1"
            title="Copy as Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
              title={isExpanded ? "Collapse view" : "Expand to fullscreen"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Close Canvas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* 1. ROADMAP RENDERER */}
        {artifact.type === 'roadmap' && (() => {
          const roadmap = artifact.data as StudyRoadmapData;
          const completedCount = Object.values(completedMilestones).filter(Boolean).length;
          const progressPercent = Math.round((completedCount / roadmap.milestones.length) * 100);

          return (
            <div className="space-y-6">
              {/* Header Overview Card */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-r from-violet-50 via-indigo-50/50 to-slate-50 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 border border-violet-200 dark:border-violet-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-mono text-violet-700 dark:text-violet-300 font-semibold">{roadmap.subjectCode}</span>
                  <span className="text-slate-500 dark:text-slate-400">{roadmap.estimatedWeeks} Weeks • {roadmap.targetExam}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{roadmap.subjectName}</h4>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>Preparation Progress</span>
                    <span className="text-violet-700 dark:text-violet-300 font-mono font-bold">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Weekly Target Milestones</span>
                  <span className="text-[10px] lowercase text-slate-400 dark:text-slate-500">(Click to mark done)</span>
                </div>

                <div className="space-y-2.5">
                  {roadmap.milestones.map((m) => {
                    const isDone = !!completedMilestones[m.week];
                    return (
                      <div 
                        key={m.week}
                        onClick={() => toggleMilestone(m.week)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                          isDone 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 opacity-90' 
                            : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] hover:border-violet-400 dark:hover:border-violet-500/40 hover:bg-slate-100/80 dark:hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isDone ? 'bg-emerald-500 border-emerald-400 text-white font-bold' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/80'
                          }`}>
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                Week {m.week}: {m.title}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                m.difficulty === 'High-Yield' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30' :
                                m.difficulty === 'AKTU Core' ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30' :
                                'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {m.difficulty}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {m.topics.map((t, idx) => (
                                <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-white/[0.04] border border-slate-200/60 dark:border-transparent text-slate-700 dark:text-slate-300 font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High-Yield Tips */}
              <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/20 space-y-2">
                <div className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> High-Yield Exam Master Tips
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {roadmap.highYieldTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Reference Books */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recommended Reference Standard Textbooks</div>
                <div className="space-y-1.5">
                  {roadmap.referenceBooks.map((book, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <BookOpen className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>{book}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2. TIMETABLE COUNTDOWN RENDERER */}
        {artifact.type === 'timetable_countdown' && (() => {
          const timetable = artifact.data as TimetableCountdownData;
          return (
            <div className="space-y-5">
              {/* Highlight Banner: Next Class Countdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-blue-50/50 to-slate-50 dark:from-cyan-950/40 dark:via-blue-950/30 dark:to-slate-900 border border-cyan-200 dark:border-cyan-500/30 relative overflow-hidden shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-500/40 animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> Starts in {timetable.nextClass.startsInMinutes} mins
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">{timetable.currentDay}, {timetable.currentTime}</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">{timetable.nextClass.subject}</h4>
                  <div className="text-xs font-mono text-cyan-700 dark:text-cyan-300 mt-0.5">{timetable.nextClass.code} • {timetable.nextClass.timeSlot}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Location</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{timetable.nextClass.room}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Faculty Lead</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{timetable.nextClass.faculty}</span>
                  </div>
                </div>
              </div>

              {/* Full Day Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Today's Academic Sequence</div>
                <div className="space-y-2">
                  {timetable.schedule.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        item.isNext 
                          ? 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-500/40 shadow-sm' 
                          : item.isCurrent 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30' 
                          : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{item.subject}</span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{item.code}</span>
                          {item.isNext && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950">
                              NEXT
                            </span>
                          )}
                          {item.isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950">
                              NOW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.faculty} • <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.room}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{item.timeSlot}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {timetable.quickNote && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 italic">
                  💡 {timetable.quickNote}
                </div>
              )}
            </div>
          );
        })()}

        {/* 3. GRADE SIMULATOR RENDERER */}
        {artifact.type === 'grade_simulator' && (
          <div className="space-y-5">
            {/* Projected Score Header */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 shadow-lg flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Projected Performance</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  SGPA: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{calculateSimulatedSgpa()}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Under AKTU 10-Point Credit Formula</div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Current Cumulative</span>
                <span className="text-lg font-mono font-bold text-teal-700 dark:text-teal-200">CGPA: {gradeData?.currentCgpa || 8.24}</span>
              </div>
            </div>

            {/* Interactive Subject Sliders */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Subject Score Simulation</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Adjust sliders live</span>
              </div>

              <div className="space-y-3">
                {gradeData?.subjects.map((sub, idx) => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{sub.code} • {sub.credits} Credits</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-500/30">
                        {sub.targetGrade || 'A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                      {/* CT1 */}
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>CT-1</span>
                          <span className="font-mono text-slate-900 dark:text-white font-bold">{sub.ct1}/30</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={sub.ct1}
                          onChange={(e) => handleSubjectScoreChange(idx, 'ct1', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* CT2 */}
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>CT-2</span>
                          <span className="font-mono text-slate-900 dark:text-white font-bold">{sub.ct2}/30</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={sub.ct2}
                          onChange={(e) => handleSubjectScoreChange(idx, 'ct2', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* Assignment */}
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>Assgn</span>
                          <span className="font-mono text-slate-900 dark:text-white font-bold">{sub.assignment}/20</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={sub.assignment}
                          onChange={(e) => handleSubjectScoreChange(idx, 'assignment', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* End Sem */}
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>End-Sem</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">{sub.endSem}/100</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sub.endSem}
                          onChange={(e) => handleSubjectScoreChange(idx, 'endSem', parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CODE SANDBOX RENDERER */}
        {artifact.type === 'code_sandbox' && (() => {
          const codeObj = artifact.data as CodeSandboxData;
          return (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{codeObj.title}</h4>
                  <div className="flex gap-2">
                    {codeObj.timeComplexity && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                        {codeObj.timeComplexity}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{codeObj.description}</p>
              </div>

              {/* Code Tab Navigation */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCodeTab('code')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      activeCodeTab === 'code' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Source ({codeObj.language.toUpperCase()})
                  </button>
                  <button
                    onClick={() => {
                      setActiveCodeTab('output');
                      setSimulatedExecution(true);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      activeCodeTab === 'output' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3" /> Dry-Run Output
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">GCC 14.2 Standard</span>
              </div>

              {/* Code Viewer */}
              {activeCodeTab === 'code' ? (
                <div className="relative rounded-2xl bg-slate-900 dark:bg-[#07090e] border border-slate-800 dark:border-white/10 overflow-hidden">
                  <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{codeObj.code}</code>
                  </pre>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#06080e] border border-emerald-500/40 font-mono text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Compilation Succeeded (Exit code 0)
                  </div>
                  <pre className="text-slate-300 bg-black/40 p-3 rounded-xl overflow-x-auto">
                    {codeObj.expectedOutput || 'Program executed successfully with balanced height factor.'}
                  </pre>
                </div>
              )}
            </div>
          );
        })()}

        {/* 5. ORDINANCE DOC RENDERER */}
        {artifact.type === 'ordinance_doc' && (() => {
          const ord = artifact.data as OrdinanceDocData;
          return (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-rose-700 dark:text-rose-300 font-bold">{ord.clauseNumber}</span>
                  <span className="text-slate-500 dark:text-slate-400">{ord.ordinanceYear}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{ord.title}</h4>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verbatim Statutory Text</div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{ord.officialText}"
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Practical Operational Impact</div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {ord.practicalImplication}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 space-y-1.5">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Authorized Relief / Condonation Route
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {ord.reliefMechanism}
                </p>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Footer Quick Action */}
      <div className="px-5 py-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">MPDREC Co-Pilot Artifact Engine</span>
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md shadow-violet-600/20"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Export Artifact'}</span>
        </button>
      </div>
    </div>
  );
};
