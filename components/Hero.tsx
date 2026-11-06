"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowDown, ExternalLink } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-24 pb-12 sm:pt-28 md:pt-32 md:pb-16 flex flex-col justify-between overflow-hidden bg-transparent select-none"
    >
      {/* Soft Ambient Radial Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-indigo-50/70 via-purple-50/40 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Headline & Framed Picture Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Full Headline in ONE single continuous horizontal line (100% visible, not covered) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 md:gap-x-6 text-center select-none w-full"
        >
          {/* ROMNICK (Outlined) */}
          <span className="text-outline text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight uppercase leading-none whitespace-nowrap">
            ROMNICK
          </span>
          {/* RAMACULA (Solid) */}
          <span className="text-slate-900 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight uppercase leading-none whitespace-nowrap">
            RAMACULA
          </span>
        </motion.div>

        {/* Center Person Photo with a Premium Frame (Positioned BELOW text with ZERO covering) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex justify-center mt-6 sm:mt-8 md:mt-10"
        >
          {/* Framed Card with smooth floating breathing animation */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative p-2.5 rounded-[2.5rem] bg-gradient-to-b from-slate-100 via-white to-slate-50 border border-slate-200/90 shadow-2xl shadow-slate-300/40"
          >
            {/* Inner Frame */}
            <div className="relative w-56 sm:w-64 md:w-72 lg:w-80 aspect-[3/4] rounded-[2rem] overflow-hidden border-2 border-white shadow-inner bg-slate-50">
              <Image
                src="/images/profile.jpg"
                alt="Romnick P. Ramacula"
                fill
                priority
                className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Content Grid (Left Info + Right Facebook Button) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full mt-6 sm:mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Left Side: Role Title, Short Bio, Location Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Future Elementary Educator
              <br />
              <span className="text-slate-700 font-bold">BEEd-2C Scholar</span>
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              I explore innovative pedagogy, modern educational technology, and student-centered
              classroom solutions for the future of elementary learning.
            </p>

            {/* Black location pill with live pulsing dot */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-semibold shadow-md cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>NEMSU - LIANGA CAMPUS</span>
            </motion.div>
          </motion.div>

          {/* Right Side: ONLY Facebook button as requested */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto"
          >
            <motion.a
              href="https://www.facebook.com/profile.php?id=61595016252702"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-lg text-sm font-bold text-slate-800 transition-all group"
            >
              <div className="w-6 h-6 rounded-full bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2]/20 transition-colors">
                <svg
                  className="w-4 h-4 text-[#1877F2] fill-current group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span>Facebook</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </motion.a>

            {/* Quick Explore Anchor */}
            <a
              href="#about"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-1"
            >
              <span>Scroll to explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
