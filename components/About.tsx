"use client";

import { motion } from "framer-motion";
import {
  User,
  Sparkles,
  BookOpen,
  Users,
  Palette,
  ShieldCheck,
  Heart,
  Compass,
  Laptop,
  GraduationCap,
  Award,
} from "lucide-react";

export default function About() {
  const competencies = [
    {
      name: "Educational Technology",
      desc: "Integrating modern interactive multimedia, digital task sheets, and 3D web environments into elementary classrooms.",
      icon: Laptop,
    },
    {
      name: "Instructional Design",
      desc: "Designing learner-centric lesson structures, digital rubrics, and multisensory visual instructional materials.",
      icon: Compass,
    },
    {
      name: "Elementary Pedagogy",
      desc: "Applying constructivist and inquiry-based teaching methodologies tailored to foundational young learners.",
      icon: BookOpen,
    },
    {
      name: "Classroom Engagement",
      desc: "Fostering active student participation through interactive questions, peer collaboration, and gamified tasks.",
      icon: Users,
    },
    {
      name: "Creative Learning",
      desc: "Empowering children to express understanding through storytelling, visual arts, and multimodal demonstrations.",
      icon: Palette,
    },
    {
      name: "Child Digital Safety",
      desc: "Promoting ethical digital citizenship, safe online exploration, and protective habits in technology-enabled spaces.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="about"
      className="py-24 relative bg-transparent text-slate-900 overflow-hidden scroll-mt-20 border-t border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3 shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            My Journey & Teaching Philosophy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Passionate about transforming early childhood and elementary education through modern digital pedagogy, learner-centered empathy, and creative classroom experiences.
          </motion.p>
        </div>

        {/* Bio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Who I Am</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                I am <strong className="text-slate-950 font-black">Romnick P. Ramacula</strong>, a dedicated Future Elementary Educator and BEEd-2C Scholar at <strong className="text-slate-950 font-black">North Eastern Mindanao State University – Lianga Campus (NEMSU)</strong>, committed to shaping young minds through modern, inclusive, and transformative teaching practices.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Pedagogical Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Proficient in modern pedagogical methodologies, including <strong className="text-slate-950 font-black">Technology for Teaching and Learning (TTL)</strong>, Interactive Digital Pedagogy, Lesson Planning, and Student-Centered Classroom Engagement under <strong className="text-slate-950 font-black">Instructor Kerstan Isaac Requiza</strong>.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Instructor: Kerstan Isaac Requiza</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                TTL Advisor
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">The Classroom Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Skilled in guiding the entire educational journey—from curriculum alignment and learner assessment to collaborative group learning and technology-enabled classrooms, delivering inspiring, equitable, and 21st-century learning experiences.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Academic Mentorship & Instructor Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-0.5">
                <span>Course Instructor & Academic Advisor</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Kerstan Isaac Requiza</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Technology for Teaching and Learning (TTL) • NEMSU - Lianga Campus
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs shrink-0">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>BEEd-2C Coursework</span>
          </div>
        </motion.div>

        {/* Core Teaching Competencies */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500 uppercase font-bold mb-1">
                <span className="w-6 h-[1.5px] bg-slate-400" />
                <span>EXPERTISE & COMPETENCIES</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Pedagogical & Technical Skills
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {competencies.map((comp, idx) => {
              const IconComp = comp.icon;
              return (
                <motion.div
                  key={comp.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-white/85 backdrop-blur-xs border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all shadow-2xs group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-50 border border-slate-200 group-hover:border-indigo-200 flex items-center justify-center text-slate-700 group-hover:text-indigo-600 transition-colors mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {comp.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
