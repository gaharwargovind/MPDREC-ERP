import React, { useState } from 'react';
import { 
  X, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Plus, 
  Check, 
  Upload, 
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { HubChat, ChatMember } from '../../types/hub';
import { Student, Faculty, AuthSession } from '../../types/erp';
import { AVATAR_PRESETS } from '../../data/hubSeedData';
import { AvatarPickerModal } from './AvatarPickerModal';
import { e2eeService } from '../../services/e2eeService';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession;
  students: Student[];
  facultyList: Faculty[];
  onCreateGroup: (group: HubChat) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  session,
  students,
  facultyList,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms (KCS-301)');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80');
  const [onlyAdminsCanPost, setOnlyAdminsCanPost] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [tagsInput, setTagsInput] = useState('DSA, StudyGroup, AKTU');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const toggleMemberSelection = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter(m => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || isCreating) return;

    setIsCreating(true);
    const currentUserId = session.rollNo || session.userId || 'user-me';

    // Build members list including creator as admin
    const members: ChatMember[] = [
      {
        id: currentUserId,
        name: session.name,
        role: 'admin',
        userRole: session.role,
        avatar: session.avatar || avatar,
        handle: `@${session.name.toLowerCase().replace(/\s+/g, '_')}`,
        statusText: 'Group Admin 👑',
        isOnline: true,
        academicBadge: `${session.role === 'student' ? 'Student' : 'Faculty'} • Admin`
      }
    ];

    // Add selected students
    selectedMemberIds.forEach(id => {
      const student = students.find(s => s.rollNo === id);
      if (student) {
        members.push({
          id: student.rollNo,
          name: student.name,
          role: 'member',
          userRole: 'student',
          avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          handle: `@${student.name.toLowerCase().replace(/\s+/g, '_')}`,
          statusText: 'Active Member',
          isOnline: Math.random() > 0.3,
          academicBadge: `B.Tech ${student.branch || 'CSE'} • Sem ${student.semester || 3}`
        });
      }

      const faculty = facultyList.find(f => f.facultyId === id);
      if (faculty) {
        members.push({
          id: faculty.facultyId,
          name: faculty.name,
          role: 'admin',
          userRole: 'faculty',
          avatar: faculty.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          handle: `@prof_${faculty.name.toLowerCase().replace(/\s+/g, '_')}`,
          statusText: 'Faculty Mentor 💡',
          isOnline: true,
          academicBadge: `${faculty.designation || 'Faculty'} (${faculty.department || 'CSE'})`
        });
      }
    });

    // Generate wrapped E2EE Group Keys for all members
    let encryptedGroupKeys;
    try {
      const memberKeys: Record<string, JsonWebKey> = {};
      for (const m of members) {
        const keyPair = await e2eeService.getOrCreateUserKeyPair(m.id);
        memberKeys[m.id] = keyPair.publicKey;
      }
      encryptedGroupKeys = await e2eeService.createGroupKeyPackages(memberKeys);
    } catch (err) {
      console.warn('Group key generation warning:', err);
    }

    const newGroup: HubChat = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: groupName.trim(),
      avatar,
      description: description.trim() || `Official collaborative study group for ${subject}`,
      subject,
      isPinned: false,
      isMuted: false,
      unreadCount: 0,
      creatorId: currentUserId,
      admins: [currentUserId],
      members,
      onlyAdminsCanPost,
      customWallpaper: 'academic-graph',
      createdAt: new Date().toISOString().split('T')[0],
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      encryptedGroupKeys,
      isEncrypted: true,
      encryptionKeyVersion: 1,
      lastMessage: {
        content: `🎉 Group created by ${session.name}. E2EE keys initialized.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName: session.name,
        type: 'text'
      }
    };

    onCreateGroup(newGroup);
    setIsCreating(false);
    onClose();
  };

  const filteredPeers = [
    ...students.map(s => ({ id: s.rollNo, name: s.name, type: 'Student', sub: `${s.rollNo} • ${s.branch}` })),
    ...facultyList.map(f => ({ id: f.facultyId, name: f.name, type: 'Faculty', sub: `${f.department} • ${f.designation}` }))
  ].filter(p => 
    p.name.toLowerCase().includes(searchMember.toLowerCase()) || 
    p.sub.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Create Academic Study Group</h3>
              <p className="text-xs text-slate-400">Launch a subject cohort, project squad or exam prep batch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Group Icon & Name */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt="Group Icon"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
              />
              <button 
                type="button"
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs"
                title="Change Group Photo"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Group Icon & Details</span>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Photo Studio / Camera
                </button>
              </div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Study Group Name (e.g. DSA Prep Batch 💻)"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Course Subject (e.g. Data Structures & Algorithms)"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Group Objective & Rules
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Daily LeetCode problem discussions, AKTU lab assignment reviews, and exam notes sharing..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="DSA, Trees, AKTU, Semester-3"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Admin Permissions Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Broadcast Only Mode</div>
                <div className="text-[11px] text-slate-400">Only group admins and faculty can send messages</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={onlyAdminsCanPost}
              onChange={(e) => setOnlyAdminsCanPost(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-indigo-500"
            />
          </div>

          {/* Member Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Add Peers & Mentors ({selectedMemberIds.length} selected)
              </label>
            </div>

            <input
              type="text"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Search classmates by name, roll no, or faculty..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 mb-2"
            />

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredPeers.map((peer) => {
                const isSelected = selectedMemberIds.includes(peer.id);
                return (
                  <div
                    key={peer.id}
                    onClick={() => toggleMemberSelection(peer.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {peer.name[0]}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{peer.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{peer.sub}</div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Creator will be appointed Group Admin
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Study Group</span>
              </button>
            </div>
          </div>

        </form>

      </div>

      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatar={avatar}
        onSelectAvatar={(newAvatar) => setAvatar(newAvatar)}
        title="Study Group Icon Studio"
      />
    </div>
  );
};
