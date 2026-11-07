"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Globe, Users, ShieldCheck, Sparkles, Plus, Trash2, Megaphone } from "lucide-react";
import UploadAdvocacyModal, { AdvocacyItem } from "./UploadAdvocacyModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const ICON_MAP = {
  Heart,
  Globe,
  Users,
  ShieldCheck,
  Sparkles,
};

export default function Advocacy() {
  const [advocacies, setAdvocacies] = useState<AdvocacyItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [advocacyToDelete, setAdvocacyToDelete] = useState<AdvocacyItem | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("romnick_advocacies");
      if (saved) {
        setAdvocacies(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    setHasLoaded(true);
  }, []);

  const handleAddAdvocacy = (newItem: AdvocacyItem) => {
    const updated = [newItem, ...advocacies];
    setAdvocacies(updated);
    try {
      localStorage.setItem("romnick_advocacies", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string) => {
    const updated = advocacies.filter((item) => item.id !== id);
    setAdvocacies(updated);
    try {
      localStorage.setItem("romnick_advocacies", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="advocacy" className="py-20 relative bg-transparent border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3 shadow-xs"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Passions & Initiatives</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            My Educational Advocacy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Advocacy projects, educational causes, and initiatives aimed at shaping modern, humane, and tech-empowered education for young elementary learners.
          </motion.p>

          {/* Action Add Button (Only shown when items exist to prevent duplicate buttons) */}
          {hasLoaded && advocacies.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Advocacy Initiative</span>
              </button>
            </div>
          )}
        </div>

        {/* Advocacy List Grid or Clean Empty State */}
        {hasLoaded && advocacies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advocacies.map((item, index) => {
              const IconComp = ICON_MAP[item.iconName] || Heart;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-rose-400 transition-all flex flex-col justify-between group relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-105 group-hover:bg-rose-100 transition-all">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <button
                        onClick={() => setAdvocacyToDelete(item)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Advocacy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                      {item.focus}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {item.date && (
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                      Published {item.date}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Clean Inviting Empty State (No Dummy Items) */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto shadow-xs"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              No Advocacy Initiatives Added Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Click below to publish your elementary education advocacies, child safety programs, or pedagogical campaigns.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Advocacy Initiative</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Upload Advocacy Modal */}
      <UploadAdvocacyModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddAdvocacy={handleAddAdvocacy}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!advocacyToDelete}
        title={advocacyToDelete?.title || ""}
        itemType="Advocacy Initiative"
        onConfirm={() => {
          if (advocacyToDelete) {
            handleDelete(advocacyToDelete.id);
            setAdvocacyToDelete(null);
          }
        }}
        onClose={() => setAdvocacyToDelete(null)}
      />
    </section>
  );
}
