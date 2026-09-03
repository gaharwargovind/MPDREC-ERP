import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Users, 
  Radio, 
  Settings, 
  Plus, 
  Search, 
  ShieldCheck, 
  GraduationCap
} from 'lucide-react';
import { HubChat, HubMessage, HubUserProfile, CodeSnippetData } from '../../types/hub';
import { StudyMaterial, AuthSession, Student, Faculty } from '../../types/erp';
import { storageService } from '../../services/storageService';
import { e2eeService } from '../../services/e2eeService';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { ChatRightDrawer } from './ChatRightDrawer';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { CreateGroupModal } from './CreateGroupModal';
import { NewDirectChatModal } from './NewDirectChatModal';
import { CodeSnippetModal } from './CodeSnippetModal';
import { StudyMaterialsHub } from './StudyMaterialsHub';

interface MPDRECHubProps {
  session: AuthSession;
  studyMaterials: StudyMaterial[];
  onAddMaterial: (mat: StudyMaterial) => void;
  onLikeMaterial: (id: string) => void;
}

export const MPDRECHub: React.FC<MPDRECHubProps> = ({
  session,
  studyMaterials,
  onAddMaterial,
  onLikeMaterial,
}) => {
  const [hubView, setHubView] = useState<'messaging' | 'materials'>('messaging');
  const [chats, setChats] = useState<HubChat[]>([]);
  const [messages, setMessages] = useState<HubMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const currentUserId = session.rollNo || session.userId || 'user-me';
  const [userProfile, setUserProfile] = useState<HubUserProfile>(() => storageService.getHubUserProfile(currentUserId));
  
  // Right drawer collapse state
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showNewDirectChatModal, setShowNewDirectChatModal] = useState(false);
  const [showCodeSnippetModal, setShowCodeSnippetModal] = useState(false);

  // Fetch students and faculty for contact directories
  const [students, setStudents] = useState<Student[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);

  // Load initial scoped data and initialize E2EE keys on session switch
  useEffect(() => {
    // 1. Reset active chat pointers & drawers on session switch to prevent state leak
    setActiveChatId(null);
    setIsRightDrawerOpen(false);
    setShowNewDirectChatModal(false);
    setShowCreateGroupModal(false);
    setShowProfileModal(false);

    // 2. Initialize user E2EE key pair
    e2eeService.getOrCreateUserKeyPair(currentUserId).then((keyPair) => {
      storageService.saveUserPublicKey(currentUserId, keyPair.publicKey);
    });

    const loadedChats = storageService.getScopedHubChats(currentUserId, session.role);
    const loadedMessages = storageService.getScopedHubMessages(currentUserId, session.role);
    const loadedStudents = storageService.getStudents();
    const loadedFaculty = storageService.getFaculty();
    const loadedProfile = storageService.getHubUserProfile(currentUserId);

    // Sync session name into profile if not set
    if (!loadedProfile.displayName || loadedProfile.displayName === 'Student User') {
      loadedProfile.displayName = session.name;
      loadedProfile.role = session.role;
      loadedProfile.rollNo = session.rollNo;
    }

    setChats(loadedChats);
    setMessages(loadedMessages);
    setStudents(loadedStudents);
    setFacultyList(loadedFaculty);
    setUserProfile(loadedProfile);

    // Select first pinned chat by default if available
    if (loadedChats.length > 0) {
      setActiveChatId(loadedChats[0].id);
    }
  }, [session.rollNo, session.userId, session.role, currentUserId]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Direct Chat / Group Chat Opener with Deterministic Routing
  const openChat = (targetId: string) => {
    const scoped = storageService.getScopedHubChats(currentUserId, session.role);
    const existing = scoped.find(c => c.id.toLowerCase() === targetId.toLowerCase() || c.id.toLowerCase() === `dm_${targetId.toLowerCase()}`);
    if (existing) {
      setActiveChatId(existing.id);
      storageService.updateHubChat(existing.id, { unreadCount: 0 });
      return;
    }

    // Otherwise create or retrieve deterministic direct chat
    const directChat = storageService.getOrCreateDirectChat(currentUserId, targetId, session.name);
    setChats(storageService.getScopedHubChats(currentUserId, session.role));
    setActiveChatId(directChat.id);
  };

  // Handle Sending a Message
  const handleSendMessage = (msg: HubMessage) => {
    storageService.addHubMessage(msg);
    // Synchronously append to in-memory state to avoid any delay or vanishing
    setMessages(prev => [...prev.filter(m => m.id !== msg.id), msg]);
    // Refresh scoped chats to show the latest snippet
    setChats(storageService.getScopedHubChats(currentUserId, session.role));

    // Play subtle audio chime if enabled
    if (userProfile.soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {
        // AudioContext not allowed without gesture, ignore
      }
    }
  };

  // Handle Emoji Reaction Toggle
  const handleToggleReaction = (messageId: string, emoji: string) => {
    const currentUserName = userProfile.displayName || session.name;
    storageService.toggleMessageReaction(messageId, emoji, currentUserName);
    setMessages(storageService.getScopedHubMessages(currentUserId, session.role));
  };

  // Handle Saving User Profile
  const handleSaveProfile = (updated: HubUserProfile) => {
    setUserProfile(updated);
    storageService.saveHubUserProfile(updated);
  };

  // Handle Creating a Study Group
  const handleCreateGroup = (newGroup: HubChat) => {
    storageService.addHubChat(newGroup);
    setChats(storageService.getScopedHubChats(currentUserId, session.role));
    setActiveChatId(newGroup.id);
  };

  // Handle Selecting / Creating a Direct Peer
  const handleSelectDirectPeer = (chat: HubChat) => {
    const existing = chats.find(c => c.id === chat.id);
    if (!existing) {
      storageService.addHubChat(chat);
      setChats(storageService.getScopedHubChats(currentUserId, session.role));
    }
    setActiveChatId(chat.id);
  };

  // Handle Updating Chat Details (pin, mute, permissions, wallpaper, members)
  const handleUpdateChat = (chatId: string, updates: Partial<HubChat>) => {
    storageService.updateHubChat(chatId, updates);
    setChats(storageService.getScopedHubChats(currentUserId, session.role));
  };

  // Handle Leaving / Deleting Chat
  const handleLeaveOrDeleteChat = (chatId: string) => {
    storageService.deleteHubChat(chatId);
    const remaining = storageService.getScopedHubChats(currentUserId, session.role);
    setChats(remaining);
    setActiveChatId(null);
    setIsRightDrawerOpen(false);
  };

  // Handle Archiving / Unarchiving Chat
  const handleToggleArchive = (chatId: string) => {
    storageService.toggleArchiveHubChat(chatId);
    setChats(storageService.getScopedHubChats(currentUserId, session.role));
  };

  // Handle Sending Code Snippet
  const handleSendCodeSnippet = (snippet: CodeSnippetData, comment?: string) => {
    if (!activeChat) return;

    const currentUserId = session.rollNo || session.userId || 'user-me';
    const newMsg: HubMessage = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: currentUserId,
      senderName: userProfile.displayName || session.name,
      senderRole: session.role,
      senderRollNo: session.rollNo,
      senderHandle: userProfile.handle,
      senderAvatar: userProfile.avatar,
      content: comment || `Shared code snippet: ${snippet.title || snippet.language}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      type: 'code',
      status: 'read',
      codeSnippet: snippet,
      reactions: {}
    };

    handleSendMessage(newMsg);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Suite Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> MPDREC Hub • Real-Time Academic Collaboration
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Academic Messaging & Study Groups Suite</span>
          </h2>
        </div>

        {/* View Switcher: Real-Time Chat vs Notes Archive */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setHubView('messaging')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              hubView === 'messaging'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>MPDREC Messenger</span>
          </button>

          <button
            onClick={() => setHubView('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              hubView === 'materials'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Notes & PYQs ({studyMaterials.length})</span>
          </button>
        </div>
      </div>

      {/* 1. MESSAGING SUITE VIEW (WhatsApp / Telegram Hybrid) */}
      {hubView === 'messaging' && (
        <div className="h-[750px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex relative">
          
          {/* Left Sidebar (Responsive width) */}
          <div className={`${activeChatId ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 xl:w-96 shrink-0 h-full`}>
            <ChatSidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={(id) => {
                setActiveChatId(id);
                // Mark unread as 0
                handleUpdateChat(id, { unreadCount: 0 });
              }}
              onToggleArchive={handleToggleArchive}
              onDeleteChat={handleLeaveOrDeleteChat}
              userProfile={userProfile}
              session={session}
              onOpenProfileSettings={() => setShowProfileModal(true)}
              onOpenCreateGroup={() => setShowCreateGroupModal(true)}
              onOpenNewDirectChat={() => setShowNewDirectChatModal(true)}
            />
          </div>

          {/* Main Chat Area */}
          <div className={`${!activeChatId ? 'hidden lg:flex' : 'flex'} flex-1 h-full min-w-0`}>
            <ChatArea
              chat={activeChat}
              messages={messages}
              userProfile={userProfile}
              session={session}
              onSendMessage={handleSendMessage}
              onToggleReaction={handleToggleReaction}
              onToggleRightDrawer={() => setIsRightDrawerOpen(!isRightDrawerOpen)}
              isRightDrawerOpen={isRightDrawerOpen}
              onOpenCodeSnippetModal={() => setShowCodeSnippetModal(true)}
              onChangeWallpaper={(wpId) => {
                if (activeChat) {
                  handleUpdateChat(activeChat.id, { customWallpaper: wpId });
                }
              }}
              onBackToList={() => setActiveChatId(null)}
            />
          </div>

          {/* Collapsible Right Info Drawer */}
          {isRightDrawerOpen && activeChat && (
            <div className="absolute inset-y-0 right-0 z-30 lg:relative lg:inset-auto">
              <ChatRightDrawer
                chat={activeChat}
                messages={messages}
                session={session}
                userProfile={userProfile}
                students={students}
                facultyList={facultyList}
                onClose={() => setIsRightDrawerOpen(false)}
                onUpdateChat={handleUpdateChat}
                onToggleArchive={handleToggleArchive}
                onLeaveOrDeleteChat={handleLeaveOrDeleteChat}
              />
            </div>
          )}

        </div>
      )}

      {/* 2. STUDY MATERIALS ARCHIVE VIEW */}
      {hubView === 'materials' && (
        <StudyMaterialsHub
          studyMaterials={studyMaterials}
          onAddMaterial={onAddMaterial}
          onLikeMaterial={onLikeMaterial}
          session={session}
        />
      )}

      {/* Modals */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        session={session}
        students={students}
        facultyList={facultyList}
        onCreateGroup={handleCreateGroup}
      />

      <NewDirectChatModal
        isOpen={showNewDirectChatModal}
        onClose={() => setShowNewDirectChatModal(false)}
        session={session}
        students={students}
        facultyList={facultyList}
        existingChats={chats}
        onSelectPeer={handleSelectDirectPeer}
      />

      <CodeSnippetModal
        isOpen={showCodeSnippetModal}
        onClose={() => setShowCodeSnippetModal(false)}
        onSendCode={handleSendCodeSnippet}
      />

    </div>
  );
};
