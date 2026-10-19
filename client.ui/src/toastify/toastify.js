import { Bounce, Zoom, toast } from 'react-toastify';
import { getFriendlyErrorMessage } from '../utils/friendlyError';

/**
 * PulseChat Toast Messaging Service
 * Formats errors and notifications into human-friendly, clean messages
 * without technical jargon or stack traces.
 */

const baseToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    borderRadius: "16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
    boxShadow: "0 14px 34px rgba(0, 0, 0, 0.35)",
  },
};

const warningtoast = (arg) => {
  const safeMessage = typeof arg === "string" ? arg : getFriendlyErrorMessage(arg, "Please verify your input and try again.");
  toast.warning(safeMessage, {
    ...baseToastOptions,
    transition: Bounce,
  });
};

const errortoast = (arg, fallback) => {
  const safeMessage = getFriendlyErrorMessage(arg, fallback || "Something went wrong. Please try again.");
  toast.error(safeMessage, {
    ...baseToastOptions,
    transition: Zoom,
  });
};

const successtoast = (arg) => {
  const safeMessage = typeof arg === "string" ? arg : "Action completed successfully.";
  toast.success(safeMessage, {
    ...baseToastOptions,
    autoClose: 2500,
    transition: Bounce,
  });
};

const infotoast = (arg) => {
  const safeMessage = typeof arg === "string" ? arg : String(arg);
  toast.info(safeMessage, {
    ...baseToastOptions,
    position: 'top-center',
    transition: Bounce,
  });
};

export { errortoast, infotoast, successtoast, warningtoast };
