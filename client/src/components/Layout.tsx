import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { ThreeSceneBackground } from "./ThreeSceneBackground";
import { Section3DBackground } from "./Section3DBackground";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080D1A] text-white flex flex-col font-['Inter'] antialiased relative selection:bg-purple-500 selection:text-white">
      {/* 1. Thematic Section Background Picture (Dark Cinematic Graded) */}
      <Section3DBackground />

      {/* 2. Interactive Three.js 3D WebGL Particle & Hologram Canvas */}
      <ThreeSceneBackground />

      {/* 3. VisionOS Spatial Environment Ambient Glows */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/15 spatial-glow-orb pointer-events-none z-0 animate-float-slow" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-fuchsia-600/10 spatial-glow-orb pointer-events-none z-0 animate-float-reverse" />
      <div className="fixed -bottom-40 left-1/4 w-[550px] h-[550px] bg-cyan-600/12 spatial-glow-orb pointer-events-none z-0 animate-float-slow" />

      {/* 4. Floating Desktop & Slide-in Mobile Spatial Dock Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* 5. Main App Content Area */}
      <div className="lg:pl-[284px] flex flex-col flex-1 min-h-screen transition-all relative z-10">
        {/* Sticky Header Topbar */}
        <Topbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Page View with bottom padding for mobile navigation */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
