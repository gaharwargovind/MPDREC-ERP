import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Paperclip, 
  Mic, 
  Zap, 
  Brain, 
  Check, 
  X, 
  FileText, 
  ChevronRight,
  SlidersHorizontal,
  Compass,
  Clock,
  Calculator,
  Code2,
  Home,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { AiModelMode } from './types';
import { QUICK_PROMPTS } from './academicKnowledge';

interface AmbientInputCapsuleProps {
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  onSendMessage: (promptToSend?: string, attachedDoc?: string) => void;
  isLoading: boolean;
  modelMode: AiModelMode;
  setModelMode: (mode: AiModelMode) => void;
  onOpenVoiceModal: () => void;
  onOpenOmnibar: () => void;
}

export const AmbientInputCapsule: React.FC<AmbientInputCapsuleProps> = ({
  inputPrompt,
  setInputPrompt,
  onSendMessage,
  isLoading,
  modelMode,
  setModelMode,
  onOpenVoiceModal,
  onOpenOmnibar
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputPrompt.trim()) {
        onSendMessage(inputPrompt, attachedDoc || undefined);
        setAttachedDoc(null);
      }
    }
  };

  const sampleAttachments = [
    { id: 'att-dsa', name: 'KCS-401_Syllabus_2026.pdf', tag: 'Syllabus' },
    { id: 'att-aktu-ord', name: 'AKTU_Ordinance_Gazette_Section3.pdf', tag: 'Ordinance' },
    { id: 'att-hostel', name: 'Saryu_Hostel_Manual_Warden.pdf', tag: 'Hostel' },
    { id: 'att-councils', name: '7_Councils_Leadership_Matrix.pdf', tag: 'Councils' },
  ];

  const getQuickPromptIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Clock': return <Clock className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Compass': return <Compass className="w-3.5 h-3.5 text-violet-400" />;
      case 'Calculator': return <Calculator className="w-3.5 h-3.5 text-amber-400" />;
      case 'Code2': return <Code2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'Home': return <Home className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Trophy': return <Trophy className="w-3.5 h-3.5 text-yellow-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-violet-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-3 z-20">
      
      {/* 1. Quick-Prompt Suggestion Strip (Horizontal Scrolling) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mask-fade-edges">
        <button
          onClick={onOpenOmnibar}
          className="px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-600/20 hover:bg-violet-200 dark:hover:bg-violet-600/30 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-300 dark:border-violet-500/40 flex items-center gap-1.5 whitespace-nowrap shadow-sm shrink-0 transition-colors"
          title="Press Cmd+K to open"
        >
          <Sparkles className="w-3 h-3 text-violet-600 dark:text-cyan-400" />
          <span>Spotlight HUD</span>
          <kbd className="px-1 py-0.2 rounded bg-violet-200/60 dark:bg-black/40 text-[9px] font-mono text-violet-800 dark:text-violet-200">⌘K</kbd>
        </button>

        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(qp.text, attachedDoc || undefined)}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-white/[0.07] hover:border-violet-400 dark:hover:border-violet-500/40 flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 shadow-xs"
          >
            {getQuickPromptIcon(qp.icon)}
            <span>{qp.text}</span>
          </button>
        ))}
      </div>

      {/* 2. Main Ambient Floating Capsule Container */}
      <div className={`relative rounded-3xl transition-all duration-300 ${
        isFocused ? 'iridescent-border-active shadow-2xl shadow-violet-950/20 dark:shadow-violet-950/40' : 'shadow-lg'
      }`}>
        
        {/* Glow halo when thinking */}
        {isLoading && (
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-cyan-500 to-indigo-600 opacity-60 blur-md animate-pulse pointer-events-none" />
        )}

        <div className="relative rounded-3xl bg-white/95 dark:bg-[#0c101c]/90 border border-slate-200 dark:border-white/15 backdrop-blur-2xl p-3 sm:p-4 space-y-3 shadow-md">
          
          {/* Active Attached Document Badge */}
          {attachedDoc && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-violet-100 dark:bg-violet-950/60 border border-violet-300 dark:border-violet-500/40 text-xs text-violet-800 dark:text-violet-200">
              <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-cyan-400" />
              <span className="font-medium font-mono text-[11px]">{attachedDoc}</span>
              <button
                onClick={() => setAttachedDoc(null)}
                className="p-0.5 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about syllabus, check attendance threshold, simulate SGPA, or generate study roadmap..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none resize-none min-h-[44px] max-h-[140px] leading-relaxed font-sans"
            disabled={isLoading}
          />

          {/* Trailing Action Tray */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
            
            {/* Left Controls (Attachments & Voice & Mode) */}
            <div className="flex items-center gap-1.5">
              
              {/* Attachment Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    attachedDoc 
                      ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-500/40' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                  }`}
                  title="Attach Academic Context"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Context</span>
                </button>

                {/* Attachment Dropdown */}
                {isAttachmentOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl bg-white dark:bg-[#0f1424] border border-slate-200 dark:border-white/15 shadow-2xl p-2.5 space-y-1.5 z-50 text-xs text-slate-800 dark:text-slate-200">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Ground with Verified Course Files
                    </div>
                    {sampleAttachments.map(att => (
                      <button
                        key={att.id}
                        onClick={() => {
                          setAttachedDoc(att.name);
                          setIsAttachmentOpen(false);
                        }}
                        className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-white/[0.06] flex items-center justify-between gap-2 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                          <span className="truncate font-mono text-[11px]">{att.name}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                          {att.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={onOpenVoiceModal}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5"
                title="Voice Dictation"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Voice</span>
              </button>

              {/* Model Mode Toggle (Flash vs Deep Reasoning) */}
              <div className="flex items-center bg-slate-100 dark:bg-black/40 rounded-xl p-0.5 border border-slate-200 dark:border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setModelMode('flash')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    modelMode === 'flash'
                      ? 'bg-amber-100 dark:bg-gradient-to-r dark:from-amber-500/30 dark:to-orange-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Flash Quick Assist"
                >
                  <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px]">Flash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModelMode('deep_reasoning')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    modelMode === 'deep_reasoning'
                      ? 'bg-violet-100 dark:bg-gradient-to-r dark:from-violet-600/40 dark:to-cyan-500/20 text-violet-800 dark:text-cyan-300 border border-violet-300 dark:border-cyan-500/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Deep Academic Reasoning & Proofs"
                >
                  <Brain className="w-3 h-3 text-violet-600 dark:text-cyan-400" />
                  <span className="text-[11px]">Deep Think</span>
                </button>
              </div>

            </div>

            {/* Right Controls (Send Button) */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-[10px] text-slate-500 font-mono">
                ↵ to send, Shift+↵ newline
              </span>

              <button
                type="button"
                onClick={() => {
                  if (inputPrompt.trim() && !isLoading) {
                    onSendMessage(inputPrompt, attachedDoc || undefined);
                    setAttachedDoc(null);
                  }
                }}
                disabled={isLoading || !inputPrompt.trim()}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 disabled:hover:from-violet-600 disabled:hover:to-cyan-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
