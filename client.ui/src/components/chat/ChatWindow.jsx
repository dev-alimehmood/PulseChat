import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useMessages } from "../../hooks/useMessages";
import { useSocket } from "../../hooks/useSocket";
import {
  getInitials,
  avatarColor,
  formatBubbleTime,
  formatTime,
  groupMessagesByDate,
} from "../../utils/chat";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, MoreVertical, Paperclip, Smile, Send, Edit2, Trash2, Reply, 
  Check, CheckCheck, AlertCircle, CornerDownRight, X, Phone, Video, Mic, Square, 
  Trash, Image, Download, CornerUpRight, ShieldBan, ShieldCheck, User, Shield, Info, Lock, Clock, Plus, Copy
} from "lucide-react";
import ForwardModal from "./ForwardModal";
import ProfileModal from "../profile/ProfileModal";
import AnimatedReveal from "../shared/AnimatedReveal";
import Avatar from "../shared/Avatar";
import VoicePlayer from "./VoicePlayer";
import api from "../../services/api";
import { successtoast, errortoast } from "../../toastify/toastify";

const MessageStatus = ({ status }) => {
  const currentStatus = status || "sent";
  if (currentStatus === "sending") {
    return <Clock className="w-3.5 h-3.5 text-white/70 animate-pulse flex-shrink-0" title="Sending..." />;
  }
  if (currentStatus === "sent") {
    return <Check className="w-3.5 h-3.5 text-white/75 flex-shrink-0" title="Sent to server" />;
  }
  if (currentStatus === "delivered") {
    return <CheckCheck className="w-3.5 h-3.5 text-white/85 flex-shrink-0" title="Delivered to recipient" />;
  }
  if (currentStatus === "seen") {
    return (
      <CheckCheck 
        className="w-3.5 h-3.5 text-[#2dd4bf] drop-shadow-[0_0_6px_rgba(45,212,191,0.7)] flex-shrink-0" 
        title="Seen" 
      />
    );
  }
  if (currentStatus === "failed") {
    return <AlertCircle className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" title="Delivery failed" />;
  }
  return <Check className="w-3.5 h-3.5 text-white/75 flex-shrink-0" title="Sent" />;
};

const ReplyPreview = ({ msg, onCancel, loggedInUserId }) => {
  const isMe = String(msg.sender?._id || msg.sender) === String(loggedInUserId);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 px-4 py-3 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-l-4 border-[#38bdf8] mx-4 mb-2 rounded-2xl shadow-xl border border-slate-200/80 dark:border-white/10"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#38bdf8] font-semibold mb-0.5 tracking-tight flex items-center gap-1.5">
          <Reply className="w-3.5 h-3.5 opacity-90" />
          <span>Replying to {isMe ? "You" : (msg.sender?.full_name || msg.sender?.name || "Someone")}</span>
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{msg.text || (msg.image ? "📷 Photo" : msg.audioUrl ? "🎤 Voice Note" : "")}</p>
      </div>
      <button
        onClick={onCancel}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        ✕
      </button>
    </motion.div>
  );
};

const ChatWindow = ({ conversation, onUserStatusChange, onBack, openNewChat }) => {
  const [Auth, setAuth] = useAuth();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseMessage, setPulseMessage] = useState("");
  const [forwardMessageId, setForwardMessageId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [quarantinedCount, setQuarantinedCount] = useState(0);
  const [restoringQuarantine, setRestoringQuarantine] = useState(false);

  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioTimerRef = useRef(null);
  const loggedInUserId = Auth?.User?._id;
  const socket = useSocket();
  const navigate = useNavigate();

  const {
    messages,
    loading,
    sending,
    typingUsers,
    sendMessage,
    emitTyping,
    emitStopTyping,
    retryMessage,
    deleteMessage,
    editMessage,
    sendPulse,
    markAsDownloaded,
    reportScreenshotAttempt,
    forwardMessage,
    refreshMessages,
  } = useMessages(conversation?._id);

  // Anti-Screenshot and Blur Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      // PrintScreen, Cmd+Shift+S, Cmd+Shift+4, Ctrl+P, Cmd+P
      if (
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S" || e.key === "4")) ||
        (e.ctrlKey && (e.key === "p" || e.key === "P")) ||
        (e.metaKey && (e.key === "p" || e.key === "P"))
      ) {
        // Attempt to block and clear clipboard
        navigator.clipboard.writeText("");
        reportScreenshotAttempt();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        reportScreenshotAttempt();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [reportScreenshotAttempt]);

  // auto scroll (container-only scroll, NEVER scrolls window/document)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typingUsers]);

  // focus input and instant scroll to bottom on conversation change
  useEffect(() => {
    if (conversation) {
      inputRef.current?.focus();
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
    setReplyTo(null); // clear reply when switching conversation
  }, [conversation?._id]);

  // listen for online status to update header
  useEffect(() => {
    if (!socket || !onUserStatusChange) return;
    const handle = ({ userId, isOnline, lastSeen }) => {
      onUserStatusChange(userId, isOnline, lastSeen);
    };
    socket.on("userStatusChanged", handle);
    return () => socket.off("userStatusChanged", handle);
  }, [socket, onUserStatusChange]);

  // listen for pulse
  useEffect(() => {
    if (!socket || !conversation) return;
    const handlePulse = ({ conversationId, senderId }) => {
      if (String(conversationId) !== String(conversation._id)) return;
      if (String(senderId) !== String(conversation.user?._id)) return;
      
      setPulseMessage("⚡ Pulse received!");
      setPulseActive(true);
      
      setTimeout(() => {
        setPulseActive(false);
        setTimeout(() => setPulseMessage(""), 500);
      }, 1500);
    };

    socket.on("receivePulse", handlePulse);
    return () => socket.off("receivePulse", handlePulse);
  }, [socket, conversation]);

  const otherUser = conversation?.user || {};
  const [bg, fg] = avatarColor(otherUser?._id || "");
  const grouped = groupMessagesByDate(messages);

  const otherUserId = otherUser?._id ? String(otherUser._id) : null;
  const isBlocked = Boolean(
    otherUserId &&
    Array.isArray(Auth?.User?.blockedUsers) &&
    Auth.User.blockedUsers.some((u) => {
      const uId = u && typeof u === "object" ? u._id : u;
      return uId ? String(uId) === otherUserId : false;
    })
  );

  const checkQuarantinedMessages = useCallback(async () => {
    if (!conversation?._id) return;
    try {
      const { data } = await api.get(`/messages/${conversation._id}/quarantined-count`);
      setQuarantinedCount(data.count || 0);
    } catch (err) {
      console.error("checkQuarantinedMessages error:", err);
    }
  }, [conversation?._id]);

  useEffect(() => {
    if (conversation?._id && !isBlocked) {
      checkQuarantinedMessages();
    } else {
      setQuarantinedCount(0);
    }
  }, [conversation?._id, isBlocked, checkQuarantinedMessages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-transparent p-6 text-center relative overflow-hidden select-none">
        {/* Background Ambient Glow & Light Beams */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#6366f1]/25 via-[#38bdf8]/20 to-[#2dd4bf]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-[450px] h-[450px] bg-[#4f46e5]/15 blur-[160px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 15 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-sm flex flex-col items-center"
        >
          {/* Refined Brand Emblem */}
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#0c1228] border border-slate-200/90 dark:border-white/10 flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-black/50 mb-5 relative group">
            <span className="text-3xl">🫀</span>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#2dd4bf] ring-4 ring-slate-50 dark:ring-[#07090e]" />
          </div>

          {/* Brand Heading */}
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            PulseChat
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 text-center max-w-sm">
            Select a conversation from the sidebar to view your messages, or start a new direct conversation.
          </p>

          {/* Action Button */}
          {openNewChat && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openNewChat}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#4f46e5] to-[#38bdf8] text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </motion.button>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-2">
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-white/5 font-sans font-medium">Enter</span>
            <span>to send</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-white/5 font-sans font-medium">Shift + Enter</span>
            <span>new line</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleToggleBlock = async () => {
    try {
      const { data } = await api.post(`/auth/block/${otherUser?._id}`);
      if (data?.success) {
        const nextBlocked = data.success.isBlocked !== undefined ? data.success.isBlocked : !isBlocked;
        const userName = otherUser?.full_name || otherUser?.name || "this user";
        const message = nextBlocked
          ? `You blocked ${userName}. Messages sent from them will be quarantined.`
          : `You unblocked ${userName}.`;
        successtoast(message);

        const currentBlockedList = Array.isArray(Auth?.User?.blockedUsers) ? Auth.User.blockedUsers : [];
        const updatedBlocked = data.success.blockedUsers || (nextBlocked
          ? [...currentBlockedList, otherUser?._id]
          : currentBlockedList.filter(u => String(u?._id || u) !== String(otherUser?._id)));

        setAuth((prev) => ({
          ...prev,
          User: { ...(prev?.User || {}), blockedUsers: updatedBlocked }
        }));

        try {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...storedUser, blockedUsers: updatedBlocked }));
        } catch (storageErr) {
          console.warn("Storage update error:", storageErr);
        }

        if (!nextBlocked) {
          try {
            await checkQuarantinedMessages();
          } catch (e) {
            console.error("Quarantine check error:", e);
          }
          try {
            await refreshMessages();
          } catch (e) {
            console.error("Message refresh error:", e);
          }
        }
      }
    } catch (err) {
      console.error("handleToggleBlock error:", err);
      const userName = otherUser?.full_name || otherUser?.name || "this user";
      const backendMessage = err?.response?.data?.error || err?.response?.data?.message;
      errortoast(backendMessage || `Unable to update block status for ${userName}.`);
    }
  };

  const handleRestoreQuarantined = async () => {
    if (!conversation?._id) return;
    setRestoringQuarantine(true);
    try {
      const { data } = await api.post(`/messages/${conversation._id}/restore-quarantined`);
      successtoast(data.message || "Messages restored successfully!");
      setQuarantinedCount(0);
      await refreshMessages();
    } catch (err) {
      console.error("Failed to restore messages:", err);
      errortoast("Failed to restore quarantined messages");
    } finally {
      setRestoringQuarantine(false);
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!otherUser?._id) return;
    emitTyping(otherUser._id);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      emitStopTyping(otherUser._id);
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      audioTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to send voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(audioTimerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(audioTimerRef.current);
    setAudioBlob(null);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
    setRecordingTime(0);
  };

  const uploadAudioBlob = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        try {
          const { data } = await api.post("/messages/upload-audio", { audio: base64Audio });
          resolve(data.Location);
        } catch (error) {
          reject(error);
        }
      };
    });
  };

  const handleDownload = async (msg, type) => {
    try {
      const url = type === 'image' ? msg.image : msg.audioUrl;
      const proxyUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/messages/stream-audio?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `PulseChat_${type}_${Date.now()}.${type === 'image' ? 'png' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      
      // Mark as downloaded if I am not the sender
      if (String(msg.sender?._id || msg.sender) !== String(loggedInUserId)) {
        await markAsDownloaded(msg._id);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreviewUrl(reader.result);
      setImageBase64(reader.result);
    };
    e.target.value = null; // reset input
  };

  const cancelImage = () => {
    setImagePreviewUrl(null);
    setImageBase64(null);
  };

  const formatRecordingTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSend = async () => {
    if (isBlocked) {
      errortoast("You are blocked now. Unblock this user to continue chatting.");
      return;
    }

    if ((!text.trim() && !audioBlob && !imageBase64) || sending || uploadingAudio || uploadingImage) return;
    
    let audioUrl = null;
    let imageUrl = null;

    if (audioBlob) {
      setUploadingAudio(true);
      try {
        audioUrl = await uploadAudioBlob(audioBlob);
      } catch (err) {
        console.error("Audio upload failed", err);
        setUploadingAudio(false);
        return;
      }
      setUploadingAudio(false);
    }

    if (imageBase64) {
      setUploadingImage(true);
      try {
        const { data } = await api.post("/messages/upload-image", { image: imageBase64 });
        imageUrl = data.Location;
      } catch (err) {
        console.error("Image upload failed", err);
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const msg = text.trim();
    const reply = replyTo;
    setText("");
    setReplyTo(null);
    setAudioBlob(null);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
    setImageBase64(null);
    setImagePreviewUrl(null);
    emitStopTyping(otherUser?._id);
    await sendMessage(msg, reply, audioUrl, imageUrl);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
      <motion.div 
        animate={pulseActive ? {
          scale: [1, 1.03, 0.98, 1.02, 0.99, 1],
          boxShadow: [
            "0px 0px 0px rgba(239, 68, 68, 0)",
            "0px 0px 60px rgba(239, 68, 68, 0.8)",
            "0px 0px 20px rgba(239, 68, 68, 0.4)",
            "0px 0px 80px rgba(239, 68, 68, 0.9)",
            "0px 0px 0px rgba(239, 68, 68, 0)"
          ]
        } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`flex-1 h-full flex flex-col min-h-0 min-w-0 relative bg-white dark:bg-slate-950 transition-colors duration-500 select-none ${pulseActive ? "ring-4 ring-red-500/50" : ""}`}
        onContextMenu={(e) => e.preventDefault()}
      >

        <AnimatePresence>
          {pulseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-rose-500/90 to-pink-600/90 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-rose-500/30 backdrop-blur-md flex items-center gap-2.5 border border-rose-300/30">
                <span className="text-lg animate-bounce">🫀</span>
                <span>{pulseMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
      <div className="h-20 flex items-center justify-between gap-3 px-4 sm:px-6 border-b border-slate-200/80 dark:border-white/5 flex-shrink-0 bg-white/80 dark:bg-[#0c1228]/80 backdrop-blur-xl z-20 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button 
              onClick={onBack} 
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* User Avatar with Profile Modal Trigger */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfile(true)}
            className="cursor-pointer shrink-0"
          >
            <Avatar
              src={otherUser?.profilepicture || otherUser?.avatar}
              name={otherUser?.full_name || otherUser?.name}
              id={otherUser?._id || otherUser?.id}
              size="w-12 h-12 text-sm"
              rounded="rounded-2xl"
              showOnline={true}
              isOnline={otherUser?.isOnline}
              className="border border-white/10 group-hover:border-[#38bdf8]/40"
            />
          </motion.div>

          <div 
            onClick={() => setShowProfile(true)}
            className="flex-1 min-w-0 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <p className="text-base font-bold truncate tracking-tight text-slate-900 dark:text-white hover:text-[#38bdf8] transition-colors">
                {otherUser?.full_name || otherUser?.name || "Unknown"}
              </p>
              {otherUser?.isadmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs font-medium mt-0.5">
              {typingUsers ? (
                <span className="text-[#38bdf8] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                  <span>typing...</span>
                </span>
              ) : otherUser?.isOnline ? (
                <span className="text-[#2dd4bf] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_6px_#2dd4bf]" />
                  <span>Active now</span>
                </span>
              ) : otherUser?.lastSeen ? (
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                  Last seen {formatTime(otherUser.lastSeen)}
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">Last seen recently</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowProfile(true)}
            title="View Profile Details"
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200/80 dark:border-white/5 bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-[#38bdf8]/40 transition-all"
          >
            <User className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleToggleBlock}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title={isBlocked ? "Unblock Contact" : "Block Contact"}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              isBlocked 
                ? "border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "border-slate-200/80 dark:border-white/5 bg-slate-100/80 dark:bg-slate-800/60 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:border-rose-500/40"
            }`}
          >
            <ShieldBan className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {isBlocked && (
        <div className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 flex items-center justify-between gap-3 shadow-sm">
          <span>You blocked this user. They cannot send messages until you unblock them.</span>
          <button onClick={handleToggleBlock} className="font-semibold underline-offset-2 hover:underline">Unblock</button>
        </div>
      )}

      {/* Quarantined Messages Restoration Permission Banner */}
      <AnimatePresence>
        {quarantinedCount > 0 && !isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 my-2 p-3.5 rounded-2xl border border-[#38bdf8]/30 bg-gradient-to-r from-[#4f46e5]/10 via-[#38bdf8]/10 to-[#2dd4bf]/10 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#38bdf8] text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {quarantinedCount} {quarantinedCount === 1 ? "Message" : "Messages"} Sent During Block Period
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Would you like to restore them to your active conversation?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setQuarantinedCount(0)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Keep Archived
              </button>
              <button
                onClick={handleRestoreQuarantined}
                disabled={restoringQuarantine}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#4f46e5] to-[#38bdf8] text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                {restoringQuarantine ? "Restoring..." : `Restore (${quarantinedCount})`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-6 py-6 flex flex-col gap-2 custom-scrollbar bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500"
      >
        {loading ? (
          <div className="flex flex-col gap-4 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div
                  className="h-12 rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800"
                  style={{ width: `${140 + (i * 37) % 100}px` }}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-500 dark:text-slate-400">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-slate-100 dark:bg-slate-800">
              <span className="text-3xl">👋</span>
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Send a message to start the conversation</p>
          </div>
        ) : (
          grouped.map(({ label, messages: group }) => (
            <div key={label} className="flex flex-col gap-2">
              <div className="flex items-center justify-center my-4 sticky top-0 z-10 pointer-events-none">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800/90 backdrop-blur-md border border-slate-300/40 dark:border-white/5 px-3.5 py-1 rounded-full shadow-sm">
                  {label}
                </span>
              </div>

              {group.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg._id}
                      className="flex justify-center my-2"
                    >
                      <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 px-4 py-1.5 rounded-full shadow-sm">
                        {msg.text}
                      </span>
                    </motion.div>
                  );
                }

                const isMe =
                  String(msg.sender?._id || msg.sender) === String(loggedInUserId);
                
                const isOnlyImage = msg.image && !msg.text && !msg.audioUrl;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} group mb-1.5`}
                  >
                    <div className="flex flex-col max-w-[75%] sm:max-w-[70%]">

                      {/* reply preview inside bubble */}
                      {msg.replyTo && (
                        <div className={`text-xs px-3 py-2 rounded-xl mb-1.5 border-l-4 backdrop-blur-sm ${
                          isMe 
                            ? "bg-white/15 border-white/60 text-white" 
                            : "bg-slate-100/90 dark:bg-[#151e3b]/90 border-[#38bdf8] text-slate-800 dark:text-slate-200"
                        }`}>
                          <p className={`font-semibold text-[10px] mb-0.5 tracking-tight flex items-center gap-1 ${
                            isMe ? "text-white/90" : "text-[#38bdf8]"
                          }`}>
                            <Reply className="w-3 h-3 opacity-90" />
                            <span>{String(msg.replyTo.sender?._id || msg.replyTo.sender) === String(loggedInUserId) 
                              ? "You" 
                              : (msg.replyTo.sender?.full_name || "Someone")}</span>
                          </p>
                          {msg.replyTo.image ? (
                            <div className="flex items-center gap-2 mt-0.5">
                              <Image className="w-3.5 h-3.5 opacity-80" />
                              <span className="opacity-90 italic text-[11px]">Photo</span>
                            </div>
                          ) : msg.replyTo.audioUrl ? (
                            <div className="flex items-center gap-2 mt-0.5">
                              <Mic className="w-3.5 h-3.5 opacity-80" />
                              <span className="opacity-90 italic text-[11px]">Voice Note</span>
                            </div>
                          ) : (
                            <p className="truncate opacity-90">{msg.replyTo.text}</p>
                          )}
                        </div>
                      )}

                      <div className={`relative ${isOnlyImage ? 'p-1 rounded-2xl bg-transparent' : 'px-4 py-2.5 rounded-[18px]'} text-[14px] leading-relaxed transition-all ${
                        isMe
                          ? (isOnlyImage ? "" : "bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3b82f6] text-white shadow-md shadow-indigo-950/20 rounded-br-[4px] border border-white/10")
                          : (isOnlyImage ? "" : "bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-sm shadow-slate-200/40 dark:shadow-black/20 rounded-bl-[4px]")
                      } ${msg.status === "sending" ? "opacity-75" : "opacity-100"}`}>

                        {/* Action Bar on hover */}
                        {!msg.isDeleted && (
                          <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? 'right-full mr-2.5' : 'left-full ml-2.5'} opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 bg-white/95 dark:bg-[#131b36]/95 shadow-xl border border-slate-200/80 dark:border-white/10 rounded-full px-2 py-1 z-10 scale-95 group-hover:scale-100 backdrop-blur-md`}>
                            {isMe && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingId(msg._id);
                                    setEditText(msg.text);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(msg._id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {msg.text && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.text);
                                  successtoast("Copied to clipboard");
                                }}
                                className="p-1.5 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                title="Copy text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="p-1.5 text-slate-500 hover:text-[#38bdf8] dark:text-slate-400 dark:hover:text-[#38bdf8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                              title="Reply"
                            >
                              <Reply className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setForwardMessageId(msg._id)}
                              className="p-1.5 text-slate-500 hover:text-purple-500 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                              title="Forward"
                            >
                              <CornerUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {msg.isDeleted ? (
                          <p className="break-words italic opacity-70 flex items-center gap-2 text-xs">
                            <AlertCircle className="w-3.5 h-3.5" /> This message was deleted
                          </p>
                        ) : (
                          <>
                            {msg.image && (
                              <div className={`${msg.text || msg.audioUrl ? 'mb-2' : 'mb-0'} max-w-[250px] sm:max-w-[320px] relative group cursor-pointer`}>
                                <div 
                                  onClick={() => setLightboxImage(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/messages/stream-audio?url=${encodeURIComponent(msg.image)}`)}
                                  className="bg-slate-100 dark:bg-[#0c1228] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm relative hover:scale-[1.01] transition-transform"
                                >
                                  <img src={`${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/messages/stream-audio?url=${encodeURIComponent(msg.image)}`} alt="Attachment" className="w-full object-cover" />
                                </div>
                                <button
                                  onClick={() => handleDownload(msg, 'image')}
                                  className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
                                  title="Download Image"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            {msg.audioUrl && (
                               <div className={`${msg.text ? 'mb-2' : 'mb-0'} min-w-[200px] sm:min-w-[260px] relative group`}>
                                 <VoicePlayer src={msg.audioUrl} isMe={isMe} />
                                 <button
                                   onClick={() => handleDownload(msg, 'audio')}
                                   className={`absolute top-1/2 -translate-y-1/2 ${isMe ? 'left-0 -translate-x-[120%]' : 'right-0 translate-x-[120%]'} p-2 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-sm`}
                                   title="Download Audio"
                                 >
                                   <Download className="w-3.5 h-3.5" />
                                 </button>
                               </div>
                            )}
                            {msg.text && <p className="break-words">{msg.text}</p>}
                          </>
                        )}

                        <div className={`flex items-center justify-end gap-1.5 mt-1.5 ${
                          isMe ? "text-white/80" : "text-slate-400 dark:text-slate-500"
                        }`}>
                          <span className="text-[10px] font-mono">
                            {formatBubbleTime(msg.createdAt)}
                            {msg.editedAt && <span className="ml-1 opacity-70 font-sans">(edited)</span>}
                          </span>
                          {isMe && <MessageStatus status={msg.status} />}
                          {isMe && msg.downloadedBy && msg.downloadedBy.length > 0 && (msg.image || msg.audioUrl) && (
                            <span className="text-[9px] font-medium flex items-center gap-0.5 ml-1 text-emerald-200 bg-black/20 px-1 py-0.2 rounded">
                              <CheckCheck className="w-2.5 h-2.5" /> Saved
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Forwarded Indicators below message */}
                      {msg.isForwarded ? (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 italic ml-1">
                          <CornerUpRight className="w-3 h-3 text-[#38bdf8]" />
                          <span>Forwarded</span>
                        </div>
                      ) : (
                        msg.forwardCount > 0 && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-purple-500 dark:text-purple-400 mt-1 italic ml-1">
                            <CornerUpRight className="w-3 h-3" />
                            <span>Forwarded {msg.forwardCount} time{msg.forwardCount > 1 ? 's' : ''}</span>
                          </div>
                        )
                      )}

                      {/* failed message retry */}
                      {msg.status === "failed" && (
                        <button
                          onClick={() => retryMessage(msg)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 mt-1 self-end font-semibold transition-colors"
                        >
                          Tap to retry
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}

        {/* typing indicator bubble */}
        {typingUsers && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex justify-start mt-2"
          >
            <div className="bg-white/90 dark:bg-[#11182e]/90 border border-slate-200/80 dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md backdrop-blur-md">
              <div className="flex gap-1.5 items-center h-2">
                <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-[#2dd4bf] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-[#818cf8] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      <AnimatePresence>
        {replyTo && (
          <ReplyPreview msg={replyTo} onCancel={() => setReplyTo(null)} loggedInUserId={loggedInUserId} />
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="sticky bottom-0 p-2.5 sm:p-4 border-t flex-shrink-0 z-20 bg-white/80 dark:bg-[#0c1228]/80 border-slate-200/80 dark:border-white/5 backdrop-blur-2xl transition-colors duration-500">
        <div className="flex flex-wrap items-end gap-2 sm:gap-3 max-w-5xl mx-auto relative">
          
          <motion.button
            onClick={() => {
              sendPulse();
              setPulseMessage("Pulse Sent!");
              setTimeout(() => setPulseMessage(""), 1000);
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Send Pulse Ping"
            className="hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center transition-all flex-shrink-0 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)] border border-rose-500/30"
          >
            <span className="text-xl">🫀</span>
          </motion.button>
          
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-4 right-2 sm:right-14 bg-white/95 dark:bg-[#0e152e]/95 backdrop-blur-2xl shadow-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-3 w-64 sm:w-72 grid grid-cols-5 gap-2 z-50"
              >
                {["😀","😂","🥰","😎","😢","👍","❤️","🔥","🎉","✨","🤔","🙌","👏","🙏","😊","😍","😁","🙄","😜","😘"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    className="text-2xl hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0 border border-slate-200/80 dark:border-white/10 rounded-2xl relative flex items-center overflow-hidden transition-all bg-slate-100/90 dark:bg-[#0e1428]/90 focus-within:border-[#38bdf8]/50 focus-within:bg-white dark:focus-within:bg-[#131b36] shadow-sm focus-within:shadow-[0_0_25px_rgba(56,189,248,0.2)] h-[52px]">
            {isRecording ? (
              <div className="w-full h-full flex items-center justify-between px-3 sm:px-5 bg-rose-500/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 z-10" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 absolute animate-ping opacity-75" />
                  </div>
                  <span className="text-rose-500 font-mono font-medium tracking-wider text-xs sm:text-base w-10 sm:w-12">{formatRecordingTime(recordingTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={cancelRecording} 
                    className="flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={stopRecording} 
                    className="flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#38bdf8] hover:text-[#2dd4bf] hover:bg-[#38bdf8]/10 rounded-xl transition-colors sm:ml-1"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : audioPreviewUrl ? (
              <div className="w-full h-full flex items-center justify-between px-2 sm:px-4 bg-slate-100/80 dark:bg-slate-800/50">
                <div className="flex-1 flex items-center">
                  <VoicePlayer src={audioPreviewUrl} isMe={false} />
                </div>
                <button 
                  onClick={cancelRecording} 
                  className="p-1.5 sm:p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors flex-shrink-0"
                  title="Delete Recording"
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : imagePreviewUrl ? (
              <div className="w-full h-full flex items-center justify-between px-2 sm:px-4 bg-slate-100/80 dark:bg-slate-800/50">
                <div className="flex-1 flex items-center py-1">
                  <img src={imagePreviewUrl} alt="Preview" className="h-10 w-10 object-cover rounded-xl shadow-sm border border-slate-300 dark:border-white/10" />
                  <span className="ml-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Image attached</span>
                </div>
                <button 
                  onClick={cancelImage} 
                  className="p-1.5 sm:p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors flex-shrink-0"
                  title="Remove Image"
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isBlocked}
                  placeholder={replyTo ? "Type a reply..." : isBlocked ? "Messaging is paused while this contact is blocked" : "Type a message..."}
                  className="w-full h-full py-3.5 pl-4 sm:pl-6 pr-20 sm:pr-24 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[14.5px] outline-none disabled:cursor-not-allowed"
                />
                <label title="Attach Image" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-[#38bdf8] dark:hover:text-[#38bdf8] hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer absolute right-10 sm:right-12 z-10">
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
                <motion.button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors absolute right-1 sm:right-2 ${showEmojiPicker ? "text-[#38bdf8] bg-[#38bdf8]/10" : "text-slate-400 dark:text-slate-500 hover:text-[#38bdf8]"}`}
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </>
            )}
          </div>

          {(!text.trim() && !isRecording && !audioBlob && !imageBase64) ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              title="Record Voice Note"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex-shrink-0 shadow-sm border border-slate-200/80 dark:border-white/5"
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={(!text.trim() && !audioBlob && !imageBase64) || sending || uploadingAudio || uploadingImage}
              title="Send Message"
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white transition-all flex-shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 ${
                uploadingAudio || uploadingImage 
                  ? 'bg-gradient-to-r from-indigo-500 to-sky-500 animate-pulse' 
                  : 'bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {uploadingAudio || uploadingImage ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Edit Message Modal */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4"
            onClick={() => setEditingId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0d1326] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Edit Message</h3>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3.5 bg-slate-100 dark:bg-[#141b36] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-[#38bdf8]/60 focus:shadow-[0_0_15px_rgba(56,189,248,0.2)] resize-none text-sm transition-all"
                rows="4"
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await editMessage(editingId, editText);
                    setEditingId(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-semibold rounded-xl hover:opacity-95 shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all text-sm"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Message Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md p-4"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0d1326] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200/80 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Delete Message?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">This action permanently deletes this message from this thread.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await deleteMessage(deletingId);
                    setDeletingId(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other User Profile Modal */}
      {showProfile && (
        <ProfileModal 
          user={otherUser} 
          onClose={() => setShowProfile(false)} 
        />
        )}

      <ForwardModal 
        isOpen={!!forwardMessageId}
        onClose={() => setForwardMessageId(null)}
        onForward={(targetConversationId) => {
          forwardMessage(forwardMessageId, targetConversationId);
        }}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Full Preview"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
  );
};

export default ChatWindow;