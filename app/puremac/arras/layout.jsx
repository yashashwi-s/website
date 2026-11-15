"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

function subscribeToHostname() {
  return () => {};
}

function isArrasDomain() {
  return window.location.hostname === "tryarras.tech";
}

export default function ArrasLayout({ children }) {
  const showAnalytics = useSyncExternalStore(subscribeToHostname, isArrasDomain, () => false);

  return (
    <>
      {children}
      {showAnalytics && (
        <Script
          src="https://datafa.st/js/script.cookieless.js"
          data-website-id="dfid_m0tA3owcMMGSp2I4kmEhW"
          data-domain="tryarras.tech"
          data-disable-payments="true"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
