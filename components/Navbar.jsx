"use client";

import { useState, useEffect } from "react";
import { personal } from "@/data/personal";
import { Menu, X } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Capabilities", href: "#skills" },
  { label: "Milestones", href: "#achievements" },
  {
    label: "Resume",
    href: personal.resume,
    external: true,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop Floating Dock */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
        className={`hidden md:flex fixed top-8 left-1/2 -translate-x-1/2 z-50 items-center px-2 py-2 rounded-full transition-all duration-500 border ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center gap-4">
          <Magnetic>
            <a href="#" className="pl-4 pr-6 font-bold text-white/50 tracking-tighter hover:text-white transition-colors duration-300">
              yashashwi<span className="text-white">.</span>
            </a>
          </Magnetic>
          
          <div className="w-[1px] h-4 bg-white/10" />

          <div className="flex items-center gap-1 pl-2">
          {navLinks.map((link) => (
            <Magnetic key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <div className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 border ${
          scrolled || mobileOpen
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-transparent border-transparent"
        }`}>
          <a href="#" className="text-xl font-bold text-white tracking-tighter">
            {personal.name.split(" ")[0].toLowerCase()}.
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2 text-white/70 hover:text-white transition-colors relative z-50"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl font-black text-white/70 hover:text-white uppercase tracking-tighter transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
