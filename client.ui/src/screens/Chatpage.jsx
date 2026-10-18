import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import NewChatModal from "../components/newChat/NewChatModal";
import InviteModal from "../components/invite/InviteModal";
import api from "../services/api";
import { useChat } from "../hooks/useChat";
import ErrorBoundary from "../components/shared/ErrorBoundary";

const Chatpage = ({ toggleDark }) => {
  const [Auth] = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInitialEmail, setInviteInitialEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Chats");
  const [searchParams, setSearchParams] = useSearchParams();
  const chatParam = searchParams.get("chat");
  const handleSelectChatRef = useRef(null);

  const onSelectChatCallback = useCallback((conv) => {
    if (handleSelectChatRef.current) {
      handleSelectChatRef.current(conv);
    }
  }, []);

  // single source of truth — useChat only here
  const { conversations, loading, refetch, resetUnread } = useChat(selectedChat?._id, onSelectChatCallback);

  const handleSelectChat = useCallback((conv) => {
    if (!conv) return;
    setSelectedChat(conv);
    if (conv._id && typeof resetUnread === "function") {
      resetUnread(conv._id);
    }
  }, [resetUnread]);

  handleSelectChatRef.current = handleSelectChat;

  // Auto-open chat from URL query parameter only once on initial load
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (autoOpenedRef.current || !chatParam || conversations.length === 0) return;
    const match = conversations.find((c) => String(c._id) === String(chatParam));
    if (match) {
      autoOpenedRef.current = true;
      setSelectedChat(match);
      if (typeof resetUnread === "function") {
        resetUnread(match._id);
      }
    }
  }, [chatParam, conversations, resetUnread]);

  // Listen for navigation events from Service Worker notification clicks
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleSWMessage = (event) => {
      const data = event.data;
      if (data?.type === "NAVIGATE_CHAT" && data?.conversationId) {
        const targetConvId = String(data.conversationId);
        const match = conversations.find((c) => String(c._id) === targetConvId);
        if (match) {
          handleSelectChat(match);
        }
      }
    };

    navigator.serviceWorker.addEventListener("message", handleSWMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    };
  }, [conversations, handleSelectChat]);

  // Lock window scroll to top when mounting Chatpage
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const createAndOpen = async () => {
      try {
        const { data } = await api.post("/conversations", {
          receiverId: selectedUser._id,
        });

        const conv = data.conversation;
        if (!conv) return;

        await refetch(); // reload sidebar

        handleSelectChat({
          _id: conv._id,
          user: {
            _id: selectedUser._id,
            name: selectedUser.full_name || "Unknown",
            email: selectedUser.email,
            avatar: selectedUser.profilepicture,
            profilepicture: selectedUser.profilepicture,
            isOnline: selectedUser.isOnline || false,
            lastSeen: selectedUser.lastSeen || null,
          },
          lastMessage: conv.lastMessage || null,
          unread: 0,
          isFavorite: conv.isFavorite || false,
        });

      } catch (err) {
        console.error("createConversation error:", err);
      } finally {
        setSelectedUser(null);
        setShowNewChat(false);
      }
    };

    createAndOpen();
  }, [selectedUser]);

  const handleUserStatusChange = (userId, isOnline, lastSeen) => {
    setSelectedChat((prev) => {
      if (!prev || String(prev.user?._id) !== String(userId)) return prev;
      return {
        ...prev,
        user: { ...prev.user, isOnline, lastSeen: lastSeen || prev.user.lastSeen },
      };
    });
  };

  if (!Auth.isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#07090e]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/20 to-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.3)] animate-pulse">
              <span className="text-2xl">🫀</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2dd4bf]/30 bg-[#0f172a]/60 text-[#2dd4bf] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
            <span>CONNECTING PULSE NETWORK...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!Auth.User) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex h-full max-h-full w-full overflow-hidden bg-slate-50 dark:bg-transparent text-slate-900 dark:text-slate-100 font-sans selection:bg-[#38bdf8]/30 transition-colors duration-500">
      {activeTab === 'Chats' ? (
        <>
          <div
            className={`w-full md:w-[340px] lg:w-[380px] h-full shrink-0 min-w-0 z-20 transition-all duration-300 overflow-hidden ${
              selectedChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ChatList
              conversations={conversations}
              loading={loading}
              refetch={refetch}
              setSelectedChat={handleSelectChat}
              selectedChatId={selectedChat?._id}
              openNewChat={() => setShowNewChat(true)}
            />
          </div>
          <div
            className={`flex-1 h-full min-w-0 overflow-hidden ${
              !selectedChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ErrorBoundary onReset={() => setSelectedChat(null)} title="Conversation Error">
              <ChatWindow
                conversation={selectedChat}
                onUserStatusChange={handleUserStatusChange}
                onBack={() => setSelectedChat(null)}
                openNewChat={() => setShowNewChat(true)}
              />
            </ErrorBoundary>
          </div>
        </>
      ) : null}

      {showNewChat && (
        <NewChatModal
          onSelectUser={setSelectedUser}
          onClose={() => setShowNewChat(false)}
          onOpenInvite={(email) => {
            setInviteInitialEmail(email || "");
            setShowInviteModal(true);
          }}
        />
      )}

      {showInviteModal && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          initialEmail={inviteInitialEmail}
          onOpenChatWithUser={(user) => {
            setSelectedUser(user);
          }}
        />
      )}
    </div>
  );
};

export default Chatpage;