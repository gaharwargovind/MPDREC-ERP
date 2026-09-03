import React from 'react';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck, QrCode, ArrowLeft } from 'lucide-react';
import { Student } from '../types/erp';
import { CollegeLogo } from './CollegeLogo';

interface GradeCardModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export const GradeCardModal: React.FC<GradeCardModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [selectedSemester, setSelectedSemester] = React.useState<number>(student?.semester || 3);

  // Sync when student changes
  React.useEffect(() => {
    if (student) {
      setSelectedSemester(student.semester);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  // Determine active subjects and stats based on selected semester
  const isCurrentSem = selectedSemester === student.semester;
  const historicalResult = student.semesterResults?.find(r => r.semester === selectedSemester);

  const activeSubjects = isCurrentSem 
    ? student.subjects 
    : (historicalResult?.subjects || student.subjects);

  const totalCredits = activeSubjects.reduce((sum, s) => sum + s.credits, 0);
  const totalCreditPoints = activeSubjects.reduce((sum, s) => sum + (s.credits * s.gradePoint), 0);
  const calculatedSGPA = isCurrentSem 
    ? Number((totalCreditPoints / totalCredits).toFixed(2))
    : (historicalResult?.sgpa || Number((totalCreditPoints / totalCredits).toFixed(2)));

  const hasBacklog = activeSubjects.some(s => s.grade === 'F');

  let resultDivision = 'FIRST DIVISION WITH HONOURS';
  if (hasBacklog) {
    resultDivision = 'FAILED / PENDING BACKLOG CLEARANCE';
  } else if (student.cgpa < 6.0) {
    resultDivision = 'SECOND DIVISION';
  } else if (student.cgpa < 7.5) {
    resultDivision = 'FIRST DIVISION';
  }

  const semesterLabel = isCurrentSem
    ? `Semester ${student.semester} (Academic Session 2025–2026)`
    : `Semester ${selectedSemester} (${historicalResult?.academicYear || '2024–2025'} • ${historicalResult?.sessionType || 'Previous Semester'})`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-300 relative print:m-0 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all shadow-sm group"
              id="btn-back-from-grade-card"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Portal</span>
            </button>
            <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-slate-300">Official Semester Grade Statement</span>
            </div>
          </div>

          {/* Semester Selector in Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSelectedSemester(student.semester)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedSemester === student.semester
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sem {student.semester} (Current)
              </button>
              {(student.semesterResults || []).map((res) => (
                <button
                  key={res.semester}
                  onClick={() => setSelectedSemester(res.semester)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedSemester === res.semester
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sem {res.semester}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              id="btn-print-grade-card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Marksheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Container */}
        <div className="p-8 sm:p-10 bg-white relative" id="grade-card-printable-area">
          
          {/* Watermark Emblem in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <CollegeLogo className="w-[420px] h-[420px]" />
          </div>

          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center relative">
            <div className="flex items-center justify-between mb-2">
              <div className="w-18 h-18 p-1 flex items-center justify-center shrink-0">
                <CollegeLogo className="w-16 h-16" />
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-serif">
                  Maa Pateshwari Devi Rajkiya Engineering College
                </h1>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest mt-0.5">
                  Balrampur / Gonda, Uttar Pradesh • Institutional Code: 1214
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  (Approved by AICTE, New Delhi & Affiliated to Dr. A.P.J. Abdul Kalam Technical University, Lucknow)
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl border border-slate-300 p-1 flex flex-col items-center justify-center text-center">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[8px] font-mono text-slate-500">VERIFIED</span>
              </div>
            </div>

            <div className="inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 mt-2">
              Statement of Marks & Grades • {semesterLabel}
            </div>
          </div>

          {/* Student Bio Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-6 font-sans">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">University Roll No</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Enrollment No</span>
              <span className="font-bold font-mono text-slate-900">{student.enrollmentNo}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Program / Branch</span>
              <span className="font-bold text-slate-900">{student.branch}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Father / Guardian</span>
              <span className="font-semibold text-slate-800">{student.parentName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Academic Semester</span>
              <span className="font-bold text-blue-700">Semester {selectedSemester} (Section {student.section})</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Category & Admission</span>
              <span className="font-semibold text-slate-800">{student.category} • Batch {student.admissionYear}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Attendance Record</span>
              <span className="font-bold text-emerald-700">{student.attendedClasses}/{student.totalClasses} ({student.attendancePercentage}%)</span>
            </div>
          </div>

          {/* Course Marks & Grades Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3 border-r border-slate-300">Course Code</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Subject Name</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Credits</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">CT-1 (30)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">CT-2 (30)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Assign (20)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">End Sem (100)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Total (100)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Grade</th>
                  <th className="py-2.5 px-2 text-center">Credit Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {activeSubjects.map((sub, index) => {
                  const creditPoints = sub.credits * sub.gradePoint;
                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-blue-900 border-r border-slate-200">{sub.code}</td>
                      <td className="py-2 px-3 font-medium text-slate-800 border-r border-slate-200">{sub.name}</td>
                      <td className="py-2 px-2 text-center font-semibold border-r border-slate-200">{sub.credits}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-200">{sub.classTest1}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-200">{sub.classTest2}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-200">{sub.assignment}</td>
                      <td className="py-2 px-2 text-center font-medium border-r border-slate-200">{sub.endSem}</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-900 border-r border-slate-200">{sub.total}</td>
                      <td className="py-2 px-2 text-center font-black border-r border-slate-200">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          sub.grade === 'A+' || sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          sub.grade === 'F' ? 'bg-rose-100 text-rose-800 font-black' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-900">{creditPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900 text-xs">
                  <td colSpan={2} className="py-2.5 px-3 border-r border-slate-300 text-right uppercase">Semester Aggregate Total</td>
                  <td className="py-2.5 px-2 text-center border-r border-slate-300">{totalCredits}</td>
                  <td colSpan={6} className="py-2.5 px-2 border-r border-slate-300 text-right uppercase pr-4">Total Earned Credit Points:</td>
                  <td className="py-2.5 px-2 text-center font-mono text-blue-900 text-sm font-extrabold">{totalCreditPoints}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Academic Result Evaluation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50/70 border border-blue-200 rounded-xl mb-8">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Semester Grade Point Average</span>
              <div className="text-2xl font-black text-blue-950 font-mono mt-0.5">
                SGPA: {calculatedSGPA} <span className="text-xs text-slate-600 font-normal">/ 10.00</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Cumulative Grade Point Average</span>
              <div className="text-2xl font-black text-indigo-950 font-mono mt-0.5">
                CGPA: {student.cgpa} <span className="text-xs text-slate-600 font-normal">/ 10.00</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Academic Result Classification</span>
              <div className={`text-sm font-extrabold mt-1 uppercase ${hasBacklog ? 'text-rose-700' : 'text-emerald-700'}`}>
                {resultDivision}
              </div>
            </div>
          </div>

          {/* Signature & Verification Seal Block */}
          <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="h-12 flex items-end justify-center font-serif text-slate-500 italic text-[11px]">
                [Digitally Verified]
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Prepared & Checked By
              </div>
              <span className="text-[10px] text-slate-500">Academic Section</span>
            </div>

            <div className="flex flex-col items-center justify-end">
              <div className="w-20 h-20 rounded-full border-2 border-blue-900 border-dashed flex items-center justify-center p-1 text-[9px] font-bold text-blue-900 text-center uppercase leading-tight opacity-75">
                Official Seal<br />MPDREC<br />Exam Cell
              </div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center font-serif text-slate-700 font-bold italic text-sm">
                Dr. B.N. Mishra
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                Controller of Examinations
              </div>
              <span className="text-[10px] text-slate-500">Maa Pateshwari Devi REC</span>
            </div>
          </div>

          {/* Bottom Security Watermark */}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
            Document ID: MPDREC-SEC-{student.rollNo}-{new Date().getFullYear()} • Generated via MPDREC Official ERP Engine
          </div>

        </div>

      </div>
    </div>
  );
};
