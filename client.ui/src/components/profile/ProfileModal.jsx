import { useState } from "react";
import { getInitials, avatarColor } from "../../utils/chat";
import { X, MessageSquare, Clock, Calendar, Edit2, Check, User, MapPin, Phone } from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { successtoast, errortoast } from "../../toastify/toastify";
import ModalWrapper from "../shared/ModalWrapper";
import AnimatedReveal from "../shared/AnimatedReveal";
import { Camera, ShieldBan } from "lucide-react";

const ProfileModal = ({ user, onClose }) => {
  const [Auth, setAuth] = useAuth();
  const [bg, fg] = avatarColor(user?._id || "");

  const isMe = String(Auth?.User?._id) === String(user?._id);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    city: user?.city || "",
    phonenumber: user?.phonenumber || "",
    full_name: user?.full_name || "",
    profilepicture: user?.profilepicture || ""
  });

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", formData);
      if (data.success && data.success.user) {
        // Update auth context with new user data
        setAuth((prev) => ({
          ...prev,
          User: { ...prev.User, ...data.success.user }
        }));
        // Update local storage
        localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...data.success.user }));
        successtoast(data.success.message || "Profile updated successfully");
        onClose(); // Exit the modal completely
      } else if (data.error) {
        errortoast(data.error);
      }
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
            if (data.success && data.success.user) {
              setAuth((prev) => ({
                ...prev,
                User: { ...prev.User, ...data.success.user }
              }));
              localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...data.success.user }));
              successtoast("Profile photo updated!");
            }
          } catch (err) {
            console.error(err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockUser = async () => {
    try {
      const { data } = await api.post(`/auth/block/${user._id}`);
      if (data.success) {
        successtoast(data.success.message);
        onClose(); // Close modal on block
      }
    } catch (err) {
      errortoast("Failed to block user");
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      {/* Container: Full screen on mobile, modal on desktop */}
      <div
        className="relative w-full h-[100dvh] md:h-auto md:w-[420px] md:max-h-[90vh] flex flex-col rounded-none md:rounded-3xl transform shadow-2xl bg-white dark:bg-[#0c1228] md:border border-slate-200/80 dark:border-white/10 overflow-hidden backdrop-blur-2xl"
      >
          <div className="flex flex-col w-full h-full">
            
            {/* Native App Header */}
            <div className="shrink-0 z-20 flex items-center justify-between px-5 py-4 bg-white/80 dark:bg-[#0e1630]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 md:border-none">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                <div className="w-10 h-10" /> // Spacer for alignment
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8 md:px-8 relative">
              {/* Premium Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-[#38bdf8]/15 via-[#6366f1]/10 to-transparent pointer-events-none" />

              {/* Profile Avatar Section */}
              <div className="relative flex flex-col items-center gap-4 text-center mt-4">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl ring-4 ring-white dark:ring-[#0c1228] transition-all duration-300 relative z-10 overflow-hidden border border-white/10"
                    style={!formData.profilepicture ? { background: bg, color: fg } : {}}
                  >
                    {formData.profilepicture ? (
                      <img src={formData.profilepicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.full_name)
                    )}

                    {!editMode && user?.isOnline && (
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#2dd4bf] border-2 border-white dark:border-[#0c1228] z-10" />
                    )}
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
                      className="w-full text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h2 className="text-3xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {user?.full_name || 'User'}
                    </h2>
                  )}
                  <p className="text-sm mt-1 text-slate-500 dark:text-slate-400 font-medium">
                    {user?.email || 'No email'}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 pt-8 mt-2 border-t border-slate-100 dark:border-slate-800/50">

                {/* Bio Section */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" />
                    About
                  </span>
                  {editMode ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white resize-none"
                      placeholder="Write something about yourself..."
                      rows={3}
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-relaxed">
                      {user?.bio || "Hey there! I am using PulseChat."}
                    </span>
                  )}
                </div>

                {/* Location & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      City
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                        placeholder="City"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                        {user?.city || "Not set"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-green-500" />
                      Phone
                    </span>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.phonenumber}
                        onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                        placeholder="Phone"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                        {user?.phonenumber || "Not set"}
                      </span>
                    )}
                  </div>
                </div>

                {!editMode && (
                  <>
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shadow-sm ${user?.isOnline ? 'bg-green-500' : 'bg-slate-400 dark:bg-slate-500'}`} />
                        Status
                      </span>
                      <span className={`text-sm font-bold ${user?.isOnline ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {user?.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    {/* Member Since */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 shadow-sm">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        Joined
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 mt-4">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-200 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
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
                      <div className="flex w-full gap-2.5">
                        <button
                          onClick={handleBlockUser}
                          className="w-14 py-3.5 rounded-2xl font-bold transition-all duration-200 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center"
                          title="Block Contact"
                        >
                          <ShieldBan className="w-5 h-5" />
                        </button>
                        <button
                          onClick={onClose}
                          className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-200 bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] hover:opacity-95 flex items-center justify-center gap-2 text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Send Message
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
      </div>
    </ModalWrapper>
  );
};

export default ProfileModal;
