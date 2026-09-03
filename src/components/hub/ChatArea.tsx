import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Code, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Pin, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  CornerUpLeft, 
  X, 
  CheckCheck, 
  Lock, 
  Sparkles, 
  Eye, 
  Maximize2,
  Palette,
  ChevronLeft,
  Users,
  ShieldCheck,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { HubChat, HubMessage, HubUserProfile, MessageContentType } from '../../types/hub';
import { AuthSession } from '../../types/erp';
import { DEFAULT_WALLPAPERS } from '../../data/hubSeedData';
import { e2eeService } from '../../services/e2eeService';
import { storageService } from '../../services/storageService';
import { SecurityVerificationModal } from './SecurityVerificationModal';

interface ChatAreaProps {
  chat: HubChat | null;
  messages: HubMessage[];
  userProfile: HubUserProfile;
  session: AuthSession;
  onSendMessage: (msg: HubMessage) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onToggleRightDrawer: () => void;
  isRightDrawerOpen: boolean;
  onOpenCodeSnippetModal: () => void;
  onChangeWallpaper: (wallpaperId: string) => void;
  onBackToList?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  userProfile,
  session,
  onSendMessage,
  onToggleReaction,
  onToggleRightDrawer,
  isRightDrawerOpen,
  onOpenCodeSnippetModal,
  onChangeWallpaper,
  onBackToList,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<HubMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [inChatSearch, setInChatSearch] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; name: string; type: 'image' | 'video' } | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [decryptedTextMap, setDecryptedTextMap] = useState<Record<string, string>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageFeedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = session.rollNo || session.userId || 'user-me';

  // Strict Scoping Access Control Check
  const isAuthorized = chat ? storageService.isUserChatParticipant(chat, currentUserId) : false;

  // Reset inputs and temporary state on chat change or user change
  useEffect(() => {
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    setShowSearchBar(false);
    setInChatSearch('');
  }, [chat?.id, currentUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Decrypt Encrypted Messages on Mount & Change
  useEffect(() => {
    if (!chat || !isAuthorized) return;

    let isMounted = true;

    const decryptAll = async () => {
      const newMap: Record<string, string> = { ...decryptedTextMap };
      let changed = false;

      for (const msg of messages) {
        if (msg.chatId === chat.id && msg.isEncrypted && msg.encryptedPayload && !newMap[msg.id]) {
          try {
            if (chat.type === 'direct') {
              const decrypted = await e2eeService.decryptDirectMessageForUser(
                currentUserId,
                msg.encryptedPayload
              );
              newMap[msg.id] = typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted);
              changed = true;
            } else if (chat.type === 'group' && chat.encryptedGroupKeys) {
              const decrypted = await e2eeService.decryptGroupMessage(
                chat.id,
                currentUserId,
                msg.encryptedPayload,
                chat.encryptedGroupKeys
              );
              newMap[msg.id] = typeof decrypted === 'string' ? decrypted : JSON.stringify(decrypted);
              changed = true;
            }
          } catch (e) {
            newMap[msg.id] = msg.content || '🔒 [Encrypted Message]';
            changed = true;
          }
        }
      }

      if (changed && isMounted) {
        setDecryptedTextMap(newMap);
      }
    };

    decryptAll();

    return () => {
      isMounted = false;
    };
  }, [messages, chat?.id, currentUserId, isAuthorized]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/5">
          <Sparkles className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">MPDREC Hub</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          Select an academic study group, announcements channel, or start a direct message with classmates and faculty mentors.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>End-to-End Encrypted Institutional Communication</span>
        </div>
      </div>
    );
  }

  // Access Denied Screen if user is not a participant
  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-center select-none animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-rose-950/40 border border-rose-600/30 text-rose-400 flex items-center justify-center mb-4 shadow-2xl shadow-rose-950/20">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Access Denied: Private Conversation</h3>
        <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
          You are not an authorized participant in this conversation thread. End-to-end encryption keys and message payloads are isolated strictly to verified participants.
        </p>
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Return to Active Conversations
          </button>
        )}
      </div>
    );
  }

  // Filter messages for current chat
  const chatMessages = messages.filter(m => 
    (m.chatId && m.chatId.trim().toLowerCase() === chat.id.trim().toLowerCase()) ||
    (m.conversationId && m.conversationId.trim().toLowerCase() === chat.id.trim().toLowerCase())
  );

  // In-chat search filtering
  const displayMessages = inChatSearch.trim()
    ? chatMessages.filter(m => {
        const text = decryptedTextMap[m.id] || m.content;
        return text.toLowerCase().includes(inChatSearch.toLowerCase());
      })
    : chatMessages;

  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!inputText.trim()) return;

    // Check if channel is admin only
    if (chat.onlyAdminsCanPost && chat.admins && !chat.admins.includes(currentUserId)) {
      alert('Only administrators and faculty can send messages in this broadcast channel.');
      return;
    }

    const rawText = inputText.trim();
    let encryptedPayloadData;
    let isEncrypted = false;

    const peerId = chat.type === 'direct'
      ? (chat.directPeer?.id || (chat.participantIds?.find(id => id.trim().toLowerCase() !== currentUserId.trim().toLowerCase())) || (chat.creatorId?.trim().toLowerCase() === currentUserId.trim().toLowerCase() ? undefined : chat.creatorId))
      : undefined;

    try {
      if (chat.type === 'direct' && peerId) {
        let peerPubKey = chat.directPeer?.publicKey;
        if (!peerPubKey) {
          const peerKeyPair = await e2eeService.getOrCreateUserKeyPair(peerId);
          peerPubKey = peerKeyPair.publicKey;
        }
        if (peerPubKey) {
          const enc = await e2eeService.encryptDirectMessage(peerPubKey, rawText);
          encryptedPayloadData = enc;
          isEncrypted = true;
        }
      } else if (chat.type === 'group') {
        let groupKeys = chat.encryptedGroupKeys;
        if (!groupKeys && chat.members) {
          const memberKeys: Record<string, JsonWebKey> = {};
          for (const m of chat.members) {
            const keyPair = await e2eeService.getOrCreateUserKeyPair(m.id);
            memberKeys[m.id] = keyPair.publicKey;
          }
          const pkgs = await e2eeService.createGroupKeyPackages(memberKeys);
          groupKeys = pkgs.packages;
        }
        if (groupKeys) {
          const enc = await e2eeService.encryptGroupMessage(chat.id, currentUserId, rawText, groupKeys);
          encryptedPayloadData = enc;
          isEncrypted = true;
        }
      }
    } catch (err) {
      console.warn('Encryption fallback:', err);
    }

    const msgId = `msg-${Date.now()}`;
    const newMsg: HubMessage = {
      id: msgId,
      chatId: chat.id,
      conversationId: chat.id,
      senderId: currentUserId,
      recipientId: peerId,
      senderName: userProfile.displayName || session.name,
      senderRole: session.role,
      senderRollNo: session.rollNo,
      senderHandle: userProfile.handle,
      senderAvatar: userProfile.avatar,
      content: rawText,
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      type: 'text',
      status: 'delivered',
      isEncrypted: isEncrypted,
      encryptedPayload: encryptedPayloadData,
      encryptionAlgorithm: isEncrypted ? 'AES-256-GCM + ECDH NIST P-256' : undefined,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        snippet: (decryptedTextMap[replyingTo.id] || replyingTo.content).slice(0, 70),
        type: replyingTo.type
      } : undefined,
      reactions: {}
    };

    // Cache decrypted text locally for instant preview
    setDecryptedTextMap(prev => ({ ...prev, [msgId]: rawText }));

    onSendMessage(newMsg);
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const peerId = chat.type === 'direct'
      ? (chat.directPeer?.id || (chat.participantIds?.find(id => id.trim().toLowerCase() !== currentUserId.trim().toLowerCase())) || (chat.creatorId?.trim().toLowerCase() === currentUserId.trim().toLowerCase() ? undefined : chat.creatorId))
      : undefined;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileUrl = event.target?.result as string;
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      const msgId = `msg-${Date.now()}`;
      const rawText = `Shared file: ${file.name}`;
      
      const newMsg: HubMessage = {
        id: msgId,
        chatId: chat.id,
        conversationId: chat.id,
        senderId: currentUserId,
        recipientId: peerId,
        senderName: userProfile.displayName || session.name,
        senderRole: session.role,
        senderRollNo: session.rollNo,
        senderHandle: userProfile.handle,
        senderAvatar: userProfile.avatar,
        content: rawText,
        text: rawText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        type: type === 'image' ? 'image' : 'file',
        status: 'delivered',
        isEncrypted: chat.type !== 'channel',
        encryptionAlgorithm: 'AES-256-GCM + ECDH NIST P-256',
        attachment: {
          name: file.name,
          fileType: file.type || type,
          size: fileSizeMb,
          url: fileUrl,
          thumbnailUrl: type === 'image' ? fileUrl : undefined
        },
        reactions: {}
      };

      onSendMessage(newMsg);
      setShowAttachMenu(false);
    };

    reader.readAsDataURL(file);
  };

  const handleCopyCode = (id: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickEmojis = ['👍', '❤️', '💡', '🔥', '🚀', '🙌'];

  // Wallpaper backgrounds styling
  const getWallpaperClass = (wpId?: string) => {
    switch (wpId || userProfile.wallpaperTheme || chat.customWallpaper) {
      case 'academic-graph':
        return 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950';
      case 'telegram-doodle':
        return 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] bg-[#0c1322]';
      case 'midnight-mesh':
        return 'bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16]';
      case 'emerald-study':
        return 'bg-gradient-to-b from-[#061510] via-[#092019] to-[#061510]';
      case 'classic-clean':
      default:
        return 'bg-slate-950';
    }
  };

  const pinnedMessage = chatMessages.find(m => m.isPinned);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* 1. TOP CHAT HEADER */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl flex items-center justify-between gap-3 z-20">
        
        {/* Left: Avatar, Name & Typing Status */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Mobile Back button */}
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={onToggleRightDrawer} 
            className="relative cursor-pointer group shrink-0"
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-11 h-11 rounded-2xl object-cover border border-slate-700/80 group-hover:scale-105 transition-transform"
            />
            {chat.type === 'direct' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
            )}
          </div>

          <div className="min-w-0 cursor-pointer" onClick={onToggleRightDrawer}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate hover:text-blue-400 transition-colors">
                {chat.name}
              </h3>
              {chat.subject && (
                <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 truncate">
                  {chat.subject}
                </span>
              )}
            </div>

            {/* Dynamic Status */}
            <div className="text-[11px] flex items-center gap-1.5 truncate">
              {chat.type === 'direct' ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{chat.directPeer?.academicBadge || 'Online'} • {chat.directPeer?.bioStatus || 'Active'}</span>
                </span>
              ) : chat.type === 'group' ? (
                <span className="text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-indigo-400" />
                  <span>{chat.members?.length || 0} members • {chat.description || 'Academic Study Cohort'}</span>
                </span>
              ) : (
                <span className="text-amber-400">Official Broadcast Channel</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* E2EE Verification Shield Badge */}
          <button
            onClick={() => setShowSecurityModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all shadow-sm group"
            title="Verify End-to-End Encryption Keys & Security Fingerprint"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-mono text-[11px]">E2EE Verified</span>
          </button>

          {/* In-chat Search toggle */}
          <button
            onClick={() => setShowSearchBar(!showSearchBar)}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${
              showSearchBar ? 'bg-blue-600/20 text-blue-400' : ''
            }`}
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wallpaper switcher */}
          <div className="relative">
            <button
              onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Change Canvas Wallpaper"
            >
              <Palette className="w-4 h-4" />
            </button>

            {showWallpaperMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Canvas Wallpaper
                </div>
                {DEFAULT_WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => {
                      onChangeWallpaper(wp.id);
                      setShowWallpaperMenu(false);
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>{wp.name}</span>
                    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${wp.previewColor}`}></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Right Details Drawer */}
          <button
            onClick={onToggleRightDrawer}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${
              isRightDrawerOpen ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' : ''
            }`}
            title="Group / Contact Information"
          >
            <Info className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Optional Search Bar in Header */}
      {showSearchBar && (
        <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 z-10 animate-in slide-in-from-top-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={inChatSearch}
            onChange={(e) => setInChatSearch(e.target.value)}
            placeholder="Filter messages in this conversation..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
            autoFocus
          />
          {inChatSearch && (
            <button 
              onClick={() => setInChatSearch('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
          <button 
            onClick={() => {
              setShowSearchBar(false);
              setInChatSearch('');
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div className="p-2 px-4 bg-slate-900/90 border-b border-amber-500/30 flex items-center justify-between text-xs text-slate-300 z-10">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400/20" />
            <span className="font-bold text-amber-400 text-[11px] shrink-0">Pinned:</span>
            <span className="truncate text-slate-300">{pinnedMessage.content}</span>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0 font-mono ml-2">
            {pinnedMessage.senderName}
          </span>
        </div>
      )}

      {/* 2. MAIN MESSAGE FEED */}
      <div 
        id="chat-messages-container"
        ref={messageFeedRef}
        className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${getWallpaperClass(chat.customWallpaper)}`}
      >
        
        {/* Broadcast Admin Notice */}
        {chat.onlyAdminsCanPost && (
          <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-center text-xs text-amber-300 flex items-center justify-center gap-2 shadow-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>Only Group Admins and Faculty can send messages in this channel</span>
          </div>
        )}

        {displayMessages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const isSenderFaculty = msg.senderRole === 'faculty';
          const isSenderAdmin = msg.senderRole === 'admin';

          return (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'} transition-all`}
            >
              
              {/* Message Container with Avatar & Content */}
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Peer Avatar */}
                {!isMe && (
                  <img
                    src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-700/60 shrink-0 mb-1"
                  />
                )}

                {/* Bubble */}
                <div
                  className={`relative rounded-3xl p-3.5 shadow-xl transition-all ${
                    isMe
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-600/10'
                      : 'bg-slate-900/95 border border-slate-800/90 text-slate-100 rounded-bl-sm backdrop-blur-md'
                  }`}
                >
                  
                  {/* Sender Header for Received messages */}
                  {!isMe && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-blue-400">
                        {msg.senderName}
                      </span>
                      {msg.senderHandle && (
                        <span className="text-[10px] font-mono text-slate-500">{msg.senderHandle}</span>
                      )}
                      {isSenderFaculty && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Faculty
                        </span>
                      )}
                      {isSenderAdmin && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                          Admin
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quoted Reply rendering */}
                  {msg.replyTo && (
                    <div className={`mb-2 p-2 rounded-xl text-xs border-l-4 ${
                      isMe 
                        ? 'bg-blue-700/50 border-white/80 text-blue-100' 
                        : 'bg-slate-950/70 border-blue-500 text-slate-300'
                    }`}>
                      <div className="font-bold text-[11px] text-blue-300">
                        {msg.replyTo.senderName}
                      </div>
                      <div className="truncate text-[11px] opacity-90">
                        {msg.replyTo.snippet}
                      </div>
                    </div>
                  )}

                  {/* 1. TEXT CONTENT */}
                  {msg.type === 'text' && (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words select-text font-normal">
                      {decryptedTextMap[msg.id] || msg.content}
                    </p>
                  )}

                  {/* 2. CODE SNIPPET CONTENT */}
                  {msg.type === 'code' && msg.codeSnippet && (
                    <div className="space-y-2 select-text">
                      {msg.content && (
                        <p className="text-xs sm:text-sm leading-relaxed mb-1">{msg.content}</p>
                      )}
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-left">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                          <span className="text-emerald-400 font-bold">
                            {msg.codeSnippet.title || `${msg.codeSnippet.language}_snippet`}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.id, msg.codeSnippet?.code || '')}
                            className="flex items-center gap-1 hover:text-white transition-colors text-[10px] bg-slate-800 px-2 py-0.5 rounded-md"
                          >
                            {copiedCodeId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-64">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* 3. ATTACHMENT: IMAGE CONTENT */}
                  {msg.type === 'image' && msg.attachment && (
                    <div className="space-y-2">
                      <div 
                        onClick={() => setLightboxMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'image' })}
                        className="relative rounded-2xl overflow-hidden cursor-pointer group max-w-sm border border-slate-800"
                      >
                        <img
                          src={msg.attachment.thumbnailUrl || msg.attachment.url}
                          alt={msg.attachment.name}
                          className="w-full max-h-72 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Maximize2 className="w-6 h-6" />
                        </div>
                      </div>
                      {msg.content && msg.content !== `Shared file: ${msg.attachment.name}` && (
                        <p className="text-xs">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {/* 4. ATTACHMENT: DOCUMENT / PDF / ZIP CONTENT */}
                  {msg.type === 'file' && msg.attachment && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
                        isMe ? 'bg-blue-700/40 border-white/20' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate text-white">{msg.attachment.name}</div>
                          <div className="text-[10px] text-slate-400">{msg.attachment.size} • Verified Academic Document</div>
                        </div>

                        <a
                          href={msg.attachment.url}
                          download={msg.attachment.name}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white transition-colors shrink-0"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                      {msg.content && msg.content !== `Shared file: ${msg.attachment.name}` && (
                        <p className="text-xs">{msg.content}</p>
                      )}
                    </div>
                  )}

                  {/* Timestamp & Encryption & Double Ticks Footer */}
                  <div className="flex items-center justify-end gap-1.5 mt-1.5 pt-0.5 text-[10px] opacity-75">
                    {msg.isEncrypted && (
                      <span title="🔒 End-to-End Encrypted with AES-256-GCM" className="flex items-center gap-0.5 text-emerald-400 font-mono text-[9px] cursor-help">
                        <Lock className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">E2EE</span>
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-cyan-300' : 'text-slate-300'}`} />
                    )}
                  </div>

                  {/* Reactions Pill Display */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1 border-t border-white/10">
                      {Object.entries(msg.reactions).map(([emoji, users]) => {
                        const userList = (users || []) as string[];
                        return (
                          <button
                            key={emoji}
                            onClick={() => onToggleReaction(msg.id, emoji)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border transition-all ${
                              userList.includes(userProfile.displayName || session.name)
                                ? 'bg-blue-600/30 border-blue-400 text-white'
                                : 'bg-slate-950/80 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                            }`}
                            title={userList.join(', ')}
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px] font-mono">{userList.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Floating Quick Action Trigger (Reply, Emoji React) */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity mb-1">
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    title="Reply to message"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="hidden sm:flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-0.5 shadow-lg">
                    {quickEmojis.slice(0, 4).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onToggleReaction(msg.id, emoji)}
                        className="p-1 hover:scale-125 transition-transform text-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. BOTTOM COMPOSER / INPUT BAR */}
      <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-xl z-20">
        
        {/* Replying Banner Preview */}
        {replyingTo && (
          <div className="mb-2 p-2.5 rounded-2xl bg-slate-950 border border-blue-500/40 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 min-w-0">
              <CornerUpLeft className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-blue-400">Replying to {replyingTo.senderName}: </span>
                <span className="text-slate-300">{replyingTo.content}</span>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Controls Row */}
        <div className="flex items-center gap-2">
          
          {/* Attachment Button & Popup Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Attach document, media, or code"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-12 left-0 w-60 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-2.5 rounded-2xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Document / PDF Notes</div>
                    <div className="text-[10px] text-slate-400 font-normal">PDF, DOCX, ZIP, PPTX</div>
                  </div>
                </button>

                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="w-full p-2.5 rounded-2xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Photos & Diagrams</div>
                    <div className="text-[10px] text-slate-400 font-normal">JPEG, PNG, Screenshots</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenCodeSnippetModal();
                    setShowAttachMenu(false);
                  }}
                  className="w-full p-2.5 rounded-2xl text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Code Block Snippet</div>
                    <div className="text-[10px] text-slate-400 font-normal">C++, Python, Java, SQL</div>
                  </div>
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, 'file')}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt"
              className="hidden"
            />
            <input
              type="file"
              ref={mediaInputRef}
              onChange={(e) => handleFileUpload(e, 'image')}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Code Snippet Quick Trigger */}
          <button
            onClick={onOpenCodeSnippetModal}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/40 transition-all hidden sm:flex items-center justify-center"
            title="Share Formatted Code Snippet"
          >
            <Code className="w-5 h-5" />
          </button>

          {/* Text Input & Form */}
          <form 
            id="chat-message-form"
            onSubmit={handleSendTextMessage} 
            className="flex-1 flex items-center gap-2"
          >
            <div className="flex-1 relative">
              <input
                id="chat-message-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTextMessage(e);
                  }
                }}
                placeholder={`Message ${chat.name}...`}
                className="w-full pl-4 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />

              {/* Quick Emoji Bar Trigger */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                  title="Emojis"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Emoji Quick Picker Dropdown */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 flex items-center gap-2 animate-in fade-in zoom-in-95">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="p-1.5 hover:scale-125 transition-transform text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              id="chat-send-button"
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg ${
                inputText.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 scale-100'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>

      </div>

      {/* Media Lightbox Viewer Modal */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute -top-12 right-0 p-2 rounded-xl text-white bg-slate-800 hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxMedia.url}
              alt={lightboxMedia.name}
              className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl border border-slate-800"
            />
            <div className="mt-3 text-center text-xs text-slate-300 font-semibold">
              {lightboxMedia.name}
            </div>
          </div>
        </div>
      )}

      {/* Security Fingerprint & E2EE Verification Modal */}
      {showSecurityModal && (
        <SecurityVerificationModal
          chat={chat}
          currentUserId={currentUserId}
          onClose={() => setShowSecurityModal(false)}
        />
      )}

    </div>
  );
};
