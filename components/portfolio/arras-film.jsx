"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import Image from "next/image";

export default function ArrasFilm({ paused }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [requested, setRequested] = useState(false);
  const wantsPlayback = useRef(false);
  const nearViewport = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function syncPlayback() {
      if (
        paused ||
        document.hidden ||
        !nearViewport.current ||
        !wantsPlayback.current
      )
        video.pause();
      else video.play().catch(() => setPlaying(false));
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        nearViewport.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [paused]);

  async function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      wantsPlayback.current = false;
      video.pause();
      return;
    }
    wantsPlayback.current = true;
    setFailed(false);
    setRequested(true);
    // Loading only follows a deliberate click; mobile visitors pay no video cost.
    if (!video.getAttribute("src")) {
      video.src = "/puremac/arras/launch-2.5.0.mp4";
      video.load();
    }
    try {
      await video.play();
    } catch {
      setPlaying(false);
      setFailed(true);
    }
  }

  return (
    <div
      className="ys-arras-film"
      data-playing={playing}
      data-has-frame={hasFrame}
    >
      <Image
        src="/puremac/arras/features/collages.webp"
        width={1200}
        height={750}
        sizes="(max-width: 760px) 92vw, 62vw"
        alt="Arras on a Mac desktop, arranging photographs into editable collages"
      />
      <video
        id="ys-arras-demo"
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => {
          setPlaying(true);
          setHasFrame(true);
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          setHasFrame(false);
          setPlaying(false);
          setFailed(true);
        }}
        aria-label="Arras product demo: arranging photo widgets on a Mac desktop"
        aria-hidden={!hasFrame}
      />
      <button
        type="button"
        className="ys-film-toggle"
        onClick={toggle}
        disabled={paused}
        title={paused ? "Enable motion to play the film" : undefined}
        aria-controls="ys-arras-demo"
        aria-pressed={playing}
        aria-label={playing ? "Pause Arras demo" : "Play Arras demo"}
      >
        {playing ? <Pause size={12} /> : <Play size={12} />}
        <span>
          {failed
            ? "Retry demo"
            : playing
              ? "Pause film"
              : requested
                ? "Play film"
                : "See Arras in motion"}
        </span>
      </button>
      <span className="ys-film-status" role="status">
        {failed
          ? "The film could not play. You can retry or explore Arras below."
          : ""}
      </span>
    </div>
  );
}
