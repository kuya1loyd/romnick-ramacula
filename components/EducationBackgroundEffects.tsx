"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Compass,
  Palette,
  Award,
  Pencil,
  Smile,
  Send,
} from "lucide-react";

export default function EducationBackgroundEffects() {
  // Elementary Education themed floating colorful elements
  // Layered in the background (z-0) behind all content (z-10)
  const floatingIcons = [
    { Icon: BookOpen, left: "4%", top: "8%", size: 36, duration: 14, delay: 0, color: "text-indigo-500" },
    { Icon: GraduationCap, left: "91%", top: "12%", size: 40, duration: 18, delay: 1, color: "text-slate-600" },
    { Icon: Pencil, left: "7%", top: "28%", size: 32, duration: 16, delay: 2, color: "text-amber-500" },
    { Icon: Sparkles, left: "88%", top: "30%", size: 34, duration: 12, delay: 0.5, color: "text-yellow-500" },
    { Icon: Lightbulb, left: "3%", top: "48%", size: 34, duration: 15, delay: 1.5, color: "text-amber-400" },
    { Icon: Send, left: "92%", top: "50%", size: 30, duration: 19, delay: 3, color: "text-sky-500" },
    { Icon: Palette, left: "6%", top: "68%", size: 34, duration: 17, delay: 0.8, color: "text-rose-500" },
    { Icon: Compass, left: "89%", top: "70%", size: 32, duration: 21, delay: 2.2, color: "text-emerald-500" },
    { Icon: Award, left: "4%", top: "88%", size: 36, duration: 16, delay: 1.2, color: "text-purple-500" },
    { Icon: Smile, left: "92%", top: "89%", size: 32, duration: 14, delay: 2.7, color: "text-pink-500" },
  ];

  // Floating Elementary Classroom Badges
  const badges = [
    { text: "A B C", left: "12%", top: "18%", rot: -10, duration: 14, delay: 0 },
    { text: "1 + 2 = 3", left: "82%", top: "22%", rot: 8, duration: 16, delay: 1.5 },
    { text: "BEEd-2C", left: "10%", top: "40%", rot: -6, duration: 18, delay: 2 },
    { text: "★ LEARN", left: "84%", top: "62%", rot: 12, duration: 15, delay: 0.5 },
    { text: "TEACH ♥", left: "11%", top: "78%", rot: -8, duration: 17, delay: 2.5 },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. School Notebook Dot Grid Paper Pattern across the entire screen */}
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1.4px, transparent 1.4px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 2. Soft Animated Pastel Orbs Glowing in the Background */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-200/60 to-purple-200/40 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-gradient-to-tr from-amber-200/60 to-yellow-100/50 rounded-full blur-[110px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-1/4 w-[480px] h-[480px] bg-gradient-to-tr from-sky-200/60 to-emerald-100/50 rounded-full blur-[120px]"
      />

      {/* 3. Floating Animated Learning Icons (Visible on all screens, behind text at z-0) */}
      {floatingIcons.map((item, idx) => {
        const IconComp = item.Icon;
        return (
          <motion.div
            key={`icon-${idx}`}
            style={{
              position: "absolute",
              left: item.left,
              top: item.top,
            }}
            animate={{
              y: [0, -25, 6, 0],
              x: [0, 12, -8, 0],
              rotate: [0, 12, -12, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            className={`opacity-60 drop-shadow-sm ${item.color} hidden md:block`}
          >
            <div className="p-2.5 rounded-2xl bg-white/60 border border-slate-200/70 shadow-sm">
              <IconComp size={item.size} strokeWidth={2.2} />
            </div>
          </motion.div>
        );
      })}

      {/* 4. Floating Classroom Motifs & Badges */}
      {badges.map((badge, idx) => (
        <motion.div
          key={`badge-${idx}`}
          style={{
            position: "absolute",
            left: badge.left,
            top: badge.top,
          }}
          animate={{
            y: [0, -20, 8, 0],
            rotate: [badge.rot, badge.rot + 8, badge.rot - 8, badge.rot],
          }}
          transition={{
            duration: badge.duration,
            repeat: Infinity,
            delay: badge.delay,
            ease: "easeInOut",
          }}
          className="opacity-60 px-3.5 py-1.5 rounded-full border border-slate-300 bg-white/70 font-mono text-xs font-black text-slate-800 tracking-wider shadow-xs hidden md:block"
        >
          {badge.text}
        </motion.div>
      ))}

      {/* 5. Continuous Rising Learning Particles */}
      <div className="absolute inset-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full border border-indigo-300/60 bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-amber-200/40 hidden sm:block"
            style={{
              width: 12 + (i % 4) * 8,
              height: 12 + (i % 4) * 8,
              left: `${5 + i * 7}%`,
              bottom: "-40px",
            }}
            animate={{
              y: ["0vh", "-115vh"],
              x: [0, (i % 2 === 0 ? 1 : -1) * 35, 0],
              opacity: [0, 0.7, 0.5, 0],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              delay: i * 1.8,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
