import React from "react";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  LogIn,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { getFriendlyErrorMessage } from "../../utils/friendlyError";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PulseChat ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleCopyDiagnostics = () => {
    const errorDetails = `PulseChat Error Report
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
Error: ${this.state.error?.name || "Error"}: ${this.state.error?.message || "Unknown error"}
Stack:
${this.state.error?.stack || "No stack trace available"}
Component Stack:
${this.state.errorInfo?.componentStack || "No component stack available"}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(errorDetails).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isCompact = this.props.compact;
      const errorMessage = getFriendlyErrorMessage(
        this.state.error,
        "We encountered an issue displaying this component."
      );

      // Inline compact view for nested components (e.g., inside ChatWindow panel)
      if (isCompact) {
        return (
          <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center p-6 text-center select-none bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.25)]">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-1.5">
              {this.props.title || "Failed to load component"}
            </h3>

            <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed font-mono px-3 py-2 rounded-lg bg-black/40 border border-white/5 break-words">
              {errorMessage}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-md shadow-indigo-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        );
      }

      // Full-screen application-level error view
      return (
        <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white relative overflow-hidden font-sans selection:bg-[#38bdf8]/30 selection:text-[#38bdf8]">
          {/* Ambient Lighting & Glow Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-500/10 via-[#6366f1]/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-gradient-to-t from-[#38bdf8]/10 via-transparent to-transparent blur-3xl pointer-events-none" />
          
          {/* Radial Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-25 pointer-events-none" />

          {/* Top Brand & Diagnostic Header */}
          <header className="relative z-10 w-full px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366f1]/20 via-[#38bdf8]/15 to-[#2dd4bf]/20 border border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.3)] p-1">
                <img src="/logo.png" alt="PulseChat" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-1.5 ring-white dark:ring-transparent" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-[#818cf8] via-[#38bdf8] to-[#2dd4bf] bg-clip-text text-transparent">
                  PulseChat
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/25 text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Display Notice
              </span>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
            <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/80 dark:bg-[#0c1228]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
              
              {/* Top Accent Gradient Line */}
              <div className="h-1 bg-gradient-to-r from-rose-500 via-[#818cf8] to-[#38bdf8]" />

              <div className="p-6 sm:p-10 text-center">
                {/* Glowing Shield / Alert Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.3)]">
                    <ShieldAlert className="w-10 h-10 text-rose-500 dark:text-rose-400" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2.5">
                  {this.props.title || "Application Notice"}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                  A rendering fault was safely caught before impacting your system. Your authentication status and active messages are preserved.
                </p>

                {/* Clean Error Message Box */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-[#060a17] border border-slate-200 dark:border-white/10 text-center">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {errorMessage}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <button
                    onClick={this.handleReset}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white shadow-lg shadow-[#38bdf8]/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reload View</span>
                  </button>

                  <a
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home Page</span>
                  </a>

                  <a
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </a>
                </div>

                {/* Expandable Technical Diagnostics */}
                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        this.setState((prev) => ({ showDetails: !prev.showDetails }))
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition-colors cursor-pointer"
                    >
                      {this.state.showDetails ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Hide Diagnostic Details</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show Diagnostic Details</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={this.handleCopyDiagnostics}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      {this.state.copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Diagnostics</span>
                        </>
                      )}
                    </button>
                  </div>

                  {this.state.showDetails && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] text-left overflow-x-auto max-h-64 border border-white/10">
                      <div className="text-rose-400 font-bold mb-2">
                        {this.state.error?.name}: {this.state.error?.message}
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed text-slate-400">
                        {this.state.error?.stack || "No call stack captured."}
                      </pre>
                      {this.state.errorInfo?.componentStack && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                            Component Trace:
                          </span>
                          <pre className="whitespace-pre-wrap leading-relaxed text-slate-400">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Footer Info */}
          <footer className="relative z-10 py-5 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} PulseChat Resilience Engine • End-to-End Encrypted Platform</p>
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
