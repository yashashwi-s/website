"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const PointerCursor = dynamic(() => import("./PointerCursor"), { ssr: false });

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(pointer.matches);
    update();
    pointer.addEventListener("change", update);
    return () => pointer.removeEventListener("change", update);
  }, []);
  // Keep server and first client render identical; phones need no cursor springs.
  return enabled ? <PointerCursor /> : null;
}
