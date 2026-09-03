import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, Video, Calendar, MapPin, Tag, CheckCircle2, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem, CouncilId } from '../../types/councils';
import { AuthSession } from '../../types/erp';
import { CouncilLogo } from './CouncilLogo';

interface CouncilSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  council?: CollegeCouncil;
  allCouncils: CollegeCouncil[];
  session: AuthSession;
  onEventSubmitted: (event: CouncilEvent) => void;
  onMediaSubmitted: (media: CouncilMediaItem) => void;
}

export const CouncilSubmissionModal: React.FC<CouncilSubmissionModalProps> = ({
  isOpen,
  onClose,
  council,
  allCouncils,
  session,
  onEventSubmitted,
  onMediaSubmitted
}) => {
  const [submissionType, setSubmissionType] = useState<'media' | 'event'>('media');
  const [selectedCouncilId, setSelectedCouncilId] = useState<CouncilId>(
    council?.id || 'technical_council'
  );

  // Common Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState('Fest, Campus, Highlights');
  
  // Event Specific Fields
  const [eventCategory, setEventCategory] = useState<CouncilEvent['category']>('Workshop');
  const [eventTime, setEventTime] = useState('04:00 PM - 06:00 PM');
  const [eventVenue, setEventVenue] = useState('Auditorium Hall / SAC Lounge');
  const [tagline, setTagline] = useState('');
  const [maxSeats, setMaxSeats] = useState('100');
  const [prizes, setPrizes] = useState('');
  const [eligibility, setEligibility] = useState('Open to all B.Tech students');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine user authority level
  const isAdminOrFaculty = session.role === 'admin' || session.role === 'faculty';
  // Check if student is 3rd or 4th year
  const isSeniorStudent = session.role === 'student' && (session.studentYear === 3 || session.studentYear === 4);
  const canDirectPublish = isAdminOrFaculty || isSeniorStudent;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setMediaUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const now = new Date().toISOString();
    const isApprovedImmediately = canDirectPublish;

    if (submissionType === 'media') {
      const finalUrl = previewImage || mediaUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      const newMedia: CouncilMediaItem = {
        id: `MED-SUB-${Date.now()}`,
        councilId: selectedCouncilId,
        type: mediaType,
        url: finalUrl,
        videoEmbedUrl: mediaType === 'video' ? videoEmbedUrl : undefined,
        title: title.trim(),
        caption: description.trim() || title.trim(),
        eventName: eventName.trim() || 'Campus Highlights',
        eventDate: eventDate,
        tags: tags.length > 0 ? tags : ['CampusMemory'],
        uploadedBy: {
          name: session.name || 'Student Contributor',
          role: session.role === 'student' 
            ? `${session.studentYear || 1}${session.studentYear === 1 ? 'st' : session.studentYear === 2 ? 'nd' : session.studentYear === 3 ? 'rd' : 'th'} Year Student`
            : session.role.toUpperCase(),
          id: session.userId || 'STU-CONTRIB',
          year: session.studentYear || 1,
          timestamp: now
        },
        status: isApprovedImmediately ? 'approved' : 'pending',
        approvedBy: isApprovedImmediately ? `${session.name} (${session.role})` : undefined,
        approvedAt: isApprovedImmediately ? now : undefined,
        likes: 0,
        likedBy: []
      };

      onMediaSubmitted(newMedia);
      setSuccessMessage(
        isApprovedImmediately
          ? '🎉 Media published immediately to Council Public Gallery!'
          : '⏳ Media submitted successfully! Queued for moderation by Council Head & Faculty Convener.'
      );
    } else {
      // Event Submission
      const newEvent: CouncilEvent = {
        id: `EVT-SUB-${Date.now()}`,
        councilId: selectedCouncilId,
        title: title.trim(),
        tagline: tagline.trim() || 'Official Council Event',
        category: eventCategory,
        date: eventDate,
        time: eventTime.trim(),
        venue: eventVenue.trim(),
        description: description.trim() || 'Exciting college council event. Mark your calendars!',
        bannerUrl: previewImage || mediaUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        status: 'upcoming',
        registrationOpen: true,
        registeredCount: 0,
        maxSeats: parseInt(maxSeats, 10) || 100,
        registeredUsers: [],
        eligibility: eligibility.trim(),
        prizes: prizes.trim(),
        submittedBy: {
          name: session.name,
          role: session.role,
          id: session.userId,
          timestamp: now
        },
        moderationStatus: isApprovedImmediately ? 'approved' : 'pending'
      };

      onEventSubmitted(newEvent);
      setSuccessMessage(
        isApprovedImmediately
          ? '🎉 Event published immediately to Council Portal!'
          : '⏳ Event proposal submitted successfully! Waiting for Convener review.'
      );
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Submit to Councils Hub
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Moderation Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {canDirectPublish
                  ? '👑 Direct Publishing Privilege Enabled (Senior / Council Leadership)'
                  : '🛡️ Submissions by 1st/2nd years are reviewed by Council Conveners & Heads'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Feedback */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-3 bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Submission Mode Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSubmissionType('media')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                submissionType === 'media'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media & Memory Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmissionType('event')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                submissionType === 'event'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Event / Workshop Proposal</span>
            </button>
          </div>

          {/* Select Target Council */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Council
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allCouncils.map(c => {
                const isSelected = selectedCouncilId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCouncilId(c.id)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <CouncilLogo councilId={c.id} size="sm" />
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {c.name.replace('Council', '').trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title / Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {submissionType === 'media' ? 'Media Caption / Title *' : 'Event Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                submissionType === 'media'
                  ? 'e.g. Flashmob by the Fountain / Hackathon Winner Presentation'
                  : 'e.g. Android Development Bootcamp with Kotlin'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* If Event: Category, Tagline, Date, Time & Venue */}
          {submissionType === 'event' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Contest">Contest</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Fest">Fest</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Performance">Performance</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Celebration">Celebration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Time / Schedule
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    placeholder="e.g. 03:00 PM - 05:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={e => setEventVenue(e.target.value)}
                    placeholder="e.g. Computer Center Lab 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Max Capacity / Seats
                  </label>
                  <input
                    type="number"
                    value={maxSeats}
                    onChange={e => setMaxSeats(e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Prizes / Certification (Optional)
                  </label>
                  <input
                    type="text"
                    value={prizes}
                    onChange={e => setPrizes(e.target.value)}
                    placeholder="e.g. Winner ₹5,000 + Certificate"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* If Media: Media Type toggle & video link */}
          {submissionType === 'media' && (
            <>
              <div className="flex items-center space-x-4">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Media Format:
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      mediaType === 'image'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Photo / Poster
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      mediaType === 'video'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Video / Reel / Aftermovie
                  </button>
                </div>
              </div>

              {mediaType === 'video' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    YouTube Embed URL / Video Link
                  </label>
                  <input
                    type="url"
                    value={videoEmbedUrl}
                    onChange={e => setVideoEmbedUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Associated Event Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="e.g. AAROHAN 2K25 / Cricket Tournament"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Fest, Winner, Campus, Band"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* Media / Banner Upload & URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {submissionType === 'media' ? 'Photo / Video Thumbnail *' : 'Event Banner Poster'}
            </label>
            
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/70 rounded-2xl p-4 bg-slate-950/60 text-center transition-colors">
              {previewImage || mediaUrl ? (
                <div className="relative group rounded-xl overflow-hidden max-h-48 flex items-center justify-center">
                  <img
                    src={previewImage || mediaUrl}
                    alt="Preview"
                    className="max-h-48 w-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500">
                      Change File
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setMediaUrl('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-300 mb-1">
                    Drag and drop your photo or browse files
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Supports JPG, PNG, WebP up to 15MB
                  </p>
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>Upload Local Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Direct Image URL input */}
            <div className="mt-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={e => {
                  setMediaUrl(e.target.value);
                  setPreviewImage(null);
                }}
                placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide context, event highlights, or registration criteria..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          {/* Submitter Info Footer Note */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>
                Submitting as: <strong className="text-slate-200">{session.name}</strong> ({session.role.toUpperCase()})
              </span>
            </div>
            <span className="text-slate-500">
              {canDirectPublish ? '⚡ Instant Publish Mode' : '🛡️ Review Queued'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing...' : canDirectPublish ? 'Publish Instantly' : 'Submit for Moderation'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
