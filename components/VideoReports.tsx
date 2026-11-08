"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Play, Calendar, User, Plus, Trash2, Clapperboard, Smartphone, Link as LinkIcon, Sparkles, X, Check, Loader2 } from "lucide-react";
import UploadVideoModal, { VideoReportItem } from "./UploadVideoModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import VideoPlayerModal from "./VideoPlayerModal";
import { getVideoUrlFromDb, deleteVideoFromDb } from "@/lib/videoDb";

export default function VideoReports() {
  const [reports, setReports] = useState<VideoReportItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<VideoReportItem | null>(null);
  const [reportToUpdateLink, setReportToUpdateLink] = useState<VideoReportItem | null>(null);
  const [activePlayingReport, setActivePlayingReport] = useState<VideoReportItem | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from Cloud Database (with localStorage fallback)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("romnick_video_reports");
      if (saved) {
        setReports(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
          try {
            const sanitized = data.map((r: VideoReportItem) =>
              r.isLocalFile ? { ...r, videoUrl: undefined } : r
            );
            localStorage.setItem("romnick_video_reports", JSON.stringify(sanitized));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.error("Cloud DB video fetch error:", err))
      .finally(() => setHasLoaded(true));
  }, []);

  // Save to Cloud Database and localStorage
  const handleAddVideo = async (newReport: VideoReportItem) => {
    try {
      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
    } catch (err) {
      console.error("Cloud DB video save error:", err);
    }

    const updated = [newReport, ...reports];
    setReports(updated);
    try {
      const sanitized = updated.map((r) =>
        r.isLocalFile ? { ...r, videoUrl: undefined } : r
      );
      localStorage.setItem("romnick_video_reports", JSON.stringify(sanitized));
    } catch (e) {
      console.error(e);
    }
  };

  // Update a video report's link (YouTube / Google Drive URL)
  const handleSaveUpdatedLink = async (targetReport: VideoReportItem, newUrl: string) => {
    const updatedItem: VideoReportItem = {
      ...targetReport,
      videoUrl: newUrl.trim(),
      isLocalFile: false, // Now hosted in cloud
    };

    try {
      await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
    } catch (err) {
      console.error("Cloud DB video update error:", err);
    }

    const updatedList = reports.map((r) => (r.id === targetReport.id ? updatedItem : r));
    setReports(updatedList);
    try {
      localStorage.setItem("romnick_video_reports", JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    // Also update currently active playing report if open
    if (activePlayingReport && activePlayingReport.id === targetReport.id) {
      setActivePlayingReport(updatedItem);
    }

    setReportToUpdateLink(null);
  };

  const handleDelete = async (id: string) => {
    // Delete permanently from Cloud Database first
    try {
      await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Cloud DB video delete error:", err);
    }

    // Update local state and cache
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    try {
      const sanitized = updated.map((r) =>
        r.isLocalFile ? { ...r, videoUrl: undefined } : r
      );
      localStorage.setItem("romnick_video_reports", JSON.stringify(sanitized));
      deleteVideoFromDb(id);
    } catch (e) {
      console.error(e);
    }
  };

  // Play video: open VideoPlayerModal
  const handlePlayVideo = (report: VideoReportItem) => {
    setActivePlayingReport(report);
  };

  return (
    <section id="video-reports" className="py-20 relative bg-transparent border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3 shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Multimedia Presentations</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Video Reports & Demonstrations
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Recorded academic presentations, teaching demonstrations, and course coursework viewable across all devices.
          </motion.p>

          {/* Action Upload Button */}
          {hasLoaded && reports.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Video Report</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Reports Display Grid */}
        {hasLoaded && reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col justify-between group"
              >
                {/* Video Screen Preview & Clickable Play Area with Thumbnail Frame */}
                <VideoCardScreen
                  report={report}
                  onPlay={() => handlePlayVideo(report)}
                  onUpdateLink={(e) => {
                    e.stopPropagation();
                    setReportToUpdateLink(report);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setReportToDelete(report);
                  }}
                />

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                      <span className="text-indigo-600 font-bold">{report.subject}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.date}
                      </span>
                    </div>

                    <h3
                      onClick={() => handlePlayVideo(report)}
                      className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2 cursor-pointer line-clamp-2 break-words [overflow-wrap:anywhere]"
                    >
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3 break-words [overflow-wrap:anywhere]">
                      {report.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[190px]">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {report.instructor.toLowerCase().startsWith("instructor")
                          ? report.instructor
                          : `Instructor: ${report.instructor}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.videoUrl || report.isLocalFile ? (
                        <button
                          type="button"
                          onClick={() => handlePlayVideo(report)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-indigo-600" />
                          <span>Watch Video</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Presentation Log
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Clean Inviting Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto shadow-xs"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Clapperboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              No Video Reports Uploaded Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Showcase video presentations and teaching demonstrations using YouTube, Google Drive, or camera uploads.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video Report</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Upload Video Modal */}
      <UploadVideoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddVideo={handleAddVideo}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        report={activePlayingReport}
        onClose={() => setActivePlayingReport(null)}
        onUpdateLink={(rep) => setReportToUpdateLink(rep)}
      />

      {/* Quick Link Update Modal */}
      {reportToUpdateLink && (
        <UpdateVideoLinkModal
          report={reportToUpdateLink}
          onClose={() => setReportToUpdateLink(null)}
          onSave={(url) => handleSaveUpdatedLink(reportToUpdateLink, url)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!reportToDelete}
        title={reportToDelete?.title || ""}
        itemType="Video Report"
        onConfirm={async () => {
          if (reportToDelete) {
            await handleDelete(reportToDelete.id);
          }
        }}
        onClose={() => setReportToDelete(null)}
      />
    </section>
  );
}

// Subcomponent: Video Screen Preview displaying real video thumbnail frame or live video frame
function VideoCardScreen({
  report,
  onPlay,
  onUpdateLink,
  onDelete,
}: {
  report: VideoReportItem;
  onPlay: () => void;
  onUpdateLink: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const [localVideoUrl, setLocalVideoUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    if (report.isLocalFile && !report.thumbnail) {
      getVideoUrlFromDb(report.id).then((url) => {
        if (active && url) {
          setLocalVideoUrl(url);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [report.id, report.isLocalFile, report.thumbnail]);

  return (
    <div
      onClick={onPlay}
      className="relative aspect-video bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center p-6 text-center overflow-hidden cursor-pointer group/screen"
    >
      {/* 1. Real Video Thumbnail Image if available */}
      {report.thumbnail ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.thumbnail}
            alt={report.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/screen:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30 group-hover/screen:via-black/20 transition-colors" />
        </div>
      ) : localVideoUrl ? (
        /* 2. Direct Video Frame if local file and no thumbnail */
        <div className="absolute inset-0">
          <video
            src={localVideoUrl}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover/screen:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30 group-hover/screen:via-black/20 transition-colors" />
        </div>
      ) : (
        /* 3. Subtle background radial glow */
        <div className="absolute inset-0 bg-radial from-indigo-500/20 via-transparent to-black/60 pointer-events-none" />
      )}

      {/* Local Device badge */}
      {report.isLocalFile && (
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm">
          <Smartphone className="w-3 h-3 text-emerald-400" />
          <span>Device File</span>
        </div>
      )}

      {/* Floating Play Button */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-13 h-13 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover/screen:scale-115 group-hover/screen:bg-indigo-600 transition-all shadow-xl mb-2">
          <Play className="w-6 h-6 fill-white ml-0.5" />
        </div>
        <span className="text-[11px] font-bold text-white drop-shadow-md tracking-wider uppercase">
          {report.duration}
        </span>
      </div>

      {/* Action buttons (Top Right) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
        <button
          type="button"
          onClick={onUpdateLink}
          className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-indigo-400 hover:bg-black/90 transition-colors cursor-pointer backdrop-blur-md"
          title="Update YouTube or Google Drive Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-rose-400 hover:bg-black/90 transition-colors cursor-pointer backdrop-blur-md"
          title="Remove Video"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Modal to quickly update a video with a YouTube or Google Drive link
function UpdateVideoLinkModal({
  report,
  onClose,
  onSave,
}: {
  report: VideoReportItem;
  onClose: () => void;
  onSave: (url: string) => void;
}) {
  const [url, setUrl] = useState(
    report.videoUrl && !report.videoUrl.startsWith("blob:") ? report.videoUrl : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsSaving(true);
    try {
      await onSave(url.trim());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-5 sm:p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <LinkIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Update Video Link
                </h3>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[220px]">
                  {report.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Paste YouTube or Google Drive URL *
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or Google Drive link"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-slate-600 leading-relaxed">
              <p className="font-bold text-indigo-700 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Why use YouTube or Google Drive?
              </p>
              <p className="text-[10.5px] text-slate-600">
                Large presentation files (like your 775 MB video) play smoothly and immediately on every phone, tablet, and PC without browser memory limits.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !url.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save &amp; Play</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
