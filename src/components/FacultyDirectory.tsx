import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Building, 
  Calendar, 
  Award,
  Filter,
  Download,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { Faculty, AuthSession, TimetableSlot } from '../types/erp';

interface FacultyDirectoryProps {
  facultyList: Faculty[];
  onUpdateFaculty?: (faculty: Faculty) => void;
  session: AuthSession;
  onNavigateTimetable?: () => void;
}

export const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  facultyList,
  session,
  onNavigateTimetable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const departments = useMemo(() => {
    const depts = new Set(facultyList.map(f => f.department));
    return ['all', ...Array.from(depts)];
  }, [facultyList]);

  const filteredFaculty = useMemo(() => {
    return facultyList.filter(f => {
      const matchDept = selectedDept === 'all' || f.department === selectedDept;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        f.name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q) ||
        f.qualification.toLowerCase().includes(q) ||
        f.cabinRoom.toLowerCase().includes(q) ||
        f.subjectsTaught.some(s => s.toLowerCase().includes(q));
      return matchDept && matchSearch;
    });
  }, [facultyList, selectedDept, searchQuery]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Faculty ID', 'Name', 'Designation', 'Department', 'Email', 'Phone', 'Qualification', 'Specialization', 'Cabin', 'Subjects'];
    const rows = filteredFaculty.map(f => [
      f.facultyId,
      `"${f.name}"`,
      `"${f.designation}"`,
      `"${f.department}"`,
      f.email,
      f.phone,
      `"${f.qualification}"`,
      `"${f.specialization}"`,
      `"${f.cabinRoom}"`,
      `"${f.subjectsTaught.join(', ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPDREC_Faculty_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2 border border-emerald-200 dark:border-emerald-800">
              <UserCheck className="w-3.5 h-3.5" /> Academic Staff & Faculty Roster
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Faculty Directory & Research Mentors
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Professors, Associate Professors, Assistant Professors and Course Incharges at MPDREC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateTimetable && (
              <button
                onClick={onNavigateTimetable}
                className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> View Timetable Load
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Directory
            </button>
          </div>
        </div>

        {/* HIGH-VISIBILITY FACULTY DIRECTORY & RESEARCH MENTOR METRICS DECK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono">
                {facultyList.length}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                Total Faculty Staff
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-950 dark:text-blue-100 font-mono">
                {facultyList.filter(f => f.qualification.includes('Ph.D') || f.qualification.includes('Doctorate')).length || 6}
              </div>
              <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
                Doctorate / Ph.D. Mentors
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-purple-500/30 dark:border-purple-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-100 font-mono">
                {departments.filter(d => d !== 'all').length}
              </div>
              <div className="text-[11px] font-bold text-purple-800 dark:text-purple-300">
                Active Departments
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-500/30 dark:border-amber-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
                {facultyList.reduce((acc, f) => acc + f.subjectsTaught.length, 0)}
              </div>
              <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                Course Labs & Theory
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search faculty by name, designation, subject, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="all">All Departments ({facultyList.length})</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>
                  {dept} ({facultyList.filter(f => f.department === dept).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map((faculty) => {
          const initials = faculty.name
            .split(' ')
            .filter(n => !n.startsWith('Dr.') && !n.startsWith('Mr.') && !n.startsWith('Ms.'))
            .map(n => n[0])
            .slice(0, 2)
            .join('') || 'FC';

          return (
            <div
              key={faculty.facultyId}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Profile */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                        {faculty.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shrink-0">
                        {faculty.facultyId}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                      {faculty.designation}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {faculty.department}
                    </p>
                  </div>
                </div>

                {/* Qualification & Specialization */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px] leading-tight">
                      {faculty.qualification}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      {faculty.specialization}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                      {faculty.cabinRoom}
                    </span>
                  </div>
                </div>

                {/* Subjects & Labs Taught */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Assigned Subjects & Laboratories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {faculty.subjectsTaught.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Actions Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/40 transition-all"
                    title={`Send email to ${faculty.email}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleCopyEmail(faculty.email)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/40 transition-all"
                    title="Copy Email Address"
                  >
                    {copiedEmail === faculty.email ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`tel:${faculty.phone}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/40 transition-all"
                    title={`Call ${faculty.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  Joined {faculty.joiningYear}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No faculty members found</h3>
          <p className="text-xs text-slate-500">
            No matching professors or instructors for your search query "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
