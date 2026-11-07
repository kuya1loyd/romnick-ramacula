"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Play, Calendar, User, Plus, ExternalLink, Trash2, Clapperboard } from "lucide-react";
import UploadVideoModal, { VideoReportItem } from "./UploadVideoModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function VideoReports() {
  const [reports, setReports] = useState<VideoReportItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<VideoReportItem | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("romnick_video_reports");
      if (saved) {
        setReports(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    setHasLoaded(true);
  }, []);

  // Save to localStorage when changed
  const handleAddVideo = (newReport: VideoReportItem) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    try {
      localStorage.setItem("romnick_video_reports", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    try {
      localStorage.setItem("romnick_video_reports", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
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
            Upload and showcase recorded academic presentations, teaching demonstrations, and video logs for BEEd coursework.
          </motion.p>

          {/* Action Upload Button (Only shown when items exist to prevent duplicate buttons) */}
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

        {/* Video Reports Display Grid or Clean Empty State */}
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
                {/* Video Screen Preview */}
                <div className="relative aspect-video bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-indigo-500/20 via-transparent to-black/60 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-indigo-600 transition-all shadow-lg mb-2">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 tracking-wider uppercase">
                      {report.duration}
                    </span>
                  </div>

                  {/* Delete Button (Opens Confirmation Modal) */}
                  <button
                    onClick={() => setReportToDelete(report)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-rose-400 hover:bg-black/80 transition-colors z-20 cursor-pointer"
                    title="Remove Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

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

                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {report.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.instructor}</span>
                    </div>

                    {report.videoUrl ? (
                      <a
                        href={report.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Watch Video</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Presentation Log
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Clean Inviting Empty State (No Dummy Items) */
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
              Click the button below to upload your student-led video presentations, teaching walkthroughs, or YouTube links.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Your First Video Report</span>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!reportToDelete}
        title={reportToDelete?.title || ""}
        itemType="Video Report"
        onConfirm={() => {
          if (reportToDelete) {
            handleDelete(reportToDelete.id);
            setReportToDelete(null);
          }
        }}
        onClose={() => setReportToDelete(null)}
      />
    </section>
  );
}
