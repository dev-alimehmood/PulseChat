import { useState, useEffect } from "react";

// Global cache for beforeinstallprompt event so it is never missed across mounts
let globalDeferredPrompt = null;
const promptListeners = new Set();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    promptListeners.forEach((listener) => listener(e));
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstallable, setIsInstallable] = useState(Boolean(globalDeferredPrompt));
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://")
    );
  });

  // Detect iOS Safari / WebKit devices
  const isIOS = typeof navigator !== "undefined" && (
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );

  useEffect(() => {
    if (isInstalled) return;

    const listener = (prompt) => {
      setDeferredPrompt(prompt);
      setIsInstallable(Boolean(prompt));
    };

    promptListeners.add(listener);

    // Dynamically react to display-mode changes
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleMql = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    if (mql?.addEventListener) {
      mql.addEventListener("change", handleMql);
    }

    return () => {
      promptListeners.delete(listener);
      if (mql?.removeEventListener) {
        mql.removeEventListener("change", handleMql);
      }
    };
  }, [isInstalled]);

  const installApp = async () => {
    if (!deferredPrompt) return false;
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn("PWA install error:", err);
      return false;
    }
  };

  return { isInstallable, isInstalled, isIOS, installApp, deferredPrompt };
};

export default usePWAInstall;
