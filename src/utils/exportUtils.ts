import { Student } from '../types/erp';

export const exportStudentsToCSV = (students: Student[], filename = 'MPDREC_Student_Roster_2026.csv') => {
  const headers = [
    'Roll Number',
    'Enrollment No',
    'Full Name',
    'Gender',
    'Branch',
    'Semester',
    'Section',
    'Email',
    'Phone',
    'Attendance (%)',
    'SGPA',
    'CGPA',
    'Backlogs',
    'Academic Status',
    'Total Fees (INR)',
    'Fees Paid (INR)',
    'Balance Fees (INR)',
    'Fee Status',
    'Hostel Allotment',
    'Hostel Room',
    'Issued Books Count'
  ];

  const rows = students.map(s => [
    `"${s.rollNo}"`,
    `"${s.enrollmentNo}"`,
    `"${s.name}"`,
    `"${s.gender}"`,
    `"${s.branch}"`,
    s.semester,
    `"${s.section}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `${s.attendancePercentage}%`,
    s.sgpa,
    s.cgpa,
    s.backlogs,
    `"${s.status}"`,
    s.totalFees,
    s.feesPaid,
    s.balanceFees,
    `"${s.feeStatus}"`,
    `"${s.hostelAllotment?.hostelName || 'Day Scholar'}"`,
    `"${s.hostelAllotment?.roomNo || '-'}"`,
    s.issuedBooks.length
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAttendanceReportCSV = (students: Student[]) => {
  const headers = ['Roll Number', 'Student Name', 'Branch', 'Semester', 'Total Classes', 'Attended Classes', 'Attendance %', 'AKTU Eligibility Status'];
  const rows = students.map(s => [
    `"${s.rollNo}"`,
    `"${s.name}"`,
    `"${s.branch}"`,
    s.semester,
    s.totalClasses,
    s.attendedClasses,
    `${s.attendancePercentage}%`,
    s.attendancePercentage >= 75 ? '"Eligible for Exams"' : '"DETAINED (<75%)"'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'MPDREC_Attendance_Eligibility_Report_2026.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportFeesReportCSV = (students: Student[]) => {
  const headers = ['Roll Number', 'Student Name', 'Branch', 'Semester', 'Total Tuition & Dev Fee', 'Paid Amount', 'Due Balance', 'Status', 'Scholarship'];
  const rows = students.map(s => [
    `"${s.rollNo}"`,
    `"${s.name}"`,
    `"${s.branch}"`,
    s.semester,
    s.totalFees,
    s.feesPaid,
    s.balanceFees,
    `"${s.feeStatus}"`,
    `"${s.scholarshipStatus || 'N/A'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'MPDREC_Fee_Collection_Ledger_2026.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportFeeReportCSV = exportFeesReportCSV;

