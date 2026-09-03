import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  BookOpen, 
  Percent, 
  IndianRupee,
  PieChart as PieChartIcon,
  ShieldCheck
} from 'lucide-react';
import { Student, Faculty, LibraryBook } from '../types/erp';

interface AnalyticsDashboardProps {
  students: Student[];
  facultyList: Faculty[];
  books: LibraryBook[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  students,
  facultyList,
  books,
}) => {
  const total = students.length;
  
  const attUnder75 = students.filter(s => s.attendancePercentage < 75).length;
  const att75To85 = students.filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 85).length;
  const attAbove85 = students.filter(s => s.attendancePercentage >= 85).length;

  const gradeO = students.filter(s => s.sgpa >= 9.0).length;
  const gradeA = students.filter(s => s.sgpa >= 8.0 && s.sgpa < 9.0).length;
  const gradeB = students.filter(s => s.sgpa >= 7.0 && s.sgpa < 8.0).length;
  const gradeC = students.filter(s => s.sgpa >= 6.0 && s.sgpa < 7.0).length;
  const gradeF = students.filter(s => s.sgpa < 6.0 || s.backlogs > 0).length;

  const males = students.filter(s => s.gender === 'Male').length;
  const females = students.filter(s => s.gender === 'Female').length;

  const totalBilled = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.feesPaid, 0);
  const feeRate = Math.round((totalPaid / totalBilled) * 100);

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1 border border-blue-200 dark:border-blue-800">
          <BarChart3 className="w-3.5 h-3.5" /> Institutional Intelligence
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Executive Academic & Operations Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Aggregated performance indicators across all 50 enrolled scholars, 6 faculty departments, and institutional assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-600" />
              Attendance Distribution Spectrum
            </h3>
            <span className="text-xs font-bold font-mono text-blue-600">Total: {total} Scholars</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-600 flex items-center gap-1">⭐ High Attendance (&gt;85%)</span>
                <span className="font-mono font-bold">{attAbove85} ({Math.round((attAbove85 / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(attAbove85 / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600 flex items-center gap-1">⚠️ Moderate (75% - 85%)</span>
                <span className="font-mono font-bold">{att75To85} ({Math.round((att75To85 / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(att75To85 / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-rose-600 flex items-center gap-1">🚨 Critical Shortage (&lt;75%)</span>
                <span className="font-mono font-bold">{attUnder75} ({Math.round((attUnder75 / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(attUnder75 / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Academic SGPA Performance Tiers
            </h3>
            <span className="text-xs font-bold text-amber-600">Sem 4 & 6</span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-2">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 block uppercase">9.0+ O</span>
              <span className="text-xl font-black font-mono text-amber-900 dark:text-amber-200">{gradeO}</span>
              <span className="text-[9px] text-slate-400 block">Outstanding</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 block uppercase">8.0-8.9 A</span>
              <span className="text-xl font-black font-mono text-blue-900 dark:text-blue-200">{gradeA}</span>
              <span className="text-[9px] text-slate-400 block">Very Good</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 block uppercase">7.0-7.9 B</span>
              <span className="text-xl font-black font-mono text-emerald-900 dark:text-emerald-200">{gradeB}</span>
              <span className="text-[9px] text-slate-400 block">Good</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 block uppercase">6.0-6.9 C</span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-slate-200">{gradeC}</span>
              <span className="text-[9px] text-slate-400 block">Average</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 block uppercase">&lt;6.0 / Back</span>
              <span className="text-xl font-black font-mono text-rose-900 dark:text-rose-200">{gradeF}</span>
              <span className="text-[9px] text-slate-400 block">Needs Imp.</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender Ratio</h4>
          <div className="flex items-center justify-between font-mono text-base font-bold">
            <span className="text-blue-600">Male: {males} ({Math.round((males/total)*100)}%)</span>
            <span className="text-purple-600">Female: {females} ({Math.round((females/total)*100)}%)</span>
          </div>
          <div className="w-full bg-purple-500 rounded-full h-3 overflow-hidden flex">
            <div className="bg-blue-600 h-full" style={{ width: `${(males/total)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Fee Recovery Rate</h4>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-2xl font-black text-emerald-600">{feeRate}%</span>
            <span className="text-xs text-slate-400">₹{(totalPaid/100000).toFixed(1)}L / ₹{(totalBilled/100000).toFixed(1)}L</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${feeRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Faculty Student Ratio</h4>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-2xl font-black text-indigo-600">1 : 8.3</span>
            <span className="text-xs text-slate-400">6 Faculty / 50 Scholars</span>
          </div>
          <p className="text-[11px] text-slate-400">Optimal AICTE engineering cohort ratio compliant.</p>
        </div>

      </div>

    </div>
  );
};
