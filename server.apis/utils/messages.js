/**
 * Standardized API response utilities for PulseChat backend
 */

export const catchErr = (err, res) => {
  console.error("❌ Backend caught exception:", err);

  const rawMsg = err?.message || "";
  const lower = rawMsg.toLowerCase();

  // Socket, network, or database disconnects
  if (
    lower.includes("econnreset") ||
    lower.includes("econnrefused") ||
    lower.includes("socket") ||
    lower.includes("topology") ||
    lower.includes("timed out") ||
    lower.includes("serverselectionerror")
  ) {
    return res.status(503).json({
      error: "Service is temporarily reconnecting. Please try again in a moment.",
    });
  }

  // Duplicate key errors (e.g. Mongo E11000)
  if (lower.includes("e11000") || lower.includes("duplicate key")) {
    return res.status(409).json({
      error: "An account with these details already exists.",
    });
  }

  // Token errors
  if (lower.includes("jwt") || lower.includes("token")) {
    return res.status(401).json({
      error: "Your session token is invalid or has expired. Please sign in again.",
    });
  }

  // Generic fallback: never leak raw stack traces or internal socket strings to clients
  res.status(500).json({
    error: "A temporary server error occurred. Please try again shortly.",
  });
};

export const error = (arg, res) => {
  res.status(400).json({
    error: arg,
  });
};

export const warning = (arg, res) => {
  res.status(400).json({
    warning: arg,
  });
};

export const success = (arg, res) => {
  res.status(200).json({
    success: arg,
  });
};