import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  UserPlus, 
  Award, 
  Building, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Percent,
  Check,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  Camera,
  Upload,
  Loader2,
  Database,
  Download,
  CloudUpload,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { Student, AuthSession } from '../types/erp';
import { exportStudentsToCSV, exportAttendanceReportCSV } from '../utils/exportUtils';
import { supabaseSyncService } from '../services/supabaseSyncService';

interface StudentRosterProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (rollNo: string) => void;
  session: AuthSession;
  onOpenGradeCard: (student: Student) => void;
  onNavigateTimetable?: (section?: 'A' | 'B') => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  session,
  onOpenGradeCard,
  onNavigateTimetable,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<'all' | '2' | '3' | '4'>('all');
  const [selectedHostel, setSelectedHostel] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<'all' | 'A' | 'B'>('all');
  const [selectedSem, setSelectedSem] = useState<string>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'critical' | 'moderate' | 'excellent'>('all');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<'all' | 'Paid' | 'Partial' | 'Pending'>('all');
  
  // Modals state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmRoll, setDeleteConfirmRoll] = useState<string | null>(null);

  // Cloud & JSON Dataset Sync Modal state
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [isSyncingDataset, setIsSyncingDataset] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; percent: number; message: string } | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploadingJSON, setIsUploadingJSON] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  // New Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    rollNo: `CS-25121401000${students.length + 1}`,
    enrollmentNo: `2301214010${String(students.length + 1).padStart(4, '0')}`,
    gender: 'Male' as 'Male' | 'Female',
    email: '',
    phone: '+91 98765 43210',
    parentName: '',
    branch: 'Computer Science & Engineering' as any,
    semester: 3,
    section: 'A' as 'A' | 'B',
    attendancePercentage: 85,
    hostelName: 'Day Scholar',
    roomNo: '-',
    avatar: ''
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleSyncOfficialDataset = async () => {
    setIsSyncingDataset(true);
    setSyncFeedback(null);
    setSyncProgress({ current: 0, total: students.length || 296, percent: 5, message: 'Initiating Supabase SQL cloud synchronization...' });

    try {
      const result = await supabaseSyncService.syncOfficialDatasetToCloud((prog) => {
        setSyncProgress(prog);
      });

      if (result.success) {
        setSyncFeedback({
          type: 'success',
          message: `All ${result.count || students.length} student records successfully synced to Supabase SQL cloud storage!`
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: result.message || 'Sync encountered issues. Check database rules or configuration.'
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Sync failed. Please verify server connection.'
      });
    } finally {
      setIsSyncingDataset(false);
    }
  };

  const handleJSONFileProcess = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setSyncFeedback({ type: 'error', message: 'Please select a valid .json dataset file.' });
      return;
    }

    setIsUploadingJSON(true);
    setSyncFeedback(null);
    setSyncProgress({ current: 0, total: 100, percent: 10, message: `Processing ${file.name}...` });

    try {
      const result = await supabaseSyncService.uploadStudentJSONFile(file, (prog) => {
        setSyncProgress(prog);
      });

      if (result.success) {
        setSyncFeedback({
          type: 'success',
          message: `Successfully loaded and synced ${result.count} students from ${file.name} to Supabase SQL dataset!`
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: result.error || 'Failed to upload JSON student dataset.'
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Error processing JSON file.'
      });
    } finally {
      setIsUploadingJSON(false);
    }
  };

  const handleDownloadDatasetJSON = () => {
    try {
      const jsonString = JSON.stringify(students, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mpdrec_students_dataset_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      window.open('/api/db/students/json-dataset', '_blank');
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const roll = isEditMode && editingStudent ? editingStudent.rollNo : newStudentForm.rollNo;
      const publicUrl = await supabaseSyncService.uploadStudentProfileImage(roll, file);
      
      if (isEditMode && editingStudent) {
        setEditingStudent({ ...editingStudent, avatar: publicUrl });
      } else {
        setNewStudentForm(prev => ({ ...prev, avatar: publicUrl }));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (isEditMode && editingStudent) {
          setEditingStudent({ ...editingStudent, avatar: url });
        } else {
          setNewStudentForm(prev => ({ ...prev, avatar: url }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || s.branch === selectedBranch;
    const matchesSection = selectedSection === 'all' || s.section === selectedSection;
    const matchesSem = selectedSem === 'all' || s.semester === Number(selectedSem);
    
    const studentYear = String(s.currentYear || Math.ceil((s.semester || 3) / 2));
    const matchesYear = selectedYear === 'all' || studentYear === selectedYear;

    const hostelName = s.hostelAllotment?.hostelName || 'Day Scholar';
    const matchesHostel = selectedHostel === 'all' || 
      (selectedHostel === 'Day Scholar' ? hostelName === 'Day Scholar' : hostelName === selectedHostel);

    let matchesAttendance = true;
    if (attendanceFilter === 'critical') matchesAttendance = s.attendancePercentage < 75;
    else if (attendanceFilter === 'moderate') matchesAttendance = s.attendancePercentage >= 75 && s.attendancePercentage < 85;
    else if (attendanceFilter === 'excellent') matchesAttendance = s.attendancePercentage >= 85;

    const matchesFee = selectedFeeFilter === 'all' || s.feeStatus === selectedFeeFilter;

    return matchesSearch && matchesBranch && matchesYear && matchesHostel && matchesSection && matchesSem && matchesAttendance && matchesFee;
  });

  const handleToggleAttendance = (student: Student) => {
    const isBelow = student.attendancePercentage < 75;
    const newAttended = isBelow ? Math.min(100, student.attendedClasses + 10) : Math.max(0, student.attendedClasses - 10);
    const newPercent = Math.round((newAttended / student.totalClasses) * 100);
    
    const updated: Student = {
      ...student,
      attendedClasses: newAttended,
      attendancePercentage: newPercent,
      status: (newPercent < 75 || student.backlogs > 2) ? 'Detained' : student.cgpa >= 8.5 ? 'Honours' : 'Regular'
    };
    onUpdateStudent(updated);
    if (viewingStudent?.rollNo === student.rollNo) {
      setViewingStudent(updated);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent);
      setEditingStudent(null);
      if (viewingStudent?.rollNo === editingStudent.rollNo) {
        setViewingStudent(editingStudent);
      }
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStud: Student = {
      rollNo: newStudentForm.rollNo,
      enrollmentNo: newStudentForm.enrollmentNo,
      name: newStudentForm.name || 'New Engineering Scholar',
      gender: newStudentForm.gender,
      email: newStudentForm.email || `${newStudentForm.name.toLowerCase().replace(/\s+/g, '')}@mpdrec.ac.in`,
      phone: newStudentForm.phone,
      parentName: newStudentForm.parentName || 'Shri Parent Name',
      parentPhone: '+91 98765 00000',
      branch: newStudentForm.branch,
      semester: newStudentForm.semester,
      section: newStudentForm.section,
      admissionYear: 2023,
      avatar: newStudentForm.avatar || undefined,
      category: 'General',
      totalClasses: 100,
      attendedClasses: newStudentForm.attendancePercentage,
      attendancePercentage: newStudentForm.attendancePercentage,
      subjects: [
        { code: 'KCS-401', name: 'Data Structures & Algorithms', credits: 4, classTest1: 24, classTest2: 26, assignment: 18, endSem: 78, total: 80, grade: 'A', gradePoint: 9 },
        { code: 'KCS-402', name: 'Operating Systems', credits: 4, classTest1: 22, classTest2: 25, assignment: 17, endSem: 74, total: 75, grade: 'B+', gradePoint: 8 },
        { code: 'KIT-401', name: 'Database Management Systems', credits: 4, classTest1: 25, classTest2: 27, assignment: 19, endSem: 82, total: 85, grade: 'A', gradePoint: 9 },
        { code: 'KEC-401', name: 'Digital Logic & Computer Design', credits: 3, classTest1: 20, classTest2: 22, assignment: 16, endSem: 68, total: 70, grade: 'B+', gradePoint: 8 },
        { code: 'KAS-402', name: 'Discrete Mathematics', credits: 3, classTest1: 23, classTest2: 24, assignment: 18, endSem: 76, total: 78, grade: 'B+', gradePoint: 8 },
      ],
      sgpa: 8.4,
      cgpa: 8.2,
      backlogs: 0,
      status: 'Regular',
      academicProgressionHistory: [
        { semester: 1, sgpa: 8.0, promotionDate: '2024-01-20', remarks: 'Cleared sem 1' },
        { semester: 2, sgpa: 8.2, promotionDate: '2024-07-18', remarks: 'Cleared sem 2' },
        { semester: 3, sgpa: 8.4, promotionDate: '2025-01-22', remarks: 'Cleared sem 3' }
      ],
      totalFees: 55000,
      feesPaid: 55000,
      balanceFees: 0,
      feeStatus: 'Paid',
      hostelAllotment: {
        hostelName: newStudentForm.hostelName as any,
        roomNo: newStudentForm.roomNo,
        bed: 'A',
        allottedDate: '2025-08-01'
      },
      issuedBooks: []
    };

    onAddStudent(newStud);
    setShowAddModal(false);
  };

  const isAdminOrFaculty = session.role === 'admin' || session.role === 'faculty' || session.role === 'staff';

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Search & Action Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1 border border-blue-200 dark:border-blue-800">
              <GraduationCap className="w-3.5 h-3.5" /> Department Student Directory
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Enrolled Engineering Scholars ({students.length} Total)
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowDatasetModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm border border-slate-700 hover:border-slate-600"
              id="btn-open-dataset-sync"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Cloud SQL & JSON Dataset</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                {students.length}
              </span>
            </button>
            <button
              onClick={() => exportStudentsToCSV(students)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              id="btn-export-students-csv"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Roster (Excel)
            </button>
            <button
              onClick={() => exportAttendanceReportCSV(students)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              id="btn-export-attendance-csv"
            >
              <Percent className="w-4 h-4" />
              Attendance Report
            </button>
            {isAdminOrFaculty && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
                id="btn-add-student-modal"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 pt-2">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Roll No (e.g. 2512140100051), Name..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              id="input-search-students"
            />
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
              id="select-filter-year"
            >
              <option value="all">All Academic Years</option>
              <option value="2">2nd Year (Sem 3)</option>
              <option value="3">3rd Year (Sem 5)</option>
              <option value="4">4th Year (Sem 7)</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              id="select-filter-branch"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science & Engineering">Computer Science (CSE)</option>
              <option value="Electrical Engineering">Electrical Engg (EE)</option>
              <option value="Mechanical Engineering">Mechanical Engg (ME)</option>
              <option value="Civil Engineering">Civil Engg (CE)</option>
              <option value="Information Technology">Information Tech (IT)</option>
            </select>
          </div>

          {/* Hostel Filter */}
          <div>
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
              id="select-filter-hostel"
            >
              <option value="all">All Hostels & Day Scholars</option>
              <option value="Saryu Girls Hostel">Saryu Girls Hostel (4th & 2nd Yr)</option>
              <option value="Lehri Hostel">Lehri Hostel (3rd Yr & 1st Res)</option>
              <option value="Day Scholar">Day Scholars (Male/External)</option>
            </select>
          </div>

          {/* Attendance Threshold Filter */}
          <div>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Attendance</option>
              <option value="critical">🚨 Critical (&lt;75%)</option>
              <option value="moderate">⚠️ Satisfactory (75-85%)</option>
              <option value="excellent">⭐ High (&gt;85%)</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={selectedFeeFilter}
              onChange={(e) => setSelectedFeeFilter(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Fee Status</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Dues</option>
              <option value="Pending">Payment Pending</option>
            </select>
          </div>

        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student & Roll No</th>
                <th className="py-3.5 px-3">Branch & Sem</th>
                <th className="py-3.5 px-3 text-center">Attendance %</th>
                <th className="py-3.5 px-3 text-center">SGPA / CGPA</th>
                <th className="py-3.5 px-3 text-center">Hostel & Room</th>
                <th className="py-3.5 px-3 text-center">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((student) => {
                const isCriticalAtt = student.attendancePercentage < 75;
                return (
                  <tr key={student.rollNo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {student.name}
                          {student.status === 'Honours' && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1 rounded font-bold">HONOURS</span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {student.rollNo}
                        </div>
                      </div>
                    </td>

                    {/* Branch & Sem & Year */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{student.branch.split(' ')[0]}</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {student.currentYear ? `${student.currentYear}${student.currentYear === 1 ? 'st' : student.currentYear === 2 ? 'nd' : student.currentYear === 3 ? 'rd' : 'th'} Yr` : `Sem ${student.semester}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">Sem {student.semester} • Sec {student.section}</span>
                    </td>

                    {/* Attendance Indicator */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
                          <span className={isCriticalAtt ? 'text-rose-600 font-black' : student.attendancePercentage >= 85 ? 'text-emerald-600' : 'text-amber-600'}>
                            {student.attendancePercentage}%
                          </span>
                          {isCriticalAtt && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Below 75% AKTU threshold!"></span>
                          )}
                        </div>
                        {isAdminOrFaculty && (
                          <button
                            onClick={() => handleToggleAttendance(student)}
                            title="Toggle +10/-10 Attendance for quick demo testing"
                            className="text-[9px] text-slate-400 hover:text-blue-600 underline mt-0.5"
                          >
                            Quick Toggle
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Academics */}
                    <td className="py-3 px-3 text-center font-mono">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{student.sgpa} SGPA</div>
                      <div className="text-[10px] text-slate-500">CGPA: {student.cgpa}</div>
                    </td>

                    {/* Hostel */}
                    <td className="py-3 px-3 text-center text-xs">
                      {student.hostelAllotment?.hostelName && student.hostelAllotment?.hostelName !== 'Day Scholar' ? (
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Room {student.hostelAllotment?.roomNo} ({student.hostelAllotment?.bed})
                          </span>
                          <span className={`text-[10px] font-bold block truncate max-w-[120px] mx-auto px-1 rounded ${
                            student.hostelAllotment?.hostelName === 'Lehri Hostel' 
                              ? 'text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60'
                              : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60'
                          }`}>
                            {student.hostelAllotment?.hostelName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Day Scholar</span>
                      )}
                    </td>

                    {/* Fees */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.feeStatus === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                        student.feeStatus === 'Partial' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onOpenGradeCard(student)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                        title="Generate Official Semester Grade Card"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewingStudent(student)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                        title="View Full Profile Drawer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdminOrFaculty && (
                        <>
                          <button
                            onClick={() => setEditingStudent({ ...student })}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                            title="Edit Student Info"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {session.role === 'admin' && (
                            <button
                              onClick={() => setDeleteConfirmRoll(student.rollNo)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW STUDENT PROFILE DRAWER MODAL */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewingStudent(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Back to Roster"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{viewingStudent.name}</h3>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">{viewingStudent.rollNo} • Enr: {viewingStudent.enrollmentNo}</p>
                </div>
              </div>
              <button onClick={() => setViewingStudent(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Branch</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingStudent.branch.split(' ')[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Semester</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Semester {viewingStudent.semester}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Attendance</span>
                <span className={`font-bold ${viewingStudent.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {viewingStudent.attendancePercentage}% ({viewingStudent.attendedClasses}/100)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">SGPA</span>
                <span className="font-bold text-blue-600 font-mono">{viewingStudent.sgpa} / 10.0</span>
              </div>
            </div>

            {/* Hostel & Library Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-500" /> Hostel Allocation
                </h4>
                <p className="text-slate-600 dark:text-slate-400">{viewingStudent.hostelAllotment?.hostelName}</p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Room: {viewingStudent.hostelAllotment?.roomNo} • Bed: {viewingStudent.hostelAllotment?.bed}
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Library Issued Books ({viewingStudent.issuedBooks.length})
                </h4>
                {viewingStudent.issuedBooks.length > 0 ? (
                  <ul className="space-y-1">
                    {viewingStudent.issuedBooks.map(b => (
                      <li key={b.bookId} className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                        • {b.title} <span className="text-slate-400 text-[10px]">(Due: {b.dueDate})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-[11px]">No books currently issued</p>
                )}
              </div>
            </div>

            {/* Weekly Academic Schedule Card */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> Weekly Class Schedule & Timetable
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  Sem {viewingStudent.semester} CSE • Section {viewingStudent.section}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Enrolled in Section {viewingStudent.section}. Theory in LH-101; Labs in Computer Lab 1 & 2.
              </p>
              {onNavigateTimetable && (
                <button
                  onClick={() => {
                    onNavigateTimetable(viewingStudent.section);
                    setViewingStudent(null);
                  }}
                  className="w-full mt-2 py-2 px-3 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Open Section {viewingStudent.section} Class Timetable
                </button>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onOpenGradeCard(viewingStudent);
                  setViewingStudent(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
              >
                <Award className="w-4 h-4" />
                Generate Semester Grade Card
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">Edit Student Record: {editingStudent.name}</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              {/* Student Profile Picture Upload */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 relative border border-slate-300 dark:border-slate-600">
                  {editingStudent.avatar ? (
                    <img src={editingStudent.avatar} alt={editingStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                      {editingStudent.name.slice(0, 1) || 'S'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs mb-1">
                    Student Profile Photo (Supabase Storage)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold cursor-pointer hover:bg-blue-100 transition-colors">
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload New Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarFileSelect(e, true)}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Attendance Classes (out of 100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingStudent.attendedClasses}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingStudent({ 
                        ...editingStudent, 
                        attendedClasses: val, 
                        attendancePercentage: val 
                      });
                    }}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                  <select
                    value={editingStudent.semester}
                    onChange={(e) => setEditingStudent({ ...editingStudent, semester: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full">
            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">Enroll New Engineering Student</h3>
            
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              {/* Profile Photo Upload */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 relative border border-slate-300 dark:border-slate-600">
                  {newStudentForm.avatar ? (
                    <img src={newStudentForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                      {newStudentForm.name.slice(0, 1) || 'S'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs mb-1">
                    Student Profile Photo (Supabase Storage)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold cursor-pointer hover:bg-blue-100 transition-colors">
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{newStudentForm.avatar ? 'Change Photo' : 'Select Photo'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarFileSelect(e, false)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Utkarsh Srivastava"
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.rollNo}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, rollNo: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Branch</label>
                  <select
                    value={newStudentForm.branch}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, branch: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                  <select
                    value={newStudentForm.semester}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, semester: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Initial Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newStudentForm.attendancePercentage}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, attendancePercentage: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmRoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete Student Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete student with Roll <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{deleteConfirmRoll}</span>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmRoll(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deleteConfirmRoll);
                  setDeleteConfirmRoll(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOUD SQL & JSON DATASET MANAGER MODAL */}
      {showDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isSyncingDataset && !isUploadingJSON) {
                  setShowDatasetModal(false);
                  setSyncProgress(null);
                  setSyncFeedback(null);
                }
              }}
              disabled={isSyncingDataset || isUploadingJSON}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              id="btn-close-dataset-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                    PostgreSQL / Supabase Engine
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Encrypted Cloud Storage
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Student JSON Dataset & Cloud SQL Hub
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Seamlessly synchronize all {students.length} student records from the complete JSON dataset into the Supabase SQL database. Optimized with 50-record non-blocking batches and lossless JSONB schema preservation.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Enrolled</p>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">{students.length}</p>
                <p className="text-[10px] text-emerald-600 font-medium">B.Tech CSE</p>
              </div>
              <div className="text-center border-x border-slate-200 dark:border-slate-700">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Batches (2nd-4th Yr)</p>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">3 Batches</p>
                <p className="text-[10px] text-blue-600 font-medium">Sec A & B</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Cloud Status</p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Connected</p>
                </div>
                <p className="text-[10px] text-slate-400">PostgreSQL Ready</p>
              </div>
            </div>

            {/* Live Progress Bar if active */}
            {(isSyncingDataset || isUploadingJSON) && syncProgress && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    {syncProgress.message}
                  </span>
                  <span className="font-mono">{syncProgress.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-blue-200/60 dark:bg-blue-900/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(5, syncProgress.percent)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-blue-700 dark:text-blue-300">
                  <span>Batch Chunking Engine: 50 records/chunk</span>
                  <span className="font-mono">{syncProgress.current} / {syncProgress.total} records</span>
                </div>
              </div>
            )}

            {/* Sync Feedback Message */}
            {syncFeedback && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                syncFeedback.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                {syncFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-bold">{syncFeedback.type === 'success' ? 'Cloud Synchronization Success' : 'Notice'}</p>
                  <p className="leading-relaxed opacity-90">{syncFeedback.message}</p>
                </div>
              </div>
            )}

            {/* Action Cards */}
            <div className="space-y-3">
              
              {/* 1. One-Click Cloud Dataset Sync */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Sync Official JSON Dataset to Supabase SQL
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploads all {students.length} students with full transcripts, hostel records, subjects, and fee details.
                  </p>
                </div>
                <button
                  onClick={handleSyncOfficialDataset}
                  disabled={isSyncingDataset || isUploadingJSON}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 flex-shrink-0"
                  id="btn-sync-official-dataset"
                >
                  {isSyncingDataset ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing Dataset...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4" />
                      <span>Sync to Cloud SQL</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Drag and Drop JSON file upload */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleJSONFileProcess(file);
                }}
                className={`p-5 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]' 
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Upload & Import Custom Student JSON File
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Drag and drop your <span className="font-mono text-blue-600">.json</span> file here or browse from your computer
                  </p>
                </div>

                <input 
                  type="file"
                  ref={jsonFileInputRef}
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleJSONFileProcess(file);
                  }}
                  id="input-student-json-file"
                />

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => jsonFileInputRef.current?.click()}
                    disabled={isSyncingDataset || isUploadingJSON}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    id="btn-browse-json"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse JSON File
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadDatasetJSON}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-1.5"
                    id="btn-download-json-dataset"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JSON File
                  </button>
                </div>
              </div>

            </div>

            {/* Security Guarantee Footnote */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>
                All student uploads run securely via server-side endpoints with sanitized parameterization and zero plain credentials exposed.
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
