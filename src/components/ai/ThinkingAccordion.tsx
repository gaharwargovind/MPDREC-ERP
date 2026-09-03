import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  CheckCircle2, 
  Loader2, 
  Search, 
  ShieldCheck, 
  Database,
  Sparkles,
  Layers
} from 'lucide-react';
import { ThinkingStep, GroundingSource } from './types';

interface ThinkingAccordionProps {
  steps: ThinkingStep[];
  durationSec?: number;
  sources?: GroundingSource[];
  isStreaming?: boolean;
}

export const ThinkingAccordion: React.FC<ThinkingAccordionProps> = ({
  steps,
  durationSec = 1.2,
  sources = [],
  isStreaming = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="my-2.5 rounded-2xl bg-slate-100/90 dark:bg-[#0e1320]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-md overflow-hidden transition-all text-xs">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-slate-200/50 dark:hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex items-center justify-center w-5 h-5 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/40 shrink-0">
            {isStreaming ? (
              <Loader2 className="w-3 h-3 animate-spin text-cyan-600 dark:text-cyan-400" />
            ) : (
              <Brain className="w-3 h-3 text-violet-600 dark:text-violet-300" />
            )}
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          </div>

          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
            {isStreaming ? 'Thinking & querying campus knowledgebase...' : `Thought process (${steps.length} steps)`}
          </span>

          <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/[0.05] text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 shrink-0">
            {durationSec.toFixed(1)}s
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
          <span className="text-[11px] hidden sm:inline text-slate-500">
            {isOpen ? 'Hide breakdown' : 'View reasoning'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Step Body */}
      {isOpen && (
        <div className="px-4 pb-3.5 pt-1 space-y-3 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-black/20">
          {/* Grounding Source Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider self-center mr-1">
              Indexed:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 text-[10px] font-mono flex items-center gap-1">
              <Database className="w-2.5 h-2.5" /> MPDREC Core DB
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20 text-[10px] font-mono flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> AKTU Ordinance §3.2
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 text-[10px] font-mono flex items-center gap-1">
              <Search className="w-2.5 h-2.5" /> Syllabus Vault 2026
            </span>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-300 dark:before:bg-white/10 pl-5">
            {steps.map((step, idx) => (
              <div key={step.id || idx} className="relative space-y-0.5">
                {/* Indicator Dot */}
                <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-sm" />

                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {step.title}
                  </span>
                  {step.source && (
                    <span className="text-[9px] font-mono text-slate-500 truncate max-w-[140px]">
                      {step.source}
                    </span>
                  )}
                </div>

                {step.detail && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
