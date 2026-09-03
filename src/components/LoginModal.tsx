import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Building2,
  Home, 
  Globe, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  User,
  Sparkles,
  School,
  Loader2
} from 'lucide-react';
import { AuthSession, Student, Faculty } from '../types/erp';
import { SEED_ADMIN, SEED_STAFF, SEED_WARDEN } from '../data/seedData';
import { CollegeLogo } from './CollegeLogo';
import { authClientService } from '../services/authClientService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  students: Student[];
  facultyList: Faculty[];
}

export type RoleTabType = 'student' | 'faculty' | 'admin' | 'staff' | 'warden' | 'guest';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  students,
  facultyList,
}) => {
  const [activeRole, setActiveRole] = useState<RoleTabType>('student');
  
  const defaultStudent = students.find(s => s.rollNo === 'CS-2512140100045') || students[0];
  const [selectedStudentRoll, setSelectedStudentRoll] = useState<string>(defaultStudent?.rollNo || '');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(facultyList[0]?.facultyId || 'FAC-CSE-01');

  const [identifier, setIdentifier] = useState(defaultStudent?.rollNo || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');
  const [resetStatus, setResetStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const currentSelectedStudent = students.find(
    s => s.rollNo.toLowerCase() === identifier.trim().toLowerCase()
  ) || students.find(s => s.rollNo === selectedStudentRoll) || students[0];

  const currentSelectedFaculty = facultyList.find(
    f => f.facultyId.toLowerCase() === identifier.trim().toLowerCase() || f.email.toLowerCase() === identifier.trim().toLowerCase()
  ) || facultyList.find(f => f.facultyId === selectedFacultyId) || facultyList[0];

  const handleTabSelect = (tab: RoleTabType) => {
    setActiveRole(tab);
    setAuthError('');
    setPassword('');
    setShowPassword(false);

    switch (tab) {
      case 'student':
        setIdentifier(selectedStudentRoll || defaultStudent?.rollNo || '');
        break;
      case 'faculty':
        setIdentifier(selectedFacultyId || facultyList[0]?.facultyId || '');
        break;
      case 'admin':
        setIdentifier(SEED_ADMIN.adminId);
        break;
      case 'staff':
        setIdentifier(SEED_STAFF.staffId);
        break;
      case 'warden':
        setIdentifier(SEED_WARDEN.staffId);
        break;
      case 'guest':
        setIdentifier('GUEST-001');
        break;
    }
  };

  const handleGuestLogin = () => {
    const session: AuthSession = {
      role: 'guest',
      userId: 'GUEST-001',
      name: 'Public Visitor',
      email: 'visitor@mpdrec.ac.in',
    };
    onLoginSuccess(session);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (activeRole === 'guest') {
      handleGuestLogin();
      return;
    }

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setAuthError('Please enter your University Roll No. or ID.');
      return;
    }

    if (!cleanPass) {
      setAuthError('Please enter your password.');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await authClientService.login(activeRole, cleanId, cleanPass);

      if (!result.success) {
        if (result.lockedUntil) {
          setAuthError(
            `Account temporarily locked due to consecutive failed attempts. Retry in ${result.retryAfterSeconds || 900} seconds.`
          );
        } else {
          setAuthError(result.error || 'Invalid credentials. Please verify your ID and password.');
        }
        setIsVerifying(false);
        return;
      }

      let enrichedSession: AuthSession = result.session || {
        role: activeRole,
        userId: cleanId,
        name: cleanId,
        email: `${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}@mpdrec.ac.in`,
      };

      if (activeRole === 'student') {
        const cleanLower = cleanId.toLowerCase();
        const targetStudent = students.find(
          s => s.rollNo.toLowerCase() === cleanLower || (s.enrollmentNo && s.enrollmentNo.toLowerCase() === cleanLower)
        );
        if (targetStudent) {
          enrichedSession = {
            ...enrichedSession,
            name: targetStudent.name,
            email: targetStudent.email,
            rollNo: targetStudent.rollNo,
            branch: targetStudent.branch,
            semester: targetStudent.semester,
          };
        }
      } else if (activeRole === 'faculty') {
        const cleanLower = cleanId.toLowerCase();
        const targetFaculty = facultyList.find(
          f => f.facultyId.toLowerCase() === cleanLower || f.email.toLowerCase() === cleanLower
        );
        if (targetFaculty) {
          enrichedSession = {
            ...enrichedSession,
            name: targetFaculty.name,
            email: targetFaculty.email,
            facultyId: targetFaculty.facultyId,
            department: targetFaculty.department,
          };
        }
      } else if (activeRole === 'admin') {
        enrichedSession = {
          ...enrichedSession,
          role: 'admin',
          name: SEED_ADMIN.name,
          email: SEED_ADMIN.email,
          department: 'Registrar & Academic Administration',
        };
      } else if (activeRole === 'staff') {
        enrichedSession = {
          ...enrichedSession,
          role: 'staff',
          name: SEED_STAFF.name,
          email: SEED_STAFF.email,
          department: SEED_STAFF.department,
        };
      } else if (activeRole === 'warden') {
        enrichedSession = {
          ...enrichedSession,
          role: 'staff',
          name: SEED_WARDEN.name,
          email: SEED_WARDEN.email,
          department: SEED_WARDEN.department,
        };
      }

      onLoginSuccess(enrichedSession);
      onClose();
    } catch {
      setAuthError('An authentication error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      setResetStatus({ type: 'error', message: 'Please enter your University Roll No. or ID.' });
      return;
    }
    setResetStatus({ type: 'loading', message: 'Generating secure reset token...' });
    try {
      const res = await authClientService.requestPasswordReset(resetIdentifier.trim());
      if (res.success) {
        if (res.token) {
          setResetToken(res.token);
        }
        setResetStatus({ type: 'success', message: res.message });
        setResetStep('reset');
      } else {
        setResetStatus({ type: 'error', message: res.message || 'Failed to request password reset.' });
      }
    } catch {
      setResetStatus({ type: 'error', message: 'Server communication error during reset request.' });
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || newPassword.length < 6) {
      setResetStatus({
        type: 'error',
        message: 'Please enter the reset token and a new password (min 6 characters).',
      });
      return;
    }
    setResetStatus({ type: 'loading', message: 'Hashing password with Bcrypt (work factor 12)...' });
    try {
      const res = await authClientService.resetPasswordWithToken(resetToken.trim(), newPassword);
      if (res.success) {
        setResetStatus({ type: 'success', message: 'Password successfully updated! You may now sign in.' });
        setTimeout(() => {
          setShowForgotModal(false);
          setResetStep('request');
          setPassword(newPassword);
          setResetStatus({ type: 'idle', message: '' });
        }, 1500);
      } else {
        setResetStatus({ type: 'error', message: res.message || 'Failed to reset password.' });
      }
    } catch {
      setResetStatus({ type: 'error', message: 'Server communication error during password reset.' });
    }
  };

  const roleTabs = [
    { id: 'student' as RoleTabType, label: 'Student', icon: GraduationCap, color: 'blue' },
    { id: 'faculty' as RoleTabType, label: 'Faculty', icon: UserCheck, color: 'emerald' },
    { id: 'admin' as RoleTabType, label: 'Super Admin', icon: ShieldCheck, color: 'rose' },
    { id: 'staff' as RoleTabType, label: 'Accounts Staff', icon: Building2, color: 'amber' },
    { id: 'warden' as RoleTabType, label: 'Hostel Warden', icon: Home, color: 'orange' },
    { id: 'guest' as RoleTabType, label: 'Public Guest', icon: Globe, color: 'purple' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-x-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-login-title"
    >
      <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-indigo-950/80 rounded-3xl shadow-2xl shadow-indigo-950/30 max-w-2xl w-full overflow-hidden relative max-h-[92vh] flex flex-col transition-all">
        
        <div className="bg-gradient-to-br from-[#0a1128] via-[#101f42] to-[#1c2c5b] text-white p-4 sm:p-6 relative overflow-hidden shrink-0 border-b border-indigo-900/50">
          
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="hidden sm:flex absolute top-4 right-4 items-center gap-2">
            <button
              onClick={handleGuestLogin}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              id="btn-skip-and-visit-anyway-top"
              title="Explore public portal as Guest without credentials"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
              id="btn-close-login-modal"
              title="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex sm:hidden items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 border border-amber-300 shadow-md">
                <CollegeLogo className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-extrabold text-white tracking-tight truncate">MPDREC Portal</h2>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded font-mono font-bold">1214</span>
                </div>
                <p className="text-[10px] text-blue-200 truncate">Institutional ERP Authentication</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleGuestLogin}
                className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold border border-white/20 flex items-center gap-1 transition-all active:scale-95"
                title="Explore as Guest"
              >
                <span>Guest</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3.5 sm:pr-48">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center text-slate-950 shadow-lg shrink-0 border-2 border-amber-400/60">
              <CollegeLogo className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="modal-login-title" className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Maa Pateshwari Devi REC
                </h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold font-mono tracking-wider">
                  AKTU Code: 1214
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-1 font-medium">
                Official ERP Portal • Academic Session 2025–26
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 mt-3 sm:mt-5 bg-black/40 p-1.5 rounded-2xl backdrop-blur-md border border-white/15">
            {roleTabs.map((r) => {
              const Icon = r.icon;
              const isSelected = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  id={`role-tab-${r.id}`}
                  onClick={() => handleTabSelect(r.id)}
                  className={`flex flex-col items-center justify-center py-2.5 sm:py-2 px-1 rounded-xl text-center transition-all min-h-[50px] sm:min-h-[52px] ${
                    isSelected 
                      ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white font-black shadow-md ring-2 ring-blue-400/50 scale-[1.02]' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold'
                  }`}
                >
                  <Icon className={`w-4 sm:w-4.5 h-4 sm:h-4.5 mb-1 ${isSelected ? 'text-amber-300' : 'text-blue-200/80'}`} strokeWidth={isSelected ? 2.5 : 2} />
                  <span className="text-[11px] sm:text-xs leading-tight tracking-tight truncate w-full px-0.5">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 overflow-x-hidden flex-1">
          
          {activeRole === 'guest' ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-200 dark:border-purple-900/50 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-600/15 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-300 dark:border-purple-800 shadow-sm">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Public Campus Explorer & Visitor Access
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Explore public notices, academic syllabi, timetable schedules, hostel & fee charts, college councils, and event galleries without institutional credentials.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Campus Circulars</span>
                  <span className="text-[10px] text-slate-500">Live AKTU Notices</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Course Schedule</span>
                  <span className="text-[10px] text-slate-500">Sections A & B</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Event Gallery</span>
                  <span className="text-[10px] text-slate-500">Tejas 2k25 & Fests</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Faculty Directory</span>
                  <span className="text-[10px] text-slate-500">CSE Department</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                  Institutional members can switch to Student, Faculty, or Admin tabs above.
                </span>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-95 tracking-wide"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Continue as Guest Visitor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {activeRole === 'student' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Select Student Roll Number from Roster:</span>
                    </label>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                      {students.length} Enrolled
                    </span>
                  </div>

                  <select
                    value={selectedStudentRoll}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedStudentRoll(val);
                      setIdentifier(val);
                      setPassword('');
                      setAuthError('');
                    }}
                    className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                  >
                    {students.map((s) => (
                      <option key={s.rollNo} value={s.rollNo}>
                        {s.rollNo} — {s.name} ({s.branch.split(' ')[0]}, Sec {s.section || 'A'})
                      </option>
                    ))}
                  </select>

                  {currentSelectedStudent && (
                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {currentSelectedStudent.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {currentSelectedStudent.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                            {currentSelectedStudent.rollNo} • Sem {currentSelectedStudent.semester} (Sec {currentSelectedStudent.section || 'A'})
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold shrink-0 border border-blue-200 dark:border-blue-800">
                        Active Profile
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeRole === 'faculty' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Select Faculty Member:</span>
                    </label>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      {facultyList.length} Faculty
                    </span>
                  </div>

                  <select
                    value={selectedFacultyId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFacultyId(val);
                      setIdentifier(val);
                      setPassword('');
                      setAuthError('');
                    }}
                    className="w-full text-base sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-emerald-900/60 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                  >
                    {facultyList.map((f) => (
                      <option key={f.facultyId} value={f.facultyId}>
                        {f.facultyId} — {f.name} ({f.designation})
                      </option>
                    ))}
                  </select>

                  {currentSelectedFaculty && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {currentSelectedFaculty.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {currentSelectedFaculty.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {currentSelectedFaculty.facultyId} • {currentSelectedFaculty.designation}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-bold shrink-0 border border-emerald-200 dark:border-emerald-800">
                        Active Profile
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeRole === 'admin' && (
                <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {SEED_ADMIN.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {SEED_ADMIN.adminId} • {SEED_ADMIN.designation}
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'staff' && (
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {SEED_STAFF.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {SEED_STAFF.staffId} • {SEED_STAFF.designation}
                    </div>
                  </div>
                </div>
              )}

              {activeRole === 'warden' && (
                <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {SEED_WARDEN.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {SEED_WARDEN.staffId} • {SEED_WARDEN.designation}
                    </div>
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {activeRole === 'student' ? 'Roll No. / Enrollment ID' : activeRole === 'faculty' ? 'Faculty ID' : activeRole === 'admin' ? 'Admin ID' : activeRole === 'staff' ? 'Staff ID' : 'Warden Staff ID'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={activeRole === 'student' ? 'e.g. 2412140100001' : 'Enter institutional ID'}
                        required
                        className="w-full text-base sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none font-mono font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetIdentifier(identifier);
                          setShowForgotModal(true);
                          setResetStep('request');
                          setResetStatus({ type: 'idle', message: '' });
                        }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="••••••••••••"
                        required
                        autoComplete="current-password"
                        className="w-full text-base sm:text-sm pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1.5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    id="btn-skip-to-guest-bottom"
                  >
                    <span>Browse as Guest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-md shadow-blue-700/25 flex items-center justify-center gap-2 active:scale-95 tracking-wide disabled:opacity-60"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sign In to {roleTabs.find(r => r.id === activeRole)?.label}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

        {showForgotModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-[#101729] border border-slate-200 dark:border-indigo-900 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
              
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {resetStep === 'request' ? 'Password Recovery' : 'Set New Password'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {resetStep === 'request'
                      ? 'Enter your institutional ID to generate a 15-minute token'
                      : 'Bcrypt (work factor 12) salted password hashing'}
                  </p>
                </div>
              </div>

              {resetStatus.message && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                    resetStatus.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                      : resetStatus.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                      : 'bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {resetStatus.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  <span>{resetStatus.message}</span>
                </div>
              )}

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      University Roll No. / Employee ID
                    </label>
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. 2412140100001 or FAC-CSE-01"
                      required
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetStatus.type === 'loading'}
                      className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span>Generate Reset Token</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="32-byte cryptographic token"
                      required
                      className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password (min. 6 characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-indigo-900/60 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    >
                      ← Back to Request
                    </button>
                    <button
                      type="submit"
                      disabled={resetStatus.type === 'loading'}
                      className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span>Update Password</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
