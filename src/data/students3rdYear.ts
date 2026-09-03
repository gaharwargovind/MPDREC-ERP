import { Student, SubjectMark } from '../types/erp';

export interface RawStudentSeed {
  sNo: number;
  rollNo: string;
  name: string;
  branch: string;
  year: string;
  gender: 'Male' | 'Female';
}

export const RAW_THIRD_YEAR_STUDENTS: RawStudentSeed[] = [
  { sNo: 1, rollNo: '2412140100001', name: 'Poonam Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 2, rollNo: '2412140100002', name: 'Raghav Shukla', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 3, rollNo: '2412140100003', name: 'Nitin Varshney', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 4, rollNo: '2412140100004', name: 'Kavya Tiwari', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 5, rollNo: '2412140100005', name: 'Anuradha Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 6, rollNo: '2412140100006', name: 'Manav Pandey', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 7, rollNo: '2412140100007', name: 'Ramesh Maurya', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 8, rollNo: '2412140100008', name: 'Aakash Kumar', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 9, rollNo: '2412140100009', name: 'Ritu Ranjan', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 10, rollNo: '2412140100010', name: 'Manisha Tiwari', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 11, rollNo: '2412140100011', name: 'Shubham Saroj', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 12, rollNo: '2412140100012', name: 'Satyam Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 13, rollNo: '2412140100013', name: 'Aarohi Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 14, rollNo: '2412140100014', name: 'Anmol Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 15, rollNo: '2412140100015', name: 'Deepak Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 16, rollNo: '2412140100016', name: 'Sandeep Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 17, rollNo: '2412140100017', name: 'Divya Gupta', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 18, rollNo: '2412140100018', name: 'Pradeep Verma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 19, rollNo: '2412140100019', name: 'Shalini Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 20, rollNo: '2412140100020', name: 'Vivek Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 21, rollNo: '2412140100021', name: 'Sunil Vishwakarma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 22, rollNo: '2412140100022', name: 'Nidhi Pathak', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 23, rollNo: '2412140100023', name: 'Rohit Sharma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 24, rollNo: '2412140100024', name: 'Madhav Shukla', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 25, rollNo: '2412140100025', name: 'Kiran Singh', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 26, rollNo: '2412140100026', name: 'Anuj Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 27, rollNo: '2412140100027', name: 'Amit Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 28, rollNo: '2412140100028', name: 'Adarsh Agarwal', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 29, rollNo: '2412140100029', name: 'Srishti Srivastava', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 30, rollNo: '2412140100030', name: 'Kashish Verma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 31, rollNo: '2412140100031', name: 'Riya Gupta', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 32, rollNo: '2412140100032', name: 'Muskan Singh', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 33, rollNo: '2412140100033', name: 'Akanksha Sharma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 34, rollNo: '2412140100034', name: 'Isha Pandey', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 35, rollNo: '2412140100035', name: 'Sanya Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 36, rollNo: '2412140100036', name: 'Prachi Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 37, rollNo: '2412140100037', name: 'Neelam Verma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 38, rollNo: '2412140100038', name: 'Shreya Singh', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 39, rollNo: '2412140100039', name: 'Bhavna Gupta', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 40, rollNo: '2412140100040', name: 'Payal Tiwari', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Female' },
  { sNo: 41, rollNo: '2412140100041', name: 'Rohit Kumar', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 42, rollNo: '2412140100042', name: 'Kunal Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 43, rollNo: '2412140100043', name: 'Abhishek Singh', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 44, rollNo: '2412140100044', name: 'Harsh Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 45, rollNo: '2412140100045', name: 'Aman Gupta', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 46, rollNo: '2412140100046', name: 'Vikas Sharma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 47, rollNo: '2412140100047', name: 'Yuvraj Verma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 48, rollNo: '2412140100048', name: 'Kartik Pandey', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 49, rollNo: '2412140100049', name: 'Mohit Tiwari', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 50, rollNo: '2412140100050', name: 'Rajeev Mishra', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 51, rollNo: '2412140100051', name: 'Varun Kumar', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 52, rollNo: '2412140100052', name: 'Ashutosh Singh', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 53, rollNo: '2412140100053', name: 'Prashant Yadav', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 54, rollNo: '2412140100054', name: 'Saurabh Gupta', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 55, rollNo: '2412140100055', name: 'Rakesh Sharma', branch: 'Computer Science and Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 56, rollNo: '2412140100056', name: 'Vishnu Verma', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 57, rollNo: '2412140100057', name: 'Abhinav Pandey', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 58, rollNo: '2412140100058', name: 'Lokesh Tiwari', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 59, rollNo: '2412140100059', name: 'Sameer Mishra', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 60, rollNo: '2412140100060', name: 'Rajat Kumar', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 61, rollNo: '2412140100061', name: 'Naveen Singh', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 62, rollNo: '2412140100062', name: 'Gagan Yadav', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 63, rollNo: '2412140100063', name: 'Vishal Gupta', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 64, rollNo: '2412140100064', name: 'Rishabh Sharma', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 65, rollNo: '2412140100065', name: 'Hitesh Verma', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 66, rollNo: '2412140100066', name: 'Akhil Pandey', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 67, rollNo: '2412140100067', name: 'Varun Tiwari', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 68, rollNo: '2412140100068', name: 'Devansh Mishra', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 69, rollNo: '2412140100069', name: 'Raman Kumar', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 70, rollNo: '2412140100070', name: 'Keshav Singh', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 71, rollNo: '2412140100071', name: 'Ravi Yadav', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 72, rollNo: '2412140100072', name: 'Ankit Gupta', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 73, rollNo: '2412140100073', name: 'Suraj Sharma', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 74, rollNo: '2412140100074', name: 'Mukul Verma', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 75, rollNo: '2412140100075', name: 'Parth Pandey', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 76, rollNo: '2412140100076', name: 'Shivam Tiwari', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 77, rollNo: '2412140100077', name: 'Arnav Mishra', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 78, rollNo: '2412140100078', name: 'Naman Kumar', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 79, rollNo: '2412140100079', name: 'Yash Singh', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 80, rollNo: '2412140100080', name: 'Rohan Yadav', branch: 'Electrical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 81, rollNo: '2412140100081', name: 'Amit Gupta', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 82, rollNo: '2412140100082', name: 'Deepanshu Sharma', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 83, rollNo: '2412140100083', name: 'Siddhant Verma', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 84, rollNo: '2412140100084', name: 'Lakshya Pandey', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 85, rollNo: '2412140100085', name: 'Rohit Tiwari', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 86, rollNo: '2412140100086', name: 'Ayush Mishra', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 87, rollNo: '2412140100087', name: 'Karan Kumar', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 88, rollNo: '2412140100088', name: 'Abhay Singh', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 89, rollNo: '2412140100089', name: 'Vansh Yadav', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 90, rollNo: '2412140100090', name: 'Chetan Gupta', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 91, rollNo: '2412140100091', name: 'Arun Sharma', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 92, rollNo: '2412140100092', name: 'Sagar Verma', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 93, rollNo: '2412140100093', name: 'Pratik Pandey', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 94, rollNo: '2412140100094', name: 'Sumit Tiwari', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 95, rollNo: '2412140100095', name: 'Uday Mishra', branch: 'Mechanical Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 96, rollNo: '2412140100096', name: 'Aman Kumar', branch: 'Civil Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 97, rollNo: '2412140100097', name: 'Tarun Singh', branch: 'Civil Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 98, rollNo: '2412140100098', name: 'Mayank Yadav', branch: 'Civil Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 99, rollNo: '2412140100099', name: 'Sumit Pal', branch: 'Civil Engineering', year: '3rd Year', gender: 'Male' },
  { sNo: 100, rollNo: '2412140100100', name: 'Vikas Kumar', branch: 'Civil Engineering', year: '3rd Year', gender: 'Male' },
];

export const generateSubjectsSem5 = (basePerf: number): SubjectMark[] => {
  const meta = [
    { code: 'KCS-501', name: 'Database Management Systems', credits: 4 },
    { code: 'KCS-502', name: 'Compiler Design', credits: 4 },
    { code: 'KCS-503', name: 'Design and Analysis of Algorithms', credits: 4 },
    { code: 'KCS-051', name: 'Computer Networks', credits: 3 },
    { code: 'KCS-551', name: 'DBMS Lab', credits: 2 },
    { code: 'KCS-552', name: 'DAA Lab', credits: 2 },
  ];

  return meta.map((sub, idx) => {
    const variation = ((idx * 7) % 11) - 5;
    const factor = Math.min(92, Math.max(52, basePerf + variation));
    const ct1 = Math.round((factor / 100) * 30 * 0.9);
    const ct2 = Math.round((factor / 100) * 30 * 0.92);
    const assignment = Math.round((factor / 100) * 20 * 0.95);
    const endSem = Math.round((factor / 100) * 100 * 0.88);

    const internalTotal = Math.min(50, Math.round(((ct1 + ct2) / 60) * 30 + assignment));
    const endSemScaled = Math.min(50, Math.round((endSem / 100) * 50));
    const total = Math.min(100, internalTotal + endSemScaled);

    let grade: SubjectMark['grade'] = 'B+';
    let gradePoint = 8;
    if (total >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (total >= 80) { grade = 'A'; gradePoint = 9; }
    else if (total >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (total >= 60) { grade = 'B'; gradePoint = 7; }
    else if (total >= 50) { grade = 'C+'; gradePoint = 6; }
    else if (total >= 40) { grade = 'C'; gradePoint = 5; }
    else { grade = 'F'; gradePoint = 0; }

    return {
      code: sub.code,
      name: sub.name,
      credits: sub.credits,
      classTest1: ct1,
      classTest2: ct2,
      assignment,
      endSem,
      total,
      grade,
      gradePoint,
    };
  });
};

export const generate3rdYearStudents = (): Student[] => {
  // Mapping for 3rd Year Girls into Lehri Hostel (Bed A, Bed B reserved for 1st year)
  const lehriGirlRooms: string[] = [
    'L-101', 'L-102', 'L-103', 'L-104', 'L-105', 'L-106', 'L-107', 'L-108',
    'L-201', 'L-202', 'L-203', 'L-204', 'L-205', 'L-206', 'L-207', 'L-208',
    'L-301', 'L-302', 'L-303', 'L-304', 'L-305', 'L-306'
  ];

  let girlRoomIdx = 0;

  return RAW_THIRD_YEAR_STUDENTS.map((item, idx) => {
    const i = idx + 1;
    const isFemale = item.gender === 'Female';
    const rollNo = item.rollNo;
    const enrollmentNo = `2201214010${String(i).padStart(4, '0')}`;
    const cleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `${cleanName}3rd@mpdrec.ac.in`;
    const phone = `+91 9${(81000000 + i * 2947).toString().slice(0, 9)}`;

    const totalClasses = 100;
    const attendancePercentage = 68 + ((i * 13 + 5) % 28);
    const attendedClasses = Math.round((attendancePercentage / 100) * totalClasses);

    const basePerf = 58 + ((i * 9) % 32);
    const subjects = generateSubjectsSem5(basePerf);
    const totalCreditPoints = subjects.reduce((acc, curr) => acc + (curr.credits * curr.gradePoint), 0);
    const totalCredits = subjects.reduce((acc, curr) => acc + curr.credits, 0);
    const sgpa = Math.min(9.4, Number((totalCreditPoints / totalCredits).toFixed(2)));
    const cgpa = Number((sgpa * 0.97 + (i % 2 === 0 ? 0.05 : -0.05)).toFixed(2));
    const backlogs = subjects.filter(s => s.grade === 'F').length;

    let status: Student['status'] = 'Regular';
    if (cgpa >= 8.5 && attendancePercentage >= 80) status = 'Honours';
    else if (attendancePercentage < 75 || backlogs > 2) status = 'Detained';
    else if (backlogs > 0) status = 'Promoted';

    const totalFees = 55000;
    const paidOptions = [55000, 55000, 27500, 55000, 0];
    const feesPaid = paidOptions[idx % paidOptions.length];
    const balanceFees = totalFees - feesPaid;
    const feeStatus: Student['feeStatus'] = feesPaid === totalFees ? 'Paid' : feesPaid > 0 ? 'Partial' : 'Pending';

    let hostelAllotment: Student['hostelAllotment'];
    if (isFemale && girlRoomIdx < lehriGirlRooms.length) {
      const assignedRoom = lehriGirlRooms[girlRoomIdx++];
      hostelAllotment = {
        hostelName: 'Lehri Hostel',
        roomNo: assignedRoom,
        bed: 'A',
        allottedDate: '2025-08-01',
        roommateNote: 'Roommate Bed B: Vacant (Reserved for 1st Year Freshmen)'
      };
    } else {
      hostelAllotment = {
        hostelName: 'Day Scholar',
        roomNo: '-',
        bed: 'A',
        allottedDate: '-',
      };
    }

    return {
      rollNo,
      enrollmentNo,
      name: item.name,
      gender: item.gender,
      email,
      phone,
      parentName: 'Shri Ram Prakash & Smt. Shanti Devi',
      parentPhone: `+91 9${(72000000 + i * 2119).toString().slice(0, 9)}`,
      branch: item.branch,
      semester: 5,
      currentYear: 3,
      academicSession: '2025-2026',
      section: i <= 50 ? 'A' : 'B',
      admissionYear: 2023,
      category: i % 3 === 0 ? 'OBC' : i % 5 === 0 ? 'SC' : 'General',
      totalClasses,
      attendedClasses,
      attendancePercentage,
      subjects,
      sgpa,
      cgpa,
      backlogs,
      status,
      academicProgressionHistory: [
        { semester: 1, sgpa: Number((sgpa - 0.35).toFixed(2)), promotionDate: '2024-01-20', remarks: 'Cleared 1st Sem' },
        { semester: 2, sgpa: Number((sgpa - 0.20).toFixed(2)), promotionDate: '2024-07-18', remarks: 'Promoted to 2nd Year' },
        { semester: 3, sgpa: Number((sgpa - 0.15).toFixed(2)), promotionDate: '2025-01-20', remarks: 'Cleared 3rd Sem' },
        { semester: 4, sgpa: Number((sgpa - 0.05).toFixed(2)), promotionDate: '2025-07-18', remarks: 'Promoted to 3rd Year' },
      ],
      totalFees,
      feesPaid,
      balanceFees,
      feeStatus,
      scholarshipStatus: i % 5 === 0 ? 'UP Post-Matric Scholarship Sanctioned' : undefined,
      hostelAllotment,
      issuedBooks: [],
      assignedProject: {
        title: 'Microservices & Distributed Database Pipeline',
        mentor: 'Dr Aparna Verma',
        status: 'In Progress'
      }
    };
  });
};
