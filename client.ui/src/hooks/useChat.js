import { useEffect, useState, useCallback, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/auth";
import { useSocket } from "./useSocket";
import { toast } from "react-toastify";
import { playInChatSound, playAlertSound } from "../utils/notificationSound";

export const useChat = (selectedChatId = null, onSelectChat = null) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Auth] = useAuth();
  const socket = useSocket();
  const loggedInUserId = Auth?.User?._id;

  const loggedInUserIdRef = useRef(loggedInUserId);
  const selectedChatIdRef = useRef(selectedChatId);
  const onSelectChatRef = useRef(onSelectChat);
  const notifiedMessagesRef = useRef(new Set()); // Deduplication set

  useEffect(() => {
    loggedInUserIdRef.current = loggedInUserId;
  }, [loggedInUserId]);

  useEffect(() => {
    onSelectChatRef.current = onSelectChat;
  }, [onSelectChat]);

  // Synchronize active chat state and window focus with Service Worker
  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;

    const syncStateWithSW = () => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CHAT_ACTIVE_STATE",
          conversationId: selectedChatId ? String(selectedChatId) : null,
          isFocused: typeof document !== "undefined" && document.hasFocus(),
          isVisible: typeof document !== "undefined" && !document.hidden,
        });
      }
    };

    syncStateWithSW();

    // Auto-close desktop notifications for this chat when we open it
    if (selectedChatId && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.getNotifications().then((notifications) => {
          notifications.forEach((n) => {
            const nConvId = n.data?.conversationId || (n.tag && n.tag.replace("pulse-conv-", ""));
            if (String(nConvId) === String(selectedChatId)) {
              n.close();
            }
          });
        });
      });
    }

    window.addEventListener("focus", syncStateWithSW);
    window.addEventListener("blur", syncStateWithSW);
    document.addEventListener("visibilitychange", syncStateWithSW);

    return () => {
      window.removeEventListener("focus", syncStateWithSW);
      window.removeEventListener("blur", syncStateWithSW);
      document.removeEventListener("visibilitychange", syncStateWithSW);
    };
  }, [selectedChatId]);

  // Listen for sync messages from Service Worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleSWMessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "IN_CHAT_PUSH_SYNC") {
        const msgIdStr = data.messageId ? String(data.messageId) : null;
        if (msgIdStr && !notifiedMessagesRef.current.has(msgIdStr)) {
          notifiedMessagesRef.current.add(msgIdStr);
        }
      }
    };

    navigator.serviceWorker.addEventListener("message", handleSWMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    };
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!loggedInUserId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/conversations/${loggedInUserId}`);
      const list = Array.isArray(data) ? data : [];

      const formatted = list.map((conv) => {
        const lastMsg = conv.lastMessage || null;
        const isMyLastMsg = String(lastMsg?.sender?._id || lastMsg?.sender) === String(loggedInUserId);
        const unread = lastMsg && !isMyLastMsg
          ? conv.unreadCount?.[loggedInUserId] || 0
          : 0;

        return {
          ...conv,
          user: {
            _id: conv.user?._id,
            name: conv.user?.full_name || "Unknown",
            full_name: conv.user?.full_name || "Unknown",
            isOnline: conv.user?.isOnline || false,
            avatar: conv.user?.profilepicture || null,
            profilepicture: conv.user?.profilepicture || null,
            lastSeen: conv.user?.lastSeen || null,
            email: conv.user?.email,
            createdAt: conv.user?.createdAt,
            bio: conv.user?.bio,
            city: conv.user?.city,
            phonenumber: conv.user?.phonenumber,
            gender: conv.user?.gender,
          },
          unread,
        };
      });

      formatted.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : 0;
        const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : 0;
        return bTime - aTime;
      });

      setConversations(formatted);
    } catch (error) {
      console.error("fetchConversations error:", error);
    } finally {
      setLoading(false);
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserId) {
      fetchConversations();
      if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, [loggedInUserId, fetchConversations]);

  // Socket listeners with production-grade notification & deduplication logic
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
      const isFromOther = String(senderId) !== String(loggedInUserIdRef.current);
      const isCurrentlyOpen = String(msg.conversationId) === String(selectedChatIdRef.current);
      const isWindowFocused = typeof document !== "undefined" && document.hasFocus() && !document.hidden;

      // Deduplication check
      const msgIdStr = msg._id ? String(msg._id) : null;
      let isDuplicate = false;
      if (msgIdStr) {
        if (notifiedMessagesRef.current.has(msgIdStr)) {
          isDuplicate = true;
        } else {
          notifiedMessagesRef.current.add(msgIdStr);
          // Prune old entries to prevent unbounded memory growth
          if (notifiedMessagesRef.current.size > 250) {
            const arr = Array.from(notifiedMessagesRef.current);
            for (let i = 0; i < 75; i++) {
              notifiedMessagesRef.current.delete(arr[i]);
            }
          }
        }

        // Inform Service Worker that this message was handled by the active tab
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "MESSAGE_HANDLED",
            messageId: msgIdStr,
            conversationId: msg.conversationId,
          });
        }
      }

      setConversations((prev) => {
        // Find corresponding conversation
        const targetConv = prev.find((c) => String(c._id) === String(msg.conversationId));
        const senderName = targetConv?.user?.full_name || targetConv?.user?.name || "Someone";
        const messagePreview = msg.text || (msg.image ? "📷 Photo" : (msg.audioUrl ? "🎤 Voice Note" : "New message"));

        // ONLY recipient receives notifications, never the sender
        if (isFromOther && !isDuplicate) {
          if (isCurrentlyOpen && isWindowFocused) {
            // ✅ User is ONLINE and ACTIVELY IN THE CHAT:
            // Play gentle in-chat chime, DO NOT show popup or desktop notification!
            playInChatSound();
          } else if (isWindowFocused) {
            // ✅ User is in another conversation or looking at another tab/screen within the app:
            playAlertSound();
            toast.info(`💬 ${senderName}: ${messagePreview}`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
              onClick: () => {
                if (onSelectChatRef.current && targetConv) {
                  onSelectChatRef.current(targetConv);
                }
              },
            });
          } else {
            // ✅ Window is minimized or in the background:
            // Native desktop alert via SW registration with strict deduplication
            const notificationTag = `pulse-msg-${msg._id}`;
            if ("serviceWorker" in navigator && Notification.permission === "granted") {
              navigator.serviceWorker.ready.then((reg) => {
                if (reg.getNotifications) {
                  reg.getNotifications({ tag: notificationTag }).then((existing) => {
                    if (existing && existing.length > 0) return; // Already on screen!
                    reg.showNotification(senderName, {
                      body: messagePreview,
                      icon: targetConv?.user?.profilepicture || "/favicon.png",
                      badge: "/favicon.png",
                      tag: notificationTag,
                      renotify: false, // Strict single alert
                      vibrate: [200, 100, 200],
                      data: {
                        url: `/chatpage?chat=${msg.conversationId}`,
                        conversationId: msg.conversationId,
                        messageId: msg._id,
                      },
                    });
                  });
                } else {
                  reg.showNotification(senderName, {
                    body: messagePreview,
                    icon: targetConv?.user?.profilepicture || "/favicon.png",
                    badge: "/favicon.png",
                    tag: notificationTag,
                    renotify: false,
                    vibrate: [200, 100, 200],
                    data: {
                      url: `/chatpage?chat=${msg.conversationId}`,
                      conversationId: msg.conversationId,
                      messageId: msg._id,
                    },
                  });
                }
              });
            }
          }
        }

        return prev
          .map((conv) => {
            if (String(conv._id) !== String(msg.conversationId)) return conv;
            return {
              ...conv,
              lastMessage: {
                _id: msg._id,
                text: msg.text,
                image: msg.image,
                audioUrl: msg.audioUrl,
                sender: msg.sender,
                status: msg.status,
                createdAt: msg.createdAt,
                isDeleted: msg.isDeleted,
                isSystem: msg.isSystem,
              },
              unread: isFromOther && (!isCurrentlyOpen || !isWindowFocused)
                ? (conv.unread || 0) + 1
                : conv.unread,
            };
          })
          .sort((a, b) => {
            const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : 0;
            const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : 0;
            return bTime - aTime;
          });
      });
    };

    const handleConversationUpdated = (msg) => {
      const lastMessage = msg.lastMessage || {
        _id: msg._id,
        text: msg.text,
        image: msg.image,
        audioUrl: msg.audioUrl,
        sender: msg.sender,
        status: msg.status,
        createdAt: msg.createdAt,
        isDeleted: msg.isDeleted,
        isSystem: msg.isSystem,
      };

      setConversations((prev) =>
        prev
          .map((conv) => {
            if (String(conv._id) !== String(msg.conversationId)) return conv;
            return {
              ...conv,
              lastMessage,
            };
          })
          .sort((a, b) => {
            const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : 0;
            const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : 0;
            return bTime - aTime;
          })
      );
    };

    const handleMessagesSeen = ({ conversationId }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          String(conv._id) === String(conversationId)
            ? { ...conv, unread: 0 }
            : conv
        )
      );
    };

    const handleOnlineStatus = ({ userId, isOnline, lastSeen }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          String(conv.user?._id) === String(userId)
            ? { ...conv, user: { ...conv.user, isOnline, lastSeen: lastSeen || conv.user.lastSeen } }
            : conv
        )
      );
    };

    const handleStatusUpdate = ({ messageId, status }) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.lastMessage && String(conv.lastMessage._id) === String(messageId)) {
            return { ...conv, lastMessage: { ...conv.lastMessage, status } };
          }
          return conv;
        })
      );
    };

    const handleMessageDeleted = ({ messageId, conversationId }) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (String(conv._id) === String(conversationId) && conv.lastMessage && String(conv.lastMessage._id) === String(messageId)) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                isDeleted: true,
                text: "",
              },
            };
          }
          return conv;
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("conversationUpdated", handleConversationUpdated);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("userStatusChanged", handleOnlineStatus);
    socket.on("messageStatusUpdated", handleStatusUpdate);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("conversationUpdated", handleConversationUpdated);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("userStatusChanged", handleOnlineStatus);
      socket.off("messageStatusUpdated", handleStatusUpdate);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket]);

  const resetUnread = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        String(conv._id) === String(conversationId)
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  }, []);

  return {
    conversations,
    loading,
    refetch: fetchConversations,
    resetUnread,
  };
};