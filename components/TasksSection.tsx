"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText, ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react";
import { tasksData, Task } from "@/data/tasks";
import TaskCard from "./TaskCard";
import UploadTaskModal from "./UploadTaskModal";

interface TasksSectionProps {
  onViewPdf: (task: Task) => void;
}

export default function TasksSection({ onViewPdf }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load tasks from localStorage (defaults to tasksData on first visit)
  useEffect(() => {
    try {
      const savedActive = localStorage.getItem("romnick_active_tasks");
      if (savedActive !== null) {
        const parsed = JSON.parse(savedActive);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          return;
        }
      }
      // Migrate from previous key if present
      const oldSaved = localStorage.getItem("romnick_user_tasks");
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [...tasksData, ...parsed];
          setTasks(combined);
          localStorage.setItem("romnick_active_tasks", JSON.stringify(combined));
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddTask = (newTask: Task) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    try {
      localStorage.setItem("romnick_active_tasks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    try {
      localStorage.setItem("romnick_active_tasks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
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

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

            {/* Slider Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => handleScroll("left")}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Overlapping Deck with Slide-in from Left Animation */}
        <div
          ref={scrollContainerRef}
          className="relative w-full overflow-x-auto pb-14 pt-8 px-2 sm:px-6 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {filteredTasks.length > 0 ? (
            <div className="flex items-center justify-start lg:justify-center min-w-max pl-4 pr-16 -space-x-12 sm:-space-x-16 md:-space-x-20">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  total={filteredTasks.length}
                  onViewPdf={onViewPdf}
                  onDelete={handleDeleteTask}
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

        {/* Quick hint for interaction */}
        <div className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">
          <span>&larr; Scroll or hover over cards to expand from deck &rarr;</span>
        </div>
      </div>

      {/* Upload Task Modal */}
      <UploadTaskModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddTask={handleAddTask}
        nextNumber={String(tasks.length + 1).padStart(2, "0")}
      />
    </section>
  );
}
