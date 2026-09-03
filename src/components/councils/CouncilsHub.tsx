import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Users,
  Award,
  ChevronRight,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem, CouncilId } from '../../types/councils';
import { AuthSession } from '../../types/erp';
import { CouncilLogo } from './CouncilLogo';
import { CouncilDetailPage } from './CouncilDetailPage';
import { CouncilSubmissionModal } from './CouncilSubmissionModal';

interface CouncilsHubProps {
  councils: CollegeCouncil[];
  events: CouncilEvent[];
  media: CouncilMediaItem[];
  session: AuthSession;
  onEventSubmitted: (event: CouncilEvent) => void;
  onMediaSubmitted: (media: CouncilMediaItem) => void;
  onApproveMedia: (mediaId: string) => void;
  onRejectMedia: (mediaId: string, reason?: string) => void;
  onApproveEvent: (eventId: string) => void;
  onRejectEvent: (eventId: string, reason?: string) => void;
  onLikeMedia: (mediaId: string) => void;
  onRegisterEvent: (eventId: string) => void;
  onAddMember?: (councilId: string, tier: 'executive' | 'volunteer', member: any) => void;
  onUpdateCouncil?: (council: CollegeCouncil) => void;
}

export const CouncilsHub: React.FC<CouncilsHubProps> = ({
  councils,
  events,
  media,
  session,
  onEventSubmitted,
  onMediaSubmitted,
  onApproveMedia,
  onRejectMedia,
  onApproveEvent,
  onRejectEvent,
  onLikeMedia,
  onRegisterEvent,
  onAddMember,
  onUpdateCouncil
}) => {
  const [selectedCouncilId, setSelectedCouncilId] = useState<CouncilId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Selected Council Object
  const activeCouncil = selectedCouncilId
    ? councils.find(c => c.id === selectedCouncilId) || null
    : null;

  // If a council is selected, render its dedicated profile page seamlessly
  if (activeCouncil) {
    return (
      <CouncilDetailPage
        council={activeCouncil}
        allCouncils={councils}
        session={session}
        events={events}
        media={media}
        onBack={() => setSelectedCouncilId(null)}
        onEventSubmitted={onEventSubmitted}
        onMediaSubmitted={onMediaSubmitted}
        onApproveMedia={onApproveMedia}
        onRejectMedia={onRejectMedia}
        onApproveEvent={onApproveEvent}
        onRejectEvent={onRejectEvent}
        onLikeMedia={onLikeMedia}
        onRegisterEvent={onRegisterEvent}
        onAddMember={onAddMember}
        onUpdateCouncil={onUpdateCouncil}
      />
    );
  }

  // Filter councils by search and category
  const filteredCouncils = councils.filter(council => {
    const matchesSearch =
      council.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      council.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      council.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      council.domains.some(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'tech') return matchesSearch && council.id === 'technical_council';
    if (selectedCategory === 'sports') return matchesSearch && council.id === 'sports_council';
    if (selectedCategory === 'media') return matchesSearch && council.id === 'media_council';
    if (selectedCategory === 'culture') return matchesSearch && council.id === 'cultural_council';
    if (selectedCategory === 'lit') return matchesSearch && council.id === 'literary_council';
    if (selectedCategory === 'hobby') return matchesSearch && council.id === 'hobby_council';
    if (selectedCategory === 'arts') return matchesSearch && council.id === 'fine_arts_council';

    return matchesSearch;
  });

  // Calculate totals
  const totalEvents = events.filter(e => e.moderationStatus === 'approved' || !e.moderationStatus).length;
  const totalMemories = media.filter(m => m.status === 'approved').length;
  const pendingTotal = media.filter(m => m.status === 'pending').length + events.filter(e => e.moderationStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Dynamic Halo Glow Header */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 py-12 sm:py-16">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maa Pateshwari Devi Rajkiya Engineering College</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            Student Councils{' '}
            <span className="text-blue-400">
              Hub
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            The official student governance, extracurricular ecosystem, and creative headquarters of MPDREC.
            Explore our 7 college councils, 5-tier leadership hierarchies, upcoming workshops, and verified media archives.
          </p>

          {/* Quick Metrics & CTA Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center space-x-6 px-6 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-slate-400">Councils: <strong className="text-white">7 Official</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Active Events: <strong className="text-white">{totalEvents}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-slate-400">Media Vault: <strong className="text-white">{totalMemories}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 border border-blue-500/40"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Media / Event Proposal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search councils, events, conveners..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Council Category Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Councils' },
              { id: 'tech', label: 'Technical' },
              { id: 'sports', label: 'Sports' },
              { id: 'media', label: 'Media' },
              { id: 'culture', label: 'Cultural' },
              { id: 'lit', label: 'Literary' },
              { id: 'hobby', label: 'Hobby' },
              { id: 'arts', label: 'Fine Arts' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Glassmorphic Circular Council Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {filteredCouncils.map((council, idx) => {
            const councilEvts = events.filter(e => e.councilId === council.id && (e.moderationStatus === 'approved' || !e.moderationStatus));
            const councilMeds = media.filter(m => m.councilId === council.id && m.status === 'approved');

            return (
              <motion.div
                key={council.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCouncilId(council.id)}
                className="group relative rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 hover:border-blue-500/50 p-6 flex flex-col justify-between shadow-2xl hover:shadow-blue-500/10 cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Ambient Top Corner Light */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: council.themeColor.primary }}
                />

                {/* Top Section: Circular Floating Emblem */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    {/* Glowing Accent Ring */}
                    <div
                      className="absolute -inset-2 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                      style={{ backgroundColor: council.themeColor.primary }}
                    />
                    <CouncilLogo
                      councilId={council.id}
                      size="xl"
                      customSrc={council.logoUrl}
                      interactive={true}
                      className="relative ring-4 ring-slate-900 shadow-2xl bg-slate-900"
                    />
                  </div>

                  {/* Title & Hindi Subtitle */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {council.name}
                    </h3>
                    {council.hindiName && (
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {council.hindiName}
                      </div>
                    )}
                  </div>

                  {/* Short Tagline */}
                  <p className="text-xs text-slate-300 italic line-clamp-2 px-2">
                    "{council.tagline}"
                  </p>
                </div>

                {/* Middle Section: Leadership badges */}
                <div className="my-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 shrink-0">
                      {council.leadership.conveners && council.leadership.conveners.length > 1 ? 'Conveners:' : 'Convener:'}
                    </span>
                    <span className="font-semibold text-slate-200 text-right line-clamp-1">
                      {council.leadership.conveners && council.leadership.conveners.length > 1
                        ? council.leadership.conveners.map(c => c.name).join(', ')
                        : council.leadership.convener.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/60 pt-1.5">
                    <span className="text-slate-400 shrink-0">
                      {council.leadership.heads && council.leadership.heads.length > 1 ? 'Heads:' : 'Council Head:'}
                    </span>
                    <span className="font-semibold text-blue-400 text-right line-clamp-1">
                      {council.leadership.heads && council.leadership.heads.length > 1
                        ? council.leadership.heads.map(h => h.name).join(', ')
                        : council.leadership.head.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/60 pt-1.5">
                    <span className="text-slate-400 shrink-0">
                      {council.leadership.secretaries && council.leadership.secretaries.length > 1 ? 'Secretaries:' : 'Secretary:'}
                    </span>
                    <span className="font-semibold text-teal-400 text-right line-clamp-1">
                      {council.leadership.secretaries && council.leadership.secretaries.length > 1
                        ? council.leadership.secretaries.map(s => s.name).join(', ')
                        : council.leadership.secretary.name}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Micro-stats & CTA Link */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {councilEvts.length} Events
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                      {councilMeds.length} Memories
                    </span>
                  </div>

                  <div className="w-full py-2.5 rounded-2xl bg-slate-800/60 group-hover:bg-blue-600 text-slate-300 group-hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md">
                    <span>Explore Council Portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Universal Submission Modal */}
      <CouncilSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        allCouncils={councils}
        session={session}
        onEventSubmitted={onEventSubmitted}
        onMediaSubmitted={onMediaSubmitted}
      />
    </div>
  );
};
