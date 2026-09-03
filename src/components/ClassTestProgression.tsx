import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Save, 
  FileSpreadsheet, 
  Search, 
  Sparkles, 
  Layers, 
  Clock, 
  ChevronRight, 
  ShieldAlert, 
  Lock, 
  ShieldCheck, 
  Eye, 
  AlertCircle,
  FileText,
  GraduationCap,
  BookOpen,
  History,
  Download,
  Printer,
  School,
  Check
} from 'lucide-react';
import { Student, AcademicTermMilestone, AuthSession, SemesterResultDetail } from '../types/erp';
import { exportStudentsToCSV } from '../utils/exportUtils';

interface ClassTestProgressionProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  milestones: AcademicTermMilestone;
  onUpdateMilestones: (milestone: AcademicTermMilestone) => void;
  session: AuthSession;
  onOpenGradeCard: (student: Student) => void;
}

export const ClassTestProgression: React.FC<ClassTestProgressionProps> = ({
  students,
  onUpdateStudent,
  milestones,
  onUpdateMilestones,
  session,
  onOpenGradeCard,
}) => {
  // Permission checks: Only faculty (or admin) can edit marks and perform upgrades
  const isFaculty = session.role === 'faculty' || session.role === 'admin';
  const isStudent = session.role === 'student';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemFilter, setSelectedSemFilter] = useState<number | 'all'>('all');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState<string>(
    isStudent && session.rollNo ? session.rollNo : (students[0]?.rollNo || '')
  );
  const [activeSubTab, setActiveSubTab] = useState<'marks_entry' | 'semester_results' | 'semester_upgrade' | 'milestones_config'>('marks_entry');
  const [selectedResultSemester, setSelectedResultSemester] = useState<number | 'all'>('all');

  // Milestone edit state
  const [editedMilestones, setEditedMilestones] = useState<AcademicTermMilestone>({ ...milestones });
  const [milestoneSavedNotice, setMilestoneSavedNotice] = useState(false);

  // Selected student for marks editing
  const currentStudent = students.find(s => s.rollNo === selectedStudentRoll) || students[0];

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSem = selectedSemFilter === 'all' || s.semester === selectedSemFilter;
    return matchSearch && matchSem;
  });

  const handleMarkChange = (subIndex: number, field: 'classTest1' | 'classTest2' | 'assignment' | 'endSem', val: number) => {
    // Prevent non-faculty from modifying marks
    if (!isFaculty || !currentStudent) return;
    const updatedSubjects = [...currentStudent.subjects];
    const sub = { ...updatedSubjects[subIndex] };
    
    // Bounds check
    let clamped = val;
    if (field === 'classTest1' || field === 'classTest2') clamped = Math.min(30, Math.max(0, val));
    if (field === 'assignment') clamped = Math.min(20, Math.max(0, val));
    if (field === 'endSem') clamped = Math.min(100, Math.max(0, val));

    sub[field] = clamped;

    // Recalculate Total (Internal 50% + EndSem 50%)
    const internalTotal = Math.min(50, Math.round(((sub.classTest1 + sub.classTest2) / 60) * 30 + sub.assignment));
    const endSemScaled = Math.min(50, Math.round((sub.endSem / 100) * 50));
    sub.total = internalTotal + endSemScaled;

    // Recalculate Grade & Grade Points
    if (sub.total >= 90) { sub.grade = 'A+'; sub.gradePoint = 10; }
    else if (sub.total >= 80) { sub.grade = 'A'; sub.gradePoint = 9; }
    else if (sub.total >= 70) { sub.grade = 'B+'; sub.gradePoint = 8; }
    else if (sub.total >= 60) { sub.grade = 'B'; sub.gradePoint = 7; }
    else if (sub.total >= 50) { sub.grade = 'C+'; sub.gradePoint = 6; }
    else if (sub.total >= 40) { sub.grade = 'C'; sub.gradePoint = 5; }
    else if (sub.total >= 33) { sub.grade = 'D'; sub.gradePoint = 4; }
    else { sub.grade = 'F'; sub.gradePoint = 0; }

    updatedSubjects[subIndex] = sub;

    // Recalculate SGPA
    const totalCredits = updatedSubjects.reduce((acc, c) => acc + c.credits, 0);
    const totalCreditPoints = updatedSubjects.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
    const newSgpa = Number((totalCreditPoints / totalCredits).toFixed(2));
    const backlogs = updatedSubjects.filter(s => s.grade === 'F').length;

    const updatedStudent: Student = {
      ...currentStudent,
      subjects: updatedSubjects,
      sgpa: newSgpa,
      cgpa: Number(((currentStudent.cgpa * 0.7) + (newSgpa * 0.3)).toFixed(2)),
      backlogs,
    };

    onUpdateStudent(updatedStudent);
  };

  // Promotion trigger with Confetti celebration
  const handlePromoteStudent = (student: Student) => {
    // Prevent non-faculty from triggering promotion
    if (!isFaculty || student.semester >= 8) return;
    const nextSem = student.semester + 1;

    const updated: Student = {
      ...student,
      semester: nextSem,
      status: 'Regular',
      academicProgressionHistory: [
        ...student.academicProgressionHistory,
        {
          semester: student.semester,
          sgpa: student.sgpa,
          promotionDate: new Date().toISOString().split('T')[0],
          remarks: `Promoted to Semester ${nextSem} after clearing Class Tests & Academic Criteria.`
        }
      ]
    };

    onUpdateStudent(updated);

    // Trigger visual confetti fireworks
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleBatchPromoteEligible = () => {
    if (!isFaculty) return;
    let count = 0;
    filteredStudents.forEach(s => {
      const isEligible = s.attendancePercentage >= 75 && s.sgpa >= 5.0 && s.backlogs <= 2 && s.semester < 8;
      if (isEligible) {
        handlePromoteStudent(s);
        count++;
      }
    });

    if (count > 0) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const handleSaveMilestones = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFaculty) return;
    onUpdateMilestones(editedMilestones);
    setMilestoneSavedNotice(true);
    setTimeout(() => setMilestoneSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Academic Progression & Class Test Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Class Tests, Continuous Assessment & Semester Upgrade</h2>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              {isFaculty 
                ? 'Faculty Grading Portal: Enter Class Test 1 (30), Class Test 2 (30), Assignments (20), End Sem, and execute official semester upgrades.' 
                : 'Student Assessment View: Official continuous assessment results, class test breakdowns, internal scores, and semester progression status.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportStudentsToCSV(students)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              id="btn-export-marks-csv"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Marks (Excel)
            </button>
          </div>
        </div>

        {/* Sub navigation buttons */}
        <div className="flex gap-2 mt-6 border-t border-white/10 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('marks_entry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'marks_entry' ? 'bg-white text-slate-900 shadow-md' : 'text-blue-200 hover:bg-white/10'
            }`}
            id="tab-marks-matrix"
          >
            <Award className="w-4 h-4" />
            Class Test & Marks Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('semester_results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'semester_results' ? 'bg-white text-slate-900 shadow-md' : 'text-blue-200 hover:bg-white/10'
            }`}
            id="tab-semester-results"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            Semester Results & Previous History
          </button>
          <button
            onClick={() => setActiveSubTab('semester_upgrade')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'semester_upgrade' ? 'bg-white text-slate-900 shadow-md' : 'text-blue-200 hover:bg-white/10'
            }`}
            id="tab-semester-upgrade"
          >
            <TrendingUp className="w-4 h-4" />
            Semester Upgrade System
          </button>
          <button
            onClick={() => setActiveSubTab('milestones_config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'milestones_config' ? 'bg-white text-slate-900 shadow-md' : 'text-blue-200 hover:bg-white/10'
            }`}
            id="tab-term-timeline"
          >
            <Calendar className="w-4 h-4" />
            Academic Term Timeline
          </button>
        </div>
      </div>

      {/* Role Permission Alert Notice */}
      {!isFaculty && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3 shadow-sm">
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 shrink-0">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <span className="font-bold">Student Read-Only Mode:</span> Marks, continuous assessment scores, and semester progression upgrades can only be entered, edited, or authorized by <strong>Faculty members</strong>.
          </div>
        </div>
      )}

      {/* SUB-TAB 1: Class Test & Marks Entry Matrix */}
      {activeSubTab === 'marks_entry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Student Selector List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Select Student ({filteredStudents.length})
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedSemFilter('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedSemFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedSemFilter(3)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedSemFilter === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                >
                  Sem 3
                </button>
                <button
                  onClick={() => setSelectedSemFilter(4)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedSemFilter === 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                >
                  Sem 4
                </button>
              </div>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.rollNo === currentStudent?.rollNo;
                return (
                  <button
                    key={s.rollNo}
                    onClick={() => setSelectedStudentRoll(s.rollNo)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-950 dark:text-blue-100 font-semibold shadow-sm'
                        : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold leading-tight">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{s.rollNo} • Sem {s.semester}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">{s.sgpa} SGPA</span>
                      <div className="text-[10px] text-slate-400">{s.attendancePercentage}% Att</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Subject Marks Editor */}
          {currentStudent && (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Student Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{currentStudent.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{currentStudent.rollNo} • {currentStudent.branch} (Sem {currentStudent.semester})</p>
                </div>

                <div className="flex items-center gap-2">
                  {isFaculty ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Faculty Editor Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                      <Lock className="w-3.5 h-3.5 text-amber-500" /> Read-Only
                    </span>
                  )}
                  <button
                    onClick={() => onOpenGradeCard(currentStudent)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Preview Grade Card
                  </button>
                </div>
              </div>

              {/* Editable Subjects Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-2 text-center w-24">CT-1 (30)</th>
                      <th className="py-2.5 px-2 text-center w-24">CT-2 (30)</th>
                      <th className="py-2.5 px-2 text-center w-24">Assign (20)</th>
                      <th className="py-2.5 px-2 text-center w-28">End Sem (100)</th>
                      <th className="py-2.5 px-2 text-center">Total (100)</th>
                      <th className="py-2.5 px-2 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentStudent.subjects.map((sub, idx) => (
                      <tr key={sub.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</div>
                          <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{sub.code} ({sub.credits} Credits)</div>
                        </td>

                        {/* CT-1 */}
                        <td className="py-2 px-2 text-center">
                          {isFaculty ? (
                            <input
                              type="number"
                              min={0}
                              max={30}
                              value={sub.classTest1}
                              onChange={(e) => handleMarkChange(idx, 'classTest1', parseInt(e.target.value) || 0)}
                              className="w-16 text-center py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            <span className="font-mono font-bold text-xs py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 inline-block min-w-[2.75rem]">
                              {sub.classTest1}
                            </span>
                          )}
                        </td>

                        {/* CT-2 */}
                        <td className="py-2 px-2 text-center">
                          {isFaculty ? (
                            <input
                              type="number"
                              min={0}
                              max={30}
                              value={sub.classTest2}
                              onChange={(e) => handleMarkChange(idx, 'classTest2', parseInt(e.target.value) || 0)}
                              className="w-16 text-center py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            <span className="font-mono font-bold text-xs py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 inline-block min-w-[2.75rem]">
                              {sub.classTest2}
                            </span>
                          )}
                        </td>

                        {/* Assignment */}
                        <td className="py-2 px-2 text-center">
                          {isFaculty ? (
                            <input
                              type="number"
                              min={0}
                              max={20}
                              value={sub.assignment}
                              onChange={(e) => handleMarkChange(idx, 'assignment', parseInt(e.target.value) || 0)}
                              className="w-16 text-center py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            <span className="font-mono font-bold text-xs py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 inline-block min-w-[2.75rem]">
                              {sub.assignment}
                            </span>
                          )}
                        </td>

                        {/* End Sem */}
                        <td className="py-2 px-2 text-center">
                          {isFaculty ? (
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={sub.endSem}
                              onChange={(e) => handleMarkChange(idx, 'endSem', parseInt(e.target.value) || 0)}
                              className="w-20 text-center py-1 px-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          ) : (
                            <span className="font-mono font-bold text-xs py-1 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 inline-block min-w-[3.25rem]">
                              {sub.endSem}
                            </span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-2 px-2 text-center font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {sub.total}
                        </td>

                        {/* Grade */}
                        <td className="py-2 px-2 text-center font-black">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            sub.grade === 'A+' || sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            sub.grade === 'F' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {sub.grade} ({sub.gradePoint} pts)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculated Stats Pill */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Computed SGPA</span>
                  <span className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono">{currentStudent.sgpa}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Cumulative CGPA</span>
                  <span className="text-xl font-black text-indigo-700 dark:text-indigo-400 font-mono">{currentStudent.cgpa}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Backlogs</span>
                  <span className={`text-xl font-black font-mono ${currentStudent.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {currentStudent.backlogs} {currentStudent.backlogs === 0 && '✓'}
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: Semester Results & Previous Semesters History */}
      {activeSubTab === 'semester_results' && currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Student Selector List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Select Student ({filteredStudents.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Sem {currentStudent.semester}
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Students List */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.rollNo === currentStudent.rollNo;
                return (
                  <button
                    key={s.rollNo}
                    onClick={() => setSelectedStudentRoll(s.rollNo)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate max-w-[170px]">{s.name}</span>
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                        {s.sgpa} SGPA
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{s.rollNo}</span>
                      <span>Year {s.currentYear || 2} • Sem {s.semester}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Results Viewer */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Header Summary Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800 mb-1">
                    <School className="w-3 h-3 text-blue-600" />
                    AKTU Official Semester Examination Ledger
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{currentStudent.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {currentStudent.rollNo}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentStudent.branch} • Batch {currentStudent.admissionYear}–{currentStudent.admissionYear + 4} • Section {currentStudent.section}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenGradeCard(currentStudent)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                    <span>Official Grade Statement</span>
                  </button>
                </div>
              </div>

              {/* Quick Academic Key Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Academic Year</span>
                  <span className="text-base font-black text-slate-900 dark:text-slate-100">
                    Year {currentStudent.currentYear || 2} (Sophomore)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Semester</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                    Semester {currentStudent.semester} (Odd)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative CGPA</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                    {currentStudent.cgpa} / 10.0
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Credits</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    42 / 160 Earned
                  </span>
                </div>
              </div>

              {/* Semester Selector Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <History className="w-3.5 h-3.5" /> Select Semester:
                </span>
                
                <button
                  onClick={() => setSelectedResultSemester('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedResultSemester === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All Semesters (Consolidated)
                </button>

                {(currentStudent.semesterResults || []).map((res) => (
                  <button
                    key={res.semester}
                    onClick={() => setSelectedResultSemester(res.semester)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedResultSemester === res.semester
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>Semester {res.semester}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-black ${
                      selectedResultSemester === res.semester ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    }`}>
                      {res.sgpa} SGPA
                    </span>
                    {res.status.includes('HONOURS') && <span>🎖️</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Semester Results Cards */}
            {(currentStudent.semesterResults || [])
              .filter((res) => selectedResultSemester === 'all' || res.semester === selectedResultSemester)
              .map((res) => (
                <div
                  key={res.semester}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 transition-all"
                >
                  {/* Semester Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono font-black text-xs">
                          Semester {res.semester}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {res.academicYear} • {res.sessionType}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                        {res.examType}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        Result Publication Date: <strong>{res.resultDate}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        res.status.includes('HONOURS')
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          : res.status === 'PASS'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  </div>

                  {/* 4 Performance Metric Badges for this Semester */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Semester SGPA
                      </div>
                      <div className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono mt-0.5">
                        {res.sgpa}
                      </div>
                      <span className="text-[10px] text-slate-500">Scale of 10.00</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Cumulative CGPA
                      </div>
                      <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono mt-0.5">
                        {res.cgpa}
                      </div>
                      <span className="text-[10px] text-slate-500">Progressive Overall</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Total Marks
                      </div>
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                        {res.totalMarks} <span className="text-xs font-normal text-slate-500">/ {res.maxMarks}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">{res.percentage}% Score</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Credits Earned
                      </div>
                      <div className="text-2xl font-black text-purple-700 dark:text-purple-300 font-mono mt-0.5">
                        {res.earnedCredits} <span className="text-xs font-normal text-slate-500">/ {res.totalCredits}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">100% Cleared</span>
                    </div>
                  </div>

                  {/* Subject-Wise Marks & Grade Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/80">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                          <th className="py-3 px-3">Subject Code & Name</th>
                          <th className="py-3 px-2 text-center">Credits</th>
                          <th className="py-3 px-2 text-center">CT-1 (30)</th>
                          <th className="py-3 px-2 text-center">CT-2 (30)</th>
                          <th className="py-3 px-2 text-center">Assign (20)</th>
                          <th className="py-3 px-2 text-center">Sessional (50)</th>
                          <th className="py-3 px-2 text-center">End-Sem (50)</th>
                          <th className="py-3 px-2 text-center">Total (100)</th>
                          <th className="py-3 px-2 text-center">Grade</th>
                          <th className="py-3 px-2 text-center">Points</th>
                          <th className="py-3 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {res.subjects.map((sub) => {
                          const internalTotal = Math.min(50, Math.round(((sub.classTest1 + sub.classTest2) / 60) * 30 + sub.assignment));
                          const endSemScaled = Math.min(50, Math.round((sub.endSem / 100) * 50));
                          const isPassed = sub.grade !== 'F';

                          return (
                            <tr key={sub.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{sub.name}</div>
                                <div className="text-[10px] font-mono text-slate-500">{sub.code}</div>
                              </td>
                              <td className="py-3 px-2 text-center font-bold font-mono text-slate-700 dark:text-slate-300">
                                {sub.credits}
                              </td>
                              <td className="py-3 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                                {sub.classTest1}
                              </td>
                              <td className="py-3 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                                {sub.classTest2}
                              </td>
                              <td className="py-3 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                                {sub.assignment}
                              </td>
                              <td className="py-3 px-2 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                                {internalTotal}
                              </td>
                              <td className="py-3 px-2 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                                {endSemScaled}
                              </td>
                              <td className="py-3 px-2 text-center font-mono font-black text-slate-900 dark:text-slate-100">
                                {sub.total}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-black font-mono ${
                                  sub.grade === 'A+' || sub.grade === 'A'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : sub.grade === 'B+' || sub.grade === 'B'
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                    : sub.grade === 'F'
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {sub.grade}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                                {sub.gradePoint}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPassed
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                                }`}>
                                  {isPassed ? 'PASSED ✓' : 'BACKLOG ✕'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100/70 dark:bg-slate-800/90 font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700">
                          <td className="py-3 px-3">
                            Semester Cumulative Aggregate
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-blue-600 dark:text-blue-400">
                            {res.totalCredits} Credits
                          </td>
                          <td colSpan={5} className="py-3 px-2 text-right text-slate-500">
                            Grand Total Marks:
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-black text-slate-900 dark:text-slate-100">
                            {res.totalMarks}/{res.maxMarks}
                          </td>
                          <td colSpan={2} className="py-3 px-2 text-center font-mono font-black text-blue-600 dark:text-blue-400">
                            SGPA: {res.sgpa}
                          </td>
                          <td className="py-3 px-3 text-center text-emerald-600 font-black">
                            {res.status}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Controller of Examinations Remarks */}
                  {res.remarks && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Academic Standing & Remarks: </strong>
                        {res.remarks}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {/* Progression & Comparison Across All Semesters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Multi-Semester SGPA & Academic Trajectory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {(currentStudent.semesterResults || []).map((res) => (
                  <div
                    key={res.semester}
                    className="p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800/70 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Semester {res.semester}</span>
                      <span className="font-mono">{res.academicYear}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {res.sgpa}
                      </span>
                      <span className="text-xs font-mono text-slate-500">SGPA</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(res.sgpa / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
                      <span>{res.percentage}% Score</span>
                      <span className="text-emerald-600 font-bold">{res.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: Semester Upgrade System */}
      {activeSubTab === 'semester_upgrade' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Semester Progression & Promotion Decision Engine</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated promotion checks based on AKTU rules: Attendance ≥ 75%, SGPA ≥ 5.00, Backlogs ≤ 2.
                </p>
              </div>

              {isFaculty ? (
                <button
                  onClick={handleBatchPromoteEligible}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                  id="btn-batch-promote"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Batch Upgrade All Eligible Students
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  Promotion Action Restricted to Faculty
                </div>
              )}
            </div>

            {/* Students Progression Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3">Student Details</th>
                    <th className="py-3 px-2 text-center">Current Sem</th>
                    <th className="py-3 px-2 text-center">Attendance %</th>
                    <th className="py-3 px-2 text-center">SGPA / CGPA</th>
                    <th className="py-3 px-2 text-center">Backlogs</th>
                    <th className="py-3 px-2 text-center">Promotion Eligibility</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.slice(0, 20).map((student) => {
                    const isAttEligible = student.attendancePercentage >= 75;
                    const isSgpaEligible = student.sgpa >= 5.0;
                    const isBacklogEligible = student.backlogs <= 2;
                    const isFullyEligible = isAttEligible && isSgpaEligible && isBacklogEligible && student.semester < 8;

                    return (
                      <tr key={student.rollNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                          <div className="font-mono text-[10px] text-slate-500">{student.rollNo} • {student.branch.split(' ')[0]}</div>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-blue-600 dark:text-blue-400">
                          Semester {student.semester}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`font-bold ${student.attendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {student.attendancePercentage}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold">
                          {student.sgpa} <span className="text-[10px] text-slate-400">({student.cgpa})</span>
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold">
                          <span className={student.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                            {student.backlogs}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {isFullyEligible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Eligible for Sem {student.semester + 1}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                              <AlertTriangle className="w-3 h-3" /> Detained / Criteria Short
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isFaculty ? (
                            <button
                              onClick={() => handlePromoteStudent(student)}
                              disabled={!isFullyEligible}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                                isFullyEligible
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:scale-105'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Promote to Sem {student.semester + 1} →
                            </button>
                          ) : (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg inline-block ${
                              isFullyEligible 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {isFullyEligible ? 'Eligible (Faculty Action)' : 'Ineligible'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Academic Term Timeline & Milestones Configurator */}
      {activeSubTab === 'milestones_config' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academic Calendar Term Milestones Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize semester term duration, Class Test evaluation cycles, practical examinations, and result publication targets.
              </p>
            </div>
            {!isFaculty && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center gap-1.5 shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> Modifiable by Faculty & Admin
              </span>
            )}
          </div>

          {milestoneSavedNotice && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Academic Term Milestones successfully saved to ERP State!
            </div>
          )}

          <form onSubmit={handleSaveMilestones} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Session / Term Title</label>
              <input
                type="text"
                disabled={!isFaculty}
                value={editedMilestones.termName}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, termName: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester Start Date</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.startDate}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, startDate: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class Test 1 (CT-1) Week</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.ct1Date}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, ct1Date: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mid-Semester Break</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.midSemBreak}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, midSemBreak: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Class Test 2 (CT-2) Week</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.ct2Date}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, ct2Date: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Practical / Lab Exams Date</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.practicalExamsDate}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, practicalExamsDate: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End-Semester Theory Exams</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.endSemExamsDate}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, endSemExamsDate: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Result Declaration Target</label>
              <input
                type="date"
                disabled={!isFaculty}
                value={editedMilestones.resultDeclarationDate}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, resultDeclarationDate: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Active Milestone</label>
              <input
                type="text"
                disabled={!isFaculty}
                value={editedMilestones.currentMilestone}
                onChange={(e) => setEditedMilestones({ ...editedMilestones, currentMilestone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-4">
              {isFaculty ? (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Milestone Dates & Notify Campus
                </button>
              ) : (
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Timeline saves restricted to Faculty
                </div>
              )}
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

