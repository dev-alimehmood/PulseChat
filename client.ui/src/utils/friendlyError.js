/**
 * User-Friendly Error Sanitizer for PulseChat
 * 
 * Filters out raw database queries, stack traces, Axios error objects,
 * and technical server errors into clean, human-readable, reassuring messages.
 */

export function getFriendlyErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err) return fallback;

  // Extract message candidate
  let rawMsg = "";
  if (typeof err === "string") {
    rawMsg = err;
  } else if (err?.response?.data) {
    const data = err.response.data;
    rawMsg = data.message || data.error || (typeof data === "string" ? data : "");
  } else if (err?.message) {
    rawMsg = err.message;
  }

  if (!rawMsg || typeof rawMsg !== "string") {
    return fallback;
  }

  const lower = rawMsg.toLowerCase();

  // 1. Network & Connectivity / Socket Drops
  if (
    lower.includes("network error") ||
    lower.includes("econnrefused") ||
    lower.includes("econnreset") ||
    lower.includes("read econnreset") ||
    lower.includes("socket hang up") ||
    lower.includes("connection reset") ||
    lower.includes("failed to fetch") ||
    lower.includes("net::err") ||
    lower.includes("networkrequestfailed") ||
    lower.includes("etimedout") ||
    lower.includes("enetunreach") ||
    lower.includes("ehostunreach") ||
    lower.includes("eai_again") ||
    lower.includes("topology was destroyed") ||
    lower.includes("serverselectionerror")
  ) {
    return "Unable to connect to PulseChat servers. Please check your internet connection.";
  }

  // 2. Authentication & Session Lifespan
  if (
    lower.includes("jwt expired") ||
    lower.includes("jwt malformed") ||
    lower.includes("invalid token") ||
    lower.includes("token expired") ||
    lower.includes("jwt must be provided") ||
    lower.includes("authorization denied") ||
    lower.includes("no token")
  ) {
    return "Your session has expired. Please sign in again to continue.";
  }

  // 3. User Blocked or Quarantined
  if (lower.includes("blocked") || lower.includes("quarantine")) {
    return "This contact is currently blocked. Unblock them to resume messaging.";
  }

  // 4. Duplicate Records (e.g. Mongo E11000)
  if (
    lower.includes("e11000") ||
    lower.includes("duplicate key") ||
    lower.includes("already registered") ||
    lower.includes("already exists")
  ) {
    return "An account with this email address already exists. Try signing in instead.";
  }

  // 5. Password Criteria
  if (lower.includes("password must be") || lower.includes("password validation")) {
    return "Password must be at least 8 characters and include uppercase, lowercase, and numbers.";
  }

  // 6. Invalid Credentials
  if (
    lower.includes("invalid password") ||
    lower.includes("incorrect password") ||
    lower.includes("invalid credentials") ||
    lower.includes("user not found") ||
    lower.includes("email not found")
  ) {
    return "The email or password you entered is incorrect.";
  }

  // 7. Rate Limits
  if (lower.includes("too many requests") || lower.includes("rate limit") || lower.includes("429")) {
    return "Too many attempts. Please pause for a moment before trying again.";
  }

  // 8. Server Exceptions (500, Mongo, Syntax, Casting)
  if (
    lower.includes("internal server error") ||
    lower.includes("500") ||
    lower.includes("status code 500") ||
    lower.includes("mongoerror") ||
    lower.includes("casterror") ||
    lower.includes("syntaxerror") ||
    lower.includes("cannot read properties") ||
    lower.includes("null is not an object") ||
    lower.includes("undefined is not an object")
  ) {
    return "We are experiencing a temporary service hiccup. Please try again shortly.";
  }

  // 9. Resource Not Found (404)
  if (lower.includes("not found") || lower.includes("404")) {
    return "The requested conversation or user could not be found.";
  }

  // 10. Permission Denied (403)
  if (lower.includes("forbidden") || lower.includes("not authorized") || lower.includes("permission denied")) {
    return "You do not have permission to perform this action.";
  }

  // Clean technical prefixes like "Error: ", "AxiosError: "
  const cleaned = rawMsg
    .replace(/^(axioserror|error|mongoerror|typeerror):\s*/i, "")
    .trim();

  // If the message looks like a stack trace or raw code snippet, return fallback
  if (cleaned.includes("at ") && cleaned.includes("(") && cleaned.includes(".js")) {
    return fallback;
  }

  // Capitalize first letter and ensure ending punctuation
  if (cleaned.length > 0) {
    const formatted = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return formatted.endsWith(".") || formatted.endsWith("!") ? formatted : `${formatted}.`;
  }

  return fallback;
}
