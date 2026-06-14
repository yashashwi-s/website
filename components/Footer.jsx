"use client";

import { personal } from "@/data/personal";

export default function Footer() {

  return (
    <footer className="px-6 max-w-5xl mx-auto py-12 border-t border-[var(--color-border)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} {personal.name}
        </p>
        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors duration-200"
        >
          github.com/{personal.github.split("/").pop()}
        </a>
      </div>
    </footer>
  );
}
