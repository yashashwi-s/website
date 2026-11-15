"use client";

import { useEffect, useRef, useState } from "react";

const intervalMs = 6500;

function move(track, direction) {
  const position = track.scrollLeft;
  const end = track.scrollWidth - track.clientWidth;
  if (end < 2) return;
  if (direction > 0 && end - position < 2) {
    track.scrollTo({ left: 0, behavior: "instant" });
    return;
  }
  if (direction < 0 && position < 2) {
    track.scrollTo({ left: end, behavior: "instant" });
    return;
  }

  const offsets = Array.from(track.children, card => card.offsetLeft);
  const target = direction > 0
    ? offsets.find(offset => offset > position + 2) ?? end
    : offsets.findLast(offset => offset < position - 2) ?? 0;
  track.scrollTo({ left: Math.min(target, end) });
}

export default function ArrasReviewCarousel({ children, count }) {
  const track = useRef(null);
  const rotationButton = useRef(null);
  const touchStart = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const scroller = track.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotion() { setReducedMotion(motion.matches); }
    function updateOverflow() { setCanScroll(scroller.scrollWidth - scroller.clientWidth >= 2); }
    const resize = new ResizeObserver(updateOverflow);
    const intersection = new IntersectionObserver(([entry]) => setIsVisible(entry.intersectionRatio >= 0.5), { threshold: 0.5 });
    motion.addEventListener("change", updateMotion);
    resize.observe(scroller);
    intersection.observe(scroller);
    updateMotion();
    updateOverflow();
    return () => {
      motion.removeEventListener("change", updateMotion);
      resize.disconnect();
      intersection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canScroll || !isVisible || isHovered || reducedMotion || !playing) return;
    let timer;
    function syncTimer() {
      window.clearInterval(timer);
      if (document.visibilityState === "visible") {
        timer = window.setInterval(() => move(track.current, 1), intervalMs);
      }
    }
    syncTimer();
    document.addEventListener("visibilitychange", syncTimer);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", syncTimer);
    };
  }, [canScroll, isHovered, isVisible, playing, reducedMotion]);

  function moveByChoice(direction) {
    setPlaying(false);
    move(track.current, direction);
  }

  function handleTouchStart(event) {
    const { clientX, clientY } = event.touches[0];
    touchStart.current = { x: clientX, y: clientY };
  }

  function handleTouchMove(event) {
    const start = touchStart.current;
    if (start === null) return;
    const { clientX, clientY } = event.touches[0];
    const horizontal = Math.abs(clientX - start.x);
    const vertical = Math.abs(clientY - start.y);
    if (Math.max(horizontal, vertical) < 8) return;
    // A vertical swipe scrolls the page. Only a horizontal gesture takes
    // control of the carousel.
    touchStart.current = null;
    if (horizontal > vertical) setPlaying(false);
  }

  return (
    <div
      className="ar-reviews"
      role="group"
      aria-roledescription="carousel"
      aria-labelledby="arras-community-heading"
      onFocusCapture={event => {
        if (event.target !== rotationButton.current || event.target.matches(":focus-visible")) setPlaying(false);
      }}
    >
      <div className="ar-review-controls" data-ready={canScroll}>
        <span>{count} comments</span>
        {!reducedMotion && <button ref={rotationButton} type="button" aria-controls="arras-review-track" onClick={() => setPlaying(current => !current)}>
          {playing ? "Pause autoplay" : "Resume autoplay"}
        </button>}
        <button type="button" aria-label="Previous Reddit comment" aria-controls="arras-review-track" onClick={() => moveByChoice(-1)}>←</button>
        <button type="button" aria-label="Next Reddit comment" aria-controls="arras-review-track" onClick={() => moveByChoice(1)}>→</button>
      </div>
      <div
        id="arras-review-track"
        className="ar-review-track"
        ref={track}
        role="group"
        aria-label="Scrollable Reddit comments"
        tabIndex={0}
        // Scrolling the section under a stationary pointer should still let
        // it advance. Moving the pointer over a quote pauses it for reading.
        onPointerMove={event => { if (event.pointerType === "mouse") setIsHovered(true); }}
        onPointerLeave={event => { if (event.pointerType === "mouse") setIsHovered(false); }}
        onPointerDown={event => { if (event.pointerType !== "touch") setPlaying(false); }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={event => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) setPlaying(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
