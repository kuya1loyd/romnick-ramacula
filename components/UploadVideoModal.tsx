"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Upload, Link as LinkIcon, Check, Film, Smartphone, Monitor, Trash2, CheckCircle2 } from "lucide-react";
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
  thumbnail?: string;
}

// Generate thumbnail snapshot from video file
function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 480;
          canvas.height = 270;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, 480, 270);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } catch {
          URL.revokeObjectURL(url);
          resolve("");
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("");
      };

      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve("");
      }, 2500);
    } catch {
      resolve("");
    }
  });
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
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");

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

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle Video File Selection from PC or Cellphone
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant object URL - 0ms delay, no memory freeze!
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
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

    // Automatically generate first-frame thumbnail for cover display
    generateVideoThumbnail(file).then((thumb) => {
      if (thumb) setThumbnail(thumb);
    });
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setFileName("");
    setFileSizeStr("");
    setThumbnail("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const reportId = `video-${Date.now()}`;

    // If a device file was selected, persist the actual File object to IndexedDB
    if (sourceType === "device" && selectedFile) {
      await saveVideoToDb(reportId, selectedFile);
    }

    const newReport: VideoReportItem = {
      id: reportId,
      title: title.trim(),
      subject: subject.trim(),
      duration: duration.trim() || (sourceType === "device" ? "Uploaded Video" : "Video Presentation"),
      date: date.trim(),
      instructor: instructor.trim() || "Kerstan Isaac Requiza",
      description: description.trim() || "Uploaded academic video presentation.",
      // For local files, keep the active blob URL for instant in-session playback
      videoUrl: sourceType === "device" ? previewUrl : videoUrl.trim() || undefined,
      fileName: sourceType === "device" ? fileName : undefined,
      fileSize: sourceType === "device" ? fileSizeStr : undefined,
      isLocalFile: sourceType === "device",
      thumbnail: thumbnail || undefined,
    };

    onAddVideo(newReport);
    onClose();

    // Reset Form state without revoking the newly submitted object URL
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setSelectedFile(null);
    setPreviewUrl("");
    setFileName("");
    setFileSizeStr("");
    setThumbnail("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
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

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile && previewUrl ? (
                      /* File Selected: Instant Video Preview Player + File Badge */
                      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col gap-3 shadow-xs">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                          <video
                            src={previewUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-indigo-100">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {fileName}
                              </p>
                              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                Video ready for upload • {fileSizeStr}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Remove video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / Tap to Choose Box */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition-all cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                          <Film className="w-7 h-7" />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                          Tap or click to browse files on your PC or phone
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-2 mb-3">
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3.5 h-3.5 text-slate-400" /> PC Files
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Phone Gallery / Videos
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Video File</span>
                        </button>
                        <p className="text-[10px] text-indigo-500 font-medium mt-3">
                          Supports MP4, MOV, WebM, and other camera video formats
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
                  disabled={sourceType === "device" && !selectedFile}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
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
