"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TypingTestKeyboard from "@/components/TypingTestKeyboard";
import Advocacy from "@/components/Advocacy";
import VideoReports from "@/components/VideoReports";
import JourneyGallery from "@/components/JourneyGallery";
import TasksSection from "@/components/TasksSection";
import PdfModal from "@/components/PdfModal";
import Footer from "@/components/Footer";
import EducationBackgroundEffects from "@/components/EducationBackgroundEffects";
import { tasksData, Task } from "@/data/tasks";

export default function Home() {
  const [activePdfTask, setActivePdfTask] = useState<Task | null>(null);

  // Quick helper to open the primary featured TTL task
  const handleOpenFeaturedPdf = () => {
    const featured =
      tasksData.find((t) => t.id === "ttl-post-presentation-activity") ||
      tasksData[0];
    setActivePdfTask(featured);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Course-Themed Elementary Education Background Animations & Effects */}
      <EducationBackgroundEffects />

      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section (#home) */}
      <Hero />

      {/* About Me Section (#about) */}
      <About />

      {/* Interactive Typing Test & Mechanical Keyboard Hub */}
      <TypingTestKeyboard />

      {/* Advocacy Section (#advocacy) */}
      <Advocacy />

      {/* Video Reports Section (#video-reports) */}
      <VideoReports />

      {/* My Journey & Milestones Photo Gallery (#gallery) */}
      <JourneyGallery />

      {/* My Tasks Section (#my-tasks) */}
      <TasksSection onViewPdf={(task) => setActivePdfTask(task)} />

      {/* Footer */}
      <Footer />

      {/* PDF Modal Viewer */}
      <PdfModal
        task={activePdfTask}
        onClose={() => setActivePdfTask(null)}
      />
    </div>
  );
}
