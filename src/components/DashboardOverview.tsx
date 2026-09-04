import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Building, 
  Award, 
  Calendar, 
  Bell, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  Search, 
  Percent, 
  IndianRupee, 
  Clock, 
  Image as ImageIcon, 
  Layers, 
  FileText, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight, 
  School,
  History,
  Video as VideoIcon
} from 'lucide-react';
import { Student, Faculty, Notice, AuthSession } from '../types/erp';

interface DashboardOverviewProps {
  students: Student[];
  facultyList: Faculty[];
  notices: Notice[];
  session: AuthSession;
  onNavigate: (tab: string) => void;
  onOpenGradeCard: (student: Student) => void;
  onAddNotice: (notice: Notice) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  facultyList,
  notices,
  session,
  onNavigate,
  onOpenGradeCard,
  onAddNotice,
}) => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedNoticeToView, setSelectedNoticeToView] = useState<Notice | null>(null);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<Notice['category']>('Academic');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);
  const [inspectedStudentRoll, setInspectedStudentRoll] = useState<string>(
    session.role === 'student' && session.rollNo ? session.rollNo : (students[0]?.rollNo || '')
  );

  // If student session, find logged-in student record with case-insensitive matching and robust fallback
  const currentStudent = React.useMemo(() => {
    const list = students || [];
    if (session.role === 'student') {
      const matchRoll = (session.rollNo || session.userId || '').toLowerCase();
      const found = list.find(s => 
        s.rollNo?.toLowerCase() === matchRoll || 
        s.enrollmentNo?.toLowerCase() === matchRoll ||
        s.rollNo?.toLowerCase().includes(matchRoll) ||
        matchRoll.includes(s.rollNo?.toLowerCase() || '')
      );
      if (found) return found;
    } else {
      const found = list.find(s => s.rollNo === inspectedStudentRoll);
      if (found) return found;
    }
    return list[0] || null;
  }, [students, session, inspectedStudentRoll]);

  // Global KPIs with complete null-safety
  const totalStudents = students?.length || 0;
  const avgAttendance = totalStudents > 0 
    ? ((students || []).reduce((sum, s) => sum + (Number(s.attendancePercentage) || 0), 0) / totalStudents).toFixed(1)
    : '84.5';
  const detainedCount = (students || []).filter(s => (Number(s.attendancePercentage) || 0) < 75).length;
  const totalFeesPaid = (students || []).reduce((sum, s) => sum + (Number(s.feesPaid) || 0), 0);
  const totalFeesPending = (students || []).reduce((sum, s) => sum + (Number(s.balanceFees) || 0), 0);
  const toppers = [...(students || [])].sort((a, b) => (Number(b.sgpa) || 0) - (Number(a.sgpa) || 0)).slice(0, 3);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    const notice: Notice = {
      id: `NOT-${Date.now()}`,
      title: newNoticeTitle,
      category: newNoticeCategory,
      content: newNoticeContent,
      date: new Date().toISOString().split('T')[0],
      author: session.name,
      postedBy: session.name,
      isUrgent: newNoticeUrgent,
    };

    onAddNotice(notice);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setShowNoticeModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Official Academic Session 2025–26 • Even Semester
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
              Maa Pateshwari Devi Rajkiya Engineering College Central ERP. Real-time academic tracking, continuous assessment marks, AKTU progression, central library, and smart hostel management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {session.role === 'student' && currentStudent && (
              <button
                onClick={() => onOpenGradeCard(currentStudent)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
                id="btn-my-grade-card"
              >
                <Award className="w-4 h-4 text-slate-950" />
                View My Grade Statement
              </button>
            )}

            {(session.role === 'admin' || session.role === 'faculty') && (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                id="btn-post-announcement"
              >
                <Plus className="w-4 h-4" />
                Broadcast Notice
              </button>
            )}

            <button
              onClick={() => onNavigate('ai_assistant')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Ask Campus AI
            </button>
          </div>
        </div>
      </div>

      {/* CURRENT ACADEMIC PROFILE & YEAR/SEMESTER SECTION (Restricted for Authenticated Members Only) */}
      {session.role !== 'guest' && currentStudent && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-bold border border-blue-200 dark:border-blue-800">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Current Student Academics & Degree Standing</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="dark:text-[#e2e5ed]">{currentStudent.name}</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentStudent.rollNo}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Official AKTU Central Academic Progression Record • Session {currentStudent.academicSession || '2025–2026'}
              </p>
            </div>

            {/* If Faculty / Admin: Student Selector Dropdown */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1 sm:pt-0">
              {session.role !== 'student' && (
                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500 shrink-0">Inspect:</span>
                  <select
                    value={inspectedStudentRoll}
                    onChange={(e) => setInspectedStudentRoll(e.target.value)}
                    className="text-xs py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
                  >
                    {students.map((s) => (
                      <option key={s.rollNo} value={s.rollNo}>
                        {s.name} ({s.rollNo} • Sem {s.semester})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => onNavigate('academics')}
                className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 transition-all"
                id="btn-nav-semester-results"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Semester Results →</span>
              </button>

              <button
                onClick={() => onOpenGradeCard(currentStudent)}
                className="px-3 sm:px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-[11px] sm:text-xs font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                id="btn-open-grade-statement"
              >
                <Award className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>Grade Card</span>
              </button>
            </div>
          </div>

          {/* Academic Primary Details Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            
            {/* Current Academic Year */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5 shrink-0" />
                <span>Year</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#f2e9e9]">
                Year {currentStudent.currentYear || Math.ceil(currentStudent.semester / 2)}
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium block truncate">
                {(currentStudent.currentYear === 1 || currentStudent.semester <= 2) ? '1st Yr (Freshman)' :
                 (currentStudent.currentYear === 2 || currentStudent.semester <= 4) ? '2nd Yr (Sophomore)' :
                 (currentStudent.currentYear === 3 || currentStudent.semester <= 6) ? '3rd Yr (Junior)' : '4th Yr (Senior)'}
              </span>
            </div>

            {/* Current Semester */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-indigo-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Semester</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#eaecf3] font-mono">
                Sem {currentStudent.semester}
              </div>
              <span className="text-[9px] sm:text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block truncate">Even Sem 2025–26</span>
            </div>

            {/* Degree & Program */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-0.5 sm:mb-1">
                Branch
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-[#ffffff] truncate">
                B.Tech (CSE)
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block truncate">Sec {currentStudent.section} • 2024–28</span>
            </div>

            {/* Academic Standing */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-emerald-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Standing</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 truncate">
                {currentStudent.status}
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium block truncate">0 Backlogs</span>
            </div>

            {/* SGPA & CGPA Cumulative */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>SGPA / CGPA</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400 font-mono">
                {currentStudent.sgpa} <span className="text-[11px] sm:text-xs font-normal text-slate-500">/ {currentStudent.cgpa}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium block truncate">Rank Contender</span>
            </div>

            {/* Attendance & Exam Eligibility */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-50/80 to-cyan-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-teal-100 dark:border-slate-700/80">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-0.5 sm:mb-1 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 shrink-0" />
                <span>Attendance</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#b4bccf] font-mono">
                {currentStudent.attendancePercentage}%
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold block truncate ${currentStudent.attendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {currentStudent.attendancePercentage >= 75 ? '✓ Exam Eligible' : '⚠️ Attendance Low'}
              </span>
            </div>

          </div>

          {/* 8-Semester Academic Progression Track */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-[#edeef0]">
                  4-Year B.Tech Degree Semester Roadmap (8 Semesters Total)
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-semibold text-slate-500">
                Earned: <strong className="text-blue-600 dark:text-blue-400">{Math.min(160, (currentStudent.semester - 1) * 21)} / 160 Cr</strong> ({Math.round(((currentStudent.semester - 1) * 21 / 160) * 100)}%)
              </div>
            </div>

            {/* Progress Step Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 pt-1 sm:pt-2">
              {[
                { sem: 1, year: 'Year 1', credits: 20 },
                { sem: 2, year: 'Year 1', credits: 22 },
                { sem: 3, year: 'Year 2', credits: 22 },
                { sem: 4, year: 'Year 2', credits: 22 },
                { sem: 5, year: 'Year 3', credits: 20 },
                { sem: 6, year: 'Year 3', credits: 20 },
                { sem: 7, year: 'Year 4', credits: 18 },
                { sem: 8, year: 'Year 4', credits: 16 },
              ].map((step) => {
                const isPassed = step.sem < currentStudent.semester;
                const isCurrent = step.sem === currentStudent.semester;
                const semResult = currentStudent.semesterResults?.find(r => r.semester === step.sem);
                const sgpaVal = semResult ? semResult.sgpa : isPassed ? (currentStudent.sgpa - 0.1 * (currentStudent.semester - step.sem)).toFixed(2) : isCurrent ? currentStudent.sgpa : null;

                return (
                  <div
                    key={step.sem}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-1 sm:ring-2 ring-blue-400/40'
                        : isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-80'
                    }`}
                  >
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      {step.year}
                    </div>
                    <div className="text-[11px] sm:text-xs font-black">
                      Sem {step.sem}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-semibold mt-0.5 sm:mt-1">
                      {isCurrent ? (
                        <span className="inline-block px-1 sm:px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                          Active 🔄
                        </span>
                      ) : isPassed ? (
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {sgpaVal} SGPA ✓
                        </span>
                      ) : (
                        <span>{step.credits} Cr</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Semester Enrolled Courses Overview */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Enrolled Subjects in Semester {currentStudent.semester}</span>
              </h3>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                {(currentStudent.subjects || []).length} Courses
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
              {(currentStudent.subjects || []).map((sub, sIdx) => (
                <div
                  key={sub.code}
                  className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <div className={`font-bold text-xs text-slate-900 ${
                      sIdx === 0 ? 'dark:text-[#efeff5]' :
                      sIdx === 1 ? 'dark:text-[#ebefff]' :
                      sIdx === 2 ? 'dark:text-[#dbdde9]' :
                      sIdx === 3 ? 'dark:text-[#dfe4ec]' :
                      sIdx === 4 ? 'dark:text-[#f4f7ff]' :
                      'dark:text-[#cdd4e3]'
                    } truncate`}>
                      {sub.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      {sub.code} • {sub.credits} Credits
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      Grade: {sub.grade}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {sub.total}/100 Marks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIOUS SEMESTERS RESULTS & TRANSCRIPT ARCHIVES SECTION */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-850 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-slate-200/80 dark:border-slate-700/60">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-[#cfd4e5] tracking-tight">
                    Semester Results & Previous Academic Performance History
                  </h3>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Consolidated university grade sheets, SGPA progression, and official credit evaluation
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenGradeCard(currentStudent)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-[11px] sm:text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span>Print Grade Cards & Transcripts</span>
                </button>
              </div>
            </div>

            {currentStudent.semesterResults && currentStudent.semesterResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                {currentStudent.semesterResults.map((result) => (
                  <div
                    key={result.semester}
                    className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-2.5 sm:space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs font-black">
                            Semester {result.semester}
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                            {result.academicYear} ({result.sessionType})
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                          <span>{result.examType}</span>
                          <span>•</span>
                          <span>{result.subjects.length} Subjects Evaluated</span>
                        </div>
                      </div>

                      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shrink-0 ${
                        result.status.includes('HONOURS')
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300'
                          : result.status.includes('PASS')
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        {result.status}
                      </span>
                    </div>

                    {/* Scores Metrics Banner */}
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400">SGPA</div>
                        <div className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                          {result.sgpa.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400">CGPA</div>
                        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
                          {result.cgpa.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400">Credits</div>
                        <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {result.earnedCredits}/{result.totalCredits}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400">Score %</div>
                        <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                          {result.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Subject Mini Chips */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {result.subjects.map((sub) => (
                        <div
                          key={sub.code}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-slate-100 dark:bg-slate-750 text-[9px] sm:text-[10px] font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1"
                          title={`${sub.name} - ${sub.total}/100`}
                        >
                          <span className="font-bold">{sub.code}:</span>
                          <span className={`font-black ${
                            sub.grade === 'O' || sub.grade === 'A+' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {sub.grade}
                          </span>
                          <span className="text-slate-400">({sub.total}m)</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] sm:text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-750">
                      <span>Declared: {result.resultDate}</span>
                      <button
                        onClick={() => onOpenGradeCard(currentStudent)}
                        className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Detailed Transcript</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-800 text-center space-y-2 border border-slate-200 dark:border-slate-700">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Currently in Semester 1. First semester AKTU examination results will be published here upon semester conclusion.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* GUEST CASUAL VISITOR OVERVIEW BANNER (Shown when visiting casually without login) */}
      {session.role === 'guest' && (
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Guest Visitor Portal • Casual Campus Inspection
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Maa Pateshwari Devi Rajkiya Engineering College (MPDREC)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU College Code: 1214) • Approved by AICTE, New Delhi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('gallery')}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Browse Campus Gallery & Events</span>
              </button>
            </div>
          </div>

          {/* Privacy Notice Card */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Student Personal Information & Record Confidentiality
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                In compliance with student data privacy guidelines, individual student marksheets, roll numbers, attendance sheets, fee balances, and hostel room allocations are restricted to authenticated students, faculty, and administrators. Guest mode is designated for casual institutional viewing.
              </p>
            </div>
          </div>

          {/* Institutional Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Academic Programs
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                4-Year B.Tech
              </div>
              <span className="text-[10px] text-slate-500">CSE, ECE, ME, Civil & Allied</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Campus Grounds
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                20+ Acres
              </div>
              <span className="text-[10px] text-slate-500">Lush Green State Infrastructure</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                Central Library
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                12,000+ Volumes
              </div>
              <span className="text-[10px] text-slate-500">Digital Journals & IEEE Access</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                Annual Campus Fests
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Tejas 2k25 & Freshers
              </div>
              <span className="text-[10px] text-slate-500">Sports & Cultural Extravaganza</span>
            </div>
          </div>
        </div>
      )}


      {/* STUDENT SPECIFIC DASHBOARD STATS (If Student) */}
      {session.role === 'student' && currentStudent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Attendance Meter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Overall Attendance</span>
              <Percent className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black font-mono ${currentStudent.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {currentStudent.attendancePercentage}%
              </span>
              <span className="text-xs text-slate-500">({currentStudent.attendedClasses}/{currentStudent.totalClasses} classes)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  currentStudent.attendancePercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${currentStudent.attendancePercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentStudent.attendancePercentage < 75 ? '⚠️ Below 75% AKTU Exam Eligibility' : '✓ Eligible for upcoming End-Sem Exams'}
            </p>
          </div>

          {/* Academic SGPA */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Current SGPA / CGPA</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {currentStudent.sgpa}
              </span>
              <span className="text-xs font-mono text-slate-500">CGPA: {currentStudent.cgpa}</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Status:</span>
              <span className="font-bold text-emerald-600">{currentStudent.status}</span>
            </div>
            <p className="text-[11px] text-slate-400">Backlogs: {currentStudent.backlogs}</p>
          </div>

          {/* Hostel Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Hostel Room Allotment</span>
              <Building className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-lg font-extrabold text-slate-800 dark:text-[#ffffff] truncate">
              {currentStudent.hostelAllotment?.hostelName || 'Day Scholar'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Room: {currentStudent.hostelAllotment?.roomNo || 'N/A'} (Bed {currentStudent.hostelAllotment?.bed || '-'})
            </div>
            <button
              onClick={() => onNavigate('hostel')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View Room Matrix →
            </button>
          </div>

          {/* Fees Dues */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Fee Payment Status</span>
              <IndianRupee className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-[#cfd5e1] font-mono">
                ₹{Number(currentStudent.feesPaid || 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ ₹{Number(currentStudent.totalFees || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                (currentStudent.feeStatus || 'Paid') === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {currentStudent.feeStatus || 'Paid'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View Receipt & Pay →
            </button>
          </div>

        </div>
      )}

      {/* INSTITUTIONAL KPI SUMMARY CARDS (For Admin, Faculty, Staff, Guest) */}
      {session.role !== 'student' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div 
            onClick={() => onNavigate('students')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Students</span>
              <GraduationCap className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{totalStudents}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">100% Enrolled</span>
          </div>

          <div 
            onClick={() => onNavigate('faculty')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Faculty</span>
              <UserCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">{facultyList.length}</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">View Faculty Directory →</span>
          </div>

          <div 
            onClick={() => onNavigate('academics')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Avg Attendance</span>
              <Percent className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{avgAttendance}%</div>
            <span className="text-[10px] text-slate-500 font-medium">Classroom Threshold</span>
          </div>

          <div 
            onClick={() => onNavigate('students')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Critical Att.</span>
              <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">{detainedCount}</div>
            <span className="text-[10px] text-rose-500 font-bold">&lt;75% Attendance</span>
          </div>

          <div 
            onClick={() => onNavigate('library')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Library Titles</span>
              <BookOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">1,250</div>
            <span className="text-[10px] text-slate-500 font-medium">Central Collection</span>
          </div>

          <div 
            onClick={() => onNavigate('fees')} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
              <span>Fee Collection</span>
              <IndianRupee className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-black text-emerald-600 font-mono">
              ₹{(totalFeesPaid / 100000).toFixed(1)}L
            </div>
            <span className="text-[10px] text-slate-500 font-medium">₹{(totalFeesPending / 1000).toFixed(0)}k Pending</span>
          </div>

        </div>
      )}

      {/* Main Grid: Quick Actions & Notice Board & Toppers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Action Hub & Academic Milestones (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Action Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Quick Academic & ERP Operations
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <button
                onClick={() => onNavigate('academics')}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all text-left group"
              >
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xs text-slate-900 dark:text-[#f8f9fa]">Class Test Marks</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Input CT-1 & CT-2</div>
              </button>

              <button
                onClick={() => onNavigate('gallery')}
                className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-rose-100 dark:border-slate-700 hover:border-rose-500 hover:shadow-md transition-all text-left group"
              >
                <ImageIcon className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xs text-slate-900 dark:text-[#d2dae0]">Event Gallery</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tejas 2k25 & Freshers</div>
              </button>

              <button
                onClick={() => onNavigate('academics')}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-emerald-100 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
              >
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xs text-slate-900 dark:text-[#b9c0d2]">Semester Upgrade</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Promote Eligible</div>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-purple-100 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all text-left group"
              >
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xs text-slate-900 dark:text-[#c0c7d9]">Weekly Schedule</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Class Timetable</div>
              </button>

              <button
                onClick={() => onNavigate('library')}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-amber-100 dark:border-slate-700 hover:border-amber-500 hover:shadow-md transition-all text-left group"
              >
                <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xs text-slate-900 dark:text-[#c1c7d6]">Issue / Return</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Central Library</div>
              </button>
            </div>
          </div>

          {/* HIGH-VISIBILITY CAMPUS GALLERY & VISUAL MEDIA PULSE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center shadow-sm">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                    Campus Gallery & Visual Media Hub
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">
                      Live Pulse
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Curated live HD photos, student video reels, event categories & moderation queue
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('gallery')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Gallery Portal</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Live Photos */}
              <div
                onClick={() => onNavigate('gallery')}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-950/40 dark:to-slate-850 border-2 border-blue-500/30 dark:border-blue-500/40 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-blue-700 dark:text-blue-300">
                    Live Photos
                  </span>
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-blue-950 dark:text-blue-100 font-mono">
                  24+
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium mt-0.5">
                  Verified Images →
                </div>
              </div>

              {/* Live Video Reels */}
              <div
                onClick={() => onNavigate('gallery')}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-950/40 dark:to-slate-850 border-2 border-purple-500/30 dark:border-purple-500/40 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-purple-700 dark:text-purple-300">
                    Live Video Reels
                  </span>
                  <VideoIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-purple-950 dark:text-purple-100 font-mono">
                  12+
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 font-medium mt-0.5">
                  HD Video Clips →
                </div>
              </div>

              {/* Event Categories */}
              <div
                onClick={() => onNavigate('gallery')}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent dark:from-indigo-950/40 dark:to-slate-850 border-2 border-indigo-500/30 dark:border-indigo-500/40 hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 dark:text-indigo-300">
                    Event Categories
                  </span>
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-indigo-950 dark:text-indigo-100 font-mono">
                  8
                </div>
                <div className="text-[10px] text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium mt-0.5">
                  Fest & Sports Tags →
                </div>
              </div>

              {/* Pending Approvals */}
              <div
                onClick={() => onNavigate('gallery')}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 to-transparent dark:from-amber-950/40 dark:to-slate-850 border-2 border-amber-400 dark:border-amber-600/60 hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider uppercase text-amber-800 dark:text-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending Approvals
                  </span>
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
                  2
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold mt-0.5">
                  Review Desk Queue →
                </div>
              </div>
            </div>
          </div>

          {/* Academic Toppers Showcase (Authenticated Users) / Institutional Excellence (Guests) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {session.role === 'guest' ? 'Academic Honors & Institutional Excellence' : 'Semester Academic Rank Holders & Toppers'}
              </h3>
              <span className="text-[10px] text-slate-400">AKTU 2025-26 Session</span>
            </div>

            {session.role === 'guest' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-base flex items-center justify-center shadow-md shrink-0">
                    <Award className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      AKTU University Merit & Gold Medalist Tradition
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Over 94% first-division graduation rate across CSE, ECE, ME, and Civil Engineering programs.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                    AKTU Code 1214
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {toppers.map((topper, idx) => (
                  <div 
                    key={topper.rollNo}
                    onClick={() => onOpenGradeCard(topper)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div className="truncate flex-1">
                      <div className={`font-bold text-xs text-slate-900 ${
                        idx === 0 ? 'dark:text-[#d1d9e5]' :
                        idx === 1 ? 'dark:text-[#e1e4ea]' :
                        'dark:text-[#ced5e4]'
                      } truncate`}>{topper.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{topper.rollNo}</div>
                      <div className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                        {topper.sgpa} SGPA
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Campus Announcement Feed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-[#d2d7de] flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Campus Notices ({notices.length})
            </h3>
            {(session.role === 'admin' || session.role === 'faculty') && (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Post
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {notices.length === 0 ? (
              <div className="py-8 text-center px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active notices</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Campus announcements and circulars will appear here.</p>
              </div>
            ) : (
              notices.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => setSelectedNoticeToView(n)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${
                    n.isUrgent 
                      ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' 
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      n.category === 'Exam' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' :
                      n.category === 'Academic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      n.category === 'Event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed break-words whitespace-normal">{n.content}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[150px]">By: {n.postedBy}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 shrink-0">
                      Tap to expand
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* VIEW NOTICE DETAIL MODAL */}
      {selectedNoticeToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                selectedNoticeToView.category === 'Exam' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                selectedNoticeToView.category === 'Academic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                selectedNoticeToView.category === 'Event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {selectedNoticeToView.category} Circular
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedNoticeToView.date}</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug break-words">
                {selectedNoticeToView.title}
              </h3>
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                {selectedNoticeToView.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>Posted by: <strong className="text-slate-800 dark:text-slate-200">{selectedNoticeToView.postedBy}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedNoticeToView(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST NOTICE MODAL */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">Broadcast Campus Circular / Notice</h3>
            
            <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Class Test 2 (CT-2)"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Category</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam & Assessment</option>
                    <option value="Event">Event & Fest</option>
                    <option value="Placement">Placement & Internships</option>
                    <option value="Hostel">Hostel & Mess</option>
                    <option value="Holiday">Holiday & Notice</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={newNoticeUrgent}
                      onChange={(e) => setNewNoticeUrgent(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600"
                    />
                    Mark as Urgent Banner
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, deadlines, and instructions..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowNoticeModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  Publish to Ticker & Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
