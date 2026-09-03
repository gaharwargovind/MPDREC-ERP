import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Loader2, 
  Copy, 
  Check, 
  Compass, 
  Clock, 
  Calculator, 
  Code2, 
  FileText, 
  Command, 
  Zap, 
  Brain, 
  Share2, 
  Download, 
  ArrowRight,
  Maximize2,
  Minimize2,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { AuthSession } from '../types/erp';
import { 
  AiMessage, 
  AiArtifact, 
  AiModelMode, 
  PromptCategory,
  ThinkingStep 
} from './ai/types';
import { 
  buildThinkingSteps, 
  createArtifactForQuery, 
  SEARCH_INDEX_CATEGORIES,
  QUICK_PROMPTS 
} from './ai/academicKnowledge';
import { ArtifactCanvas } from './ai/ArtifactCanvas';
import { ThinkingAccordion } from './ai/ThinkingAccordion';
import { AmbientInputCapsule } from './ai/AmbientInputCapsule';
import { OmnibarHUD } from './ai/OmnibarHUD';
import { VoiceDictationModal } from './ai/VoiceDictationModal';

interface CampusAiChatbotProps {
  session: AuthSession;
  students?: any[];
  timetable?: any[];
  books?: any[];
  rooms?: any[];
  onNavigateTab?: (tab: string) => void;
  onOpenGradeCard?: (student: any) => void;
}

export const CampusAiChatbot: React.FC<CampusAiChatbotProps> = ({ 
  session,
  students = [],
  timetable = [],
  books = [],
  rooms = [],
  onNavigateTab,
  onOpenGradeCard
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'init-welcome',
      sender: 'assistant',
      text: `### ⚡ MPDREC Academic AI Co-Pilot v3.7
Hello **${session.name}**! I am your intelligent academic co-pilot and campus operating workspace.

I am grounded in real-time across:
• **AKTU Examination Ordinances**: Attendance compliance (§3.2 75% rule), 10-Point Credit SGPA system, Class Tests (CT-1 & CT-2).
• **Core Engineering Curricula**: Data Structures (KCS-401), Operating Systems (KCS-402), Discrete Mathematics, DBMS.
• **Institutional Services**: Saryu Girls Hostel policies (Warden: Shivani Verma), Central Library reservations, 7 Student Councils leadership.

How can I assist your engineering workflow today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'academics',
      modelMode: 'flash',
      thinkingDurationSec: 0.8,
      thinkingSteps: [
        {
          id: 'step-init',
          title: 'Initialized Campus Knowledge Graph',
          status: 'completed',
          detail: 'Mounted student context, timetable registries, and AKTU 2026 ordinances.',
          source: 'MPDREC Semantic Engine'
        }
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('all');
  const [modelMode, setModelMode] = useState<AiModelMode>('deep_reasoning');
  const [activeArtifact, setActiveArtifact] = useState<AiArtifact | null>(null);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);
  const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOmnibarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const copyResponse = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentStudent = students.find(
    s => s.rollNo === session.rollNo || s.name?.toLowerCase() === session.name?.toLowerCase()
  ) || {
    name: session.name,
    rollNo: session.rollNo || '2301330100045',
    branch: 'Computer Science & Engineering',
    semester: 4,
    attendancePercentage: 81.5,
    cgpa: 8.35
  };

  const handleSendMessage = async (promptToSend?: string, attachedDoc?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessageText = attachedDoc ? `[Attached: ${attachedDoc}]\n\n${text.trim()}` : text.trim();

    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    const generatedArtifact = createArtifactForQuery(text);
    if (generatedArtifact) {
      setActiveArtifact(generatedArtifact);
    }

    const thinkingSteps = buildThinkingSteps(text, modelMode === 'deep_reasoning');
    const thinkingDuration = modelMode === 'deep_reasoning' ? 1.6 : 0.7;

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          role: session.role,
          userName: session.name,
          modelMode,
          studentContext: currentStudent
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply || "I have processed your query with MPDREC knowledgebase.";
      } else {
        throw new Error('Server offline');
      }

      const botMsg: AiMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelMode,
        thinkingSteps,
        thinkingDurationSec: thinkingDuration,
        artifact: generatedArtifact
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      let localReply = `### 📋 MPDREC Academic Synthesis:
• **Attendance Compliance**: Under AKTU Ordinance §3.2, 75% aggregate is strictly mandatory. Current record for ${currentStudent.name}: **${currentStudent.attendancePercentage}%** (Eligible).
• **Internal Evaluation**: Continuous assessments comprise Class Tests (CT-1 & CT-2: 30 marks) and Assignments (20 marks).
• **Saryu Girls Hostel**: Resident Warden Shivani Verma; all female students enjoy 24x7 Wi-Fi and power backup.`;

      if (text.toLowerCase().includes('roadmap') || text.toLowerCase().includes('prep')) {
        localReply = `### 🗺️ 8-Week AKTU Exam Roadmap Generated!
I have prepared an interactive milestone-based study strategy for your semester exams. You can track weekly target progress in the **Right Canvas Artifact Viewer**.`;
      } else if (text.toLowerCase().includes('sgpa') || text.toLowerCase().includes('grade')) {
        localReply = `### 🎯 SGPA Projection & Grade Simulator Ready
Under AKTU's 10-point scale (\`∑(Credits × Grade Point) / Total Credits\`), you can adjust Class Test 1/2 and End-Sem score projections dynamically on the **Right Canvas**!`;
      } else if (text.toLowerCase().includes('avl') || text.toLowerCase().includes('tree') || text.toLowerCase().includes('code')) {
        localReply = `### 💻 AVL Tree Auto-Balancing (C++ Implementation)
An AVL Tree ensures self-balancing via rotations (**LL, RR, LR, RL**) with balance factor \`|Height(L) - Height(R)| ≤ 1\`. I have loaded the executable source code and trace in the **Right Canvas**!`;
      } else if (text.toLowerCase().includes('timetable') || text.toLowerCase().includes('next class')) {
        localReply = `### 📅 Live Class Schedule & Countdown
Your next lecture is **Data Structures & Algorithms (KCS-401)** in **Lecture Hall 204** by **Prof. Shivani Verma**. Live countdown is active on the right canvas!`;
      }

      const fallbackMsg: AiMessage = {
        id: `bot-local-${Date.now()}`,
        sender: 'assistant',
        text: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelMode,
        thinkingSteps,
        thinkingDurationSec: thinkingDuration,
        artifact: generatedArtifact
      };

      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInlineStyles = (text: string) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\$[^$]+\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-white tracking-tight">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={keyIdx++} className="px-1.5 py-0.5 rounded-lg bg-violet-950/60 text-cyan-300 font-mono text-[11px] border border-violet-500/30">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('$') && token.endsWith('$')) {
        parts.push(
          <span key={keyIdx++} className="px-2 py-0.5 rounded-lg bg-cyan-950/40 text-cyan-200 font-mono text-xs border border-cyan-500/30 inline-flex items-center gap-1 shadow-2xs">
            <span className="text-[10px] text-cyan-400 font-serif font-bold">fx</span>
            {token.slice(1, -1)}
          </span>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-300">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderFormattedBotMessage = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={lineIdx} className="h-2" />;
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={lineIdx} className="font-display font-bold text-white text-sm sm:text-base mt-3 pt-1 pb-1 border-b border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-3 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400" />
                {renderInlineStyles(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            return (
              <h3 key={lineIdx} className="font-display font-black text-white text-base sm:text-lg mt-4 pt-1">
                {renderInlineStyles(trimmed.replace(/^#+\s/, ''))}
              </h3>
            );
          }

          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 mt-2 shrink-0 shadow-xs" />
                <div className="flex-1 text-slate-200 leading-relaxed">
                  {renderInlineStyles(itemText)}
                </div>
              </div>
            );
          }

          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                <span className="font-mono font-bold text-violet-400 text-xs shrink-0 min-w-4 mt-0.5">
                  {numMatch[1]}.
                </span>
                <div className="flex-1 text-slate-200 leading-relaxed">
                  {renderInlineStyles(numMatch[2])}
                </div>
              </div>
            );
          }

          return (
            <p key={lineIdx} className="leading-relaxed text-slate-300">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] w-full max-w-full rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-[#080b11] text-slate-800 dark:text-slate-200 overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl flex flex-col">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7c3aed] opacity-[0.08] dark:opacity-[0.12] rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-[#06b6d4] opacity-[0.06] dark:opacity-[0.09] rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#ec4899] opacity-[0.05] dark:opacity-[0.07] rounded-full blur-[100px] animate-float-slow" />
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <header className="relative z-20 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c101c]/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-600/30">
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#080b11] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-cyan-300 animate-pulse-subtle" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                MPDREC Campus AI Co-Pilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/40 font-mono">
                v3.7 Gemini Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous reasoning across AKTU syllabus, attendance compliance, and 7 student councils.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setIsOmnibarOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
            title="Open Spotlight (Cmd + K)"
          >
            <Command className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="hidden sm:inline">Spotlight HUD</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-black/40 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10">⌘K</kbd>
          </button>

          <button
            onClick={() => {
              setMessages([messages[0]]);
              setActiveArtifact(null);
            }}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
            title="Clear Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 border-b border-slate-200 dark:border-white/[0.06] bg-slate-100/80 dark:bg-[#0c101c]/40 backdrop-blur-md flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3" /> Focus:
        </span>

        {SEARCH_INDEX_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as PromptCategory)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.05]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          activeArtifact ? 'lg:w-[60%]' : 'w-full'
        }`}>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div 
                  key={m.id} 
                  className={`flex gap-4 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'} animate-fade-in`}
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    isAssistant 
                      ? 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-violet-600/20' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10'
                  }`}>
                    {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>

                  <div className={`max-w-[90%] sm:max-w-[85%] rounded-3xl p-5 text-xs sm:text-sm leading-relaxed transition-all ${
                    isAssistant 
                      ? 'glass-obsidian rounded-tl-none text-slate-800 dark:text-slate-100 shadow-md border border-slate-200 dark:border-white/10' 
                      : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-lg shadow-violet-600/20'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-slate-200 dark:border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs flex items-center gap-1.5 ${
                          isAssistant ? 'text-violet-700 dark:text-cyan-300' : 'text-violet-100'
                        }`}>
                          {isAssistant && <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                          {isAssistant ? 'Campus AI Co-Pilot' : session.name}
                        </span>

                        {isAssistant && m.modelMode && (
                          <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-white/[0.06] text-[9px] font-mono text-slate-600 dark:text-slate-400">
                            {m.modelMode === 'deep_reasoning' ? '🔬 Deep Reason' : '⚡ Flash'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {m.timestamp}
                        </span>

                        {isAssistant && (
                          <button
                            onClick={() => copyResponse(m.text, m.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            title="Copy message"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isAssistant && m.thinkingSteps && (
                      <ThinkingAccordion 
                        steps={m.thinkingSteps} 
                        durationSec={m.thinkingDurationSec} 
                      />
                    )}

                    {isAssistant ? renderFormattedBotMessage(m.text) : (
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    )}

                    {isAssistant && m.artifact && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-white">
                            {m.artifact.title}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveArtifact(m.artifact || null)}
                          className="px-3 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-600/30 hover:bg-violet-200 dark:hover:bg-violet-600/50 text-violet-700 dark:text-cyan-300 text-xs font-bold border border-violet-200 dark:border-violet-500/40 flex items-center gap-1.5 transition-colors"
                        >
                          <span>Open in Canvas</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-4 items-start animate-fade-in">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="glass-obsidian rounded-3xl rounded-tl-none p-5 max-w-[85%] space-y-3 border border-slate-200 dark:border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-600 dark:text-cyan-400" />
                    <span className="font-semibold">
                      Reasoning over MPDREC Syllabus Vault & AKTU Gazette...
                    </span>
                  </div>

                  <div className="w-48 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-400 to-indigo-500 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-t from-slate-50 dark:from-[#080b11] via-slate-50/90 dark:via-[#080b11]/90 to-transparent">
            <AmbientInputCapsule
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              modelMode={modelMode}
              setModelMode={setModelMode}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onOpenOmnibar={() => setIsOmnibarOpen(true)}
            />
          </div>

        </div>

        {activeArtifact && (
          <div className="lg:w-[40%] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#080b11]/80 backdrop-blur-2xl p-4 sm:p-6 overflow-hidden flex flex-col">
            <ArtifactCanvas
              artifact={activeArtifact}
              onClose={() => setActiveArtifact(null)}
              isExpanded={isCanvasExpanded}
              onToggleExpand={() => setIsCanvasExpanded(!isCanvasExpanded)}
            />
          </div>
        )}

      </div>

      <OmnibarHUD
        isOpen={isOmnibarOpen}
        onClose={() => setIsOmnibarOpen(false)}
        onSelectPrompt={(p) => handleSendMessage(p)}
        onNavigateTab={onNavigateTab}
      />

      <VoiceDictationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={(trans) => handleSendMessage(trans)}
      />

    </div>
  );
};
