"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Download, Quote } from "lucide-react";
import { JourneyItem } from "@/data/gallery";

interface JourneyLightboxModalProps {
  item: JourneyItem | null;
  onClose: () => void;
}

export default function JourneyLightboxModal({ item, onClose }: JourneyLightboxModalProps) {
  // Lock background scroll
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-8 bg-slate-950/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-2 overflow-hidden mr-2 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] sm:text-[11px] font-bold shrink-0">
                {item.tag}
              </span>
              <h3 className="text-xs sm:text-base font-black text-slate-900 truncate">
                {item.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Split Photo + Story Content */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 bg-slate-50 min-w-0">
            {/* Image Viewer Area */}
            <div className="md:col-span-7 bg-slate-950 flex items-center justify-center p-3 sm:p-6 min-h-[240px] sm:min-h-[300px] md:min-h-[460px] relative">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="max-h-[50vh] md:max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="text-slate-500 text-xs font-semibold">No photo available</div>
              )}

              {/* Download / Save Photo button */}
              {item.photoUrl && (
                <a
                  href={item.photoUrl}
                  download={`${item.title.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-2.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                  title="Download or view full photo"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Image</span>
                </a>
              )}
            </div>

            {/* Reflection & Description Sidebar */}
            <div className="md:col-span-5 p-4 sm:p-6 md:p-7 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-slate-200 space-y-5 min-w-0 overflow-hidden">
              <div className="space-y-4 min-w-0">
                {/* Meta Pills */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[150px]">{item.location}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug tracking-tight break-words [overflow-wrap:anywhere] [word-break:break-word]">
                  {item.title}
                </h4>

                {/* Meaning & Insight Card (Highlight) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-amber-100/30 border border-amber-200 text-slate-800 relative min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-wider mb-1.5">
                    <Quote className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>The Meaning Behind This Moment</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed italic break-words [overflow-wrap:anywhere] [word-break:break-word]">
                    &ldquo;{item.meaning}&rdquo;
                  </p>
                </div>

                {/* Detailed Description */}
                <div className="min-w-0 overflow-hidden">
                  <h5 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Story & Reflection
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal break-words [overflow-wrap:anywhere] [word-break:break-word]">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Author / Student attribution */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                    RP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-none">Romnick P. Ramacula</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">BEEd-2C Scholar • NEMSU</p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Journey Memory
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
