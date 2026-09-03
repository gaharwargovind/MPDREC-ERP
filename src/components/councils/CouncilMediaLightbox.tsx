import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ChevronLeft, ChevronRight, Calendar, User, Tag, Download, Share2, Eye } from 'lucide-react';
import { CouncilMediaItem } from '../../types/councils';

interface CouncilMediaLightboxProps {
  item: CouncilMediaItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onLike?: (mediaId: string) => void;
  isLiked?: boolean;
}

export const CouncilMediaLightbox: React.FC<CouncilMediaLightboxProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onLike,
  isLiked = false
}) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-2xl border border-slate-700/50 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white shadow-2xl border border-slate-700/50 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Media Player / Canvas View */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px] overflow-hidden">
            {item.type === 'video' && item.videoEmbedUrl ? (
              <iframe
                src={item.videoEmbedUrl}
                title={item.title}
                className="w-full h-full min-h-[360px] lg:min-h-[500px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full lg:w-96 p-6 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto">
            <div className="space-y-4">
              {/* Event Badge & Date */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                  {item.eventName || 'Campus Memory'}
                </span>
                {item.eventDate && (
                  <span className="flex items-center text-slate-400 gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.eventDate}
                  </span>
                )}
              </div>

              {/* Title & Caption */}
              <div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-slate-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Submitter Info Card */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center text-slate-400 gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Captured & Contributed By</span>
                </div>
                <div className="font-semibold text-white">
                  {item.uploadedBy.name}
                </div>
                <div className="text-slate-500">
                  {item.uploadedBy.role}
                </div>
              </div>

              {/* Approval stamp if approved */}
              {item.approvedBy && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Verified by: {item.approvedBy}
                </div>
              )}
            </div>

            {/* Interaction Bar */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between mt-4">
              <button
                onClick={() => onLike && onLike(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                  isLiked
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{item.likes || 0} Likes</span>
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Open Original"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
