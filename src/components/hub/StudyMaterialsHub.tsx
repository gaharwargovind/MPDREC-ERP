import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Heart, 
  Search, 
  Plus, 
  Sparkles, 
  BookOpen, 
  Tag, 
  Filter,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { StudyMaterial, AuthSession } from '../../types/erp';

interface StudyMaterialsHubProps {
  studyMaterials: StudyMaterial[];
  onAddMaterial: (mat: StudyMaterial) => void;
  onLikeMaterial: (id: string) => void;
  session: AuthSession;
}

export const StudyMaterialsHub: React.FC<StudyMaterialsHubProps> = ({
  studyMaterials,
  onAddMaterial,
  onLikeMaterial,
  session,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newMaterialForm, setNewMaterialForm] = useState({
    title: '',
    subject: 'Data Structures',
    semester: 3,
    type: 'PDF Notes',
    fileSize: '3.4 MB',
    description: '',
    tags: 'DSA, AKTU, Solved, Trees',
  });

  const subjects = [
    'all',
    'Data Structures',
    'Computer Organization & Architecture',
    'Discrete Structures & Logic',
    'Object Oriented Programming',
    'All Subjects Bundle'
  ];

  const types = [
    'all',
    'PDF Notes',
    'AKTU Solved Paper',
    'Cheatsheet',
    'Code Repo'
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialForm.title.trim()) return;

    const created: StudyMaterial = {
      id: `MAT-${Date.now()}`,
      title: newMaterialForm.title.trim(),
      subject: newMaterialForm.subject,
      semester: newMaterialForm.semester,
      uploadedBy: session.name,
      date: new Date().toISOString().split('T')[0],
      fileType: 'pdf',
      type: newMaterialForm.type,
      fileSize: newMaterialForm.fileSize || '2.5 MB',
      description: newMaterialForm.description.trim() || 'Verified semester study guide and question paper solution.',
      downloadCount: 1,
      likes: 1,
      tags: newMaterialForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    onAddMaterial(created);
    setShowUploadModal(false);
    setNewMaterialForm({
      title: '',
      subject: 'Data Structures',
      semester: 3,
      type: 'PDF Notes',
      fileSize: '3.4 MB',
      description: '',
      tags: 'DSA, AKTU, Solved, Trees',
    });
  };

  const filteredMaterials = studyMaterials.filter((m) => {
    const matchSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchSubject = selectedSubject === 'all' || m.subject === selectedSubject;
    const matchType = selectedType === 'all' || (m.type && m.type === selectedType) || (m.fileType && m.fileType === selectedType);

    return matchSearch && matchSubject && matchType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Controls & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>AKTU Academic Notes & Solved Papers Archive</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified syllabus notes, previous year question solutions, and formula cheatsheets
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Notes / PYQ</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, algorithms, subjects, PYQs..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Subject Dropdown */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Course Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All Material Types' : t}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              
              {/* Type Badge & Downloads */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                  {mat.type || mat.fileType || 'PDF Notes'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {mat.fileSize}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 mb-1.5">
                {mat.title}
              </h4>

              {/* Subject */}
              <div className="text-xs font-semibold text-slate-400 mb-2.5">
                {mat.subject} {mat.semester ? `• Sem ${mat.semester}` : ''}
              </div>

              {/* Description */}
              {mat.description && (
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
                  {mat.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {mat.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-400 text-[10px] font-medium border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Footer Row: Uploader, Likes, Download Button */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">By </span>
                <span className="text-slate-300 font-semibold">{mat.uploadedBy.split(' ')[0]}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikeMaterial(mat.id)}
                  className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 flex items-center gap-1 text-xs transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                  <span className="font-mono text-[11px]">{mat.likes}</span>
                </button>

                <a
                  href={`#download-${mat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Starting download for: ${mat.title} (${mat.fileSize})`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Upload Academic Notes or Solved Papers</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newMaterialForm.title}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                  placeholder="e.g. Unit 3 Dynamic Programming AKTU Solved Questions"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newMaterialForm.subject}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    {subjects.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Material Type</label>
                  <select
                    value={newMaterialForm.type}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
                  >
                    {types.filter(t => t !== 'all').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={newMaterialForm.description}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, description: e.target.value })}
                  placeholder="Brief overview of the topics covered and solutions..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newMaterialForm.tags}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, tags: e.target.value })}
                  placeholder="DSA, Trees, AKTU, Solved"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                >
                  Upload & Share
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
