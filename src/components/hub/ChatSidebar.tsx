import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  MessageSquare, 
  Radio, 
  Pin, 
  Plus, 
  Sparkles, 
  User, 
  Settings, 
  CheckCheck, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Volume2, 
  VolumeX, 
  Filter,
  Check,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { HubChat, HubUserProfile } from '../../types/hub';
import { AuthSession } from '../../types/erp';

interface ChatSidebarProps {
  chats: HubChat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onToggleArchive?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  userProfile: HubUserProfile;
  session: AuthSession;
  onOpenProfileSettings: () => void;
  onOpenCreateGroup: () => void;
  onOpenNewDirectChat: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onToggleArchive,
  onDeleteChat,
  userProfile,
  session,
  onOpenProfileSettings,
  onOpenCreateGroup,
  onOpenNewDirectChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'group' | 'channel'>('all');

  const filteredChats = chats.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subject && c.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = 
      activeFilter === 'all' || 
      (activeFilter === 'direct' && c.type === 'direct') ||
      (activeFilter === 'group' && c.type === 'group') ||
      (activeFilter === 'channel' && c.type === 'channel');

    return matchesSearch && matchesCategory;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const getChatTypeIcon = (type: HubChat['type']) => {
    switch (type) {
      case 'group':
        return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      case 'channel':
        return <Radio className="w-3.5 h-3.5 text-amber-400" />;
      case 'direct':
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 dark:bg-slate-950/90 border-r border-slate-800 backdrop-blur-xl select-none">
      
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
        
        <button
          onClick={onOpenProfileSettings}
          className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-800/70 transition-all text-left group"
          title="Open Profile & Hub Customization"
        >
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
          </div>

          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate max-w-[110px]">
                {userProfile.displayName || session.name}
              </span>
              <span className="text-[10px] font-mono text-blue-400 font-bold hidden sm:inline">
                {userProfile.handle || '@student'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[125px]">
              {userProfile.bioStatus || 'Available 📚'}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenNewDirectChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700/80 hover:border-blue-500/50 transition-all"
            title="New Direct Peer Message"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCreateGroup}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1"
            title="Create Academic Study Group"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="p-3 border-b border-slate-800/80 bg-slate-950/20">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search study groups, peers, subjects..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All ({chats.length})
          </button>

          <button
            onClick={() => setActiveFilter('group')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
              activeFilter === 'group'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3 h-3" /> Study Groups
          </button>

          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
              activeFilter === 'direct'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3 h-3" /> Direct
          </button>

          <button
            onClick={() => setActiveFilter('channel')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
              activeFilter === 'channel'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3 h-3" /> Channels
          </button>
        </div>
      </div>

      <div id="chat-conversations-list" className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedChats.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-300 mb-1">No chats found</div>
            <p className="text-[11px] text-slate-500">
              {searchTerm ? 'Try a different search keyword.' : 'Start a direct chat or create a study group.'}
            </p>
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = activeChatId === chat.id;
            const peerId = chat.type === 'direct' 
              ? (chat.directPeer?.id || (chat.participantIds?.find(id => id.trim().toLowerCase() !== (session.rollNo || session.userId || '').trim().toLowerCase())) || chat.creatorId)
              : undefined;

            return (
              <div
                key={chat.id}
                id={`chat-item-${chat.id}`}
                data-chat-id={chat.id}
                data-recipient-id={peerId}
                data-group-id={chat.type === 'group' ? chat.id : undefined}
                onClick={() => onSelectChat(chat.id)}
                className={`group relative p-2.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${
                  isActive
                    ? 'active-chat bg-blue-600/20 border-blue-500/80 shadow-md shadow-blue-500/10'
                    : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700/80 group-hover:scale-105 transition-transform"
                  />
                  {chat.type === 'direct' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                  )}
                  {chat.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white">
                      <Users className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {chat.type === 'channel' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[9px] text-slate-950">
                      <Radio className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      {chat.type !== 'channel' && (
                        <span title="End-to-End Encrypted Thread" className="shrink-0 flex items-center">
                          <Lock className="w-3 h-3 text-emerald-400" />
                        </span>
                      )}
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-blue-300' : 'text-slate-100'}`}>
                        {chat.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {chat.lastMessage?.timestamp || 'Active'}
                    </span>
                  </div>

                  {chat.subject && chat.type === 'group' && (
                    <div className="text-[10px] font-semibold text-indigo-400 truncate mb-0.5">
                      {chat.subject}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                      {chat.lastMessage ? (
                        <>
                          <span className="text-slate-300 font-medium">{chat.lastMessage.senderName.split(' ')[0]}:</span>
                          <span className="truncate">{chat.lastMessage.content}</span>
                        </>
                      ) : (
                        <span className="italic text-slate-500 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-emerald-400/70 inline" />
                          <span>End-to-End Encrypted • Tap to open</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {chat.isMuted && (
                        <VolumeX className="w-3 h-3 text-slate-500" />
                      )}
                      {chat.isPinned && (
                        <Pin className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      )}
                      {(chat.unreadCount ?? 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black min-w-[18px] text-center shadow-sm">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AES-256-GCM Scoped E2EE</span>
        </span>
        <button
          onClick={onOpenProfileSettings}
          className="hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </button>
      </div>

    </div>
  );
};
