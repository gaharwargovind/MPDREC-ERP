import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Filter, 
  Plus, 
  X, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  Layers, 
  FileText, 
  GraduationCap, 
  Info,
  Sparkles,
  Users,
  Grid3X3,
  ListFilter,
  RotateCcw
} from 'lucide-react';
import { TimetableSlot, AuthSession, SubjectCourseDetail } from '../types/erp';
import { 
  SEED_COURSE_DETAILS, 
  SEED_TIMETABLE, 
  TIMETABLE_METADATA_BY_YEAR, 
  ALL_YEAR_COURSE_DETAILS 
} from '../data/seedData';

interface TimetableModuleProps {
  timetable: TimetableSlot[];
  onUpdateTimetable: (slots: TimetableSlot[]) => void;
  session: AuthSession;
}

const getPeriodHeaders = (semester: number) => [
  { id: '1', period: 'I', time: semester === 3 ? '09:10AM - 10:00AM' : '09:10AM - 09:50AM', label: 'Period 1' },
  { id: '2', period: 'II', time: '10:00AM - 10:50AM', label: 'Period 2' },
  { id: '3', period: 'III', time: '10:50AM - 11:40AM', label: 'Period 3' },
  { id: '4', period: 'IV', time: '11:40AM - 12:30PM', label: 'Period 4' },
  { id: 'lunch', period: 'LUNCH', time: '12:30PM - 02:00PM', label: 'Lunch Break' },
  { id: '5', period: 'V', time: '02:00PM - 02:50PM', label: 'Period 5' },
  { id: '6', period: 'VI', time: '02:50PM - 03:40PM', label: 'Period 6' },
  { id: '7', period: 'VII', time: '03:40PM - 04:30PM', label: 'Period 7' },
];

const DAYS_OF_WEEK: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
];

export const TimetableModule: React.FC<TimetableModuleProps> = ({
  timetable,
  onUpdateTimetable,
  session,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(() => {
    if (session?.user?.semester && [3, 5, 7].includes(session.user.semester)) {
      return session.user.semester;
    }
    return 3;
  });
  const [activeTab, setActiveTab] = useState<'master' | 'daily' | 'courses' | 'print'>('master');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [selectedSection, setSelectedSection] = useState<'All' | 'A' | 'B'>('All');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>('all');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);

  const yearMeta = TIMETABLE_METADATA_BY_YEAR[selectedSemester as 3 | 5 | 7] || TIMETABLE_METADATA_BY_YEAR[3];
  const PERIOD_HEADERS = useMemo(() => getPeriodHeaders(selectedSemester), [selectedSemester]);
  const activeCourseDetails = useMemo(() => ALL_YEAR_COURSE_DETAILS[selectedSemester] || SEED_COURSE_DETAILS, [selectedSemester]);

  // New slot form state
  const [newSlot, setNewSlot] = useState<Partial<TimetableSlot>>({
    day: 'Monday',
    timeSlot: '09:00 AM - 09:50 AM',
    period: '1',
    subjectCode: 'BCS301',
    subjectName: 'Data Structure',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    roomNo: yearMeta.classroom,
    type: 'Lecture',
    branch: 'Computer Science & Engineering',
    semester: selectedSemester,
    section: 'All',
  });

  const facultyOptions = useMemo(() => {
    const map = new Map<string, string>();
    activeCourseDetails.forEach(c => {
      if (c.facultyAbbr && c.facultyName) {
        map.set(c.facultyAbbr, `${c.facultyName} (${c.facultyAbbr})`);
      }
    });
    return Array.from(map.entries());
  }, [activeCourseDetails]);

  const filteredSlots = useMemo(() => {
    return timetable.filter(slot => {
      if (slot.semester && slot.semester !== selectedSemester) return false;
      const matchDay = slot.day === selectedDay;
      const matchSection = selectedSection === 'All' || !slot.section || slot.section === 'All' || slot.section === selectedSection;
      const matchType = filterType === 'all' || slot.type === filterType;
      const matchFaculty = selectedFacultyFilter === 'all' || slot.facultyAbbr === selectedFacultyFilter || slot.facultyName.includes(selectedFacultyFilter);
      
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        slot.subjectCode.toLowerCase().includes(q) ||
        slot.subjectName.toLowerCase().includes(q) ||
        slot.facultyName.toLowerCase().includes(q) ||
        (slot.roomNo && slot.roomNo.toLowerCase().includes(q));

      return matchDay && matchSection && matchType && matchFaculty && matchQuery;
    });
  }, [timetable, selectedSemester, selectedDay, selectedSection, filterType, selectedFacultyFilter, searchQuery]);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TimetableSlot = {
      id: `TT-${Date.now()}`,
      day: (newSlot.day as any) || 'Monday',
      timeSlot: newSlot.timeSlot || '09:00 AM - 09:50 AM',
      period: newSlot.period || '1',
      subjectCode: newSlot.subjectCode || 'BCS301',
      subjectName: newSlot.subjectName || 'Data Structure',
      facultyName: newSlot.facultyName || 'Mr. Sandip Kumar Singh',
      facultyAbbr: newSlot.facultyAbbr || 'SKS',
      roomNo: newSlot.roomNo || 'Lecture Hall LH-101',
      room: newSlot.roomNo || 'Lecture Hall LH-101',
      type: (newSlot.type as any) || 'Lecture',
      branch: 'Computer Science & Engineering',
      semester: 3,
      section: (newSlot.section as any) || 'All',
      span: 1,
    };

    onUpdateTimetable([...timetable, created]);
    setShowAddSlotModal(false);
  };

  const handleDeleteSlot = (id: string) => {
    onUpdateTimetable(timetable.filter(t => t.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['Day', 'Period', 'Time Slot', 'Subject Code', 'Subject Name', 'Type', 'Section', 'Faculty', 'Abbr', 'Room'];
    const rows = timetable
      .filter(s => !s.semester || s.semester === selectedSemester)
      .map(s => [
        s.day,
        s.period || '',
        `"${s.timeSlot}"`,
        s.subjectCode,
        `"${s.subjectName}"`,
        s.type || '',
        s.section || 'All',
        `"${s.facultyName}"`,
        s.facultyAbbr || '',
        `"${s.roomNo || s.room || ''}"`
      ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPDREC_CSE_Timetable_Sem${selectedSemester}_2026-27.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const isAdminOrFaculty = session.role === 'admin' || session.role === 'faculty';

  // Helper to find slots for grid cell
  const getSlotsForGrid = (day: string, periodNum: string) => {
    return timetable.filter(s => {
      if (s.semester && s.semester !== selectedSemester) return false;
      if (s.day !== day) return false;
      if (selectedSection !== 'All' && s.section && s.section !== 'All' && s.section !== selectedSection) {
        return false;
      }
      if (s.period === periodNum) return true;
      if (typeof s.period === 'string' && s.period.includes('-')) {
        const [start, end] = s.period.split('-').map(Number);
        const p = Number(periodNum);
        if (p >= start && p <= end) return true;
      }
      return false;
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ===================== INSTITUTION OFFICIAL HEADER BANNER ===================== */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/60 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-mono font-bold tracking-wide border border-blue-400/30">
                Department of Computer Science and Engineering
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                ODD Semester (Session 2026-27)
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                Effective: {yearMeta.effectiveFrom}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Maa Pateshwari Devi Rajkiya Engineering College, Gonda</span>
            </h1>
            <p className="text-sm font-medium text-slate-300">
              Official Class & Practical Laboratory Schedule • <span className="text-white font-bold">B.Tech. CSE – {yearMeta.yearLabel} ({yearMeta.semesterLabel})</span>
            </p>

            {/* Year & Semester Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {[
                { sem: 3, label: '2nd Year (Semester III)', room: 'LH-101', eff: '30/07/2026' },
                { sem: 5, label: '3rd Year (Semester V)', room: 'LH-201', eff: '29/07/2026' },
                { sem: 7, label: '4th Year (Semester VII)', room: 'LH-301', eff: '28/07/2026' },
              ].map(tab => (
                <button
                  key={tab.sem}
                  onClick={() => setSelectedSemester(tab.sem)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSemester === tab.sem
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-white/30'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono text-blue-200">
                    {tab.room}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-start md:self-center">
            {isAdminOrFaculty && (
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
                id="btn-add-timetable-slot"
              >
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Reset timetable to the latest official college schedule?')) {
                  onUpdateTimetable(SEED_TIMETABLE);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              title="Reset to Official Schedule"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" /> Reset Schedule
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              title="Download Timetable as CSV"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              title="Print Schedule"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-700/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('master')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'master'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Grid3X3 className="w-4 h-4 text-blue-600" />
            Official Master Grid
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'daily'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            Daily Timeline View
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'courses'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Course & Faculty Matrix ({activeCourseDetails.length})
          </button>
        </div>
      </div>

      {/* ===================== MASTER 2D GRID VIEW ===================== */}
      {activeTab === 'master' && (
        <div className="space-y-6">
          {/* Quick Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Section Filter:</span>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(['All', 'A', 'B'] as const).map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSection === sec
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {sec === 'All' ? 'Combined View' : `Section ${sec}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-700 inline-block" />
                <span>Theory Lecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 inline-block" />
                <span>Practical Lab (2 periods)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 inline-block" />
                <span>Tutorial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-700 inline-block" />
                <span>DCC Activity</span>
              </div>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  Institutional Master Timetable Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  B.Tech. CSE {yearMeta.yearLabel} ({yearMeta.semesterLabel}) • All Days & Periods
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Classroom: {yearMeta.classroom}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] w-28 border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-slate-100 dark:bg-slate-800 z-10">
                      Day / Period
                    </th>
                    {PERIOD_HEADERS.map(p => (
                      <th 
                        key={p.id} 
                        className={`p-3 font-bold text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${
                          p.id === 'lunch' ? 'bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 w-24' : 'min-w-[110px]'
                        }`}
                      >
                        <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{p.period}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 leading-tight">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {DAYS_OF_WEEK.map((day) => {
                    return (
                      <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Day Label Sticky Header */}
                        <td className="p-3.5 font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs border-r border-slate-200 dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {day}
                        </td>

                        {/* Period 1 */}
                        {renderMasterGridCell(day, '1')}

                        {/* Period 2 */}
                        {renderMasterGridCell(day, '2')}

                        {/* Period 3 */}
                        {renderMasterGridCell(day, '3')}

                        {/* Period 4 */}
                        {renderMasterGridCell(day, '4')}

                        {/* LUNCH BREAK */}
                        <td className="p-2 text-center bg-amber-50/40 dark:bg-amber-950/10 border-r border-slate-200 dark:border-slate-700">
                          <div className="text-[10px] font-black tracking-widest text-amber-700 dark:text-amber-400 uppercase py-2">
                            LUNCH
                          </div>
                        </td>

                        {/* Period 5 */}
                        {renderMasterGridCell(day, '5')}

                        {/* Period 6 */}
                        {renderMasterGridCell(day, '6')}

                        {/* Period 7 */}
                        {renderMasterGridCell(day, '7')}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Verification Signatures Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-850/70 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-blue-600 dark:text-blue-400 font-bold text-sm">
                  Sandip Kr. Singh
                </div>
                <div className="pt-1 border-t border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  Mr. Sandip Kumar Singh (SKS)
                </div>
                <div className="text-[11px] text-slate-500">Time Table Co-ordinator</div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  Dr. Rohit Tripathi
                </div>
                <div className="pt-1 border-t border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  Dr. Rohit Tripathi (RT)
                </div>
                <div className="text-[11px] text-slate-500">Head of Department (CSE)</div>
              </div>

              <div className="space-y-1">
                <div className="h-10 flex items-end justify-center font-serif italic text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  Director / Registrar
                </div>
                <div className="pt-1 border-t border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                  Er. Virendra Pratap Singh
                </div>
                <div className="text-[11px] text-slate-500">Chief Academic Registrar</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DAILY TIMELINE / CARD VIEW ===================== */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Day Selector Ribbon */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Select Day of Week
              </h3>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(['All', 'A', 'B'] as const).map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSection === sec
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {sec === 'All' ? 'All Sections' : `Sec ${sec}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {DAYS_OF_WEEK.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedDay === d
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {d}
                </button>
              ))}
            </div>

            {/* Filter Sub-bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subject, faculty, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="all">All Session Types</option>
                  <option value="Lecture">Theory Lectures</option>
                  <option value="Practical">Practical Laboratories</option>
                  <option value="Tutorial">Tutorial Sessions</option>
                  <option value="Activity">DCC Activities</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedFacultyFilter}
                  onChange={(e) => setSelectedFacultyFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="all">All Faculty Members</option>
                  {facultyOptions.map(([abbr, label]) => (
                    <option key={abbr} value={abbr}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid for Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => {
                const isPractical = slot.type === 'Practical' || slot.type === 'Lab';
                const isTute = slot.type === 'Tutorial';
                const isActivity = slot.type === 'Activity';

                return (
                  <div
                    key={slot.id}
                    className={`p-5 rounded-3xl border transition-all relative overflow-hidden group shadow-sm ${
                      isPractical
                        ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/30 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isTute
                        ? 'bg-gradient-to-br from-amber-50/70 to-orange-50/30 dark:from-slate-900 dark:to-amber-950/20 border-amber-200 dark:border-amber-900/60'
                        : isActivity
                        ? 'bg-gradient-to-br from-purple-50/70 to-indigo-50/30 dark:from-slate-900 dark:to-purple-950/20 border-purple-200 dark:border-purple-900/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    {/* Badge & Time Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isPractical
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isTute
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : isActivity
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {slot.type} {slot.period ? `(Period ${slot.period})` : ''}
                      </span>
                      
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {slot.timeSlot}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {slot.subjectCode}
                      </span>
                      {slot.section && slot.section !== 'All' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          Section {slot.section}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                      {slot.subjectName}
                    </h4>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{slot.facultyName}</span>
                        </div>
                        {slot.facultyAbbr && (
                          <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                            {slot.facultyAbbr}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {slot.roomNo || slot.room || 'LH-101'}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                          Sem {slot.semester} CSE
                        </span>
                      </div>
                    </div>

                    {isAdminOrFaculty && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-opacity shadow-sm"
                        title="Remove Slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No scheduled sessions match the current filters.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try switching the section filter, clearing search, or selecting another day.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== COURSE & FACULTY DIRECTORY (Extracted Table) ===================== */}
      {activeTab === 'courses' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
                <BookOpen className="w-3.5 h-3.5" /> Official Curriculum Allotment
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Subject Codes, Faculty Allotment & Weekly Load • {yearMeta.yearLabel} ({yearMeta.semesterLabel})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Maa Pateshwari Devi Rajkiya Engineering College, Gonda • Department of Computer Science & Engineering (Session 2026-27)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { sem: 3, label: '3rd Sem' },
                  { sem: 5, label: '5th Sem' },
                  { sem: 7, label: '7th Sem' },
                ].map(b => (
                  <button
                    key={b.sem}
                    onClick={() => setSelectedSemester(b.sem)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedSemester === b.sem
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" /> Export Matrix
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold uppercase text-[10px] w-12 text-center">S.No.</th>
                  <th className="p-3 font-bold uppercase text-[10px]">Subject Code</th>
                  <th className="p-3 font-bold uppercase text-[10px]">Subject Name</th>
                  <th className="p-3 font-bold uppercase text-[10px]">Faculty Incharge</th>
                  <th className="p-3 font-bold uppercase text-[10px] text-center">Abbr</th>
                  <th className="p-3 font-bold uppercase text-[10px]">Type / Periods (p/w)</th>
                  <th className="p-3 font-bold uppercase text-[10px] text-center">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {activeCourseDetails.map((course) => {
                  const isPractical = course.category === 'Practical';
                  return (
                    <tr key={course.sNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-500">{course.sNo}</td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{course.subjectCode}</td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">{course.subjectName}</td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{course.facultyName}</td>
                      <td className="p-3 text-center">
                        <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {course.facultyAbbr}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-600 dark:text-slate-400 font-mono text-[11px]">{course.typePeriods}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPractical
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {course.category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">DCC Note (Departmental / Co-curricular):</p>
              <p>DCC periods include Departmental Activities, Coding Hackathon mentorship, Technical Club workshops, Doubt Clearing sessions, and Remedial classes supervised by CSE faculty members.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ADD SLOT MODAL (FOR ADMIN & FACULTY) ===================== */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Add Timetable Slot
              </h3>
              <button onClick={() => setShowAddSlotModal(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Day of Week</label>
                  <select
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Period Number</label>
                  <input
                    type="text"
                    value={newSlot.period}
                    onChange={(e) => setNewSlot({ ...newSlot, period: e.target.value })}
                    placeholder="e.g. 1, 2, 1-2, 5-6"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Time Slot</label>
                  <input
                    type="text"
                    value={newSlot.timeSlot}
                    onChange={(e) => setNewSlot({ ...newSlot, timeSlot: e.target.value })}
                    placeholder="e.g. 09:00 AM - 09:50 AM"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Section</label>
                  <select
                    value={newSlot.section}
                    onChange={(e) => setNewSlot({ ...newSlot, section: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    <option value="All">All Sections (Combined)</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Subject Code</label>
                  <input
                    type="text"
                    value={newSlot.subjectCode}
                    onChange={(e) => setNewSlot({ ...newSlot, subjectCode: e.target.value })}
                    placeholder="e.g. BCS301"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Session Type</label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    <option value="Lecture">Lecture (Theory)</option>
                    <option value="Practical">Practical (Laboratory)</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Activity">DCC Activity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSlot.subjectName}
                  onChange={(e) => setNewSlot({ ...newSlot, subjectName: e.target.value })}
                  placeholder="e.g. Data Structure"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Faculty Name</label>
                  <input
                    type="text"
                    value={newSlot.facultyName}
                    onChange={(e) => setNewSlot({ ...newSlot, facultyName: e.target.value })}
                    placeholder="e.g. Mr. Sandip Kumar Singh"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Faculty Abbreviation</label>
                  <input
                    type="text"
                    value={newSlot.facultyAbbr}
                    onChange={(e) => setNewSlot({ ...newSlot, facultyAbbr: e.target.value })}
                    placeholder="e.g. SKS"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Room / Hall / Lab</label>
                <input
                  type="text"
                  value={newSlot.roomNo}
                  onChange={(e) => setNewSlot({ ...newSlot, roomNo: e.target.value })}
                  placeholder="e.g. Lecture Hall LH-101 or DS Lab"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddSlotModal(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  function renderMasterGridCell(day: string, periodNum: string) {
    const slots = getSlotsForGrid(day, periodNum);

    if (!slots || slots.length === 0) {
      return (
        <td key={`${day}-${periodNum}`} className="p-2 text-center text-slate-300 dark:text-slate-600 font-mono text-[10px] border-r border-slate-200 dark:border-slate-700">
          —
        </td>
      );
    }

    if (slots.length === 1) {
      const slot = slots[0];
      const isPractical = slot.type === 'Practical' || slot.type === 'Lab';
      const isTute = slot.type === 'Tutorial';
      const isActivity = slot.type === 'Activity';

      return (
        <td 
          key={`${day}-${periodNum}`}
          className={`p-2 border-r border-slate-200 dark:border-slate-700 transition-all ${
            isPractical
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
              : isTute
              ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200'
              : isActivity
              ? 'bg-purple-50/50 dark:bg-purple-950/20 text-purple-950 dark:text-purple-200'
              : 'bg-blue-50/30 dark:bg-blue-950/10 text-slate-900 dark:text-slate-100'
          }`}
        >
          <div className="flex flex-col h-full justify-between gap-1 text-center min-h-[58px]">
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono font-black text-xs text-blue-700 dark:text-blue-300">
                {slot.subjectCode}
              </span>
              {slot.section && slot.section !== 'All' && (
                <span className="text-[9px] font-bold px-1 rounded bg-slate-200 dark:bg-slate-700">
                  {slot.section}
                </span>
              )}
            </div>

            <div className="text-[10px] font-semibold truncate leading-tight" title={slot.subjectName}>
              {slot.subjectName.length > 22 ? slot.subjectName.substring(0, 20) + '...' : slot.subjectName}
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono px-0.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {slot.facultyAbbr || slot.facultyName.split(' ').slice(-1)[0]}
              </span>
              <span className="text-[9px] truncate max-w-[45px]" title={slot.roomNo || slot.room}>
                {slot.roomNo?.split(' ')[0] || slot.room?.split(' ')[0] || 'LH-101'}
              </span>
            </div>
          </div>
        </td>
      );
    }

    // When 2 parallel section labs exist (e.g. Sec-A and Sec-B simultaneously)
    return (
      <td 
        key={`${day}-${periodNum}`}
        className="p-1 border-r border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40"
      >
        <div className="flex flex-col gap-1 min-h-[58px] justify-between">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="p-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800/60 text-[9px] leading-tight"
            >
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="text-emerald-800 dark:text-emerald-300">{slot.subjectCode}</span>
                <span className="px-1 rounded bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-black">
                  {slot.section || 'Lab'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[8px] text-slate-600 dark:text-slate-300 mt-0.5">
                <span>{slot.facultyAbbr || slot.facultyName.split(' ').slice(-1)[0]}</span>
                <span className="truncate max-w-[40px]">{slot.roomNo?.split(' ')[0] || 'Lab'}</span>
              </div>
            </div>
          ))}
        </div>
      </td>
    );
  }
};
