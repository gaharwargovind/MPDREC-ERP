import React from 'react';

interface CollegeLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  showText = false 
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full shrink-0 select-none drop-shadow-sm"
        style={size ? { width: size, height: size } : undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mpdrec-gear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="mpdrec-gold-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          <linearGradient id="mpdrec-shield-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1931" />
            <stop offset="50%" stopColor="#0d254c" />
            <stop offset="100%" stopColor="#071224" />
          </linearGradient>

          {/* Arched text paths */}
          <path
            id="text-path-top"
            d="M 68 250 A 182 182 0 1 1 432 250"
            fill="none"
          />
          <path
            id="text-path-bottom"
            d="M 95 250 A 155 155 0 0 0 405 250"
            fill="none"
          />
        </defs>

        {/* 1. 24-Tooth Outer Gear / Cogwheel */}
        <g stroke="#f59e0b" strokeWidth="6" strokeLinejoin="round" fill="#ffffff">
          <path d="
            M 235,12 L 265,12 L 273,38 L 305,48 L 327,30 L 350,48 L 345,76 L 372,93 L 398,82 L 415,105 L 401,130 L 422,152 L 449,148 L 460,174 L 439,197 L 452,223 L 478,227 L 481,255 L 454,269 L 458,297 L 481,310 L 474,337 L 447,341 L 441,368 L 460,391 L 443,415 L 417,409 L 402,431 L 413,456 L 389,473 L 368,454 L 344,468 L 344,495 L 316,502 L 302,477 L 274,482 L 263,507 L 235,507 L 224,482 L 196,477 L 182,502 L 154,495 L 154,468 L 130,454 L 109,473 L 85,456 L 96,431 L 81,409 L 55,415 L 38,391 L 57,368 L 51,341 L 24,337 L 17,310 L 40,297 L 44,269 L 17,255 L 20,227 L 46,223 L 59,197 L 38,174 L 49,148 L 76,152 L 97,130 L 83,105 L 100,82 L 126,93 L 153,76 L 148,48 L 171,30 L 193,48 L 225,38 Z
          " />
        </g>

        {/* 2. Inner White Disc */}
        <circle cx="250" cy="250" r="206" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
        
        {/* Subtle Inner Concentric Circle for Lettering Boundary */}
        <circle cx="250" cy="250" r="162" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />

        {/* 3. Official Hindi Lettering Arched */}
        {/* Top Text: माँ पाटेश्वरी देवी, राजकीय इंजीनियरिंग कॉलेज, गोण्डा, उ०प्र० */}
        <text fill="#7f1d1d" fontWeight="900" fontSize="18.5" fontFamily="'Noto Sans Devanagari', 'Mangal', sans-serif" letterSpacing="0.8">
          <textPath href="#text-path-top" startOffset="50%" textAnchor="middle">
            माँ पाटेश्वरी देवी, राजकीय इंजीनियरिंग कॉलेज, गोण्डा, उ०प्र०
          </textPath>
        </text>

        {/* Side Blue Stars */}
        <g fill="#0f2b5c">
          {/* Left Star */}
          <polygon points="82,275 86,287 99,287 89,295 93,307 82,300 71,307 75,295 65,287 78,287" />
          {/* Right Star */}
          <polygon points="418,275 422,287 435,287 425,295 429,307 418,300 407,307 411,295 401,287 414,287" />
        </g>

        {/* Bottom Text: ।। सर्वे ज्ञानमयाः भवन्तु ।। */}
        <text fill="#7f1d1d" fontWeight="900" fontSize="21" fontFamily="'Noto Sans Devanagari', 'Mangal', sans-serif" letterSpacing="1.2">
          <textPath href="#text-path-bottom" startOffset="50%" textAnchor="middle">
            ।। सर्वे ज्ञानमयाः भवन्तु ।।
          </textPath>
        </text>

        {/* 4. Golden Laurel / Wheat Branches surrounding Shield */}
        <g fill="#eab308" stroke="#ca8a04" strokeWidth="0.75" opacity="0.95">
          {/* Left Laurel Leaves */}
          <path d="M 118,220 C 114,260 130,320 180,360 C 160,345 135,310 132,260 Z" />
          <ellipse cx="118" cy="205" rx="7" ry="16" transform="rotate(-30 118 205)" />
          <ellipse cx="112" cy="235" rx="7" ry="16" transform="rotate(-20 112 235)" />
          <ellipse cx="114" cy="265" rx="7" ry="16" transform="rotate(-10 114 265)" />
          <ellipse cx="122" cy="295" rx="7" ry="16" transform="rotate(5 122 295)" />
          <ellipse cx="138" cy="325" rx="7" ry="16" transform="rotate(25 138 325)" />
          <ellipse cx="160" cy="350" rx="7" ry="16" transform="rotate(45 160 350)" />
          <ellipse cx="190" cy="368" rx="7" ry="16" transform="rotate(65 190 368)" />
          <ellipse cx="220" cy="376" rx="7" ry="14" transform="rotate(80 220 376)" />

          {/* Right Laurel Leaves */}
          <path d="M 382,220 C 386,260 370,320 320,360 C 340,345 365,310 368,260 Z" />
          <ellipse cx="382" cy="205" rx="7" ry="16" transform="rotate(30 382 205)" />
          <ellipse cx="388" cy="235" rx="7" ry="16" transform="rotate(20 388 235)" />
          <ellipse cx="386" cy="265" rx="7" ry="16" transform="rotate(10 386 265)" />
          <ellipse cx="378" cy="295" rx="7" ry="16" transform="rotate(-5 378 295)" />
          <ellipse cx="362" cy="325" rx="7" ry="16" transform="rotate(-25 362 325)" />
          <ellipse cx="340" cy="350" rx="7" ry="16" transform="rotate(-45 340 350)" />
          <ellipse cx="310" cy="368" rx="7" ry="16" transform="rotate(-65 310 368)" />
          <ellipse cx="280" cy="376" rx="7" ry="14" transform="rotate(-80 280 376)" />
        </g>

        {/* 5. Central Royal Shield */}
        <g filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.25))">
          {/* Shield Outer Gold Rim */}
          <path
            d="
              M 250,140
              L 355,185
              L 355,275
              C 355,335 250,380 250,380
              C 250,380 145,335 145,275
              L 145,185
              Z
            "
            fill="url(#mpdrec-gold-border)"
            stroke="#92400e"
            strokeWidth="2"
          />

          {/* Shield Inner Dark Blue Field */}
          <path
            d="
              M 250,148
              L 347,190
              L 347,272
              C 347,326 250,368 250,368
              C 250,368 153,326 153,272
              L 153,190
              Z
            "
            fill="url(#mpdrec-shield-grad)"
          />
        </g>

        {/* 6. Open Book (Knowledge Symbol) */}
        <g transform="translate(176, 178) scale(0.98)">
          {/* Book Pages White Base */}
          <path
            d="M 75,42 C 45,35 15,40 2,45 L 2,100 C 15,95 45,90 75,98 C 105,90 135,95 148,100 L 148,45 C 135,40 105,35 75,42 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Book Spine Center Divider */}
          <line x1="75" y1="42" x2="75" y2="98" stroke="#cbd5e1" strokeWidth="2.5" />

          {/* Page Lines Left */}
          <line x1="12" y1="52" x2="68" y2="47" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="60" x2="68" y2="55" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="68" x2="68" y2="63" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="76" x2="68" y2="71" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="84" x2="68" y2="79" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="18" y1="92" x2="65" y2="87" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Page Lines Right */}
          <line x1="82" y1="47" x2="138" y2="52" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="55" x2="138" y2="60" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="63" x2="138" y2="68" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="71" x2="138" y2="76" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="79" x2="138" y2="84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="85" y1="87" x2="132" y2="92" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 7. Blazing Torch / Mashaal (Flame of Wisdom) */}
        <g transform="translate(250, 312)">
          {/* Flame of the Torch */}
          <path
            d="
              M 0,-48
              C 12,-38 18,-24 12,-12
              C 16,-18 20,-16 20,-8
              C 20,4 8,10 0,10
              C -8,10 -20,4 -20,-8
              C -20,-16 -16,-18 -12,-12
              C -18,-24 -12,-38 0,-48
              Z
            "
            fill="#ffffff"
            stroke="#f8fafc"
            strokeWidth="1"
          />
          {/* Inner Flame Blue Core */}
          <path
            d="
              M 0,-34
              C 6,-26 8,-16 6,-8
              C 6,0 3,4 0,4
              C -3,4 -6,0 -6,-8
              C -8,-16 -6,-26 0,-34
              Z
            "
            fill="#0f2b5c"
          />

          {/* Torch Top Bowl / Cup */}
          <path
            d="M -26,10 L 26,10 L 22,22 L -22,22 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <line x1="-24" y1="16" x2="24" y2="16" stroke="#0f2b5c" strokeWidth="2" />

          {/* Torch Stem */}
          <rect x="-10" y="22" width="20" height="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="0" y1="22" x2="0" y2="42" stroke="#0f2b5c" strokeWidth="2" />

          {/* Torch Base Pedestal */}
          <path
            d="M -18,42 L 18,42 L 14,48 L -14,48 Z"
            fill="#ffffff"
          />
        </g>
      </svg>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 dark:from-blue-400 dark:via-indigo-300 dark:to-amber-400 bg-clip-text text-transparent">
              MPDREC
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              AKTU 1214
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            माँ पाटेश्वरी देवी राजकीय इंजीनियरिंग कॉलेज, गोण्डा
          </p>
        </div>
      )}
    </div>
  );
};
