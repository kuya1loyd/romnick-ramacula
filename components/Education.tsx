"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  School,
  CheckCircle2,
} from "lucide-react";

export default function Education() {
  const educationTimeline = [
    {
      period: "Aug 2024 – Present",
      degree: "Bachelor of Elementary Education (BEEd-2C)",
      institution: "North Eastern Mindanao State University – Lianga Campus",
      level: "Tertiary / Undergraduate",
      highlight: "Specializing in elementary instruction, early literacy, and Technology for Teaching and Learning (TTL) under Instructor Kerstan Isaac Requiza.",
      status: "Currently Enrolled",
    },
    {
      period: "2022 – 2024",
      degree: "Senior High School (HUMSS)",
      institution: "Humanities & Social Sciences / Education Track",
      level: "Secondary Education",
      highlight: "Built foundational skills in communication, societal engagement, pedagogical observation, and human psychology.",
      status: "Completed",
    },
    {
      period: "2016 – 2022",
      degree: "Elementary Foundations",
      institution: "Basic Primary Education",
      level: "Primary Education",
      highlight: "Nurtured a lifelong passion for classroom leadership, educational development, and elementary teaching.",
      status: "Completed",
    },
  ];

  const coreCoursework = [
    {
      title: "Technology for Teaching and Learning (TTL)",
      desc: "Digital classroom workflows, multimedia integration, interactive presentation tools, and web-based task environments.",
    },
    {
      title: "Facilitating Learner-Centered Teaching",
      desc: "Constructivist principles, active engagement methodologies, dynamic grouping, and diverse learner differentiation.",
    },
    {
      title: "Assessment in Elementary Learning",
      desc: "Formative and summative assessment designs, authentic rubrics, portfolio evaluation, and feedback mechanisms.",
    },
    {
      title: "Instructional Material Design & Production",
      desc: "Crafting tactile, printed, and digital instructional materials to optimize learning retention in elementary classrooms.",
    },
  ];

  return (
    <section
      id="education"
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
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Education & Academic Milestones
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Comprehensive academic journey and teacher education training at North Eastern Mindanao State University – Lianga Campus (NEMSU).
          </motion.p>
        </div>

        {/* Featured Program Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Primary Academic Focus</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Bachelor of Elementary Education (BEEd)
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-600 mt-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                  Section BEEd-2C
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  NEMSU – Lianga Campus
                </span>
                <span>•</span>
                <span className="text-indigo-600 font-bold">
                  Instructor: Kerstan Isaac Requiza
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md self-start md:self-auto">
              <Calendar className="w-4 h-4" />
              <span>Current Academic Year</span>
            </div>
          </div>

          {/* Key Coursework Focus Grid */}
          <div className="mt-8">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Core Coursework & Specialized Competencies</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreCoursework.map((course, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                        {course.title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {course.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Complete Academic Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-slate-500 uppercase font-bold mb-1">
              <span className="w-6 h-[1.5px] bg-slate-400" />
              <span>TIMELINE</span>
              <span className="w-6 h-[1.5px] bg-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Academic Progression
            </h3>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-10 border-l-2 border-slate-200">
            {educationTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group bg-white/85 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all ml-2"
              >
                {/* Circle dot on timeline */}
                <div className="absolute -left-[37px] sm:-left-[45px] top-6 w-4 h-4 rounded-full border-2 border-slate-400 bg-white group-hover:border-indigo-600 group-hover:scale-125 transition-all shadow-xs" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="text-xs font-mono text-indigo-600 font-bold">
                    {item.period}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
                    {item.status}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {item.degree}
                </h4>

                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.institution}</span>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {item.highlight}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
