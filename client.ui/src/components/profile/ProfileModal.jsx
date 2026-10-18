import { useState, useEffect } from "react";
import { getInitials, avatarColor } from "../../utils/chat";
import Avatar from "../shared/Avatar";
import { 
  X, MessageSquare, Clock, Calendar, Edit2, Check, User, MapPin, 
  Phone, Camera, ShieldBan, ShieldCheck, Mail, Sparkles 
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
      {/* Container: Full screen on mobile, modal on desktop */}
      <div className="relative w-full h-[100dvh] md:h-[88vh] md:max-h-[820px] md:w-[460px] flex flex-col rounded-none md:rounded-3xl shadow-2xl bg-white dark:bg-[#0c1228] md:border border-slate-200/80 dark:border-white/10 overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col w-full h-full min-h-0">
          
          {/* Native App Header */}
          <div className="shrink-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#0c1228]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-base">🫀</span>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Profile Dossier</h1>
            </div>

            {isMe && !editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20"
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 py-6 space-y-6 relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-[#38bdf8]/15 via-[#6366f1]/10 to-transparent pointer-events-none" />

            {/* Profile Avatar Section */}
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="relative group">
                <div className="relative z-10">
                  <Avatar
                    src={displayPhoto}
                    name={displayName}
                    id={user?._id}
                    size="w-24 h-24 text-3xl"
                    rounded="rounded-3xl"
                    showOnline={!editMode}
                    isOnline={user?.isOnline}
                    className="shadow-2xl ring-4 ring-white dark:ring-[#0c1228] border border-white/10"
                  />
                </div>

                {isMe && (
                  <label
                    title="Upload profile photo"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#38bdf8] text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-white dark:border-[#0c1228] z-20"
                  >
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div className="w-full relative z-10">
                {editMode ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white"
                    placeholder="Your Full Name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {displayName}
                  </h2>
                )}
                <p className="text-sm mt-1 text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email || "No email available"}
                </p>

                {/* Blocked Badge if user is blocked */}
                {!isMe && isBlocked && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold">
                    <ShieldBan className="w-3.5 h-3.5" />
                    <span>Contact Blocked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details Cards */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-white/5">
              
              {/* Bio Section */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                  About
                </span>
                {editMode ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white resize-none"
                    placeholder="Write something about yourself..."
                    rows={3}
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {formData.bio || user?.bio || "Hi how i can help you"}
                  </span>
                )}
              </div>

              {/* Location & Phone Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    City
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white"
                      placeholder="City"
                    />
                  ) : (
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                      {formData.city || user?.city || "any"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    Phone
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.phonenumber}
                      onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-[#38bdf8] outline-none text-slate-900 dark:text-white"
                      placeholder="Phone"
                    />
                  ) : (
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                      {formData.phonenumber || user?.phonenumber || "3244323234"}
                    </span>
                  )}
                </div>
              </div>

              {/* Status & Member Since */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${user?.isOnline ? "bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" : "bg-slate-400 dark:bg-slate-600"}`} />
                  Status
                </span>
                <span className={`text-sm font-bold ${user?.isOnline ? "text-[#2dd4bf]" : "text-slate-500 dark:text-slate-400"}`}>
                  {user?.isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#090e1f] border border-slate-200/80 dark:border-white/5 shadow-sm">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Joined PulseChat
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Member"}
                </span>
              </div>
            </div>
          </div>

          {/* Fixed Pinned Bottom Action Footer (Always Visible) */}
          <div className="shrink-0 p-5 bg-white/95 dark:bg-[#090d1d]/95 border-t border-slate-100 dark:border-white/10 backdrop-blur-xl z-20 flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
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
                {!isMe && (
                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleToggleBlock}
                      disabled={togglingBlock}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm border ${
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
                      className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
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
