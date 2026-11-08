"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText, ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react";
import { tasksData, Task } from "@/data/tasks";
import TaskCard from "./TaskCard";
import UploadTaskModal from "./UploadTaskModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface TasksSectionProps {
  onViewPdf: (task: Task) => void;
}

export default function TasksSection({ onViewPdf }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load tasks from cloud database API (with localStorage cache fallback)
  useEffect(() => {
    try {
      const savedActive = localStorage.getItem("romnick_active_tasks");
      if (savedActive !== null) {
        const parsed = JSON.parse(savedActive);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch live from Cloud Database
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
          try {
            localStorage.setItem("romnick_active_tasks", JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.error("Cloud DB fetch error:", err));
  }, []);

  const handleAddTask = async (newTask: Task) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    try {
      localStorage.setItem("romnick_active_tasks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Save permanently to Cloud Database
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
    } catch (err) {
      console.error("Cloud DB save error:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    try {
      localStorage.setItem("romnick_active_tasks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Delete permanently from Cloud Database
    try {
      await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Cloud DB delete error:", err);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(tasks.map((t) => t.category));
    return ["All", ...Array.from(cats)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || task.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, selectedCategory]);

  const hoverScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const startHoverScroll = (direction: "left" | "right") => {
    stopHoverScroll();
    handleScroll(direction);
    hoverScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const step = direction === "left" ? -360 : 360;
        scrollContainerRef.current.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 450);
  };

  const stopHoverScroll = () => {
    if (hoverScrollIntervalRef.current) {
      clearInterval(hoverScrollIntervalRef.current);
      hoverScrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopHoverScroll();
  }, []);

  return (
    <section id="my-tasks" className="py-24 relative overflow-hidden bg-transparent border-t border-slate-200">
      {/* Background Subtle Paper Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold mb-3 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Task Gallery</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
          >
            My Tasks & Activity Sheets
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Browse academic tasks, inspect front-page previews of activities and web projects, or upload new submissions.
          </motion.p>

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Upload Task / Activity</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Slider Navigation Arrows */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 focus:border-slate-400 focus:outline-none text-xs text-slate-800 placeholder-slate-400 shadow-xs"
              />
            </div>

            {/* Slider Navigation Buttons (Click or Hover to advance next) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                onMouseEnter={() => startHoverScroll("left")}
                onMouseLeave={stopHoverScroll}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll left (hover to scroll)"
                title="Hover or click to scroll previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                onMouseEnter={() => startHoverScroll("right")}
                onMouseLeave={stopHoverScroll}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs transition-colors cursor-pointer"
                aria-label="Scroll right (hover to scroll)"
                title="Hover or click to scroll next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel with ZERO overlapping & Hover-to-Next side controls */}
        <div className="relative group/deck">
          {/* Floating Left Side Arrow (Hover or click to slide next) */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            onMouseEnter={() => startHoverScroll("left")}
            onMouseLeave={stopHoverScroll}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-slate-900 hover:text-white text-slate-800 shadow-xl border border-slate-200 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Previous card (hover to scroll)"
            title="Hover or click to scroll previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Floating Right Side Arrow (Hover or click to slide next) */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            onMouseEnter={() => startHoverScroll("right")}
            onMouseLeave={stopHoverScroll}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-slate-900 hover:text-white text-slate-800 shadow-xl border border-slate-200 backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Next card (hover to scroll)"
            title="Hover or click to scroll next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="relative w-full overflow-x-auto pb-10 pt-4 px-2 sm:px-6 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredTasks.length > 0 ? (
              /* Non-overlapping clean card layout with proper gap */
              <div className="flex items-stretch justify-start min-w-max px-2 sm:px-4 gap-6 sm:gap-8">
                {filteredTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    total={filteredTasks.length}
                    onViewPdf={onViewPdf}
                    onRequestDelete={(t) => setTaskToDelete(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-md mx-auto">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No tasks found</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try adjusting your search query or selected filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick hint for interaction */}
        <div className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">
          <span>&larr; Hover over arrows to continuously scroll next &rarr;</span>
        </div>
      </div>

      {/* Upload Task Modal */}
      <UploadTaskModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddTask={handleAddTask}
        nextNumber={String(tasks.length + 1).padStart(2, "0")}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        title={taskToDelete?.title || ""}
        itemType="Task / Activity"
        onConfirm={async () => {
          if (taskToDelete) {
            await handleDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onClose={() => setTaskToDelete(null)}
      />
    </section>
  );
}
