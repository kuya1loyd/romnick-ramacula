"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Upload, Link as LinkIcon, Check, Film, Smartphone, Monitor, Trash2 } from "lucide-react";
import { saveVideoToDb } from "@/lib/videoDb";

export interface VideoReportItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  description: string;
  instructor: string;
  videoUrl?: string;
  fileName?: string;
  fileSize?: string;
  isLocalFile?: boolean;
}

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (report: VideoReportItem) => void;
}

export default function UploadVideoModal({
  isOpen,
  onClose,
  onAddVideo,
}: UploadVideoModalProps) {
  // Input Method: "device" (from PC / Phone) or "link" (URL)
  const [sourceType, setSourceType] = useState<"device" | "link">("device");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("TTL Coursework");
  const [duration, setDuration] = useState("Video Presentation");
  const [videoUrl, setVideoUrl] = useState("");
  const [instructor, setInstructor] = useState("Kerstan Isaac Requiza");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("November 2026");

  // Device File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lock background scroll & handle escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle Video File Selection from PC or Cellphone
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);

    // Format size (MB / KB)
    const sizeInMb = file.size / (1024 * 1024);
    const sizeStr = sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setFileSizeStr(sizeStr);

    // Auto-fill Title if empty based on file name (clean name without extension)
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }

    // Read as Data URL for playback and offline storage
    setIsLoadingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
      setIsLoadingFile(false);
    };
    reader.onerror = () => {
      setIsLoadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDataUrl("");
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const reportId = `video-${Date.now()}`;
    const effectiveVideoUrl = sourceType === "device" ? fileDataUrl : videoUrl.trim();

    // If a device file was selected, persist to IndexedDB for reliable offline storage
    if (sourceType === "device" && fileDataUrl) {
      await saveVideoToDb(reportId, fileDataUrl);
    }

    const newReport: VideoReportItem = {
      id: reportId,
      title: title.trim(),
      subject: subject.trim(),
      duration: duration.trim() || (sourceType === "device" ? "Uploaded Video" : "Video Presentation"),
      date: date.trim(),
      instructor: instructor.trim() || "Kerstan Isaac Requiza",
      description: description.trim() || "Uploaded academic video presentation.",
      videoUrl: effectiveVideoUrl || undefined,
      fileName: sourceType === "device" ? fileName : undefined,
      fileSize: sourceType === "device" ? fileSizeStr : undefined,
      isLocalFile: sourceType === "device",
    };

    onAddVideo(newReport);
    onClose();

    // Reset Form
    setTitle("");
    setDescription("");
    setVideoUrl("");
    handleRemoveFile();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden"
          >
            {/* Header (Always Visible at Top) */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Upload Video Report
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload from your PC/phone or paste a video link
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 text-xs flex-1">
                {/* Method Selector: From PC/Phone vs Video Link */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Video Source
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSourceType("device")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        sourceType === "device"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>From PC / Phone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceType("link")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        sourceType === "link"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Web Link / URL</span>
                    </button>
                  </div>
                </div>

                {/* Device Video File Upload Area */}
                {sourceType === "device" ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Video File from your PC or Cellphone *
                    </label>

                    {fileDataUrl ? (
                      /* File Selected Card with Mini Video Preview */
                      <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col gap-3">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                          <video
                            src={fileDataUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {fileName}
                            </p>
                            <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                              Ready to upload • {fileSizeStr}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer shrink-0"
                            title="Remove and pick another video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / Tap to Choose Box */
                      <div className="relative border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-5 text-center bg-indigo-50/20 hover:bg-indigo-50/40 transition-all cursor-pointer group">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v,video/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                          <Film className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          {isLoadingFile ? "Reading video file..." : "Tap or click to browse files on your PC or phone"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-2">
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-slate-400" /> PC Files
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-slate-400" /> Phone Gallery / Videos
                          </span>
                        </p>
                        <p className="text-[10px] text-indigo-500 font-medium mt-1.5">
                          Supports MP4, MOV, WebM, and other video formats
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Web Link URL Input */
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Video URL (YouTube, Vimeo, Drive, or MP4 Link) *
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or Google Drive link"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Video Presentation Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Student-Led Video Presentation on 21st-Century Pedagogies"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                {/* Subject & Type/Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject / Course
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Technology for Teaching and Learning"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Duration / Tag
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 5:20 min or Teaching Demonstration"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* Instructor & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Presentation Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summary of presentation objectives and topics covered..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingFile || (sourceType === "device" && !fileDataUrl && !title)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Publish Video Report</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
