import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface VoiceDictationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (transcript: string) => void;
}

export const VoiceDictationModal: React.FC<VoiceDictationModalProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 16, 32, 20, 40, 28, 18, 36, 14, 22, 30]);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      setIsListening(true);
      setTranscript('');
      // Animate simulated audio waveform
      interval = setInterval(() => {
        setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 36) + 8));
      }, 100);

      // Setup browser SpeechRecognition if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-IN';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + ' ';
            }
            setTranscript(current);
          };

          recognition.start();

          return () => {
            recognition.stop();
            clearInterval(interval);
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization note:', e);
        }
      }
    } else {
      setIsListening(false);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = (customText?: string) => {
    const finalText = customText || transcript || "What are the passing criteria for AKTU semester exams?";
    onTranscriptComplete(finalText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0e1322] border border-slate-200 dark:border-white/15 shadow-2xl space-y-6 text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-600/10 dark:bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5" /> MPDREC Voice AI
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Listening to your query...</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Speak naturally in English or Hindi (Academic terminology supported)</p>
        </div>

        {/* Audio Waveform Ripple */}
        <div className="py-6 flex items-center justify-center gap-1.5 h-24">
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-violet-500 via-cyan-500 to-indigo-400 transition-all duration-100"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Transcript Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-left min-h-[72px]">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Live Transcript:</span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {transcript || (
              <span className="text-slate-400 italic">"Explain deadlock conditions in Operating Systems..."</span>
            )}
          </p>
        </div>

        {/* Quick Dictation Presets */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button
            onClick={() => handleApply("Check my OS and DSA attendance percentage")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
          >
            "Check my attendance"
          </button>
          <button
            onClick={() => handleApply("When is my next class and which room?")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
          >
            "When is my next class?"
          </button>
          <button
            onClick={() => handleApply("Generate study roadmap for End-Sem exams")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
          >
            "Generate study roadmap"
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleApply()}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Insert & Send</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
