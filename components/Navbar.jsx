"use client";

import { useState, useEffect } from "react";
import { personal } from "@/data/personal";
import { Menu, X } from "lucide-react";
import Magnetic from "@/components/Magnetic";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[var(--color-border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Magnetic>
          <a
            href="#"
            className="text-base font-semibold tracking-tight text-white hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            {personal.name.split(" ")[0].toLowerCase()}
            <span className="text-[var(--color-accent)]">.</span>
          </a>
        </Magnetic>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Magnetic key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            </Magnetic>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-white transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8 pt-16">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => setMobileOpen(false)}
              className="text-lg text-[var(--color-text-muted)] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
