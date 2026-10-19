// Production-grade Service Worker for PulseChat Notifications
// Handles immediate push notifications across Desktop & Mobile, online & offline states,
// with context-aware suppression when actively inside a chat, and strict deduplication.

const activeClientsMap = new Map(); // clientId -> { conversationId, isFocused, isVisible, lastUpdated }
const handledMessages = new Set(); // messageId set to avoid duplicate notifications

function pruneHandledMessages() {
  if (handledMessages.size > 250) {
    const arr = Array.from(handledMessages);
    for (let i = 0; i < 75; i++) {
      handledMessages.delete(arr[i]);
    }
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Client communication: sync active conversation and focus state
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "CHAT_ACTIVE_STATE") {
    if (event.source && event.source.id) {
      activeClientsMap.set(event.source.id, {
        conversationId: data.conversationId ? String(data.conversationId) : null,
        isFocused: Boolean(data.isFocused),
        isVisible: Boolean(data.isVisible),
        lastUpdated: Date.now(),
      });
    }
  } else if (data.type === "MESSAGE_HANDLED") {
    if (data.messageId) {
      handledMessages.add(String(data.messageId));
      pruneHandledMessages();
    }
  } else if (data.type === "CLIENT_UNLOAD") {
    if (event.source && event.source.id) {
      activeClientsMap.delete(event.source.id);
    }
  }
});

// Immediate push delivery
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const msgId = data.messageId ? String(data.messageId) : null;
    const convId = data.conversationId ? String(data.conversationId) : null;

    // Strict deduplication: skip if already handled/notified
    if (msgId && handledMessages.has(msgId)) {
      return;
    }
    if (msgId) {
      handledMessages.add(msgId);
      pruneHandledMessages();
    }

    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        // Clean stale client records
        const activeIds = new Set(windowClients.map((c) => c.id));
        for (const [id] of activeClientsMap.entries()) {
          if (!activeIds.has(id)) {
            activeClientsMap.delete(id);
          }
        }

        // Determine if user is online, active, and looking at THIS specific conversation
        let isActivelyViewingThisChat = false;

        for (const client of windowClients) {
          const clientState = activeClientsMap.get(client.id);
          const isFocused = client.focused || (clientState && clientState.isFocused);
          const isViewingThisConv = clientState && clientState.conversationId === convId;
          const urlMatches = client.url && convId && client.url.includes(`chat=${convId}`);

          if (isFocused && (isViewingThisConv || urlMatches)) {
            isActivelyViewingThisChat = true;

            // Notify client for in-chat sync
            try {
              client.postMessage({
                type: "IN_CHAT_PUSH_SYNC",
                conversationId: convId,
                messageId: msgId,
                data,
              });
            } catch (e) {
              // Ignore postMessage failure
            }
            break;
          }
        }

        // REQUIREMENT: If user is online and actively inside this chat, suppress system popup
        if (isActivelyViewingThisChat) {
          return;
        }

        // Tag uniquely identifying this message
        const notificationTag = msgId ? `pulse-msg-${msgId}` : `pulse-conv-${convId || "general"}`;
        const targetUrl = data.url || (convId ? `/chatpage?chat=${convId}` : "/chatpage");

        // OS-level deduplication: check if notification with this tag is already active on user's screen
        return self.registration.getNotifications({ tag: notificationTag }).then((existing) => {
          if (existing && existing.length > 0) {
            // Already notified on screen — skip to guarantee single notification
            return;
          }

          const options = {
            body: data.body || "New message received",
            icon: data.icon || "/logo.png",
            badge: "/favicon.png",
            tag: notificationTag,
            renotify: false, // Strict single alert — do not sound/vibrate again if tag exists
            requireInteraction: false,
            vibrate: [200, 100, 200],
            data: {
              url: targetUrl,
              conversationId: convId,
              messageId: msgId,
            },
          };

          return self.registration.showNotification(data.title || "PulseChat", options);
        });
      })
    );
  } catch (err) {
    console.error("Push event error:", err);
  }
});

// User clicks notification: focus tab and navigate directly to conversation
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const convId = event.notification.data?.conversationId;
  const targetUrl = event.notification.data?.url || (convId ? `/chatpage?chat=${convId}` : "/chatpage");

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // 1. If an existing PulseChat window is open, focus it and open the chat
      for (const client of windowClients) {
        if ("focus" in client) {
          return client.focus().then(() => {
            if (convId) {
              client.postMessage({
                type: "NAVIGATE_CHAT",
                conversationId: convId,
              });
            }
            if (!client.url.includes("/chatpage")) {
              return client.navigate(targetUrl);
            }
          });
        }
      }

      // 2. If no window open, open fresh window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
