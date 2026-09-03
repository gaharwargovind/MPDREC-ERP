import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Mail,
  Instagram,
  Youtube,
  Github,
  MessageCircle,
  ExternalLink,
  Plus,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Share2,
  ChevronRight,
  Info,
  UserPlus,
  Search,
  Filter,
  Camera,
  RotateCcw,
  Upload,
  Loader2
} from 'lucide-react';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem, CouncilMember } from '../../types/councils';
import { AuthSession } from '../../types/erp';
import { storageService } from '../../services/storageService';
import { supabaseSyncService } from '../../services/supabaseSyncService';
import { SEED_COUNCILS } from '../../data/councilsData';
import { CouncilLogo } from './CouncilLogo';
import { CouncilMediaLightbox } from './CouncilMediaLightbox';
import { CouncilSubmissionModal } from './CouncilSubmissionModal';

interface CouncilDetailPageProps {
  council: CollegeCouncil;
  allCouncils: CollegeCouncil[];
  session: AuthSession;
  events: CouncilEvent[];
  media: CouncilMediaItem[];
  onBack: () => void;
  onEventSubmitted: (event: CouncilEvent) => void;
  onMediaSubmitted: (media: CouncilMediaItem) => void;
  onApproveMedia: (mediaId: string) => void;
  onRejectMedia: (mediaId: string, reason?: string) => void;
  onApproveEvent: (eventId: string) => void;
  onRejectEvent: (eventId: string, reason?: string) => void;
  onLikeMedia: (mediaId: string) => void;
  onRegisterEvent: (eventId: string) => void;
  onAddMember?: (councilId: string, tier: 'executive' | 'volunteer', member: CouncilMember) => void;
  onUpdateCouncil?: (council: CollegeCouncil) => void;
}

type TabType = 'overview' | 'leadership' | 'events' | 'gallery' | 'moderation';

export const CouncilDetailPage: React.FC<CouncilDetailPageProps> = ({
  council,
  allCouncils,
  session,
  events,
  media,
  onBack,
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
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedMedia, setSelectedMedia] = useState<CouncilMediaItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [nominateTier, setNominateTier] = useState<'executive' | 'volunteer'>('executive');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [hasCustomLogo, setHasCustomLogo] = useState<boolean>(() => Boolean(storageService.getCustomCouncilLogo(council.id)));
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);

  // Sync custom logo state on change
  useEffect(() => {
    const checkLogo = () => {
      setHasCustomLogo(Boolean(storageService.getCustomCouncilLogo(council.id)));
    };
    checkLogo();
    window.addEventListener('mpdrec_council_logo_changed', checkLogo);
    return () => window.removeEventListener('mpdrec_council_logo_changed', checkLogo);
  }, [council.id]);

  const handleLogoChange = (newUrl: string) => {
    storageService.setCustomCouncilLogo(council.id, newUrl);
    setHasCustomLogo(true);
    if (onUpdateCouncil) {
      onUpdateCouncil({ ...council, logoUrl: newUrl });
    }
  };

  const handleResetLogo = () => {
    storageService.removeCustomCouncilLogo(council.id);
    setHasCustomLogo(false);
    const defaultSeed = SEED_COUNCILS.find(c => c.id === council.id);
    const defaultUrl = defaultSeed?.logoUrl || '';
    if (onUpdateCouncil) {
      onUpdateCouncil({ ...council, logoUrl: defaultUrl });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingLogo(true);
      try {
        const finalUrl = await supabaseSyncService.uploadCouncilLogo(council.id, file);
        handleLogoChange(finalUrl);
      } catch (err) {
        console.error('Failed to upload council emblem:', err);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  // Filter items specific to this council
  const councilEvents = events.filter(e => e.councilId === council.id);
  const councilMedia = media.filter(m => m.councilId === council.id);

  // Filter approved items for public tabs
  const approvedEvents = councilEvents.filter(e => e.moderationStatus === 'approved' || !e.moderationStatus);
  const approvedMedia = councilMedia.filter(m => m.status === 'approved');

  // Pending items for Moderation Desk
  const pendingEvents = councilEvents.filter(e => e.moderationStatus === 'pending');
  const pendingMedia = councilMedia.filter(m => m.status === 'pending');

  const pendingCount = pendingEvents.length + pendingMedia.length;

  // Authority check for Moderation Desk
  const isSuperAdmin = session.role === 'admin';
  const isFacultyConvener = session.role === 'faculty';
  const isCouncilHeadOrSec = session.role === 'student' && (session.studentYear === 4 || session.studentYear === 3);
  const hasModerationAccess = isSuperAdmin || isFacultyConvener || isCouncilHeadOrSec;

  const handleEventRegistration = (eventId: string) => {
    onRegisterEvent(eventId);
    setRegisteredEvents(prev => new Set(prev).add(eventId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Dynamic Council Hero Banner */}
      <div className="relative w-full min-h-[380px] sm:min-h-[420px] overflow-hidden border-b border-slate-800 flex flex-col justify-between">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={council.bannerUrl}
            alt={council.name}
            className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, ${council.themeColor.primary} 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Top Navigation Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-semibold">Back to Councils Hub</span>
          </button>

          <div className="flex items-center space-x-3">
            {/* Quick Action: Submit Media / Event */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Media / Event</span>
            </button>

            {/* Moderation Desk Pill with counter */}
            {hasModerationAccess && (
              <button
                onClick={() => setActiveTab('moderation')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-sm font-bold backdrop-blur-md transition-all ${
                  activeTab === 'moderation'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:text-amber-400 hover:border-amber-500/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Moderation Desk</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Council Profile Identity */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-6 pt-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* 3D Floating Circular Logo */}
            <div className="relative group flex flex-col items-center">
              <div
                className="absolute -inset-2 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: council.themeColor.primary }}
              />
              <CouncilLogo
                councilId={council.id}
                size="2xl"
                customSrc={council.logoUrl}
                allowUpload={true}
                onLogoChange={handleLogoChange}
                className="relative ring-4 ring-slate-900/80 shadow-2xl bg-slate-900"
              />
              
              {/* Change / Reset Action Badges */}
              <div className="mt-2.5 flex items-center gap-1.5 z-20">
                <label className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${isUploadingLogo ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'} border border-slate-700/80 shadow-md transition-all`}>
                  {isUploadingLogo ? (
                    <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 text-blue-400" />
                  )}
                  <span>{isUploadingLogo ? 'Uploading...' : 'Change Emblem'}</span>
                  <input type="file" accept="image/*" disabled={isUploadingLogo} className="hidden" onChange={handleFileSelect} />
                </label>
                {hasCustomLogo && !isUploadingLogo && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    title="Restore default council emblem"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 shadow-md transition-all"
                  >
                    <RotateCcw className="w-3 h-3 text-red-400" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Title & Tagline & Hindi Name */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${council.themeColor.badgeBg}`}>
                  Official Student Body
                </span>
                {council.hindiName && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/60 text-slate-300">
                    {council.hindiName}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-800 text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {council.meetingVenue.split('/')[0]}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {council.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-medium italic max-w-3xl">
                "{council.tagline}"
              </p>

              {/* Social Channels & Contact info */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
                <a
                  href={`mailto:${council.socials.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  {council.socials.email}
                </a>
                {council.socials.instagram && (
                  <span className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    {council.socials.instagram}
                  </span>
                )}
                {council.socials.github && (
                  <a
                    href={council.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-300" />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Micro Stats Widget */}
            <div className="hidden lg:grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-center shrink-0">
              <div className="px-3">
                <div className="text-xl font-black text-white">{approvedEvents.length}</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Events</div>
              </div>
              <div className="px-3 border-x border-slate-800">
                <div className="text-xl font-black text-white">{approvedMedia.length}</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Memories</div>
              </div>
              <div className="px-3">
                <div className="text-xl font-black text-white">{council.stats.achievementsCount}+</div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Awards</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-1 sm:space-x-3 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Overview & Mission</span>
            </button>

            <button
              onClick={() => setActiveTab('leadership')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'leadership'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Leadership & 5-Tier Hierarchy</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Workshops ({approvedEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media & Memories ({approvedMedia.length})</span>
            </button>

            {hasModerationAccess && (
              <button
                onClick={() => setActiveTab('moderation')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === 'moderation'
                    ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/30'
                    : 'text-amber-400 hover:bg-amber-950/40 border border-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Moderation Desk</span>
                {pendingCount > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & MISSION */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Mission & Description Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  About {council.name}
                </h3>
                <p className="text-slate-300 leading-relaxed text-base">
                  {council.fullDescription}
                </p>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                    Core Objectives & Institutional Mandates:
                  </h4>
                  <ul className="space-y-2.5">
                    {council.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Council Quick Info Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Council Information
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        {council.leadership.conveners && council.leadership.conveners.length > 1 ? 'Faculty Conveners' : 'Faculty Convener'}
                      </div>
                      {(council.leadership.conveners || (council.leadership.convener ? [council.leadership.convener] : [])).map((c, idx) => (
                        <div key={idx} className="mt-1 pb-1 border-b border-slate-800/40 last:border-0 last:pb-0">
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-slate-400">{c.department}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        {council.leadership.heads && council.leadership.heads.length > 1 ? 'Council Heads (4th Year)' : 'Council Head (4th Year)'}
                      </div>
                      {(council.leadership.heads || (council.leadership.head ? [council.leadership.head] : [])).map((h, idx) => (
                        <div key={idx} className="mt-1 pb-1 border-b border-slate-800/40 last:border-0 last:pb-0">
                          <div className="font-semibold text-white">{h.name}</div>
                          <div className="text-xs text-slate-400">{h.branch}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">
                        {council.leadership.secretaries && council.leadership.secretaries.length > 1 ? 'Secretaries (4th Year)' : 'Secretary (4th Year)'}
                      </div>
                      {(council.leadership.secretaries || (council.leadership.secretary ? [council.leadership.secretary] : [])).map((s, idx) => (
                        <div key={idx} className="mt-1 pb-1 border-b border-slate-800/40 last:border-0 last:pb-0">
                          <div className="font-semibold text-white">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.branch}</div>
                        </div>
                      ))}
                    </div>

                    {council.leadership.members && council.leadership.members.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">Core Members (4th Year)</div>
                        {council.leadership.members.map((m, idx) => (
                          <div key={idx} className="mt-1 pb-1 border-b border-slate-800/40 last:border-0 last:pb-0">
                            <div className="font-semibold text-white">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.branch}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Meeting Headquarters</div>
                      <div className="text-slate-300 mt-0.5">{council.meetingVenue}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Submit Proposal / Media</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Core Focus Domains */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Core Focus Domains & Wings
                </h3>
                <span className="text-xs text-slate-400">
                  {council.domains.length} Specialized Sub-Divisions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {council.domains.map(domain => (
                  <div
                    key={domain.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900 transition-all space-y-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                        {domain.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {domain.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LEADERSHIP & 5-TIER HIERARCHY */}
        {/* ========================================================================= */}
        {activeTab === 'leadership' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Official 5-Tier Leadership Governance Structure
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official structure as per Maa Pateshwari Devi Rajkiya Engineering College Council Affairs (Session 2026-27).
                </p>
              </div>
              <button
                onClick={() => setIsNominateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Apply / Nominate for Council</span>
              </button>
            </div>

            {/* TIER 1: FACULTY CONVENER(S) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>
                  {council.leadership.conveners && council.leadership.conveners.length > 1
                    ? 'Tier 1 • Faculty Coordinators / Conveners'
                    : 'Tier 1 • Faculty Coordinator / Convener'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(council.leadership.conveners || (council.leadership.convener ? [council.leadership.convener] : [])).map((convener, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xl font-black text-blue-300 shadow-inner shrink-0">
                      {convener.name.split(' ').map(n => n[0]).join('').slice(0, 3)}
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1.5">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-lg font-bold text-white">
                          {convener.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
                          Faculty Convener
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-300">
                        {convener.designation}
                      </div>
                      <div className="text-xs text-slate-400">
                        Department of {convener.department}
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          {convener.email}
                        </span>
                        {convener.cabinRoom && (
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            {convener.cabinRoom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER 2: COUNCIL HEADS (4TH YEAR) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>
                  {council.leadership.heads && council.leadership.heads.length > 1
                    ? 'Tier 2 • Council Heads (4th Year B.Tech)'
                    : 'Tier 2 • Council Head (4th Year B.Tech)'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(council.leadership.heads || (council.leadership.head ? [council.leadership.head] : [])).map((headMember, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-lg font-black text-indigo-300 shrink-0">
                      4th
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1.5">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-lg font-bold text-white">
                          {headMember.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                          Council Head
                        </span>
                        {headMember.rollNo && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-xs font-mono border border-slate-800">
                            Roll: {headMember.rollNo}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300">
                        {headMember.branch} • Final Year
                      </div>
                      {headMember.bio && (
                        <p className="text-xs text-slate-400 pt-1 italic">
                          "{headMember.bio}"
                        </p>
                      )}
                      <div className="pt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        {headMember.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER 3: SECRETARIES (4TH YEAR / 3RD YEAR) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span>
                  {council.leadership.secretaries && council.leadership.secretaries.length > 1
                    ? 'Tier 3 • Secretaries (4th Year B.Tech)'
                    : 'Tier 3 • Secretary'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(council.leadership.secretaries || (council.leadership.secretary ? [council.leadership.secretary] : [])).map((secMember, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-teal-500/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-lg font-black text-teal-300 shrink-0">
                      {secMember.year === 4 ? '4th' : '3rd'}
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1.5">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="text-lg font-bold text-white">
                          {secMember.name}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
                          {secMember.role || 'Secretary'}
                        </span>
                        {secMember.rollNo && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-xs font-mono border border-slate-800">
                            Roll: {secMember.rollNo}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300">
                        {secMember.branch} • {secMember.year === 4 ? 'Final Year' : 'Pre-Final Year'}
                      </div>
                      {secMember.bio && (
                        <p className="text-xs text-slate-400 pt-1 italic">
                          "{secMember.bio}"
                        </p>
                      )}
                      <div className="pt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-400" />
                        {secMember.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OPTIONAL: CORE MEMBERS (4TH YEAR) */}
            {council.leadership.members && council.leadership.members.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Core Members (4th Year B.Tech)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {council.leadership.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-lg font-black text-cyan-300 shrink-0">
                        4th
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-1.5">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <h4 className="text-lg font-bold text-white">
                            {member.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                            {member.role || 'Member'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          {member.branch} • Final Year
                        </div>
                        {member.bio && (
                          <p className="text-xs text-slate-400 pt-1 italic">
                            "{member.bio}"
                          </p>
                        )}
                        <div className="pt-2 text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TIER 4: EXECUTIVE MEMBERS (2ND YEAR) - Left empty as requested */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Tier 4 • Executive Members (2nd Year B.Tech)</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50">
                  Nominations Open
                </span>
              </div>

              {council.leadership.executiveMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {council.leadership.executiveMembers.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.branch} (2nd Year)</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950/60 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">Executive Member Slots Open (2nd Year)</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      2nd-year students are eligible to apply as wing heads and executive members. Selection is finalized by Council Head and Faculty Convener.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNominateTier('executive');
                      setIsNominateModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <span>Apply for Executive Member Slot</span>
                  </button>
                </div>
              )}
            </div>

            {/* TIER 5: VOLUNTEERS (1ST YEAR) - Left empty as requested */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Tier 5 • Student Volunteers (1st Year Freshers)</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  Induction Drive Pending
                </span>
              </div>

              {council.leadership.volunteers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {council.leadership.volunteers.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.branch} (1st Year)</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950/60 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">Volunteer Induction Slots Open (1st Year)</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      1st-year induction drive will allocate passionate volunteers across event logistics, registration desks, stage management, and photography.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNominateTier('volunteer');
                      setIsNominateModalOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>Register as 1st-Year Volunteer</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EVENTS & WORKSHOPS */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filter Bar & Add Event CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {(['all', 'upcoming', 'ongoing', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setEventFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      eventFilter === f
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f} Events
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Propose New Event</span>
              </button>
            </div>

            {/* Event Cards Grid */}
            {approvedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedEvents
                  .filter(e => eventFilter === 'all' || e.status === eventFilter)
                  .map(evt => {
                    const isRegistered = registeredEvents.has(evt.id) || (evt.registeredUsers?.includes(session.userId || ''));
                    return (
                      <div
                        key={evt.id}
                        className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
                      >
                        {/* Event Banner */}
                        <div className="relative h-44 overflow-hidden bg-slate-950">
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-blue-400 border border-blue-500/30 text-xs font-black">
                            {evt.category}
                          </span>
                          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                            evt.status === 'upcoming'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : evt.status === 'ongoing'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
                              : 'bg-slate-950/80 text-slate-400 border border-slate-700'
                          }`}>
                            {evt.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                              {evt.title}
                            </h4>
                            {evt.tagline && (
                              <p className="text-xs text-slate-400 italic">
                                "{evt.tagline}"
                              </p>
                            )}
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {evt.description}
                            </p>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{evt.date} {evt.endDate ? `to ${evt.endDate}` : ''} • {evt.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{evt.venue}</span>
                            </div>
                            {evt.prizes && (
                              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                                <Award className="w-3.5 h-3.5 shrink-0" />
                                <span>{evt.prizes}</span>
                              </div>
                            )}
                          </div>

                          {/* Registration Action */}
                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <div className="text-xs text-slate-400 font-medium">
                              👥 <strong className="text-white">{evt.registeredCount}</strong> / {evt.maxSeats || 100} Registered
                            </div>
                            <button
                              onClick={() => handleEventRegistration(evt.id)}
                              disabled={isRegistered}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isRegistered
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 hover:scale-105'
                              }`}
                            >
                              {isRegistered ? '✓ Registered' : 'Register Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-bold text-white">No Approved Events Currently</h4>
                <p className="text-xs text-slate-400">Be the first to propose an event for this council!</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MEDIA & MEMORIES GALLERY */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Gallery Filters & Upload CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {(['all', 'image', 'video'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setGalleryFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      galleryFilter === f
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'All Memories' : f === 'image' ? 'Photos & Posters' : 'Videos & Aftermovies'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Memory</span>
              </button>
            </div>

            {/* Masonry / Responsive Grid */}
            {approvedMedia.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedMedia
                  .filter(m => galleryFilter === 'all' || m.type === galleryFilter)
                  .map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMedia(item)}
                      className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image / Video Card */}
                      <div className="relative aspect-video overflow-hidden bg-black">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-white ml-0.5" />
                            </div>
                          </div>
                        )}

                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-blue-400 text-xs font-bold border border-blue-500/30">
                          {item.eventName || 'Campus Highlight'}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <span>By {item.uploadedBy.name}</span>
                          <div className="flex items-center space-x-1 text-rose-400 font-semibold">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span>{item.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-bold text-white">No Gallery Media Yet</h4>
                <p className="text-xs text-slate-400">Upload high-res photos or videos to showcase this council's vibrancy!</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MODERATION DESK (ROLE PROTECTED) */}
        {/* ========================================================================= */}
        {activeTab === 'moderation' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/40 space-y-2">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  Editorial Moderation & Approval Desk
                </h3>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                As a Council Convener, Council Head (4th Year), Secretary (3rd Year), or Super Administrator, you review student submissions before they are published to the college public showcase.
              </p>
            </div>

            {/* PENDING MEDIA SUBMISSIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  Pending Media Submissions ({pendingMedia.length})
                </h4>
              </div>

              {pendingMedia.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingMedia.map(item => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-28 h-28 object-cover rounded-2xl bg-black shrink-0"
                        />
                        <div className="space-y-1 flex-1">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            PENDING REVIEW
                          </span>
                          <h5 className="font-bold text-white text-sm mt-1">{item.title}</h5>
                          <p className="text-xs text-slate-300 line-clamp-2">{item.caption}</p>
                          <div className="text-[11px] text-slate-400 pt-1">
                            Uploader: <strong className="text-slate-200">{item.uploadedBy.name}</strong> ({item.uploadedBy.role})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                        <button
                          onClick={() => onRejectMedia(item.id, 'Does not meet media guidelines')}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => onApproveMedia(item.id)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                  ✓ No media items currently pending moderation.
                </div>
              )}
            </div>

            {/* PENDING EVENT SUBMISSIONS */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Pending Event Proposals ({pendingEvents.length})
                </h4>
              </div>

              {pendingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingEvents.map(evt => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            EVENT PROPOSAL
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{evt.date}</span>
                        </div>
                        <h5 className="font-bold text-white text-base">{evt.title}</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                        <div className="text-xs text-slate-400">
                          Venue: <span className="text-slate-200">{evt.venue}</span> • Capacity: <span className="text-slate-200">{evt.maxSeats}</span>
                        </div>
                        {evt.submittedBy && (
                          <div className="text-[11px] text-slate-400">
                            Proposed by: <strong className="text-slate-200">{evt.submittedBy.name}</strong> ({evt.submittedBy.role})
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                        <button
                          onClick={() => onRejectEvent(evt.id, 'Event schedule conflict')}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Proposal</span>
                        </button>
                        <button
                          onClick={() => onApproveEvent(evt.id)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Schedule</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                  ✓ No event proposals currently pending review.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <CouncilMediaLightbox
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onLike={() => onLikeMedia(selectedMedia.id)}
        />
      )}

      {/* Submission Modal */}
      <CouncilSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        council={council}
        allCouncils={allCouncils}
        session={session}
        onEventSubmitted={onEventSubmitted}
        onMediaSubmitted={onMediaSubmitted}
      />

      {/* Nominate / Apply Modal */}
      <AnimatePresence>
        {isNominateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Apply for {council.name}
                </h3>
                <button
                  onClick={() => setIsNominateModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Submit your candidacy for the <strong>{nominateTier === 'executive' ? 'Tier 4 Executive Member (2nd Year)' : 'Tier 5 Volunteer (1st Year)'}</strong> slot.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300">Candidate Name</label>
                  <input
                    type="text"
                    defaultValue={session.name}
                    className="w-full px-3 py-2 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300">Target Wing / Domain</label>
                    <select className="w-full px-3 py-2 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm">
                      {council.domains.map(d => (
                        <option key={d.id} value={d.title}>{d.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300">Year of Study</label>
                    <select
                      value={nominateTier === 'executive' ? '2' : '1'}
                      onChange={e => setNominateTier(e.target.value === '2' ? 'executive' : 'volunteer')}
                      className="w-full px-3 py-2 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    >
                      <option value="2">2nd Year (Executive)</option>
                      <option value="1">1st Year (Volunteer)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-300">Why are you passionate about this council?</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your prior experience, creative skills, or leadership background..."
                    className="w-full px-3 py-2 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  onClick={() => setIsNominateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('🎉 Nomination submitted to Council Head and Convener for review!');
                    setIsNominateModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Submit Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
