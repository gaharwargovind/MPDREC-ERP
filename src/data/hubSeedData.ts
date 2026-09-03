import { HubChat, HubMessage, HubUserProfile } from '../types/hub';

export const DEFAULT_WALLPAPERS = [
  { id: 'academic-graph', name: 'Academic Graph Blueprint', previewColor: 'from-blue-950/90 to-slate-950' },
  { id: 'telegram-doodle', name: 'Telegram Academic Doodle', previewColor: 'from-indigo-950/90 to-slate-900' },
  { id: 'midnight-mesh', name: 'Midnight Cyber Mesh', previewColor: 'from-slate-950 to-slate-900' },
  { id: 'emerald-study', name: 'Emerald Focus Zone', previewColor: 'from-emerald-950/80 to-slate-950' },
  { id: 'classic-clean', name: 'Clean Modern Slate', previewColor: 'from-slate-900 to-slate-950' }
];

export const BIO_STATUS_PRESETS = [
  'Studying for Midterms 📚',
  'Debugging Code 💻',
  'In Lab 🔬',
  'Cracking LeetCode ⚡',
  'Preparing CT-2 📝',
  'Building Major Project 🚀',
  'In Central Library 📖',
  'Available for Doubts 💡'
];

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
];

export const INITIAL_HUB_CHATS: HubChat[] = [
  {
    id: 'channel_campus_announcements',
    type: 'channel',
    name: '# Official Campus Announcements',
    description: 'College circulars, exam schedules, AKTU notices & institutional alerts',
    subject: 'Institutional Notices',
    avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=300&q=80',
    isPinned: true,
    isMuted: false,
    unreadCount: 0,
    creatorId: 'FAC-CSE-01',
    onlyAdminsCanPost: true,
    customWallpaper: 'academic-graph',
    lastMessage: {
      content: '📢 Class Test-2 (CT-2) official schedule published. Check timetable module.',
      timestamp: '10:30 AM',
      senderName: 'Mr. Sandip Kumar Singh',
      type: 'text'
    }
  },
  {
    id: 'group_cse_sem3',
    type: 'group',
    name: 'CSE 3rd Sem Academic Hub',
    description: 'Official academic study group for 3rd Sem B.Tech Computer Science & Engineering students',
    subject: 'B.Tech CSE - 3rd Sem',
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
    isPinned: true,
    isMuted: false,
    unreadCount: 0,
    creatorId: 'FAC-CSE-01',
    customWallpaper: 'midnight-mesh',
    lastMessage: {
      content: 'DSA unit-3 binary trees & graphs tutorial uploaded in Study Materials Hub.',
      timestamp: '11:15 AM',
      senderName: 'Mr. Sandip Kumar Singh',
      type: 'text'
    }
  },
  {
    id: 'group_dsa_club',
    type: 'group',
    name: 'Data Structures & Algorithms Circle',
    description: 'Peer coding problem discussions, LeetCode patterns, and lab assignment help',
    subject: 'Competitive Programming & DSA',
    avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80',
    isPinned: false,
    isMuted: false,
    unreadCount: 0,
    creatorId: 'CS-2512140100028',
    customWallpaper: 'emerald-study',
    lastMessage: {
      content: 'Has anyone solved the AVL tree double rotation question from yesterday?',
      timestamp: 'Yesterday',
      senderName: 'Govind Chandra Gaharwar',
      type: 'text'
    }
  }
];

export const INITIAL_HUB_MESSAGES: HubMessage[] = [
  {
    id: 'msg-seed-1',
    chatId: 'channel_campus_announcements',
    conversationId: 'channel_campus_announcements',
    senderId: 'FAC-CSE-01',
    senderName: 'Mr. Sandip Kumar Singh',
    senderHandle: '@prof_sandip_singh',
    senderRole: 'faculty',
    content: '📢 Class Test-2 (CT-2) official schedule published. Check timetable module.',
    text: '📢 Class Test-2 (CT-2) official schedule published. Check timetable module.',
    timestamp: '10:30 AM',
    date: 'Today',
    type: 'text',
    status: 'read'
  },
  {
    id: 'msg-seed-2',
    chatId: 'group_cse_sem3',
    conversationId: 'group_cse_sem3',
    senderId: 'FAC-CSE-01',
    senderName: 'Mr. Sandip Kumar Singh',
    senderHandle: '@prof_sandip_singh',
    senderRole: 'faculty',
    content: 'DSA unit-3 binary trees & graphs tutorial uploaded in Study Materials Hub.',
    text: 'DSA unit-3 binary trees & graphs tutorial uploaded in Study Materials Hub.',
    timestamp: '11:15 AM',
    date: 'Today',
    type: 'text',
    status: 'read'
  },
  {
    id: 'msg-seed-3',
    chatId: 'group_dsa_club',
    conversationId: 'group_dsa_club',
    senderId: 'CS-2512140100028',
    senderName: 'Govind Chandra Gaharwar',
    senderHandle: '@govind_cs',
    senderRole: 'student',
    content: 'Has anyone solved the AVL tree double rotation question from yesterday?',
    text: 'Has anyone solved the AVL tree double rotation question from yesterday?',
    timestamp: 'Yesterday',
    date: 'Yesterday',
    type: 'text',
    status: 'read'
  }
];

export const DEFAULT_USER_PROFILE: HubUserProfile = {
  userId: 'GUEST-001',
  displayName: 'Public Visitor',
  handle: '@guest_user',
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
