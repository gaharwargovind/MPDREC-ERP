import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { StudentRoster } from './components/StudentRoster';
import { FacultyDirectory } from './components/FacultyDirectory';
import { GalleryModule } from './components/GalleryModule';
import { ClassTestProgression } from './components/ClassTestProgression';
import { TimetableModule } from './components/TimetableModule';
import { LibraryModule } from './components/LibraryModule';
import { HostelModule } from './components/HostelModule';
import { FeeManagement } from './components/FeeManagement';
import { StudentChatHub } from './components/StudentChatHub';
import { CampusAiChatbot } from './components/CampusAiChatbot';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GuestLandingView } from './components/GuestLandingView';
import { LoginModal } from './components/LoginModal';
import { GradeCardModal } from './components/GradeCardModal';
import { CollegeLogo } from './components/CollegeLogo';
import { NavigationBreadcrumbBar } from './components/NavigationBreadcrumbBar';
import { CouncilsHub } from './components/councils/CouncilsHub';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { useTheme } from './context/ThemeContext';

import { storageService } from './services/storageService';
import { 
  Student, 
  Faculty, 
  Notice, 
  TimetableSlot, 
  LibraryBook, 
  HostelRoom, 
  PeerMessage, 
  StudyMaterial, 
  AcademicTermMilestone, 
  AuthSession,
  GalleryItem,
  CampusEvent
} from './types/erp';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem } from './types/councils';
import { supabaseSyncService } from './services/supabaseSyncService';

export default function App() {
  const [session, setSession] = useState<AuthSession>(() => storageService.getSession());
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [facultyList, setFacultyList] = useState<Faculty[]>(() => storageService.getFaculty());
  const [notices, setNotices] = useState<Notice[]>(() => storageService.getNotices());
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => storageService.getTimetable());
  const [books, setBooks] = useState<LibraryBook[]>(() => storageService.getLibraryBooks());
  const [rooms, setRooms] = useState<HostelRoom[]>(() => storageService.getHostelRooms());
  const [messages, setMessages] = useState<PeerMessage[]>(() => storageService.getPeerMessages());
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => storageService.getStudyMaterials());
  const [milestones, setMilestones] = useState<AcademicTermMilestone>(() => storageService.getMilestones());
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => storageService.getGalleryItems());
  const [events, setEvents] = useState<CampusEvent[]>(() => storageService.getEvents());
  const [councils, setCouncils] = useState<CollegeCouncil[]>(() => storageService.getCouncils());
  const [councilEvents, setCouncilEvents] = useState<CouncilEvent[]>(() => storageService.getCouncilEvents());
  const [councilMedia, setCouncilMedia] = useState<CouncilMediaItem[]>(() => storageService.getCouncilMedia());

  const [activeTab, setActiveTab] = useState<string>(() => {
    const sess = storageService.getSession();
    return sess.role === 'guest' ? 'guest_portal' : 'dashboard';
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [gradeCardStudent, setGradeCardStudent] = useState<Student | null>(null);
  const { isDark, toggleDarkMode } = useTheme();

  useEffect(() => {
    if (session.role === 'guest') {
      const timer = setTimeout(() => {
        setIsLoginOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (session.role === 'guest' && activeTab === 'study_hub') {
      setActiveTab('guest_portal');
    }
  }, [session.role, activeTab]);

  useEffect(() => {
    const handleCouncilLogoSync = () => {
      setCouncils(storageService.getCouncils());
    };
    window.addEventListener('mpdrec_council_logo_changed', handleCouncilLogoSync);
    return () => {
      window.removeEventListener('mpdrec_council_logo_changed', handleCouncilLogoSync);
    };
  }, []);

  useEffect(() => {
    supabaseSyncService.initRealtimeSync({
      onNoticesUpdate: (liveNotices) => setNotices(liveNotices),
      onGalleryUpdate: (liveGallery) => setGalleryItems(liveGallery),
      onEventsUpdate: (liveEvents) => setEvents(liveEvents),
      onCouncilEventsUpdate: (liveCouncilEvents) => setCouncilEvents(liveCouncilEvents),
      onCouncilMediaUpdate: (liveCouncilMedia) => setCouncilMedia(liveCouncilMedia),
      onStudentsUpdate: (liveStudents) => setStudents(liveStudents),
      onFacultyUpdate: (liveFaculty) => setFacultyList(liveFaculty),
      onBooksUpdate: (liveBooks) => setBooks(liveBooks),
      onMaterialsUpdate: (liveMaterials) => setStudyMaterials(liveMaterials),
    });
  }, []);

  const handleUpdateCouncil = (updatedCouncil: CollegeCouncil) => {
    const updated = councils.map(c => c.id === updatedCouncil.id ? updatedCouncil : c);
    setCouncils(updated);
    storageService.updateCouncil(updatedCouncil);
  };
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.rollNo === updatedStudent.rollNo ? updatedStudent : s);
    setStudents(updated);
    storageService.saveStudents(updated);
  };

  const handleAddStudent = (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    storageService.saveStudents(updated);
  };

  const handleDeleteStudent = (rollNo: string) => {
    const updated = students.filter(s => s.rollNo !== rollNo);
    setStudents(updated);
    storageService.saveStudents(updated);
  };

  const handleAddNotice = (notice: Notice) => {
    const updated = [notice, ...notices];
    setNotices(updated);
    storageService.saveNotices(updated);
  };

  const handleUpdateTimetable = (newSlots: TimetableSlot[]) => {
    setTimetable(newSlots);
    storageService.saveTimetable(newSlots);
  };

  const handleUpdateBooks = (newBooks: LibraryBook[]) => {
    setBooks(newBooks);
    storageService.saveLibraryBooks(newBooks);
  };

  const handleUpdateRooms = (newRooms: HostelRoom[]) => {
    setRooms(newRooms);
    storageService.saveHostelRooms(newRooms);
  };

  const handleSendMessage = (msg: PeerMessage) => {
    const updated = [...messages, msg];
    setMessages(updated);
    storageService.savePeerMessages(updated);
  };

  const handleAddMaterial = (mat: StudyMaterial) => {
    const updated = [mat, ...studyMaterials];
    setStudyMaterials(updated);
    storageService.saveStudyMaterials(updated);
  };

  const handleLikeMaterial = (id: string) => {
    const updated = studyMaterials.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    setStudyMaterials(updated);
    storageService.saveStudyMaterials(updated);
  };

  const handleUpdateMilestones = (newMilestones: AcademicTermMilestone) => {
    setMilestones(newMilestones);
    storageService.saveMilestones(newMilestones);
  };

  const handleAddGalleryItem = (item: GalleryItem) => {
    const updated = [item, ...galleryItems];
    setGalleryItems(updated);
    storageService.addGalleryItem(item);
  };

  const handleApproveGalleryItem = (id: string, reviewerName: string) => {
    storageService.approveGalleryItem(id, reviewerName);
    setGalleryItems(storageService.getGalleryItems());
  };

  const handleRejectGalleryItem = (id: string, reviewerName: string, reason?: string) => {
    storageService.rejectGalleryItem(id, reviewerName, reason);
    setGalleryItems(storageService.getGalleryItems());
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = galleryItems.filter(i => i.id !== id);
    setGalleryItems(updated);
    storageService.deleteGalleryItem(id);
  };

  const handleToggleLikeGalleryItem = (id: string) => {
    const userId = session.userId || session.name || 'visitor';
    storageService.toggleLikeGalleryItem(id, userId);
    setGalleryItems(storageService.getGalleryItems());
  };

  const handleAddEvent = (event: CampusEvent) => {
    storageService.addEvent(event);
    setEvents(storageService.getEvents());
  };

  const handleApproveEvent = (id: string, reviewerName: string) => {
    storageService.approveEvent(id, reviewerName);
    setEvents(storageService.getEvents());
  };

  const handleRejectEvent = (id: string, reviewerName: string, reason?: string) => {
    storageService.rejectEvent(id, reviewerName, reason);
    setEvents(storageService.getEvents());
  };

  const handleDeleteEvent = (id: string) => {
    storageService.deleteEvent(id);
    setEvents(storageService.getEvents());
  };

  const handleCouncilEventSubmitted = (event: CouncilEvent) => {
    storageService.addCouncilEvent(event);
    setCouncilEvents(storageService.getCouncilEvents());
  };

  const handleCouncilMediaSubmitted = (mediaItem: CouncilMediaItem) => {
    storageService.addCouncilMedia(mediaItem);
    setCouncilMedia(storageService.getCouncilMedia());
  };

  const handleApproveCouncilMedia = (mediaId: string) => {
    storageService.approveCouncilMedia(mediaId, `${session.name} (${session.role})`);
    setCouncilMedia(storageService.getCouncilMedia());
  };

  const handleRejectCouncilMedia = (mediaId: string, reason?: string) => {
    storageService.rejectCouncilMedia(mediaId, `${session.name} (${session.role})`, reason);
    setCouncilMedia(storageService.getCouncilMedia());
  };

  const handleApproveCouncilEvent = (eventId: string) => {
    storageService.approveCouncilEvent(eventId, `${session.name} (${session.role})`);
    setCouncilEvents(storageService.getCouncilEvents());
  };

  const handleRejectCouncilEvent = (eventId: string, reason?: string) => {
    storageService.rejectCouncilEvent(eventId, `${session.name} (${session.role})`, reason);
    setCouncilEvents(storageService.getCouncilEvents());
  };

  const handleLikeCouncilMedia = (mediaId: string) => {
    const userId = session.userId || session.rollNo || 'user-me';
    storageService.likeCouncilMedia(mediaId, userId);
    setCouncilMedia(storageService.getCouncilMedia());
  };

  const handleRegisterCouncilEvent = (eventId: string) => {
    const userId = session.userId || session.rollNo || 'user-me';
    storageService.registerForCouncilEvent(eventId, userId);
    setCouncilEvents(storageService.getCouncilEvents());
  };

  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    storageService.saveSession(newSession);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    const guestSession = storageService.logout();
    setSession(guestSession);
    setActiveTab('guest_portal');
  };

  const handleResetData = () => {
    storageService.resetToSeedData();
    setStudents(storageService.getStudents());
    setFacultyList(storageService.getFaculty());
    setNotices(storageService.getNotices());
    setTimetable(storageService.getTimetable());
    setBooks(storageService.getLibraryBooks());
    setRooms(storageService.getHostelRooms());
    setMessages(storageService.getPeerMessages());
    setStudyMaterials(storageService.getStudyMaterials());
    setMilestones(storageService.getMilestones());
    setGalleryItems(storageService.getGalleryItems());
    setEvents(storageService.getEvents());
    setCouncils(storageService.getCouncils());
    setCouncilEvents(storageService.getCouncilEvents());
    setCouncilMedia(storageService.getCouncilMedia());
  };

  const toppers = [...students].sort((a, b) => b.sgpa - a.sgpa);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      
      <Navbar
        session={session}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={isDark}
        setDarkMode={toggleDarkMode}
        notices={notices}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
        
        <NavigationBreadcrumbBar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          session={session}
        />
        
        {activeTab === 'dashboard' && (
          <DashboardOverview
            students={students}
            facultyList={facultyList}
            notices={notices}
            session={session}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenGradeCard={(student) => setGradeCardStudent(student)}
            onAddNotice={handleAddNotice}
          />
        )}

        {activeTab === 'councils' && (
          <CouncilsHub
            councils={councils}
            events={councilEvents}
            media={councilMedia}
            session={session}
            onEventSubmitted={handleCouncilEventSubmitted}
            onMediaSubmitted={handleCouncilMediaSubmitted}
            onApproveMedia={handleApproveCouncilMedia}
            onRejectMedia={handleRejectCouncilMedia}
            onApproveEvent={handleApproveCouncilEvent}
            onRejectEvent={handleRejectCouncilEvent}
            onLikeMedia={handleLikeCouncilMedia}
            onRegisterEvent={handleRegisterCouncilEvent}
            onUpdateCouncil={handleUpdateCouncil}
          />
        )}

        {activeTab === 'students' && (
          <StudentRoster
            students={students}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            session={session}
            onOpenGradeCard={(student) => setGradeCardStudent(student)}
            onNavigateTimetable={() => setActiveTab('timetable')}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyDirectory
            facultyList={facultyList}
            session={session}
            onNavigateTimetable={() => setActiveTab('timetable')}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryModule
            galleryItems={galleryItems}
            events={events}
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onToggleLike={handleToggleLikeGalleryItem}
            onApproveGalleryItem={handleApproveGalleryItem}
            onRejectGalleryItem={handleRejectGalleryItem}
            onAddEvent={handleAddEvent}
            onApproveEvent={handleApproveEvent}
            onRejectEvent={handleRejectEvent}
            onDeleteEvent={handleDeleteEvent}
            session={session}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {activeTab === 'academics' && (
          <ClassTestProgression
            students={students}
            onUpdateStudent={handleUpdateStudent}
            milestones={milestones}
            onUpdateMilestones={handleUpdateMilestones}
            session={session}
            onOpenGradeCard={(student) => setGradeCardStudent(student)}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableModule
            timetable={timetable}
            onUpdateTimetable={handleUpdateTimetable}
            session={session}
          />
        )}

        {activeTab === 'library' && (
          <LibraryModule
            books={books}
            students={students}
            onUpdateBooks={handleUpdateBooks}
            onUpdateStudent={handleUpdateStudent}
            session={session}
          />
        )}

        {activeTab === 'hostel' && (
          <HostelModule
            rooms={rooms}
            students={students}
            onUpdateRooms={handleUpdateRooms}
            onUpdateStudent={handleUpdateStudent}
            session={session}
          />
        )}

        {activeTab === 'fees' && (
          <FeeManagement
            students={students}
            onUpdateStudent={handleUpdateStudent}
            session={session}
          />
        )}

        {activeTab === 'study_hub' && session.role !== 'guest' && (
          <StudentChatHub
            messages={messages}
            onSendMessage={handleSendMessage}
            studyMaterials={studyMaterials}
            onAddMaterial={handleAddMaterial}
            onLikeMaterial={handleLikeMaterial}
            session={session}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <CampusAiChatbot 
            session={session} 
            students={students}
            timetable={timetable}
            books={books}
            rooms={rooms}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenGradeCard={(student) => setGradeCardStudent(student)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            students={students}
            facultyList={facultyList}
            books={books}
          />
        )}

        {activeTab === 'guest_portal' && (
          <GuestLandingView
            onOpenLogin={() => setIsLoginOpen(true)}
            toppers={toppers}
            notices={notices}
            session={session}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

      </main>

      <footer className="no-print border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <CollegeLogo className="w-8 h-8" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Maa Pateshwari Devi Rajkiya Engineering College (MPDREC)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">AKTU Code: 1214 • Balrampur / Gonda, Uttar Pradesh</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLoginOpen(true)} className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
              Campus ERP Login (Student / Faculty / Staff / Admin)
            </button>
            <button onClick={handleResetData} className="hover:text-rose-600 font-semibold">
              Reset 50 Seed Records
            </button>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        students={students}
        facultyList={facultyList}
      />

      {gradeCardStudent && (
        <GradeCardModal
          student={gradeCardStudent}
          isOpen={!!gradeCardStudent}
          onClose={() => setGradeCardStudent(null)}
        />
      )}

      <ThemeCustomizerModal />

    </div>
  );
}
