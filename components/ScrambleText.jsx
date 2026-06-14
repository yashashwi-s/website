"use client";

import { useState, useRef, useEffect } from "react";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

export default function ScrambleText({ text, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((current) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; // Controls speed of unscrambling
    }, 30);
  };

  useEffect(() => {
    // Initial scramble on mount? Nah, just on hover.
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span 
      onMouseEnter={scramble} 
      className={`inline-block font-mono ${className}`}
    >
      {displayText}
    </span>
  );
}
