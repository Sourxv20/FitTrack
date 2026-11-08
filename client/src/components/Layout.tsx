import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080D1A] text-white flex flex-col font-['Inter'] antialiased relative selection:bg-purple-500 selection:text-white">
      {/* Background Ambient Glows (matching Glassy Dashboard V24) */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating Desktop & Slide-in Mobile Glassmorphism Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Content Area */}
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
