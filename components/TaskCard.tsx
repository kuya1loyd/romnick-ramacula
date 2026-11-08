"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Download,
  Calendar,
  ExternalLink,
  ArrowUpRight,
  Globe,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { Task } from "@/data/tasks";

interface TaskCardProps {
  task: Task;
  index: number;
  total: number;
  onViewPdf: (task: Task) => void;
  onRequestDelete?: (task: Task) => void;
}

export default function TaskCard({
  task,
  index,
  total,
  onViewPdf,
  onRequestDelete,
}: TaskCardProps) {
  return (
    <motion.div
      data-task-card
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className={`relative shrink-0 snap-center sm:snap-start w-[275px] min-[360px]:w-[295px] sm:w-[320px] md:w-[340px] h-[500px] sm:h-[560px] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 ${task.cardColor.bg} ${task.cardColor.border}`}
    >
      {/* Top Preview Card (Showing Real Front Page Preview of Website & PDF) */}
      <div>
        <div className="relative w-full aspect-[4/3] bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden mb-5 group/box">
          {/* Number Tag in Top Left (e.g. 01, 02) */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold tracking-wider z-20 shadow-md">
            {task.number}
          </div>

          {/* Type Badge */}
          <div className="absolute top-2.5 left-12 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold z-20 shadow-xs border border-slate-200">
            {task.isExternalLink ? "Web 3D" : "PDF Doc"}
          </div>

          {/* Delete Button (Opens Confirmation Modal) */}
          {onRequestDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(task);
              }}
              className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-white/95 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-sm transition-colors cursor-pointer border border-slate-200/80"
              title="Delete this task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Actual Front Page Image Preview */}
          {task.previewImage ? (
            <div className="relative w-full h-full overflow-hidden bg-slate-100">
              <Image
                src={task.previewImage}
                alt={`${task.title} front page preview`}
                fill
                unoptimized={task.previewImage.startsWith("data:")}
                sizes="(max-width: 768px) 300px, 350px"
                className={`transition-transform duration-500 group-hover/box:scale-105 ${
                  task.isExternalLink
                    ? "object-cover object-center"
                    : "object-cover object-top"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ) : (
            /* Fallback Icon Artwork with Dynamic Title & Subject */
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center mb-2.5 group-hover/box:scale-110 group-hover/box:rotate-2 transition-transform duration-300 shadow-xs">
                {task.isExternalLink ? (
                  <Globe className="w-7 h-7 text-sky-600" />
                ) : (
                  <FileText className="w-7 h-7 text-indigo-600" />
                )}
              </div>
              <div className="text-xs font-black text-slate-900 tracking-tight line-clamp-2 px-2 mb-1">
                {task.title}
              </div>
              <div className="text-[10px] text-slate-500 font-bold line-clamp-1">
                {task.subject || task.category}
              </div>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3
          className={`text-base sm:text-lg font-black leading-snug line-clamp-2 mb-2 break-words [overflow-wrap:anywhere] ${task.cardColor.text}`}
        >
          {task.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal break-words [overflow-wrap:anywhere]">
          {task.description}
        </p>
      </div>

      {/* Bottom Metadata & Action Buttons */}
      <div className="pt-3 border-t border-black/5 flex flex-col gap-3">
        {/* Instructor & Date info */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate max-w-[210px]">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">
              {task.instructor.toLowerCase().startsWith("instructor")
                ? task.instructor
                : `Instructor: ${task.instructor}`}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-slate-500 font-medium">{task.uploadDate}</span>
        </div>

        {/* Action Button: VISIT WEBSITE ↗ or VIEW PDF ↗ */}
        <div className="flex items-center gap-2">
          {task.isExternalLink && task.projectUrl ? (
            <a
              href={task.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>VISIT WEBSITE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <>
              <button
                onClick={() => onViewPdf(task)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>VIEW PDF</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {task.pdfUrl && (
                <a
                  href={task.pdfUrl}
                  download
                  className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 hover:text-black border border-black/10 transition-colors shadow-xs"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
