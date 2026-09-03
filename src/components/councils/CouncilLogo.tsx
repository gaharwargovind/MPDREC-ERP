import React, { useState, useEffect } from 'react';
import { CouncilId } from '../../types/councils';
import { storageService } from '../../services/storageService';
import { supabaseSyncService } from '../../services/supabaseSyncService';
import { Loader2 } from 'lucide-react';

interface CouncilLogoProps {
  councilId: CouncilId;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glow?: boolean;
  interactive?: boolean;
  customSrc?: string;
  allowUpload?: boolean;
  onLogoChange?: (newUrl: string) => void;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
  '2xl': 'w-44 h-44',
};

const DEFAULT_COUNCIL_IMAGE_PATHS: Record<CouncilId, string[]> = {
  technical_council: [
    '/technical council.png',
    '/logos/technical council.png',
    '/logos/technical-council.png',
    '/logos/technical_council.png',
    '/technical-council.png',
  ],
  media_council: [
    '/media council.jpg',
    '/logos/media council.jpg',
    '/logos/media-council.jpg',
    '/logos/media_council.jpg',
    '/media-council.jpg',
  ],
  cultural_council: [
    '/cultural council.jpg',
    '/logos/cultural council.jpg',
    '/logos/cultural-council.jpg',
    '/logos/cultural_council.jpg',
    '/cultural-council.jpg',
  ],
  literary_council: [
    '/literary council.jpg',
    '/logos/literary council.jpg',
    '/logos/literary-council.jpg',
    '/logos/literary_council.jpg',
    '/literary-council.jpg',
  ],
  hobby_council: [
    '/hobby council.jpg',
    '/logos/hobby council.jpg',
    '/logos/hobby-council.jpg',
    '/logos/hobby_council.jpg',
    '/hobby-council.jpg',
  ],
  sports_council: [
    '/sports council.jpg',
    '/logos/sports council.jpg',
    '/logos/sports-council.jpg',
    '/logos/sports_council.jpg',
    '/sports-council.jpg',
  ],
  fine_arts_council: [
    '/council of fine arts.jpg',
    '/logos/council of fine arts.jpg',
    '/logos/council-of-fine-arts.jpg',
    '/logos/fine_arts_council.jpg',
    '/council-of-fine-arts.jpg',
  ],
};

export const CouncilLogo: React.FC<CouncilLogoProps> = ({
  councilId,
  className = '',
  size = 'md',
  glow = true,
  interactive = false,
  customSrc,
  allowUpload = false,
  onLogoChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    const saved = storageService.getCustomCouncilLogo(councilId);
    if (saved) return saved;
    if (customSrc && (customSrc.startsWith('data:') || customSrc.startsWith('http://') || customSrc.startsWith('https://') || customSrc.startsWith('/uploads/'))) {
      return customSrc;
    }
    return null;
  });

  useEffect(() => {
    const syncLogo = () => {
      const saved = storageService.getCustomCouncilLogo(councilId);
      if (saved) {
        setCustomLogo(saved);
      } else if (customSrc && (customSrc.startsWith('data:') || customSrc.startsWith('http://') || customSrc.startsWith('https://') || customSrc.startsWith('/uploads/'))) {
        setCustomLogo(customSrc);
      } else {
        setCustomLogo(null);
      }
    };

    syncLogo();

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ councilId?: string; urlOrBase64?: string; allLogos?: Record<string, string> }>;
      if (customEvent.detail) {
        if (customEvent.detail.allLogos && customEvent.detail.allLogos[councilId]) {
          setCustomLogo(customEvent.detail.allLogos[councilId]);
        } else if (customEvent.detail.councilId === councilId) {
          setCustomLogo(customEvent.detail.urlOrBase64 || null);
        }
      }
    };

    window.addEventListener('mpdrec_council_logo_changed', handleCustomEvent);
    window.addEventListener('storage', syncLogo);
    return () => {
      window.removeEventListener('mpdrec_council_logo_changed', handleCustomEvent);
      window.removeEventListener('storage', syncLogo);
    };
  }, [councilId, customSrc]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const finalUrl = await supabaseSyncService.uploadCouncilLogo(councilId, file);
        setCustomLogo(finalUrl);
        if (onLogoChange) onLogoChange(finalUrl);
      } catch (err) {
        console.error('Council logo upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (isUploading) {
    return (
      <div className={`relative rounded-full shrink-0 flex flex-col items-center justify-center overflow-hidden bg-slate-900 border border-blue-500/50 ${sizeClasses[size]} ${className}`}>
        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        <span className="text-[9px] font-bold text-blue-300 mt-1">Saving...</span>
      </div>
    );
  }

  if (customLogo) {
    return (
      <div className={`relative rounded-full shrink-0 flex items-center justify-center overflow-hidden group/logo ${sizeClasses[size]} ${interactive ? 'transition-all duration-300 transform group-hover:scale-105' : ''} ${className}`}>
        <img
          src={customLogo}
          alt={`${councilId} logo`}
          className="w-full h-full object-cover rounded-full shadow-lg"
          referrerPolicy="no-referrer"
        />
        {glow && (
          <div className="absolute inset-0 rounded-full ring-2 ring-white/30 pointer-events-none" />
        )}
        {allowUpload && (
          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 text-white text-[10px] font-bold p-1 text-center z-10">
            <span>Change</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
      </div>
    );
  }

  const renderSvgContent = () => {
    switch (councilId) {
      case 'technical_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tcBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="25%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="70%" stopColor="#f97316" />
                <stop offset="95%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="tcStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="30%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="tcCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="35%" stopColor="#e11d48" />
                <stop offset="65%" stopColor="#a855f7" />
                <stop offset="90%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
              <filter id="tcGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <circle cx="120" cy="120" r="115" fill="#1b2a47" />
            <circle cx="120" cy="120" r="115" fill="none" stroke="#2a3f66" strokeWidth="1.5" />

            <g stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 58 75 L 35 75" />
              <circle cx="30" cy="75" r="4.5" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 68 88 L 45 88 L 38 96 L 22 96" />
              <circle cx="18" cy="96" r="4.5" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 62 108 L 32 108" />
              <circle cx="28" cy="108" r="4.5" fill="none" stroke="#38bdf8" strokeWidth="3" />
            </g>

            <g stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 182 75 L 205 75 L 212 85 L 220 85" />
              <circle cx="224" cy="85" r="4.5" fill="none" stroke="#facc15" strokeWidth="3" />
              <path d="M 165 90 L 195 90 L 202 96 L 222 96" />
              <circle cx="226" cy="96" r="4.5" fill="none" stroke="#facc15" strokeWidth="3" />
              <path d="M 162 104 L 188 104" />
              <circle cx="192" cy="104" r="4.5" fill="none" stroke="#facc15" strokeWidth="3" />
            </g>

            <g stroke="#d946ef" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 172 172 L 200 172" />
              <circle cx="204" cy="172" r="4.5" fill="none" stroke="#d946ef" strokeWidth="3" />
              <path d="M 158 184 L 180 184 L 186 190 L 210 190" />
              <circle cx="214" cy="190" r="4.5" fill="none" stroke="#d946ef" strokeWidth="3" />
            </g>

            <path
              d="M 50 70 L 192 70 L 175 88 L 132 88 L 132 102 L 95 102 L 95 88 L 50 88 Z"
              fill="url(#tcBarGrad)"
              filter="url(#tcGlowFilter)"
            />

            <polygon
              points="192,70 198,72 205,70 199,76 202,83 194,78 188,81 190,74"
              fill="#ffffff"
              filter="drop-shadow(0 0 4px #fef08a)"
            />

            <path
              d="M 95 102 L 128 102 L 118 198 L 95 198 L 95 155 L 75 135 L 95 115 Z"
              fill="url(#tcStemGrad)"
            />

            <path
              d="M 132 88 C 176 96 192 128 178 168 C 165 190 138 198 116 196 C 135 180 148 162 142 135 C 138 118 126 102 116 95 Z"
              fill="url(#tcCurveGrad)"
            />

            <g stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round">
              <path d="M 106 110 L 106 148" />
              <circle cx="106" cy="148" r="3.5" fill="#ffffff" stroke="none" />
              <path d="M 116 155 L 116 182" />
              <circle cx="116" cy="182" r="3" fill="#facc15" stroke="none" />
            </g>

            <g transform="translate(136, 160)">
              <circle cx="0" cy="0" r="7" fill="#1b2a47" />
              <polygon points="-4.5,4 4.5,4 6,14 -6,14" fill="#1b2a47" />
            </g>

            <circle cx="132" cy="132" r="4" fill="none" stroke="#fde047" strokeWidth="2.5" />
            <circle cx="120" cy="188" r="3" fill="#38bdf8" />
          </svg>
        );

      case 'media_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="mediaBgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#141a29" />
                <stop offset="65%" stopColor="#0a0e17" />
                <stop offset="100%" stopColor="#020408" />
              </radialGradient>
              <linearGradient id="mediaNeonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="mediaChrome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#94a3b8" />
                <stop offset="55%" stopColor="#475569" />
                <stop offset="70%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="brushFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="40%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="url(#mediaBgGrad)" />

            <circle
              cx="120"
              cy="120"
              r="106"
              fill="none"
              stroke="url(#mediaNeonCyan)"
              strokeWidth="4"
              filter="drop-shadow(0 0 8px #00f0ff)"
            />
            <circle cx="120" cy="120" r="102" fill="none" stroke="#083344" strokeWidth="1" />

            <g transform="translate(24, 75) rotate(-18)">
              <path
                d="M 0 0 C 15 -12 35 -5 42 15 C 48 35 32 60 12 55 C -2 50 -8 20 0 0 Z"
                fill="#334155"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <path
                d="M 6 8 C 16 -2 30 3 34 18 C 38 32 26 48 12 44"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <rect x="6" y="6" width="6" height="5" rx="1" fill="#f8fafc" />
              <rect x="7" y="16" width="6" height="5" rx="1" fill="#f8fafc" />
              <rect x="10" y="26" width="6" height="5" rx="1" fill="#f8fafc" />
              <rect x="15" y="36" width="6" height="5" rx="1" fill="#f8fafc" />
            </g>

            <g transform="translate(160, 90)">
              <rect x="0" y="6" width="48" height="34" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <rect x="12" y="0" width="16" height="7" rx="2" fill="#334155" />
              <circle cx="38" cy="12" r="3" fill="#ef4444" />
              <circle cx="24" cy="23" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <circle cx="24" cy="23" r="10" fill="#0284c7" stroke="#22d3ee" strokeWidth="2" filter="drop-shadow(0 0 4px #00f0ff)" />
              <polygon points="21,17 31,23 21,29" fill="#ffffff" />
            </g>

            <text
              x="120"
              y="94"
              textAnchor="middle"
              fill="url(#brushFill)"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
            >
              MEDIA
            </text>

            <text
              x="120"
              y="126"
              textAnchor="middle"
              fill="url(#mediaChrome)"
              fontSize="20"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="4"
            >
              COUNCIL
            </text>

            <text
              x="120"
              y="146"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="12"
              fontWeight="800"
              letterSpacing="2"
            >
              MPDREC GONDA
            </text>

            <text
              x="120"
              y="166"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="12"
              fontStyle="italic"
              fontFamily="'Brush Script MT', cursive, Georgia, serif"
              letterSpacing="0.5"
            >
              Your Story Begins Here.
            </text>

            <g transform="translate(120, 192)">
              <rect x="-6" y="-14" width="12" height="18" rx="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
              <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#22d3ee" strokeWidth="1.5" />
              <line x1="-4" y1="-3" x2="4" y2="-3" stroke="#22d3ee" strokeWidth="1.5" />
              <path d="M -10 -4 A 10 10 0 0 0 10 -4" fill="none" stroke="#22d3ee" strokeWidth="2" />
              <line x1="0" y1="6" x2="0" y2="12" stroke="#22d3ee" strokeWidth="2" />
              <line x1="-6" y1="12" x2="6" y2="12" stroke="#22d3ee" strokeWidth="2" />

              <path
                d="M -18 -8 L -18 0 M -24 -14 L -24 6 M -30 -6 L -30 -2"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M 18 -8 L 18 0 M 24 -14 L 24 6 M 30 -6 L 30 -2"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </svg>
        );

      case 'cultural_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cultNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#172554" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="cultGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="url(#cultNavyGrad)" stroke="url(#cultGoldGrad)" strokeWidth="4" />
            <circle cx="120" cy="120" r="92" fill="none" stroke="url(#cultGoldGrad)" strokeWidth="2.5" />

            <g transform="translate(32, 85) scale(0.65)">
              <polygon points="0,-12 4,-4 12,-4 6,2 8,11 0,6 -8,11 -6,2 -12,-4 -4,-4" fill="url(#cultGoldGrad)" />
            </g>
            <g transform="translate(208, 85) scale(0.65)">
              <polygon points="0,-12 4,-4 12,-4 6,2 8,11 0,6 -8,11 -6,2 -12,-4 -4,-4" fill="url(#cultGoldGrad)" />
            </g>

            <path id="cultTopPath" d="M 40 120 A 80 80 0 0 1 200 120" fill="none" />
            <text fill="#ffffff" fontSize="15" fontWeight="900" letterSpacing="3.5" fontFamily="system-ui, sans-serif">
              <textPath href="#cultTopPath" startOffset="50%" textAnchor="middle">
                CULTURAL COUNCIL
              </textPath>
            </text>

            <path id="cultBotPath" d="M 210 124 A 90 90 0 0 1 30 124" fill="none" />
            <text fill="#fef08a" fontSize="7.2" fontWeight="800" letterSpacing="1" fontFamily="system-ui, sans-serif">
              <textPath href="#cultBotPath" startOffset="50%" textAnchor="middle">
                MAA PATESHWARI DEVI RAJKIYA ENGINEERING COLLEGE GONDA
              </textPath>
            </text>

            <path d="M 120 120 L 82 52 A 74 74 0 0 1 158 52 Z" fill="#9d174d" />
            <path d="M 120 120 L 158 52 A 74 74 0 0 1 192 125 Z" fill="#0d9488" />
            <path d="M 120 120 L 192 125 A 74 74 0 0 1 140 190 Z" fill="#ea580c" />
            <path d="M 120 120 L 140 190 A 74 74 0 0 1 100 190 Z" fill="#b91c1c" />
            <path d="M 120 120 L 100 190 A 74 74 0 0 1 48 125 Z" fill="#4338ca" />
            <path d="M 120 120 L 48 125 A 74 74 0 0 1 82 52 Z" fill="#6b21a8" />

            <g transform="translate(120, 72) scale(0.65)">
              <circle cx="0" cy="-14" r="3.5" fill="#fef08a" />
              <path d="M 0 -10 L 0 5 L -8 18 M 0 5 L 8 16 M -12 -2 L 0 -6 L 12 -12" stroke="#fef08a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            <g transform="translate(156, 86) scale(0.6)">
              <path d="M -8 -8 Q 0 -12 8 -4 Q 12 6 4 12" stroke="#f8fafc" strokeWidth="2" fill="none" />
              <circle cx="4" cy="-4" r="1.5" fill="#f8fafc" />
              <ellipse cx="14" cy="-10" rx="3" ry="2" fill="#f8fafc" />
              <line x1="17" y1="-10" x2="17" y2="-20" stroke="#f8fafc" strokeWidth="1.5" />
            </g>

            <g transform="translate(76, 140) scale(0.55)">
              <ellipse cx="0" cy="0" rx="14" ry="18" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
              <ellipse cx="-5" cy="-4" rx="3" ry="2" fill="#1e1b4b" />
              <ellipse cx="5" cy="-4" rx="3" ry="2" fill="#1e1b4b" />
              <path d="M -6 6 Q 0 12 6 6" stroke="#1e1b4b" strokeWidth="2" fill="none" />
            </g>

            <g transform="translate(120, 168)">
              <ellipse cx="0" cy="6" rx="14" ry="5" fill="#f59e0b" />
              <path d="M 0 -8 Q 5 0 0 6 Q -5 0 0 -8 Z" fill="#fef08a" filter="drop-shadow(0 0 3px #f59e0b)" />
            </g>

            <g transform="translate(120, 120)">
              <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="url(#cultGoldGrad)" strokeWidth="2.5" />
              <path d="M 0 -14 C -6 -7 -6 4 0 10 C 6 4 6 -7 0 -14 Z" fill="#f59e0b" />
              <path d="M -10 -9 C -12 -2 -8 5 0 10 C -4 3 -6 -4 -10 -9 Z" fill="#fbbf24" />
              <path d="M 10 -9 C 12 -2 8 5 0 10 C 4 3 6 -4 10 -9 Z" fill="#fbbf24" />
              <circle cx="0" cy="11" r="2.5" fill="#d97706" />
            </g>
          </svg>
        );

      case 'literary_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="litBgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="60%" stopColor="#10253d" />
                <stop offset="100%" stopColor="#081422" />
              </radialGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="url(#litBgGrad)" stroke="#38bdf8" strokeWidth="3" />

            <path d="M 38 120 A 82 82 0 0 1 202 120" fill="none" stroke="#f8fafc" strokeWidth="2.5" />

            <path id="litTopPath" d="M 36 120 A 84 84 0 0 1 204 120" fill="none" />
            <text fill="#ffffff" fontSize="16" fontWeight="900" letterSpacing="4.5" fontFamily="'Cinzel', 'Times New Roman', serif">
              <textPath href="#litTopPath" startOffset="50%" textAnchor="middle">
                LITERARY COUNCIL
              </textPath>
            </text>

            <g transform="translate(120, 138)">
              <polygon points="0,22 -84,-42 -60,-68 0,-18" fill="#f97316" />
              <polygon points="0,22 84,-42 60,-68 0,-18" fill="#0284c7" />

              <polygon points="0,22 -68,-58 -44,-80 0,-24" fill="#eab308" />
              <polygon points="0,22 68,-58 44,-80 0,-24" fill="#06b6d4" />

              <polygon points="0,22 -44,-72 -20,-88 0,-30" fill="#f43f5e" />
              <polygon points="0,22 44,-72 20,-88 0,-30" fill="#a855f7" />

              <polygon points="0,22 -22,-82 0,-92 0,-32" fill="#38bdf8" />
              <polygon points="0,22 22,-82 0,-92 0,-32" fill="#fb923c" />

              <path
                d="M 0 20 Q -40 -5 -78 8 Q -78 -24 -40 -30 Q 0 -10 0 20 Z"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <path
                d="M 0 20 Q 40 -5 78 8 Q 78 -24 40 -30 Q 0 -10 0 20 Z"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              <line x1="-65" y1="-8" x2="-15" y2="-18" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="-65" y1="-2" x2="-15" y2="-12" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="15" y1="-18" x2="65" y2="-8" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="15" y1="-12" x2="65" y2="-2" stroke="#cbd5e1" strokeWidth="1.5" />

              <ellipse cx="0" cy="20" rx="8" ry="5" fill="#dc2626" />
              <line x1="0" y1="20" x2="0" y2="-30" stroke="#b91c1c" strokeWidth="2.5" />
            </g>

            <g transform="translate(120, 192)">
              <rect x="-70" y="-14" width="140" height="28" rx="4" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
              <polygon points="-70,-14 -62,-14 -70,-6" fill="#f97316" />
              <polygon points="70,-14 62,-14 70,-6" fill="#f97316" />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="17"
                fontWeight="900"
                fontFamily="'Cinzel', 'Times New Roman', serif"
                letterSpacing="3"
              >
                REC GONDA
              </text>
            </g>
          </svg>
        );

      case 'hobby_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hobbyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="#0f172a" stroke="url(#hobbyGoldGrad)" strokeWidth="4" />

            <circle cx="120" cy="120" r="92" fill="#ffffff" stroke="url(#hobbyGoldGrad)" strokeWidth="2.5" />

            <path id="hobbyTopPath" d="M 32 120 A 88 88 0 0 1 208 120" fill="none" />
            <text fill="#ffffff" fontSize="9.5" fontWeight="900" letterSpacing="1.5" fontFamily="system-ui, sans-serif">
              <textPath href="#hobbyTopPath" startOffset="50%" textAnchor="middle">
                RAJKIYA ENGINEERING COLLEGE GONDA
              </textPath>
            </text>

            <polygon points="24,115 26,120 31,120 27,123 28,128 24,125 20,128 21,123 17,120 22,120" fill="url(#hobbyGoldGrad)" />
            <polygon points="216,115 218,120 223,120 219,123 220,128 216,125 212,128 213,123 209,120 214,120" fill="url(#hobbyGoldGrad)" />

            <g transform="translate(120, 58)">
              <polygon points="0,-14 4,-4 14,-4 6,3 9,13 0,7 -9,13 -6,3 -14,-4 -4,-4" fill="url(#hobbyGoldGrad)" />
              <polygon points="-32,-11 -28,-3 -20,-3 -26,3 -24,11 -32,6 -40,11 -38,3 -44,-3 -36,-3" fill="url(#hobbyGoldGrad)" />
              <polygon points="32,-11 36,-3 44,-3 38,3 40,11 32,6 24,11 26,3 20,-3 28,-3" fill="url(#hobbyGoldGrad)" />
            </g>

            <text
              x="120"
              y="98"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="28"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
            >
              HOBBY
            </text>
            <text
              x="120"
              y="128"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="27"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
            >
              COUNCIL
            </text>

            <g transform="translate(120, 158)">
              <g transform="translate(-48, 0) scale(0.65)">
                <circle cx="0" cy="-18" r="4.5" fill="#0f172a" />
                <path d="M 0 -13 L -4 4 L -10 16 M -4 4 L 4 16" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                <line x1="-8" y1="-2" x2="16" y2="-18" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="22" cy="-22" r="3" fill="#dc2626" />
              </g>

              <g transform="translate(-16, -4) scale(0.65)">
                <rect x="-6" y="-14" width="12" height="18" rx="6" fill="#0f172a" />
                <path d="M -9 -4 A 9 9 0 0 0 9 -4" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="0" y1="5" x2="0" y2="14" stroke="#0f172a" strokeWidth="2.5" />
                <line x1="-6" y1="14" x2="6" y2="14" stroke="#0f172a" strokeWidth="2.5" />
              </g>

              <g transform="translate(16, -4) scale(0.65)">
                <ellipse cx="0" cy="0" rx="14" ry="11" fill="#0f172a" />
                <circle cx="-5" cy="-3" r="2" fill="#ffffff" />
                <circle cx="2" cy="-5" r="2" fill="#ffffff" />
                <circle cx="7" cy="0" r="2" fill="#ffffff" />
                <line x1="-10" y1="-12" x2="14" y2="12" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
              </g>

              <g transform="translate(48, 0) scale(0.65)">
                <circle cx="0" cy="-18" r="4.5" fill="#0f172a" />
                <path d="M 0 -13 L -4 6 L -8 18 M -4 6 L 4 18 M 0 -6 L 10 -16" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="12" cy="-18" r="2.5" fill="#0f172a" />
              </g>
            </g>

            <path id="hobbyBotPath" d="M 214 126 A 94 94 0 0 1 26 126" fill="none" />
            <text fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="3" fontFamily="system-ui, sans-serif">
              <textPath href="#hobbyBotPath" startOffset="50%" textAnchor="middle">
                ★ UNLEASH YOUR PASSION ★
              </textPath>
            </text>
          </svg>
        );

      case 'sports_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sportsRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="35%" stopColor="#22c55e" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

            <g transform="translate(42, 95) rotate(-28)">
              <rect x="-4" y="-45" width="8" height="65" rx="3" fill="#b45309" />
              <rect x="-3" y="20" width="6" height="22" rx="2" fill="#ffffff" stroke="#b45309" strokeWidth="1.5" />
            </g>
            <circle cx="34" cy="146" r="8.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <path d="M 28 144 Q 34 148 40 144" stroke="#ffffff" strokeWidth="1.2" fill="none" />

            <g transform="translate(74, 52) rotate(-35)">
              <ellipse cx="0" cy="-22" rx="14" ry="18" fill="none" stroke="#0284c7" strokeWidth="3" />
              <line x1="0" y1="-4" x2="0" y2="25" stroke="#475569" strokeWidth="3.5" />
            </g>

            <g transform="translate(120, 36)">
              <circle cx="0" cy="0" r="19" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
              <path d="M -19 0 Q 0 8 19 0 M 0 -19 Q 8 0 0 19 M -13 -13 Q 0 0 -13 13 M 13 -13 Q 0 0 13 13" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            </g>

            <g transform="translate(166, 42) rotate(30)">
              <rect x="-16" y="-3" width="32" height="6" fill="#64748b" rx="2" />
              <rect x="-22" y="-9" width="7" height="18" fill="#dc2626" rx="2" />
              <rect x="15" y="-9" width="7" height="18" fill="#dc2626" rx="2" />
            </g>

            <g transform="translate(194, 95)">
              <circle cx="0" cy="0" r="18" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              <polygon points="0,-8 7,-2 4,6 -4,6 -7,-2" fill="#0f172a" />
              <line x1="0" y1="-8" x2="0" y2="-18" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="7" y1="-2" x2="16" y2="-4" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="4" y1="6" x2="11" y2="14" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="-4" y1="6" x2="-11" y2="14" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="-7" y1="-2" x2="-16" y2="-4" stroke="#0f172a" strokeWidth="1.5" />
            </g>

            <g transform="translate(180, 142) rotate(45)">
              <circle cx="0" cy="-12" r="14" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="-3" y="2" width="6" height="16" rx="2" fill="#b45309" />
            </g>

            <g transform="translate(112, 172)">
              <path d="M -16 0 C -22 -14 -4 -16 -2 -2 C 0 6 -12 12 -16 0 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <path d="M 16 0 C 22 -14 4 -16 2 -2 C 0 6 12 12 16 0 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            </g>

            <g transform="translate(74, 175)">
              <circle cx="0" cy="0" r="4.5" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
              <polygon points="0,0 -8,15 8,15" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            </g>

            <g transform="translate(120, 108)">
              <circle cx="0" cy="0" r="46" fill="#ffffff" stroke="url(#sportsRibbon)" strokeWidth="4.5" strokeDasharray="8,2" />
              <polygon points="-26,-15 14,-15 8,8 -26,8" fill="#ef4444" />
              <line x1="-26" y1="-18" x2="-26" y2="16" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <text x="-4" y="-3" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">Whistle</text>
              <text x="0" y="5" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">Flag</text>
            </g>

            <text
              x="120"
              y="204"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="16"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Sports Council
            </text>
            <text
              x="120"
              y="222"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="15"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              textDecoration="underline"
            >
              REC Gonda
            </text>
          </svg>
        );

      case 'fine_arts_council':
        return (
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="artBlackBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1c1917" />
                <stop offset="70%" stopColor="#0c0a09" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <linearGradient id="artGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r="115" fill="url(#artBlackBg)" stroke="url(#artGoldGrad)" strokeWidth="4.5" />
            <circle cx="120" cy="120" r="95" fill="none" stroke="url(#artGoldGrad)" strokeWidth="2" />

            <g transform="translate(34, 115) scale(0.7)">
              <path d="M 0 -16 C -8 -6 -5 4 0 12 C 5 4 8 -6 0 -16 Z" fill="url(#artGoldGrad)" />
              <path d="M -12 -6 C -18 2 -10 10 0 12 C -5 5 -7 0 -12 -6 Z" fill="url(#artGoldGrad)" />
              <path d="M 12 -6 C 18 2 10 10 0 12 C 5 5 7 0 12 -6 Z" fill="url(#artGoldGrad)" />
              <rect x="-8" y="8" width="16" height="4" rx="2" fill="url(#artGoldGrad)" />
            </g>
            <g transform="translate(206, 115) scale(0.7)">
              <path d="M 0 -16 C -8 -6 -5 4 0 12 C 5 4 8 -6 0 -16 Z" fill="url(#artGoldGrad)" />
              <path d="M -12 -6 C -18 2 -10 10 0 12 C -5 5 -7 0 -12 -6 Z" fill="url(#artGoldGrad)" />
              <path d="M 12 -6 C 18 2 10 10 0 12 C 5 5 7 0 12 -6 Z" fill="url(#artGoldGrad)" />
              <rect x="-8" y="8" width="16" height="4" rx="2" fill="url(#artGoldGrad)" />
            </g>

            <path id="artTopPath" d="M 40 120 A 80 80 0 0 1 200 120" fill="none" />
            <text fill="url(#artGoldGrad)" fontSize="20" fontWeight="900" letterSpacing="5" fontFamily="'Cinzel', 'Times New Roman', serif">
              <textPath href="#artTopPath" startOffset="50%" textAnchor="middle">
                COUNCIL OF
              </textPath>
            </text>

            <g transform="translate(120, 115)">
              <g transform="translate(-42, -18)">
                <path d="M 0 25 L 2 5 Q 0 -22 12 -42 Q 18 -20 12 5 Z" fill="url(#artGoldGrad)" />
                <line x1="2" y1="28" x2="10" y2="-38" stroke="#78350f" strokeWidth="1.5" />
                <ellipse cx="2" cy="18" rx="5" ry="9" fill="url(#artGoldGrad)" />
                <circle cx="-1" cy="14" r="3" fill="url(#artGoldGrad)" />
              </g>

              <g stroke="url(#artGoldGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M -22 -36 L -18 -20 L -8 -16 L -16 -8 L -12 2 L -18 7 L -10 22 L -2 24" />
                <path d="M -12 -12 Q -8 -14 -6 -12" />
                <path d="M -12 10 Q -6 11 -2 10" />

                <path d="M -22 -36 Q -38 -20 -28 -4 Q -42 12 -22 28" />
                <path d="M -16 -44 Q 8 -50 20 -38 Q 42 -32 35 -4 Q 42 18 24 35" />
                <path d="M -5 -42 Q 15 -35 18 -18 Q 28 -2 20 18" />
                <path d="M 8 -24 Q 28 -12 22 8 Q 28 26 12 38" />

                <path d="M -24 28 Q 0 45 28 28 Q 0 16 -24 28" fill="#292524" />
                <path d="M -18 36 Q 6 52 35 36" />
                <path d="M -10 44 Q 12 58 40 44" />
              </g>
            </g>

            <path id="artBotPath" d="M 204 126 A 84 84 0 0 1 36 126" fill="none" />
            <text fill="url(#artGoldGrad)" fontSize="21" fontWeight="900" letterSpacing="7" fontFamily="'Cinzel', 'Times New Roman', serif">
              <textPath href="#artBotPath" startOffset="50%" textAnchor="middle">
                FINE ARTS
              </textPath>
            </text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-white font-black text-xl">
            {String(councilId).slice(0, 2).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative rounded-full shrink-0 flex items-center justify-center overflow-hidden group/logo ${sizeClasses[size]} ${
        interactive ? 'transition-all duration-300 transform group-hover:scale-105' : ''
      } ${className}`}
    >
      {renderSvgContent()}
      {glow && (
        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 pointer-events-none" />
      )}
      {allowUpload && (
        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 text-white text-[10px] font-bold p-1 text-center">
          <span>Change</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      )}
    </div>
  );
};
