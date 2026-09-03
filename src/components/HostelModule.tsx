import React, { useState } from 'react';
import { 
  Building, 
  Bed, 
  Users, 
  CheckCircle2, 
  Search, 
  Plus, 
  ArrowRight, 
  UserCheck, 
  X, 
  LogOut,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Info,
  Lock,
  GraduationCap,
  Filter,
  Layers,
  Check
} from 'lucide-react';
import { HostelRoom, Student, AuthSession } from '../types/erp';
import { HOSTEL_PROFILES } from '../data/hostelData';

interface HostelModuleProps {
  rooms: HostelRoom[];
  students: Student[];
  onUpdateRooms: (rooms: HostelRoom[]) => void;
  onUpdateStudent: (student: Student) => void;
  session: AuthSession;
}

export const HostelModule: React.FC<HostelModuleProps> = ({
  rooms,
  students,
  onUpdateRooms,
  onUpdateStudent,
  session,
}) => {
  const [selectedHostel, setSelectedHostel] = useState<'all' | 'Saryu Girls Hostel' | 'Lehri Hostel'>('all');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'available' | 'reserved'>('all');
  
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [selectedBed, setSelectedBed] = useState<'A' | 'B'>('A');
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  // Female students eligible for hostel
  const femaleStudents = students.filter(s => s.gender === 'Female');
  const [targetStudentRoll, setTargetStudentRoll] = useState<string>(femaleStudents[0]?.rollNo || '');

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    const matchHostel = selectedHostel === 'all' || r.hostelName === selectedHostel;
    const matchFloor = selectedFloor === 'all' || r.floor === selectedFloor;
    
    const bedAName = r.bedA || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'A')?.studentName) || '';
    const bedARoll = r.bedARoll || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'A')?.studentRollNo) || '';
    const bedBName = r.bedB || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'B')?.studentName) || '';
    const bedBRoll = r.bedBRoll || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'B')?.studentRollNo) || '';

    const matchSearch = searchQuery === '' || 
      r.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hostelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bedAName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bedARoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bedBName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bedBRoll.toLowerCase().includes(searchQuery.toLowerCase());

    const isBedAOccupied = !!bedAName;
    const isBedBOccupied = !!bedBName;
    const isBedBReserved = !isBedBOccupied && (!!r.bedBReservedNote || r.hostelName === 'Lehri Hostel');

    let matchStatus = true;
    if (statusFilter === 'full') {
      matchStatus = isBedAOccupied && isBedBOccupied;
    } else if (statusFilter === 'available') {
      matchStatus = !isBedAOccupied || (!isBedBOccupied && !isBedBReserved);
    } else if (statusFilter === 'reserved') {
      matchStatus = isBedBReserved;
    }

    return matchHostel && matchFloor && matchSearch && matchStatus;
  });

  // Calculate Metrics based on selected hostel or aggregate
  const relevantRooms = selectedHostel === 'all' ? rooms : rooms.filter(r => r.hostelName === selectedHostel);
  const totalBeds = relevantRooms.length * 2;
  const occupiedBeds = relevantRooms.reduce((sum, r) => {
    const bA = r.bedA || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'A')?.studentName);
    const bB = r.bedB || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'B')?.studentName);
    return sum + (bA ? 1 : 0) + (bB ? 1 : 0);
  }, 0);

  const reservedBeds = relevantRooms.reduce((sum, r) => {
    const bB = r.bedB || (r.occupiedBeds && r.occupiedBeds.find(b => b.bed === 'B')?.studentName);
    return sum + (!bB && (!!r.bedBReservedNote || r.hostelName === 'Lehri Hostel') ? 1 : 0);
  }, 0);

  const vacantAvailableBeds = totalBeds - occupiedBeds - reservedBeds;

  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const student = students.find(s => s.rollNo === targetStudentRoll);
    if (!student) return;

    const studentYearLabel = student.currentYear ? `${student.currentYear}${student.currentYear === 1 ? 'st' : student.currentYear === 2 ? 'nd' : student.currentYear === 3 ? 'rd' : 'th'} Year` : `Sem ${student.semester}`;

    const updatedRooms = rooms.map(r => {
      if (r.id === selectedRoom.id) {
        return {
          ...r,
          bedA: selectedBed === 'A' ? student.name : r.bedA,
          bedARoll: selectedBed === 'A' ? student.rollNo : r.bedARoll,
          bedAYear: selectedBed === 'A' ? studentYearLabel : r.bedAYear,
          bedB: selectedBed === 'B' ? student.name : r.bedB,
          bedBRoll: selectedBed === 'B' ? student.rollNo : r.bedBRoll,
          bedBYear: selectedBed === 'B' ? studentYearLabel : r.bedBYear,
          bedBReservedNote: selectedBed === 'B' ? undefined : r.bedBReservedNote,
        };
      }
      return r;
    });

    const updatedStudent: Student = {
      ...student,
      hostelAllotment: {
        hostelName: selectedRoom.hostelName as any,
        roomNo: selectedRoom.roomNo,
        bed: selectedBed,
        allottedDate: new Date().toISOString().split('T')[0],
        roommateNote: selectedRoom.hostelName === 'Lehri Hostel' 
          ? 'Roommate Bed B: Vacant (Reserved for 1st Year Freshmen)'
          : selectedBed === 'A' ? `Roommate Bed B: 4th Year Senior` : `Roommate Bed A: 2nd Year Junior`
      }
    };

    onUpdateRooms(updatedRooms);
    onUpdateStudent(updatedStudent);
    setShowAllocateModal(false);
  };

  const handleVacateBed = (room: HostelRoom, bed: 'A' | 'B') => {
    const rollNo = bed === 'A' ? (room.bedARoll || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'A')?.studentRollNo)) : (room.bedBRoll || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'B')?.studentRollNo));
    const student = students.find(s => s.rollNo === rollNo);

    const isLehri = room.hostelName === 'Lehri Hostel';

    const updatedRooms = rooms.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          bedA: bed === 'A' ? undefined : r.bedA,
          bedARoll: bed === 'A' ? undefined : r.bedARoll,
          bedAYear: bed === 'A' ? undefined : r.bedAYear,
          bedB: bed === 'B' ? undefined : r.bedB,
          bedBRoll: bed === 'B' ? undefined : r.bedBRoll,
          bedBYear: bed === 'B' ? (isLehri ? '1st Year' : undefined) : r.bedBYear,
          bedBReservedNote: bed === 'B' && isLehri ? 'Reserved for 1st Year Freshmen (Vacant)' : (bed === 'B' ? undefined : r.bedBReservedNote),
        };
      }
      return r;
    });

    if (student) {
      const updatedStudent: Student = {
        ...student,
        hostelAllotment: {
          hostelName: 'Day Scholar',
          roomNo: '-',
          bed: 'A',
          allottedDate: '-'
        }
      };
      onUpdateStudent(updatedStudent);
    }

    onUpdateRooms(updatedRooms);
  };

  const isStaffOrAdmin = session.role === 'admin' || session.role === 'staff' || session.role === 'faculty';

  return (
    <div className="space-y-6" id="hostel-management-view">
      
      {/* HOSTEL NAV TABS & WARDEN OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-2 border border-purple-200 dark:border-purple-800">
              <Building className="w-3.5 h-3.5" /> MPDREC Girls Residential Infrastructure • Dual Hostel Wings
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Hostel Accommodation & Bed Allotment Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              On-campus residential facilities are exclusively provided for female engineering scholars. Male scholars reside as registered Day Scholars.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>24x7 Female Security Guard Post, CCTV & Biometric Register</span>
          </div>
        </div>

        {/* Hostel Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* ALL HOSTELS TAB */}
          <button
            onClick={() => setSelectedHostel('all')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedHostel === 'all'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedHostel === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                Combined Campus View
              </span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-sm sm:text-base">All Hostels Overview</div>
            <div className={`text-xs mt-1 font-medium ${selectedHostel === 'all' ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'}`}>
              Saryu Girls Hostel & Lehri Hostel (60 Dual-Bed Rooms)
            </div>
          </button>

          {/* SARYU GIRLS HOSTEL TAB */}
          <button
            onClick={() => setSelectedHostel('Saryu Girls Hostel')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedHostel === 'Saryu Girls Hostel'
                ? 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-700/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedHostel === 'Saryu Girls Hostel' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
              }`}>
                Warden: Prof. Shivani Verma
              </span>
              <Building className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-sm sm:text-base">Saryu Girls Hostel</div>
            <div className={`text-xs mt-1 font-medium ${selectedHostel === 'Saryu Girls Hostel' ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'}`}>
              4th Year Seniors paired with 2nd Year Juniors
            </div>
          </button>

          {/* LEHRI HOSTEL TAB */}
          <button
            onClick={() => setSelectedHostel('Lehri Hostel')}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
              selectedHostel === 'Lehri Hostel'
                ? 'bg-pink-700 text-white border-pink-700 shadow-md shadow-pink-700/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-pink-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedHostel === 'Lehri Hostel' ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300'
              }`}>
                Warden: Aparna Verma
              </span>
              <Building className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-sm sm:text-base">Lehri Hostel</div>
            <div className={`text-xs mt-1 font-medium ${selectedHostel === 'Lehri Hostel' ? 'text-pink-100' : 'text-slate-500 dark:text-slate-400'}`}>
              3rd Year Scholars (Bed A) • 1st Year Beds Reserved (Vacant)
            </div>
          </button>

        </div>

        {/* WARDEN CARDS & ALLOTMENT POLICY BANNER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Saryu Girls Hostel Warden Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            selectedHostel === 'Saryu Girls Hostel' || selectedHostel === 'all'
              ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80'
              : 'opacity-60 bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                SV
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    Prof. Shivani Verma
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                    Saryu Warden
                  </span>
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-300 font-semibold mt-0.5">
                  Chief Warden • Saryu Girls Hostel Block
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-500" /> warden.saryu@mpdrec.ac.in</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-purple-500" /> +91 94500 12345</span>
                </div>
                <div className="mt-2.5 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-purple-200/60 dark:border-purple-800/50 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <span className="font-bold text-purple-900 dark:text-purple-200">Allotment Rule: </span> 
                  4th Year senior female scholars are paired with 2nd Year sophomore scholars in twin-sharing rooms for peer mentorship.
                </div>
              </div>
            </div>
          </div>

          {/* Lehri Hostel Warden Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            selectedHostel === 'Lehri Hostel' || selectedHostel === 'all'
              ? 'bg-pink-50/70 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/80'
              : 'opacity-60 bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                AV
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    Aparna Verma
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-900 text-pink-900 dark:text-pink-200">
                    Lehri Warden
                  </span>
                </div>
                <div className="text-xs text-pink-800 dark:text-pink-300 font-semibold mt-0.5">
                  Chief Warden • Lehri Hostel (Girls Shelter Only)
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-pink-500" /> warden.lehri@mpdrec.ac.in</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-pink-500" /> +91 94500 67890</span>
                </div>
                <div className="mt-2.5 p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-pink-200/60 dark:border-pink-800/50 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <span className="font-bold text-pink-900 dark:text-pink-200">Allotment Rule: </span> 
                  3rd Year female scholars occupy Bed A; Bed B is strictly kept vacant and reserved for incoming 1st Year freshmen girls.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* METRICS SUMMARY DECK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* TOTAL BEDS */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">Total Resident Beds</span>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">{totalBeds}</div>
              <div className="text-[11px] text-slate-500">{relevantRooms.length} Dual Rooms</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
              <Bed className="w-5 h-5" />
            </div>
          </div>

          {/* OCCUPIED BEDS */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-teal-700 dark:text-teal-300">Active Residents</span>
              <div className="text-2xl font-black text-teal-900 dark:text-teal-100 font-mono mt-0.5">{occupiedBeds}</div>
              <div className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                {Math.round((occupiedBeds / (totalBeds || 1)) * 100)}% Occupancy
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* RESERVED FOR 1ST YEAR */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">1st Year Beds Reserved</span>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-100 font-mono mt-0.5">{reservedBeds}</div>
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                Kept Vacant for Freshmen
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* OPEN VACANCIES */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300">Open Vacancies</span>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-100 font-mono mt-0.5">{vacantAvailableBeds}</div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                Immediate Allotment Available
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Room Number, Student Name, Roll No..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Floor Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 1, 2, 3] as const).map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedFloor === floor
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Room Statuses</option>
              <option value="full">Fully Occupied</option>
              <option value="reserved">Has Reserved 1st Year Bed</option>
              <option value="available">Has Vacant Bed</option>
            </select>
          </div>

        </div>

      </div>

      {/* ROOMS MATRIX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const isLehri = room.hostelName === 'Lehri Hostel';

          const bedAName = room.bedA || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'A')?.studentName);
          const bedARoll = room.bedARoll || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'A')?.studentRollNo);
          const bedAYear = room.bedAYear || (isLehri ? '3rd Year' : '2nd Year');
          const isBedAOccupied = !!bedAName;

          const bedBName = room.bedB || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'B')?.studentName);
          const bedBRoll = room.bedBRoll || (room.occupiedBeds && room.occupiedBeds.find(b => b.bed === 'B')?.studentRollNo);
          const bedBYear = room.bedBYear || (isLehri ? '1st Year' : '4th Year');
          const isBedBOccupied = !!bedBName;

          const isBedBReserved = !isBedBOccupied && (isLehri || !!room.bedBReservedNote);

          return (
            <div
              key={room.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm space-y-4 transition-all ${
                isLehri 
                  ? 'border-pink-200/80 dark:border-pink-900/50 hover:border-pink-500' 
                  : 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-500'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                      Room {room.roomNo}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      isLehri 
                        ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {room.hostelName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Floor {room.floor} • Dual Bed Occupancy
                  </span>
                </div>

                <div className="text-right">
                  {isBedAOccupied && isBedBOccupied ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Fully Occupied
                    </span>
                  ) : isBedBReserved ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      1 Bed Reserved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      1 Bed Left
                    </span>
                  )}
                </div>
              </div>

              {/* BED A DETAILS */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isBedAOccupied
                  ? isLehri 
                    ? 'bg-pink-50/70 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/80 shadow-xs'
                    : 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/80 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 border-dashed'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isBedAOccupied 
                      ? isLehri ? 'bg-pink-600 text-white shadow-sm' : 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    A
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs truncate ${
                        isBedAOccupied ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 italic'
                      }`}>
                        {bedAName || 'Vacant Bed A'}
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {bedAYear}
                      </span>
                    </div>
                    {isBedAOccupied ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                          {bedARoll}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Eligible for {isLehri ? '3rd Year Female Scholar' : '2nd Year Female Scholar'}
                      </div>
                    )}
                  </div>
                </div>

                {isStaffOrAdmin && (
                  <div className="shrink-0">
                    {isBedAOccupied ? (
                      <button
                        onClick={() => handleVacateBed(room, 'A')}
                        className="px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg border border-rose-200 dark:border-rose-800 transition-all"
                        title="Vacate Bed A"
                      >
                        Vacate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setSelectedBed('A');
                          setShowAllocateModal(true);
                        }}
                        className={`px-2.5 py-1 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all ${
                          isLehri ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        Allot Bed
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* BED B DETAILS */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isBedBOccupied
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                  : isBedBReserved
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/70'
                  : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 border-dashed'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isBedBOccupied 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : isBedBReserved
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isBedBReserved && !isBedBOccupied ? <Lock className="w-3.5 h-3.5" /> : 'B'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs truncate ${
                        isBedBOccupied 
                          ? 'text-slate-900 dark:text-slate-100' 
                          : isBedBReserved 
                          ? 'text-amber-900 dark:text-amber-200' 
                          : 'text-slate-500 italic'
                      }`}>
                        {bedBName || (isBedBReserved ? 'Reserved for 1st Year' : 'Vacant Bed B')}
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {bedBYear}
                      </span>
                    </div>

                    {isBedBOccupied ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                          {bedBRoll}
                        </span>
                      </div>
                    ) : isBedBReserved ? (
                      <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium mt-0.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 shrink-0" /> Kept Vacant for 1st Year Freshmen Extraction
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Eligible for 4th Year Senior Female Scholar
                      </div>
                    )}
                  </div>
                </div>

                {isStaffOrAdmin && (
                  <div className="shrink-0">
                    {isBedBOccupied ? (
                      <button
                        onClick={() => handleVacateBed(room, 'B')}
                        className="px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg border border-rose-200 dark:border-rose-800 transition-all"
                        title="Vacate Bed B"
                      >
                        Vacate
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setSelectedBed('B');
                          setShowAllocateModal(true);
                        }}
                        className={`px-2.5 py-1 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all ${
                          isBedBReserved ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isBedBReserved ? 'Override Allot' : 'Allot Bed'}
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Building className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching hostel rooms found</h4>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search keyword or changing the floor / hostel filter.</p>
        </div>
      )}

      {/* ALLOCATE BED MODAL */}
      {showAllocateModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Allot Bed in {selectedRoom.hostelName}
              </h3>
              <button 
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs font-semibold mb-3 text-purple-700 dark:text-purple-300">
              {selectedRoom.hostelName} • Room {selectedRoom.roomNo} (Bed {selectedBed})
            </p>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
              <span>
                {selectedRoom.hostelName === 'Lehri Hostel'
                  ? 'Supervised by Warden Aparna Verma. Bed A is designated for 3rd Year scholars; Bed B is reserved for 1st Year Freshmen.'
                  : 'Supervised by Warden Shivani Verma. Dual Cohort pairing: 4th Year Senior paired with 2nd Year Junior.'}
              </span>
            </div>
            
            <form onSubmit={handleAllocateBed} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">Select Female Student</label>
                <select
                  value={targetStudentRoll}
                  onChange={(e) => setTargetStudentRoll(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200"
                >
                  {femaleStudents.map(s => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.rollNo} - {s.name} ({s.currentYear || Math.ceil(s.semester/2)}th Year, Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAllocateModal(false)} 
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Confirm Bed Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
