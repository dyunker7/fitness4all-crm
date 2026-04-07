"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaProvider() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(display-mode: standalone)").matches;
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }

    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleInstalled = () => setIsInstalled(true);
    const handleDisplayModeChange = (event: MediaQueryListEvent) =>
      setIsInstalled(event.matches);
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    mediaQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-xl items-center gap-3 rounded-full border border-cyan-300/30 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-cyan-950/30 backdrop-blur">
        <span className="hidden sm:inline">
          Install Fitness4All CRM for quick mobile and desktop access.
        </span>
        <span className="sm:hidden">Install Fitness4All CRM</span>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-full bg-cyan-300 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-200"
        >
          Install
        </button>
      </div>
    </div>
  );
}
