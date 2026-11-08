"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Globe, Check, Sparkles, Loader2 } from "lucide-react";
import { Task } from "@/data/tasks";

interface UploadTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
  nextNumber: string;
}

const PASTEL_COLORS = [
  {
    name: "Sky Blue",
    bg: "bg-[#E0F2FE]",
    border: "border-[#7DD3FC]/90",
    badgeBg: "bg-sky-100",
    text: "text-sky-950",
    btnHover: "hover:bg-sky-200",
  },
  {
    name: "Warm Peach",
    bg: "bg-[#FFEDD5]",
    border: "border-[#FDBA74]/90",
    badgeBg: "bg-orange-100",
    text: "text-orange-950",
    btnHover: "hover:bg-orange-200",
  },
  {
    name: "Mint Green",
    bg: "bg-[#DCFCE7]",
    border: "border-[#86EFAC]/90",
    badgeBg: "bg-emerald-100",
    text: "text-emerald-950",
    btnHover: "hover:bg-emerald-200",
  },
  {
    name: "Lavender",
    bg: "bg-[#F3E8FF]",
    border: "border-[#D8B4FE]/90",
    badgeBg: "bg-purple-100",
    text: "text-purple-950",
    btnHover: "hover:bg-purple-200",
  },
  {
    name: "Soft Pink",
    bg: "bg-[#FFE4E6]",
    border: "border-[#FDA4AF]/90",
    badgeBg: "bg-rose-100",
    text: "text-rose-950",
    btnHover: "hover:bg-rose-200",
  },
  {
    name: "Sunlight Yellow",
    bg: "bg-[#FEF9C3]",
    border: "border-[#FDE047]/90",
    badgeBg: "bg-amber-100",
    text: "text-amber-950",
    btnHover: "hover:bg-amber-200",
  },
];

export default function UploadTaskModal({
  isOpen,
  onClose,
  onAddTask,
  nextNumber,
}: UploadTaskModalProps) {
  const [taskType, setTaskType] = useState<"pdf" | "web">("pdf");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("School Activity / Learning Activity Sheet");
  const [subject, setSubject] = useState("Technology for Teaching and Learning");
  const [instructor, setInstructor] = useState("Kerstan Isaac Requiza");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
  const [fileName, setFileName] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileSizeStr, setFileSizeStr] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSizeStr(`${Math.round(file.size / 1024)} KB`);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        number: nextNumber,
        title: title.trim(),
        student: "Romnick P. Ramacula",
        section: "BEEd-2C",
        campus: "NEMSU - Lianga Campus",
        instructor: instructor.trim() || "Kerstan Isaac Requiza",
        category,
        subject: subject.trim(),
        description: description.trim() || "Uploaded academic coursework and activity.",
        pdfUrl: taskType === "pdf" ? (fileDataUrl || undefined) : undefined,
        projectUrl: taskType === "web" ? projectUrl.trim() : undefined,
        isExternalLink: taskType === "web",
        uploadDate: "November 2026",
        fileSize: fileSizeStr || undefined,
        tags: ["BEEd-2C", "NEMSU", subject.slice(0, 8)],
        cardColor: selectedColor,
        // Only use user's uploaded cover image if provided; otherwise undefined so it renders dynamic custom document card
        previewImage: coverImage || undefined,
      };

      await onAddTask(newTask);
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      setProjectUrl("");
      setFileName("");
      setFileDataUrl("");
      setCoverImage("");
      setCoverFileName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh] overflow-hidden"
          >
            {/* Header (Always Visible at Top) */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Upload New Task or Activity
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Assigned as Task #{nextNumber} • BEEd-2C Portfolio
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
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              {/* Scrollable Form Body (Smooth scrolling, never stuck) */}
              <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 text-xs flex-1">
                {/* Type Switcher */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Submission Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTaskType("pdf")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        taskType === "pdf"
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>PDF Activity Sheet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType("web")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        taskType === "web"
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website / Web 3D App</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Task / Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technology for Teaching and Learning Activity Sheet 2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                {/* Category & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs bg-white"
                    >
                      <option>School Activity / Learning Activity Sheet</option>
                      <option>Interactive 3D Web Application / ICT Project</option>
                      <option>Lesson Plan & Instructional Design</option>
                      <option>Pedagogical Demonstration & Reflection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Technology for Teaching and Learning"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* Conditional File Upload or Web Link */}
                {taskType === "pdf" ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Select PDF Document
                    </label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-700">
                        {fileName ? fileName : "Click or drag your PDF here"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {fileSizeStr ? `Size: ${fileSizeStr}` : "Supports PDF files up to 25MB"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Website URL *
                    </label>
                    <input
                      type="url"
                      required={taskType === "web"}
                      placeholder="https://your-project.vercel.app"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                )}

                {/* Cover Preview / Front Page Screenshot (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Front Page Cover Screenshot (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-3 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 flex items-center justify-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {coverImage ? (
                      <div className="flex items-center gap-3 py-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverImage}
                          alt="Front page preview"
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[220px]">
                            {coverFileName}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-semibold">
                            Custom front page image uploaded
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <p className="text-xs font-bold text-slate-700">
                          Upload screenshot or cover image (PNG, JPG)
                        </p>
                        <p className="text-[10px] text-slate-400">
                          If omitted, an icon card with your task title will be generated
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructor & Campus */}
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
                      Campus
                    </label>
                    <input
                      type="text"
                      disabled
                      value="NEMSU - LIANGA CAMPUS"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description / Overview
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief summary of the activity or project..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800 text-xs resize-none"
                  />
                </div>

                {/* Pastel Color Scheme Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Card Pastel Color Scheme
                  </label>
                  <div className="flex items-center gap-2">
                    {PASTEL_COLORS.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${col.bg} ${
                          selectedColor.name === col.name
                            ? "border-slate-900 scale-110 shadow-sm"
                            : "border-slate-300 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Footer (Always Visible at Bottom) */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-700 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Publish Task Card</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

