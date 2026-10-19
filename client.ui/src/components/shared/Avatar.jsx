import { useState, useEffect } from "react";
import { getInitials, avatarColor, resolveAvatarUrl } from "../../utils/chat";

const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-3xl",
  "3xl": "w-28 h-28 sm:w-32 sm:h-32 text-4xl sm:text-5xl",
};

export default function Avatar({
  src,
  name = "",
  id = "",
  size = "md",
  rounded = "rounded-2xl",
  showOnline = false,
  isOnline = false,
  className = "",
  alt = "",
  onClick,
}) {
  const [imgError, setImgError] = useState(false);

  // Reset error state whenever the source changes
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const resolvedSrc = resolveAvatarUrl(src);
  const [bg, fg] = avatarColor(id || name || "");
  const initials = getInitials(name);
  const sizeClasses = SIZES[size] || size;

  const canShowImage = Boolean(resolvedSrc) && !imgError;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden shrink-0 flex items-center justify-center font-bold tracking-tight select-none transition-all duration-300 shadow-sm ${sizeClasses} ${rounded} ${className}`}
      style={{ background: bg, color: fg }}
    >
      {canShowImage ? (
        <img
          src={resolvedSrc}
          alt={alt || name || "Avatar"}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <span>{initials}</span>
      )}

      {showOnline && isOnline && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2dd4bf] ring-2 ring-white dark:ring-[#090d1b] shadow-[0_0_8px_#2dd4bf] z-10"
          title="Online"
        />
      )}
    </div>
  );
}
