import React, { useState } from 'react';
import { 
  IndianRupee, 
  Search, 
  FileSpreadsheet, 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Printer, 
  CreditCard, 
  Sparkles,
  QrCode,
  X,
  ArrowLeft
} from 'lucide-react';
import { Student, AuthSession } from '../types/erp';
import { exportFeeReportCSV } from '../utils/exportUtils';
import { CollegeLogo } from './CollegeLogo';

interface FeeManagementProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  session: AuthSession;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  students,
  onUpdateStudent,
  session,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'Paid' | 'Partial' | 'Pending'>('all');
  
  // Modals state
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<Student | null>(null);
  const [receiptStudent, setReceiptStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [payMode, setPayMode] = useState<string>('UPI (BHIM/GPay)');

  const totalBilled = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.feesPaid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.balanceFees, 0);

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatusFilter === 'all' || s.feeStatus === selectedStatusFilter;
    return matchSearch && matchStatus;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay) return;

    const newPaid = Math.min(selectedStudentForPay.totalFees, selectedStudentForPay.feesPaid + payAmount);
    const newBalance = selectedStudentForPay.totalFees - newPaid;
    const newStatus = newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';

    const updated: Student = {
      ...selectedStudentForPay,
      feesPaid: newPaid,
      balanceFees: newBalance,
      feeStatus: newStatus,
    };

    onUpdateStudent(updated);
    setSelectedStudentForPay(null);
    setReceiptStudent(updated);
  };

  const isStaffOrAdmin = session.role === 'admin' || session.role === 'staff';

  return (
    <div className="space-y-6">
      
      {/* Header & KPI Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
              <IndianRupee className="w-3.5 h-3.5" /> Institutional Fee Ledgers
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Tuition, Hostel & Examination Fee Collection
            </h2>
          </div>

          <button
            onClick={() => exportFeeReportCSV(students)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20"
            id="btn-export-fee-csv"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Fee Ledgers (Excel)
          </button>
        </div>

        {/* HIGH-VISIBILITY INSTITUTIONAL FEE LEDGER & FINANCIAL METRICS DECK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* TOTAL SEMESTER BILLED - HERO FINANCIAL METRIC */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600/15 via-indigo-500/10 to-blue-500/5 dark:from-indigo-950/60 dark:via-slate-850 dark:to-slate-900 border-2 border-indigo-500/40 dark:border-indigo-400/50 shadow-md shadow-indigo-500/10 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-sm">
                  <Receipt className="w-3 h-3" /> Institutional Invoiced
                </span>
                <h3 className="text-xs font-black text-indigo-950 dark:text-indigo-200 mt-2 uppercase tracking-wider">
                  Total Semester Billed
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-indigo-950 dark:text-indigo-100 font-mono tracking-tight">
                  ₹{(totalBilled / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  (₹{totalBilled.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 font-medium">
                {students.length} Enrolled Scholars • Standardized Tuition, Lab, Library & Exam Assessment
              </div>
            </div>
          </div>

          {/* REALIZED COLLECTION CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-950/50 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-400/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-[10px] font-black tracking-wider uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Realized Dues
                </span>
                <h3 className="text-xs font-black text-emerald-950 dark:text-emerald-200 mt-2 uppercase tracking-wider">
                  Realized Collection
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight">
                  ₹{(totalCollected / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                  ({Math.round((totalCollected / totalBilled) * 100)}% Rate)
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(totalCollected / totalBilled) * 100}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Successfully credited via UPI, Net Banking & Challan payments
              </div>
            </div>
          </div>

          {/* PENDING RECOVERY DUES CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent dark:from-rose-950/50 dark:via-slate-850 dark:to-slate-900 border-2 border-rose-500/30 dark:border-rose-400/40 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/70 text-rose-800 dark:text-rose-200 text-[10px] font-black tracking-wider uppercase">
                  <Clock className="w-3 h-3" /> Outstanding
                </span>
                <h3 className="text-xs font-black text-rose-950 dark:text-rose-200 mt-2 uppercase tracking-wider">
                  Pending Recovery
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/20 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-rose-950 dark:text-rose-100 font-mono tracking-tight">
                  ₹{(totalOutstanding / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  Balance Dues
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Installment reminders issued with UP Scholarship reconciliation
              </div>
            </div>
          </div>

        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
            >
              <option value="all">All Fee Status</option>
              <option value="Paid">Fully Paid (0 Balance)</option>
              <option value="Partial">Partial Dues</option>
              <option value="Pending">Payment Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Fee Roster Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student Particulars</th>
                <th className="py-3 px-3">Branch & Sem</th>
                <th className="py-3 px-3 text-right">Total Fees</th>
                <th className="py-3 px-3 text-right">Paid Amount</th>
                <th className="py-3 px-3 text-right">Balance Due</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((student) => (
                <tr key={student.rollNo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{student.name}</div>
                    <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{student.rollNo}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{student.branch.split(' ')[0]}</div>
                    <span className="text-[10px] text-slate-400">Sem {student.semester}</span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                    ₹{student.totalFees.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{student.feesPaid.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={student.balanceFees > 0 ? 'text-rose-600' : 'text-slate-400'}>
                      ₹{student.balanceFees.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      student.feeStatus === 'Partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setReceiptStudent(student)}
                      className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                      title="Print Official Fee Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                    {isStaffOrAdmin && student.balanceFees > 0 && (
                      <button
                        onClick={() => {
                          setSelectedStudentForPay(student);
                          setPayAmount(student.balanceFees);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm"
                      >
                        Record Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {selectedStudentForPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold mb-1 text-slate-900 dark:text-slate-100">Record Fee Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedStudentForPay.name} • <span className="font-mono text-blue-600">{selectedStudentForPay.rollNo}</span>
            </p>
            
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-mono font-bold">₹{selectedStudentForPay.totalFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currently Paid:</span>
                  <span className="font-mono font-bold text-emerald-600">₹{selectedStudentForPay.feesPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Balance:</span>
                  <span className="font-mono font-bold text-rose-600">₹{selectedStudentForPay.balanceFees.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Amount to Pay (INR)</label>
                <input
                  type="number"
                  min={100}
                  max={selectedStudentForPay.balanceFees}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Payment Method</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  <option value="UPI (BHIM/GPay/PhonePe)">UPI (BHIM / GPay / Paytm)</option>
                  <option value="Online NetBanking (SBI/HDFC)">Online NetBanking</option>
                  <option value="Bank Demand Draft">Bank Demand Draft (DD)</option>
                  <option value="NEFT / RTGS Transfer">NEFT / RTGS Transfer</option>
                  <option value="Cash at Accounts Counter">Cash at Accounts Counter</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setSelectedStudentForPay(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
                  Generate Receipt & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL FEE RECEIPT MODAL */}
      {receiptStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative border border-slate-300 print:m-0 print:border-none print:shadow-none">
            
            {/* Top Close / Print bar (Hidden in print) */}
            <div className="no-print flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReceiptStudent(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-all shadow-sm group"
                  id="btn-back-from-fee-receipt"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Fees</span>
                </button>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline border-l border-slate-200 pl-2">Official Fee E-Receipt</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setReceiptStudent(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 p-0.5 flex items-center justify-center shrink-0">
                  <CollegeLogo className="w-11 h-11" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base uppercase font-serif">Maa Pateshwari Devi Rajkiya Engg. College</h2>
                  <p className="text-[10px] text-slate-600 uppercase">AKTU Code: 1214 • Balrampur / Gonda, UP</p>
                </div>
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="inline-block bg-slate-100 px-3 py-0.5 rounded-full text-[11px] font-bold mt-2">
                OFFICIAL FEE PAYMENT ACKNOWLEDGEMENT RECEIPT
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Receipt No:</span>
                <span className="font-mono font-bold">REC-{receiptStudent.rollNo.slice(-6)}-2026</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Date:</span>
                <span className="font-mono">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Student Name:</span>
                <span className="font-bold text-slate-900">{receiptStudent.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Roll Number:</span>
                <span className="font-mono font-bold">{receiptStudent.rollNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Program & Semester:</span>
                <span>{receiptStudent.branch.split(' ')[0]} (Sem {receiptStudent.semester})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Payment Status:</span>
                <span className="font-bold text-emerald-700">{receiptStudent.feeStatus}</span>
              </div>
            </div>

            {/* Fee Particulars Table */}
            <div className="py-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 font-bold uppercase text-[10px]">
                    <th className="py-1.5">Particulars / Head</th>
                    <th className="py-1.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <tr>
                    <td className="py-1.5">Tuition & Academic Training Fee</td>
                    <td className="py-1.5 text-right font-mono">₹40,000</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Hostel & Mess Maintenance Fee</td>
                    <td className="py-1.5 text-right font-mono">₹10,000</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">Central Library & Exam Development</td>
                    <td className="py-1.5 text-right font-mono">₹5,000</td>
                  </tr>
                  <tr className="font-bold bg-slate-50">
                    <td className="py-2">Total Paid Towards Semester</td>
                    <td className="py-2 text-right font-mono text-emerald-700 font-black">₹{receiptStudent.feesPaid.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="h-10 flex items-end justify-center font-mono text-[10px] text-slate-400">
                  [SYSTEM GENERATED]
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold">Student / Depositor</div>
              </div>
              <div>
                <div className="h-10 flex items-end justify-center font-serif text-slate-700 italic font-bold">
                  Kailash Pandey
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold">Accounts Officer, MPDREC</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
