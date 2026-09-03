import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  RefreshCw, 
  Check, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AVATAR_PRESETS } from '../../data/hubSeedData';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelectAvatar: (avatarUrl: string) => void;
  title?: string;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar,
  title = 'Change Avatar / Photo'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'presets' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const [urlInput, setUrlInput] = useState('');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentAvatar);
  }, [currentAvatar]);

  // Clean up camera stream on unmount or tab change
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab, isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported on this browser/device.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Camera permission denied or camera not found.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Crop square from center & mirror flip horizontally
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      const startX = ((video.videoWidth || 400) - size) / 2;
      const startY = ((video.videoHeight || 400) - size) / 2;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to square avatar
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 360, 360);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewUrl(compressedDataUrl);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleSave = () => {
    onSelectAvatar(previewUrl);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">{title}</h3>
              <p className="text-xs text-slate-400">Choose from gallery, take a camera snapshot, or select presets</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Web URL</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Current Selection / Preview Box */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-2xl ring-4 ring-blue-500/20"
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-slate-900 shadow-md">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* 1. UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  Click or drag photo from your device
                </p>
                <p className="text-xs text-slate-400">
                  Supports JPG, PNG, WebP (Auto-optimized & cropped)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* 2. CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <div className="font-bold">Camera Access Issue</div>
                    <div>{cameraError}</div>
                  </div>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="ml-auto px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-square max-w-xs mx-auto shadow-inner flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Shutter Overlay Button */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-4 z-10">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full bg-white text-slate-900 border-4 border-blue-600 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      title="Snap Photo"
                    >
                      <Camera className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
              <p className="text-center text-xs text-slate-400">
                Align your face in the center and click the capture shutter.
              </p>
            </div>
          )}

          {/* 3. PRESETS TAB */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Curated Academic Avatars
              </label>
              <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto pr-1">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewUrl(preset)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                      previewUrl === preset
                        ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105'
                        : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    {previewUrl === preset && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. WEB URL TAB */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">
                Paste Image Link URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  Load
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Use This Avatar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
