"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Upload, Check, Trash2, CheckCircle2, MapPin, Calendar, Tag, Heart } from "lucide-react";
import { JourneyItem } from "@/data/gallery";
import { saveJourneyRecord } from "@/lib/galleryDb";

interface UploadJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJourney: (item: JourneyItem) => void;
}

const CATEGORIES = [
  "Academic Milestone",
  "Classroom Experience",
  "Field Observation",
  "Teaching Demonstration",
  "Campus Life",
  "Community & Advocacy",
];

// Helper to convert phone / PC photos into optimized persistent base64 Data URLs (max dimension 1400px)
function processImageFile(file: File): Promise<{ photoUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({ photoUrl: e.target?.result as string });
        }

        ctx.drawImage(img, 0, 0, width, height);
        // High quality JPEG data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ photoUrl: dataUrl });
      };
      img.onerror = () => {
        resolve({ photoUrl: e.target?.result as string });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function UploadJourneyModal({
  isOpen,
  onClose,
  onAddJourney,
}: UploadJourneyModalProps) {
  const [title, setTitle] = useState("");
  const [meaning, setMeaning] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Academic Milestone");
  const [date, setDate] = useState("November 2026");
  const [location, setLocation] = useState("NEMSU - Lianga Campus");

  // Image State
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSizeStr, setFileSizeStr] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Photo Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);

    const sizeInMb = file.size / (1024 * 1024);
    const sizeStr = sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    setFileSizeStr(sizeStr);

    try {
      const processed = await processImageFile(file);
      setPhotoDataUrl(processed.photoUrl);

      // Auto-fill title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl("");
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !meaning.trim() || !photoDataUrl) return;

    const journeyId = `journey-${Date.now()}`;

    const newItem: JourneyItem = {
      id: journeyId,
      title: title.trim(),
      meaning: meaning.trim(),
      description: description.trim() || meaning.trim(),
      date: date.trim() || "November 2026",
      location: location.trim() || "NEMSU - Lianga Campus",
      tag: tag || "Academic Milestone",
      photoUrl: photoDataUrl,
      createdAt: Date.now(),
    };

    // Save directly to IndexedDB (completely persistent across browser exit/refresh)
    await saveJourneyRecord(newItem);

    onAddJourney(newItem);
    onClose();

    // Reset Form state
    setTitle("");
    setMeaning("");
    setDescription("");
    setPhotoDataUrl("");
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm">
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
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Add Journey Photo
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload a milestone photo, share its meaning & reflection
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
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 text-xs flex-1">
                {/* Photo Upload Area */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Picture from your PC or Phone *
                  </label>

                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {photoDataUrl ? (
                    /* Image Selected: Preview Card */
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col gap-3 shadow-xs">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                        <img
                          src={photoDataUrl}
                          alt="Selected preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {fileName || "Photo Ready"}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                              Persistent photo ready • {fileSizeStr}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Remove photo"
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
                      className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-amber-50/30 hover:bg-amber-50/60 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                        Tap or click to browse photos on your PC or phone
                      </p>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Camera roll, phone gallery, screenshots, or PC files
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Photo</span>
                      </button>
                      <p className="text-[10px] text-amber-600 font-medium mt-3">
                        Supports JPG, PNG, WEBP, and HEIC
                      </p>
                    </div>
                  )}
                </div>

                {/* Milestone Title */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Photo Title / Milestone Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lianga Central Elementary School Field Study"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                {/* Meaning & Significance */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Meaning & Significance *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What does this moment mean to you as a future educator?"
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800 text-xs font-medium"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    A short takeaway or inspiring quote explaining the deeper value of this experience.
                  </p>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Category / Milestone Pillar</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTag(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          tag === cat
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description & Reflection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Journal Description & Story
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share what happened, the activities involved, student reactions, and your reflection..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800 text-xs resize-none"
                  />
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date</span>
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="November 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Location / Campus</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="NEMSU - Lianga Campus"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none text-slate-800 text-xs"
                    />
                  </div>
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
                  disabled={!title.trim() || !meaning.trim() || !photoDataUrl || isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Publish to Gallery</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
