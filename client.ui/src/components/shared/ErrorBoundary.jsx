import React from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PulseChat ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full w-full min-h-[300px] flex-col items-center justify-center p-6 text-center select-none bg-slate-50 dark:bg-[#07090e]">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.25)]">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
            {this.props.title || "Something went wrong in this view"}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this interface component."}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => { window.location.href = "/chatpage"; }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
