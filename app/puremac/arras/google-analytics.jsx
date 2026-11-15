"use client";

import { useEffect, useSyncExternalStore } from "react";
import styles from "./google-analytics.module.css";

const measurementId = "G-EF8FXBEQSG";
const scriptId = "arras-google-analytics";
const choiceKey = "arras-google-analytics-choice";
const choiceChanged = "arras:google-analytics-choice-changed";
let temporaryChoice = null;

function readChoice() {
  try {
    const choice = localStorage.getItem(choiceKey);
    return choice === "allow" || choice === "decline" ? choice : null;
  } catch {
    return temporaryChoice;
  }
}

function subscribeToChoice(onChange) {
  window.addEventListener(choiceChanged, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(choiceChanged, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useAnalyticsChoice() {
  return useSyncExternalStore(subscribeToChoice, readChoice, () => null);
}

function saveChoice(choice) {
  try {
    localStorage.setItem(choiceKey, choice);
  } catch {
    temporaryChoice = choice;
  }
  window.dispatchEvent(new Event(choiceChanged));
}

function disableGoogleAnalytics() {
  window[`ga-disable-${measurementId}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  for (const name of ["_ga", `_ga_${measurementId.slice(2)}`]) {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=tryarras.tech`;
  }
}

function enableGoogleAnalytics() {
  window[`ga-disable-${measurementId}`] = false;
  if (document.getElementById(scriptId)) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("event", "page_view", { send_to: measurementId });
    return;
  }

  window.dataLayer ||= [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.id = scriptId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.append(script);
}

function ChoiceButtons({ choice, announce = false }) {
  return (
    <div className={styles.choices}>
      <button type="button" onClick={() => saveChoice("decline")} disabled={choice === "decline"}>
        Decline
      </button>
      <button type="button" onClick={() => saveChoice("allow")} disabled={choice === "allow"}>
        Allow
      </button>
      {announce && <span role="status">{choice === "allow" ? "Allowed" : choice === "decline" ? "Declined" : "Choose an option"}</span>}
    </div>
  );
}

export function ArrasGoogleAnalytics() {
  const choice = useAnalyticsChoice();

  useEffect(() => {
    if (choice === "allow") {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
  }, [choice]);

  if (choice) return null;
  return (
    <aside className={styles.notice} aria-label="Google Analytics preferences">
      <strong>Google Analytics</strong>
      <p>Allow optional cookies to measure how you use this site. <a href="/security#google-analytics">Privacy settings</a></p>
      <ChoiceButtons choice={choice} />
    </aside>
  );
}

export function ArrasGoogleAnalyticsPreferences() {
  const choice = useAnalyticsChoice();
  return <ChoiceButtons choice={choice} announce />;
}
