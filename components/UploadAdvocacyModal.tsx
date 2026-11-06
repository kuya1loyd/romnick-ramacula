"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Globe, Users, ShieldCheck, Sparkles, Check } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newItem: AdvocacyItem = {
      id: `advocacy-${Date.now()}`,
      title: title.trim(),
      focus: focus.trim(),
      description: description.trim(),
      iconName: selectedIcon,
      date: "November 2026",
    };

    onAddAdvocacy(newItem);
    onClose();

    // Reset
    setTitle("");
    setDescription("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Add Advocacy Initiative
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish an educational advocacy cause or student community campaign
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
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
                        className={`p-2.5 rounded-xl border transition-all ${
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Advocacy</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

