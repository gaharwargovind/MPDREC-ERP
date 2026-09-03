import React from 'react';
import { 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Library, 
  Building, 
  CreditCard, 
  MessageSquare, 
  Bot, 
  BarChart3,
  Globe,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import { AuthSession } from '../types/erp';

interface NavigationBreadcrumbBarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  session: AuthSession;
}

const TAB_METADATA: Record<string, { label: string; icon: React.FC<{ className?: string }>; description: string }> = {
  dashboard: { label: 'Dashboard', icon: Home, description: 'Overview & Quick Actions' },
  students: { label: 'Student Directory & Roster', icon: GraduationCap, description: 'Profiles, Bio-data & Enrollments' },
  faculty: { label: 'Faculty Directory', icon: UserCheck, description: 'Professors, HODs, Cabins & Specializations' },
  gallery: { label: 'Campus Event Gallery', icon: ImageIcon, description: 'Euphoria, Hackathons, Sports & Campus Media Repository' },
  academics: { label: 'Academics & Attendance (Avg / Marks)', icon: BookOpen, description: 'Semester SGPA, Class Tests & Attendance Tracking' },
  timetable: { label: 'Class Timetable', icon: Calendar, description: 'Weekly Lecture Schedule & Room Allocations' },
  library: { label: 'Digital Library', icon: Library, description: 'Books, Journals & Issue Log' },
  hostel: { label: 'Hostel & Mess Administration', icon: Building, description: 'Room Allocation & Mess Schedules' },
  fees: { label: 'Fee Management & Accounts', icon: CreditCard, description: 'Dues, Challans & Payment Receipts' },
  study_hub: { label: 'Study Hub & Peer Chat', icon: MessageSquare, description: 'Notes, PDF Materials & Discussions' },
  ai_assistant: { label: 'Campus AI Assistant', icon: Bot, description: 'AKTU Syllabus & Campus Guide' },
  analytics: { label: 'Institutional Analytics', icon: BarChart3, description: 'Performance & Department Trends' },
  guest_portal: { label: 'Campus Overview & Video Tour', icon: Globe, description: 'Public Portal & Drone Footage' },
};

export const NavigationBreadcrumbBar: React.FC<NavigationBreadcrumbBarProps> = ({
  activeTab,
  onNavigate,
  session
}) => {
  const currentMeta = TAB_METADATA[activeTab] || {
    label: activeTab,
    icon: Home,
    description: ''
  };

  const defaultHomeTab = session.role === 'guest' ? 'guest_portal' : 'dashboard';
  const isAtHome = activeTab === defaultHomeTab;

  if (isAtHome) {
    return null;
  }

  const IconComponent = currentMeta.icon;

  return (
    <div className="no-print mb-6 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(defaultHomeTab)}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all border border-blue-400/30"
            id="btn-back-to-dashboard"
            title="Return to Main Dashboard"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to {session.role === 'guest' ? 'Campus Overview' : 'Dashboard'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => onNavigate(defaultHomeTab)}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <IconComponent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {currentMeta.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
            {currentMeta.description}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {session.role} view
          </span>
        </div>

      </div>
    </div>
  );
};
