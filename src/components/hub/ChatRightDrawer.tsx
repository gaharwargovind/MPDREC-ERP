import React, { useState } from 'react';
import { 
  X, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Pin, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Crown, 
  UserPlus, 
  UserMinus, 
  Download, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Trash2, 
  LogOut,
  Sparkles,
  Search,
  Archive,
  ArchiveRestore,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { HubChat, HubMessage, HubUserProfile, ChatMember } from '../../types/hub';
import { AuthSession, Student, Faculty } from '../../types/erp';
import { e2eeService } from '../../services/e2eeService';

interface ChatRightDrawerProps {
  chat: HubChat;
  messages: HubMessage[];
  session: AuthSession;
  userProfile: HubUserProfile;
  students: Student[];
  facultyList: Faculty[];
  onClose: () => void;
  onUpdateChat: (chatId: string, updates: Partial<HubChat>) => void;
  onToggleArchive?: (chatId: string) => void;
  onLeaveOrDeleteChat: (chatId: string) => void;
}

export const ChatRightDrawer: React.FC<ChatRightDrawerProps> = ({
  chat,
  messages,
  session,
  userProfile,
  students,
  facultyList,
  onClose,
  onUpdateChat,
  onToggleArchive,
  onLeaveOrDeleteChat,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'docs' | 'media' | 'code' | 'members'>('members');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberSearch, setNewMemberSearch] = useState('');
  const [memberFilterSearch, setMemberFilterSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentUserId = session.rollNo || session.userId || 'user-me';
  const isAdmin = chat.admins?.includes(currentUserId) || chat.creatorId === currentUserId || session.role === 'admin';

  // Extract shared items from chat messages
  const chatMessages = messages.filter(m => m.chatId === chat.id);
  const sharedDocs = chatMessages.filter(m => m.type === 'file' && m.attachment);
  const sharedMedia = chatMessages.filter(m => m.type === 'image' && m.attachment);
  const sharedCode = chatMessages.filter(m => m.type === 'code' && m.codeSnippet);

  const handleTogglePin = () => {
    onUpdateChat(chat.id, { isPinned: !chat.isPinned });
  };

  const handleToggleMute = () => {
    onUpdateChat(chat.id, { isMuted: !chat.isMuted });
  };

  const handleToggleOnlyAdmins = () => {
    if (!isAdmin) return;
    onUpdateChat(chat.id, { onlyAdminsCanPost: !chat.onlyAdminsCanPost });
  };

  const handleArchive = () => {
    if (onToggleArchive) {
      onToggleArchive(chat.id);
    } else {
      onUpdateChat(chat.id, { isArchived: !chat.isArchived });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isAdmin) return;
    if (memberId === chat.creatorId) {
      alert('Cannot remove the group creator.');
      return;
    }
    const updatedMembers = chat.members?.filter(m => m.id !== memberId) || [];
    const updatedAdmins = chat.admins?.filter(id => id !== memberId);

    // Rotate E2EE Group Keys for remaining members
    let encryptedGroupKeys = chat.encryptedGroupKeys;
    try {
      const memberKeys: Record<string, JsonWebKey> = {};
      for (const m of updatedMembers) {
        const keyPair = await e2eeService.getOrCreateUserKeyPair(m.id);
        memberKeys[m.id] = keyPair.publicKey;
      }
      encryptedGroupKeys = await e2eeService.createGroupKeyPackages(memberKeys);
    } catch (err) {
      console.warn('Key rotation warning:', err);
    }

    onUpdateChat(chat.id, {
      members: updatedMembers,
      admins: updatedAdmins,
      encryptedGroupKeys,
      encryptionKeyVersion: (chat.encryptionKeyVersion || 1) + 1
    });
  };

  const handlePromoteAdmin = (memberId: string) => {
    if (!isAdmin) return;
    const currentAdmins = chat.admins || [];
    if (!currentAdmins.includes(memberId)) {
      const updatedAdmins = [...currentAdmins, memberId];
      const updatedMembers = chat.members?.map(m => m.id === memberId ? { ...m, role: 'admin' as const } : m);
      onUpdateChat(chat.id, { admins: updatedAdmins, members: updatedMembers });
    }
  };

  const handleAddMemberToGroup = async (id: string, name: string, roleType: 'student' | 'faculty') => {
    const isAlready = chat.members?.some(m => m.id === id);
    if (isAlready) return;

    const newMember: ChatMember = {
      id,
      name,
      role: 'member',
      userRole: roleType,
      avatar: roleType === 'student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      statusText: 'Active Member',
      isOnline: true,
      academicBadge: roleType === 'student' ? 'B.Tech Student' : 'Faculty Member'
    };

    const updatedMembers = [...(chat.members || []), newMember];

    // Re-wrap E2EE Group Keys including new member
    let encryptedGroupKeys = chat.encryptedGroupKeys;
    try {
      const memberKeys: Record<string, JsonWebKey> = {};
      for (const m of updatedMembers) {
        const keyPair = await e2eeService.getOrCreateUserKeyPair(m.id);
        memberKeys[m.id] = keyPair.publicKey;
      }
      encryptedGroupKeys = await e2eeService.createGroupKeyPackages(memberKeys);
    } catch (err) {
      console.warn('Group key update warning:', err);
    }

    onUpdateChat(chat.id, {
      members: updatedMembers,
      encryptedGroupKeys,
      encryptionKeyVersion: (chat.encryptionKeyVersion || 1) + 1
    });
    setShowAddMemberModal(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const availablePeers = [
    ...students.map(s => ({ id: s.rollNo, name: s.name, type: 'student' as const, sub: `${s.rollNo} • ${s.branch}` })),
    ...facultyList.map(f => ({ id: f.facultyId, name: f.name, type: 'faculty' as const, sub: `${f.department} • ${f.designation}` }))
  ].filter(p => 
    !chat.members?.some(m => m.id === p.id) &&
    (p.name.toLowerCase().includes(newMemberSearch.toLowerCase()) || p.sub.toLowerCase().includes(newMemberSearch.toLowerCase()))
  );

  return (
    <div className="w-80 lg:w-96 flex flex-col h-full bg-slate-900 border-l border-slate-800 select-none overflow-hidden animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">
          {chat.type === 'direct' ? 'Peer Contact Profile' : 'Study Group Details'}
        </h4>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Profile / Group Card */}
        <div className="flex flex-col items-center text-center p-5 rounded-3xl bg-slate-950/60 border border-slate-800">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-20 h-20 rounded-3xl object-cover border-2 border-blue-500/50 shadow-xl mb-3"
          />
          <h3 className="text-sm font-black text-white">{chat.name}</h3>
          
          {chat.subject && (
            <span className="text-[11px] font-bold text-indigo-400 mt-0.5">
              {chat.subject}
            </span>
          )}

          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {chat.description || 'Academic peer collaboration space at MPDREC'}
          </p>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 w-full">
            <button
              onClick={handleTogglePin}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 font-semibold transition-all ${
                chat.isPinned 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Pin Chat to top"
            >
              <Pin className="w-4 h-4" />
              <span className="text-[10px]">{chat.isPinned ? 'Pinned' : 'Pin'}</span>
            </button>

            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 font-semibold transition-all ${
                chat.isMuted 
                  ? 'bg-red-500/20 border-red-500/50 text-red-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Mute Notifications"
            >
              {chat.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[10px]">{chat.isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={handleArchive}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 font-semibold transition-all ${
                chat.isArchived 
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={chat.isArchived ? "Unarchive Chat" : "Archive Chat"}
            >
              {chat.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              <span className="text-[10px]">{chat.isArchived ? 'Archived' : 'Archive'}</span>
            </button>
          </div>
        </div>

        {/* Group Admin Permissions Box (If user is Admin) */}
        {chat.type === 'group' && isAdmin && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Group Administrator Controls</span>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="text-[11px] text-slate-300">Broadcast Only Mode</div>
              <button
                onClick={handleToggleOnlyAdmins}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chat.onlyAdminsCanPost
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {chat.onlyAdminsCanPost ? 'Admins Only' : 'All Can Post'}
              </button>
            </div>
          </div>
        )}

        {/* Tabbed Shared Media / Members section */}
        <div>
          <div className="flex items-center border-b border-slate-800 gap-1 pb-1">
            {chat.type === 'group' && (
              <button
                onClick={() => setActiveMediaTab('members')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                  activeMediaTab === 'members'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Members ({chat.members?.length || 0})
              </button>
            )}

            <button
              onClick={() => setActiveMediaTab('docs')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMediaTab === 'docs'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Docs ({sharedDocs.length})
            </button>

            <button
              onClick={() => setActiveMediaTab('media')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMediaTab === 'media'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Media ({sharedMedia.length})
            </button>

            <button
              onClick={() => setActiveMediaTab('code')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMediaTab === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Code ({sharedCode.length})
            </button>
          </div>

          <div className="pt-3">
            
            {/* 1. MEMBERS TAB */}
            {activeMediaTab === 'members' && chat.type === 'group' && (
              <div className="space-y-2">
                
                {isAdmin && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full p-2.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors mb-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member / Mentor</span>
                  </button>
                )}

                {/* Member Search Bar */}
                {(chat.members?.length || 0) > 4 && (
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberFilterSearch}
                      onChange={(e) => setMemberFilterSearch(e.target.value)}
                      placeholder="Filter members..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  {(chat.members || [])
                    .filter(m => !memberFilterSearch || m.name.toLowerCase().includes(memberFilterSearch.toLowerCase()) || (m.handle && m.handle.toLowerCase().includes(memberFilterSearch.toLowerCase())))
                    .map((member) => {
                      const isMemberAdmin = chat.admins?.includes(member.id) || member.role === 'admin';
                      const isCreator = member.id === chat.creatorId;

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                                alt={member.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700"
                              />
                              {member.isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              )}
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white truncate">{member.name}</span>
                                {isCreator ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                    Creator
                                  </span>
                                ) : isMemberAdmin ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5 text-amber-400" /> Admin
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {member.academicBadge || member.handle || (member.userRole === 'faculty' ? 'Faculty Member' : 'Student')}
                              </div>
                            </div>
                          </div>

                          {/* Admin member actions */}
                          {isAdmin && member.id !== currentUserId && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!isMemberAdmin && (
                                <button
                                  onClick={() => handlePromoteAdmin(member.id)}
                                  className="p-1 rounded-lg hover:bg-slate-800 text-amber-400"
                                  title="Make Group Admin"
                                >
                                  <Crown className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {!isCreator && (
                                <button
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="p-1 rounded-lg hover:bg-slate-800 text-red-400"
                                  title="Remove from group"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

              </div>
            )}

            {/* 2. DOCUMENTS TAB */}
            {activeMediaTab === 'docs' && (
              <div className="space-y-2">
                {sharedDocs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No documents shared in this chat yet.
                  </div>
                ) : (
                  sharedDocs.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate">{msg.attachment?.name}</div>
                          <div className="text-[10px] text-slate-400">{msg.attachment?.size} • {msg.timestamp}</div>
                        </div>
                      </div>

                      <a
                        href={msg.attachment?.url}
                        download={msg.attachment?.name}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-white shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. MEDIA TAB */}
            {activeMediaTab === 'media' && (
              <div>
                {sharedMedia.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No photos or screenshots shared yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {sharedMedia.map((msg) => (
                      <div
                        key={msg.id}
                        className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 group cursor-pointer"
                      >
                        <img
                          src={msg.attachment?.thumbnailUrl || msg.attachment?.url}
                          alt="Shared Media"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. CODE TAB */}
            {activeMediaTab === 'code' && (
              <div className="space-y-2">
                {sharedCode.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No code snippets shared yet.
                  </div>
                ) : (
                  sharedCode.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          {msg.codeSnippet?.title || `${msg.codeSnippet?.language}.cpp`}
                        </span>
                        <button
                          onClick={() => handleCopyCode(msg.id, msg.codeSnippet?.code || '')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
                        >
                          {copiedSnippetId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSnippetId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Shared by {msg.senderName} • {msg.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>

        {/* Delete / Archive / Leave Options */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          {chat.type === 'group' ? (
            <>
              {isAdmin ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full p-2.5 rounded-2xl bg-red-950/30 hover:bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Study Group</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to leave this study group?')) {
                      onLeaveOrDeleteChat(chat.id);
                    }
                  }}
                  className="w-full p-2.5 rounded-2xl bg-red-950/30 hover:bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave Study Group</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-2.5 rounded-2xl bg-red-950/30 hover:bg-red-950/50 border border-red-800/60 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Conversation</span>
            </button>
          )}

          <button
            onClick={handleArchive}
            className="w-full p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {chat.isArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4 text-indigo-400" />
                <span>Unarchive Conversation</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 text-slate-400" />
                <span>Archive Conversation</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-white">
                {chat.type === 'group' ? 'Delete Study Group?' : 'Delete Conversation?'}
              </h4>
              <p className="text-xs text-slate-400">
                {chat.type === 'group'
                  ? `Are you sure you want to delete "${chat.name}"? This action will remove this study group for all members.`
                  : `Are you sure you want to delete this chat with ${chat.name}? All message history will be removed.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onLeaveOrDeleteChat(chat.id);
                }}
                className="py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Add Peer to Study Group</h4>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={newMemberSearch}
                onChange={(e) => setNewMemberSearch(e.target.value)}
                placeholder="Search students or faculty..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {availablePeers.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">No peers found.</div>
              ) : (
                availablePeers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAddMemberToGroup(p.id, p.name, p.type)}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.sub}</div>
                    </div>
                    <span className="text-[11px] font-bold text-blue-400">Add</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
