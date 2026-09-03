import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Command, 
  X, 
  CornerDownLeft,
  FileCode,
  GraduationCap,
  Building2,
  Calendar
} from 'lucide-react';
import { OmnibarResult } from './types';

interface OmnibarHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const OmnibarHUD: React.FC<OmnibarHUDProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-compiled comprehensive instant search index
  const instantItems: OmnibarResult[] = [
    // Academics & SGPA
    {
      id: 'item-dsa',
      title: 'KCS-401 Data Structures & Algorithms Syllabus',
      category: 'academics',
      description: 'Trees, Graphs, AVL rotations, DP and sorting notes',
      iconName: 'BookOpen',
      badge: 'B.Tech Core',
      action: () => onSelectPrompt('Provide a deep syllabus breakdown and high-yield topics for KCS-401 Data Structures.')
    },
    {
      id: 'item-os',
      title: 'KCS-402 Operating Systems & Deadlock Notes',
      category: 'academics',
      description: 'CPU scheduling, Banker algorithm formula, Paging',
      iconName: 'FileCode',
      badge: 'Exam Key',
      action: () => onSelectPrompt('Explain CPU Scheduling algorithms and Banker algorithm deadlock formulas.')
    },
    {
      id: 'item-sgpa',
      title: 'SGPA & CGPA Simulator Tool',
      category: 'academics',
      description: 'AKTU 10-point credit evaluation with Class Test inputs',
      iconName: 'GraduationCap',
      badge: 'Interactive',
      action: () => onSelectPrompt('Open the SGPA and target grade projection simulator.')
    },
    {
      id: 'item-att',
      title: 'AKTU Ordinance §3.2 Attendance Rule (75%)',
      category: 'academics',
      description: 'Mandatory eligibility criteria & 15% medical condonation',
      iconName: 'Clock',
      badge: 'Gazette',
      action: () => onSelectPrompt('Explain AKTU Ordinance §3.2 attendance rules and medical relaxation procedure.')
    },

    // Councils
    {
      id: 'item-tech-council',
      title: 'Technical Council Leadership & Hackathons',
      category: 'councils',
      description: 'Heads: Anurag Yadav, Vaishnavi Pandey • Convener: Dr. Rohit Tripathi',
      iconName: 'Trophy',
      badge: 'Council',
      action: () => onSelectPrompt('Who are the 4th year leaders of Technical Council and what events are coming up?')
    },
    {
      id: 'item-sports-council',
      title: 'Sports Council & Annual Athletic Meet',
      category: 'councils',
      description: 'Heads: Muskan Mishra, Saurabh Shukla • Convener: Ms. Reetu Rawat',
      iconName: 'Trophy',
      badge: 'Council',
      action: () => onSelectPrompt('Tell me about MPDREC Sports Council leaders and indoor/outdoor facilities.')
    },
    {
      id: 'item-media-council',
      title: 'Media Council & Campus Press',
      category: 'councils',
      description: 'Heads: Avinash Ranjan, Manu Tiwari • Convener: Mr. Marut Nandan Tripathi',
      iconName: 'Trophy',
      badge: 'Council',
      action: () => onSelectPrompt('Provide information about Media Council heads and photography coverage.')
    },
    {
      id: 'item-cultural-council',
      title: 'Cultural Council (Euphoria 2026)',
      category: 'councils',
      description: 'Heads: Archita Mishra, Ankit Kumar Yadav • Convener: Dr. Aparna Verma',
      iconName: 'Trophy',
      badge: 'Council',
      action: () => onSelectPrompt('Who is leading Cultural Council and what are the Euphoria 2026 fest dates?')
    },

    // People
    {
      id: 'item-director',
      title: 'Director / Superadmin Office: Dr. Bhartendu Nath Mishra',
      category: 'people',
      description: 'Executive head & college administration',
      iconName: 'Users',
      badge: 'Leadership',
      action: () => onSelectPrompt('Who is the Director and key administrative authorities of MPDREC?')
    },
    {
      id: 'item-warden',
      title: 'Hostel Chief Warden: Shivani Verma & Mr. Maurya',
      category: 'people',
      description: 'Saryu Girls Hostel resident warden & administrative in-charge',
      iconName: 'Building2',
      badge: 'Faculty',
      action: () => onSelectPrompt('What are the contact details and cabin hours for Hostel Wardens?')
    },

    // Navigation
    {
      id: 'item-nav-timetable',
      title: 'Jump to ERP Class Timetable Matrix',
      category: 'navigation',
      description: 'View weekly schedules, faculty allotments and rooms',
      iconName: 'Calendar',
      badge: 'Module',
      action: () => {
        if (onNavigateTab) onNavigateTab('timetable');
        onClose();
      }
    },
    {
      id: 'item-nav-library',
      title: 'Jump to Central Library Catalog',
      category: 'navigation',
      description: 'Book reservations, overdue checks, IEEE access',
      iconName: 'BookOpen',
      badge: 'Module',
      action: () => {
        if (onNavigateTab) onNavigateTab('library');
        onClose();
      }
    },
    {
      id: 'item-nav-councils',
      title: 'Jump to 7 Student Councils Hub',
      category: 'navigation',
      description: 'Interactive council hierarchy, registrations & galleries',
      iconName: 'Trophy',
      badge: 'Module',
      action: () => {
        if (onNavigateTab) onNavigateTab('councils_hub');
        onClose();
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on query and category
  const filteredItems = instantItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Handle Keyboard Arrow navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === 0 && searchQuery.trim()) {
        // Direct ask AI prompt
        onSelectPrompt(searchQuery);
        onClose();
      } else if (filteredItems[selectedIndex - (searchQuery.trim() ? 1 : 0)]) {
        filteredItems[selectedIndex - (searchQuery.trim() ? 1 : 0)].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-[#0d121f]/95 border border-slate-200 dark:border-white/15 shadow-2xl shadow-violet-950/20 dark:shadow-violet-950/40 overflow-hidden text-slate-800 dark:text-slate-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Glow ambient background rings */}
        <div className="absolute top-0 right-1/4 w-72 h-40 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-72 h-40 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Input Bar */}
        <div className="relative p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or ask Campus AI co-pilot anything..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-600 dark:text-slate-400">
            <span>ESC</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 flex gap-1.5 overflow-x-auto text-xs bg-slate-50/50 dark:bg-white/[0.01]">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'academics', label: 'Academics & SGPA' },
            { id: 'councils', label: '7 Councils' },
            { id: 'people', label: 'Faculty & Leaders' },
            { id: 'navigation', label: 'ERP Shortcuts' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 sm:p-3 space-y-1">
          
          {/* Custom AI Prompt Item if Query Typed */}
          {searchQuery.trim() && (
            <div
              onClick={() => {
                onSelectPrompt(searchQuery);
                onClose();
              }}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                selectedIndex === 0
                  ? 'bg-violet-50 dark:bg-gradient-to-r dark:from-violet-600/30 dark:to-cyan-600/20 border border-violet-300 dark:border-violet-500/40 text-slate-900 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-600/30 border border-violet-200 dark:border-violet-500/40 flex items-center justify-center text-violet-700 dark:text-violet-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Ask Campus AI Co-Pilot:</span>
                    <span className="text-violet-600 dark:text-cyan-300 font-normal truncate italic">"{searchQuery}"</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Generate solution, formulas, roadmap or reasoning</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                <CornerDownLeft className="w-3.5 h-3.5 text-violet-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">Ask AI</span>
              </div>
            </div>
          )}

          {/* Filtered Indexed Items */}
          {filteredItems.map((item, idx) => {
            const adjustedIdx = idx + (searchQuery.trim() ? 1 : 0);
            const isSelected = selectedIndex === adjustedIdx;

            return (
              <div
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-white/[0.08] border border-violet-300 dark:border-violet-500/40 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-transparent border border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    {item.category === 'academics' && <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                    {item.category === 'councils' && <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {item.category === 'people' && <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                    {item.category === 'navigation' && <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-mono text-[10px] shrink-0">
                  <span>Enter</span>
                  <CornerDownLeft className="w-3 h-3" />
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && !searchQuery.trim() && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching records found. Type anything to query the AI assistant.
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/[0.06] border border-slate-300 dark:border-white/10 font-mono text-[9px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/[0.06] border border-slate-300 dark:border-white/10 font-mono text-[9px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/[0.06] border border-slate-300 dark:border-white/10 font-mono text-[9px]">ESC</kbd> Close
            </span>
          </div>

          <span className="font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">MPDREC Spotlight HUD</span>
        </div>
      </div>
    </div>
  );
};
