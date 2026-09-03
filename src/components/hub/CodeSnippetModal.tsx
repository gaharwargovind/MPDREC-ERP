import React, { useState } from 'react';
import { X, Code, Send, Sparkles, Copy, Check } from 'lucide-react';
import { CodeSnippetData } from '../../types/hub';

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCode: (snippet: CodeSnippetData, comment?: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++ (AKTU DSA / Competitive)', defaultTitle: 'solution.cpp' },
  { id: 'python', name: 'Python (AI & Scripts)', defaultTitle: 'script.py' },
  { id: 'java', name: 'Java (OOP & Systems)', defaultTitle: 'Main.java' },
  { id: 'c', name: 'C Language (Systems / Lab)', defaultTitle: 'program.c' },
  { id: 'javascript', name: 'JavaScript / TypeScript', defaultTitle: 'index.ts' },
  { id: 'sql', name: 'SQL (Database Queries)', defaultTitle: 'query.sql' }
];

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  onSendCode,
}) => {
  const [language, setLanguage] = useState('cpp');
  const [title, setTitle] = useState('AVL_Tree_Rotations.cpp');
  const [code, setCode] = useState(`// Insert and balance AVL Tree
#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    int height;
};`);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId);
    const matched = SUPPORTED_LANGUAGES.find(l => l.id === langId);
    if (matched && !title) {
      setTitle(matched.defaultTitle);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSendCode(
      {
        language,
        code: code.trim(),
        title: title.trim() || 'code_snippet'
      },
      comment.trim()
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Share Formatted Code Snippet</h3>
              <p className="text-xs text-slate-400">Share syntax-highlighted algorithms, assignments, or bug traces</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Snippet Filename / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dijkstra_Algorithm.cpp"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Code Editor Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                Source Code
              </label>
              <span className="text-[11px] font-mono text-emerald-400 uppercase">
                {language} syntax mode
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117]">
              <textarea
                rows={10}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste or write code here..."
                className="w-full p-4 font-mono text-xs text-emerald-300 bg-transparent outline-none resize-none leading-relaxed selection:bg-emerald-900"
                required
              />
            </div>
          </div>

          {/* Optional message comment */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Optional Message / Description
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Here is the recursive DFS implementation we discussed in today's class."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {code.split('\n').length} lines • {code.length} characters
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Code Block</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
