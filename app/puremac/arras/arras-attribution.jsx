"use client";

import { useEffect, useState } from "react";
import { arrasDownloadHref, rememberArrasSource, rememberArrasCampaign } from "@/lib/arras-attribution.mjs";

function entryAttribution() {
  // Accessing sessionStorage itself can throw in restricted browser contexts.
  let storage;
  try { storage = window.sessionStorage; } catch { storage = null; }
  const context = { url: window.location.href, referrer: document.referrer, storage };
  return [rememberArrasSource(context), rememberArrasCampaign(context)];
}

export function ArrasAttribution() {
  useEffect(() => { entryAttribution(); }, []);
  return null;
}

export function ArrasDownloadLink({ href, children, ...props }) {
  const [attributedHref, setAttributedHref] = useState(href);
  useEffect(() => { setAttributedHref(arrasDownloadHref(href, ...entryAttribution())); }, [href]);
  const prepareNavigation = event => {
    event.currentTarget.href = arrasDownloadHref(href, ...entryAttribution());
  };
  // A normal anchor keeps keyboard, middle-click and script-free downloads.
  return <a {...props} href={attributedHref} onClick={prepareNavigation} onAuxClick={prepareNavigation}>{children}</a>;
}
