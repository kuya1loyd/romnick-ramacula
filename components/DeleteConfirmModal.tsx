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
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      onClose();
    } catch (err) {
      console.error("Failed to delete item:", err);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Slim Top Animated Progress Bar when deleting */}
            {isDeleting && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-100 overflow-hidden z-20">
                <div className="h-full bg-rose-600 animate-pulse w-full"></div>
              </div>
            )}

            {/* Top Close Button */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Warning / Deleting Icon Badge */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 transition-all ${
                isDeleting
                  ? "bg-rose-100 text-rose-600 ring-4 ring-rose-50"
                  : "bg-rose-50 border border-rose-100 text-rose-600 shadow-xs"
              }`}
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-rose-600" />
              ) : (
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>

            {/* Heading & Details */}
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">
              {isDeleting ? "Deleting from Cloud..." : `Delete ${itemType}?`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 sm:mb-6 break-words [overflow-wrap:anywhere]">
              {isDeleting ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Removing &ldquo;{title}&rdquo; permanently from cloud...</span>
                </span>
              ) : (
                <>
                  Are you sure you want to remove{" "}
                  <strong className="text-slate-950 font-bold break-words">
                    &ldquo;{title}&rdquo;
                  </strong>
                  ? This action will permanently remove it from your portfolio and cannot be undone.
                </>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

