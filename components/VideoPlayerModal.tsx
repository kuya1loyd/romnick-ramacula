"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, ExternalLink, Calendar, User } from "lucide-react";
import { VideoReportItem } from "./UploadVideoModal";

interface VideoPlayerModalProps {
  report: VideoReportItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ report, onClose }: VideoPlayerModalProps) {
  // Close on Escape & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (report) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [report, onClose]);

  // Check if URL is YouTube
  const youtubeEmbedUrl = useMemo(() => {
    if (!report?.videoUrl) return null;
    const url = report.videoUrl;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    return null;
  }, [report]);

  if (!report) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden mr-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {report.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-indigo-400 font-semibold">{report.subject}</span>
                  <span>•</span>
                  <span>{report.duration}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={report.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : report.videoUrl ? (
              <video
                src={report.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-6 text-slate-400 text-xs">
                No video source provided for this presentation.
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="px-5 sm:px-6 py-4 border-t border-slate-800/80 bg-slate-950/70 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <p className="line-clamp-2 max-w-xl text-slate-300 text-xs leading-relaxed">
              {report.description}
            </p>
            <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {report.instructor}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {report.date}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

