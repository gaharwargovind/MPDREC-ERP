import fs from 'fs';
import path from 'path';

const logosDir = path.resolve('public/logos');
const publicDir = path.resolve('public');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}


const technicalSvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="tcBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="25%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#d946ef" />
      <stop offset="70%" stop-color="#f97316" />
      <stop offset="95%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
    <linearGradient id="tcStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="30%" stop-color="#3b82f6" />
      <stop offset="60%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
    <linearGradient id="tcCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="35%" stop-color="#e11d48" />
      <stop offset="65%" stop-color="#a855f7" />
      <stop offset="90%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#d946ef" />
    </linearGradient>
    <filter id="tcGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <circle cx="120" cy="120" r="115" fill="#1b2a47" />
  <circle cx="120" cy="120" r="115" fill="none" stroke="#2a3f66" stroke-width="1.5" />
  <g stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M 58 75 L 35 75" />
    <circle cx="30" cy="75" r="4.5" fill="none" stroke="#38bdf8" stroke-width="3" />
    <path d="M 68 88 L 45 88 L 38 96 L 22 96" />
    <circle cx="18" cy="96" r="4.5" fill="none" stroke="#38bdf8" stroke-width="3" />
    <path d="M 62 108 L 32 108" />
    <circle cx="28" cy="108" r="4.5" fill="none" stroke="#38bdf8" stroke-width="3" />
  </g>
  <g stroke="#facc15" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M 182 75 L 205 75 L 212 85 L 220 85" />
    <circle cx="224" cy="85" r="4.5" fill="none" stroke="#facc15" stroke-width="3" />
    <path d="M 165 90 L 195 90 L 202 96 L 222 96" />
    <circle cx="226" cy="96" r="4.5" fill="none" stroke="#facc15" stroke-width="3" />
    <path d="M 162 104 L 188 104" />
    <circle cx="192" cy="104" r="4.5" fill="none" stroke="#facc15" stroke-width="3" />
  </g>
  <g stroke="#d946ef" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M 172 172 L 200 172" />
    <circle cx="204" cy="172" r="4.5" fill="none" stroke="#d946ef" stroke-width="3" />
    <path d="M 158 184 L 180 184 L 186 190 L 210 190" />
    <circle cx="214" cy="190" r="4.5" fill="none" stroke="#d946ef" stroke-width="3" />
  </g>
  <path d="M 50 70 L 192 70 L 175 88 L 132 88 L 132 102 L 95 102 L 95 88 L 50 88 Z" fill="url(#tcBarGrad)" filter="url(#tcGlow)" />
  <polygon points="192,70 198,72 205,70 199,76 202,83 194,78 188,81 190,74" fill="#ffffff" />
  <path d="M 95 102 L 128 102 L 118 198 L 95 198 L 95 155 L 75 135 L 95 115 Z" fill="url(#tcStemGrad)" />
  <path d="M 132 88 C 176 96 192 128 178 168 C 165 190 138 198 116 196 C 135 180 148 162 142 135 C 138 118 126 102 116 95 Z" fill="url(#tcCurveGrad)" />

  <g stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M 106 110 L 106 148" />
    <circle cx="106" cy="148" r="3.5" fill="#ffffff" stroke="none" />
    <path d="M 116 155 L 116 182" />
    <circle cx="116" cy="182" r="3" fill="#facc15" stroke="none" />
  </g>

  <g transform="translate(136, 160)">
    <circle cx="0" cy="0" r="7" fill="#1b2a47" />
    <polygon points="-4.5,4 4.5,4 6,14 -6,14" fill="#1b2a47" />
  </g>
  <circle cx="132" cy="132" r="4" fill="none" stroke="#fde047" stroke-width="2.5" />
  <circle cx="120" cy="188" r="3" fill="#38bdf8" />
</svg>`;


const mediaSvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="mediaBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#141a29" />
      <stop offset="65%" stop-color="#0a0e17" />
      <stop offset="100%" stop-color="#020408" />
    </radialGradient>
    <linearGradient id="mediaNeonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="mediaChrome" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#94a3b8" />
      <stop offset="55%" stop-color="#475569" />
      <stop offset="70%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="brushFill" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0e7ff" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="70%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="url(#mediaBgGrad)" />
  <circle cx="120" cy="120" r="106" fill="none" stroke="url(#mediaNeonCyan)" stroke-width="4" />
  <circle cx="120" cy="120" r="102" fill="none" stroke="#083344" stroke-width="1" />
  <g transform="translate(24, 75) rotate(-18)">
    <path d="M 0 0 C 15 -12 35 -5 42 15 C 48 35 32 60 12 55 C -2 50 -8 20 0 0 Z" fill="#334155" stroke="#94a3b8" stroke-width="2" />
    <rect x="6" y="6" width="6" height="5" rx="1" fill="#f8fafc" />
    <rect x="7" y="16" width="6" height="5" rx="1" fill="#f8fafc" />
    <rect x="10" y="26" width="6" height="5" rx="1" fill="#f8fafc" />
    <rect x="15" y="36" width="6" height="5" rx="1" fill="#f8fafc" />
  </g>
  <g transform="translate(160, 90)">
    <rect x="0" y="6" width="48" height="34" rx="5" fill="#1e293b" stroke="#475569" stroke-width="2" />
    <rect x="12" y="0" width="16" height="7" rx="2" fill="#334155" />
    <circle cx="38" cy="12" r="3" fill="#ef4444" />
    <circle cx="24" cy="23" r="14" fill="#0f172a" stroke="#64748b" stroke-width="2" />
    <circle cx="24" cy="23" r="10" fill="#0284c7" stroke="#22d3ee" stroke-width="2" />
    <polygon points="21,17 31,23 21,29" fill="#ffffff" />
  </g>

  <text x="120" y="94" text-anchor="middle" fill="url(#brushFill)" font-size="34" font-weight="900" font-family="sans-serif" letter-spacing="2">MEDIA</text>
  <text x="120" y="126" text-anchor="middle" fill="url(#mediaChrome)" font-size="20" font-weight="900" font-family="sans-serif" letter-spacing="4">COUNCIL</text>
  <text x="120" y="146" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="800" letter-spacing="2">MPDREC GONDA</text>
  <text x="120" y="166" text-anchor="middle" fill="#f8fafc" font-size="12" font-style="italic" font-family="Georgia, serif">Your Story Begins Here.</text>
  <g transform="translate(120, 192)">
    <rect x="-6" y="-14" width="12" height="18" rx="6" fill="#0f172a" stroke="#22d3ee" stroke-width="2" />
    <line x1="-4" y1="-8" x2="4" y2="-8" stroke="#22d3ee" stroke-width="1.5" />
    <line x1="-4" y1="-3" x2="4" y2="-3" stroke="#22d3ee" stroke-width="1.5" />
    <path d="M -10 -4 A 10 10 0 0 0 10 -4" fill="none" stroke="#22d3ee" stroke-width="2" />
    <line x1="0" y1="6" x2="0" y2="12" stroke="#22d3ee" stroke-width="2" />
    <line x1="-6" y1="12" x2="6" y2="12" stroke="#22d3ee" stroke-width="2" />
    <path d="M -18 -8 L -18 0 M -24 -14 L -24 6 M -30 -6 L -30 -2" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" />
    <path d="M 18 -8 L 18 0 M 24 -14 L 24 6 M 30 -6 L 30 -2" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
  </g>
</svg>`;


const culturalSvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="cultNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="50%" stop-color="#172554" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="cultGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#facc15" />
      <stop offset="80%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="url(#cultNavyGrad)" stroke="url(#cultGoldGrad)" stroke-width="4" />
  <circle cx="120" cy="120" r="92" fill="none" stroke="url(#cultGoldGrad)" stroke-width="2.5" />

  <g transform="translate(32, 85) scale(0.65)">
    <polygon points="0,-12 4,-4 12,-4 6,2 8,11 0,6 -8,11 -6,2 -12,-4 -4,-4" fill="url(#cultGoldGrad)" />
  </g>
  <g transform="translate(208, 85) scale(0.65)">
    <polygon points="0,-12 4,-4 12,-4 6,2 8,11 0,6 -8,11 -6,2 -12,-4 -4,-4" fill="url(#cultGoldGrad)" />
  </g>

  <path id="cTopP" d="M 40 120 A 80 80 0 0 1 200 120" fill="none" />
  <text fill="#ffffff" font-size="15" font-weight="900" letter-spacing="3.5" font-family="sans-serif">
    <textPath href="#cTopP" startOffset="50%" text-anchor="middle">CULTURAL COUNCIL</textPath>
  </text>

  <path id="cBotP" d="M 210 124 A 90 90 0 0 1 30 124" fill="none" />
  <text fill="#fef08a" font-size="7.2" font-weight="800" letter-spacing="1" font-family="sans-serif">
    <textPath href="#cBotP" startOffset="50%" text-anchor="middle">MAA PATESHWARI DEVI RAJKIYA ENGINEERING COLLEGE GONDA</textPath>
  </text>
  <path d="M 120 120 L 82 52 A 74 74 0 0 1 158 52 Z" fill="#9d174d" />
  <path d="M 120 120 L 158 52 A 74 74 0 0 1 192 125 Z" fill="#0d9488" />
  <path d="M 120 120 L 192 125 A 74 74 0 0 1 140 190 Z" fill="#ea580c" />
  <path d="M 120 120 L 140 190 A 74 74 0 0 1 100 190 Z" fill="#b91c1c" />
  <path d="M 120 120 L 100 190 A 74 74 0 0 1 48 125 Z" fill="#4338ca" />
  <path d="M 120 120 L 48 125 A 74 74 0 0 1 82 52 Z" fill="#6b21a8" />
  <g transform="translate(120, 72) scale(0.65)">
    <circle cx="0" cy="-14" r="3.5" fill="#fef08a" />
    <path d="M 0 -10 L 0 5 L -8 18 M 0 5 L 8 16 M -12 -2 L 0 -6 L 12 -12" stroke="#fef08a" stroke-width="2.5" fill="none" stroke-linecap="round" />
  </g>
  <g transform="translate(156, 86) scale(0.6)">
    <path d="M -8 -8 Q 0 -12 8 -4 Q 12 6 4 12" stroke="#f8fafc" stroke-width="2" fill="none" />
    <ellipse cx="14" cy="-10" rx="3" ry="2" fill="#f8fafc" />
    <line x1="17" y1="-10" x2="17" y2="-20" stroke="#f8fafc" stroke-width="1.5" />
  </g>
  <g transform="translate(76, 140) scale(0.55)">
    <ellipse cx="0" cy="0" rx="14" ry="18" fill="#fef08a" stroke="#d97706" stroke-width="2" />
    <ellipse cx="-5" cy="-4" rx="3" ry="2" fill="#1e1b4b" />
    <ellipse cx="5" cy="-4" rx="3" ry="2" fill="#1e1b4b" />
    <path d="M -6 6 Q 0 12 6 6" stroke="#1e1b4b" stroke-width="2" fill="none" />
  </g>
  <g transform="translate(120, 168)">
    <ellipse cx="0" cy="6" rx="14" ry="5" fill="#f59e0b" />
    <path d="M 0 -8 Q 5 0 0 6 Q -5 0 0 -8 Z" fill="#fef08a" />
  </g>
  <g transform="translate(120, 120)">
    <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="url(#cultGoldGrad)" stroke-width="2.5" />
    <path d="M 0 -14 C -6 -7 -6 4 0 10 C 6 4 6 -7 0 -14 Z" fill="#f59e0b" />
    <path d="M -10 -9 C -12 -2 -8 5 0 10 C -4 3 -6 -4 -10 -9 Z" fill="#fbbf24" />
    <path d="M 10 -9 C 12 -2 8 5 0 10 C 4 3 6 -4 10 -9 Z" fill="#fbbf24" />
    <circle cx="0" cy="11" r="2.5" fill="#d97706" />
  </g>
</svg>`;


const literarySvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="litBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e3a5f" />
      <stop offset="60%" stop-color="#10253d" />
      <stop offset="100%" stop-color="#081422" />
    </radialGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="url(#litBgGrad)" stroke="#38bdf8" stroke-width="3" />
  <path d="M 38 120 A 82 82 0 0 1 202 120" fill="none" stroke="#f8fafc" stroke-width="2.5" />

  <path id="lTopP" d="M 36 120 A 84 84 0 0 1 204 120" fill="none" />
  <text fill="#ffffff" font-size="16" font-weight="900" letter-spacing="4.5" font-family="'Cinzel', serif">
    <textPath href="#lTopP" startOffset="50%" text-anchor="middle">LITERARY COUNCIL</textPath>
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

    <path d="M 0 20 Q -40 -5 -78 8 Q -78 -24 -40 -30 Q 0 -10 0 20 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <path d="M 0 20 Q 40 -5 78 8 Q 78 -24 40 -30 Q 0 -10 0 20 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="-65" y1="-8" x2="-15" y2="-18" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="-65" y1="-2" x2="-15" y2="-12" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="15" y1="-18" x2="65" y2="-8" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="15" y1="-12" x2="65" y2="-2" stroke="#cbd5e1" stroke-width="1.5" />
    <ellipse cx="0" cy="20" rx="8" ry="5" fill="#dc2626" />
    <line x1="0" y1="20" x2="0" y2="-30" stroke="#b91c1c" stroke-width="2.5" />
  </g>
  <g transform="translate(120, 192)">
    <rect x="-70" y="-14" width="140" height="28" rx="4" fill="#0f172a" stroke="#f97316" stroke-width="2" />
    <polygon points="-70,-14 -62,-14 -70,-6" fill="#f97316" />
    <polygon points="70,-14 62,-14 70,-6" fill="#f97316" />
    <text x="0" y="6" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="900" font-family="'Cinzel', serif" letter-spacing="3">REC GONDA</text>
  </g>
</svg>`;


const hobbySvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="hobbyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="45%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="#0f172a" stroke="url(#hobbyGoldGrad)" stroke-width="4" />
  <circle cx="120" cy="120" r="92" fill="#ffffff" stroke="url(#hobbyGoldGrad)" stroke-width="2.5" />

  <path id="hTopP" d="M 32 120 A 88 88 0 0 1 208 120" fill="none" />
  <text fill="#ffffff" font-size="9.5" font-weight="900" letter-spacing="1.5" font-family="sans-serif">
    <textPath href="#hTopP" startOffset="50%" text-anchor="middle">RAJKIYA ENGINEERING COLLEGE GONDA</textPath>
  </text>

  <path id="hBotP" d="M 208 120 A 88 88 0 0 1 32 120" fill="none" />
  <text fill="#ffffff" font-size="11" font-weight="900" letter-spacing="2.5" font-family="sans-serif">
    <textPath href="#hBotP" startOffset="50%" text-anchor="middle">★ UNLEASH YOUR PASSION ★</textPath>
  </text>

  <g transform="translate(120, 68)">
    <polygon points="0,-8 2.5,-2.5 8,-2.5 3.8,1 5.5,7 0,3.5 -5.5,7 -3.8,1 -8,-2.5 -2.5,-2.5" fill="url(#hobbyGoldGrad)" />
    <polygon points="-18,-4 -16,0 -12,0 -15,3 -14,7 -18,4.5 -22,7 -21,3 -24,0 -20,0" fill="url(#hobbyGoldGrad)" />
    <polygon points="18,-4 20,0 24,0 21,3 22,7 18,4.5 14,7 15,3 12,0 16,0" fill="url(#hobbyGoldGrad)" />
  </g>

  <text x="120" y="96" text-anchor="middle" fill="#0f172a" font-size="22" font-weight="900" font-family="sans-serif" letter-spacing="2">HOBBY</text>
  <text x="120" y="116" text-anchor="middle" fill="#0f172a" font-size="14" font-weight="900" font-family="sans-serif" letter-spacing="3">COUNCIL</text>
  <g transform="translate(68, 142) scale(0.65)" fill="#0f172a">
    <circle cx="0" cy="-14" r="3.5" />
    <path d="M -4 -8 L 4 -8 L 2 6 L -3 16" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <path d="M -6 -4 L 8 4 L 14 -10" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <rect x="13" y="-18" width="3.5" height="14" transform="rotate(25 13 -18)" rx="1" />
  </g>
  <g transform="translate(102, 142) scale(0.65)" fill="#0f172a">
    <rect x="-4" y="-12" width="8" height="14" rx="4" fill="#0f172a" />
    <path d="M -7 -4 A 7 7 0 0 0 7 -4" fill="none" stroke="#0f172a" stroke-width="2" />
    <line x1="0" y1="3" x2="0" y2="10" stroke="#0f172a" stroke-width="2" />
    <line x1="-5" y1="10" x2="5" y2="10" stroke="#0f172a" stroke-width="2" />
  </g>
  <g transform="translate(138, 142) scale(0.65)">
    <path d="M -12 -8 C -4 -16 12 -14 14 0 C 16 12 4 14 -4 12 C -8 11 -14 6 -14 -4 Z" fill="#0f172a" />
    <circle cx="6" cy="2" r="2" fill="#ffffff" />
    <line x1="-12" y1="12" x2="16" y2="-12" stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round" />
  </g>
  <g transform="translate(172, 142) scale(0.65)" fill="#0f172a">
    <circle cx="0" cy="-14" r="3.5" />
    <path d="M 0 -9 L 2 4 L -4 16 M 2 4 L 8 15 M 0 -5 L -8 -1 L -12 -6" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none" />
  </g>
</svg>`;


const sportsSvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <linearGradient id="sportsRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <circle cx="120" cy="98" r="48" fill="none" stroke="#e2e8f0" stroke-width="14" />
  <circle cx="120" cy="98" r="48" fill="none" stroke="#22c55e" stroke-width="3.5" stroke-dasharray="75 225" stroke-dashoffset="0" />
  <circle cx="120" cy="98" r="48" fill="none" stroke="#3b82f6" stroke-width="3.5" stroke-dasharray="75 225" stroke-dashoffset="-75" />
  <circle cx="120" cy="98" r="48" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-dasharray="75 225" stroke-dashoffset="-150" />
  <circle cx="120" cy="98" r="48" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-dasharray="75 225" stroke-dashoffset="-225" />
  <g transform="translate(120, 94)">
    <line x1="-14" y1="-18" x2="-14" y2="18" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
    <path d="M -14 -18 Q 0 -22 14 -16 Q 0 -10 -14 -12 Z" fill="#dc2626" />
    <ellipse cx="0" cy="6" rx="7" ry="4.5" fill="#475569" />
    <rect x="-6" y="3" width="5" height="3" fill="#64748b" />
    <text x="0" y="16" text-anchor="middle" fill="#0f172a" font-size="6.5" font-weight="900" font-family="sans-serif">WHISTLE FLAG</text>
  </g>
  <g transform="translate(120, 36)">
    <circle cx="0" cy="0" r="11" fill="#ea580c" stroke="#9a3412" stroke-width="1.5" />
    <path d="M -11 0 L 11 0 M 0 -11 L 0 11 M -7 -8 C 0 -4 0 4 -7 8 M 7 -8 C 0 -4 0 4 7 8" fill="none" stroke="#431407" stroke-width="1" />
  </g>
  <g transform="translate(162, 48) rotate(35)">
    <rect x="-12" y="-2" width="24" height="4" rx="1" fill="#64748b" />
    <rect x="-14" y="-7" width="4" height="14" rx="1.5" fill="#dc2626" />
    <rect x="10" y="-7" width="4" height="14" rx="1.5" fill="#dc2626" />
  </g>
  <g transform="translate(186, 86)">
    <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#334155" stroke-width="1.5" />
    <polygon points="0,-4 4,-1 2,4 -2,4 -4,-1" fill="#0f172a" />
    <line x1="0" y1="-4" x2="0" y2="-10" stroke="#334155" stroke-width="1" />
    <line x1="4" y1="-1" x2="10" y2="-2" stroke="#334155" stroke-width="1" />
    <line x1="2" y1="4" x2="7" y2="9" stroke="#334155" stroke-width="1" />
    <line x1="-2" y1="4" x2="-7" y2="9" stroke="#334155" stroke-width="1" />
    <line x1="-4" y1="-1" x2="-10" y2="-2" stroke="#334155" stroke-width="1" />
  </g>
  <g transform="translate(178, 128) rotate(-25)">
    <circle cx="0" cy="-6" r="9" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
    <rect x="-2" y="3" width="4" height="9" rx="1" fill="#b45309" />
    <circle cx="7" cy="-2" r="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
  </g>
  <g transform="translate(148, 154)">
    <ellipse cx="-4" cy="0" rx="6" ry="8" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
    <ellipse cx="4" cy="0" rx="6" ry="8" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
  </g>
  <g transform="translate(92, 154)">
    <path d="M -4 4 L -9 -6 L 1 -6 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
    <circle cx="-4" cy="4" r="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
    <circle cx="6" cy="2" r="5" fill="#a3e635" stroke="#4d7c0f" stroke-width="1" />
  </g>
  <g transform="translate(56, 126) rotate(35)">
    <rect x="-3" y="-12" width="6" height="18" rx="1.5" fill="#d97706" />
    <rect x="-1.5" y="6" width="3" height="8" rx="1" fill="#78350f" />
    <circle cx="6" cy="-2" r="3.5" fill="#dc2626" />
  </g>
  <g transform="translate(52, 86) rotate(-35)">
    <ellipse cx="0" cy="0" rx="11" ry="6.5" fill="#92400e" stroke="#451a03" stroke-width="1" />
    <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffffff" stroke-width="1.2" />
    <line x1="-3" y1="-2.5" x2="-3" y2="2.5" stroke="#ffffff" stroke-width="1" />
    <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#ffffff" stroke-width="1" />
    <line x1="3" y1="-2.5" x2="3" y2="2.5" stroke="#ffffff" stroke-width="1" />
  </g>
  <g transform="translate(76, 48) rotate(-40)">
    <ellipse cx="0" cy="-6" rx="8" ry="10" fill="none" stroke="#2563eb" stroke-width="2" />
    <line x1="0" y1="4" x2="0" y2="16" stroke="#475569" stroke-width="2.5" />
  </g>
  <text x="120" y="196" text-anchor="middle" fill="#0f172a" font-size="16" font-weight="900" font-family="'Times New Roman', serif" letter-spacing="1">Sports Council</text>
  <line x1="60" y1="202" x2="180" y2="202" stroke="#dc2626" stroke-width="2" />
  <text x="120" y="218" text-anchor="middle" fill="#64748b" font-size="12" font-weight="800" font-family="sans-serif" letter-spacing="1.5">REC Gonda</text>
</svg>`;


const fineArtsSvg = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <radialGradient id="faBgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b18" />
      <stop offset="70%" stop-color="#12100e" />
      <stop offset="100%" stop-color="#050404" />
    </radialGradient>
    <linearGradient id="faGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#eab308" />
      <stop offset="70%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="115" fill="url(#faBgGrad)" stroke="url(#faGoldGrad)" stroke-width="4" />
  <circle cx="120" cy="120" r="92" fill="none" stroke="url(#faGoldGrad)" stroke-width="2" />
  <g transform="translate(34, 120) scale(0.45)" fill="url(#faGoldGrad)">
    <path d="M 0 -18 C 3 -10 6 0 0 12 C -6 0 -3 -10 0 -18 Z" />
    <path d="M -4 -8 C -12 -12 -16 0 -6 6 C -2 8 0 12 0 12 C 0 12 -4 4 -4 -8 Z" />
    <path d="M 4 -8 C 12 -12 16 0 6 6 C 2 8 0 12 0 12 C 0 12 4 4 4 -8 Z" />
    <rect x="-8" y="10" width="16" height="3" rx="1.5" />
  </g>
  <g transform="translate(206, 120) scale(0.45)" fill="url(#faGoldGrad)">
    <path d="M 0 -18 C 3 -10 6 0 0 12 C -6 0 -3 -10 0 -18 Z" />
    <path d="M -4 -8 C -12 -12 -16 0 -6 6 C -2 8 0 12 0 12 C 0 12 -4 4 -4 -8 Z" />
    <path d="M 4 -8 C 12 -12 16 0 6 6 C 2 8 0 12 0 12 C 0 12 4 4 4 -8 Z" />
    <rect x="-8" y="10" width="16" height="3" rx="1.5" />
  </g>
  <path id="faTopP" d="M 36 120 A 84 84 0 0 1 204 120" fill="none" />
  <text fill="url(#faGoldGrad)" font-size="13" font-weight="900" letter-spacing="3" font-family="'Cinzel', 'Times New Roman', serif">
    <textPath href="#faTopP" startOffset="50%" text-anchor="middle">COUNCIL OF FINE ARTS</textPath>
  </text>
  <g transform="translate(120, 134)" fill="url(#faGoldGrad)" stroke="url(#faGoldGrad)">
    <path d="M -6 -42 C 2 -40 10 -34 10 -24 C 10 -16 4 -12 6 -4 C 8 2 16 6 12 14 C 8 22 2 30 -6 34 C -16 34 -24 24 -24 10 C -24 -12 -14 -40 -6 -42 Z" stroke-width="1" />
    <path d="M -18 -38 C -26 -30 -28 -14 -22 -2 C -18 6 -16 18 -22 24" fill="none" stroke-width="2.5" stroke-linecap="round" />
    <path d="M -12 -42 C -20 -36 -22 -20 -16 -8 C -12 2 -10 14 -16 20" fill="none" stroke-width="2" stroke-linecap="round" />
    <path d="M -8 -34 Q 0 -38 8 -30" fill="none" stroke-width="2" />
    <polygon points="-6,-36 -4,-33 -8,-32" />
    <polygon points="0,-36 2,-33 -2,-32" />
    <polygon points="6,-33 8,-30 4,-29" />
    <path d="M 18 -38 C 24 -20 22 10 14 36" fill="none" stroke-width="2.5" stroke-linecap="round" />
    <path d="M 18 -38 C 14 -28 10 -16 16 -4" fill="none" stroke-width="1.5" />
    <path d="M 18 -38 C 22 -28 26 -16 18 -4" fill="none" stroke-width="1.5" />
    <path d="M -30 36 Q 0 46 30 36 Q 15 48 -30 46 Z" />
  </g>
</svg>`;


const councilMap = [
  { id: 'technical_council', svg: technicalSvg, filename: 'technical council.png', svgName: 'technical_council.svg' },
  { id: 'media_council', svg: mediaSvg, filename: 'media council.jpg', svgName: 'media_council.svg' },
  { id: 'cultural_council', svg: culturalSvg, filename: 'cultural council.jpg', svgName: 'cultural_council.svg' },
  { id: 'literary_council', svg: literarySvg, filename: 'literary council.jpg', svgName: 'literary_council.svg' },
  { id: 'hobby_council', svg: hobbySvg, filename: 'hobby council.jpg', svgName: 'hobby_council.svg' },
  { id: 'sports_council', svg: sportsSvg, filename: 'sports council.jpg', svgName: 'sports_council.svg' },
  { id: 'fine_arts_council', svg: fineArtsSvg, filename: 'council of fine arts.jpg', svgName: 'council_of_fine_arts.svg' },
];

for (const c of councilMap) {

  fs.writeFileSync(path.join(logosDir, c.svgName), c.svg, 'utf8');

  fs.writeFileSync(path.join(publicDir, c.filename), c.svg, 'utf8');

  fs.writeFileSync(path.join(publicDir, c.svgName), c.svg, 'utf8');
  console.log(`Generated ${c.filename} and ${c.svgName}`);
}

console.log('All council logos generated successfully in public/ and public/logos/!');
