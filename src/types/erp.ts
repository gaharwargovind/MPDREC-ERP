export type UserRole = 'admin' | 'faculty' | 'student' | 'staff' | 'warden' | 'guest';

export interface SubjectMark {
  code: string;
  name: string;
  credits: number;
  classTest1: number;
  classTest2: number;
  assignment: number;
  endSem: number;
  total: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  gradePoint: number;
}

export interface IssuedBook {
  bookId: string;
  title: string;
  author?: string;
  isbn?: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount?: number;
}

export interface SemesterResultDetail {
  semester: number;
  academicYear: string;
  sessionType: 'Odd Semester' | 'Even Semester';
  status: 'PASS' | 'PASSED WITH HONOURS' | 'PROMOTED WITH BACKLOG' | 'IN PROGRESS';
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  resultDate: string;
  examType: 'Regular AKTU End-Sem' | 'Internal Continuous Evaluation' | 'Carry Over';
  subjects: SubjectMark[];
  remarks?: string;
}

export interface Student {
  rollNo: string;
  enrollmentNo: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  branch: 'Computer Science & Engineering' | 'Electrical Engineering' | 'Mechanical Engineering' | 'Civil Engineering' | 'Information Technology' | 'Electronics & Comm.' | 'Mechanical Engg' | string;
  semester: number;
  currentYear?: number;
  academicSession?: string;
  section: 'A' | 'B';
  admissionYear: number;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  
  subjects: SubjectMark[];
  sgpa: number;
  cgpa: number;
  backlogs: number;
  status: 'Regular' | 'Promoted' | 'Detained' | 'Honours';
  academicProgressionHistory: {
    semester: number;
    sgpa: number;
    promotionDate: string;
    remarks: string;
  }[];
  semesterResults?: SemesterResultDetail[];

  totalFees: number;
  feesPaid: number;
  balanceFees: number;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  scholarshipStatus?: string;

  hostelAllotment?: {
    hostelName: 'Saryu Girls Hostel' | 'Lehri Hostel' | 'Day Scholar' | string;
    roomNo: string;
    bed: 'A' | 'B';
    allottedDate: string;
    roommateNote?: string;
  };
  issuedBooks: IssuedBook[];
  
  assignedProject?: {
    title: string;
    mentor: string;
    status: 'Submitted' | 'In Progress' | 'Reviewed';
    grade?: string;
  };
}

export interface Faculty {
  facultyId: string;
  name: string;
  designation: string;
  department: 'Computer Science & Engineering' | 'Electronics & Communication' | 'Mechanical Engineering' | 'Applied Science & Humanities' | string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  subjectsTaught: string[];
  cabinRoom: string;
  joiningYear: number;
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Exam' | 'Holiday' | 'Event' | 'Placement' | 'Hostel';
  author: string;
  postedBy?: string;
  date: string;
  isUrgent?: boolean;
  targetRole?: 'All' | 'Student' | 'Faculty';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time?: string;
  timeSlot: string;
  period?: number | string;
  subjectCode: string;
  subjectName: string;
  room?: string;
  roomNo?: string;
  type?: 'Lecture' | 'Lab' | 'Tutorial' | 'Activity' | 'Practical';
  facultyName: string;
  facultyAbbr?: string;
  semester: number;
  branch: string;
  section?: 'A' | 'B' | 'All';
  span?: number;
}

export interface SubjectCourseDetail {
  sNo: number;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  facultyAbbr: string;
  typePeriods: string;
  category: 'Theory' | 'Practical' | 'Activity';
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  category?: string;
  department?: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverUrl?: string;
  issuedTo?: {
    bookId: string;
    title: string;
    issueDate: string;
    dueDate: string;
    studentRollNo: string;
    studentName: string;
  }[];
}

export interface HostelRoom {
  id: string;
  hostelName: 'Saryu Girls Hostel' | 'Lehri Hostel' | 'Day Scholar' | string;
  floor: number;
  roomNo: string;
  capacity?: number;
  bedA?: string;
  bedARoll?: string;
  bedAYear?: string;
  bedB?: string;
  bedBRoll?: string;
  bedBYear?: string;
  bedBReservedNote?: string;
  occupiedBeds?: {
    bed: 'A' | 'B';
    studentRollNo?: string;
    studentName?: string;
    studentYear?: string;
  }[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  semester?: number;
  uploadedBy: string;
  date?: string;
  uploadDate?: string;
  fileType?: 'pdf' | 'notes' | 'code' | 'zip' | string;
  type?: 'PDF Notes' | 'AKTU Solved Paper' | 'Cheatsheet' | 'Code Repo' | string;
  fileSize: string;
  description?: string;
  downloadCount?: number;
  likes: number;
  tags: string[];
}

export interface PeerChatMessage {
  id: string;
  senderRollNo?: string;
  senderName: string;
  senderRole: string;
  message?: string;
  content?: string;
  timestamp: string;
  avatar?: string;
  likes?: number;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
  reactions?: Record<string, number>;
}

export type PeerMessage = PeerChatMessage;

export interface AcademicTermMilestone {
  id: string;
  termName: string;
  startDate: string;
  ct1Date: string;
  midSemBreak: string;
  ct2Date: string;
  practicalExamsDate: string;
  endSemExamsDate: string;
  resultDeclarationDate: string;
  currentMilestone: string;
}

export interface AuthSession {
  role: UserRole;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  rollNo?: string;
  facultyId?: string;
  department?: string;
  branch?: string;
  semester?: number;
  studentYear?: number;
  user?: {
    id?: string;
    role?: UserRole;
    name?: string;
    email?: string;
    semester?: number;
    [key: string]: any;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  category: string;
  eventId?: string;
  uploadedBy: string;
  uploadedByRole: 'admin' | 'faculty' | 'student';
  uploadedById?: string;
  uploadedAt: string;
  tags: string[];
  likes: number;
  likedBy?: string[];
  eventDate?: string;
  duration?: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedByRoll?: string;
  submittedByBranch?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface CampusEvent {
  id: string;
  name: string;
  description: string;
  categoryType: 'Sports' | 'Cultural' | 'Technical' | 'Academic' | 'Celebration' | 'Workshop';
  eventDate: string;
  endDate?: string;
  venue?: string;
  coordinatorFaculty?: string;
  status: 'approved' | 'pending' | 'rejected';
  proposedBy: string;
  proposedByRole: 'admin' | 'faculty' | 'student';
  proposedById?: string;
  proposedByRoll?: string;
  proposedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  coverImage?: string;
  tags?: string[];
}


