"use client";

import { useEffect, useRef, useState } from "react";

export default function ArrasReviewCarousel({ children }) {
  const track = useRef(null);
  const [edges, setEdges] = useState(null);

  useEffect(() => {
    const scroller = track.current;
    function updateEdges() {
      const maximum = scroller.scrollWidth - scroller.clientWidth;
      const start = scroller.scrollLeft < 2;
      const end = maximum - scroller.scrollLeft < 2;
      setEdges(current => current?.start === start && current.end === end ? current : { start, end });
    }
    const observer = new ResizeObserver(updateEdges);
    observer.observe(scroller);
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", updateEdges);
    };
  }, []);

  function move(direction) {
    const scroller = track.current;
    const [first, second] = scroller.children;
    scroller.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft) });
  }

  return (
    <div className="ar-reviews">
      <div
        id="arras-review-track"
        className="ar-review-track"
        ref={track}
        role="group"
        aria-label="Scrollable Reddit comments"
        tabIndex={0}
      >
        {children}
      </div>
      <div className="ar-review-controls" hidden={!edges || (edges.start && edges.end)}>
        <button type="button" aria-label="Previous Reddit comment" aria-controls="arras-review-track" disabled={edges?.start} onClick={() => move(-1)}>←</button>
        <button type="button" aria-label="Next Reddit comment" aria-controls="arras-review-track" disabled={edges?.end} onClick={() => move(1)}>→</button>
      </div>
    </div>
  );
}
