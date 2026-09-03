import { Student, Faculty, Notice, TimetableSlot, SubjectCourseDetail, LibraryBook, HostelRoom, StudyMaterial, PeerChatMessage, AcademicTermMilestone, SubjectMark, GalleryItem, SemesterResultDetail, CampusEvent } from '../types/erp';
import { generate3rdYearStudents } from './students3rdYear';
import { generate4thYearStudents } from './students4thYear';
import { ALL_SEED_HOSTEL_ROOMS, HOSTEL_PROFILES, SEED_SARYU_ROOMS, SEED_LEHRI_ROOMS } from './hostelData';

export { HOSTEL_PROFILES, SEED_SARYU_ROOMS, SEED_LEHRI_ROOMS };

// SEED FACULTY (Official Faculty for Computer Science & Engineering - Session 2026-27)
export const SEED_FACULTY: Faculty[] = [
  {
    facultyId: 'FAC-CSE-01',
    name: 'Mr. Sandip Kumar Singh',
    designation: 'Assistant Professor & Time Table Coordinator',
    department: 'Computer Science & Engineering',
    email: 'sandip.singh@mpdrec.ac.in',
    phone: '+91 94501 23456',
    qualification: 'M.Tech (CSE), Ph.D (Pursuing)',
    specialization: 'Data Structures, Algorithms & Web Systems',
    subjectsTaught: ['BCS554: Mini Project / Internship Assessment', 'BCC351: Internship Assessment / Mini Project'],
    cabinRoom: 'Faculty Block A - Room 204 (Abbr: SKS)',
    joiningYear: 2018,
  },
  {
    facultyId: 'FAC-CSE-02',
    name: 'Dr. Rohit Tripathi',
    designation: 'Associate Professor & HOD CSE',
    department: 'Computer Science & Engineering',
    email: 'rohit.tripathi@mpdrec.ac.in',
    phone: '+91 98390 87654',
    qualification: 'Ph.D in Computer Systems Architecture (IIT Roorkee)',
    specialization: 'Computer Organization & Architecture, Algorithms & Embedded Systems',
    subjectsTaught: ['BCS301: Data Structure', 'BCS351: Data Structure Lab', 'BCS503: Design and Analysis of Algorithm', 'BCS553: Design and Analysis of Algorithm Lab', 'BCS752: Mini Project / Internship Assessment', 'BCS753: Project-I', 'BCS754: Startup and Entrepreneurial Activity'],
    cabinRoom: 'Faculty Block A - Room 201 (Abbr: RT)',
    joiningYear: 2014,
  },
  {
    facultyId: 'FAC-CSE-03',
    name: 'Dr. Aparna Verma',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: 'aparna.verma@mpdrec.ac.in',
    phone: '+91 98391 12345',
    qualification: 'Ph.D in Theoretical Computer Science & Discrete Mathematics',
    specialization: 'Discrete Structures, Theory of Logic & Graph Theory',
    subjectsTaught: ['BCS303: Discrete Structures & Theory of Logic'],
    cabinRoom: 'Faculty Block A - Room 208 (Abbr: AV)',
    joiningYear: 2019,
  },
  {
    facultyId: 'FAC-CSE-04',
    name: 'Mr. Vishal Ranjan',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: 'vishal.ranjan@mpdrec.ac.in',
    phone: '+91 97920 44556',
    qualification: 'M.Tech in Information & Network Security',
    specialization: 'Artificial Intelligence, Web Technologies, Computer Organization',
    subjectsTaught: ['BCS302: Computer Organization and Architecture', 'BCS352: Computer Organization and Architecture Lab', 'BCS353: Web Designing Workshop', 'BCS502: Web Technology', 'BCS552: Web Technology Lab', 'BCS701: Artificial Intelligence', 'BCS751: Artificial Intelligence Lab'],
    cabinRoom: 'Faculty Block A - Room 212 (Abbr: VR)',
    joiningYear: 2021,
  },
  {
    facultyId: 'FAC-CSE-05',
    name: 'Mr. Vishal Pandey',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: 'vishal.pandey@mpdrec.ac.in',
    phone: '+91 91234 56789',
    qualification: 'M.Tech in Software Systems (NIT Allahabad)',
    specialization: 'Web Technologies, UI/UX & Web Designing Workshop',
    subjectsTaught: ['BCS353: Web Designing Workshop'],
    cabinRoom: 'Faculty Block A - Room 209 (Abbr: VP)',
    joiningYear: 2020,
  },
  {
    facultyId: 'FAC-CSE-06',
    name: 'Mr. Shailendra Kumar Yadav',
    designation: 'Assistant Professor & Project Coordinator',
    department: 'Computer Science & Engineering',
    email: 'shailendra.yadav@mpdrec.ac.in',
    phone: '+91 96510 88990',
    qualification: 'M.Tech (Software Engineering)',
    specialization: 'Database Systems, Data Mining, IoT & Internship Practice',
    subjectsTaught: ['BCS501: Database Management System', 'BCS551: Database Management System Lab', 'BCS-058: Data Warehousing & Data Mining', 'BCS070: Internet of Things', 'BCC351: Internship Assessment / Mini Project'],
    cabinRoom: 'Faculty Block A - Room 215 (Abbr: SKY)',
    joiningYear: 2019,
  },
  {
    facultyId: 'FAC-CSE-07',
    name: 'Dr. Arpit Jain',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'arpit.jain@mpdrec.ac.in',
    phone: '+91 94510 66778',
    qualification: 'Ph.D in Machine Learning & Artificial Intelligence',
    specialization: 'Machine Learning, Deep Learning, Startup Mentorship & Capstone Projects',
    subjectsTaught: ['BOE073: Machine Learning', 'BCS753: Project-I', 'BCS754: Startup and Entrepreneurial Activity', 'BCS752: Mini Project / Internship Assessment'],
    cabinRoom: 'Faculty Block A - Room 205 (Abbr: AJ)',
    joiningYear: 2017,
  },
  {
    facultyId: 'FAC-CSE-08',
    name: 'Dr. C. L. P. Gupta',
    designation: 'Professor',
    department: 'Computer Science & Engineering',
    email: 'clp.gupta@mpdrec.ac.in',
    phone: '+91 94151 33445',
    qualification: 'Ph.D in Computer Science & Engineering',
    specialization: 'Cyber Security, Data Analytics, Enterprise Systems & Project Incubation',
    subjectsTaught: ['BCC301: Cyber Security', 'BCS-052: Data Analytics', 'BCS753: Project-I', 'BCS754: Startup and Entrepreneurial Activity', 'BCS752: Mini Project / Internship Assessment'],
    cabinRoom: 'Faculty Block A - Room 202 (Abbr: CLP)',
    joiningYear: 2013,
  },
  {
    facultyId: 'FAC-ASH-01',
    name: 'Dr. Pundrik',
    designation: 'Associate Professor (Mathematics)',
    department: 'Applied Science & Humanities',
    email: 'pundrik@mpdrec.ac.in',
    phone: '+91 94150 99887',
    qualification: 'Ph.D in Applied Mathematics (BHU Varanasi)',
    specialization: 'Advanced Engineering Mathematics, Numerical Methods',
    subjectsTaught: ['BAS303: Mathematics-III'],
    cabinRoom: 'Faculty Block B - Room 102 (Abbr: PUN)',
    joiningYear: 2012,
  },
  {
    facultyId: 'FAC-ASH-02',
    name: 'Faculty (To be assigned)',
    designation: 'Guest Lecturer (Humanities)',
    department: 'Applied Science & Humanities',
    email: 'humanities@mpdrec.ac.in',
    phone: '+91 98380 11223',
    qualification: 'Ph.D in Professional Communication & Linguistics',
    specialization: 'Technical Communication & Professional Ethics',
    subjectsTaught: ['BAS301: Technical Communication'],
    cabinRoom: 'Faculty Block B - Room 105 (Abbr: TBA)',
    joiningYear: 2024,
  },
  {
    facultyId: 'FAC-ASH-03',
    name: 'Mr. Akash Bajpai',
    designation: 'Assistant Professor',
    department: 'Applied Science & Humanities',
    email: 'akash.bajpai@mpdrec.ac.in',
    phone: '+91 98381 55667',
    qualification: 'M.A., LL.M (Constitutional Law & Jurisprudence)',
    specialization: 'Constitution of India, Cyber Laws & Professional Ethics',
    subjectsTaught: ['BNC501: Constitution of India'],
    cabinRoom: 'Faculty Block B - Room 108 (Abbr: AB)',
    joiningYear: 2020,
  },
];

// SEED ADMIN & STAFF
export const SEED_ADMIN = {
  adminId: 'ADM-2026-001',
  name: 'Dr. Bhartendu Nath Mishra',
  role: 'admin' as const,
  email: 'admin@mpdrec.ac.in',
  designation: 'Director & Controller of Examinations',
};

export const SEED_STAFF = {
  staffId: 'STF-2026-004',
  name: 'Mr. Maurya',
  role: 'staff' as const,
  email: 'maurya.staff@mpdrec.ac.in',
  designation: 'Senior Administrative & Accounts Officer',
  department: 'Administration & Accounts Office',
};

export const SEED_WARDEN = {
  staffId: 'WRD-2026-009',
  name: 'Shivani Verma',
  role: 'staff' as const,
  email: 'warden.girls@mpdrec.ac.in',
  designation: 'Chief Warden (Saryu Girls Hostel)',
  department: 'Girls Hostel Administration',
};

// MULTI-ROLE PRESET ACCOUNTS FOR INSTITUTIONAL ROLES
export const SEED_USERS_CREDENTIALS = [
  {
    role: 'admin',
    roleLabel: 'Super Administrator',
    name: 'Dr. Bhartendu Nath Mishra',
    idOrRoll: 'ADM-2026-001',
    email: 'admin@mpdrec.ac.in',
    description: 'Complete ERP administrative control, batch promotion, notice broadcasting & fee ledger exports.',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300'
  },
  {
    role: 'faculty',
    roleLabel: 'Faculty / Time Table In-Charge',
    name: 'Mr. Sandip Kumar Singh',
    idOrRoll: 'FAC-CSE-01',
    email: 'sandip.singh@mpdrec.ac.in',
    description: 'Marks entry, assignment evaluation, attendance register management & timetable scheduling.',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
  },
  {
    role: 'student',
    roleLabel: 'Student (Rank 1 Topper)',
    name: 'Umam Shafiq',
    idOrRoll: 'CS-2512140100045',
    email: 'student45@mpdrec.ac.in',
    description: 'Personal marksheet, SGPA tracking (Rank #1 • 9.75 SGPA), attendance (97%), fee receipts & library card.',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300'
  },
  {
    role: 'staff',
    roleLabel: 'Accounts & Administration Staff',
    name: 'Mr. Maurya',
    idOrRoll: 'STF-2026-004',
    email: 'maurya.staff@mpdrec.ac.in',
    description: 'Challan generation, fee installment verification, student ledger reconciliation & billing.',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
  },
  {
    role: 'staff',
    roleLabel: 'Girls Hostel Warden',
    name: 'Shivani Verma',
    idOrRoll: 'WRD-2026-009',
    email: 'warden.girls@mpdrec.ac.in',
    description: 'Girls hostel room occupancy matrix, bed allocations, mess dues check & out-pass disciplinary tracking.',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300'
  },
  {
    role: 'guest',
    roleLabel: 'Guest / Public Visitor',
    name: 'Public Visitor',
    idOrRoll: 'GUEST-001',
    email: 'visitor@mpdrec.ac.in',
    description: 'Public notifications, college directory, academic calendar, campus infrastructure & fest info.',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300'
  }
];

// Helper to generate Semester 3 Subject marks for B.Tech Computer Science & Engineering (AKTU)
const generateSubjectsSem3 = (basePerf: number, isTopRank?: number): SubjectMark[] => {
  const subjectsMeta = [
    { code: 'KCS-301', name: 'Data Structures', credits: 4 },
    { code: 'KCS-302', name: 'Computer Organization & Architecture', credits: 4 },
    { code: 'KCS-303', name: 'Discrete Structures & Theory of Logic', credits: 3 },
    { code: 'KIT-301', name: 'Object Oriented Programming', credits: 3 },
    { code: 'KAS-302', name: 'Technical Communication', credits: 3 },
    { code: 'KCS-351', name: 'Data Structures Lab', credits: 2 },
  ];

  return subjectsMeta.map((sub, idx) => {
    let ct1 = 22;
    let ct2 = 23;
    let assignment = 16;
    let endSem = 78;

    if (isTopRank === 1) {
      // 1. Umam Shafiq (Rank 1: SGPA 9.75, CGPA 9.68)
      ct1 = idx % 2 === 0 ? 29 : 30;
      ct2 = 30;
      assignment = 20;
      endSem = 96 + (idx % 4);
    } else if (isTopRank === 2) {
      // 2. Govind Chandra Gaharwar / Govind Gaharwar (Rank 2: SGPA 9.50, CGPA 9.42)
      ct1 = 28;
      ct2 = 29;
      assignment = 19;
      endSem = 92 + (idx % 5);
    } else if (isTopRank === 3) {
      // 3. Deependra Verma (Rank 3: SGPA 9.35, CGPA 9.28)
      ct1 = 27;
      ct2 = 28;
      assignment = 18;
      endSem = 88 + (idx % 5);
    } else {
      // Other students (SGPAs 6.80 to 8.85)
      const variation = ((idx * 7) % 13) - 6;
      const factor = Math.min(86, Math.max(50, basePerf + variation));
      ct1 = Math.round((factor / 100) * 30 * (0.86 + Math.random() * 0.18));
      ct2 = Math.round((factor / 100) * 30 * (0.86 + Math.random() * 0.18));
      assignment = Math.round((factor / 100) * 20 * (0.88 + Math.random() * 0.12));
      endSem = Math.round((factor / 100) * 100 * (0.85 + Math.random() * 0.22));
    }

    const internalTotal = Math.min(50, Math.round(((ct1 + ct2) / 60) * 30 + assignment));
    const endSemScaled = Math.min(50, Math.round((endSem / 100) * 50));
    const total = Math.min(100, internalTotal + endSemScaled);

    let grade: SubjectMark['grade'] = 'B';
    let gradePoint = 7;
    if (total >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (total >= 80) { grade = 'A'; gradePoint = 9; }
    else if (total >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (total >= 60) { grade = 'B'; gradePoint = 7; }
    else if (total >= 50) { grade = 'C+'; gradePoint = 6; }
    else if (total >= 40) { grade = 'C'; gradePoint = 5; }
    else if (total >= 33) { grade = 'D'; gradePoint = 4; }
    else { grade = 'F'; gradePoint = 0; }

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      classTest1: Math.min(30, ct1),
      classTest2: Math.min(30, ct2),
      assignment: Math.min(20, assignment),
      endSem: Math.min(100, endSem),
      total,
      grade,
      gradePoint,
    };
  });
};

// Helper to generate Semester 1 Subject marks for B.Tech CSE (AKTU 1st Year Odd Sem 2024-25)
const generateSubjectsSem1 = (basePerf: number, isTopRank?: number): SubjectMark[] => {
  const sem1Meta = [
    { code: 'BAS-101', name: 'Engineering Physics', credits: 4 },
    { code: 'BAS-103', name: 'Engineering Mathematics-I', credits: 4 },
    { code: 'BEE-101', name: 'Basic Electrical Engineering', credits: 3 },
    { code: 'BCS-101', name: 'Programming for Problem Solving (C)', credits: 3 },
    { code: 'BAS-151', name: 'Engineering Physics Lab', credits: 1 },
    { code: 'BEE-151', name: 'Basic Electrical Engg Lab', credits: 1 },
    { code: 'BCS-151', name: 'Programming Lab (C)', credits: 1 },
    { code: 'BCE-151', name: 'Engineering Graphics & Design', credits: 2 },
  ];

  return sem1Meta.map((sub, idx) => {
    let ct1 = 23;
    let ct2 = 24;
    let assignment = 17;
    let endSem = 75;

    if (isTopRank === 1) {
      ct1 = idx % 2 === 0 ? 29 : 30;
      ct2 = 29;
      assignment = 20;
      endSem = 95;
    } else if (isTopRank === 2) {
      ct1 = 28;
      ct2 = 29;
      assignment = 19;
      endSem = 91;
    } else if (isTopRank === 3) {
      ct1 = 27;
      ct2 = 28;
      assignment = 18;
      endSem = 87;
    } else {
      const variation = ((idx * 5 + 3) % 11) - 5;
      const factor = Math.min(88, Math.max(50, basePerf + variation - 2));
      ct1 = Math.round((factor / 100) * 30 * 0.9);
      ct2 = Math.round((factor / 100) * 30 * 0.92);
      assignment = Math.round((factor / 100) * 20 * 0.9);
      endSem = Math.round((factor / 100) * 100 * 0.88);
    }

    const internalTotal = Math.min(50, Math.round(((ct1 + ct2) / 60) * 30 + assignment));
    const endSemScaled = Math.min(50, Math.round((endSem / 100) * 50));
    const total = Math.min(100, internalTotal + endSemScaled);

    let grade: SubjectMark['grade'] = 'B';
    let gradePoint = 7;
    if (total >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (total >= 80) { grade = 'A'; gradePoint = 9; }
    else if (total >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (total >= 60) { grade = 'B'; gradePoint = 7; }
    else if (total >= 50) { grade = 'C+'; gradePoint = 6; }
    else if (total >= 40) { grade = 'C'; gradePoint = 5; }
    else if (total >= 33) { grade = 'D'; gradePoint = 4; }
    else { grade = 'F'; gradePoint = 0; }

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      classTest1: Math.min(30, ct1),
      classTest2: Math.min(30, ct2),
      assignment: Math.min(20, assignment),
      endSem: Math.min(100, endSem),
      total,
      grade,
      gradePoint,
    };
  });
};

// Helper to generate Semester 2 Subject marks for B.Tech CSE (AKTU 1st Year Even Sem 2024-25)
const generateSubjectsSem2 = (basePerf: number, isTopRank?: number): SubjectMark[] => {
  const sem2Meta = [
    { code: 'BAS-202', name: 'Engineering Chemistry', credits: 4 },
    { code: 'BAS-203', name: 'Engineering Mathematics-II', credits: 4 },
    { code: 'BEC-201', name: 'Basic Electronics Engineering', credits: 3 },
    { code: 'BME-201', name: 'Fundamentals of Mechanical Engg', credits: 3 },
    { code: 'BAS-205', name: 'Soft Skills & Professional Communication', credits: 2 },
    { code: 'BAS-252', name: 'Engineering Chemistry Lab', credits: 1 },
    { code: 'BEC-251', name: 'Basic Electronics Lab', credits: 1 },
    { code: 'BWS-251', name: 'Workshop Practice & Digital Fabrication', credits: 2 },
  ];

  return sem2Meta.map((sub, idx) => {
    let ct1 = 24;
    let ct2 = 25;
    let assignment = 17;
    let endSem = 79;

    if (isTopRank === 1) {
      ct1 = 30;
      ct2 = 30;
      assignment = 20;
      endSem = 97;
    } else if (isTopRank === 2) {
      ct1 = 29;
      ct2 = 29;
      assignment = 19;
      endSem = 93;
    } else if (isTopRank === 3) {
      ct1 = 28;
      ct2 = 29;
      assignment = 19;
      endSem = 89;
    } else {
      const variation = ((idx * 6 + 1) % 11) - 5;
      const factor = Math.min(88, Math.max(50, basePerf + variation - 1));
      ct1 = Math.round((factor / 100) * 30 * 0.91);
      ct2 = Math.round((factor / 100) * 30 * 0.93);
      assignment = Math.round((factor / 100) * 20 * 0.92);
      endSem = Math.round((factor / 100) * 100 * 0.89);
    }

    const internalTotal = Math.min(50, Math.round(((ct1 + ct2) / 60) * 30 + assignment));
    const endSemScaled = Math.min(50, Math.round((endSem / 100) * 50));
    const total = Math.min(100, internalTotal + endSemScaled);

    let grade: SubjectMark['grade'] = 'B';
    let gradePoint = 7;
    if (total >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (total >= 80) { grade = 'A'; gradePoint = 9; }
    else if (total >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (total >= 60) { grade = 'B'; gradePoint = 7; }
    else if (total >= 50) { grade = 'C+'; gradePoint = 6; }
    else if (total >= 40) { grade = 'C'; gradePoint = 5; }
    else if (total >= 33) { grade = 'D'; gradePoint = 4; }
    else { grade = 'F'; gradePoint = 0; }

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      classTest1: Math.min(30, ct1),
      classTest2: Math.min(30, ct2),
      assignment: Math.min(20, assignment),
      endSem: Math.min(100, endSem),
      total,
      grade,
      gradePoint,
    };
  });
};

// Compile full Semester 1, Semester 2 & Semester 3 results with detailed analytics
export const compileStudentSemesterResults = (
  basePerf: number,
  sem3Subjects: SubjectMark[],
  sem3Sgpa: number,
  sem3Cgpa: number,
  isTopRank?: number
): SemesterResultDetail[] => {
  const sem1Subjects = generateSubjectsSem1(basePerf, isTopRank);
  const sem2Subjects = generateSubjectsSem2(basePerf, isTopRank);

  // Sem 1 Stats
  const sem1Credits = sem1Subjects.reduce((acc, c) => acc + c.credits, 0);
  const sem1CreditPts = sem1Subjects.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
  const sem1Sgpa = isTopRank === 1 ? 9.60 : isTopRank === 2 ? 9.35 : isTopRank === 3 ? 9.20 : Number((sem1CreditPts / sem1Credits).toFixed(2));
  const sem1TotalMarks = sem1Subjects.reduce((acc, c) => acc + c.total, 0);
  const sem1MaxMarks = sem1Subjects.length * 100;

  // Sem 2 Stats
  const sem2Credits = sem2Subjects.reduce((acc, c) => acc + c.credits, 0);
  const sem2CreditPts = sem2Subjects.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
  const sem2Sgpa = isTopRank === 1 ? 9.70 : isTopRank === 2 ? 9.45 : isTopRank === 3 ? 9.30 : Number((sem2CreditPts / sem2Credits).toFixed(2));
  const sem2TotalMarks = sem2Subjects.reduce((acc, c) => acc + c.total, 0);
  const sem2MaxMarks = sem2Subjects.length * 100;
  const sem2Cgpa = Number(((sem1Sgpa + sem2Sgpa) / 2).toFixed(2));

  // Sem 3 Stats
  const sem3Credits = sem3Subjects.reduce((acc, c) => acc + c.credits, 0);
  const sem3TotalMarks = sem3Subjects.reduce((acc, c) => acc + c.total, 0);
  const sem3MaxMarks = sem3Subjects.length * 100;

  return [
    {
      semester: 1,
      academicYear: '2024-2025',
      sessionType: 'Odd Semester',
      status: sem1Sgpa >= 8.5 ? 'PASSED WITH HONOURS' : 'PASS',
      sgpa: sem1Sgpa,
      cgpa: sem1Sgpa,
      totalCredits: sem1Credits,
      earnedCredits: sem1Credits,
      totalMarks: sem1TotalMarks,
      maxMarks: sem1MaxMarks,
      percentage: Number(((sem1TotalMarks / sem1MaxMarks) * 100).toFixed(1)),
      resultDate: '2025-02-15',
      examType: 'Regular AKTU End-Sem',
      subjects: sem1Subjects,
      remarks: 'Successfully cleared 1st semester with First Division standing.'
    },
    {
      semester: 2,
      academicYear: '2024-2025',
      sessionType: 'Even Semester',
      status: sem2Sgpa >= 8.5 ? 'PASSED WITH HONOURS' : 'PASS',
      sgpa: sem2Sgpa,
      cgpa: sem2Cgpa,
      totalCredits: sem2Credits,
      earnedCredits: sem2Credits,
      totalMarks: sem2TotalMarks,
      maxMarks: sem2MaxMarks,
      percentage: Number(((sem2TotalMarks / sem2MaxMarks) * 100).toFixed(1)),
      resultDate: '2025-07-28',
      examType: 'Regular AKTU End-Sem',
      subjects: sem2Subjects,
      remarks: 'Promoted to 2nd Year (Semester 3) with zero academic backlogs.'
    },
    {
      semester: 3,
      academicYear: '2025-2026',
      sessionType: 'Odd Semester',
      status: 'IN PROGRESS',
      sgpa: sem3Sgpa,
      cgpa: sem3Cgpa,
      totalCredits: sem3Credits,
      earnedCredits: sem3Credits,
      totalMarks: sem3TotalMarks,
      maxMarks: sem3MaxMarks,
      percentage: Number(((sem3TotalMarks / sem3MaxMarks) * 100).toFixed(1)),
      resultDate: '2026-08-30 (Tentative)',
      examType: 'Internal Continuous Evaluation',
      subjects: sem3Subjects,
      remarks: 'Active Semester. Continuous assessment (CT-1, CT-2, Assignments) ongoing.'
    }
  ];
};

const booksLibrary = [
  { id: 'BK-001', isbn: '978-0131103627', title: 'The C Programming Language (ANSI C)', author: 'Brian W. Kernighan, Dennis M. Ritchie' },
  { id: 'BK-002', isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein' },
  { id: 'BK-003', isbn: '978-0133591620', title: 'Operating System Concepts (10th Ed)', author: 'Silberschatz, Galvin, Gagne' },
  { id: 'BK-004', isbn: '978-0078022159', title: 'Database System Concepts', author: 'Abraham Silberschatz, Henry F. Korth' },
  { id: 'BK-005', isbn: '978-0132126953', title: 'Computer Networks (5th Edition)', author: 'Andrew S. Tanenbaum, David J. Wetherall' },
  { id: 'BK-006', isbn: '978-0134685991', title: 'Effective Java (3rd Edition)', author: 'Joshua Bloch' },
  { id: 'BK-007', isbn: '978-0131103628', title: 'Digital Logic and Computer Design', author: 'M. Morris Mano' },
  { id: 'BK-008', isbn: '978-0070669116', title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen' },
];

// OFFICIAL ENROLLED STUDENTS OF MPDREC GONDA (SECTION A & SECTION B, 3rd SEMESTER)
export interface StudentSeedRecord {
  srNo: number;
  name: string;
  gender: 'Male' | 'Female';
  branch: string;
  section?: 'A' | 'B';
  isTopPerformer?: number; // 1: Umam Shafiq, 2: Govind Gaharwar, 3: Deependra Verma
  customRollNo?: string;
  customEnrollmentNo?: string;
}

export const MPDREC_STUDENT_ROSTER_50: StudentSeedRecord[] = [
  { srNo: 1, name: 'Abhay Kumar Maurya', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 2, name: 'Abhishek Pandey', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 3, name: 'Aditya Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 4, name: 'Alok Pandey', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 5, name: 'Aman Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 6, name: 'Aman Kumar Verma', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 7, name: 'Aman Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 8, name: 'Ankit Maurya', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 9, name: 'Ankit Pal', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 10, name: 'Ankit Vishwakarma', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 11, name: 'Ankul Pal', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 12, name: 'Anshu Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 13, name: 'Archana Yadav', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 14, name: 'Aryan Kumar Raj', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 15, name: 'Aryan Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 16, name: 'Aryan Tripathi', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 17, name: 'Ashish Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 18, name: 'Ashutosh Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 19, name: 'Ayush Mishra', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 20, name: 'Ayush Pandey', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 21, name: 'Ayushka Yadav', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 22, name: 'Deependra Verma', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A', isTopPerformer: 3 },
  { srNo: 23, name: 'Devnarayan', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 24, name: 'Dharmika Gangwar', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 25, name: 'Diksha Patel', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 26, name: 'Dinesh Rai', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 27, name: 'Divyanshu Sharma', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 28, name: 'Govind Chandra Gaharwar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A', isTopPerformer: 2 },
  { srNo: 29, name: 'Habibullah', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 30, name: 'Harsh Patel', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 31, name: 'Harshit', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 32, name: 'Jagriti Yadav', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 33, name: 'Jyoti Vishwakarma', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 34, name: 'Suraj Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 35, name: 'Karn Agnihotri', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 36, name: 'Karun Maurya', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 37, name: 'Nayansi Niketa', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 38, name: 'Nikki', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 39, name: 'Nilesh Kushwaha', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 40, name: 'Nitin Shukla', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 41, name: 'Piyoosh Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 42, name: 'Prashant Mainwal', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 43, name: 'Prashnsa Saxena', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 44, name: 'Prasoon Tripathi', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 45, name: 'Umam Shafiq', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A', isTopPerformer: 1 },
  { srNo: 46, name: 'Ratna Priya', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 47, name: 'Ritesh Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 48, name: 'Ritik Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 49, name: 'Roshni Yadav', gender: 'Female', branch: 'Computer Science & Engineering', section: 'A' },
  { srNo: 50, name: 'Rupesh Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'A' },
];

// SECTION B (46 Students - Roll Numbers starting 2512140100051 onwards)
export const MPDREC_STUDENT_ROSTER_SECTION_B: StudentSeedRecord[] = [
  { srNo: 1, name: 'Prasant Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100051', customEnrollmentNo: '23012140100051' },
  { srNo: 2, name: 'Samarth Gupta', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100052', customEnrollmentNo: '23012140100052' },
  { srNo: 3, name: 'Sanjeev Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100053', customEnrollmentNo: '23012140100053' },
  { srNo: 4, name: 'Sankalp Prajapati', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100054', customEnrollmentNo: '23012140100054' },
  { srNo: 5, name: 'Satyam Kumar Thakur', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100055', customEnrollmentNo: '23012140100055' },
  { srNo: 6, name: 'Saurabh Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100056', customEnrollmentNo: '23012140100056' },
  { srNo: 7, name: 'Shakti Nayak', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100057', customEnrollmentNo: '23012140100057' },
  { srNo: 8, name: 'Sharvan Chauhan', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100058', customEnrollmentNo: '23012140100058' },
  { srNo: 9, name: 'Sheenu Singh', gender: 'Female', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100059', customEnrollmentNo: '23012140100059' },
  { srNo: 10, name: 'Shikhar Gangwar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100060', customEnrollmentNo: '23012140100060' },
  { srNo: 11, name: 'Shiv Darshan Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100061', customEnrollmentNo: '23012140100061' },
  { srNo: 12, name: 'Shivshankar Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100062', customEnrollmentNo: '23012140100062' },
  { srNo: 13, name: 'Shobhit Singh', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100063', customEnrollmentNo: '23012140100063' },
  { srNo: 14, name: 'Shrishti Pathak', gender: 'Female', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100064', customEnrollmentNo: '23012140100064' },
  { srNo: 15, name: 'Srishti', gender: 'Female', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100065', customEnrollmentNo: '23012140100065' },
  { srNo: 16, name: 'Sumit', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100066', customEnrollmentNo: '23012140100066' },
  { srNo: 17, name: 'Sumit Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100067', customEnrollmentNo: '23012140100067' },
  { srNo: 18, name: 'Suraj Patel', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100068', customEnrollmentNo: '23012140100068' },
  { srNo: 19, name: 'Suraj Yadav', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100069', customEnrollmentNo: '23012140100069' },
  { srNo: 20, name: 'Sushil Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100070', customEnrollmentNo: '23012140100070' },
  { srNo: 21, name: 'Umam Shafiq', gender: 'Female', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100071', customEnrollmentNo: '23012140100071' },
  { srNo: 22, name: 'Utkarsh Awasthi', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100072', customEnrollmentNo: '23012140100072' },
  { srNo: 23, name: 'Vijay Tiwari', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100073', customEnrollmentNo: '23012140100073' },
  { srNo: 24, name: 'Vikash Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100074', customEnrollmentNo: '23012140100074' },
  { srNo: 25, name: 'Vinay Kumar', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100075', customEnrollmentNo: '23012140100075' },
  { srNo: 26, name: 'Vineet Kumar Upadhyay', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100076', customEnrollmentNo: '23012140100076' },
  { srNo: 27, name: 'Vineet Mishra', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100077', customEnrollmentNo: '23012140100077' },
  { srNo: 28, name: 'Yashraj Pankaj', gender: 'Male', branch: 'Computer Science & Engineering', section: 'B', customRollNo: 'CS-2512140100078', customEnrollmentNo: '23012140100078' },
  { srNo: 29, name: 'Abhinay Kumar', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100079', customEnrollmentNo: '23012140100079' },
  { srNo: 30, name: 'Ankita Tripathi', gender: 'Female', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100080', customEnrollmentNo: '23012140100080' },
  { srNo: 31, name: 'Ansh Pandey', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100081', customEnrollmentNo: '23012140100081' },
  { srNo: 32, name: 'Anshumaan Mishra', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100082', customEnrollmentNo: '23012140100082' },
  { srNo: 33, name: 'Ashutosh Narayan Singh', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100083', customEnrollmentNo: '23012140100083' },
  { srNo: 34, name: 'Sujeet Kumar Gautam', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100084', customEnrollmentNo: '23012140100084' },
  { srNo: 35, name: 'Tanay Pandey', gender: 'Male', branch: 'Electrical Engineering', section: 'B', customRollNo: 'EE-2512140100085', customEnrollmentNo: '23012140100085' },
  { srNo: 36, name: 'Amir Ansari', gender: 'Male', branch: 'Mechanical Engineering', section: 'B', customRollNo: 'ME-2512140100086', customEnrollmentNo: '23012140100086' },
  { srNo: 37, name: 'Amit Kumar Yadav', gender: 'Male', branch: 'Mechanical Engineering', section: 'B', customRollNo: 'ME-2512140100087', customEnrollmentNo: '23012140100087' },
  { srNo: 38, name: 'Anshuman Upadhyay', gender: 'Male', branch: 'Mechanical Engineering', section: 'B', customRollNo: 'ME-2512140100088', customEnrollmentNo: '23012140100088' },
  { srNo: 39, name: 'Jwala Verma', gender: 'Male', branch: 'Mechanical Engineering', section: 'B', customRollNo: 'ME-2512140100089', customEnrollmentNo: '23012140100089' },
  { srNo: 40, name: 'Parmatma Verma', gender: 'Male', branch: 'Mechanical Engineering', section: 'B', customRollNo: 'ME-2512140100090', customEnrollmentNo: '23012140100090' },
  { srNo: 41, name: 'Aaryan Yadav', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100091', customEnrollmentNo: '23012140100091' },
  { srNo: 42, name: 'Chandan Babu Sharma', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100092', customEnrollmentNo: '23012140100092' },
  { srNo: 43, name: 'Dharmendra Yadav', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100093', customEnrollmentNo: '23012140100093' },
  { srNo: 44, name: 'Mukesh Yadav', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100094', customEnrollmentNo: '23012140100094' },
  { srNo: 45, name: 'Neeraj Paswan', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100095', customEnrollmentNo: '23012140100095' },
  { srNo: 46, name: 'Saksham Tiwari', gender: 'Male', branch: 'Civil Engineering', section: 'B', customRollNo: 'CE-2512140100096', customEnrollmentNo: '23012140100096' }
];

export const ALL_MPDREC_STUDENT_RECORDS: StudentSeedRecord[] = [
  ...MPDREC_STUDENT_ROSTER_50,
  ...MPDREC_STUDENT_ROSTER_SECTION_B
];

export const generate50Students = (): Student[] => {
  const allSeeds = ALL_MPDREC_STUDENT_RECORDS;
  const students: Student[] = [];

  for (let i = 1; i <= allSeeds.length; i++) {
    const seed = allSeeds[i - 1];
    const isSectionB = seed.section === 'B';
    const padded = String(i).padStart(5, '0');
    
    // Determine roll number and branch code prefix
    let rollNo = seed.customRollNo;
    let enrollmentNo = seed.customEnrollmentNo;
    
    if (!rollNo) {
      rollNo = `CS-25121401${padded}`;
    }
    if (!enrollmentNo) {
      enrollmentNo = `2301214010${String(i).padStart(4, '0')}`;
    }

    const name = seed.name;
    const gender = seed.gender;
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${i <= 50 ? i : ''}@mpdrec.ac.in`;
    const phone = `+91 9${(80000000 + i * 3731).toString().slice(0, 9)}`;
    const parentName = `Shri Ram Prakash & Smt. Shanti Devi`;
    const parentPhone = `+91 9${(70000000 + i * 2919).toString().slice(0, 9)}`;
    
    // Branch, Semester & Section
    const branch = seed.branch;
    const semester = 3; // EVERYONE IN 3rd SEMESTER
    const section = seed.section || 'A';

    // Attendance distribution
    const totalClasses = 100;
    let attendancePercentage = 64 + ((i * 7 + 11) % 32); // 64% to 95%
    if (seed.isTopPerformer === 1) attendancePercentage = 97; // Umam Shafiq
    else if (seed.isTopPerformer === 2) attendancePercentage = 95; // Govind Gaharwar
    else if (seed.isTopPerformer === 3) attendancePercentage = 94; // Deependra Verma

    const attendedClasses = Math.round((attendancePercentage / 100) * totalClasses);

    // Academic performance base
    const baseScore = 52 + ((i * 11) % 34); // 52 to 86
    const subjects = generateSubjectsSem3(baseScore, seed.isTopPerformer);
    
    // Calculate SGPA & CGPA
    let sgpa: number;
    let cgpa: number;

    if (seed.isTopPerformer === 1) {
      // 1. Umam Shafiq -> Rank 1
      sgpa = 9.75;
      cgpa = 9.68;
    } else if (seed.isTopPerformer === 2) {
      // 2. Govind Gaharwar -> Rank 2
      sgpa = 9.50;
      cgpa = 9.42;
    } else if (seed.isTopPerformer === 3) {
      // 3. Deependra Verma -> Rank 3
      sgpa = 9.35;
      cgpa = 9.28;
    } else {
      const totalCreditPoints = subjects.reduce((acc, curr) => acc + (curr.credits * curr.gradePoint), 0);
      const totalCredits = subjects.reduce((acc, curr) => acc + curr.credits, 0);
      const rawSgpa = Number((totalCreditPoints / totalCredits).toFixed(2));
      // Cap at 8.85 so Top 3 are always strictly top performing
      sgpa = Math.min(8.85, rawSgpa);
      cgpa = Number((sgpa * 0.96 + (i % 3 === 0 ? 0.1 : -0.1)).toFixed(2));
    }

    const backlogs = subjects.filter(s => s.grade === 'F').length;
    
    let status: Student['status'] = 'Regular';
    if (cgpa >= 8.5 && attendancePercentage >= 80) status = 'Honours';
    else if (attendancePercentage < 75 || backlogs > 2) status = 'Detained';
    else if (backlogs > 0) status = 'Promoted';

    // Fees
    const totalFees = 55000;
    const paidOptions = [55000, 55000, 27500, 55000, 0];
    const feesPaid = paidOptions[(i - 1) % paidOptions.length];
    const balanceFees = totalFees - feesPaid;
    const feeStatus: Student['feeStatus'] = feesPaid === totalFees ? 'Paid' : feesPaid > 0 ? 'Partial' : 'Pending';

    // Hostel Allotment (Exclusively for female scholars in Saryu Girls Hostel paired with 4th year scholars; all male scholars are Day Scholars)
    const isFemale = gender === 'Female';
    const girlHostelMap: Record<string, { room: string; bed: 'A' | 'B'; roommateNote: string }> = {
      'Archana Yadav': { room: '101', bed: 'A', roommateNote: 'Roommate Bed B: Muskan Mishra (4th Year CSE)' },
      'Ayushka Yadav': { room: '102', bed: 'A', roommateNote: 'Roommate Bed B: Vaishnavi Pandey (4th Year CSE)' },
      'Dharmika Gangwar': { room: '103', bed: 'A', roommateNote: 'Roommate Bed B: Manu Tiwari (4th Year CSE)' },
      'Diksha Patel': { room: '104', bed: 'A', roommateNote: 'Roommate Bed B: Archita Mishra (4th Year CSE)' },
      'Jagriti Yadav': { room: '105', bed: 'A', roommateNote: 'Roommate Bed B: Dipali Gupta (4th Year CSE)' },
      'Jyoti Vishwakarma': { room: '201', bed: 'A', roommateNote: 'Roommate Bed B: Soumya Yadav (4th Year CSE)' },
      'Nayansi Niketa': { room: '202', bed: 'A', roommateNote: 'Roommate Bed B: Riya Pathak (4th Year CSE)' },
      'Prashnsa Saxena': { room: '203', bed: 'A', roommateNote: 'Roommate Bed B: Madhukar Shukla (4th Year CSE)' },
      'Umam Shafiq': { room: '204', bed: 'A', roommateNote: 'Roommate Bed B: Kajal Singh (4th Year CSE)' },
      'Ratna Priya': { room: '205', bed: 'A', roommateNote: 'Roommate Bed B: Aditi Srivastava (4th Year CSE)' },
      'Roshni Yadav': { room: '301', bed: 'A', roommateNote: 'Roommate Bed B: Sneha Verma (4th Year CSE)' },
      'Sheenu Singh': { room: '302', bed: 'A', roommateNote: 'Roommate Bed B: Shreya Gupta (4th Year CSE)' },
      'Shrishti Pathak': { room: '303', bed: 'A', roommateNote: 'Roommate Bed B: Priya Singh (4th Year CSE)' },
      'Srishti': { room: '304', bed: 'A', roommateNote: 'Roommate Bed B: Nandini Sharma (4th Year CSE)' },
      'Ankita Tripathi': { room: '305', bed: 'A', roommateNote: 'Roommate Bed B: Ishita Tiwari (4th Year CSE)' }
    };

    const girlAllotment = isFemale ? girlHostelMap[name] : undefined;
    const hostelAllotment: Student['hostelAllotment'] = girlAllotment ? {
      hostelName: 'Saryu Girls Hostel',
      roomNo: girlAllotment.room,
      bed: girlAllotment.bed,
      allottedDate: '2025-08-01',
      roommateNote: girlAllotment.roommateNote,
    } : {
      hostelName: 'Day Scholar',
      roomNo: '-',
      bed: 'A',
      allottedDate: '-',
    };

    // Issued library books
    const issuedBooks: Student['issuedBooks'] = [];
    if (i % 2 === 0) {
      const b1 = booksLibrary[i % booksLibrary.length];
      issuedBooks.push({
        bookId: b1.id,
        title: b1.title,
        isbn: b1.isbn,
        issueDate: '2026-07-15',
        dueDate: '2026-08-15',
        fineAmount: (i % 3 === 0) ? 20 : 0,
      });
    }
    if (i % 5 === 0) {
      const b2 = booksLibrary[(i + 3) % booksLibrary.length];
      issuedBooks.push({
        bookId: b2.id,
        title: b2.title,
        isbn: b2.isbn,
        issueDate: '2026-08-01',
        dueDate: '2026-08-25',
        fineAmount: 0,
      });
    }

    const semesterResults = compileStudentSemesterResults(baseScore, subjects, sgpa, cgpa, seed.isTopPerformer);

    students.push({
      rollNo,
      enrollmentNo,
      name,
      gender: gender as 'Male' | 'Female',
      email,
      phone,
      parentName,
      parentPhone,
      branch: branch as any,
      semester,
      currentYear: 2, // 2nd Year (Sophomore)
      academicSession: '2025-2026',
      section,
      admissionYear: 2024,
      category: (i % 4 === 0 ? 'OBC' : i % 7 === 0 ? 'SC' : i % 9 === 0 ? 'EWS' : 'General'),
      totalClasses,
      attendedClasses,
      attendancePercentage,
      subjects,
      sgpa,
      cgpa,
      backlogs,
      status,
      academicProgressionHistory: [
        { semester: 1, sgpa: semesterResults[0]?.sgpa || Number((sgpa - 0.25).toFixed(2)), promotionDate: '2025-01-20', remarks: 'Cleared all 8 theory & lab courses' },
        { semester: 2, sgpa: semesterResults[1]?.sgpa || Number((sgpa - 0.12).toFixed(2)), promotionDate: '2025-07-18', remarks: 'Promoted to 2nd Year with Good Academic Standing' },
      ],
      semesterResults,
      totalFees,
      feesPaid,
      balanceFees,
      feeStatus,
      scholarshipStatus: (i % 6 === 0 ? 'UP Post-Matric Tech Scholarship Sanctioned' : undefined),
      hostelAllotment,
      issuedBooks,
      assignedProject: {
        title: i % 2 === 0 ? 'Data Structures Visualizer & Graph Tracer' : 'Smart Campus Attendance & Sensor Monitor',
        mentor: i % 3 === 0 ? 'Prof. Shivani Verma' : 'Dr. Rajesh Sharma',
        status: i % 4 === 0 ? 'Reviewed' : 'In Progress',
        grade: i % 4 === 0 ? 'A+' : undefined
      }
    });
  }

  const students2ndYear = students;
  const students3rdYear = generate3rdYearStudents();
  const students4thYear = generate4thYearStudents();

  return [...students2ndYear, ...students3rdYear, ...students4thYear];
};

export const SEED_NOTICES: Notice[] = [];

export const SEED_COURSE_DETAILS_SEM3: SubjectCourseDetail[] = [
  { sNo: 1, subjectCode: 'BAS303', subjectName: 'Mathematics-III', facultyName: 'Dr. Pundrik', facultyAbbr: 'PUN', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 2, subjectCode: 'BAS301', subjectName: 'Technical Communication', facultyName: 'Faculty (To be assigned)', facultyAbbr: 'TBA', typePeriods: 'Theory – 2', category: 'Theory' },
  { sNo: 3, subjectCode: 'BCS301', subjectName: 'Data Structure', facultyName: 'Dr. Rohit Tripathi', facultyAbbr: 'RT', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 4, subjectCode: 'BCS302', subjectName: 'Computer Organization and Architecture', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 5, subjectCode: 'BCS303', subjectName: 'Discrete Structures & Theory of Logic', facultyName: 'Dr Aparna Verma', facultyAbbr: 'AV', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 6, subjectCode: 'BCC301', subjectName: 'Cyber Security', facultyName: 'Dr. C. L. P. Gupta', facultyAbbr: 'CLP', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 7, subjectCode: 'BCS351', subjectName: 'Data Structure Lab', facultyName: 'Dr. Rohit Tripathi', facultyAbbr: 'RT', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 8, subjectCode: 'BCS352', subjectName: 'Computer Organization and Architecture Lab', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 9, subjectCode: 'BCS353', subjectName: 'Web Designing Workshop', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 10, subjectCode: 'BCC351', subjectName: 'Internship Assessment / Mini Project', facultyName: 'Mr. Shailendra Kumar Yadav (SKY), Mr. Sandip Kumar Singh (SKS)', facultyAbbr: 'SKY/SKS', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
];

export const SEED_COURSE_DETAILS_SEM5: SubjectCourseDetail[] = [
  { sNo: 1, subjectCode: 'BCS501', subjectName: 'Database Management System', facultyName: 'Mr. Shailendra Kumar Yadav', facultyAbbr: 'SKY', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 2, subjectCode: 'BCS502', subjectName: 'Web Technology', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 3, subjectCode: 'BCS503', subjectName: 'Design and Analysis of Algorithm', facultyName: 'Dr. Rohit Tripathi', facultyAbbr: 'RT', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 4, subjectCode: 'BCS-052', subjectName: 'Data Analytics', facultyName: 'Dr. C. L. P. Gupta', facultyAbbr: 'CLP', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 5, subjectCode: 'BCS-058', subjectName: 'Data Warehousing & Data Mining', facultyName: 'Mr. Shailendra Kumar Yadav', facultyAbbr: 'SKY', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 6, subjectCode: 'BNC501', subjectName: 'Constitution of India', facultyName: 'Mr. Akash Bajpai', facultyAbbr: 'AB', typePeriods: 'Theory – 2', category: 'Theory' },
  { sNo: 7, subjectCode: 'BCS551', subjectName: 'Database Management System Lab', facultyName: 'Mr. Shailendra Kumar Yadav', facultyAbbr: 'SKY', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 8, subjectCode: 'BCS552', subjectName: 'Web Technology Lab', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 9, subjectCode: 'BCS553', subjectName: 'Design and Analysis of Algorithm Lab', facultyName: 'Dr. Rohit Tripathi', facultyAbbr: 'RT', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 10, subjectCode: 'BCS554', subjectName: 'Mini Project / Internship Assessment', facultyName: 'Mr. Sandip Kumar Singh', facultyAbbr: 'SKS', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
];

export const SEED_COURSE_DETAILS_SEM7: SubjectCourseDetail[] = [
  { sNo: 1, subjectCode: 'BCS701', subjectName: 'Artificial Intelligence', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 2, subjectCode: 'BCS070', subjectName: 'Internet of Things', facultyName: 'Mr. Shailendra Kumar Yadav', facultyAbbr: 'SKY', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 3, subjectCode: 'BOE073', subjectName: 'Machine Learning', facultyName: 'Dr. Arpit Jain', facultyAbbr: 'AJ', typePeriods: 'Theory – 3', category: 'Theory' },
  { sNo: 4, subjectCode: 'BCS751', subjectName: 'Artificial Intelligence Lab', facultyName: 'Mr. Vishal Ranjan', facultyAbbr: 'VR', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 5, subjectCode: 'BCS752', subjectName: 'Mini Project / Internship Assessment', facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi', facultyAbbr: 'CLP/AJ/RT', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
  { sNo: 6, subjectCode: 'BCS753', subjectName: 'Project-I', facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi', facultyAbbr: 'CLP/AJ/RT', typePeriods: 'Practical – 6', category: 'Practical' },
  { sNo: 7, subjectCode: 'BCS754', subjectName: 'Startup and Entrepreneurial Activity', facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi', facultyAbbr: 'CLP/AJ/RT', typePeriods: 'Practical – 4 (2 sec x 2)', category: 'Practical' },
];

export const ALL_YEAR_COURSE_DETAILS: Record<number, SubjectCourseDetail[]> = {
  3: SEED_COURSE_DETAILS_SEM3,
  5: SEED_COURSE_DETAILS_SEM5,
  7: SEED_COURSE_DETAILS_SEM7,
};

export const SEED_COURSE_DETAILS: SubjectCourseDetail[] = [
  ...SEED_COURSE_DETAILS_SEM3,
  ...SEED_COURSE_DETAILS_SEM5,
  ...SEED_COURSE_DETAILS_SEM7,
];

export const TIMETABLE_METADATA_BY_YEAR = {
  3: {
    yearLabel: '2nd Year',
    semesterLabel: 'III Semester',
    session: '2026-27, ODD Semester',
    effectiveFrom: '30/07/2026',
    classroom: 'LH-101',
    department: 'Computer Science & Engineering',
  },
  5: {
    yearLabel: '3rd Year',
    semesterLabel: 'V Semester',
    session: '2026-27, ODD Semester',
    effectiveFrom: '29/07/2026',
    classroom: 'LH-201',
    department: 'Computer Science & Engineering',
  },
  7: {
    yearLabel: '4th Year',
    semesterLabel: 'VII Semester',
    session: '2026-27, ODD Semester',
    effectiveFrom: '28/07/2026',
    classroom: 'LH-301',
    department: 'Computer Science & Engineering',
  },
};

export const SEED_TIMETABLE: TimetableSlot[] = [
  // =========================================================================
  // ===================== 2ND YEAR (III SEMESTER) ==========================
  // ===================== EFFECTIVE FROM: 30/07/2026 ========================
  // =========================================================================

  // --- MONDAY (SEM 3) ---
  {
    id: 'TT-S3-MON-1',
    day: 'Monday',
    period: '1',
    timeSlot: '09:10 AM - 10:00 AM',
    time: '09:10 AM - 10:00 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-MON-2',
    day: 'Monday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-MON-3',
    day: 'Monday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-MON-4',
    day: 'Monday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS301',
    subjectName: 'Data Structure',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-MON-5-6',
    day: 'Monday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS353',
    subjectName: 'Web Designing Workshop',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Practical',
    roomNo: 'Web Technology Lab',
    room: 'Web Technology Lab',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 2,
  },
  {
    id: 'TT-S3-MON-7',
    day: 'Monday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- TUESDAY (SEM 3) ---
  {
    id: 'TT-S3-TUE-1',
    day: 'Tuesday',
    period: '1',
    timeSlot: '09:10 AM - 10:00 AM',
    time: '09:10 AM - 10:00 AM',
    subjectCode: 'BAS301',
    subjectName: 'Technical Communication',
    facultyName: 'Faculty (To be assigned)',
    facultyAbbr: 'TBA',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-TUE-2',
    day: 'Tuesday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-TUE-3-4',
    day: 'Tuesday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS352',
    subjectName: 'Computer Organization and Architecture Lab',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Practical',
    roomNo: 'COA & Hardware Lab',
    room: 'COA & Hardware Lab',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 2,
  },
  {
    id: 'TT-S3-TUE-5-6',
    day: 'Tuesday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS351',
    subjectName: 'Data Structure Lab',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Practical',
    roomNo: 'Data Structure Lab',
    room: 'Data Structure Lab',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 2,
  },
  {
    id: 'TT-S3-TUE-7',
    day: 'Tuesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic (Sec-A)',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 1,
  },

  // --- WEDNESDAY (SEM 3) ---
  {
    id: 'TT-S3-WED-1-2',
    day: 'Wednesday',
    period: '1-2',
    timeSlot: '09:10 AM - 10:50 AM',
    time: '09:10 AM - 10:50 AM',
    subjectCode: 'BCC351',
    subjectName: 'Internship Assessment / Mini Project',
    facultyName: 'Mr. Shailendra Kumar Yadav & Mr. Sandip Kumar Singh',
    facultyAbbr: 'SKY/SKS',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 2,
  },
  {
    id: 'TT-S3-WED-3',
    day: 'Wednesday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-WED-4',
    day: 'Wednesday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS302',
    subjectName: 'Computer Organization and Architecture',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-WED-5',
    day: 'Wednesday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-WED-6',
    day: 'Wednesday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-WED-7',
    day: 'Wednesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic (Sec-A)',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 1,
  },

  // --- THURSDAY (SEM 3) ---
  {
    id: 'TT-S3-THU-1',
    day: 'Thursday',
    period: '1',
    timeSlot: '09:10 AM - 10:00 AM',
    time: '09:10 AM - 10:00 AM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-2',
    day: 'Thursday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-3',
    day: 'Thursday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-4',
    day: 'Thursday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS301',
    subjectName: 'Data Structure',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-5',
    day: 'Thursday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCC301',
    subjectName: 'Cyber Security',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-6',
    day: 'Thursday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'BCS303',
    subjectName: 'Discrete Structures & Theory of Logic',
    facultyName: 'Dr Aparna Verma',
    facultyAbbr: 'AV',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-THU-7',
    day: 'Thursday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BCS302',
    subjectName: 'Computer Organization and Architecture',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- FRIDAY (SEM 3) ---
  {
    id: 'TT-S3-FRI-1',
    day: 'Friday',
    period: '1',
    timeSlot: '09:10 AM - 10:00 AM',
    time: '09:10 AM - 10:00 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-2',
    day: 'Friday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BAS301',
    subjectName: 'Technical Communication',
    facultyName: 'Faculty (To be assigned)',
    facultyAbbr: 'TBA',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-3',
    day: 'Friday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-4',
    day: 'Friday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS301',
    subjectName: 'Data Structure',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-5',
    day: 'Friday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCC301',
    subjectName: 'Cyber Security',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-6',
    day: 'Friday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III (Tutorial - Sec B)',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Tutorial',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 1,
  },
  {
    id: 'TT-S3-FRI-7',
    day: 'Friday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BCS302',
    subjectName: 'Computer Organization and Architecture',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- SATURDAY (SEM 3) ---
  {
    id: 'TT-S3-SAT-1',
    day: 'Saturday',
    period: '1',
    timeSlot: '09:10 AM - 10:00 AM',
    time: '09:10 AM - 10:00 AM',
    subjectCode: 'BCC301',
    subjectName: 'Cyber Security',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-2',
    day: 'Saturday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BAS303',
    subjectName: 'Mathematics-III',
    facultyName: 'Dr. Pundrik',
    facultyAbbr: 'PUN',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-3',
    day: 'Saturday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-4',
    day: 'Saturday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-5',
    day: 'Saturday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'LIB',
    subjectName: 'Library & Self-Study Research',
    facultyName: 'Library In-charge',
    facultyAbbr: 'LIB',
    type: 'Activity',
    roomNo: 'Central Library',
    room: 'Central Library',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-6',
    day: 'Saturday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S3-SAT-7',
    day: 'Saturday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-101',
    room: 'Lecture Hall LH-101',
    semester: 3,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // =========================================================================
  // ===================== 3RD YEAR (V SEMESTER) ============================
  // ===================== EFFECTIVE FROM: 29/07/2026 ========================
  // =========================================================================

  // --- MONDAY (SEM 5) ---
  {
    id: 'TT-S5-MON-1-2-B',
    day: 'Monday',
    period: '1-2',
    timeSlot: '09:10 AM - 10:50 AM',
    time: '09:10 AM - 10:50 AM',
    subjectCode: 'BCS552',
    subjectName: 'Web Technology Lab (Sec-B)',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Practical',
    roomNo: 'Web Technology Lab',
    room: 'Web Technology Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S5-MON-3',
    day: 'Monday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-MON-4',
    day: 'Monday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS-052',
    subjectName: 'Data Analytics',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-MON-5',
    day: 'Monday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCS503',
    subjectName: 'Design and Analysis of Algorithm',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-MON-6',
    day: 'Monday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'BCS501',
    subjectName: 'Database Management System',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-MON-7',
    day: 'Monday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BCS502',
    subjectName: 'Web Technology',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- TUESDAY (SEM 5) ---
  {
    id: 'TT-S5-TUE-1',
    day: 'Tuesday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-TUE-2',
    day: 'Tuesday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS-058',
    subjectName: 'Data Warehousing & Data Mining',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-TUE-3-4-B',
    day: 'Tuesday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS554',
    subjectName: 'Mini Project / Internship Assessment (Sec-B)',
    facultyName: 'Mr. Sandip Kumar Singh',
    facultyAbbr: 'SKS',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S5-TUE-5',
    day: 'Tuesday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCS-052',
    subjectName: 'Data Analytics',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-TUE-6',
    day: 'Tuesday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'SPORTS',
    subjectName: 'Sports, Yoga & Physical Activity',
    facultyName: 'Sports In-charge',
    facultyAbbr: 'SPORTS',
    type: 'Activity',
    roomNo: 'Sports Ground',
    room: 'Sports Ground',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-TUE-7',
    day: 'Tuesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- WEDNESDAY (SEM 5) ---
  {
    id: 'TT-S5-WED-1',
    day: 'Wednesday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'LIB',
    subjectName: 'Central Library & Reference Research',
    facultyName: 'Library In-charge',
    facultyAbbr: 'LIB',
    type: 'Activity',
    roomNo: 'Central Library',
    room: 'Central Library',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-2',
    day: 'Wednesday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS501',
    subjectName: 'Database Management System',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-3',
    day: 'Wednesday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'BCS-052',
    subjectName: 'Data Analytics',
    facultyName: 'Dr. C. L. P. Gupta',
    facultyAbbr: 'CLP',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-4',
    day: 'Wednesday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS503',
    subjectName: 'Design and Analysis of Algorithm',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-5',
    day: 'Wednesday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BNC501',
    subjectName: 'Constitution of India',
    facultyName: 'Mr. Akash Bajpai',
    facultyAbbr: 'AB',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-6',
    day: 'Wednesday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'BCS-058',
    subjectName: 'Data Warehousing & Data Mining',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-WED-7',
    day: 'Wednesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- THURSDAY (SEM 5) ---
  {
    id: 'TT-S5-THU-1',
    day: 'Thursday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'BCS501',
    subjectName: 'Database Management System',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-2',
    day: 'Thursday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS503',
    subjectName: 'Design and Analysis of Algorithm',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-3',
    day: 'Thursday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-4',
    day: 'Thursday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BNC501',
    subjectName: 'Constitution of India',
    facultyName: 'Mr. Akash Bajpai',
    facultyAbbr: 'AB',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-5',
    day: 'Thursday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCS502',
    subjectName: 'Web Technology',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-6',
    day: 'Thursday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-THU-7',
    day: 'Thursday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- FRIDAY (SEM 5) ---
  {
    id: 'TT-S5-FRI-1-2-B',
    day: 'Friday',
    period: '1-2',
    timeSlot: '09:10 AM - 10:50 AM',
    time: '09:10 AM - 10:50 AM',
    subjectCode: 'BCS551',
    subjectName: 'Database Management System Lab (Sec-B)',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Practical',
    roomNo: 'DBMS Lab',
    room: 'DBMS Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S5-FRI-1-2-A',
    day: 'Friday',
    period: '1-2',
    timeSlot: '09:10 AM - 10:50 AM',
    time: '09:10 AM - 10:50 AM',
    subjectCode: 'BCS553',
    subjectName: 'Design and Analysis of Algorithm Lab (Sec-A)',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Practical',
    roomNo: 'DAA & Advanced Algorithms Lab',
    room: 'DAA & Advanced Algorithms Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S5-FRI-3-4',
    day: 'Friday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS554',
    subjectName: 'Mini Project / Internship Assessment (Sec-A)',
    facultyName: 'Mr. Sandip Kumar Singh',
    facultyAbbr: 'SKS',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S5-FRI-5-6-B',
    day: 'Friday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS553',
    subjectName: 'Design and Analysis of Algorithm Lab (Sec-B)',
    facultyName: 'Dr. Rohit Tripathi',
    facultyAbbr: 'RT',
    type: 'Practical',
    roomNo: 'DAA & Advanced Algorithms Lab',
    room: 'DAA & Advanced Algorithms Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S5-FRI-5-6-A',
    day: 'Friday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS551',
    subjectName: 'Database Management System Lab (Sec-A)',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Practical',
    roomNo: 'DBMS Lab',
    room: 'DBMS Lab',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S5-FRI-7',
    day: 'Friday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- SATURDAY (SEM 5) ---
  {
    id: 'TT-S5-SAT-1',
    day: 'Saturday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'BCS-058',
    subjectName: 'Data Warehousing & Data Mining',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-SAT-2',
    day: 'Saturday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS502',
    subjectName: 'Web Technology',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-SAT-3',
    day: 'Saturday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-SAT-4',
    day: 'Saturday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-201',
    room: 'Lecture Hall LH-201',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S5-SAT-5-7',
    day: 'Saturday',
    period: '5-7',
    timeSlot: '02:00 PM - 04:30 PM',
    time: '02:00 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Project Mentorship, Competitive Programming & Remedial',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'CSE Seminar Hall & Labs',
    room: 'CSE Seminar Hall & Labs',
    semester: 5,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 3,
  },

  // =========================================================================
  // ===================== 4TH YEAR (VII SEMESTER) ==========================
  // ===================== EFFECTIVE FROM: 28/07/2026 ========================
  // =========================================================================

  // --- MONDAY (SEM 7) ---
  {
    id: 'TT-S7-MON-1',
    day: 'Monday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-MON-2',
    day: 'Monday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-MON-3',
    day: 'Monday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'BOE073',
    subjectName: 'Machine Learning',
    facultyName: 'Dr. Arpit Jain',
    facultyAbbr: 'AJ',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-MON-4',
    day: 'Monday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'BCS701',
    subjectName: 'Artificial Intelligence',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-MON-5-6-B',
    day: 'Monday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS753',
    subjectName: 'Project-I (Sec-B)',
    facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi',
    facultyAbbr: 'CLP/AJ/RT',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S7-MON-7',
    day: 'Monday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- TUESDAY (SEM 7) ---
  {
    id: 'TT-S7-TUE-1',
    day: 'Tuesday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'BCS070',
    subjectName: 'Internet of Things',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-2',
    day: 'Tuesday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS701',
    subjectName: 'Artificial Intelligence',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-3',
    day: 'Tuesday',
    period: '3',
    timeSlot: '10:50 AM - 11:40 AM',
    time: '10:50 AM - 11:40 AM',
    subjectCode: 'LIB',
    subjectName: 'Central Library & Technical Papers Review',
    facultyName: 'Library In-charge',
    facultyAbbr: 'LIB',
    type: 'Activity',
    roomNo: 'Central Library',
    room: 'Central Library',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-4',
    day: 'Tuesday',
    period: '4',
    timeSlot: '11:40 AM - 12:30 PM',
    time: '11:40 AM - 12:30 PM',
    subjectCode: 'SPORTS',
    subjectName: 'Sports, Fitness & Physical Activity',
    facultyName: 'Sports In-charge',
    facultyAbbr: 'SPORTS',
    type: 'Activity',
    roomNo: 'Sports Ground',
    room: 'Sports Ground',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-5',
    day: 'Tuesday',
    period: '5',
    timeSlot: '02:00 PM - 02:50 PM',
    time: '02:00 PM - 02:50 PM',
    subjectCode: 'BCS070',
    subjectName: 'Internet of Things',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-6',
    day: 'Tuesday',
    period: '6',
    timeSlot: '02:50 PM - 03:40 PM',
    time: '02:50 PM - 03:40 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-TUE-7',
    day: 'Tuesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- WEDNESDAY (SEM 7) ---
  {
    id: 'TT-S7-WED-1',
    day: 'Wednesday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-WED-2',
    day: 'Wednesday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-WED-3-4-B',
    day: 'Wednesday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS754',
    subjectName: 'Startup and Entrepreneurial Activity (Sec-B)',
    facultyName: 'Dr. Arpit Jain, Dr. C. L. P. Gupta, Dr. Rohit Tripathi',
    facultyAbbr: 'AJ/CLP/RT',
    type: 'Practical',
    roomNo: 'Startup Incubation Hub',
    room: 'Startup Incubation Hub',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S7-WED-5-6-A',
    day: 'Wednesday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS753',
    subjectName: 'Project-I (Sec-A)',
    facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi',
    facultyAbbr: 'CLP/AJ/RT',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S7-WED-7',
    day: 'Wednesday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'BOE073',
    subjectName: 'Machine Learning',
    facultyName: 'Dr. Arpit Jain',
    facultyAbbr: 'AJ',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- THURSDAY (SEM 7) ---
  {
    id: 'TT-S7-THU-1',
    day: 'Thursday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'BOE073',
    subjectName: 'Machine Learning',
    facultyName: 'Dr. Arpit Jain',
    facultyAbbr: 'AJ',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-THU-2',
    day: 'Thursday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS070',
    subjectName: 'Internet of Things',
    facultyName: 'Mr. Shailendra Kumar Yadav',
    facultyAbbr: 'SKY',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-THU-3-4',
    day: 'Thursday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS751',
    subjectName: 'Artificial Intelligence Lab',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Practical',
    roomNo: 'AI & Data Science Lab',
    room: 'AI & Data Science Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 2,
  },
  {
    id: 'TT-S7-THU-5-6-B',
    day: 'Thursday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS752',
    subjectName: 'Mini Project / Internship Assessment (Sec-B)',
    facultyName: 'Dr. C. L. P. Gupta, Dr. Rohit Tripathi',
    facultyAbbr: 'CLP/RT',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'B',
    span: 2,
  },
  {
    id: 'TT-S7-THU-7',
    day: 'Thursday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- FRIDAY (SEM 7) ---
  {
    id: 'TT-S7-FRI-1',
    day: 'Friday',
    period: '1',
    timeSlot: '09:10 AM - 09:50 AM',
    time: '09:10 AM - 09:50 AM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-FRI-2',
    day: 'Friday',
    period: '2',
    timeSlot: '10:00 AM - 10:50 AM',
    time: '10:00 AM - 10:50 AM',
    subjectCode: 'BCS701',
    subjectName: 'Artificial Intelligence',
    facultyName: 'Mr. Vishal Ranjan',
    facultyAbbr: 'VR',
    type: 'Lecture',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },
  {
    id: 'TT-S7-FRI-3-4-A',
    day: 'Friday',
    period: '3-4',
    timeSlot: '10:50 AM - 12:30 PM',
    time: '10:50 AM - 12:30 PM',
    subjectCode: 'BCS752',
    subjectName: 'Mini Project / Internship Assessment (Sec-A)',
    facultyName: 'Dr. C. L. P. Gupta, Dr. Rohit Tripathi',
    facultyAbbr: 'CLP/RT',
    type: 'Practical',
    roomNo: 'Project & Incubation Lab',
    room: 'Project & Incubation Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S7-FRI-5-6-A',
    day: 'Friday',
    period: '5-6',
    timeSlot: '02:00 PM - 03:40 PM',
    time: '02:00 PM - 03:40 PM',
    subjectCode: 'BCS754',
    subjectName: 'Startup and Entrepreneurial Activity (Sec-A)',
    facultyName: 'Dr. C. L. P. Gupta, Dr. Arpit Jain, Dr. Rohit Tripathi',
    facultyAbbr: 'CLP/AJ/RT',
    type: 'Practical',
    roomNo: 'Startup Incubation Hub',
    room: 'Startup Incubation Hub',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'A',
    span: 2,
  },
  {
    id: 'TT-S7-FRI-7',
    day: 'Friday',
    period: '7',
    timeSlot: '03:40 PM - 04:30 PM',
    time: '03:40 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental / Doubt Clearing / Co-curricular',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'Lecture Hall LH-301',
    room: 'Lecture Hall LH-301',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 1,
  },

  // --- SATURDAY (SEM 7) ---
  {
    id: 'TT-S7-SAT-1-4',
    day: 'Saturday',
    period: '1-4',
    timeSlot: '09:10 AM - 12:30 PM',
    time: '09:10 AM - 12:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Departmental Review, Capstone Mentoring & Project Evaluation',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'CSE Seminar Hall & Project Lab',
    room: 'CSE Seminar Hall & Project Lab',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 4,
  },
  {
    id: 'TT-S7-SAT-5-7',
    day: 'Saturday',
    period: '5-7',
    timeSlot: '02:00 PM - 04:30 PM',
    time: '02:00 PM - 04:30 PM',
    subjectCode: 'DCC',
    subjectName: 'Industry Interaction, Startup Incubation & Alumni Mentoring',
    facultyName: 'CSE Department Faculty',
    facultyAbbr: 'DCC',
    type: 'Activity',
    roomNo: 'CSE Seminar Hall & Labs',
    room: 'CSE Seminar Hall & Labs',
    semester: 7,
    branch: 'Computer Science & Engineering',
    section: 'All',
    span: 3,
  },
];

export const SEED_BOOKS: LibraryBook[] = [
  { id: 'BK-001', isbn: '978-0131103627', title: 'The C Programming Language (ANSI C)', author: 'Kernighan & Ritchie', publisher: 'Prentice Hall', category: 'Programming', totalCopies: 25, availableCopies: 14, shelfLocation: 'Rack A1-04' },
  { id: 'BK-002', isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', publisher: 'MIT Press', category: 'Algorithms', totalCopies: 35, availableCopies: 8, shelfLocation: 'Rack A2-11' },
  { id: 'BK-003', isbn: '978-0133591620', title: 'Operating System Concepts (10th Ed)', author: 'Silberschatz, Galvin, Gagne', publisher: 'Wiley', category: 'Systems', totalCopies: 30, availableCopies: 11, shelfLocation: 'Rack B1-02' },
  { id: 'BK-004', isbn: '978-0078022159', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', publisher: 'McGraw-Hill', category: 'Databases', totalCopies: 28, availableCopies: 16, shelfLocation: 'Rack B2-05' },
  { id: 'BK-005', isbn: '978-0132126953', title: 'Computer Networks (5th Edition)', author: 'Tanenbaum & Wetherall', publisher: 'Pearson', category: 'Networking', totalCopies: 25, availableCopies: 9, shelfLocation: 'Rack C1-03' },
  { id: 'BK-006', isbn: '978-0134685991', title: 'Effective Java (3rd Edition)', author: 'Joshua Bloch', publisher: 'Addison-Wesley', category: 'Software Engg', totalCopies: 20, availableCopies: 15, shelfLocation: 'Rack C2-07' },
  { id: 'BK-007', isbn: '978-0131103628', title: 'Digital Logic and Computer Design', author: 'M. Morris Mano', publisher: 'Pearson', category: 'Hardware', totalCopies: 30, availableCopies: 12, shelfLocation: 'Rack D1-01' },
  { id: 'BK-008', isbn: '978-0070669116', title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', publisher: 'McGraw-Hill', category: 'Mathematics', totalCopies: 40, availableCopies: 22, shelfLocation: 'Rack D2-09' },
  { id: 'BK-009', isbn: '978-0132350884', title: 'Clean Code: A Handbook of Agile Craft', author: 'Robert C. Martin', publisher: 'Prentice Hall', category: 'Software Dev', totalCopies: 15, availableCopies: 6, shelfLocation: 'Rack E1-03' },
  { id: 'BK-010', isbn: '978-0201633610', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Gang of Four', publisher: 'Addison-Wesley', category: 'Architecture', totalCopies: 18, availableCopies: 9, shelfLocation: 'Rack E2-01' },
];

export const SEED_HOSTEL_ROOMS: HostelRoom[] = ALL_SEED_HOSTEL_ROOMS;

export const SEED_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'MAT-01',
    title: 'Complete DSA Trees, Graphs & Dynamic Programming Visual Notes',
    subject: 'Data Structures',
    semester: 3,
    uploadedBy: 'Prof. Shivani Verma',
    date: '2026-08-01',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    description: 'Detailed visual step-by-step algorithms for AVL trees, Red-Black trees, Dijkstra, Prim, Kruskal, Bellman-Ford, and standard 0/1 Knapsack DP derivations with sample AKTU exam questions.',
    downloadCount: 342,
    likes: 128,
    tags: ['DSA', 'Trees', 'Graphs', 'DP', 'KCS-301']
  },
  {
    id: 'MAT-02',
    title: 'Computer Organization CPU Instruction Formats & Pipelining Cheat Sheet',
    subject: 'Computer Organization & Architecture',
    semester: 3,
    uploadedBy: 'Dr. Rajesh Sharma',
    date: '2026-08-03',
    fileType: 'pdf',
    fileSize: '2.3 MB',
    description: 'Summary formulas for Instruction Cycle, Addressing Modes, Booth Multiplication Algorithm, Cache Memory Mapping (Direct, Associative, Set-Associative) and TLB metrics.',
    downloadCount: 298,
    likes: 95,
    tags: ['COA', 'CPU Pipelining', 'Cache Mapping', 'KCS-302']
  },
  {
    id: 'MAT-03',
    title: 'Discrete Mathematics Graph Theory, Recurrence Relations & Propositional Logic',
    subject: 'Discrete Structures & Logic',
    semester: 3,
    uploadedBy: 'Dr. Meenakshi Rao',
    date: '2026-08-05',
    fileType: 'notes',
    fileSize: '3.1 MB',
    description: 'Comprehensive study material covering Tautology truth tables, Hasse diagrams, Lattices, Generating functions, and Euler/Hamiltonian graphs with solved AKTU problems.',
    downloadCount: 215,
    likes: 84,
    tags: ['Discrete', 'Logic', 'Graph Theory', 'Lattices', 'KCS-303']
  },
  {
    id: 'MAT-04',
    title: 'OOP in Java Classes, Inheritance, Polymorphism & Exception Handling Guide',
    subject: 'Object Oriented Programming',
    semester: 3,
    uploadedBy: 'Prof. Ananya Gupta',
    date: '2026-08-08',
    fileType: 'pdf',
    fileSize: '5.2 MB',
    description: 'Core Object Oriented Principles, Java Collections framework, Multithreading synchronization, and Interface design paradigms with sample lab programs.',
    downloadCount: 189,
    likes: 72,
    tags: ['Java', 'OOP', 'Inheritance', 'Collections', 'KIT-301']
  },
  {
    id: 'MAT-05',
    title: 'AKTU Previous 5 Years Solved Question Papers Bundle (Semester 3 CSE)',
    subject: 'All Subjects Bundle',
    semester: 3,
    uploadedBy: 'Student Technical Council',
    date: '2026-08-10',
    fileType: 'zip',
    fileSize: '18.4 MB',
    description: 'Curated 2021-2025 solved university examination papers for Data Structures, COA, Discrete Structures, and Technical Communication with model answers.',
    downloadCount: 512,
    likes: 210,
    tags: ['AKTU', 'Previous-Year-Papers', 'Solved', 'Sem-3']
  }
];

export const SEED_PEER_CHAT: PeerChatMessage[] = [
  {
    id: 'MSG-01',
    senderRollNo: 'CS-2512140100045',
    senderName: 'Umam Shafiq',
    senderRole: 'Student',
    message: 'Hey everyone! Has anyone solved question 4 from Prof. Shivani Maam Data Structures Assignment on AVL tree double rotations?',
    timestamp: '10:15 AM',
    reactions: { '👍': 4, '💡': 2 }
  },
  {
    id: 'MSG-02',
    senderRollNo: 'CS-2512140100028',
    senderName: 'Govind Chandra Gaharwar',
    senderRole: 'Student',
    message: 'Yes Umam! You need to perform a double Right-Left (RL) rotation when balance factor becomes +2 with a right-heavy child node.',
    timestamp: '10:18 AM',
    reactions: { '❤️': 5 }
  },
  {
    id: 'MSG-03',
    senderRollNo: 'FAC-CSE-01',
    senderName: 'Prof. Shivani Verma',
    senderRole: 'Faculty',
    message: 'Great discussion students! Remember that AVL balance factor must always lie in {-1, 0, +1}. I have also uploaded visual trace notes in the Study Materials section.',
    timestamp: '10:24 AM',
    reactions: { '🙌': 8, '🙏': 6 }
  },
  {
    id: 'MSG-04',
    senderRollNo: 'CS-2512140100022',
    senderName: 'Deependra Verma',
    senderRole: 'Student',
    message: 'Thank you Maam! Also a reminder to everyone that tomorrow 9:00 AM we have Data Structures Lab in Computer Lab-02.',
    timestamp: '10:31 AM',
    reactions: { '⏰': 6 }
  }
];

export const SEED_TERM_MILESTONES: AcademicTermMilestone = {
  id: 'TERM-2026-ODD',
  termName: '3rd Semester Academic Session 2025 - 2026',
  startDate: '2025-08-01',
  ct1Date: '2025-09-22',
  midSemBreak: '2025-10-15',
  ct2Date: '2025-11-17',
  practicalExamsDate: '2026-08-10',
  endSemExamsDate: '2026-08-24',
  resultDeclarationDate: '2026-09-15',
  currentMilestone: 'Pre-Exam Preparation & Final Class Test Validation',
};

export const SEED_GALLERY_ITEMS: GalleryItem[] = [];

export const SEED_CAMPUS_EVENTS: CampusEvent[] = [];


