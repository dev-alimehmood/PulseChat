import { useState, useEffect, useRef } from "react";
import { getInitials, avatarColor } from "../../utils/chat";
import { 
  ArrowLeft, Edit2, Check, User, MapPin, Phone, Camera, ShieldBan, Save, 
  Trash2, Mail, Calendar, ShieldCheck, Sparkles, Loader2, RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../services/api";
import { successtoast, errortoast } from "../../toastify/toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// High-speed client-side image compressor keeping base64 under 100KB
const compressImage = (file, maxWidth = 500, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(elem.toDataURL("image/jpeg", quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const Profile = () => {
  const [Auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const targetUser = location.state?.user || Auth?.User;
  const isMe = String(Auth?.User?._id) === String(targetUser?._id);
  const user = targetUser;

  const [bg, fg] = avatarColor(user?._id || "");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Editable fields
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    city: user?.city || "",
    phonenumber: user?.phonenumber || "",
    full_name: user?.full_name || "",
    profilepicture: user?.profilepicture || ""
  });
  
  const [newImagePreview, setNewImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        city: user.city || "",
        phonenumber: user.phonenumber || "",
        full_name: user.full_name || "",
        profilepicture: user.profilepicture || ""
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 dark:bg-[#07090e]">
        <div className="w-10 h-10 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleImageSelect = async (e) => {
    if (!isMe) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const compressed = await compressImage(file);
      setNewImagePreview(compressed);

      // Attempt immediate upload
      let finalUrl = compressed;
      try {
        const { data: uploadData } = await api.post("/messages/upload-image", { image: compressed });
        if (uploadData.Location) {
          finalUrl = uploadData.Location;
        }
      } catch (uploadError) {
        // Fallback: save compressed base64 directly to user profile
        console.warn("S3 upload failed, falling back to compressed base64:", uploadError);
        finalUrl = compressed;
      }

      // Save directly to profile for immediate seamless update
      const updatedFormData = { ...formData, profilepicture: finalUrl };
      const { data } = await api.put("/users/profile", updatedFormData);
      if (data.success && data.success.user) {
        setAuth((prev) => ({
          ...prev,
          User: { ...prev.User, ...data.success.user }
        }));
        localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...data.success.user }));
        setFormData(updatedFormData);
        successtoast("Profile picture updated!");
      }
    } catch (err) {
      console.error("Failed to process image", err);
      errortoast("Failed to update profile picture");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!isMe) return;
    setSaving(true);
    try {
      const updatedFormData = { ...formData, profilepicture: "" };
      const { data } = await api.put("/users/profile", updatedFormData);
      if (data.success && data.success.user) {
        setAuth((prev) => ({
          ...prev,
          User: { ...prev.User, ...data.success.user, profilepicture: "" }
        }));
        localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...data.success.user, profilepicture: "" }));
        setFormData(updatedFormData);
        setNewImagePreview(null);
        successtoast("Profile picture removed");
      }
    } catch (err) {
      errortoast("Failed to remove profile picture");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!isMe) return;
    setSaving(true);
    try {
      const updatedFormData = { ...formData };
      const { data } = await api.put("/users/profile", updatedFormData);
      if (data.success && data.success.user) {
        setAuth((prev) => ({
          ...prev,
          User: { ...prev.User, ...data.success.user }
        }));
        localStorage.setItem("user", JSON.stringify({ ...Auth.User, ...data.success.user }));
        successtoast("Profile updated successfully!");
        setFormData(updatedFormData);
        setEditMode(false);
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

  const currentDisplayPhoto = newImagePreview || formData.profilepicture;

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 custom-scrollbar relative selection:bg-[#38bdf8]/30 transition-colors duration-500">
      
      {/* Ambient background glow matching Landing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#6366f1]/15 via-[#38bdf8]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/chatpage")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0e1630]/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-[#38bdf8]/50 transition-all backdrop-blur-md shadow-sm text-xs sm:text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </button>

          {isMe && (
            <div className="flex items-center gap-3">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#4f46e5] to-[#38bdf8] text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(false);
                    setNewImagePreview(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 dark:bg-[#0c1228]/90 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-2xl transition-all duration-300">
          
          {/* Header Row: Avatar & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-slate-100 dark:border-white/5">
            
            {/* Avatar with Camera Trigger */}
            <div className="relative group shrink-0">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-2xl ring-4 ring-slate-100 dark:ring-[#07090e] overflow-hidden border border-white/20 transition-all relative"
                style={!currentDisplayPhoto ? { background: bg, color: fg } : {}}
              >
                {currentDisplayPhoto ? (
                  <img 
                    src={currentDisplayPhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  getInitials(user?.full_name)
                )}

                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-xs">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera Upload Badge */}
              {isMe && (
                <>
                  <label
                    title="Change Profile Photo"
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white flex items-center justify-center shadow-lg shadow-[#38bdf8]/30 cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-white dark:border-[#0c1228]"
                  >
                    <Camera className="w-5 h-5" />
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                      className="hidden" 
                    />
                  </label>
                </>
              )}
            </div>

            {/* Identity Info */}
            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full text-base sm:text-lg font-bold bg-slate-100/80 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-[#38bdf8] transition-all text-slate-900 dark:text-white"
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full text-sm bg-slate-100/80 dark:bg-[#070b18] border border-slate-200/80 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-[#38bdf8] transition-all text-slate-900 dark:text-white resize-none"
                      placeholder="Write a brief bio..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {user?.full_name || "Unknown User"}
                    </h2>
                    {user?.isadmin && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4 text-[#38bdf8]" />
                    <span>{user?.email}</span>
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-[#080d1e]/80 border border-slate-200/70 dark:border-white/5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      About
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {user?.bio || "No bio added yet."}
                    </p>
                  </div>
                </>
              )}

              {/* Photo Actions if photo exists */}
              {isMe && currentDisplayPhoto && (
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-[#38bdf8] hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> Change Photo
                  </button>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <button
                    onClick={handleRemovePhoto}
                    className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            
            {/* Location */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#080d1e]/60 border border-slate-200/70 dark:border-white/5">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  City / Location
                </p>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white dark:bg-[#070b18] border border-slate-200/80 dark:border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#38bdf8] text-slate-900 dark:text-white"
                    placeholder="e.g. San Francisco, CA"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    {user?.city || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#080d1e]/60 border border-slate-200/70 dark:border-white/5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Phone Number
                </p>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.phonenumber}
                    onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                    className="w-full bg-white dark:bg-[#070b18] border border-slate-200/80 dark:border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#38bdf8] text-slate-900 dark:text-white"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    {user?.phonenumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#080d1e]/60 border border-slate-200/70 dark:border-white/5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Pulse Network Member
                </p>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified Member'}
                </p>
              </div>
            </div>

            {/* Presence & Security */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-[#080d1e]/60 border border-slate-200/70 dark:border-white/5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Security Status
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]" />
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    Active & Protected
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons for Edit Mode */}
          {editMode && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setEditMode(false);
                  setNewImagePreview(null);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#4f46e5] to-[#38bdf8] text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
