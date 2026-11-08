"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemType?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemType = "item",
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Close on Escape key (disabled while deleting)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isDeleting, onClose]);

  // Reset isDeleting when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await Promise.all([
        Promise.resolve(onConfirm()),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
      onClose();
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Prominent Active Deleting Overlay */}
            {isDeleting && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3.5 p-6 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900">Deleting from Cloud Database...</p>
                  <p className="text-xs text-slate-500 mt-0.5">Please wait while changes sync</p>
                </div>
              </div>
            )}

            {/* Top Close Button */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-5 shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            {/* Heading & Details */}
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              Delete {itemType}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Are you sure you want to remove{" "}
              <strong className="text-slate-950 font-bold break-words">
                &ldquo;{title}&rdquo;
              </strong>
              ? This action will permanently remove it from your portfolio and cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

