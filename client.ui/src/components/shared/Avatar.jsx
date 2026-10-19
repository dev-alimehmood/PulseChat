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

const DOT_SIZES = {
  xs: "w-2 h-2 -bottom-0.5 -right-0.5",
  sm: "w-2.5 h-2.5 -bottom-0.5 -right-0.5",
  md: "w-3 h-3 bottom-0 right-0",
  lg: "w-3.5 h-3.5 bottom-0 right-0",
  xl: "w-4 h-4 bottom-0.5 right-0.5",
  "2xl": "w-5 h-5 bottom-1 right-1",
  "3xl": "w-6 h-6 bottom-1.5 right-1.5",
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

  // Determine appropriate dot size based on size prop
  let dotClasses = DOT_SIZES[size];
  if (!dotClasses) {
    if (typeof size === "string" && (size.includes("w-24") || size.includes("w-28") || size.includes("w-32"))) {
      dotClasses = DOT_SIZES["2xl"];
    } else if (typeof size === "string" && size.includes("w-16")) {
      dotClasses = DOT_SIZES["xl"];
    } else if (typeof size === "string" && (size.includes("w-12") || size.includes("w-11"))) {
      dotClasses = DOT_SIZES["lg"];
    } else {
      dotClasses = DOT_SIZES["md"];
    }
  }

  const canShowImage = Boolean(resolvedSrc) && !imgError;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 ${sizeClasses} ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Inner Avatar Container with overflow hidden to clip image/initials */}
      <div
        className={`w-full h-full overflow-hidden flex items-center justify-center font-bold tracking-tight select-none transition-all duration-300 shadow-sm ${rounded} ${className}`}
        style={{ background: bg, color: fg }}
      >
        {canShowImage ? (
          <img
            src={resolvedSrc}
            alt={alt || name || "Avatar"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
            loading="lazy"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online Status Badge (unclipped on outer container) */}
      {showOnline && isOnline && (
        <span
          className={`absolute rounded-full bg-emerald-400 dark:bg-emerald-400 ring-1.5 ring-white dark:ring-transparent shadow-[0_0_10px_rgba(52,211,153,0.9)] z-20 pointer-events-none ${dotClasses}`}
          title="Online"
        />
      )}
    </div>
  );
}
