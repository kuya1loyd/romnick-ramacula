"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Globe, Users, ShieldCheck, Sparkles, Check, Loader2 } from "lucide-react";

export interface AdvocacyItem {
  id: string;
  title: string;
  focus: string;
  description: string;
  iconName: "Globe" | "Heart" | "Users" | "ShieldCheck" | "Sparkles";
  date?: string;
}

interface UploadAdvocacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdvocacy: (item: AdvocacyItem) => void;
}

const ICONS = [
  { name: "Heart", Icon: Heart },
  { name: "Globe", Icon: Globe },
  { name: "Users", Icon: Users },
  { name: "ShieldCheck", Icon: ShieldCheck },
  { name: "Sparkles", Icon: Sparkles },
] as const;

export default function UploadAdvocacyModal({
  isOpen,
  onClose,
  onAddAdvocacy,
}: UploadAdvocacyModalProps) {
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("Accessible Learning");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<AdvocacyItem["iconName"]>("Heart");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!title.trim() || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newItem: AdvocacyItem = {
        id: `advocacy-${Date.now()}`,
        title: title.trim(),
        focus: focus.trim(),
        description: description.trim(),
        iconName: selectedIcon,
        date: "November 2026",
      };

      await Promise.all([
        Promise.resolve(onAddAdvocacy(newItem)),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      onClose();

      // Reset
      setTitle("");
      setDescription("");
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
            {/* Active Saving / Uploading Overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3.5 p-6 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900">Saving Advocacy to Cloud...</p>
                  <p className="text-xs text-slate-500 mt-0.5">Please wait while your initiative is synced</p>
                </div>
              </div>
            )}
            {/* Header (Always Visible at Top) */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Add Advocacy Initiative
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Publish an educational advocacy cause or student community campaign
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
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Advocacy Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Digital Inclusivity in Rural Elementary Classrooms"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Focus Area / Pillar
                  </label>
                  <input
                    type="text"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    placeholder="e.g. Accessible Learning / Safe Cyber Habits"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Symbol Icon
                  </label>
                  <div className="flex items-center gap-2">
                    {ICONS.map((item) => {
                      const IconComp = item.Icon;
                      const isSelected = selectedIcon === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedIcon(item.name as any)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-rose-50 border-rose-500 text-rose-600 scale-105 shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Advocacy Statement & Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the initiative, key goals, and impact on elementary learners..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none text-slate-800 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Fixed Footer */}
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
                      <span>Publish Advocacy</span>
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

