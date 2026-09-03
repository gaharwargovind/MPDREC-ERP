import React, { useState } from 'react';
import { 
  X, 
  Search, 
  User, 
  GraduationCap, 
  Sparkles, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { HubChat } from '../../types/hub';
import { Student, Faculty, AuthSession } from '../../types/erp';

import { storageService } from '../../services/storageService';

interface NewDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  students: Student[];
  facultyList: Faculty[];
  existingChats: HubChat[];
  onSelectPeer: (chat: HubChat) => void;
}

export const NewDirectChatModal: React.FC<NewDirectChatModalProps> = ({
  isOpen,
  onClose,
  session,
  students,
  facultyList,
  existingChats,
  onSelectPeer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'students' | 'faculty'>('all');

  if (!isOpen) return null;

  const currentUserId = session.rollNo || session.userId || 'user-me';

  // Prepare list of potential direct contacts
  const studentContacts = students
    .filter(s => s.rollNo.trim().toLowerCase() !== currentUserId.trim().toLowerCase())
    .map(s => ({
      id: s.rollNo,
      name: s.name,
      role: 'student' as const,
      avatar: s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      handle: `@${s.name.toLowerCase().replace(/\s+/g, '_')}`,
      badge: `B.Tech ${s.branch || 'CSE'} • Sem ${s.semester || 3}`,
      subText: `Roll: ${s.rollNo}`,
      bioStatus: 'Available for Study Discussion 📚'
    }));

  const facultyContacts = facultyList
    .filter(f => f.facultyId.trim().toLowerCase() !== currentUserId.trim().toLowerCase())
    .map(f => ({
      id: f.facultyId,
      name: f.name,
      role: 'faculty' as const,
      avatar: f.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      handle: `@prof_${f.name.toLowerCase().replace(/\s+/g, '_')}`,
      badge: `${f.designation || 'Faculty'} (${f.department || 'CSE'})`,
      subText: `Faculty ID: ${f.facultyId}`,
      bioStatus: 'Faculty Mentor & Academic Advisor 💡'
    }));

  const allContacts = [...studentContacts, ...facultyContacts];

  const filteredContacts = allContacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.badge.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = 
      activeFilter === 'all' || 
      (activeFilter === 'students' && c.role === 'student') ||
      (activeFilter === 'faculty' && c.role === 'faculty');

    return matchesSearch && matchesType;
  });

  const handleStartChatWithContact = (contact: typeof allContacts[0]) => {
    // Deterministic 1-on-1 direct chat creation / retrieval
    const targetChat = storageService.getOrCreateDirectChat(currentUserId, contact.id, session.name);
    onSelectPeer(targetChat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">New Direct Message</h3>
              <p className="text-xs text-slate-400">Initiate a private 1-on-1 discussion with any student or faculty</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, @handle, roll number, or department..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Directory ({allContacts.length})
            </button>
            <button
              onClick={() => setActiveFilter('students')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Classmates ({studentContacts.length})
            </button>
            <button
              onClick={() => setActiveFilter('faculty')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'faculty'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Faculty Mentors ({facultyContacts.length})
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching students or faculty found for "{searchTerm}"
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleStartChatWithContact(contact)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-blue-500/60 hover:bg-slate-800/60 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate group-hover:text-blue-400 transition-colors">
                        {contact.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{contact.handle}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{contact.badge}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{contact.subText}</div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-[11px] font-bold border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    Chat
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Private Peer-to-Peer Academic Messaging</span>
        </div>

      </div>
    </div>
  );
};
