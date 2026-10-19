import { useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/auth";

// VAPID_PUBLIC_KEY from environment or default matching server
const PUBLIC_VAPID_KEY =
  import.meta.env.VITE_PUBLIC_VAPID_KEY ||
  "BM8roNvRt-loHBY71YOPSC1N7OteNGrSkQtcQx5xIooJro9aymMpKQ1z6yViD0mtsII-GRryLMhLBXiNCg0D2pE";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useWebPush = () => {
  const [Auth] = useAuth();
  const loggedInUserId = Auth?.User?._id;

  const subscribeToPush = useCallback(async () => {
    if (!loggedInUserId) return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    try {
      // 1. Register Service Worker
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });

      // Wait for service worker to become active
      await navigator.serviceWorker.ready;

      // 2. Request Notification Permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }

      // 3. Subscribe to Push Manager
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });
      }

      // 4. Send subscription to Backend
      const subJSON = subscription.toJSON();
      await api.post("/users/push-subscribe", subJSON);
      console.log("✅ Web Push registered and active.");
    } catch (err) {
      console.warn("Web Push registration error:", err);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserId) {
      subscribeToPush();
    }
  }, [loggedInUserId, subscribeToPush]);

  return { subscribeToPush };
};
