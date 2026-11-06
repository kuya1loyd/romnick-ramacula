"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About Me", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Advocacy", href: "#advocacy" },
    { label: "Video Reports", href: "#video-reports" },
    { label: "My Tasks", href: "#my-tasks" },
  ];

  return (
    <>
      {/* Floating Centered Capsule Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 pt-3 sm:pt-4 transition-all">
        <motion.div
          animate={{
            y: scrolled ? 6 : 0,
            scale: scrolled ? 0.98 : 1,
            backgroundColor: scrolled
              ? "rgba(255, 255, 255, 0.88)"
              : "rgba(255, 255, 255, 0.7)",
            boxShadow: scrolled
              ? "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)"
              : "0 2px 10px -2px rgba(0, 0, 0, 0.03)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="pointer-events-auto flex items-center justify-between sm:justify-center rounded-full border border-slate-200/90 backdrop-blur-md px-5 sm:px-8 py-2.5 sm:py-3 transition-colors max-w-full sm:max-w-none shadow-xs"
        >
          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-slate-900 transition-colors relative py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Brand indicator & Menu Toggle */}
          <div className="flex md:hidden items-center justify-between w-full gap-4">
            <Link href="/" className="text-sm font-black tracking-wider text-slate-900">
              ROMNICK
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-lg border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col gap-3 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-slate-900 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
