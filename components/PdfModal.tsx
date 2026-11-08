"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  User,
  GraduationCap,
  Maximize2,
  Minimize2,
  AlertCircle,
  Eye,
  Sparkles,
  Smartphone,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Task } from "@/data/tasks";

interface PdfModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function PdfModal({ task, onClose }: PdfModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"google" | "image" | "native">("google");
  const [isLoading, setIsLoading] = useState(true);
  const [fullPdfUrl, setFullPdfUrl] = useState("");

  // Determine absolute PDF URL for Google Docs Viewer
  useEffect(() => {
    if (typeof window !== "undefined" && task?.pdfUrl) {
      if (task.pdfUrl.startsWith("http://") || task.pdfUrl.startsWith("https://")) {
        setFullPdfUrl(task.pdfUrl);
      } else {
        const origin = window.location.origin;
        const path = task.pdfUrl.startsWith("/") ? task.pdfUrl : `/${task.pdfUrl}`;
        setFullPdfUrl(`${origin}${path}`);
      }
    }
  }, [task?.pdfUrl]);

  // Set default viewMode based on device
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        setViewMode("google");
      } else {
        setViewMode("google");
      }
    }
    setIsLoading(true);
  }, [task]);

  // Close on Escape key & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (task) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [task, onClose]);

  // Google Docs Viewer URL
  const googleDocsViewerUrl = useMemo(() => {
    if (!fullPdfUrl) return "";
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
  }, [fullPdfUrl]);

  if (!task || !task.pdfUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullscreen
              ? "h-[98vh] max-w-[98vw]"
              : "h-[92vh] sm:h-[90vh] max-w-5xl"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden mr-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs sm:text-base font-extrabold text-slate-900 truncate">
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <User className="w-3 h-3 text-indigo-600" />
                    {task.student} ({task.section})
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="hidden sm:flex items-center gap-1 text-slate-600">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>
                      {task.instructor.toLowerCase().startsWith("instructor")
                        ? task.instructor
                        : `Instructor: ${task.instructor}`}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Fullscreen Toggle (Desktop) */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden md:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Download */}
              <a
                href={task.pdfUrl}
                download
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                title="Download this PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors ml-0.5 cursor-pointer"
                aria-label="Close PDF Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Viewer Mode Selector Bar (Ensures seamless mobile compatibility) */}
          <div className="px-3.5 sm:px-6 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-2 text-xs shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">
                Mode:
              </span>
              <button
                type="button"
                onClick={() => {
                  setViewMode("google");
                  setIsLoading(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "google"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                }`}
                title="Google Cloud PDF Viewer (Works on 100% of mobile phones & computers)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mobile Cloud View</span>
              </button>

              {task.previewImage && (
                <button
                  type="button"
                  onClick={() => setViewMode("image")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "image"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                  }`}
                  title="Document Page Preview (Instant load, zero delay)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Activity Sheet Image</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewMode("native")}
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "native"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                }`}
                title="Direct Browser PDF Embed"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Native PDF</span>
              </button>
            </div>

            <a
              href={task.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] sm:text-xs flex items-center gap-1 underline underline-offset-2 shrink-0 ml-auto"
            >
              <span>Open raw PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* PDF Viewer Body */}
          <div className="flex-1 w-full h-full bg-slate-900 relative overflow-hidden flex flex-col">
            {/* View Mode 1: Google Docs Mobile Cloud Viewer */}
            {viewMode === "google" && (
              <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
                    <span className="text-xs font-medium">Loading document pages...</span>
                  </div>
                )}
                {googleDocsViewerUrl ? (
                  <iframe
                    key={googleDocsViewerUrl}
                    src={googleDocsViewerUrl}
                    title={task.title}
                    onLoad={() => setIsLoading(false)}
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    Generating preview link...
                  </div>
                )}
              </div>
            )}

            {/* View Mode 2: High-Resolution Activity Sheet Image (Instant Zero-Delay) */}
            {viewMode === "image" && task.previewImage && (
              <div className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-start">
                <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">Learning Activity Sheet Page</span>
                    <a
                      href={task.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Download Full PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={task.previewImage}
                    alt={task.title}
                    className="w-full h-auto object-contain select-none"
                  />
                </div>
              </div>
            )}

            {/* View Mode 3: Native Browser PDF Viewer (Desktop) */}
            {viewMode === "native" && (
              <object
                data={`${task.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                type="application/pdf"
                className="w-full h-full border-0"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 text-white">
                  <FileText className="w-16 h-16 text-indigo-400 mb-4" />
                  <p className="text-sm text-slate-300 mb-2 font-bold">
                    Mobile browser plugin not detected
                  </p>
                  <p className="text-xs text-slate-400 mb-4 max-w-sm">
                    Mobile browsers don&apos;t embed raw PDF plugins directly. Switch to Mobile Cloud View above or open the document directly.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("google")}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                    >
                      Switch to Mobile Cloud View
                    </button>
                    <a
                      href={task.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              </object>
            )}
          </div>

          {/* Bottom helper bar for mobile / quick access */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">
                {viewMode === "google"
                  ? "Powered by Google Docs Cloud Viewer • Works on all phones"
                  : viewMode === "image"
                  ? "Displaying high-resolution activity sheet scan"
                  : "Native browser PDF mode"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={task.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-2 flex items-center gap-1"
              >
                Open directly in new tab &rarr;
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
