import { Student, Faculty, Notice, TimetableSlot, SubjectCourseDetail, LibraryBook, HostelRoom, StudyMaterial, PeerChatMessage, AcademicTermMilestone, AuthSession, GalleryItem, CampusEvent } from '../types/erp';
import { HubChat, HubMessage, HubUserProfile } from '../types/hub';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem, CouncilId } from '../types/councils';
import { ThemeMode, ColorPaletteId } from '../types/theme';
import { SEED_ADMIN, SEED_FACULTY, SEED_STAFF, generate50Students, compileStudentSemesterResults, SEED_NOTICES, SEED_TIMETABLE, SEED_COURSE_DETAILS, SEED_BOOKS, SEED_HOSTEL_ROOMS, SEED_STUDY_MATERIALS, SEED_PEER_CHAT, SEED_TERM_MILESTONES, SEED_GALLERY_ITEMS, SEED_CAMPUS_EVENTS } from '../data/seedData';
import { INITIAL_HUB_CHATS, INITIAL_HUB_MESSAGES, DEFAULT_USER_PROFILE } from '../data/hubSeedData';
import { SEED_COUNCILS, SEED_COUNCIL_EVENTS, SEED_COUNCIL_MEDIA } from '../data/councilsData';
import { supabaseSyncService } from './supabaseSyncService';

const STORAGE_KEYS = {
  SESSION: 'mpdrec_session_v14',
  STUDENTS: 'mpdrec_students_v18',
  FACULTY: 'mpdrec_faculty_v25',
  NOTICES: 'mpdrec_notices_v21',
  TIMETABLE: 'mpdrec_timetable_v25',
  COURSE_DETAILS: 'mpdrec_courses_v25',
  BOOKS: 'mpdrec_books_v14',
  HOSTEL: 'mpdrec_hostel_v18',
  MATERIALS: 'mpdrec_materials_v14',
  CHAT: 'mpdrec_chat_v14',
  MILESTONES: 'mpdrec_milestones_v14',
  GALLERY: 'mpdrec_gallery_v21',
  EVENTS: 'mpdrec_events_v21',
  THEME: 'mpdrec_theme_v1',
  HERO_VIDEO: 'mpdrec_campus_video_v21',
  HERO_VIDEO_NAME: 'mpdrec_campus_video_name_v21',
  HERO_VIDEO_POSTER: 'mpdrec_campus_video_poster_v21',
  HUB_CHATS: 'mpdrec_hub_chats_v4',
  HUB_MESSAGES: 'mpdrec_hub_messages_v4',
  HUB_PROFILES: 'mpdrec_hub_profiles_v3',
  PUBLIC_KEYS: 'mpdrec_e2ee_public_keys_v1',
  NOTIFICATIONS: 'mpdrec_notifications_v1',
  COUNCILS: 'mpdrec_councils_v10',
  COUNCIL_EVENTS: 'mpdrec_council_events_v21',
  COUNCIL_MEDIA: 'mpdrec_council_media_v21',
  CUSTOM_LOGOS: 'mpdrec_council_logos_custom_v1',
};

// Standard deterministic conversation key generator for 1-on-1 direct conversations
export function getConversationKey(userId1: string, userId2: string): string {
  const u1 = (userId1 || '').trim();
  const u2 = (userId2 || '').trim();
  return [u1, u2].sort().join('_');
}

class StorageService {
  private get<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        this.set(key, defaultVal);
        return defaultVal;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // In-memory session representation (mitigating client-side persistent token storage)
  private inMemorySession: AuthSession = {
    role: 'guest',
    userId: 'GUEST-001',
    name: 'Public Visitor',
    email: 'visitor@mpdrec.ac.in',
  };

  // Session Management (No sensitive tokens or secrets stored in localStorage)
  getSession(): AuthSession {
    return this.inMemorySession;
  }

  setSession(session: AuthSession): void {
    this.inMemorySession = session;
    // Defensively remove any legacy sensitive token storage
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {}
  }

  saveSession(session: AuthSession): void {
    this.setSession(session);
  }

  clearSession(): void {
    this.inMemorySession = {
      role: 'guest',
      userId: 'GUEST-001',
      name: 'Public Visitor',
      email: 'visitor@mpdrec.ac.in',
    };
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {}
  }

  logout(): AuthSession {
    this.clearSession();
    return this.getSession();
  }

  // Students
  getStudents(): Student[] {
    let list = this.get<Student[]>(STORAGE_KEYS.STUDENTS, generate50Students());
    // Auto-migrate if stored student count is less than seed count
    const defaultList = generate50Students();
    if (list.length < defaultList.length) {
      const existingRolls = new Set(list.map(s => s.rollNo.toLowerCase()));
      const missing = defaultList.filter(s => !existingRolls.has(s.rollNo.toLowerCase()));
      list = [...list, ...missing];
      this.saveStudents(list);
    }
    return list.map(s => {
      // If student is male, they are always Day Scholar as hostel is only available for girls
      if (s.gender === 'Male') {
        s.hostelAllotment = {
          hostelName: 'Day Scholar',
          roomNo: '-',
          bed: 'A',
          allottedDate: '-'
        };
      } else if (!s.hostelAllotment || !s.hostelAllotment.hostelName) {
        // Default female hostel based on year: 3rd year -> Lehri Hostel, 2nd & 4th year -> Saryu Girls Hostel
        if (s.semester === 5 || s.currentYear === 3) {
          s.hostelAllotment = {
            hostelName: 'Lehri Hostel',
            roomNo: 'L-101',
            bed: 'A',
            allottedDate: '2025-08-01',
            roommateNote: 'Roommate Bed B: Vacant (Reserved for 1st Year Freshmen)'
          };
        } else {
          s.hostelAllotment = {
            hostelName: 'Saryu Girls Hostel',
            roomNo: '101',
            bed: 'A',
            allottedDate: '2025-08-01'
          };
        }
      }

      if (!s.currentYear) {
        s.currentYear = Math.ceil((s.semester || 3) / 2);
      }
      if (!s.academicSession) {
        s.academicSession = '2025-2026';
      }
      if (!s.semesterResults || s.semesterResults.length === 0) {
        s.semesterResults = compileStudentSemesterResults(70, s.subjects || [], s.sgpa || 7.5, s.cgpa || 7.5);
      }

      return s;
    });
  }

  saveStudents(students: Student[]): void {
    this.set(STORAGE_KEYS.STUDENTS, students);
  }

  getStudentByRollNo(rollNo: string): Student | undefined {
    const students = this.getStudents();
    const cleaned = (rollNo || '').trim().toLowerCase();
    const pureNumeric = cleaned.replace(/[^0-9]/g, '');
    return students.find(s => {
      const sRoll = s.rollNo.toLowerCase();
      const sPureNumeric = sRoll.replace(/[^0-9]/g, '');
      return sRoll === cleaned || (pureNumeric.length >= 5 && sPureNumeric === pureNumeric) || s.enrollmentNo.toLowerCase() === cleaned;
    });
  }

  updateStudent(updatedStudent: Student): void {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.rollNo === updatedStudent.rollNo);
    if (idx !== -1) {
      students[idx] = updatedStudent;
      this.saveStudents(students);
      supabaseSyncService.saveStudentToCloud(updatedStudent);
    }
  }

  addStudent(student: Student): void {
    const students = this.getStudents();
    students.unshift(student);
    this.saveStudents(students);
    supabaseSyncService.saveStudentToCloud(student);
  }

  deleteStudent(rollNo: string): void {
    const students = this.getStudents();
    const filtered = students.filter(s => s.rollNo !== rollNo);
    this.saveStudents(filtered);
    supabaseSyncService.deleteStudentFromCloud(rollNo);
  }

  upgradeStudentSemester(rollNo: string, newSemester: number, remarks: string): Student | undefined {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.rollNo === rollNo);
    if (idx === -1) return undefined;

    const student = students[idx];
    const prevSem = student.semester;
    student.semester = newSemester;
    student.status = 'Regular';
    student.academicProgressionHistory.push({
      semester: prevSem,
      sgpa: student.sgpa,
      promotionDate: new Date().toISOString().split('T')[0],
      remarks: remarks || `Successfully promoted from Semester ${prevSem} to Semester ${newSemester}`
    });

    students[idx] = student;
    this.saveStudents(students);
    return student;
  }

  // Faculty
  getFaculty(): Faculty[] {
    return this.get<Faculty[]>(STORAGE_KEYS.FACULTY, SEED_FACULTY);
  }

  saveFaculty(faculty: Faculty[]): void {
    this.set(STORAGE_KEYS.FACULTY, faculty);
  }

  updateFaculty(updated: Faculty): void {
    const list = this.getFaculty();
    const idx = list.findIndex(f => f.facultyId === updated.facultyId);
    if (idx !== -1) {
      list[idx] = updated;
      this.saveFaculty(list);
      supabaseSyncService.saveFacultyToCloud(updated);
    }
  }

  // Notices
  getNotices(): Notice[] {
    return this.get<Notice[]>(STORAGE_KEYS.NOTICES, SEED_NOTICES);
  }

  saveNotices(notices: Notice[]): void {
    this.set(STORAGE_KEYS.NOTICES, notices);
  }

  addNotice(notice: Notice): void {
    const notices = this.getNotices();
    notices.unshift(notice);
    this.saveNotices(notices);
    supabaseSyncService.saveNoticeToCloud(notice);
  }

  deleteNotice(id: string): void {
    const notices = this.getNotices();
    this.saveNotices(notices.filter(n => n.id !== id));
    supabaseSyncService.deleteNoticeFromCloud(id);
  }

  // Timetable & Courses
  getTimetable(): TimetableSlot[] {
    return this.get<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE);
  }

  saveTimetable(slots: TimetableSlot[]): void {
    this.set(STORAGE_KEYS.TIMETABLE, slots);
  }

  getCourseDetails(): SubjectCourseDetail[] {
    return this.get<SubjectCourseDetail[]>(STORAGE_KEYS.COURSE_DETAILS, SEED_COURSE_DETAILS);
  }

  saveCourseDetails(courses: SubjectCourseDetail[]): void {
    this.set(STORAGE_KEYS.COURSE_DETAILS, courses);
  }

  // Library
  getBooks(): LibraryBook[] {
    return this.get<LibraryBook[]>(STORAGE_KEYS.BOOKS, SEED_BOOKS);
  }

  getLibraryBooks(): LibraryBook[] {
    return this.getBooks();
  }

  saveBooks(books: LibraryBook[]): void {
    this.set(STORAGE_KEYS.BOOKS, books);
  }

  saveLibraryBooks(books: LibraryBook[]): void {
    this.saveBooks(books);
  }

  issueBookToStudent(bookId: string, studentRollNo: string): { success: boolean; message: string } {
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      return { success: false, message: 'Book is currently out of stock in central inventory.' };
    }

    const students = this.getStudents();
    const student = students.find(s => s.rollNo === studentRollNo);
    if (!student) {
      return { success: false, message: `Student with roll ${studentRollNo} not found.` };
    }

    // Check if already issued
    if (student.issuedBooks.some(b => b.bookId === bookId && !b.returnDate)) {
      return { success: false, message: 'This book is already currently issued to this student.' };
    }

    // Issue
    book.availableCopies -= 1;
    this.saveBooks(books);

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 15);

    student.issuedBooks.unshift({
      bookId: book.id,
      title: book.title,
      isbn: book.isbn,
      issueDate: now.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      fineAmount: 0,
    });
    this.saveStudents(students);

    return { success: true, message: `Book "${book.title}" successfully issued to ${student.name} (${student.rollNo}).` };
  }

  returnStudentBook(bookId: string, studentRollNo: string): { success: boolean; message: string; fine: number } {
    const students = this.getStudents();
    const student = students.find(s => s.rollNo === studentRollNo);
    if (!student) return { success: false, message: 'Student not found', fine: 0 };

    const bookIdx = student.issuedBooks.findIndex(b => b.bookId === bookId && !b.returnDate);
    if (bookIdx === -1) return { success: false, message: 'Active book record not found', fine: 0 };

    const issuedRecord = student.issuedBooks[bookIdx];
    const fine = issuedRecord.fineAmount || 0;
    issuedRecord.returnDate = new Date().toISOString().split('T')[0];
    student.issuedBooks.splice(bookIdx, 1); // remove from active
    this.saveStudents(students);

    // Increase book copy
    const books = this.getBooks();
    const book = books.find(b => b.id === bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      this.saveBooks(books);
    }

    return { success: true, message: `Book returned successfully. Overdue fine: ₹${fine}`, fine };
  }

  // Hostel
  getHostelRooms(): HostelRoom[] {
    const defaultRooms = SEED_HOSTEL_ROOMS;
    let rooms = this.get<HostelRoom[]>(STORAGE_KEYS.HOSTEL, defaultRooms);
    
    // Auto-migrate if stored rooms count is less than seed rooms count
    if (rooms.length < defaultRooms.length) {
      const existingIds = new Set(rooms.map(r => r.id));
      const missing = defaultRooms.filter(r => !existingIds.has(r.id));
      rooms = [...rooms, ...missing];
      this.saveHostelRooms(rooms);
    }
    
    return rooms;
  }

  saveHostelRooms(rooms: HostelRoom[]): void {
    this.set(STORAGE_KEYS.HOSTEL, rooms);
  }

  // Study Materials
  getMaterials(): StudyMaterial[] {
    return this.get<StudyMaterial[]>(STORAGE_KEYS.MATERIALS, SEED_STUDY_MATERIALS);
  }

  getStudyMaterials(): StudyMaterial[] {
    return this.getMaterials();
  }

  saveMaterials(materials: StudyMaterial[]): void {
    this.set(STORAGE_KEYS.MATERIALS, materials);
  }

  saveStudyMaterials(materials: StudyMaterial[]): void {
    this.saveMaterials(materials);
  }

  addMaterial(material: StudyMaterial): void {
    const list = this.getMaterials();
    list.unshift(material);
    this.saveMaterials(list);
  }

  likeMaterial(id: string): void {
    const list = this.getMaterials();
    const item = list.find(m => m.id === id);
    if (item) {
      item.likes += 1;
      this.saveMaterials(list);
    }
  }

  // Peer Chat
  getChat(): PeerChatMessage[] {
    return this.get<PeerChatMessage[]>(STORAGE_KEYS.CHAT, SEED_PEER_CHAT);
  }

  getPeerMessages(): PeerChatMessage[] {
    return this.getChat();
  }

  saveChat(messages: PeerChatMessage[]): void {
    this.set(STORAGE_KEYS.CHAT, messages);
  }

  savePeerMessages(messages: PeerChatMessage[]): void {
    this.saveChat(messages);
  }

  addChatMessage(msg: PeerChatMessage): void {
    const chat = this.getChat();
    chat.push(msg);
    this.saveChat(chat);
  }

  // Milestones
  getMilestones(): AcademicTermMilestone {
    return this.get<AcademicTermMilestone>(STORAGE_KEYS.MILESTONES, SEED_TERM_MILESTONES);
  }

  saveMilestones(milestone: AcademicTermMilestone): void {
    this.set(STORAGE_KEYS.MILESTONES, milestone);
  }

  // Campus Event Gallery
  getGalleryItems(): GalleryItem[] {
    return this.get<GalleryItem[]>(STORAGE_KEYS.GALLERY, SEED_GALLERY_ITEMS);
  }

  saveGalleryItems(items: GalleryItem[]): void {
    this.set(STORAGE_KEYS.GALLERY, items);
  }

  addGalleryItem(item: GalleryItem): void {
    const list = this.getGalleryItems();
    list.unshift(item);
    this.saveGalleryItems(list);
    supabaseSyncService.saveGalleryItemToCloud(item);
  }

  deleteGalleryItem(id: string): void {
    const list = this.getGalleryItems();
    const updated = list.filter(item => item.id !== id);
    this.saveGalleryItems(updated);
    supabaseSyncService.deleteGalleryItemFromCloud(id);
  }

  approveGalleryItem(id: string, reviewerName: string): void {
    const list = this.getGalleryItems();
    const item = list.find(g => g.id === id);
    if (item) {
      item.status = 'approved';
      item.reviewedBy = reviewerName;
      item.reviewedAt = new Date().toISOString().split('T')[0];
      this.saveGalleryItems(list);
      supabaseSyncService.saveGalleryItemToCloud(item);
    }
  }

  rejectGalleryItem(id: string, reviewerName: string, reason?: string): void {
    const list = this.getGalleryItems();
    const item = list.find(g => g.id === id);
    if (item) {
      item.status = 'rejected';
      item.reviewedBy = reviewerName;
      item.rejectionReason = reason || 'Content does not meet official college event guidelines.';
      item.reviewedAt = new Date().toISOString().split('T')[0];
      this.saveGalleryItems(list);
      supabaseSyncService.saveGalleryItemToCloud(item);
    }
  }

  toggleLikeGalleryItem(id: string, userId: string): void {
    const list = this.getGalleryItems();
    const item = list.find(g => g.id === id);
    if (item) {
      if (!item.likedBy) item.likedBy = [];
      const hasLiked = item.likedBy.includes(userId);
      if (hasLiked) {
        item.likedBy = item.likedBy.filter(u => u !== userId);
        item.likes = Math.max(0, item.likes - 1);
      } else {
        item.likedBy.push(userId);
        item.likes += 1;
      }
      this.saveGalleryItems(list);
      supabaseSyncService.saveGalleryItemToCloud(item);
    }
  }

  // Campus Events (Categorization & Verification)
  getEvents(): CampusEvent[] {
    return this.get<CampusEvent[]>(STORAGE_KEYS.EVENTS, SEED_CAMPUS_EVENTS);
  }

  saveEvents(events: CampusEvent[]): void {
    this.set(STORAGE_KEYS.EVENTS, events);
  }

  addEvent(event: CampusEvent): void {
    const list = this.getEvents();
    list.unshift(event);
    this.saveEvents(list);
    supabaseSyncService.saveCampusEventToCloud(event);
  }

  deleteEvent(id: string): void {
    const list = this.getEvents();
    const updated = list.filter(evt => evt.id !== id);
    this.saveEvents(updated);
  }

  approveEvent(id: string, reviewerName: string): void {
    const list = this.getEvents();
    const event = list.find(e => e.id === id);
    if (event) {
      event.status = 'approved';
      event.approvedBy = reviewerName;
      event.approvedAt = new Date().toISOString().split('T')[0];
      this.saveEvents(list);
      supabaseSyncService.saveCampusEventToCloud(event);
    }
  }

  rejectEvent(id: string, reviewerName: string, reason?: string): void {
    const list = this.getEvents();
    const event = list.find(e => e.id === id);
    if (event) {
      event.status = 'rejected';
      event.approvedBy = reviewerName;
      event.rejectionReason = reason || 'Proposed event does not meet official academic council or committee criteria.';
      event.approvedAt = new Date().toISOString().split('T')[0];
      this.saveEvents(list);
      supabaseSyncService.saveCampusEventToCloud(event);
    }
  }

  // Campus Overview Hero Video Management
  getHeroVideo(): { url: string; name: string; poster: string; isCustom: boolean } {
    const defaultData = {
      url: '',
      name: '',
      poster: '',
      isCustom: false
    };

    try {
      const savedUrl = localStorage.getItem(STORAGE_KEYS.HERO_VIDEO);
      const savedName = localStorage.getItem(STORAGE_KEYS.HERO_VIDEO_NAME);
      const savedPoster = localStorage.getItem(STORAGE_KEYS.HERO_VIDEO_POSTER);

      if (savedUrl) {
        return {
          url: savedUrl,
          name: savedName || 'Campus Overview Hero Reel',
          poster: savedPoster || '',
          isCustom: true
        };
      }
    } catch (e) {
      console.warn('Could not read hero video from localStorage:', e);
    }
    return defaultData;
  }

  setHeroVideo(url: string, name?: string, poster?: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_VIDEO, url);
      if (name) localStorage.setItem(STORAGE_KEYS.HERO_VIDEO_NAME, name);
      if (poster) localStorage.setItem(STORAGE_KEYS.HERO_VIDEO_POSTER, poster);
    } catch (e) {
      console.warn('Could not write hero video to localStorage:', e);
    }
  }

  resetHeroVideo(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HERO_VIDEO);
      localStorage.removeItem(STORAGE_KEYS.HERO_VIDEO_NAME);
      localStorage.removeItem(STORAGE_KEYS.HERO_VIDEO_POSTER);
    } catch (e) {
      console.warn('Could not clear hero video from localStorage:', e);
    }
  }

  // MPDREC Hub: Chats, Study Groups, Channels & Direct Messages
  getHubChats(): HubChat[] {
    return this.get<HubChat[]>(STORAGE_KEYS.HUB_CHATS, INITIAL_HUB_CHATS);
  }

  getConversationKey(userId1: string, userId2: string): string {
    return getConversationKey(userId1, userId2);
  }

  /**
   * Deterministic 1-on-1 Direct Chat Builder / Getter
   * Ensures both participants share the exact same thread without crosstalk.
   */
  getOrCreateDirectChat(currentUserId: string, targetPeerId: string, currentUserName?: string): HubChat {
    const convKey = getConversationKey(currentUserId, targetPeerId);
    const chats = this.getHubChats();
    const norm1 = (currentUserId || '').trim().toLowerCase();
    const norm2 = (targetPeerId || '').trim().toLowerCase();

    let existing = chats.find(c => {
      if (c.type !== 'direct') return false;
      if (c.id === convKey || c.id === `dm_${convKey}`) return true;
      const parts = (c.participantIds || []).map(p => p.trim().toLowerCase());
      return parts.includes(norm1) && parts.includes(norm2);
    });

    if (existing) {
      if (!existing.participantIds || existing.participantIds.length < 2) {
        existing.participantIds = [currentUserId, targetPeerId];
        this.updateHubChat(existing.id, { participantIds: [currentUserId, targetPeerId] });
      }
      return existing;
    }

    // Lookup peer info from database
    const students = this.getStudents();
    const faculty = this.getFaculty();
    const s = students.find(item => item.rollNo.trim().toLowerCase() === norm2);
    const f = faculty.find(item => item.facultyId.trim().toLowerCase() === norm2);

    const peerName = s ? s.name : f ? f.name : targetPeerId;
    const peerAvatar = s ? (s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80') : (f?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80');
    const peerRole = s ? 'student' as const : f ? 'faculty' as const : 'student' as const;
    const peerBadge = s ? `B.Tech ${s.branch || 'CSE'} • Sem ${s.semester || 3}` : f ? `${f.designation || 'Faculty'} (${f.department || 'CSE'})` : undefined;

    const newChat: HubChat = {
      id: convKey,
      type: 'direct',
      name: peerName,
      avatar: peerAvatar,
      description: peerBadge,
      isPinned: false,
      isMuted: false,
      unreadCount: 0,
      creatorId: currentUserId,
      participantIds: [currentUserId, targetPeerId],
      customWallpaper: 'academic-graph',
      directPeer: {
        id: targetPeerId,
        name: peerName,
        role: peerRole,
        avatar: peerAvatar,
        isOnline: true,
        academicBadge: peerBadge,
        bioStatus: s ? 'Available for Study Discussion 📚' : 'Faculty Mentor 💡'
      },
      lastMessage: {
        content: 'Direct chat conversation started.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName: currentUserName || currentUserId,
        type: 'text'
      }
    };

    this.addHubChat(newChat);
    return newChat;
  }

  /**
   * Strictly Scoped Chat Retrieval:
   * Direct Messages: ONLY visible if the user is one of the 2 participants (creator or direct peer)
   * Group Chats: ONLY visible if the user is an enrolled member or creator
   * Channels: Institutional announcements broadcast channel
   *
   * Automatically projects direct peer name/avatar from current user's perspective.
   */
  getScopedHubChats(userId: string, userRole: string = 'student'): HubChat[] {
    const allChats = this.getHubChats();
    const students = this.getStudents();
    const faculty = this.getFaculty();
    const currentNorm = (userId || '').trim().toLowerCase();

    const getContactInfo = (contactId: string) => {
      const cNorm = (contactId || '').trim().toLowerCase();
      const s = students.find(item => item.rollNo.trim().toLowerCase() === cNorm);
      if (s) {
        return {
          id: s.rollNo,
          name: s.name,
          role: 'student' as const,
          avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          handle: `@${s.name.toLowerCase().replace(/\s+/g, '_')}`,
          academicBadge: `B.Tech ${s.branch || 'CSE'} • Sem ${s.semester || 3}`,
          bioStatus: 'Enrolled Student 📚'
        };
      }
      const f = faculty.find(item => item.facultyId.trim().toLowerCase() === cNorm);
      if (f) {
        return {
          id: f.facultyId,
          name: f.name,
          role: 'faculty' as const,
          avatar: f.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          handle: `@prof_${f.name.toLowerCase().replace(/\s+/g, '_')}`,
          academicBadge: `${f.designation || 'Faculty'} (${f.department || 'CSE'})`,
          bioStatus: 'Faculty Mentor 💡'
        };
      }
      return null;
    };

    const isParticipant = (chat: HubChat): boolean => {
      if (chat.type === 'direct') {
        const parts = (chat.participantIds || []).map(p => p.trim().toLowerCase());
        if (parts.includes(currentNorm)) return true;
        if (chat.creatorId && chat.creatorId.trim().toLowerCase() === currentNorm) return true;
        if (chat.directPeer?.id && chat.directPeer.id.trim().toLowerCase() === currentNorm) return true;
        
        // Check if chat.id is deterministic composite key containing userId
        const keyParts = chat.id.replace(/^dm_/, '').split('_').map(p => p.trim().toLowerCase());
        if (keyParts.includes(currentNorm)) return true;
        return false;
      }
      if (chat.type === 'group') {
        if (chat.id === 'group_cse_sem3' || chat.id === 'group_dsa_club') {
          return true;
        }
        if (chat.members && chat.members.some(m => m.id.trim().toLowerCase() === currentNorm)) return true;
        if (chat.participantIds && chat.participantIds.some(p => p.trim().toLowerCase() === currentNorm)) return true;
        if (chat.creatorId && chat.creatorId.trim().toLowerCase() === currentNorm) return true;
        if (userRole === 'admin') return true;
        return false;
      }
      if (chat.type === 'channel') {
        // Broadcast announcements
        return true;
      }
      return false;
    };

    const scoped = allChats.filter(isParticipant);

    // Transform DM perspective so user sees the OTHER party's name and avatar
    return scoped.map(chat => {
      if (chat.type === 'direct') {
        let otherPartyId = '';
        if (chat.participantIds && chat.participantIds.length > 0) {
          otherPartyId = chat.participantIds.find(p => p.trim().toLowerCase() !== currentNorm) || '';
        }
        if (!otherPartyId) {
          const keyParts = chat.id.replace(/^dm_/, '').split('_');
          otherPartyId = keyParts.find(p => p.trim().toLowerCase() !== currentNorm) || '';
        }
        if (!otherPartyId) {
          otherPartyId = (chat.creatorId?.trim().toLowerCase() === currentNorm ? chat.directPeer?.id : chat.creatorId) || '';
        }

        if (otherPartyId) {
          const otherInfo = getContactInfo(otherPartyId);
          if (otherInfo) {
            return {
              ...chat,
              name: otherInfo.name,
              avatar: otherInfo.avatar,
              directPeer: {
                id: otherInfo.id,
                name: otherInfo.name,
                role: otherInfo.role,
                avatar: otherInfo.avatar,
                handle: otherInfo.handle,
                academicBadge: otherInfo.academicBadge,
                bioStatus: otherInfo.bioStatus,
                isOnline: true
              }
            };
          }
        }
      }
      return chat;
    });
  }

  isUserChatParticipant(chat: HubChat, userId: string): boolean {
    const currentNorm = (userId || '').trim().toLowerCase();
    if (chat.type === 'direct') {
      const parts = (chat.participantIds || []).map(p => p.trim().toLowerCase());
      if (parts.includes(currentNorm)) return true;
      if (chat.creatorId && chat.creatorId.trim().toLowerCase() === currentNorm) return true;
      if (chat.directPeer?.id && chat.directPeer.id.trim().toLowerCase() === currentNorm) return true;
      const keyParts = chat.id.replace(/^dm_/, '').split('_').map(p => p.trim().toLowerCase());
      if (keyParts.includes(currentNorm)) return true;
      return false;
    }
    if (chat.type === 'group') {
      if (chat.members && chat.members.some(m => m.id.trim().toLowerCase() === currentNorm)) return true;
      if (chat.participantIds && chat.participantIds.some(p => p.trim().toLowerCase() === currentNorm)) return true;
      if (chat.creatorId && chat.creatorId.trim().toLowerCase() === currentNorm) return true;
      return true;
    }
    return true;
  }

  saveHubChats(chats: HubChat[]): void {
    this.set(STORAGE_KEYS.HUB_CHATS, chats);
  }

  addHubChat(chat: HubChat): void {
    const chats = this.getHubChats();
    // Ensure participantIds are populated
    if (!chat.participantIds) {
      if (chat.type === 'direct') {
        chat.participantIds = [chat.creatorId || 'user', chat.directPeer?.id || 'peer'];
      } else if (chat.type === 'group' && chat.members) {
        chat.participantIds = chat.members.map(m => m.id);
        if (chat.creatorId && !chat.participantIds.includes(chat.creatorId)) {
          chat.participantIds.push(chat.creatorId);
        }
      }
    }
    const idx = chats.findIndex(c => c.id === chat.id);
    if (idx !== -1) {
      chats[idx] = chat;
    } else {
      chats.unshift(chat);
    }
    this.saveHubChats(chats);
  }

  updateHubChat(id: string, updates: Partial<HubChat>): void {
    const chats = this.getHubChats();
    const idx = chats.findIndex(c => c.id === id);
    if (idx !== -1) {
      // If members updated, sync participantIds
      if (updates.members) {
        const participantIds = updates.members.map(m => m.id);
        if (chats[idx].creatorId && !participantIds.includes(chats[idx].creatorId!)) {
          participantIds.push(chats[idx].creatorId!);
        }
        updates.participantIds = participantIds;
      }
      chats[idx] = { ...chats[idx], ...updates };
      this.saveHubChats(chats);
    }
  }

  toggleArchiveHubChat(id: string): void {
    const chats = this.getHubChats();
    const idx = chats.findIndex(c => c.id === id);
    if (idx !== -1) {
      chats[idx] = { ...chats[idx], isArchived: !chats[idx].isArchived };
      this.saveHubChats(chats);
    }
  }

  togglePinHubChat(id: string): void {
    const chats = this.getHubChats();
    const idx = chats.findIndex(c => c.id === id);
    if (idx !== -1) {
      chats[idx] = { ...chats[idx], isPinned: !chats[idx].isPinned };
      this.saveHubChats(chats);
    }
  }

  deleteHubChat(id: string): void {
    const chats = this.getHubChats().filter(c => c.id !== id);
    this.saveHubChats(chats);
    // Delete associated messages
    const messages = this.getHubMessages().filter(m => m.chatId !== id && m.conversationId !== id);
    this.saveHubMessages(messages);
  }

  // MPDREC Hub: Messages
  getHubMessages(chatId?: string): HubMessage[] {
    const all = this.get<HubMessage[]>(STORAGE_KEYS.HUB_MESSAGES, INITIAL_HUB_MESSAGES);
    if (chatId) {
      const norm = chatId.trim().toLowerCase();
      return all.filter(m => (m.chatId && m.chatId.trim().toLowerCase() === norm) || (m.conversationId && m.conversationId.trim().toLowerCase() === norm));
    }
    return all;
  }

  getScopedHubMessages(userId: string, userRole: string = 'student'): HubMessage[] {
    const scopedChats = this.getScopedHubChats(userId, userRole);
    const validChatIds = new Set(scopedChats.map(c => c.id.toLowerCase()));
    const allMessages = this.getHubMessages();
    const currentNorm = (userId || '').trim().toLowerCase();

    return allMessages.filter(msg => {
      const msgChatId = (msg.chatId || msg.conversationId || '').toLowerCase();
      if (validChatIds.has(msgChatId)) return true;
      if (msg.senderId && msg.senderId.trim().toLowerCase() === currentNorm) return true;
      if (msg.recipientId && msg.recipientId.trim().toLowerCase() === currentNorm) return true;
      return false;
    });
  }

  saveHubMessages(messages: HubMessage[]): void {
    this.set(STORAGE_KEYS.HUB_MESSAGES, messages);
  }

  addHubMessage(message: HubMessage): void {
    const messages = this.getHubMessages();
    
    // Normalize aliases
    if (!message.conversationId) {
      message.conversationId = message.chatId;
    }
    if (!message.text) {
      message.text = message.content;
    }
    if (!message.status) {
      message.status = 'delivered';
    }

    messages.push(message);
    this.saveHubMessages(messages);

    // Update lastMessage on corresponding chat
    const chats = this.getHubChats();
    const normChatId = message.chatId.trim().toLowerCase();
    const chat = chats.find(c => c.id.trim().toLowerCase() === normChatId);
    if (chat) {
      chat.lastMessage = {
        content: message.isEncrypted
          ? (message.type === 'file' ? '🔒 Encrypted File' : message.type === 'image' ? '🔒 Encrypted Image' : message.type === 'code' ? '🔒 Encrypted Code' : message.content || '🔒 Encrypted Message')
          : message.type === 'file' ? `📁 File: ${message.attachment?.name || 'Document'}` 
          : message.type === 'image' ? '📷 Image' 
          : message.type === 'video' ? '📹 Video' 
          : message.type === 'code' ? `💻 Code: ${message.codeSnippet?.title || message.codeSnippet?.language || 'Snippet'}` 
          : message.content,
        timestamp: message.timestamp,
        senderName: message.senderName,
        type: message.type,
        isEncrypted: message.isEncrypted
      };
      this.saveHubChats(chats);
    }
  }

  updateHubMessage(id: string, updates: Partial<HubMessage>): void {
    const messages = this.getHubMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx] = { ...messages[idx], ...updates };
      this.saveHubMessages(messages);
    }
  }

  deleteHubMessage(id: string): void {
    const messages = this.getHubMessages().filter(m => m.id !== id);
    this.saveHubMessages(messages);
  }

  toggleMessageReaction(messageId: string, emoji: string, userName: string): void {
    const messages = this.getHubMessages();
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) {
      msg.reactions = {};
    }

    const currentUsers = msg.reactions[emoji] || [];
    const userIndex = currentUsers.indexOf(userName);

    if (userIndex > -1) {
      currentUsers.splice(userIndex, 1);
      if (currentUsers.length === 0) {
        delete msg.reactions[emoji];
      } else {
        msg.reactions[emoji] = currentUsers;
      }
    } else {
      currentUsers.push(userName);
      msg.reactions[emoji] = currentUsers;
    }

    this.saveHubMessages(messages);
  }

  // E2EE Public Key Directory
  getUserPublicKey(userId: string): JsonWebKey | undefined {
    const dir = this.get<Record<string, JsonWebKey>>(STORAGE_KEYS.PUBLIC_KEYS, {});
    return dir[userId] || dir[userId.toLowerCase()];
  }

  saveUserPublicKey(userId: string, key: JsonWebKey): void {
    const dir = this.get<Record<string, JsonWebKey>>(STORAGE_KEYS.PUBLIC_KEYS, {});
    dir[userId] = key;
    dir[userId.toLowerCase()] = key;
    this.set(STORAGE_KEYS.PUBLIC_KEYS, dir);
  }

  getAllPublicKeys(): Record<string, JsonWebKey> {
    return this.get<Record<string, JsonWebKey>>(STORAGE_KEYS.PUBLIC_KEYS, {});
  }

  // Hub Notifications for Main Screen Bell Icon (Strictly Scoped by Recipient)
  getNotifications(userId: string, userRole: string = 'student'): Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'message' | 'notice' | 'group_invite' | 'security';
    targetTab?: string;
    targetChatId?: string;
    isRead?: boolean;
  }> {
    const currentNorm = (userId || '').trim().toLowerCase();
    const isGuest = userRole === 'guest' || currentNorm === 'guest' || currentNorm.includes('guest') || !currentNorm;

    const readIds = this.get<string[]>(`${STORAGE_KEYS.NOTIFICATIONS}_read_${currentNorm}`, []);
    const notifications: Array<{
      id: string;
      title: string;
      description: string;
      timestamp: string;
      type: 'message' | 'notice' | 'group_invite' | 'security';
      targetTab?: string;
      targetChatId?: string;
      isRead?: boolean;
    }> = [];

    // 1. Campus Notices (Visible to all users, routed to campus overview)
    const notices = this.getNotices().slice(0, 3);
    notices.forEach(n => {
      notifications.push({
        id: `notice-${n.id}`,
        title: `Campus Notice: ${n.title}`,
        description: n.content.slice(0, 75) + '...',
        timestamp: n.date,
        type: 'notice',
        targetTab: 'guest_portal',
        isRead: readIds.includes(`notice-${n.id}`)
      });
    });

    // Guests should NOT see any student/faculty messages, direct messages, or hub notifications
    if (isGuest) {
      return notifications;
    }

    // 2. Direct Messages (Strictly scoped: ONLY the targeted recipient sees the DM notification)
    const allMessages = this.getHubMessages();
    const scopedChats = this.getScopedHubChats(userId, userRole);
    const scopedChatIds = new Set(scopedChats.map(c => c.id.toLowerCase()));

    // Get direct messages where current user is the recipient (and NOT the sender)
    allMessages.forEach(msg => {
      const msgChatId = (msg.chatId || msg.conversationId || '').toLowerCase();
      const senderNorm = (msg.senderId || '').trim().toLowerCase();
      const recipientNorm = (msg.recipientId || '').trim().toLowerCase();

      // Never notify sender for their own sent message
      if (senderNorm === currentNorm) return;

      // Case A: Direct 1-on-1 message
      const isDirectChat = msgChatId.startsWith('dm_');
      if (isDirectChat) {
        // Extract participants from composite DM key (e.g. dm_roll1_roll2)
        const participants = msgChatId.replace(/^dm_/, '').split('_').map(p => p.trim().toLowerCase());
        const isIntendedRecipient = (recipientNorm && recipientNorm === currentNorm) || 
                                    (participants.includes(currentNorm) && participants.includes(senderNorm));

        if (isIntendedRecipient) {
          const previewText = msg.isEncrypted
            ? '🔒 Encrypted direct message'
            : msg.type === 'file'
            ? `📁 Shared file: ${msg.attachment?.name || 'Document'}`
            : msg.type === 'image'
            ? '📷 Shared an image'
            : msg.type === 'code'
            ? '💻 Shared code snippet'
            : msg.content || msg.text || 'New message';

          notifications.push({
            id: `dm-notif-${msg.id}`,
            title: `Direct Message from ${msg.senderName}`,
            description: previewText,
            timestamp: msg.timestamp || 'Recent',
            type: 'message',
            targetTab: 'study_hub',
            targetChatId: msg.chatId || msg.conversationId,
            isRead: readIds.includes(`dm-notif-${msg.id}`) || msg.status === 'read'
          });
        }
        return;
      }

      // Case B: Study Group / Channel Message
      if (scopedChatIds.has(msgChatId)) {
        const parentChat = scopedChats.find(c => c.id.toLowerCase() === msgChatId);
        if (parentChat && (parentChat.type === 'group' || parentChat.type === 'channel')) {
          const previewText = msg.isEncrypted
            ? '🔒 Encrypted group message'
            : msg.type === 'file'
            ? `📁 ${msg.senderName} shared ${msg.attachment?.name || 'a file'}`
            : msg.type === 'image'
            ? `📷 ${msg.senderName} shared an image`
            : msg.type === 'code'
            ? `💻 ${msg.senderName} shared a code snippet`
            : `${msg.senderName}: ${msg.content || msg.text || 'New message'}`;

          notifications.push({
            id: `group-notif-${msg.id}`,
            title: parentChat.type === 'channel' ? parentChat.name : `${parentChat.name} • ${msg.senderName}`,
            description: previewText,
            timestamp: msg.timestamp || 'Recent',
            type: 'message',
            targetTab: 'study_hub',
            targetChatId: parentChat.id,
            isRead: readIds.includes(`group-notif-${msg.id}`)
          });
        }
      }
    });

    // Sort notifications: unread first, then preserve recent order
    return notifications.sort((a, b) => {
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return 0;
    }).slice(0, 20);
  }

  markNotificationRead(userId: string, notificationId: string): void {
    const currentNorm = (userId || '').trim().toLowerCase();
    const key = `${STORAGE_KEYS.NOTIFICATIONS}_read_${currentNorm}`;
    const current = this.get<string[]>(key, []);
    if (!current.includes(notificationId)) {
      current.push(notificationId);
      this.set(key, current);
    }
  }

  markAllNotificationsRead(userId: string, userRole: string = 'student'): void {
    const currentNorm = (userId || '').trim().toLowerCase();
    const key = `${STORAGE_KEYS.NOTIFICATIONS}_read_${currentNorm}`;
    const notifs = this.getNotifications(userId, userRole);
    const allIds = notifs.map(n => n.id);
    this.set(key, allIds);
  }

  // Hub User Profiles
  generateDefaultUserProfile(userId: string): HubUserProfile {
    const norm = (userId || '').trim().toLowerCase();

    // 1. Check in 50 Students
    const students = this.getStudents();
    const s = students.find(item => item.rollNo.trim().toLowerCase() === norm || item.email.trim().toLowerCase() === norm);
    if (s) {
      const cleanHandle = '@' + s.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const bioStatuses = [
        'Studying for Midterms 📚',
        'Debugging Code 💻',
        'Cracking LeetCode ⚡',
        'Preparing CT-2 📝',
        'Building Major Project 🚀',
        'In Central Library 📖'
      ];
      // Deterministic bio status and wallpaper based on roll number
      const rollSum = (s.rollNo || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const bioStatus = bioStatuses[rollSum % bioStatuses.length];
      const wallpapers = ['academic-graph', 'telegram-doodle', 'midnight-mesh', 'emerald-study', 'classic-clean'];
      const wallpaperTheme = wallpapers[rollSum % wallpapers.length];

      return {
        userId: s.rollNo,
        displayName: s.name,
        handle: cleanHandle,
        avatar: s.avatar || (s.gender === 'Female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' 
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'),
        bioStatus,
        customBio: `3rd Sem B.Tech ${s.branch || 'CSE'} • SGPA ${s.sgpa || '8.5'} • MPDREC Student • AKTU Roll: ${s.rollNo}`,
        role: 'student',
        rollNo: s.rollNo,
        branch: s.branch || 'Computer Science & Engineering',
        semester: s.semester || 3,
        wallpaperTheme,
        soundEnabled: true,
        readReceipts: true
      };
    }

    // 2. Check in Faculty
    const faculty = this.getFaculty();
    const f = faculty.find(item => item.facultyId.trim().toLowerCase() === norm || item.email.trim().toLowerCase() === norm);
    if (f) {
      return {
        userId: f.facultyId,
        displayName: f.name,
        handle: '@prof_' + f.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        avatar: f.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        bioStatus: 'Faculty Mentor 💡',
        customBio: `${f.designation} • Department of ${f.department} • MPDREC Gonda`,
        role: 'faculty',
        branch: f.department || 'Computer Science & Engineering',
        semester: 3,
        wallpaperTheme: 'academic-graph',
        soundEnabled: true,
        readReceipts: true
      };
    }

    // 3. Admin / Staff / Warden / Guest
    if (norm.includes('adm') || norm === SEED_ADMIN.adminId.toLowerCase()) {
      return {
        userId: SEED_ADMIN.adminId,
        displayName: SEED_ADMIN.name,
        handle: '@registrar_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        bioStatus: 'Campus Administration 🏛️',
        customBio: 'Registrar & Academic Administration Office • MPDREC',
        role: 'admin',
        branch: 'Administration',
        semester: 3,
        wallpaperTheme: 'midnight-mesh',
        soundEnabled: true,
        readReceipts: true
      };
    }

    if (norm.includes('wrd') || norm.includes('warden') || norm === 'wrd-2026-009') {
      return {
        userId: 'WRD-2026-009',
        displayName: 'Shivani Verma',
        handle: '@warden_hostel',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        bioStatus: 'Hostel Administration 🏢',
        customBio: 'Saryu Girls Hostel Warden • MPDREC Gonda',
        role: 'staff',
        branch: 'Hostel Matrix',
        semester: 3,
        wallpaperTheme: 'emerald-study',
        soundEnabled: true,
        readReceipts: true
      };
    }

    if (norm.includes('stf') || norm.includes('staff') || norm === SEED_STAFF.staffId.toLowerCase()) {
      return {
        userId: SEED_STAFF.staffId,
        displayName: SEED_STAFF.name,
        handle: '@accounts_officer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        bioStatus: 'Finance & Ledgers 💳',
        customBio: 'Accounts & Finance Officer • MPDREC',
        role: 'staff',
        branch: 'Accounts',
        semester: 3,
        wallpaperTheme: 'classic-clean',
        soundEnabled: true,
        readReceipts: true
      };
    }

    // Default Guest
    return {
      userId: userId || 'GUEST-001',
      displayName: 'Public Visitor',
      handle: '@guest_visitor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bioStatus: 'Exploring Campus Hub 🌐',
      customBio: 'Guest visitor exploring MPDREC Gonda Academic Portal',
      role: 'guest',
      branch: 'Computer Science & Engineering',
      semester: 3,
      wallpaperTheme: 'academic-graph',
      soundEnabled: true,
      readReceipts: true
    };
  }

  getHubUserProfile(userId?: string): HubUserProfile {
    if (!userId) return DEFAULT_USER_PROFILE;
    const norm = userId.trim();
    const profiles = this.get<Record<string, HubUserProfile>>(STORAGE_KEYS.HUB_PROFILES, {});
    
    if (profiles[norm] && profiles[norm].userId === norm) {
      return profiles[norm];
    }
    if (profiles[norm.toLowerCase()] && profiles[norm.toLowerCase()].userId === norm) {
      return profiles[norm.toLowerCase()];
    }

    // Generate personalized default profile for this specific student/user
    const personalized = this.generateDefaultUserProfile(norm);
    profiles[norm] = personalized;
    profiles[norm.toLowerCase()] = personalized;
    this.set(STORAGE_KEYS.HUB_PROFILES, profiles);
    return personalized;
  }

  saveHubUserProfile(profile: HubUserProfile): void {
    const profiles = this.get<Record<string, HubUserProfile>>(STORAGE_KEYS.HUB_PROFILES, {});
    const norm = profile.userId.trim();
    profiles[norm] = profile;
    profiles[norm.toLowerCase()] = profile;
    this.set(STORAGE_KEYS.HUB_PROFILES, profiles);
  }

  // Councils Management Methods
  getCouncils(): CollegeCouncil[] {
    const raw = this.get<CollegeCouncil[]>(STORAGE_KEYS.COUNCILS, SEED_COUNCILS);
    const customLogos = this.getAllCustomCouncilLogos();
    const seedMap = new Map(SEED_COUNCILS.map(s => [s.id, s]));

    return raw.map(c => {
      const seed = seedMap.get(c.id);
      const councilData = seed ? { ...c, leadership: seed.leadership } : c;
      if (customLogos[councilData.id]) {
        return { ...councilData, logoUrl: customLogos[councilData.id] };
      }
      return councilData;
    });
  }

  saveCouncils(councils: CollegeCouncil[]): void {
    this.set(STORAGE_KEYS.COUNCILS, councils);
  }

  getCouncilById(id: CouncilId | string): CollegeCouncil | undefined {
    const list = this.getCouncils();
    return list.find(c => c.id === id);
  }

  updateCouncil(council: CollegeCouncil): void {
    const list = this.getCouncils();
    const idx = list.findIndex(c => c.id === council.id);
    if (idx >= 0) {
      list[idx] = council;
    } else {
      list.push(council);
    }
    this.saveCouncils(list);
  }

  // Council Events
  getCouncilEvents(): CouncilEvent[] {
    return this.get<CouncilEvent[]>(STORAGE_KEYS.COUNCIL_EVENTS, SEED_COUNCIL_EVENTS);
  }

  saveCouncilEvents(events: CouncilEvent[]): void {
    this.set(STORAGE_KEYS.COUNCIL_EVENTS, events);
  }

  addCouncilEvent(event: CouncilEvent): void {
    const list = this.getCouncilEvents();
    list.unshift(event);
    this.saveCouncilEvents(list);
    supabaseSyncService.saveCouncilEventToCloud(event);
  }

  updateCouncilEvent(event: CouncilEvent): void {
    const list = this.getCouncilEvents();
    const idx = list.findIndex(e => e.id === event.id);
    if (idx >= 0) {
      list[idx] = event;
      this.saveCouncilEvents(list);
      supabaseSyncService.saveCouncilEventToCloud(event);
    }
  }

  approveCouncilEvent(eventId: string, approvedBy: string): void {
    const list = this.getCouncilEvents();
    const evt = list.find(e => e.id === eventId);
    if (evt) {
      evt.moderationStatus = 'approved';
      evt.approvedBy = approvedBy;
      evt.approvedAt = new Date().toISOString();
      delete evt.rejectionReason;
      this.saveCouncilEvents(list);
      supabaseSyncService.saveCouncilEventToCloud(evt);
    }
  }

  rejectCouncilEvent(eventId: string, rejectedBy?: string, reason?: string): void {
    const list = this.getCouncilEvents();
    const evt = list.find(e => e.id === eventId);
    if (evt) {
      evt.moderationStatus = 'rejected';
      evt.rejectionReason = reason || 'Rejected by council moderation authority';
      this.saveCouncilEvents(list);
      supabaseSyncService.saveCouncilEventToCloud(evt);
    }
  }

  deleteCouncilEvent(eventId: string): void {
    const list = this.getCouncilEvents().filter(e => e.id !== eventId);
    this.saveCouncilEvents(list);
  }

  registerForCouncilEvent(eventId: string, userId: string): boolean {
    const list = this.getCouncilEvents();
    const evt = list.find(e => e.id === eventId);
    if (!evt) return false;
    evt.registeredUsers = evt.registeredUsers || [];
    if (evt.registeredUsers.includes(userId)) {
      return false; // already registered
    }
    evt.registeredUsers.push(userId);
    evt.registeredCount = (evt.registeredCount || 0) + 1;
    this.saveCouncilEvents(list);
    supabaseSyncService.saveCouncilEventToCloud(evt);
    return true;
  }

  // Council Media Items (Gallery & Moderation)
  getCouncilMedia(): CouncilMediaItem[] {
    return this.get<CouncilMediaItem[]>(STORAGE_KEYS.COUNCIL_MEDIA, SEED_COUNCIL_MEDIA);
  }

  saveCouncilMedia(media: CouncilMediaItem[]): void {
    this.set(STORAGE_KEYS.COUNCIL_MEDIA, media);
  }

  addCouncilMedia(item: CouncilMediaItem): void {
    const list = this.getCouncilMedia();
    list.unshift(item);
    this.saveCouncilMedia(list);
    supabaseSyncService.saveCouncilMediaToCloud(item);
  }

  approveCouncilMedia(mediaId: string, approvedBy: string): void {
    const list = this.getCouncilMedia();
    const item = list.find(m => m.id === mediaId);
    if (item) {
      item.status = 'approved';
      item.approvedBy = approvedBy;
      item.approvedAt = new Date().toISOString();
      delete item.rejectionReason;
      this.saveCouncilMedia(list);
      supabaseSyncService.saveCouncilMediaToCloud(item);
    }
  }

  rejectCouncilMedia(mediaId: string, rejectedBy?: string, reason?: string): void {
    const list = this.getCouncilMedia();
    const item = list.find(m => m.id === mediaId);
    if (item) {
      item.status = 'rejected';
      item.rejectionReason = reason || 'Rejected during council editorial moderation';
      this.saveCouncilMedia(list);
      supabaseSyncService.saveCouncilMediaToCloud(item);
    }
  }

  deleteCouncilMedia(mediaId: string): void {
    const list = this.getCouncilMedia().filter(m => m.id !== mediaId);
    this.saveCouncilMedia(list);
  }

  likeCouncilMedia(mediaId: string, userId: string): void {
    const list = this.getCouncilMedia();
    const item = list.find(m => m.id === mediaId);
    if (item) {
      item.likedBy = item.likedBy || [];
      const idx = item.likedBy.indexOf(userId);
      if (idx >= 0) {
        item.likedBy.splice(idx, 1);
        item.likes = Math.max(0, (item.likes || 1) - 1);
      } else {
        item.likedBy.push(userId);
        item.likes = (item.likes || 0) + 1;
      }
      this.saveCouncilMedia(list);
      supabaseSyncService.saveCouncilMediaToCloud(item);
    }
  }

  getCustomCouncilLogo(councilId: string): string | null {
    const logos = this.get<Record<string, string>>(STORAGE_KEYS.CUSTOM_LOGOS, {});
    return logos[councilId] || null;
  }

  setCustomCouncilLogo(councilId: string, urlOrBase64: string): void {
    const logos = this.get<Record<string, string>>(STORAGE_KEYS.CUSTOM_LOGOS, {});
    logos[councilId] = urlOrBase64;
    this.set(STORAGE_KEYS.CUSTOM_LOGOS, logos);

    // Also update council object in storage
    const list = this.get<CollegeCouncil[]>(STORAGE_KEYS.COUNCILS, SEED_COUNCILS);
    const updated = list.map(c => c.id === councilId ? { ...c, logoUrl: urlOrBase64 } : c);
    this.set(STORAGE_KEYS.COUNCILS, updated);
    supabaseSyncService.saveCouncilLogoToCloud(councilId, urlOrBase64);

    // Broadcast across all UI components and views
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mpdrec_council_logo_changed', {
        detail: { councilId, urlOrBase64, allLogos: logos }
      }));
    }
  }

  setCustomCouncilLogosBatch(newLogos: Record<string, string>): void {
    const existing = this.get<Record<string, string>>(STORAGE_KEYS.CUSTOM_LOGOS, {});
    const merged = { ...existing, ...newLogos };
    this.set(STORAGE_KEYS.CUSTOM_LOGOS, merged);

    const list = this.get<CollegeCouncil[]>(STORAGE_KEYS.COUNCILS, SEED_COUNCILS);
    const updated = list.map(c => merged[c.id] ? { ...c, logoUrl: merged[c.id] } : c);
    this.set(STORAGE_KEYS.COUNCILS, updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mpdrec_council_logo_changed', {
        detail: { allLogos: merged }
      }));
    }
  }

  removeCustomCouncilLogo(councilId: string): void {
    const logos = this.get<Record<string, string>>(STORAGE_KEYS.CUSTOM_LOGOS, {});
    delete logos[councilId];
    this.set(STORAGE_KEYS.CUSTOM_LOGOS, logos);
    supabaseSyncService.deleteCouncilLogoFromCloud(councilId);

    const defaultSeed = SEED_COUNCILS.find(c => c.id === councilId);
    const list = this.get<CollegeCouncil[]>(STORAGE_KEYS.COUNCILS, SEED_COUNCILS);
    const defaultUrl = defaultSeed?.logoUrl || '';
    const updated = list.map(c => c.id === councilId ? { ...c, logoUrl: defaultUrl } : c);
    this.set(STORAGE_KEYS.COUNCILS, updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mpdrec_council_logo_changed', {
        detail: { councilId, urlOrBase64: defaultUrl, allLogos: logos }
      }));
    }
  }

  getAllCustomCouncilLogos(): Record<string, string> {
    return this.get<Record<string, string>>(STORAGE_KEYS.CUSTOM_LOGOS, {});
  }

  // Theme & Appearance Preferences
  getThemeMode(): ThemeMode {
    return this.get<ThemeMode>(STORAGE_KEYS.THEME, 'system');
  }

  setThemeMode(mode: ThemeMode): void {
    this.set(STORAGE_KEYS.THEME, mode);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mpdrec_theme_mode_changed', { detail: { mode } }));
    }
  }

  getColorPalette(): ColorPaletteId {
    return this.get<ColorPaletteId>('mpdrec_color_palette_v1', 'imperial-navy');
  }

  setColorPalette(palette: ColorPaletteId): void {
    this.set('mpdrec_color_palette_v1', palette);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mpdrec_color_palette_changed', { detail: { palette } }));
    }
  }

  // Reset entire database to default seed state
  resetAllData(): void {
    this.set(STORAGE_KEYS.STUDENTS, generate50Students());
    this.set(STORAGE_KEYS.FACULTY, SEED_FACULTY);
    this.set(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    this.set(STORAGE_KEYS.TIMETABLE, SEED_TIMETABLE);
    this.set(STORAGE_KEYS.COURSE_DETAILS, SEED_COURSE_DETAILS);
    this.set(STORAGE_KEYS.BOOKS, SEED_BOOKS);
    this.set(STORAGE_KEYS.HOSTEL, SEED_HOSTEL_ROOMS);
    this.set(STORAGE_KEYS.MATERIALS, SEED_STUDY_MATERIALS);
    this.set(STORAGE_KEYS.CHAT, SEED_PEER_CHAT);
    this.set(STORAGE_KEYS.MILESTONES, SEED_TERM_MILESTONES);
    this.set(STORAGE_KEYS.GALLERY, SEED_GALLERY_ITEMS);
    this.set(STORAGE_KEYS.EVENTS, SEED_CAMPUS_EVENTS);
    this.set(STORAGE_KEYS.HUB_CHATS, INITIAL_HUB_CHATS);
    this.set(STORAGE_KEYS.HUB_MESSAGES, INITIAL_HUB_MESSAGES);
    this.set(STORAGE_KEYS.COUNCILS, SEED_COUNCILS);
    this.set(STORAGE_KEYS.COUNCIL_EVENTS, SEED_COUNCIL_EVENTS);
    this.set(STORAGE_KEYS.COUNCIL_MEDIA, SEED_COUNCIL_MEDIA);
  }

  resetToSeedData(): void {
    this.resetAllData();
  }
}

export const storageService = new StorageService();
