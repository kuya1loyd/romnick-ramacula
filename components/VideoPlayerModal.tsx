"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, ExternalLink, Calendar, User, Loader2, Play, AlertCircle, Sparkles, Link as LinkIcon, RefreshCw } from "lucide-react";
import { VideoReportItem } from "./UploadVideoModal";
import { getVideoUrlFromDb } from "@/lib/videoDb";

interface VideoPlayerModalProps {
  report: VideoReportItem | null;
  onClose: () => void;
  onUpdateLink?: (report: VideoReportItem) => void;
}

export default function VideoPlayerModal({ report, onClose, onUpdateLink }: VideoPlayerModalProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMissingLocalFile, setIsMissingLocalFile] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<boolean>(false);

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

  // Resolve video URL: check IndexedDB for device videos, or fallback to report.videoUrl
  useEffect(() => {
    let isCancelled = false;
    let localBlobUrl = "";

    const loadVideo = async () => {
      setIsMissingLocalFile(false);
      setPlaybackError(false);
      if (!report) {
        setResolvedUrl("");
        return;
      }
      setIsLoading(true);

      // If local file, query IndexedDB for fresh blob
      if (report.isLocalFile) {
        try {
          const dbUrl = await getVideoUrlFromDb(report.id);
          if (!isCancelled && dbUrl) {
            localBlobUrl = dbUrl;
            setResolvedUrl(dbUrl);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Could not retrieve video from IndexedDB:", err);
        }

        // If it's marked as a local file and IndexedDB does NOT contain it,
        // this means the video was uploaded from another computer / device files.
        // It cannot play on this phone / device via local blob!
        if (!isCancelled) {
          setIsMissingLocalFile(true);
          setResolvedUrl("");
          setIsLoading(false);
          return;
        }
      }

      // If report already has a videoUrl (web link or live URL)
      if (!isCancelled && report.videoUrl) {
        // If it's a blob: URL from another session, it will be dead
        if (report.videoUrl.startsWith("blob:") && report.isLocalFile) {
          setIsMissingLocalFile(true);
          setResolvedUrl("");
        } else {
          setResolvedUrl(report.videoUrl);
        }
      } else if (!isCancelled) {
        setResolvedUrl("");
      }
      setIsLoading(false);
    };

    loadVideo();

    return () => {
      isCancelled = true;
      if (localBlobUrl && localBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [report]);

  // Check if URL is YouTube
  const youtubeEmbedUrl = useMemo(() => {
    if (!resolvedUrl) return null;
    const match = resolvedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return null;
  }, [resolvedUrl]);

  // Check if URL is Google Drive
  const googleDriveEmbedUrl = useMemo(() => {
    if (!resolvedUrl) return null;
    const match = resolvedUrl.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/);
    const fileId = match ? match[1] || match[2] : null;
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return null;
  }, [resolvedUrl]);

  if (!report) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-8 bg-slate-950/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
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

            <div className="flex items-center gap-2 shrink-0">
              {onUpdateLink && (
                <button
                  type="button"
                  onClick={() => onUpdateLink(report)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Update video with YouTube or Google Drive URL"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Update Link</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="text-xs">Loading presentation video...</span>
              </div>
            ) : isMissingLocalFile ? (
              /* Informative Device File Missing UI */
              <div className="p-4 sm:p-8 flex flex-col items-center text-center max-w-lg mx-auto select-none">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  Video File Not Available On This Device
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mb-4 max-w-md">
                  This video {report.fileSize ? `(${report.fileSize})` : ""} was uploaded from another computer&apos;s local files. Browser storage cannot automatically transfer local files across devices or phones.
                </p>

                <div className="w-full p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-[11px] text-slate-300 mb-4">
                  <p className="font-bold text-indigo-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    How to make this video play on mobile & worldwide:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Upload your video to <strong className="text-slate-200">YouTube</strong> (Unlisted or Public) or <strong className="text-slate-200">Google Drive</strong> (Anyone with link).</li>
                    <li>Click <strong className="text-indigo-300">Update Video Link</strong> below and paste the link!</li>
                  </ol>
                </div>

                {onUpdateLink && (
                  <button
                    type="button"
                    onClick={() => onUpdateLink(report)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Paste YouTube or Google Drive Link</span>
                  </button>
                )}
              </div>
            ) : playbackError ? (
              /* Playback Error Fallback */
              <div className="p-6 text-center max-w-md mx-auto">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  Playback Error
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Your browser could not decode or play this video format.
                </p>
                {onUpdateLink && (
                  <button
                    type="button"
                    onClick={() => onUpdateLink(report)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Update Video URL</span>
                  </button>
                )}
              </div>
            ) : youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={report.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : googleDriveEmbedUrl ? (
              <iframe
                src={googleDriveEmbedUrl}
                title={report.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : resolvedUrl ? (
              <video
                key={resolvedUrl}
                src={resolvedUrl}
                controls
                playsInline
                onError={() => setPlaybackError(true)}
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-6 text-slate-400 text-xs">
                Video source was not found. Please upload or link the video again.
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="px-5 sm:px-6 py-4 border-t border-slate-800/80 bg-slate-950/70 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <p className="line-clamp-2 max-w-xl text-slate-300 text-xs leading-relaxed break-words [overflow-wrap:anywhere]">
              {report.description}
            </p>
            <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {report.instructor.toLowerCase().startsWith("instructor")
                    ? report.instructor
                    : `Instructor: ${report.instructor}`}
                </span>
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
