"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Task } from "@/data/tasks";

interface PdfModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function PdfModal({ task, onClose }: PdfModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close on Escape key
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

  if (!task || !task.pdfUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm"
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
              : "h-[90vh] max-w-5xl"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3 overflow-hidden mr-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
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
            <div className="flex items-center gap-2 shrink-0">
              {/* Dedicated Preview Page */}
              <a
                href={`/tasks/preview?file=${encodeURIComponent(task.pdfUrl || "")}&title=${encodeURIComponent(
                  task.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                title="Open in Dedicated Preview Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Dedicated Page</span>
              </a>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
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
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all"
                title="Download this PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
              </a>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors ml-1"
                aria-label="Close PDF Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div className="flex-1 w-full h-full bg-slate-900 relative overflow-hidden">
            <object
              data={`${task.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
              type="application/pdf"
              className="w-full h-full border-0"
            >
              <iframe
                src={`${task.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                title={task.title}
                className="w-full h-full border-0"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900 text-white">
                  <FileText className="w-16 h-16 text-indigo-400 mb-4" />
                  <p className="text-sm text-slate-300 mb-4">
                    Your browser does not support inline PDF viewing.
                  </p>
                  <a
                    href={task.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
                  >
                    Open PDF Document
                  </a>
                </div>
              </iframe>
            </object>
          </div>

          {/* Bottom helper bar for mobile / quick access */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Official PDF:{" "}
                <code className="text-slate-900 font-semibold">{task.pdfUrl}</code>
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
