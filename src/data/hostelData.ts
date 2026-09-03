import { HostelRoom } from '../types/erp';

export interface HostelDetails {
  id: string;
  name: string;
  type: 'Girls Hostel';
  wardenName: string;
  wardenPhone: string;
  wardenEmail: string;
  wardenOffice: string;
  totalRooms: number;
  totalCapacity: number;
  allotmentPolicy: string;
  description: string;
}

export const HOSTEL_PROFILES: Record<string, HostelDetails> = {
  'Saryu Girls Hostel': {
    id: 'saryu-girls',
    name: 'Saryu Girls Hostel',
    type: 'Girls Hostel',
    wardenName: 'Prof. Shivani Verma',
    wardenPhone: '+91 94500 12345',
    wardenEmail: 'warden.saryu@mpdrec.ac.in',
    wardenOffice: 'Ground Floor, Administrative Wing, Saryu Block',
    totalRooms: 30,
    totalCapacity: 60,
    allotmentPolicy: 'Dual Cohort Pairing: 4th Year Senior Scholars paired with 2nd Year Junior Scholars in twin-sharing rooms.',
    description: 'Premier residential facility dedicated to senior and sophomore female scholars of MPD REC Sonbhadra.'
  },
  'Lehri Hostel': {
    id: 'lehri-girls',
    name: 'Lehri Hostel',
    type: 'Girls Hostel',
    wardenName: 'Dr. Aparna Verma',
    wardenPhone: '+91 94500 67890',
    wardenEmail: 'warden.lehri@mpdrec.ac.in',
    wardenOffice: 'Main Gate Block A, Lehri Girls Complex',
    totalRooms: 30,
    totalCapacity: 60,
    allotmentPolicy: 'Dual Cohort Pairing: 3rd Year Scholars (Bed A) paired with 1st Year Freshmen (Bed B). Bed B currently kept vacant/reserved.',
    description: 'Newly commissioned residential complex exclusively for female engineering students under Chief Warden Dr. Aparna Verma.'
  }
};

export const SEED_SARYU_ROOMS: HostelRoom[] = [
  // Floor 1
  {
    id: 'SAR-101',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '101',
    capacity: 2,
    bedA: 'Archana Yadav',
    bedARoll: 'CS-2512140100004',
    bedAYear: '2nd Year',
    bedB: 'Muskan Mishra',
    bedBRoll: '2312140100001',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100004', studentName: 'Archana Yadav', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100001', studentName: 'Muskan Mishra', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-102',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '102',
    capacity: 2,
    bedA: 'Ayushka Yadav',
    bedARoll: 'CS-2512140100008',
    bedAYear: '2nd Year',
    bedB: 'Vaishnavi Pandey',
    bedBRoll: '2312140100006',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100008', studentName: 'Ayushka Yadav', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100006', studentName: 'Vaishnavi Pandey', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-103',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '103',
    capacity: 2,
    bedA: 'Dharmika Gangwar',
    bedARoll: 'CS-2512140100012',
    bedAYear: '2nd Year',
    bedB: 'Manu Tiwari',
    bedBRoll: '2312140100010',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100012', studentName: 'Dharmika Gangwar', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100010', studentName: 'Manu Tiwari', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-104',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '104',
    capacity: 2,
    bedA: 'Diksha Patel',
    bedARoll: 'CS-2512140100014',
    bedAYear: '2nd Year',
    bedB: 'Archita Mishra',
    bedBRoll: '2312140100013',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100014', studentName: 'Diksha Patel', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100013', studentName: 'Archita Mishra', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-105',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '105',
    capacity: 2,
    bedA: 'Jagriti Yadav',
    bedARoll: 'CS-2512140100018',
    bedAYear: '2nd Year',
    bedB: 'Dipali Gupta',
    bedBRoll: '2312140100017',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100018', studentName: 'Jagriti Yadav', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100017', studentName: 'Dipali Gupta', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-106',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '106',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'SAR-107',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '107',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'SAR-108',
    hostelName: 'Saryu Girls Hostel',
    floor: 1,
    roomNo: '108',
    capacity: 2,
    occupiedBeds: []
  },

  // Floor 2
  {
    id: 'SAR-201',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '201',
    capacity: 2,
    bedA: 'Jyoti Vishwakarma',
    bedARoll: 'CS-2512140100021',
    bedAYear: '2nd Year',
    bedB: 'Soumya Yadav',
    bedBRoll: '2312140100019',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100021', studentName: 'Jyoti Vishwakarma', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100019', studentName: 'Soumya Yadav', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-202',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '202',
    capacity: 2,
    bedA: 'Nayansi Niketa',
    bedARoll: 'CS-2512140100025',
    bedAYear: '2nd Year',
    bedB: 'Riya Pathak',
    bedBRoll: '2312140100022',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100025', studentName: 'Nayansi Niketa', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100022', studentName: 'Riya Pathak', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-203',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '203',
    capacity: 2,
    bedA: 'Prashnsa Saxena',
    bedARoll: 'CS-2512140100030',
    bedAYear: '2nd Year',
    bedB: 'Madhukar Shukla',
    bedBRoll: '2312140100024',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100030', studentName: 'Prashnsa Saxena', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100024', studentName: 'Madhukar Shukla', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-204',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '204',
    capacity: 2,
    bedA: 'Umam Shafiq',
    bedARoll: 'CS-2512140100047',
    bedAYear: '2nd Year',
    bedB: 'Kajal Singh',
    bedBRoll: '2312140100025',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: 'CS-2512140100047', studentName: 'Umam Shafiq', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100025', studentName: 'Kajal Singh', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-205',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '205',
    capacity: 2,
    bedA: 'Ratna Priya',
    bedARoll: '2512140100053',
    bedAYear: '2nd Year',
    bedB: 'Aditi Srivastava',
    bedBRoll: '2312140100029',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100053', studentName: 'Ratna Priya', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100029', studentName: 'Aditi Srivastava', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-206',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '206',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'SAR-207',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '207',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'SAR-208',
    hostelName: 'Saryu Girls Hostel',
    floor: 2,
    roomNo: '208',
    capacity: 2,
    occupiedBeds: []
  },

  // Floor 3
  {
    id: 'SAR-301',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '301',
    capacity: 2,
    bedA: 'Roshni Yadav',
    bedARoll: '2512140100055',
    bedAYear: '2nd Year',
    bedB: 'Sneha Verma',
    bedBRoll: '2312140100030',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100055', studentName: 'Roshni Yadav', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100030', studentName: 'Sneha Verma', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-302',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '302',
    capacity: 2,
    bedA: 'Sheenu Singh',
    bedARoll: '2512140100059',
    bedAYear: '2nd Year',
    bedB: 'Shreya Gupta',
    bedBRoll: '2312140100031',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100059', studentName: 'Sheenu Singh', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100031', studentName: 'Shreya Gupta', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-303',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '303',
    capacity: 2,
    bedA: 'Shrishti Pathak',
    bedARoll: '2512140100063',
    bedAYear: '2nd Year',
    bedB: 'Priya Singh',
    bedBRoll: '2312140100032',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100063', studentName: 'Shrishti Pathak', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100032', studentName: 'Priya Singh', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-304',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '304',
    capacity: 2,
    bedA: 'Srishti',
    bedARoll: '2512140100067',
    bedAYear: '2nd Year',
    bedB: 'Nandini Sharma',
    bedBRoll: '2312140100033',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100067', studentName: 'Srishti', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100033', studentName: 'Nandini Sharma', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-305',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '305',
    capacity: 2,
    bedA: 'Ankita Tripathi',
    bedARoll: '2512140100078',
    bedAYear: '2nd Year',
    bedB: 'Ishita Tiwari',
    bedBRoll: '2312140100034',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2512140100078', studentName: 'Ankita Tripathi', studentYear: '2nd Year' },
      { bed: 'B', studentRollNo: '2312140100034', studentName: 'Ishita Tiwari', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-306',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '306',
    capacity: 2,
    bedA: 'Simran Yadav',
    bedARoll: '2312140100035',
    bedAYear: '4th Year',
    bedB: 'Neha Mishra',
    bedBRoll: '2312140100036',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100035', studentName: 'Simran Yadav', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100036', studentName: 'Neha Mishra', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-307',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '307',
    capacity: 2,
    bedA: 'Pallavi Agarwal',
    bedARoll: '2312140100037',
    bedAYear: '4th Year',
    bedB: 'Ritika Shukla',
    bedBRoll: '2312140100038',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100037', studentName: 'Pallavi Agarwal', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100038', studentName: 'Ritika Shukla', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-308',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '308',
    capacity: 2,
    bedA: 'Sakshi Tripathi',
    bedARoll: '2312140100039',
    bedAYear: '4th Year',
    bedB: 'Kritika Pandey',
    bedBRoll: '2312140100040',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100039', studentName: 'Sakshi Tripathi', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100040', studentName: 'Kritika Pandey', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-309',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '309',
    capacity: 2,
    bedA: 'Pooja Chauhan',
    bedARoll: '2312140100041',
    bedAYear: '4th Year',
    bedB: 'Nisha Srivastava',
    bedBRoll: '2312140100042',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100041', studentName: 'Pooja Chauhan', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100042', studentName: 'Nisha Srivastava', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-310',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '310',
    capacity: 2,
    bedA: 'Megha Verma',
    bedARoll: '2312140100043',
    bedAYear: '4th Year',
    bedB: 'Roshni Gupta',
    bedBRoll: '2312140100044',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100043', studentName: 'Megha Verma', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100044', studentName: 'Roshni Gupta', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-311',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '311',
    capacity: 2,
    bedA: 'Anjali Maurya',
    bedARoll: '2312140100045',
    bedAYear: '4th Year',
    bedB: 'Shivani Patel',
    bedBRoll: '2312140100046',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100045', studentName: 'Anjali Maurya', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100046', studentName: 'Shivani Patel', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-312',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '312',
    capacity: 2,
    bedA: 'Komal Singh',
    bedARoll: '2312140100047',
    bedAYear: '4th Year',
    bedB: 'Tanvi Saxena',
    bedBRoll: '2312140100048',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100047', studentName: 'Komal Singh', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100048', studentName: 'Tanvi Saxena', studentYear: '4th Year' }
    ]
  },
  {
    id: 'SAR-313',
    hostelName: 'Saryu Girls Hostel',
    floor: 3,
    roomNo: '313',
    capacity: 2,
    bedA: 'Preeti Yadav',
    bedARoll: '2312140100049',
    bedAYear: '4th Year',
    bedB: 'Riya Sharma',
    bedBRoll: '2312140100050',
    bedBYear: '4th Year',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2312140100049', studentName: 'Preeti Yadav', studentYear: '4th Year' },
      { bed: 'B', studentRollNo: '2312140100050', studentName: 'Riya Sharma', studentYear: '4th Year' }
    ]
  }
];

export const SEED_LEHRI_ROOMS: HostelRoom[] = [
  // Floor 1
  {
    id: 'LEH-101',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-101',
    capacity: 2,
    bedA: 'Poonam Mishra',
    bedARoll: '2412140100001',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100001', studentName: 'Poonam Mishra', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-102',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-102',
    capacity: 2,
    bedA: 'Kavya Tiwari',
    bedARoll: '2412140100004',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100004', studentName: 'Kavya Tiwari', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-103',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-103',
    capacity: 2,
    bedA: 'Anuradha Yadav',
    bedARoll: '2412140100005',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100005', studentName: 'Anuradha Yadav', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-104',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-104',
    capacity: 2,
    bedA: 'Ritu Ranjan',
    bedARoll: '2412140100009',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100009', studentName: 'Ritu Ranjan', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-105',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-105',
    capacity: 2,
    bedA: 'Manisha Tiwari',
    bedARoll: '2412140100010',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100010', studentName: 'Manisha Tiwari', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-106',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-106',
    capacity: 2,
    bedA: 'Aarohi Mishra',
    bedARoll: '2412140100013',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100013', studentName: 'Aarohi Mishra', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-107',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-107',
    capacity: 2,
    bedA: 'Divya Gupta',
    bedARoll: '2412140100017',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100017', studentName: 'Divya Gupta', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-108',
    hostelName: 'Lehri Hostel',
    floor: 1,
    roomNo: 'L-108',
    capacity: 2,
    bedA: 'Shalini Yadav',
    bedARoll: '2412140100019',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100019', studentName: 'Shalini Yadav', studentYear: '3rd Year' }
    ]
  },

  // Floor 2
  {
    id: 'LEH-201',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-201',
    capacity: 2,
    bedA: 'Nidhi Pathak',
    bedARoll: '2412140100022',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100022', studentName: 'Nidhi Pathak', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-202',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-202',
    capacity: 2,
    bedA: 'Kiran Singh',
    bedARoll: '2412140100025',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100025', studentName: 'Kiran Singh', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-203',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-203',
    capacity: 2,
    bedA: 'Srishti Srivastava',
    bedARoll: '2412140100029',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100029', studentName: 'Srishti Srivastava', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-204',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-204',
    capacity: 2,
    bedA: 'Kashish Verma',
    bedARoll: '2412140100030',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100030', studentName: 'Kashish Verma', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-205',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-205',
    capacity: 2,
    bedA: 'Riya Gupta',
    bedARoll: '2412140100031',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100031', studentName: 'Riya Gupta', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-206',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-206',
    capacity: 2,
    bedA: 'Muskan Singh',
    bedARoll: '2412140100032',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100032', studentName: 'Muskan Singh', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-207',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-207',
    capacity: 2,
    bedA: 'Akanksha Sharma',
    bedARoll: '2412140100033',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100033', studentName: 'Akanksha Sharma', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-208',
    hostelName: 'Lehri Hostel',
    floor: 2,
    roomNo: 'L-208',
    capacity: 2,
    bedA: 'Isha Pandey',
    bedARoll: '2412140100034',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100034', studentName: 'Isha Pandey', studentYear: '3rd Year' }
    ]
  },

  // Floor 3
  {
    id: 'LEH-301',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-301',
    capacity: 2,
    bedA: 'Sanya Yadav',
    bedARoll: '2412140100035',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100035', studentName: 'Sanya Yadav', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-302',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-302',
    capacity: 2,
    bedA: 'Prachi Mishra',
    bedARoll: '2412140100036',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100036', studentName: 'Prachi Mishra', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-303',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-303',
    capacity: 2,
    bedA: 'Neelam Verma',
    bedARoll: '2412140100037',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100037', studentName: 'Neelam Verma', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-304',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-304',
    capacity: 2,
    bedA: 'Shreya Singh',
    bedARoll: '2412140100038',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100038', studentName: 'Shreya Singh', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-305',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-305',
    capacity: 2,
    bedA: 'Bhavna Gupta',
    bedARoll: '2412140100039',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100039', studentName: 'Bhavna Gupta', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-306',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-306',
    capacity: 2,
    bedA: 'Payal Tiwari',
    bedARoll: '2412140100040',
    bedAYear: '3rd Year',
    bedBReservedNote: 'Reserved for 1st Year (Vacant)',
    occupiedBeds: [
      { bed: 'A', studentRollNo: '2412140100040', studentName: 'Payal Tiwari', studentYear: '3rd Year' }
    ]
  },
  {
    id: 'LEH-307',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-307',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-308',
    hostelName: 'Lehri Hostel',
    floor: 3,
    roomNo: 'L-308',
    capacity: 2,
    occupiedBeds: []
  },

  // Floor 4
  {
    id: 'LEH-401',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-401',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-402',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-402',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-403',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-403',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-404',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-404',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-405',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-405',
    capacity: 2,
    occupiedBeds: []
  },
  {
    id: 'LEH-406',
    hostelName: 'Lehri Hostel',
    floor: 4,
    roomNo: 'L-406',
    capacity: 2,
    occupiedBeds: []
  }
];

export const ALL_SEED_HOSTEL_ROOMS: HostelRoom[] = [
  ...SEED_SARYU_ROOMS,
  ...SEED_LEHRI_ROOMS
];
