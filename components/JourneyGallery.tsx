"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Plus,
  Calendar,
  MapPin,
  Trash2,
  Sparkles,
  Quote,
  Maximize2,
  Heart,
  Tag,
  BookOpen,
} from "lucide-react";
import { JourneyItem, initialJourneyItems } from "@/data/gallery";
import UploadJourneyModal from "./UploadJourneyModal";
import JourneyLightboxModal from "./JourneyLightboxModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getPhotoUrlFromDb, deletePhotoFromDb } from "@/lib/galleryDb";

const FILTER_TAGS = [
  "All",
  "Academic Milestone",
  "Classroom Experience",
  "Field Observation",
  "Teaching Demonstration",
  "Campus Life",
  "Community & Advocacy",
];

export default function JourneyGallery() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItemForLightbox, setSelectedItemForLightbox] = useState<JourneyItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<JourneyItem | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage or initialize with initialJourneyItems
  useEffect(() => {
    try {
      const saved = localStorage.getItem("romnick_journey_gallery");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setHasLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback initial items
    setItems(initialJourneyItems);
    setHasLoaded(true);
  }, []);

  // Save to localStorage when changed
  const saveItems = (updated: JourneyItem[]) => {
    setItems(updated);
    try {
      // Don't store ephemeral blob URLs in localStorage
      const sanitized = updated.map((i) =>
        i.isLocalFile ? { ...i, photoUrl: undefined } : i
      );
      localStorage.setItem("romnick_journey_gallery", JSON.stringify(sanitized));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddJourney = (newItem: JourneyItem) => {
    const updated = [newItem, ...items];
    saveItems(updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
    deletePhotoFromDb(id);
  };

  // Filter items
  const filteredItems =
    selectedTag === "All"
      ? items
      : items.filter((item) => item.tag === selectedTag);

  return (
    <section id="gallery" className="py-24 relative bg-transparent border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>My Journey & Milestones</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Memories, Meaning & Reflections
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            A visual documentation of my teacher education journey at NEMSU — Lianga Campus.
            Explore pictures of academic milestones, classroom experiences, and the personal meaning behind each step.
          </motion.p>

          {/* Upload Button */}
          {hasLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Journey Picture</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-slate-900 text-white shadow-sm scale-105"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  onClick={() => setSelectedItemForLightbox(item)}
                  className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                    <JourneyCardMedia item={item} />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Category Tag (Top-Left) */}
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-bold backdrop-blur-md">
                      {item.tag}
                    </div>

                    {/* Delete Button (Top-Right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(item);
                      }}
                      className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer backdrop-blur-md"
                      title="Delete this journey photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Hover Magnify Prompt */}
                    <div className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>

                    {/* Date Badge (Bottom-Left) */}
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-[11px] font-semibold text-white/90 drop-shadow-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location Indicator */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-3 leading-snug">
                        {item.title}
                      </h3>

                      {/* Meaning Highlight Box */}
                      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-slate-800 mb-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                          <Quote className="w-3 h-3" />
                          <span>Meaning</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 italic line-clamp-2">
                          &ldquo;{item.meaning}&rdquo;
                        </p>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-500">
                        View Full Story
                      </span>
                      <span className="font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read More →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">No Journey Photos Found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              No photos currently under &ldquo;{selectedTag}&rdquo;. Upload a photo to begin your visual journal!
            </p>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Picture</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Journey Modal */}
      <UploadJourneyModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddJourney={handleAddJourney}
      />

      {/* Lightbox Modal */}
      <JourneyLightboxModal
        item={selectedItemForLightbox}
        onClose={() => setSelectedItemForLightbox(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title={itemToDelete?.title || ""}
        itemType="Journey Photo"
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />
    </section>
  );
}

// Media renderer that automatically fetches locally saved blobs from IndexedDB
function JourneyCardMedia({ item }: { item: JourneyItem }) {
  const [liveUrl, setLiveUrl] = useState<string>(item.thumbnail || item.photoUrl || "");

  useEffect(() => {
    let active = true;
    let localBlob = "";

    if (item.isLocalFile) {
      getPhotoUrlFromDb(item.id).then((url) => {
        if (active && url) {
          localBlob = url;
          setLiveUrl(url);
        }
      });
    }

    return () => {
      active = false;
      if (localBlob && localBlob.startsWith("blob:")) {
        URL.revokeObjectURL(localBlob);
      }
    };
  }, [item]);

  return (
    <img
      src={liveUrl || item.thumbnail || item.photoUrl || "/images/profile.jpg"}
      alt={item.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}
