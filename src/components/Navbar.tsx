import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Bell, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  Building, 
  IndianRupee, 
  MessageSquare, 
  Sparkles, 
  BarChart3, 
  Layers, 
  RefreshCw,
  Award,
  ChevronDown,
  UserCheck,
  Image as ImageIcon,
  Lock,
  X,
  Trophy,
  Menu,
  ChevronRight,
  Compass,
  Zap,
  Users,
  Flame,
  Palette,
  Monitor
} from 'lucide-react';
import { AuthSession, Notice } from '../types/erp';
import { CollegeLogo } from './CollegeLogo';
import { storageService } from '../services/storageService';
import { supabaseSyncService, SupabaseConnectionStatus } from '../services/supabaseSyncService';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  session: AuthSession;
  onOpenLogin: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notices: Notice[];
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onOpenLogin,
  onLogout,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  notices,
  onResetData,
}) => {
  const { 
    isDark, 
    toggleDarkMode, 
    colorPalette, 
    activePaletteConfig, 
    setIsThemeModalOpen,
    themeMode,
    setThemeMode
  } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'messages' | 'notices'>('all');
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<any | null>(null);
  const [sbStatus, setSbStatus] = useState<SupabaseConnectionStatus>({
    isConfigured: true,
    isConnected: true,
    lastSyncedAt: null,
    error: null,
    activeUploadsCount: 0
  });

  useEffect(() => {
    const unsub = supabaseSyncService.subscribeStatus((st) => {
      setSbStatus(st);
    });
    return () => unsub();
  }, []);

  const currentUserId = session.rollNo || session.facultyId || session.userId || (session.role === 'guest' ? 'guest' : 'user-me');

  // Load and poll notifications
  useEffect(() => {
    const loadNotifs = () => {
      const list = storageService.getNotifications(currentUserId, session.role);
      setNotifications(list);
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 2500);
    return () => clearInterval(interval);
  }, [currentUserId, session.role]);

  // Lock body scroll when mobile drawer or full modals are open
  useEffect(() => {
    if (isMobileDrawerOpen || showNotificationMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen, showNotificationMenu]);

  // Handle escape key to close drawer and menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
        setShowNotificationMenu(false);
        setShowProfileMenu(false);
        setShowResetConfirm(false);
        setSelectedNotifDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const messageCount = notifications.filter(n => n.type === 'message').length;
  const noticeCount = notifications.filter(n => n.type === 'notice').length;

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'unread') return !n.isRead;
    if (notifFilter === 'messages') return n.type === 'message';
    if (notifFilter === 'notices') return n.type === 'notice';
    return true;
  });

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead(currentUserId, session.role);
    setNotifications(storageService.getNotifications(currentUserId, session.role));
  };

  const handleNotificationClick = (n: any) => {
    storageService.markNotificationRead(currentUserId, n.id);
    setNotifications(storageService.getNotifications(currentUserId, session.role));
    setShowNotificationMenu(false);
    if (session.role === 'guest') {
      setActiveTab('guest_portal');
      return;
    }
    if (n.targetTab) {
      setActiveTab(n.targetTab);
    }
  };

  const handleOpenDetailModal = (n: any, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.markNotificationRead(currentUserId, n.id);
    setNotifications(storageService.getNotifications(currentUserId, session.role));
    setSelectedNotifDetail(n);
  };

  const navCategories = [
    {
      title: 'Core & Community',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Layers, roles: ['admin', 'faculty', 'student', 'staff', 'guest'], badge: 'Home' },
        { id: 'councils', label: 'Councils Hub', icon: Trophy, roles: ['admin', 'faculty', 'student', 'staff', 'guest'], highlight: true, badge: 'Popular' },
        { id: 'guest_portal', label: 'Campus Overview', icon: Building, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
        { id: 'gallery', label: 'Campus Gallery', icon: ImageIcon, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
      ]
    },
    {
      title: 'Academic & Tests',
      items: [
        { id: 'academics', label: 'Class Tests & Upgrade', icon: Award, roles: ['admin', 'faculty', 'student'], badge: 'Marks' },
        { id: 'timetable', label: 'Timetable', icon: Calendar, roles: ['admin', 'faculty', 'student', 'staff'] },
        { id: 'students', label: 'Student Roster', icon: Users, roles: ['admin', 'faculty', 'staff'] },
        { id: 'faculty', label: 'Faculty Directory', icon: UserCheck, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
      ]
    },
    {
      title: 'Campus Services',
      items: [
        { id: 'library', label: 'Central Library', icon: BookOpen, roles: ['admin', 'faculty', 'student', 'staff'] },
        { id: 'hostel', label: 'Hostel Matrix', icon: Building, roles: ['admin', 'faculty', 'student', 'staff'] },
        { id: 'fees', label: 'Fee Ledgers', icon: IndianRupee, roles: ['admin', 'student', 'staff'] },
      ]
    },
    {
      title: 'Collaboration & AI',
      items: [
        { id: 'study_hub', label: 'MPDREC Hub', icon: MessageSquare, roles: ['admin', 'faculty', 'student'] },
        { id: 'ai_assistant', label: 'Campus AI Co-Pilot', icon: Sparkles, roles: ['admin', 'faculty', 'student', 'staff', 'guest'], highlight: true, badge: 'AI' },
        { id: 'analytics', label: 'Institutional Analytics', icon: BarChart3, roles: ['admin', 'faculty', 'staff'] },
      ]
    }
  ];

  // Flat list for desktop horizontal navigation
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
    { id: 'councils', label: 'Councils Hub', icon: Trophy, roles: ['admin', 'faculty', 'student', 'staff', 'guest'], highlight: true },
    { id: 'guest_portal', label: 'Campus Overview', icon: Building, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
    { id: 'gallery', label: 'Campus Gallery', icon: ImageIcon, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
    { id: 'students', label: 'Student Roster', icon: Users, roles: ['admin', 'faculty', 'staff'] },
    { id: 'faculty', label: 'Faculty Directory', icon: UserCheck, roles: ['admin', 'faculty', 'student', 'staff', 'guest'] },
    { id: 'academics', label: 'Class Tests & Upgrade', icon: Award, roles: ['admin', 'faculty', 'student'] },
    { id: 'timetable', label: 'Timetable', icon: Calendar, roles: ['admin', 'faculty', 'student', 'staff'] },
    { id: 'library', label: 'Central Library', icon: BookOpen, roles: ['admin', 'faculty', 'student', 'staff'] },
    { id: 'hostel', label: 'Hostel Matrix', icon: Building, roles: ['admin', 'faculty', 'student', 'staff'] },
    { id: 'fees', label: 'Fee Ledgers', icon: IndianRupee, roles: ['admin', 'student', 'staff'] },
    { id: 'study_hub', label: 'MPDREC Hub', icon: MessageSquare, roles: ['admin', 'faculty', 'student'] },
    { id: 'ai_assistant', label: 'Campus AI', icon: Sparkles, roles: ['admin', 'faculty', 'student', 'staff', 'guest'], highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'faculty', 'staff'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(session.role));

  const roleColors: Record<string, string> = {
    admin: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 font-bold',
    faculty: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold',
    student: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 font-bold',
    staff: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold',
    guest: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700 font-bold',
  };

  const handleSelectNavTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors">
        {/* Top Animated Announcement Ticker */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs py-1.5 px-3 sm:px-4 overflow-hidden relative shadow-inner">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] shrink-0 shadow-sm animate-pulse">
              <Bell className="w-3 h-3" /> Live Ticker
            </div>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="animate-marquee inline-flex gap-8 sm:gap-12 font-medium text-[11px] sm:text-xs">
                {notices.map((n, idx) => (
                  <span key={n.id || idx} className="inline-flex items-center gap-2">
                    <span className="text-amber-400 font-bold">[{n.category}]</span> {n.title} — <span className="text-slate-300">{n.content.slice(0, 80)}...</span>
                    <span className="text-blue-300 font-mono text-[10px] sm:text-[11px]">({n.date})</span>
                    <span className="mx-2 text-slate-500">•</span>
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 hidden md:inline-block">
              (Hover ticker to pause)
            </span>
          </div>
        </div>

        {/* Main Navigation Header */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-4">
            
            {/* Left Section: Mobile Hamburger Trigger + Logo Branding */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 shrink-0"
                aria-label="Open Navigation Drawer"
                id="btn-mobile-menu-toggle"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo & College Brand */}
              <div 
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
                id="college-header-brand"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-amber-300/40 shrink-0">
                  <CollegeLogo className="w-7 h-7 sm:w-9 sm:h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-extrabold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 dark:from-blue-400 dark:via-indigo-300 dark:to-amber-400 bg-clip-text text-transparent">
                      MPDREC ERP
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      1214
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                    Maa Pateshwari Devi Rajkiya Engineering College
                  </p>
                </div>
              </div>
            </div>

            {/* Center Navigation Tabs (Desktop only) */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    } ${item.highlight ? 'ring-1 ring-amber-400/40 text-amber-600 dark:text-amber-400 font-bold' : ''}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
                    {item.label}
                    {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Notification Bell Icon */}
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                title="Notifications & Alerts"
                className={`relative p-2 rounded-xl transition-all text-xs flex items-center justify-center ${
                  unreadCount > 0
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 ring-1 ring-blue-500/20'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id="btn-notification-bell"
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* PostgreSQL Cloud Connected Status Pill */}
              <div 
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold"
                title="Database Connected & Synchronized"
                id="badge-cloud-status"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span className="text-[11px] font-semibold tracking-tight">Cloud Sync Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Reset Seed Data Button (Only visible for Super Admin / Admin role) */}
              {session.role === 'admin' && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    title="Reset Database to 50 Fresh Pre-populated Students & Faculty (Admin Only)"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                    id="btn-reset-seed-data"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden xl:inline text-[11px]">Reset Data</span>
                  </button>
                </div>
              )}

              {/* Theme Customizer & Color Palette Button */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold shadow-2xs group"
                title={`Institutional Theme: ${activePaletteConfig.name} (Click to customize)`}
                id="btn-theme-palette-modal"
              >
                <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] hidden xl:inline">{activePaletteConfig.name.split(' ')[0]}</span>
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0 shadow-2xs" 
                  style={{ backgroundColor: activePaletteConfig.primaryColor }} 
                />
              </button>

              {/* Theme Mode Toggle (Light / Dark / System) */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'} (Click to toggle)`}
                id="btn-theme-toggle"
                aria-label="Toggle theme mode"
              >
                {themeMode === 'system' ? (
                  <div className="relative">
                    <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  </div>
                ) : isDark ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </button>

              {/* ========================================================= */}
              {/* TOP RIGHT LOGIN BUTTON / AUTHENTICATED PROFILE TRIGGER     */}
              {/* ALWAYS CLEARLY VISIBLE ON BOTH MOBILE & DESKTOP SCREENS   */}
              {/* ========================================================= */}
              {session.role === 'guest' ? (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 shrink-0 tracking-wide border border-blue-600 dark:border-blue-400/40"
                  id="btn-quick-login-top"
                  title="Login to Student, Faculty or Admin Portal"
                >
                  <LogIn className="w-4 h-4 text-white shrink-0" strokeWidth={2.5} />
                  <span className="font-bold">Login</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowProfileMenu(true)}
                  className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-xs shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  id="user-profile-menu-button"
                  title={`Logged in as ${session.name} (${session.role})`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700/80 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold leading-tight text-slate-900 dark:text-white truncate max-w-[70px] sm:max-w-[120px]">
                      {session.name.split(' ')[0]}
                    </div>
                    <div className={`text-[8.5px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded border uppercase inline-block leading-none tracking-wider ${roleColors[session.role]}`}>
                      {session.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 transition-colors" strokeWidth={2.5} />
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. NOTIFICATION DRAWER / PANEL (Mounted via React Portal)   */}
      {/* 100% Guaranteed Zero Screen Overflow on Mobile Devices    */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && showNotificationMenu && createPortal(
        <div className="fixed inset-0 z-[10001] flex items-start justify-center sm:justify-end sm:pr-6 md:pr-10 pt-14 sm:pt-16 px-2.5 sm:px-0" role="dialog" aria-modal="true" aria-labelledby="notif-panel-heading">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setShowNotificationMenu(false)}
            aria-hidden="true"
          />

          {/* Notification Card */}
          <div className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-4.5rem)] sm:max-h-[600px] z-10 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 id="notif-panel-heading" className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                    Campus Notifications
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount} unread</span>
                    <span>•</span>
                    <span>{notifications.length} total</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationMenu(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors active:scale-95"
                  aria-label="Close notification panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-3 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setNotifFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  notifFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setNotifFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  notifFilter === 'unread'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setNotifFilter('notices')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  notifFilter === 'notices'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Notices ({noticeCount})
              </button>
              {messageCount > 0 && (
                <button
                  onClick={() => setNotifFilter('messages')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    notifFilter === 'messages'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Messages ({messageCount})
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-6 text-center text-slate-400 text-xs">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-blue-500" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">No notifications found</p>
                  <p className="text-[11px] text-slate-400 mt-1">You are all caught up with campus alerts and messages.</p>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 sm:p-3.5 cursor-pointer transition-colors flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 active:bg-slate-100 dark:active:bg-slate-800 ${
                      !item.isRead ? 'bg-blue-50/50 dark:bg-blue-950/25' : ''
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      item.type === 'message'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                    }`}>
                      {item.type === 'message' ? <MessageSquare className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>

                    {/* Message Body with Text Wrapping */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm break-words line-clamp-2">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 break-words whitespace-normal line-clamp-3 leading-relaxed mt-0.5">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={(e) => handleOpenDetailModal(item, e)}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                          <span>Read full notice</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        {item.targetTab && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Tab: {item.targetTab.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>

                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5 ring-2 ring-blue-200 dark:ring-blue-900 animate-pulse" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
              <span className="text-[10px] text-slate-400">
                Tip: Click any notice to navigate or click "Read full notice" for complete details.
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 2. FULL NOTICE / MESSAGE DETAIL MODAL                      */}
      {/* Read 100% of any notice or notification without cuts       */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && selectedNotifDetail && createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedNotifDetail(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                  {selectedNotifDetail.type === 'message' ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {selectedNotifDetail.type === 'message' ? 'Campus Message' : 'Official Circular'}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {selectedNotifDetail.timestamp}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotifDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug break-words">
                {selectedNotifDetail.title}
              </h3>
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                {selectedNotifDetail.description}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedNotifDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              {selectedNotifDetail.targetTab && (
                <button
                  onClick={() => {
                    const tab = selectedNotifDetail.targetTab;
                    setSelectedNotifDetail(null);
                    setShowNotificationMenu(false);
                    if (session.role === 'guest') {
                      setActiveTab('guest_portal');
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-md shadow-blue-500/25"
                >
                  <span>Open in {selectedNotifDetail.targetTab.replace('_', ' ')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 3. PROFILE POPUP MENU (Mounted via React Portal)           */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && showProfileMenu && createPortal(
        <div className="fixed inset-0 z-[10001] flex items-start justify-center sm:justify-end sm:pr-6 md:pr-10 pt-16 sm:pt-20 px-3 sm:px-0" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" 
            onClick={() => setShowProfileMenu(false)} 
          />
          <div className="relative w-full max-w-xs sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{session.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.email}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${roleColors[session.role]}`}>
                  {session.role}
                </span>
                {session.rollNo && (
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                    {session.rollNo}
                  </span>
                )}
              </div>
            </div>

            <div className="py-1 space-y-1">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setIsThemeModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Theme & Appearance</span>
                </div>
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" 
                  style={{ backgroundColor: activePaletteConfig.primaryColor }} 
                />
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Switch Role / Quick Login</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out to Guest Portal</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 4. DATABASE RESET CONFIRMATION (Mounted via React Portal)  */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && showResetConfirm && createPortal(
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
            onClick={() => setShowResetConfirm(false)} 
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 z-10 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Reset Mock ERP Database?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will restore all 50 pre-populated students, 6 faculty profiles, hostel room assignments, library catalogs, and test mark records to their default seed state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/25"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* MOBILE NAVIGATION DRAWER (Mounted via React Portal)        */}
      {/* Completely avoids CSS containing block / backdrop bugs    */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-[9999] lg:hidden" role="dialog" aria-modal="true">
              
              {/* Backdrop Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-hidden="true"
              />

              {/* Sliding Drawer Container */}
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-[310px] max-w-[88vw] h-full bg-white dark:bg-[#0c101d] text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-[10000] overflow-hidden"
              >
                {/* 1. Drawer Header */}
                <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-amber-300 shadow-sm">
                      <CollegeLogo className="w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm text-white tracking-tight truncate">MPDREC ERP</h3>
                        <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-mono font-bold">1214</span>
                      </div>
                      <p className="text-[10px] text-slate-300 truncate">Academic Management Portal</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none active:scale-95"
                    aria-label="Close Navigation Menu"
                    id="btn-close-mobile-drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. Active Session Card or Login CTA */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  {session.role === 'guest' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Browsing as:</span>
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase">
                          Guest Visitor
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onOpenLogin();
                        }}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                        id="btn-drawer-guest-login"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In / Student & Faculty Login</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {session.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${roleColors[session.role]}`}>
                            {session.role}
                          </span>
                          {session.rollNo && (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              {session.rollNo}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onOpenLogin();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-sm shrink-0 flex items-center gap-1 active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Switch</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Categorized Navigation Modules */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {navCategories.map((cat, catIdx) => {
                    const visibleItems = cat.items.filter(item => item.roles.includes(session.role));
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={catIdx} className="space-y-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 pb-1">
                          {cat.title}
                        </h4>
                        <div className="space-y-1">
                          {visibleItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                id={`drawer-nav-item-${item.id}`}
                                onClick={() => handleSelectNavTab(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                  isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200 dark:active:bg-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`p-2 rounded-xl shrink-0 ${
                                    isActive 
                                      ? 'bg-white/20 text-white' 
                                      : item.highlight 
                                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' 
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="truncate">{item.label}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {item.badge && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                      isActive 
                                        ? 'bg-white/20 text-white' 
                                        : item.highlight 
                                        ? 'bg-amber-500 text-slate-950 animate-pulse' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. Drawer Footer Controls */}
                <div className="p-3 bg-slate-50 dark:bg-[#080c16] border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Theme Switcher Button */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
                    >
                      {themeMode === 'system' ? (
                        <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : isDark ? (
                        <Moon className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <span>{themeMode === 'system' ? 'System Auto' : isDark ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    {/* Color Palette Modal Trigger */}
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        setIsThemeModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs transition-all active:scale-95 flex items-center gap-1.5"
                      title="Choose Collegiate Theme Palette"
                    >
                      <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/20" 
                        style={{ backgroundColor: activePaletteConfig.primaryColor }} 
                      />
                    </button>

                    {/* Reset Database Button (Only visible for Super Admin / Admin role) */}
                    {session.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          setShowResetConfirm(true);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-600 text-xs transition-all active:scale-95"
                        title="Reset Mock Database (Admin Only)"
                        id="btn-reset-seed-data-drawer"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {session.role !== 'guest' ? (
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all border border-rose-200/50 dark:border-rose-900/30 active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out to Guest Portal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileDrawerOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Unified Portal Login</span>
                    </button>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

