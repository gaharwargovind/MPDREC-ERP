import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Building, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  LogIn, 
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  Upload,
  RotateCcw,
  X,
  Lock,
  Image as ImageIcon,
  ExternalLink,
  Film,
  Check,
  Clapperboard,
  Layers
} from 'lucide-react';
import { Student, Notice, AuthSession } from '../types/erp';
import { CollegeLogo } from './CollegeLogo';
import { storageService } from '../services/storageService';

interface GuestLandingViewProps {
  onOpenLogin: () => void;
  toppers: Student[];
  notices: Notice[];
  session?: AuthSession;
  onNavigate?: (tab: string) => void;
}

const PRESET_CAMPUS_VIDEOS: Array<{
  id: string;
  name: string;
  url: string;
  poster: string;
  category: string;
}> = [];

export const GuestLandingView: React.FC<GuestLandingViewProps> = ({
  onOpenLogin,
  toppers,
  notices,
  session,
  onNavigate
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Initialize hero video from persistent storage
  const [savedHeroData, setSavedHeroData] = useState(() => storageService.getHeroVideo());
  const [videoSrc, setVideoSrc] = useState<string>(() => storageService.getHeroVideo().url);
  const [customVideoName, setCustomVideoName] = useState<string | null>(() => {
    const hero = storageService.getHeroVideo();
    return hero.name;
  });

  const [showFullVideoModal, setShowFullVideoModal] = useState(false);
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canChangeVideo = session?.role === 'admin' || session?.role === 'faculty';

  // Load all available campus videos (presets + approved gallery videos)
  const allAvailableVideos = React.useMemo(() => {
    const galleryItems = storageService.getGalleryItems();
    const approvedVideos = galleryItems
      .filter(item => item.type === 'video' && item.status === 'approved')
      .map(item => ({
        id: item.id,
        name: item.title,
        url: item.mediaUrl,
        poster: item.thumbnailUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85',
        category: item.category || 'Event Video'
      }));

    return [...PRESET_CAMPUS_VIDEOS, ...approvedVideos];
  }, [showReelsModal]);

  // Is current video actively saved as the persistent default
  const isCurrentVideoSavedAsDefault = savedHeroData.url === videoSrc;

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Ensure autoplay on mount & on video source change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Video autoplay prevented by browser policy:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [videoSrc]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVideoError = () => {
    console.warn('Campus video failed to load.');
    setVideoError(true);
    if (allAvailableVideos.length > 0) {
      const nextIdx = (currentVideoIndex + 1) % allAvailableVideos.length;
      setCurrentVideoIndex(nextIdx);
      setVideoSrc(allAvailableVideos[nextIdx].url);
    } else {
      setVideoSrc('');
    }
  };

  // Handle Video Upload: automatically sets and persists as default
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canChangeVideo) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setVideoSrc(dataUrl);
          setCustomVideoName(file.name);
          storageService.setHeroVideo(dataUrl, file.name);
          setSavedHeroData({
            url: dataUrl,
            name: file.name,
            poster: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85',
            isCustom: true
          });
          setIsPlaying(true);
          setVideoError(false);
          triggerToast(`✓ Video "${file.name}" uploaded & successfully set as default Campus Hero Video.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const url = customUrlInput.trim();
    const name = 'Custom Stream URL';
    setVideoSrc(url);
    setCustomVideoName(name);
    storageService.setHeroVideo(url, name);
    setSavedHeroData({
      url: url,
      name: name,
      poster: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85',
      isCustom: true
    });
    setShowUrlInput(false);
    setCustomUrlInput('');
    setVideoError(false);
    triggerToast('✓ Custom video URL applied and set as default Campus Hero Video.');
  };

  const handleSetCurrentAsDefault = (url: string, name: string, poster?: string) => {
    setVideoSrc(url);
    setCustomVideoName(name);
    storageService.setHeroVideo(url, name, poster);
    setSavedHeroData({
      url: url,
      name: name,
      poster: poster || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85',
      isCustom: true
    });
    setShowReelsModal(false);
    triggerToast(`🌟 "${name}" has been set as the permanent Default Campus Hero Video.`);
  };

  const handleResetDefaultVideo = () => {
    storageService.resetHeroVideo();
    const defaultHero = storageService.getHeroVideo();
    setVideoSrc(defaultHero.url);
    setCustomVideoName(defaultHero.name);
    setSavedHeroData(defaultHero);
    setVideoError(false);
    triggerToast('✓ Reset to MPDREC Institutional Drone Quadrangle default video.');
  };

  return (
    <div className="space-y-12 py-4">

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 backdrop-blur-md">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-100">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Hero Presentation with Live Campus Video Playback */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/50 text-white min-h-[440px] flex items-center group">
        
        {/* HTML5 Live Video Playback Layer with Multi-Source Resilience */}
        {videoSrc ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-slate-950">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onError={handleVideoError}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
              poster={savedHeroData.poster || ''}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          </div>
        )}

        {/* Sophisticated Multi-Layer Scrim & Gradient Overlays for High-Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-blue-950/60 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 z-0 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

        {/* Floating Top-Right Video Controls & Default Selector */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center justify-end gap-2">
          
          {/* Active Default Indicator Badge */}
          {videoSrc && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 text-amber-300 text-[11px] font-bold border border-amber-500/40 backdrop-blur-md shadow-lg">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="truncate max-w-[170px]">{customVideoName || 'Campus Video'}</span>
              {isCurrentVideoSavedAsDefault && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Active Default
                </span>
              )}
            </div>
          )}

          {/* Quick "Set as Default" Action Button if current stream is not saved default */}
          {videoSrc && !isCurrentVideoSavedAsDefault && (
            <button
              onClick={() => handleSetCurrentAsDefault(videoSrc, customVideoName || 'Selected Campus Reel')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 animate-pulse transition-all"
              title="Set currently playing video as the permanent default hero video"
            >
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Set as Default</span>
            </button>
          )}

          {/* Campus Reels & Preset Selector Button */}
          {allAvailableVideos.length > 0 && (
            <button
              onClick={() => setShowReelsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 backdrop-blur-md shadow-md text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Browse all campus video reels and tours"
            >
              <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Video Reels</span>
            </button>
          )}

          {/* Admin / Faculty Video Upload & URL Controls */}
          {canChangeVideo && (
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-700 backdrop-blur-md">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/webm,video/ogg,video/mov"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all"
                title="Upload custom video from computer (Admin/Faculty)"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Video</span>
              </button>

              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-all"
                title="Enter custom video stream URL"
              >
                <ExternalLink className="w-3 h-3" />
                <span>URL</span>
              </button>

              {videoSrc && (
                <button
                  onClick={handleResetDefaultVideo}
                  className="p-1 rounded-xl hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Clear Campus Video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Media Playback Controls */}
          {videoSrc && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 backdrop-blur-md shadow-md transition-all"
                title={isPlaying ? 'Pause Campus Video' : 'Play Campus Video'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 backdrop-blur-md shadow-md transition-all"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => setShowFullVideoModal(true)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 backdrop-blur-md shadow-md transition-all"
                title="Expand Full Campus Drone Video"
              >
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          )}
        </div>

        {/* Custom Video URL Popover */}
        {showUrlInput && (
          <div className="absolute top-16 right-4 z-30 p-3.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm w-full animate-in fade-in">
            <form onSubmit={handleApplyCustomUrl} className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Direct MP4 Video Stream URL</span>
                <button type="button" onClick={() => setShowUrlInput(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="url"
                required
                placeholder="https://example.com/drone-footage.mp4"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-400">Sets as default automatically</span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
                >
                  Set as Default Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10 max-w-3xl space-y-4 p-8 sm:p-12">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-400/40 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              AICTE Approved • Affiliated with AKTU (College Code: 1214)
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/25 text-blue-200 text-[11px] font-medium border border-blue-400/30 backdrop-blur-md">
              <Video className="w-3 h-3 text-emerald-400 animate-pulse" />
              Live Campus Drone Feed • Academic & Administrative Building
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1.5 shadow-2xl shrink-0 border border-amber-300 hidden sm:flex items-center justify-center">
              <CollegeLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                Maa Pateshwari Devi Rajkiya Engineering College
              </h1>
              <p className="text-xs sm:text-sm text-amber-300 font-medium tracking-wide mt-1">
                माँ पाटेश्वरी देवी, राजकीय इंजीनियरिंग कॉलेज, गोण्डा, उ०प्र० • ।। सर्वे ज्ञानमयाः भवन्तु ।।
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#eaebf3] font-['Times_New_Roman',serif] leading-relaxed max-w-2xl drop-shadow-sm">
            Pioneering excellence in technical education, research, and engineering innovation in Uttar Pradesh. Empowering future technologists with world-class faculty, advanced laboratories, and holistic campus life.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all border border-blue-500/40"
              id="btn-guest-login"
            >
              <LogIn className="w-4 h-4" />
              <span>Enter Unified ERP Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all shadow-md hover:border-amber-400/60 flex items-center gap-2 active:scale-95"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Explore Campus Event Gallery</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campus Video Reels & Default Selector Modal */}
      {showReelsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Campus Hero Video Reels & Stream Hub
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select or upload any video to set as the persistent default on the Campus Overview Hero Card.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReelsModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video List */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Available Campus Video Streams ({allAvailableVideos.length})
                </span>
                
                {canChangeVideo && (
                  <button
                    onClick={() => {
                      setShowReelsModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Video File</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {allAvailableVideos.map((vid) => {
                  const isPlayingThis = videoSrc === vid.url;
                  const isDefaultThis = savedHeroData.url === vid.url;

                  return (
                    <div
                      key={vid.id}
                      className={`group relative rounded-2xl p-3 border transition-all overflow-hidden flex flex-col justify-between ${
                        isPlayingThis 
                          ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Thumbnail / Poster */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img
                            src={vid.poster}
                            alt={vid.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                              {vid.category}
                            </span>
                          </div>

                          {isDefaultThis && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black shadow-md">
                              <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                              <span>Active Default</span>
                            </div>
                          )}

                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-semibold truncate">
                            <span className="truncate">{vid.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-800/60 mt-2">
                        <button
                          onClick={() => {
                            setVideoSrc(vid.url);
                            setCustomVideoName(vid.name);
                            setIsPlaying(true);
                            setShowReelsModal(false);
                            triggerToast(`▶ Now playing "${vid.name}" on Hero Card.`);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            isPlayingThis
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isPlayingThis ? 'Currently Playing' : 'Preview'}</span>
                        </button>

                        <button
                          onClick={() => handleSetCurrentAsDefault(vid.url, vid.name, vid.poster)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isDefaultThis
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                          }`}
                          disabled={isDefaultThis}
                        >
                          <Star className={`w-3 h-3 ${isDefaultThis ? 'text-emerald-400' : 'fill-slate-950 text-slate-950'}`} />
                          <span>{isDefaultThis ? 'Default' : 'Set as Default'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>MPDREC Campus Visual Identity • All default changes persist in local system storage.</span>
              <button
                onClick={handleResetDefaultVideo}
                className="text-slate-400 hover:text-white hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Drone Quadrangle</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Campus Drone Tour Modal */}
      {showFullVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">MPDREC Campus Video & Aerial Drone Overview</h3>
              </div>
              <button
                onClick={() => setShowFullVideoModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <video
                ref={modalVideoRef}
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>Maa Pateshwari Devi Rajkiya Engineering College • Campus Aerial Quadrangle & Academic Facade</span>
              {canChangeVideo ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose another video file ({session?.role}) →
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" /> Video replacement restricted to Admin & Faculty
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explore Campus Gallery Banner Callout */}
      {onNavigate && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shadow-xs shrink-0">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Campus Highlights
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Explore MPDREC Campus Event Gallery
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Browse official event photographs and video reels from Euphoria 2026, 24-Hour CodeSprint Hackathons, and Sports Tournaments.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('gallery')}
            className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Open Event Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* College Accolades & Fast Facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">100%</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Merit Admissions via UPSEE/JEE</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">AKTU #1214</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">State Govt. Engineering College</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">20+ Acres</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Lush Green Modern Campus</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">94.2%</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">Academic Pass & Progression Rate</div>
        </div>
      </div>

      {/* Academic Excellence & Degree Programs Standing (Student details restricted in Guest Mode) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-200 dark:border-amber-800">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Hall of Academic Excellence & Standing
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">University Affiliation & Academic Benchmarks</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
              🔒 Student Marksheets Restricted
            </span>
            <button
              onClick={onOpenLogin}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Sign In for Full Access →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                100%
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Merit-Based Admissions</h4>
                <p className="text-[11px] text-slate-500">UPCET & JEE Main Counseling</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Admitting high-merit engineering scholars from across Uttar Pradesh into CSE, ECE, ME, and Civil programs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                9.2+
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Top University SGPA Track</h4>
                <p className="text-[11px] text-slate-500">Consistent AKTU Gold Medal Contenders</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rigorous laboratory practicals, internal class test assessments, and continuous outcome-based education.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                AKTU
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Affiliated State College</h4>
                <p className="text-[11px] text-slate-500">College Code: 1214 (MPDREC)</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Government engineering institution established under Uttar Pradesh State Directorate of Technical Education.
            </p>
          </div>
        </div>
      </div>

      {/* Euphoria 2026 Campus Fest & World Class Labs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> March 20–22, 2026
          </div>
          <h3 className="text-2xl font-black tracking-tight">Euphoria 2026: Annual Techno-Cultural Fest</h3>
          <p className="text-xs text-purple-200 leading-relaxed">
            Northern India's premier state collegiate fest featuring 24-Hour Hackathons, Robo-Wars, Code Sprints, Cultural Pro-Nites, and National Project Exhibitions.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">₹1.5L Prize Pool</span>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold">40+ Colleges Participating</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
            <Building className="w-3.5 h-3.5" /> Campus Infrastructure
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">World-Class Engineering Labs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Equipped with High-Performance Computing clusters, AI & IoT Innovation Hubs, 1 Gbps NKN fiber connectivity, Saryu Girls Residence Hostel with round-the-clock security, and Central Library with over 12,000 volumes.
          </p>
          <button
            onClick={onOpenLogin}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 pt-2"
          >
            Access Student Portals & Timetables <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
