import React from 'react';
import { PeerMessage, StudyMaterial, AuthSession } from '../types/erp';
import { MPDRECHub } from './hub/MPDRECHub';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';

interface StudentChatHubProps {
  messages?: PeerMessage[];
  onSendMessage?: (msg: PeerMessage) => void;
  studyMaterials: StudyMaterial[];
  onAddMaterial: (mat: StudyMaterial) => void;
  onLikeMaterial: (id: string) => void;
  session: AuthSession;
  onOpenLogin?: () => void;
}

export const StudentChatHub: React.FC<StudentChatHubProps> = ({
  studyMaterials,
  onAddMaterial,
  onLikeMaterial,
  session,
  onOpenLogin
}) => {
  // Hard blocker for guest accounts
  if (session.role === 'guest') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            MPDREC Hub Access Restricted
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The MPDREC Academic Discussion Hub and encrypted peer communication channels are restricted to verified college students, faculty mentors, and academic administrators.
          </p>
        </div>

        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            Sign in to Access MPDREC Hub
          </button>
        )}
      </div>
    );
  }

  return (
    <MPDRECHub
      session={session}
      studyMaterials={studyMaterials}
      onAddMaterial={onAddMaterial}
      onLikeMaterial={onLikeMaterial}
    />
  );
};
