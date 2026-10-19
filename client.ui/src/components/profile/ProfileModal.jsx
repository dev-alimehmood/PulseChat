import { useState, useEffect } from "react";
import { getInitials, avatarColor, formatTime } from "../../utils/chat";
import Avatar from "../shared/Avatar";
import { 
  X, MessageSquare, Calendar, Edit2, Check, User, MapPin, 
  Phone, Camera, ShieldBan, ShieldCheck, Mail, Sparkles, Copy, CheckCircle2 
} from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { successtoast, errortoast } from "../../toastify/toastify";
import ModalWrapper from "../shared/ModalWrapper";

const ProfileModal = ({ user, onClose }) => {
  const [Auth, setAuth] = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingBlock, setTogglingBlock] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const isMe = String(Auth?.User?._id) === String(user?._id);
  const isBlocked = Auth?.User?.blockedUsers?.some(
    (u) => String(u._id || u) === String(user?._id)
  );

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    city: user?.city || "",
    phonenumber: user?.phonenumber || "",
    full_name: user?.full_name || user?.name || "",
    profilepicture: user?.profilepicture || user?.avatar || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user?.bio || "",
        city: user?.city || "",
        phonenumber: user?.phonenumber || "",
        full_name: user?.full_name || user?.name || "",
        profilepicture: user?.profilepicture || user?.avatar || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    successtoast(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", formData);
      const updatedUser = data?.success?.user || data?.user || { ...Auth.User, ...formData };
      setAuth((prev) => ({
        ...prev,
        User: { ...prev.User, ...updatedUser },
      }));
      localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...updatedUser }));
      successtoast(data?.success?.message || "Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      errortoast(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        let finalUrl = base64String;
        try {
          const { data } = await api.post("/messages/upload-image", { image: base64String });
          if (data.Location) {
            finalUrl = data.Location;
          }
        } catch (error) {
          finalUrl = base64String;
        }

        setFormData((prev) => ({ ...prev, profilepicture: finalUrl }));

        if (isMe) {
          try {
            const { data } = await api.put("/users/profile", { ...formData, profilepicture: finalUrl });
            const updatedUser = data?.success?.user || data?.user || { ...Auth.User, ...formData, profilepicture: finalUrl };
            setAuth((prev) => ({
              ...prev,
              User: { ...prev.User, ...updatedUser },
            }));
            localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...updatedUser }));
            setFormData((prev) => ({ ...prev, profilepicture: updatedUser.profilepicture || finalUrl }));
            successtoast("Profile photo updated!");
          } catch (err) {
            console.error(err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleBlock = async () => {
    setTogglingBlock(true);
    try {
      const { data } = await api.post(`/auth/block/${user._id}`);
      if (data?.success) {
        const nextBlocked = data.success.isBlocked !== undefined ? data.success.isBlocked : !isBlocked;
        const currentBlockedList = Array.isArray(Auth?.User?.blockedUsers) ? Auth.User.blockedUsers : [];
        const updatedBlocked = data.success.blockedUsers || (nextBlocked
          ? [...currentBlockedList, user._id]
          : currentBlockedList.filter((u) => String(u?._id || u) !== String(user._id)));

        setAuth((prev) => ({
          ...prev,
          User: { ...(prev?.User || {}), blockedUsers: updatedBlocked },
        }));

        try {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...storedUser, blockedUsers: updatedBlocked })
          );
        } catch (storageErr) {
          console.warn("Storage update error:", storageErr);
        }

        const userName = user.full_name || user.name || "Contact";
        if (nextBlocked) {
          successtoast(`Blocked ${userName}. Messages from them are now quarantined.`);
        } else {
          successtoast(`Unblocked ${userName}. Conversation restored.`);
        }
      }
    } catch (err) {
      console.error(err);
      errortoast("Failed to update block status");
    } finally {
      setTogglingBlock(false);
    }
  };

  const displayPhoto = formData.profilepicture || user?.profilepicture || user?.avatar;
  const displayName = formData.full_name || user?.full_name || user?.name || "User";

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative w-full h-[100dvh] md:h-auto md:max-h-[820px] md:w-[460px] flex flex-col rounded-none md:rounded-3xl shadow-2xl bg-white dark:bg-[#0c1228] md:border border-slate-200/80 dark:border-white/10 overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col w-full h-full min-h-0">
          
          {/* Header */}
          <div className="shrink-0 z-20 flex items-center justify-between px-5 py-4 bg-white/90 dark:bg-[#0c1228]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="PulseChat" className="w-5 h-5 object-contain" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                {isMe ? "My Profile" : "Profile Card"}
              </h2>
            </div>

            {isMe && !editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] hover:bg-[#38bdf8]/20"
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-6 space-y-6 relative">
            
            {/* Subtle Ambient Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-b from-[#6366f1]/15 via-[#38bdf8]/10 to-transparent pointer-events-none" />

            {/* Profile Avatar & Identity Hero */}
            <div className="relative flex flex-col items-center gap-3.5 text-center">
              <div className="relative group">
                <Avatar
                  src={displayPhoto}
                  name={displayName}
                  id={user?._id}
                  size="w-24 h-24 text-3xl"
                  rounded="rounded-3xl"
                  showOnline={!editMode && !isMe}
                  isOnline={user?.isOnline}
                  className="shadow-2xl ring-4 ring-white dark:ring-white/10 border border-white/20"
                />

                {/* Camera upload overlay for logged-in user */}
                {isMe && (
                  <label
                    title="Upload profile photo"
                    className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#38bdf8]/30 cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-white dark:border-slate-800 z-30"
                  >
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Name & Identity */}
              <div className="w-full relative z-10 flex flex-col items-center">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full max-w-xs text-center text-lg font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white transition-all"
                    placeholder="Your Full Name"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {displayName}
                    </h3>
                    {user?.isadmin && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20">
                        ADMIN
                      </span>
                    )}
                  </div>
                )}

                {/* Status Badges */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  {!isMe ? (
                    user?.isOnline ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-semibold shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Active now</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-white/5 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{user?.lastSeen ? `Last seen ${formatTime(user.lastSeen)}` : "Offline"}</span>
                      </div>
                    )
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] border border-[#38bdf8]/25 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Pulse Member</span>
                    </div>
                  )}

                  {!isMe && isBlocked && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold">
                      <ShieldBan className="w-3.5 h-3.5" />
                      <span>Contact Blocked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details Cards */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
              
              {/* Bio Section */}
              <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                  About
                </span>
                {editMode ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white resize-none mt-1"
                    placeholder="Write something about yourself..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                    {formData.bio || user?.bio || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Email Card with Copy Button */}
              {user?.email && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(user.email, "Email")}
                    title="Copy Email"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
                  >
                    {copiedField === "Email" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Location & Phone Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    City
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white"
                      placeholder="City"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {formData.city || user?.city || "Not specified"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    Phone
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.phonenumber}
                      onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white"
                      placeholder="Phone"
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {formData.phonenumber || user?.phonenumber || "Not added"}
                      </span>
                      {(formData.phonenumber || user?.phonenumber) && (
                        <button
                          onClick={() => handleCopy(formData.phonenumber || user?.phonenumber, "Phone")}
                          title="Copy Phone"
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded"
                        >
                          {copiedField === "Phone" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Joined PulseChat
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Member"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="shrink-0 p-4 sm:p-5 bg-white/95 dark:bg-[#090d1d]/95 border-t border-slate-100 dark:border-white/10 backdrop-blur-xl z-20 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl font-bold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-70 text-xs sm:text-sm"
                >
                  {saving ? "Saving..." : (
                    <>
                      <Check className="w-4 h-4" /> Save Profile
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {!isMe ? (
                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleToggleBlock}
                      disabled={togglingBlock}
                      className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm border ${
                        isBlocked
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                      }`}
                    >
                      {isBlocked ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Unblock Contact</span>
                        </>
                      ) : (
                        <>
                          <ShieldBan className="w-4 h-4" />
                          <span>Block Contact</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl font-semibold transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm"
                  >
                    Close
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProfileModal;
