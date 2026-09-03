import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  AtSign, 
  Sparkles, 
  Check, 
  Upload, 
  Camera, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Palette,
  Bell,
  CheckCheck,
  ImageIcon
} from 'lucide-react';
import { HubUserProfile } from '../../types/hub';
import { BIO_STATUS_PRESETS, AVATAR_PRESETS, DEFAULT_WALLPAPERS } from '../../data/hubSeedData';
import { AvatarPickerModal } from './AvatarPickerModal';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HubUserProfile;
  onSaveProfile: (profile: HubUserProfile) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [handle, setHandle] = useState(profile.handle || '@student');
  const [avatar, setAvatar] = useState(profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [bioStatus, setBioStatus] = useState(profile.bioStatus || BIO_STATUS_PRESETS[0]);
  const [customBio, setCustomBio] = useState(profile.customBio || '');
  const [branch, setBranch] = useState(profile.branch || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(profile.semester || 3);
  const [wallpaperTheme, setWallpaperTheme] = useState(profile.wallpaperTheme || 'academic-graph');
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled ?? true);
  const [readReceipts, setReadReceipts] = useState(profile.readReceipts ?? true);

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'appearance'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Synchronize state whenever profile changes (e.g. session switch) or modal opens
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setHandle(profile.handle || `@${(profile.displayName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
      setAvatar(profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
      setBioStatus(profile.bioStatus || BIO_STATUS_PRESETS[0]);
      setCustomBio(profile.customBio || '');
      setBranch(profile.branch || 'Computer Science & Engineering');
      setSemester(profile.semester || 3);
      setWallpaperTheme(profile.wallpaperTheme || 'academic-graph');
      setSoundEnabled(profile.soundEnabled ?? true);
      setReadReceipts(profile.readReceipts ?? true);
    }
  }, [profile?.userId, profile?.displayName, profile?.avatar, profile?.wallpaperTheme, isOpen]);

  if (!isOpen) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedHandle = handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    
    const updated: HubUserProfile = {
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      handle: formattedHandle,
      avatar,
      bioStatus,
      customBio: customBio.trim(),
      branch,
      semester,
      wallpaperTheme,
      soundEnabled,
      readReceipts
    };

    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Student Identity & Hub Settings</h3>
                <p className="text-xs text-slate-400">Customize your public handle, academic badge, bio status & theme</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 px-5 pt-2 bg-slate-950/30 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Profile & Avatar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academic')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'academic'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Academic Badges & Bio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'appearance'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Chat Theme & Sounds
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: Profile & Avatar */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                
                {/* Avatar Preview & Photo Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt={displayName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500/60 ring-4 ring-blue-500/20 shadow-xl"
                    />
                    <button 
                      type="button"
                      onClick={() => setIsAvatarPickerOpen(true)}
                      className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
                      title="Change Photo"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-bold text-white text-sm">{displayName || 'Student User'}</span>
                      <span className="text-xs font-mono text-blue-400">{handle}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Upload from device gallery, capture using camera, or pick from presets.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => setIsAvatarPickerOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" /> Open Photo Studio
                      </button>

                      <label 
                        htmlFor="direct-avatar-file-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> From Gallery
                      </label>
                      <input
                        id="direct-avatar-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Academic Avatar Presets
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                          avatar === preset 
                            ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105' 
                            : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        {avatar === preset && (
                          <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name & Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-400" /> Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Govind Chandra Gaharwar"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <AtSign className="w-3.5 h-3.5 text-indigo-400" /> Username Handle
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="@govind_cs"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Academic Badges & Bio Status */}
            {activeTab === 'academic' && (
              <div className="space-y-5">
                
                {/* Bio Status Quick Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Current Academic Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BIO_STATUS_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBioStatus(preset)}
                        className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all truncate ${
                          bioStatus === preset
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate">{preset}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Status Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Custom Status / Headline
                  </label>
                  <input
                    type="text"
                    value={bioStatus}
                    onChange={(e) => setBioStatus(e.target.value)}
                    placeholder="e.g. In Lab working on Computer Vision 🔬"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Academic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Branch / Department
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                      <option value="Information Technology">Information Technology (IT)</option>
                      <option value="Civil Engineering">Civil Engineering (CE)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                      <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-purple-400" /> Academic Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-purple-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s} (B.Tech)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Bio / About */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    About Me / Research Interests
                  </label>
                  <textarea
                    rows={2}
                    value={customBio}
                    onChange={(e) => setCustomBio(e.target.value)}
                    placeholder="Share your coding interests, lab projects, or subject mastery..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

              </div>
            )}

            {/* TAB 3: Chat Appearance & Themes */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-purple-400" /> Chat Canvas Wallpaper Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_WALLPAPERS.map((wp) => (
                      <button
                        key={wp.id}
                        type="button"
                        onClick={() => setWallpaperTheme(wp.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          wallpaperTheme === wp.id
                            ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${wp.previewColor} border border-slate-700 flex items-center justify-center shrink-0`}>
                          {wallpaperTheme === wp.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{wp.name}</div>
                          <div className="text-[11px] text-slate-400">Telegram/WhatsApp Hybrid</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Audio Notification Chimes</div>
                        <div className="text-[11px] text-slate-400">Play subtle sound on new incoming chat messages</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <CheckCheck className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Read Receipts & Double Ticks</div>
                        <div className="text-[11px] text-slate-400">Show blue double ticks when peer reads message</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={readReceipts}
                      onChange={(e) => setReadReceipts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Footer Save Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified MPDREC Student Identity
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
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatar={avatar}
        onSelectAvatar={(newAvatar) => setAvatar(newAvatar)}
        title="Student Profile Photo Studio"
      />
    </>
  );
};
