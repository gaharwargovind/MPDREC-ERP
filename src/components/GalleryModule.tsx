import React, { useState, useMemo, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Upload, 
  Trash2, 
  Heart, 
  Eye, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Calendar, 
  User, 
  Tag, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ExternalLink,
  Lock,
  Download,
  AlertCircle,
  Film,
  Trophy,
  PartyPopper,
  FolderOpen,
  LayoutGrid,
  Layers,
  Sparkle,
  Clock,
  XCircle,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Info,
  SlidersHorizontal,
  SendHorizontal,
  MapPin,
  Star,
  Check
} from 'lucide-react';
import { GalleryItem, CampusEvent, AuthSession } from '../types/erp';
import { storageService } from '../services/storageService';
import { supabaseSyncService } from '../services/supabaseSyncService';

interface GalleryModuleProps {
  galleryItems: GalleryItem[];
  events?: CampusEvent[];
  onAddGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
  onToggleLike: (id: string) => void;
  onApproveGalleryItem?: (id: string, reviewerName: string) => void;
  onRejectGalleryItem?: (id: string, reviewerName: string, reason?: string) => void;
  onAddEvent?: (event: CampusEvent) => void;
  onApproveEvent?: (id: string, reviewerName: string) => void;
  onRejectEvent?: (id: string, reviewerName: string, reason?: string) => void;
  onDeleteEvent?: (id: string) => void;
  session: AuthSession;
  onOpenLogin: () => void;
}

const DEFAULT_EVENT_CATEGORIES = [
  'Tejas Annual Sports Fest 2k25',
  'Freshers Party',
  'Euphoria 2026: Techno-Cultural Fest',
  'National Science Day & Robo-War 2026'
] as const;

const REJECTION_PRESETS = [
  'Low video resolution or poor audio quality',
  'Off-topic / Content unrelated to the selected event',
  'Duplicate submission / Redundant angle',
  'Does not adhere to MPDREC campus code of conduct',
  'Event category mismatch'
];

const EVENT_REJECTION_PRESETS = [
  'Event dates clash with university semester examinations',
  'Incomplete description or missing faculty convener designation',
  'Duplicate or redundant campus event proposal',
  'Venue / Infrastructure unavailable on requested dates',
  'Does not adhere to AKTU & MPDREC student activity guidelines'
];

export const GalleryModule: React.FC<GalleryModuleProps> = ({
  galleryItems,
  events = [],
  onAddGalleryItem,
  onDeleteGalleryItem,
  onToggleLike,
  onApproveGalleryItem,
  onRejectGalleryItem,
  onAddEvent,
  onApproveEvent,
  onRejectEvent,
  onDeleteEvent,
  session,
  onOpenLogin,
}) => {
  // Navigation & View States
  const [activeViewTab, setActiveViewTab] = useState<'public' | 'events_directory' | 'verification_queue' | 'my_submissions'>('public');
  const [verificationSubTab, setVerificationSubTab] = useState<'videos' | 'events'>('videos');
  const [mySubmissionsSubTab, setMySubmissionsSubTab] = useState<'videos' | 'events'>('videos');
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'image' | 'video'>('all');
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grouped' | 'grid'>('grouped');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteEventConfirmId, setDeleteEventConfirmId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [heroSetSuccess, setHeroSetSuccess] = useState<string | null>(null);

  // Set item as Default Campus Hero Video
  const handleSetAsHeroVideo = (item: GalleryItem) => {
    storageService.setHeroVideo(item.mediaUrl, item.title, item.thumbnailUrl);
    setHeroSetSuccess(item.id);
    setActionSuccessMsg(`✓ "${item.title}" successfully set as the default Campus Overview Hero Video!`);
    setTimeout(() => {
      setHeroSetSuccess(null);
      setActionSuccessMsg(null);
    }, 4500);
  };

  // Video Rejection Dialog State
  const [rejectingItem, setRejectingItem] = useState<GalleryItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_PRESETS[0]);
  const [customRejectionText, setCustomRejectionText] = useState('');

  // Event Rejection Dialog State
  const [rejectingEvent, setRejectingEvent] = useState<CampusEvent | null>(null);
  const [rejectEventReason, setRejectEventReason] = useState(EVENT_REJECTION_PRESETS[0]);
  const [customRejectEventText, setCustomRejectEventText] = useState('');

  // Event Creation / Proposal Form State
  const [newEventName, setNewEventName] = useState('');
  const [newEventCategoryType, setNewEventCategoryType] = useState<'Sports' | 'Cultural' | 'Technical' | 'Academic' | 'Celebration' | 'Workshop'>('Cultural');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventEndDate, setNewEventEndDate] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('Central Campus Auditorium');
  const [newEventCoordinator, setNewEventCoordinator] = useState(session.role === 'faculty' ? session.name : 'Prof. Sandip Kumar Singh');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventCoverImage, setNewEventCoverImage] = useState('');
  const [newEventTags, setNewEventTags] = useState('');

  // Upload Form State
  const [uploadType, setUploadType] = useState<'image' | 'video'>('video');
  const [uploadSourceMode, setUploadSourceMode] = useState<'file' | 'url'>('url');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<string>('Tejas Annual Sports Fest 2k25');
  const [customEventName, setCustomEventName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Permissions Check
  const isGuest = session.role === 'guest';
  const isStudent = session.role === 'student';
  const isFacultyOrAdmin = session.role === 'faculty' || session.role === 'admin';
  const canUpload = session.role === 'admin' || session.role === 'faculty' || session.role === 'student';
  const canCreateEventDirectly = session.role === 'admin' || session.role === 'faculty';
  const canCreateEventCategory = isFacultyOrAdmin;
  const canDeleteRole = session.role === 'admin' || session.role === 'faculty';

  // Events Split by Status
  const allEvents = useMemo(() => events || [], [events]);
  const approvedEvents = useMemo(() => allEvents.filter(e => e.status === 'approved' || !e.status), [allEvents]);
  const pendingEvents = useMemo(() => allEvents.filter(e => e.status === 'pending'), [allEvents]);
  const studentProposedEvents = useMemo(() => {
    if (!isStudent && !session.name) return [];
    return allEvents.filter(e =>
      (session.userId && e.proposedById === session.userId) ||
      (session.userId && e.proposedByRoll === session.userId) ||
      e.proposedBy === session.name
    );
  }, [allEvents, isStudent, session]);

  // Dynamic Event Categories: union of approved events, defaults and any custom event present in approved items
  const allEventCategories = useMemo(() => {
    const categoriesSet = new Set<string>(DEFAULT_EVENT_CATEGORIES);
    approvedEvents.forEach(e => {
      if (e.name && e.name.trim()) categoriesSet.add(e.name.trim());
    });
    galleryItems.forEach(item => {
      if (item.category && item.category.trim()) {
        categoriesSet.add(item.category.trim());
      }
    });
    return Array.from(categoriesSet);
  }, [approvedEvents, galleryItems]);

  // Split gallery items by status
  const approvedItems = useMemo(() => {
    return galleryItems.filter(item => item.status === 'approved' || !item.status);
  }, [galleryItems]);

  const pendingItems = useMemo(() => {
    return galleryItems.filter(item => item.status === 'pending');
  }, [galleryItems]);

  const studentSubmissions = useMemo(() => {
    if (!isStudent && !session.name) return [];
    return galleryItems.filter(item => 
      (session.userId && item.uploadedById === session.userId) ||
      (session.userId && item.submittedByRoll === session.userId) ||
      item.uploadedBy === session.name
    );
  }, [galleryItems, isStudent, session]);

  // Permission to delete specific item
  const canDeleteItem = (item: GalleryItem) => {
    if (canDeleteRole) return true;
    if (session.role === 'student' && (item.uploadedBy === session.name || item.uploadedById === session.userId)) return true;
    return false;
  };

  // Filtered Approved Items for Public Gallery Feed
  const filteredApprovedItems = useMemo(() => {
    return approvedItems.filter((item) => {
      // Type filter
      if (activeTypeTab !== 'all' && item.type !== activeTypeTab) return false;
      // Event Category filter
      if (selectedEventCategory !== 'All' && item.category !== selectedEventCategory) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchUploader = item.uploadedBy.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchUploader && !matchCategory && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [approvedItems, activeTypeTab, selectedEventCategory, searchQuery]);

  // Approved Items Grouped by Event for Categorized Album View
  const approvedItemsByEvent = useMemo(() => {
    const groups: { [key: string]: GalleryItem[] } = {};
    allEventCategories.forEach(cat => {
      groups[cat] = [];
    });

    approvedItems.forEach(item => {
      const cat = item.category || 'Tejas Annual Sports Fest 2k25';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      // Apply type and search filter to items in groups
      let match = true;
      if (activeTypeTab !== 'all' && item.type !== activeTypeTab) match = false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchUploader = item.uploadedBy.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchUploader && !matchTags) {
          match = false;
        }
      }
      if (match) {
        groups[cat].push(item);
      }
    });

    return groups;
  }, [allEventCategories, approvedItems, activeTypeTab, searchQuery]);

  // Statistics
  const totalApprovedPhotos = useMemo(() => approvedItems.filter(i => i.type === 'image').length, [approvedItems]);
  const totalApprovedVideos = useMemo(() => approvedItems.filter(i => i.type === 'video').length, [approvedItems]);
  const totalLikes = useMemo(() => approvedItems.reduce((acc, curr) => acc + (curr.likes || 0), 0), [approvedItems]);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Handle File Upload to Supabase Storage Bucket ('campus_media')
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload directly to Supabase bucket and obtain public URL
      const publicUrl = await supabaseSyncService.uploadGalleryMedia(file, {
        category: selectedCategoryOption === '__custom__' ? customEventName : selectedCategoryOption,
        contentType: uploadType === 'video' ? 'video/mp4' : undefined
      });
      setMediaUrl(publicUrl);
      setPreviewError(false);
    } catch {
      // Fallback to Data URL if offline
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Preset sample URLs for quick selection in modal
  const handleSetPresetSample = (url: string, type: 'image' | 'video', cat: string, sampleTitle: string) => {
    setMediaUrl(url);
    setUploadType(type);
    setSelectedCategoryOption(cat);
    if (!title) setTitle(sampleTitle);
    setPreviewError(false);
  };

  const handleOpenUploadForEvent = (eventCat: string) => {
    setSelectedCategoryOption(eventCat);
    setShowUploadModal(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim() || !title.trim()) return;

    // Resolve category
    let finalCategory = selectedCategoryOption;
    if (canCreateEventCategory && selectedCategoryOption === '__custom__') {
      finalCategory = customEventName.trim() || 'Tejas Annual Sports Fest 2k25';
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    // If submitted by student -> status: 'pending' (requires faculty verification)
    // If submitted by faculty/admin -> status: 'approved' immediately
    const requiresVerification = isStudent;
    const itemStatus: 'approved' | 'pending' = requiresVerification ? 'pending' : 'approved';

    const newItem: GalleryItem = {
      id: `GAL-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      description: description.trim() || `${finalCategory} event highlight at MPDREC.`,
      type: uploadType,
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: uploadType === 'image' ? mediaUrl.trim() : undefined,
      category: finalCategory,
      uploadedBy: session.name || (session.role === 'admin' ? 'Admin Office' : 'MPDREC Scholar'),
      uploadedByRole: (session.role === 'guest' ? 'student' : session.role) as 'admin' | 'faculty' | 'student',
      uploadedById: session.userId,
      submittedByRoll: isStudent ? session.userId : undefined,
      submittedByBranch: isStudent ? (session.branch || 'CSE') : undefined,
      uploadedAt: new Date().toISOString().split('T')[0],
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      tags: parsedTags.length > 0 ? parsedTags : [finalCategory.replace(/[^a-zA-Z0-9]/g, ''), 'MPDREC'],
      likes: 0,
      likedBy: [],
      duration: uploadType === 'video' ? '0:30' : undefined,
      status: itemStatus,
      reviewedBy: !requiresVerification ? `${session.name} (${session.role})` : undefined,
      reviewedAt: !requiresVerification ? new Date().toISOString().split('T')[0] : undefined
    };

    onAddGalleryItem(newItem);

    // Reset Form
    setTitle('');
    setDescription('');
    setMediaUrl('');
    setTagsInput('');
    setCustomEventName('');
    setShowUploadModal(false);

    if (requiresVerification) {
      showToast('🎉 Your video request has been sent to all faculties for verification. It will go live upon faculty approval!');
      setActiveViewTab('my_submissions');
    } else {
      showToast('✅ Media successfully verified and published to the campus gallery!');
    }
  };

  const handleApprove = (item: GalleryItem) => {
    if (onApproveGalleryItem) {
      onApproveGalleryItem(item.id, session.name || 'Faculty Review Board');
      showToast(`✅ Approved "${item.title}"! Video is now published live to the official gallery.`);
    }
  };

  const handleOpenRejectModal = (item: GalleryItem) => {
    setRejectingItem(item);
    setRejectionReason(REJECTION_PRESETS[0]);
    setCustomRejectionText('');
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    const finalReason = customRejectionText.trim() || rejectionReason;
    if (onRejectGalleryItem) {
      onRejectGalleryItem(rejectingItem.id, session.name || 'Faculty Review Board', finalReason);
      showToast(`❌ Request for "${rejectingItem.title}" has been bumped and rejected.`);
    }
    setRejectingItem(null);
  };

  const handleApproveAllPending = () => {
    if (!onApproveGalleryItem || pendingItems.length === 0) return;
    pendingItems.forEach(item => {
      onApproveGalleryItem(item.id, session.name || 'Faculty Review Board');
    });
    showToast(`✅ Successfully approved and published all ${pendingItems.length} pending submissions!`);
  };

  // Event Handlers
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    const requiresFacultyApproval = isStudent;
    const eventStatus: 'approved' | 'pending' = requiresFacultyApproval ? 'pending' : 'approved';

    const parsedTags = newEventTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newEvent: CampusEvent = {
      id: `EVT-${Date.now().toString().slice(-6)}`,
      name: newEventName.trim(),
      description: newEventDescription.trim() || `Official campus event at MPDREC.`,
      categoryType: newEventCategoryType,
      eventDate: newEventDate || new Date().toISOString().split('T')[0],
      endDate: newEventEndDate.trim() || undefined,
      venue: newEventVenue.trim() || 'MPDREC Main Auditorium',
      coordinatorFaculty: newEventCoordinator.trim() || 'Prof. Sandip Kumar Singh',
      status: eventStatus,
      proposedBy: session.name || (session.role === 'admin' ? 'Administrative Dean' : 'Student Council'),
      proposedByRole: (session.role === 'guest' ? 'student' : session.role) as 'admin' | 'faculty' | 'student',
      proposedById: session.userId,
      proposedByRoll: isStudent ? session.userId : undefined,
      proposedAt: new Date().toISOString().split('T')[0],
      approvedBy: !requiresFacultyApproval ? `${session.name} (${session.role})` : undefined,
      approvedAt: !requiresFacultyApproval ? new Date().toISOString().split('T')[0] : undefined,
      coverImage: newEventCoverImage.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : [newEventCategoryType, 'MPDREC']
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    // Reset Form
    setNewEventName('');
    setNewEventDescription('');
    setNewEventVenue('Central Campus Auditorium');
    setNewEventCoverImage('');
    setNewEventTags('');
    setShowCreateEventModal(false);

    if (requiresFacultyApproval) {
      showToast('🎉 Your event proposal has been submitted to all faculties for review! Once approved, it will be activated as an official category.');
      setActiveViewTab('my_submissions');
      setMySubmissionsSubTab('events');
    } else {
      showToast(`✅ Campus event "${newEvent.name}" published & activated as an official category!`);
      setActiveViewTab('events_directory');
    }
  };

  const handleApproveEventProposal = (event: CampusEvent) => {
    if (onApproveEvent) {
      onApproveEvent(event.id, session.name || 'Faculty Moderation Desk');
      showToast(`✅ Approved event "${event.name}"! It is now an active category for video/photo uploads.`);
    }
  };

  const handleOpenRejectEventModal = (event: CampusEvent) => {
    setRejectingEvent(event);
    setRejectEventReason(EVENT_REJECTION_PRESETS[0]);
    setCustomRejectEventText('');
  };

  const handleConfirmRejectEvent = () => {
    if (!rejectingEvent) return;
    const finalReason = customRejectEventText.trim() || rejectEventReason;
    if (onRejectEvent) {
      onRejectEvent(rejectingEvent.id, session.name || 'Faculty Moderation Desk', finalReason);
      showToast(`❌ Event proposal "${rejectingEvent.name}" has been bumped and rejected.`);
    }
    setRejectingEvent(null);
  };

  const handleApproveAllPendingEvents = () => {
    if (!onApproveEvent || pendingEvents.length === 0) return;
    pendingEvents.forEach(evt => {
      onApproveEvent(evt.id, session.name || 'Faculty Moderation Desk');
    });
    showToast(`✅ Successfully approved and activated all ${pendingEvents.length} pending event proposals!`);
  };

  const handleSetEventCoverPreset = (url: string, type: 'Sports' | 'Cultural' | 'Technical' | 'Academic' | 'Celebration' | 'Workshop', sampleName: string) => {
    setNewEventCoverImage(url);
    setNewEventCategoryType(type);
    if (!newEventName) setNewEventName(sampleName);
  };

  const handleCopyShare = (item: GalleryItem) => {
    navigator.clipboard.writeText(`${window.location.origin}#gallery-${item.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    const currentIndex = filteredApprovedItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex < filteredApprovedItems.length - 1) {
      setSelectedItem(filteredApprovedItems[currentIndex + 1]);
    } else {
      setSelectedItem(filteredApprovedItems[0]);
    }
  };

  const handlePrevItem = () => {
    if (!selectedItem) return;
    const currentIndex = filteredApprovedItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(filteredApprovedItems[currentIndex - 1]);
    } else {
      setSelectedItem(filteredApprovedItems[filteredApprovedItems.length - 1]);
    }
  };

  const getEventBadgeStyle = (cat: string) => {
    if (cat.toLowerCase().includes('sports') || cat.toLowerCase().includes('tejas')) {
      return {
        badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        banner: 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-200 dark:border-amber-900/50',
        icon: <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      };
    }
    if (cat.toLowerCase().includes('fresher') || cat.toLowerCase().includes('party')) {
      return {
        badge: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        banner: 'from-purple-500/10 via-pink-500/5 to-transparent border-purple-200 dark:border-purple-900/50',
        icon: <PartyPopper className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      };
    }
    return {
      badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      banner: 'from-blue-500/10 via-indigo-500/5 to-transparent border-blue-200 dark:border-blue-900/50',
      icon: <Sparkle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{actionSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Gallery Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Verified Campus Media Showcase</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Faculty Moderation Active</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              MPDREC Event Gallery & Media Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Official campus captures categorized into <strong className="text-slate-800 dark:text-slate-200">Tejas Annual Sports Fest 2k25</strong> and <strong className="text-slate-800 dark:text-slate-200">Freshers Party</strong>. All student video uploads are protected by mandatory <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Faculty Board Verification</strong> before going live.
            </p>
          </div>

          {/* Action Buttons & Navigation Mode */}
          <div className="flex flex-wrap items-center gap-3">
            {canUpload && (
              <>
                <button
                  onClick={() => {
                    setSelectedCategoryOption(allEventCategories[0] || 'Tejas Annual Sports Fest 2k25');
                    setShowUploadModal(true);
                  }}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-105 transition-all"
                  id="btn-gallery-upload"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isStudent ? 'Submit Video for Faculty Approval' : 'Upload Verified Media'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono uppercase">
                    {session.role}
                  </span>
                </button>

                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 hover:scale-105 transition-all"
                  id="btn-add-event-category"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFacultyOrAdmin ? '+ Add Campus Event' : '+ Propose New Event'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">
                    {isFacultyOrAdmin ? 'Instant' : 'Req. Approval'}
                  </span>
                </button>
              </>
            )}

            {!canUpload && (
              <button
                onClick={onOpenLogin}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all border border-slate-700"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Sign in to Upload or Propose Events</span>
              </button>
            )}

            {isGuest && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                <Eye className="w-3.5 h-3.5" /> Visitor Mode (Public View)
              </span>
            )}
          </div>
        </div>

        {/* Verification Queue Alert Banner for Faculty & Admins */}
        {isFacultyOrAdmin && (pendingItems.length > 0 || pendingEvents.length > 0) && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  {pendingItems.length + pendingEvents.length} Item{(pendingItems.length + pendingEvents.length) > 1 ? 's' : ''} Awaiting Faculty Review
                  {pendingItems.length > 0 && <span className="ml-1 text-xs font-medium">({pendingItems.length} Videos)</span>}
                  {pendingEvents.length > 0 && <span className="ml-1 text-xs font-medium">({pendingEvents.length} Event Proposals)</span>}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400">
                  Students have requested to add new event categories and publish video reels. Review below to approve or bump.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveViewTab('verification_queue');
                if (pendingEvents.length > 0 && pendingItems.length === 0) {
                  setVerificationSubTab('events');
                } else {
                  setVerificationSubTab('videos');
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Faculty Verification Desk</span>
            </button>
          </div>
        )}

        {/* HIGH-VISIBILITY GALLERY & EVENT KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Live Photos Card */}
          <div 
            onClick={() => {
              setActiveViewTab('public');
              setActiveTypeTab('image');
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Live Archive
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform shrink-0">
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-blue-100 font-mono tracking-tight">
                {totalApprovedPhotos}
              </div>
              <div className="text-xs font-black text-blue-700 dark:text-blue-300 mt-0.5 flex items-center justify-between">
                <span>Live Photos</span>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500 transition-colors">Browse →</span>
              </div>
            </div>
          </div>

          {/* Live Video Reels Card */}
          <div 
            onClick={() => {
              setActiveViewTab('public');
              setActiveTypeTab('video');
            }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-purple-500/30 dark:border-purple-500/40 hover:border-purple-500 dark:hover:border-purple-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-black tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                HD Reels
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform shrink-0">
                <VideoIcon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-950 dark:text-purple-100 font-mono tracking-tight">
                {totalApprovedVideos}
              </div>
              <div className="text-xs font-black text-purple-700 dark:text-purple-300 mt-0.5 flex items-center justify-between">
                <span>Live Video Reels</span>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-purple-500 transition-colors">Play →</span>
              </div>
            </div>
          </div>

          {/* Event Categories Card */}
          <div 
            onClick={() => setActiveViewTab('events_directory')}
            className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent dark:from-indigo-950/40 dark:via-slate-850 dark:to-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-black tracking-wider uppercase">
                Official
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform shrink-0">
                <Calendar className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-indigo-100 font-mono tracking-tight">
                {approvedEvents.length}
              </div>
              <div className="text-xs font-black text-indigo-700 dark:text-indigo-300 mt-0.5 flex items-center justify-between">
                <span>Event Categories</span>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">Explore →</span>
              </div>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div 
            onClick={() => {
              if (isFacultyOrAdmin) {
                setActiveViewTab('verification_queue');
              } else {
                setActiveViewTab('my_submissions');
              }
            }}
            className={`p-4 rounded-2xl bg-gradient-to-br shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border-2 ${
              (pendingItems.length + pendingEvents.length) > 0
                ? 'from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-950/50 dark:via-slate-850 dark:to-slate-900 border-amber-400 dark:border-amber-600/60 hover:border-amber-500'
                : 'from-slate-500/10 via-slate-500/5 to-transparent dark:from-slate-800/40 dark:via-slate-850 dark:to-slate-900 border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase ${
                (pendingItems.length + pendingEvents.length) > 0
                  ? 'bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {(pendingItems.length + pendingEvents.length) > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                )}
                {isFacultyOrAdmin ? 'Faculty Review' : 'In Review'}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0 ${
                (pendingItems.length + pendingEvents.length) > 0
                  ? 'bg-amber-500 text-white shadow-amber-500/20'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                (pendingItems.length + pendingEvents.length) > 0
                  ? 'text-amber-950 dark:text-amber-200'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {pendingItems.length + pendingEvents.length}
              </div>
              <div className={`text-xs font-black mt-0.5 flex items-center justify-between ${
                (pendingItems.length + pendingEvents.length) > 0
                  ? 'text-amber-800 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                <span>Pending Approvals</span>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-amber-600 transition-colors">
                  {isFacultyOrAdmin ? 'Review Desk →' : 'Status →'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* PRIMARY VIEW NAVIGATION TABS (Public Gallery vs Campus Events Directory vs Faculty Verification Desk vs My Submissions) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveViewTab('public')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewTab === 'public'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Public Campus Gallery</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {approvedItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveViewTab('events_directory')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewTab === 'events_directory'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Campus Events & Categories</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeViewTab === 'events_directory' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {approvedEvents.length}
              </span>
            </button>

            {isFacultyOrAdmin && (
              <button
                onClick={() => setActiveViewTab('verification_queue')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                  activeViewTab === 'verification_queue'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Faculty Review Desk</span>
                {(pendingItems.length > 0 || pendingEvents.length > 0) && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono animate-bounce">
                    {pendingItems.length + pendingEvents.length}
                  </span>
                )}
              </button>
            )}

            {isStudent && (
              <button
                onClick={() => setActiveViewTab('my_submissions')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeViewTab === 'my_submissions'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>My Submissions & Proposals</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {studentSubmissions.length + studentProposedEvents.length}
                </span>
              </button>
            )}
          </div>

          {/* Search Input for Public Gallery */}
          {activeViewTab === 'public' && (
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Tejas 2k25, Freshers, cricket, dance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Secondary Sub-Controls for Public Gallery */}
        {activeViewTab === 'public' && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Layout Switcher & Media Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => setViewLayout('grouped')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewLayout === 'grouped'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Group media by Event (Tejas Sports Fest, Freshers Party, etc.)"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Group by Event</span>
                  </button>

                  <button
                    onClick={() => setViewLayout('grid')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewLayout === 'grid'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Grid Feed of all Media"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>All Media Grid</span>
                  </button>
                </div>

                {/* Media Type Filter */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => setActiveTypeTab('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activeTypeTab === 'all'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-mono">
                      {approvedItems.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTypeTab('image')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activeTypeTab === 'image'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photos</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-mono">
                      {totalApprovedPhotos}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTypeTab('video')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activeTypeTab === 'video'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <VideoIcon className="w-3 h-3" />
                    <span>Videos</span>
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-mono">
                      {totalApprovedVideos}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider pl-1">
                Event Categories:
              </span>
              
              <button
                onClick={() => setSelectedEventCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedEventCategory === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>All Events</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedEventCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {approvedItems.length}
                </span>
              </button>

              {allEventCategories.map((cat) => {
                const count = approvedItems.filter(i => i.category === cat).length;
                const isSelected = selectedEventCategory === cat;
                const style = getEventBadgeStyle(cat);

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedEventCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="shrink-0">{style.icon}</span>
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 dark:bg-slate-800 text-white dark:text-slate-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Only Faculty/Admin can add new official events */}
              {canCreateEventCategory && (
                <button
                  onClick={() => {
                    setSelectedCategoryOption('__custom__');
                    setShowUploadModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
                  title="Faculty privilege: Register a new campus event category"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Event (Faculty)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 0: CAMPUS EVENTS & CATEGORIES DIRECTORY */}
      {activeViewTab === 'events_directory' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>Campus Event Registry & Categorization</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  Official MPDREC Events & Categories Directory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                  Explore campus events like <strong>Tejas Annual Sports Fest 2k25</strong> and <strong>Freshers Party</strong>. Every category organizes student video reels and photo archives. Students can propose new event categories which will become active upon faculty approval.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start lg:self-auto">
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFacultyOrAdmin ? '+ Add Official Event' : '+ Propose New Event Category'}</span>
                </button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedEvents.map((evt) => {
                const style = getEventBadgeStyle(evt.name);
                const mediaCount = (approvedItemsByEvent[evt.name] || []).length;
                const photosCount = (approvedItemsByEvent[evt.name] || []).filter(i => i.type === 'image').length;
                const videosCount = (approvedItemsByEvent[evt.name] || []).filter(i => i.type === 'video').length;

                return (
                  <div
                    key={evt.id}
                    className="bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
                  >
                    {/* Event Banner & Image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                      {evt.coverImage ? (
                        <img
                          src={evt.coverImage}
                          alt={evt.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${style.banner} flex items-center justify-center p-6 text-center`}>
                          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-md">
                            {style.icon}
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${style.badge}`}>
                          {evt.categoryType}
                        </span>

                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md flex items-center gap-1.5">
                          <Film className="w-3 h-3 text-purple-400" />
                          <span>{mediaCount} Media</span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white font-medium backdrop-blur-sm bg-black/40 px-2.5 py-1 rounded-xl">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" /> {evt.venue || 'Campus Grounds'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" /> {evt.eventDate}
                        </span>
                      </div>
                    </div>

                    {/* Event Info Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {evt.name}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>

                        {/* Coordinator / Faculty In-Charge */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                              Faculty Convener: <strong className="text-slate-900 dark:text-slate-100">{evt.coordinatorFaculty || 'Faculty Council'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Media count breakdown pills */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> {photosCount} Photos
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1">
                            <VideoIcon className="w-3 h-3" /> {videosCount} Videos
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEventCategory(evt.name);
                            setActiveViewTab('public');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Media</span>
                        </button>

                        {canUpload && (
                          <button
                            onClick={() => handleOpenUploadForEvent(evt.name)}
                            className="py-2 px-3 rounded-xl bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                            title="Upload videos or photos to this event category"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Submit Media</span>
                          </button>
                        )}

                        {isFacultyOrAdmin && (
                          <button
                            onClick={() => setDeleteEventConfirmId(evt.id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 text-xs transition-colors border border-rose-200 dark:border-rose-800"
                            title="Delete event category (Faculty privilege)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Event CTA Card */}
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="bg-slate-50/50 dark:bg-slate-850/30 border-2 border-dashed border-purple-300 dark:border-purple-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 hover:border-purple-500 transition-all min-h-[300px] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                  <Plus className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {isFacultyOrAdmin ? 'Register New Campus Event' : 'Propose New Event Category'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    {isFacultyOrAdmin
                      ? 'Add official annual celebrations, competitions, and departmental tech-fests directly.'
                      : 'Submit a new event proposal to the Faculty Verification Board for approval.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 underline">
                  {isFacultyOrAdmin ? '+ Add Instant Event' : '+ Submit Proposal'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: FACULTY VERIFICATION QUEUE DESK */}
      {activeViewTab === 'verification_queue' && isFacultyOrAdmin && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Top Desk Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Faculty Moderation & Review Board</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  Faculty Verification & Approval Desk
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review student video upload requests and student-proposed event categories. Approving publishes content instantly to the campus repository; rejecting bumps the request with custom remarks.
                </p>
              </div>

              {/* Sub-tab Switcher (Videos vs Event Categories) */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start md:self-auto">
                <button
                  onClick={() => setVerificationSubTab('videos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    verificationSubTab === 'videos'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Video Uploads</span>
                  {pendingItems.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono">
                      {pendingItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setVerificationSubTab('events')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    verificationSubTab === 'events'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Event Category Proposals</span>
                  {pendingEvents.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-mono">
                      {pendingEvents.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* SUB-VIEW A: STUDENT VIDEO REEL UPLOADS */}
            {verificationSubTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Showing {pendingItems.length} Student Video Reel{pendingItems.length === 1 ? '' : 's'} Awaiting Moderation
                  </div>

                  {pendingItems.length > 0 && (
                    <button
                      onClick={handleApproveAllPending}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve All Videos ({pendingItems.length})</span>
                    </button>
                  )}
                </div>

                {pendingItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingItems.map((item) => {
                      const style = getEventBadgeStyle(item.category);

                      return (
                        <div
                          key={item.id}
                          className="bg-slate-50 dark:bg-slate-850/80 border-2 border-amber-300 dark:border-amber-800/80 rounded-3xl p-5 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
                        >
                          {/* Video / Photo Preview */}
                          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner group">
                            {item.type === 'video' ? (
                              <video
                                src={item.mediaUrl}
                                controls
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={item.mediaUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${style.badge}`}>
                                {item.category}
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md flex items-center gap-1">
                                {item.type === 'video' ? <VideoIcon className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                                <span className="capitalize">{item.type}</span>
                              </span>
                            </div>
                          </div>

                          {/* Request Details */}
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                                {item.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold shrink-0 border border-amber-300 dark:border-amber-800">
                                Pending Review
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                              {item.description}
                            </p>

                            {/* Student Submitter Card */}
                            <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-slate-100">
                                    {item.uploadedBy}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    Roll: {item.submittedByRoll || item.uploadedById || 'N/A'} • Branch: {item.submittedByBranch || 'CSE'}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right text-[10px] text-slate-400">
                                Submitted: {item.uploadedAt}
                              </div>
                            </div>
                          </div>

                          {/* Review Action Buttons */}
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                            <button
                              onClick={() => handleOpenRejectModal(item)}
                              className="flex-1 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject / Bump</span>
                            </button>

                            <button
                              onClick={() => handleApprove(item)}
                              className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve & Publish</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      No Pending Video Submissions
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All video reels submitted by students have been reviewed and approved.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW B: STUDENT EVENT CATEGORY PROPOSALS */}
            {verificationSubTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Showing {pendingEvents.length} Event Proposal{pendingEvents.length === 1 ? '' : 's'} Awaiting Faculty Approval
                  </div>

                  {pendingEvents.length > 0 && (
                    <button
                      onClick={handleApproveAllPendingEvents}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve All Event Categories ({pendingEvents.length})</span>
                    </button>
                  )}
                </div>

                {pendingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingEvents.map((evt) => {
                      const style = getEventBadgeStyle(evt.name);

                      return (
                        <div
                          key={evt.id}
                          className="bg-slate-50 dark:bg-slate-850/80 border-2 border-purple-300 dark:border-purple-800/80 rounded-3xl p-5 shadow-sm space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
                        >
                          {/* Event Cover Image or Placeholder */}
                          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
                            {evt.coverImage ? (
                              <img
                                src={evt.coverImage}
                                alt={evt.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${style.banner} flex items-center justify-center p-6 text-center`}>
                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-md">
                                  {style.icon}
                                </div>
                              </div>
                            )}

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${style.badge}`}>
                                {evt.categoryType}
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-600 text-white backdrop-blur-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Proposed Category</span>
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white font-medium backdrop-blur-sm bg-black/50 px-2.5 py-1 rounded-xl">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-rose-400" /> {evt.venue || 'Campus Auditorium'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-400" /> {evt.eventDate}
                              </span>
                            </div>
                          </div>

                          {/* Event Proposal Details */}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                                {evt.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold shrink-0 border border-purple-300 dark:border-purple-800">
                                Needs Faculty Approval
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                              {evt.description}
                            </p>

                            {/* Proposer Info */}
                            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-slate-100">
                                    Proposed by: {evt.proposedBy}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    Roll: {evt.proposedByRoll || evt.proposedById || 'N/A'} • Branch: CSE
                                  </div>
                                </div>
                              </div>

                              <div className="text-right text-[10px] text-slate-400">
                                Submitted: {evt.proposedAt}
                              </div>
                            </div>

                            {/* Proposed Coordinator */}
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 px-1">
                              Nominated Faculty Convener: <strong className="text-slate-900 dark:text-slate-100">{evt.coordinatorFaculty || 'Prof. Sandip Kumar Singh'}</strong>
                            </div>
                          </div>

                          {/* Approval / Rejection Actions */}
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                            <button
                              onClick={() => handleOpenRejectEventModal(evt)}
                              className="flex-1 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject / Bump Event</span>
                            </button>

                            <button
                              onClick={() => handleApproveEventProposal(evt)}
                              className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve & Activate Category</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      No Pending Event Category Proposals
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All event category proposals from students have been moderated.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: STUDENT'S PERSONAL SUBMISSIONS & PROPOSALS PANEL */}
      {activeViewTab === 'my_submissions' && isStudent && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Top Submissions Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Media & Event Requests</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  Track Your Faculty Verification Status
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Check whether your videos and proposed event categories have been approved by faculty or bumped with remarks.
                </p>
              </div>

              {/* Sub-tab Switcher (My Videos vs My Proposed Events) */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setMySubmissionsSubTab('videos')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mySubmissionsSubTab === 'videos'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>My Videos ({studentSubmissions.length})</span>
                </button>

                <button
                  onClick={() => setMySubmissionsSubTab('events')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mySubmissionsSubTab === 'events'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Proposed Events ({studentProposedEvents.length})</span>
                </button>
              </div>
            </div>

            {/* MY SUBMISSIONS: VIDEOS TAB */}
            {mySubmissionsSubTab === 'videos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Video Upload Requests ({studentSubmissions.length})
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryOption('Tejas Annual Sports Fest 2k25');
                      setShowUploadModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit New Video</span>
                  </button>
                </div>

                {studentSubmissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {studentSubmissions.map((item) => {
                      const style = getEventBadgeStyle(item.category);
                      const isPending = item.status === 'pending';
                      const isApproved = item.status === 'approved' || !item.status;
                      const isRejected = item.status === 'rejected';

                      return (
                        <div
                          key={item.id}
                          className={`bg-slate-50 dark:bg-slate-850/80 border rounded-3xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between ${
                            isPending ? 'border-amber-300 dark:border-amber-800' :
                            isApproved ? 'border-emerald-300 dark:border-emerald-800' :
                            'border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {/* Media Preview */}
                          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950">
                            {item.type === 'video' ? (
                              <video
                                src={item.mediaUrl}
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={item.mediaUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${style.badge}`}>
                                {item.category}
                              </span>

                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-md flex items-center gap-1 ${
                                isPending ? 'bg-amber-600' :
                                isApproved ? 'bg-emerald-600' :
                                'bg-rose-600'
                              }`}>
                                {isPending && <Clock className="w-3 h-3" />}
                                {isApproved && <CheckCircle className="w-3 h-3" />}
                                {isRejected && <XCircle className="w-3 h-3" />}
                                <span className="capitalize">
                                  {isPending ? 'Pending Faculty Review' : isApproved ? 'Live & Approved' : 'Bumped / Rejected'}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Info & Feedback */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {item.description}
                            </p>

                            {/* Faculty Feedback Banner if Approved or Rejected */}
                            {isApproved && item.reviewedBy && (
                              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Approved by <strong>{item.reviewedBy}</strong> on {item.reviewedAt}</span>
                              </div>
                            )}

                            {isRejected && (
                              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
                                <div className="font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Faculty Reason for Rejection:</span>
                                </div>
                                <p className="text-[10px] pl-4">{item.rejectionReason || 'Content did not meet official event guidelines.'}</p>
                              </div>
                            )}

                            {isPending && (
                              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Broadcasted to all faculty members for review.</span>
                              </div>
                            )}
                          </div>

                          {/* Action footer */}
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-slate-400">
                              Submitted {item.uploadedAt}
                            </span>

                            <button
                              onClick={() => onDeleteGalleryItem(item.id)}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Request</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 mx-auto flex items-center justify-center">
                      <Film className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      No Video Submissions Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Have video clips from Tejas 2k25 or Freshers Party? Submit them to the faculty board for verification.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategoryOption('Tejas Annual Sports Fest 2k25');
                        setShowUploadModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
                    >
                      + Submit Your First Video
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MY SUBMISSIONS: PROPOSED EVENTS TAB */}
            {mySubmissionsSubTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    My Proposed Event Categories ({studentProposedEvents.length})
                  </div>

                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Propose Another Event</span>
                  </button>
                </div>

                {studentProposedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {studentProposedEvents.map((evt) => {
                      const style = getEventBadgeStyle(evt.name);
                      const isPending = evt.status === 'pending';
                      const isApproved = evt.status === 'approved';
                      const isRejected = evt.status === 'rejected';

                      return (
                        <div
                          key={evt.id}
                          className={`bg-slate-50 dark:bg-slate-850/80 border rounded-3xl p-5 shadow-sm space-y-3.5 flex flex-col justify-between ${
                            isPending ? 'border-amber-300 dark:border-amber-800' :
                            isApproved ? 'border-emerald-300 dark:border-emerald-800' :
                            'border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950">
                            {evt.coverImage ? (
                              <img
                                src={evt.coverImage}
                                alt={evt.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${style.banner} flex items-center justify-center p-6 text-center`}>
                                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-md">
                                  {style.icon}
                                </div>
                              </div>
                            )}

                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${style.badge}`}>
                                {evt.categoryType}
                              </span>

                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-md flex items-center gap-1 ${
                                isPending ? 'bg-amber-600' :
                                isApproved ? 'bg-emerald-600' :
                                'bg-rose-600'
                              }`}>
                                {isPending && <Clock className="w-3 h-3" />}
                                {isApproved && <CheckCircle className="w-3 h-3" />}
                                {isRejected && <XCircle className="w-3 h-3" />}
                                <span className="capitalize">
                                  {isPending ? 'Pending Faculty Review' : isApproved ? 'Approved & Live Category' : 'Bumped / Rejected'}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                              {evt.name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {evt.description}
                            </p>

                            <div className="text-[11px] text-slate-600 dark:text-slate-400">
                              Venue: <strong className="text-slate-800 dark:text-slate-200">{evt.venue}</strong> • Date: {evt.eventDate}
                            </div>

                            {/* Faculty Feedback */}
                            {isApproved && evt.approvedBy && (
                              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Approved by <strong>{evt.approvedBy}</strong> on {evt.approvedAt}</span>
                              </div>
                            )}

                            {isRejected && (
                              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
                                <div className="font-bold flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Faculty Reason for Rejection:</span>
                                </div>
                                <p className="text-[10px] pl-4">{evt.rejectionReason || 'Event proposal did not conform to college event schedule.'}</p>
                              </div>
                            )}

                            {isPending && (
                              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Broadcasted to all faculty members for review.</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-slate-400">
                              Proposed {evt.proposedAt}
                            </span>

                            {onDeleteEvent && (
                              <button
                                onClick={() => onDeleteEvent(evt.id)}
                                className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete Proposal</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-850/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 mx-auto flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      No Proposed Events
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Want to organize or group videos under a new campus celebration? Propose a new event category for faculty review.
                    </p>
                    <button
                      onClick={() => setShowCreateEventModal(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm"
                    >
                      + Propose Your First Event
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: PUBLIC APPROVED GALLERY (GROUPED BY EVENT ALBUMS) */}
      {activeViewTab === 'public' && viewLayout === 'grouped' && (
        <div className="space-y-10">
          {allEventCategories
            .filter(cat => selectedEventCategory === 'All' || selectedEventCategory === cat)
            .map((cat) => {
              const eventItems = approvedItemsByEvent[cat] || [];
              const style = getEventBadgeStyle(cat);
              const eventPhotosCount = eventItems.filter(i => i.type === 'image').length;
              const eventVideosCount = eventItems.filter(i => i.type === 'video').length;

              if (eventItems.length === 0 && (searchQuery.trim() || activeTypeTab !== 'all')) {
                return null;
              }

              return (
                <div 
                  key={cat}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
                >
                  {/* Event Album Header Banner */}
                  <div className={`p-5 rounded-2xl bg-gradient-to-r ${style.banner} border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                          {style.icon}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                          {cat}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {cat === 'Tejas Annual Sports Fest 2k25' && 'Athletics, Track & Field, Cricket Tournament, Badminton, and Championship matches at MPDREC.'}
                        {cat === 'Freshers Party' && 'Aarambh Fresher Welcome Stage, Mr. & Ms. Fresher contest, Dance performances, and DJ Floor.'}
                        {cat !== 'Tejas Annual Sports Fest 2k25' && cat !== 'Freshers Party' && `Curated and faculty-verified media captures from the ${cat} event.`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <ImageIcon className="w-3.5 h-3.5" /> {eventPhotosCount} Photos
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                          <VideoIcon className="w-3.5 h-3.5" /> {eventVideosCount} Videos
                        </span>
                      </div>

                      {canUpload && (
                        <button
                          onClick={() => handleOpenUploadForEvent(cat)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1.5 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isStudent ? 'Submit Media' : 'Add to Event'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Event Media Cards Grid */}
                  {eventItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {eventItems.map((item) => {
                        const showDelete = canDeleteItem(item);
                        const hasLiked = item.likedBy?.includes(session.userId || session.name);

                        return (
                          <div
                            key={item.id}
                            className="group bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-500 transition-all flex flex-col justify-between"
                          >
                            {/* Media Thumbnail Container */}
                            <div 
                              onClick={() => setSelectedItem(item)}
                              className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer"
                            >
                              {item.type === 'video' ? (
                                <>
                                  {item.thumbnailUrl ? (
                                    <img
                                      src={item.thumbnailUrl}
                                      alt={item.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <video
                                      src={item.mediaUrl}
                                      muted
                                      playsInline
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-center justify-center">
                                    <div className="w-11 h-11 rounded-2xl bg-purple-600/90 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                                      <Play className="w-5 h-5 fill-white ml-0.5" />
                                    </div>
                                  </div>
                                  {item.duration && (
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono font-bold backdrop-blur-md">
                                      {item.duration}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <img
                                    src={item.mediaUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                    <span className="text-white text-xs font-bold flex items-center gap-1">
                                      <Maximize2 className="w-3.5 h-3.5" /> Expand
                                    </span>
                                  </div>
                                </>
                              )}

                              {/* Media Type Badge */}
                              <div className="absolute top-2 right-2 flex items-center gap-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md flex items-center gap-1">
                                  {item.type === 'video' ? <VideoIcon className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                                  <span className="capitalize">{item.type}</span>
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 
                                  onClick={() => setSelectedItem(item)}
                                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors leading-snug"
                                >
                                  {item.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Footer Meta & Actions */}
                              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                                    {item.uploadedBy.slice(0, 1)}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {item.uploadedBy} • {item.eventDate || item.uploadedAt}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => onToggleLike(item.id)}
                                    className={`p-1 px-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-bold ${
                                      hasLiked
                                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border-rose-200 dark:border-rose-800'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-600'
                                    }`}
                                  >
                                    <Heart className={`w-3 h-3 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    <span>{item.likes}</span>
                                  </button>

                                  {showDelete && (
                                    <button
                                      onClick={() => setDeleteConfirmId(item.id)}
                                      className="p-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700"
                                      title="Remove photo / video"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                      <div className="text-xs text-slate-400">
                        No verified photos or videos match this active search for <strong>{cat}</strong>.
                      </div>
                      {canUpload && (
                        <button
                          onClick={() => handleOpenUploadForEvent(cat)}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          + {isStudent ? 'Submit media for' : 'Upload first media item for'} {cat}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* SECTION 4: PUBLIC APPROVED GALLERY (FLUID GRID FEED) */}
      {activeViewTab === 'public' && viewLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredApprovedItems.map((item) => {
            const showDelete = canDeleteItem(item);
            const hasLiked = item.likedBy?.includes(session.userId || session.name);
            const style = getEventBadgeStyle(item.category);

            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                {/* Media Thumbnail Container */}
                <div 
                  onClick={() => setSelectedItem(item)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer"
                >
                  {item.type === 'video' ? (
                    <>
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/90 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-mono font-bold backdrop-blur-md">
                          {item.duration}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" /> View Photo
                        </span>
                      </div>
                    </>
                  )}

                  {/* Top Badges: Event Category & Type */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${style.badge}`}>
                      {item.category}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-950/70 text-white backdrop-blur-md flex items-center gap-1">
                      {item.type === 'video' ? <VideoIcon className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                      <span className="capitalize">{item.type}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => setSelectedItem(item)}
                      className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors leading-snug"
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Uploader Meta & Footer Actions */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {item.uploadedBy.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.uploadedBy}
                        </div>
                        <div className="text-[9px] text-slate-400 capitalize">
                          {item.uploadedByRole} • {item.eventDate || item.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onToggleLike(item.id)}
                        className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-[11px] font-bold ${
                          hasLiked
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border-rose-200 dark:border-rose-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-600'
                        }`}
                        title={hasLiked ? 'Liked' : 'Like this post'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>

                      {showDelete && (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-all"
                          title="Remove photo / video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State for Grid Feed */}
      {activeViewTab === 'public' && viewLayout === 'grid' && filteredApprovedItems.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No media found in this filter
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            There are no photographs or videos matching your search "{searchQuery}" or category "{selectedEventCategory}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedEventCategory('All');
              setActiveTypeTab('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* FACULTY REJECTION / BUMP MODAL */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Reject / Bump Media Request
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide reason for student feedback
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {rejectingItem.title}
              </div>
              <div className="text-[11px] text-slate-500">
                Submitted by <strong>{rejectingItem.uploadedBy}</strong> ({rejectingItem.category})
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Rejection Reason:
              </label>

              <div className="space-y-2">
                {REJECTION_PRESETS.map((reason, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      rejectionReason === reason
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionPreset"
                      checked={rejectionReason === reason}
                      onChange={() => setRejectionReason(reason)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or Custom Feedback Remarks (Optional):
                </label>
                <textarea
                  placeholder="Enter specific feedback or guidance for student..."
                  value={customRejectionText}
                  onChange={(e) => setCustomRejectionText(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Bump / Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / SUBMISSION MODAL (With Student Moderation Notice & Faculty Event Creator) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold mb-1">
                  <Upload className="w-3 h-3" />
                  <span>{isStudent ? 'Student Video Submission Desk' : 'Faculty Event Media Ingestion'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {isStudent ? 'Submit Video for Faculty Verification' : 'Publish Media to Campus Event'}
                </h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Verification Notice */}
            {isStudent && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Faculty Approval Required</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 pl-6 leading-relaxed">
                  To prevent unauthorized events and maintain official campus standards, all student submissions are sent to the <strong>Faculty Review Board</strong>. Once approved by faculty, your video will immediately go live on the official gallery.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitUpload} className="space-y-4">
              
              {/* Media Type Toggle: Image vs Video */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('video')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    uploadType === 'video'
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 shadow-xs ring-2 ring-purple-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <VideoIcon className="w-4 h-4 text-purple-600" />
                  <span>Video Reel (MP4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadType('image')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    uploadType === 'image'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Photograph</span>
                </button>
              </div>

              {/* Event Category Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Campus Event <span className="text-rose-500">*</span>
                </label>
                
                <select
                  value={selectedCategoryOption}
                  onChange={(e) => setSelectedCategoryOption(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tejas Annual Sports Fest 2k25">🏆 Tejas Annual Sports Fest 2k25</option>
                  <option value="Freshers Party">🎉 Freshers Party ("Aarambh")</option>
                  {allEventCategories
                    .filter(c => c !== 'Tejas Annual Sports Fest 2k25' && c !== 'Freshers Party')
                    .map(cat => (
                      <option key={cat} value={cat}>✨ {cat}</option>
                    ))
                  }
                  {canCreateEventCategory && (
                    <option value="__custom__">➕ + Register New Custom Event Category (Faculty Only)</option>
                  )}
                </select>

                {!canCreateEventCategory && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <Info className="w-3 h-3 text-blue-500" />
                    <span>Students can upload media to official faculty-moderated event categories.</span>
                  </p>
                )}
              </div>

              {/* Faculty Custom Event Name Input */}
              {canCreateEventCategory && selectedCategoryOption === '__custom__' && (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
                    New Event Name (Faculty Privileged)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technova Tech Fest 2k25, Annual Alumni Meet, Hackathon"
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-blue-600 dark:text-blue-400">
                    This will create a new official event album category for the entire college.
                  </p>
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Media Title / Highlight Heading <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={uploadType === 'video' ? 'e.g. Tejas 2k25: 4x100m Relay Sprint Thrilling Finish' : 'e.g. Freshers 2025: Crowd cheering at DJ floor'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Description / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the moment, players, performers, branch or match score..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Source Mode: Direct URL vs File Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Media Source / File <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setUploadSourceMode('url')}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                        uploadSourceMode === 'url' ? 'bg-blue-100 text-blue-700' : 'text-slate-400'
                      }`}
                    >
                      Online Video/Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadSourceMode('file')}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                        uploadSourceMode === 'file' ? 'bg-blue-100 text-blue-700' : 'text-slate-400'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {uploadSourceMode === 'url' ? (
                  <input
                    type="url"
                    required
                    placeholder={uploadType === 'video' ? 'https://.../video.mp4' : 'https://images.unsplash.com/...'}
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={uploadType === 'video' ? 'video/mp4,video/webm,video/ogg' : 'image/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 transition-all bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-bold">
                        {isUploading ? 'Encoding file...' : mediaUrl ? 'File Loaded (Click to replace)' : `Choose ${uploadType === 'video' ? 'Video (.mp4)' : 'Photo (.jpg, .png)'}`}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sample Preset Shortcut Bar */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Sample Clip / Photo Presets for Testing:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetPresetSample(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                      'video',
                      'Tejas Annual Sports Fest 2k25',
                      'Tejas 2k25: Sprint Championship Match Clip'
                    )}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 font-medium"
                  >
                    🎬 Tejas Sports Video (MP4)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetPresetSample(
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      'video',
                      'Freshers Party',
                      'Freshers 2025: Dance & Ramp Walk Reel'
                    )}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-purple-600 font-medium"
                  >
                    🎬 Freshers Dance Video (MP4)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetPresetSample(
                      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
                      'image',
                      'Tejas Annual Sports Fest 2k25',
                      'Tejas 2k25: Football Tournament Finals'
                    )}
                    className="text-[10px] px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium"
                  >
                    📸 Tejas Football Photo
                  </button>
                </div>
              </div>

              {/* Tags & Event Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Tejas2k25, Cricket, Final, GoldMedal"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!mediaUrl.trim() || !title.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <SendHorizontal className="w-4 h-4" />
                  <span>{isStudent ? 'Submit for Faculty Review' : 'Publish Verified Media'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX & MEDIA PLAYER MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close viewer (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev & Next */}
          <button
            onClick={handlePrevItem}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:flex items-center justify-center"
            title="Previous item"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextItem}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:flex items-center justify-center"
            title="Next item"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div className="max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Media Screen */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] bg-black flex items-center justify-center overflow-hidden">
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[65vh] w-full object-contain"
                />
              ) : (
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="max-h-[65vh] w-full object-contain"
                />
              )}
            </div>

            {/* Bottom Meta Banner */}
            <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {selectedItem.category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified by Faculty
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight truncate">
                    {selectedItem.title}
                  </h2>
                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedItem.type === 'video' && (
                    <button
                      onClick={() => handleSetAsHeroVideo(selectedItem)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                        heroSetSuccess === selectedItem.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950'
                      }`}
                      title="Set this video reel as the default hero card video across the campus portal"
                    >
                      {heroSetSuccess === selectedItem.id ? (
                        <>
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>Set as Default Hero Video!</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>Set as Campus Hero Video</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onToggleLike(selectedItem.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      selectedItem.likedBy?.includes(session.userId || session.name)
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${selectedItem.likedBy?.includes(session.userId || session.name) ? 'fill-white' : ''}`} />
                    <span>{selectedItem.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => handleCopyShare(selectedItem)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Submitter & Verification Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                    {selectedItem.uploadedBy.slice(0, 1)}
                  </div>
                  <span>Captured by <strong>{selectedItem.uploadedBy}</strong> ({selectedItem.uploadedByRole}) • {selectedItem.eventDate || selectedItem.uploadedAt}</span>
                </div>

                {selectedItem.reviewedBy && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approved by {selectedItem.reviewedBy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / PROPOSE CAMPUS EVENT MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>{isFacultyOrAdmin ? 'Faculty Event Administration' : 'Student Event Proposal'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {isFacultyOrAdmin ? 'Register Official Campus Event' : 'Propose New Campus Event Category'}
                </h2>
              </div>
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Notice */}
            {isStudent && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 text-purple-900 dark:text-purple-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Faculty Permission & Approval Required</span>
                </div>
                <p className="text-[11px] text-purple-800 dark:text-purple-300 pl-6 leading-relaxed">
                  Students cannot create arbitrary public events directly. Submitting this proposal will forward it to the <strong>Faculty Review Board</strong>. Once approved, the event will appear in the official directory and students will be able to upload media reels to it.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitEvent} className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Category Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technova Tech Fest 2k25, Aarambh Cultural Night, Annual Robotics Challenge"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Event Category Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Domain / Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newEventCategoryType}
                    onChange={(e) => setNewEventCategoryType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Sports">🏆 Sports & Athletics</option>
                    <option value="Cultural">🎉 Cultural & Social Festival</option>
                    <option value="Technical">💻 Technical Fest / Hackathon</option>
                    <option value="Academic">📚 Academic Conference / Seminar</option>
                    <option value="Celebration">✨ Campus Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tentative Event Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Objectives & Overview <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Outline the schedule, target batches, branches participating, and main highlights..."
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Venue & Faculty Coordinator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campus Venue
                  </label>
                  <input
                    type="text"
                    placeholder="Main Auditorium, Ground, Seminar Hall 1"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Convener / In-Charge
                  </label>
                  <input
                    type="text"
                    placeholder="Prof. Sandip Kumar Singh"
                    value={newEventCoordinator}
                    onChange={(e) => setNewEventCoordinator(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Cover Image URL (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Cover Poster / Banner URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or direct image link"
                  value={newEventCoverImage}
                  onChange={(e) => setNewEventCoverImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newEventName.trim() || !newEventDescription.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                  <SendHorizontal className="w-4 h-4" />
                  <span>{isFacultyOrAdmin ? 'Create Official Event' : 'Submit Proposal to Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACULTY REJECT EVENT PROPOSAL MODAL */}
      {rejectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Reject / Bump Event Proposal
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide reason for student feedback
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRejectingEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {rejectingEvent.name}
              </div>
              <div className="text-[11px] text-slate-500">
                Proposed by <strong>{rejectingEvent.proposedBy}</strong> ({rejectingEvent.categoryType})
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Rejection Reason:
              </label>

              <div className="space-y-2">
                {EVENT_REJECTION_PRESETS.map((reason, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      rejectEventReason === reason
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-semibold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventRejectionPreset"
                      checked={rejectEventReason === reason}
                      onChange={() => setRejectEventReason(reason)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or Custom Faculty Remarks (Optional):
                </label>
                <textarea
                  placeholder="Enter specific feedback or guidelines for students..."
                  value={customRejectEventText}
                  onChange={(e) => setCustomRejectEventText(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectEvent}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Bump / Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE EVENT CATEGORY CONFIRMATION MODAL */}
      {deleteEventConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Delete Campus Event Category?
              </h3>
              <p className="text-xs text-slate-500">
                This will remove the event category from the directory. Associated media items will remain archived.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteEventConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteEvent) {
                    onDeleteEvent(deleteEventConfirmId);
                  }
                  setDeleteEventConfirmId(null);
                  showToast('🗑️ Event category removed.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Remove from Campus Gallery?
              </h3>
              <p className="text-xs text-slate-500">
                This photograph or video will be permanently removed from the official MPDREC repository.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteGalleryItem(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast('🗑️ Media item deleted successfully.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
