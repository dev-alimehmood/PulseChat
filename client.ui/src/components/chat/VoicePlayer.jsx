import { useState, useEffect, useRef } from "react";
import { Play, Pause, Loader2, Volume2 } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

const formatTime = (time) => {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VoicePlayer = ({ src, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isMe ? "rgba(255, 255, 255, 0.4)" : "rgba(129, 140, 248, 0.35)",
      progressColor: isMe ? "#ffffff" : "#38bdf8",
      cursorColor: "transparent",
      barWidth: 3,
      barGap: 2.5,
      barRadius: 3,
      height: 28,
      normalize: true,
      hideScrollbar: true,
    });

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
    const isBlobUrl = src && src.startsWith("blob:");
    const proxySrc = !isBlobUrl && src ? `${apiUrl}/messages/stream-audio?url=${encodeURIComponent(src)}` : src;

    wavesurfer.current.load(proxySrc);

    wavesurfer.current.on("ready", () => {
      setIsReady(true);
      setDuration(wavesurfer.current.getDuration());
    });

    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on("seek", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      wavesurfer.current.seekTo(0);
    });

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [src, isMe]);

  const togglePlayPause = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (wavesurfer.current && isReady) {
      if (isPlaying) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      } else {
        wavesurfer.current.play();
        setIsPlaying(true);
      }
    }
  };

  const cycleSpeed = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(nextSpeed);
    }
  };

  return (
    <div className={`flex items-center gap-3 py-1.5 px-1 select-none ${isMe ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
      {/* Play / Pause button */}
      <button 
        onClick={togglePlayPause}
        disabled={!isReady}
        className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-2xl transition-all shadow-sm ${
          isMe 
            ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm active:scale-95' 
            : 'bg-indigo-500/10 dark:bg-indigo-500/20 text-[#6366f1] dark:text-[#38bdf8] border border-indigo-500/20 dark:border-indigo-500/30 hover:bg-indigo-500/20 active:scale-95'
        } ${!isReady ? 'opacity-60 cursor-not-allowed' : ''}`}
        title={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {!isReady ? (
          <Loader2 className="w-4 h-4 animate-spin opacity-80" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current translate-x-0.5" />
        )}
      </button>

      {/* Waveform & Timing */}
      <div className="flex flex-col flex-1 min-w-[140px] sm:min-w-[200px] w-full">
        <div ref={waveformRef} className="w-full h-[28px] cursor-pointer" />
        
        <div className={`flex justify-between items-center mt-1 text-[10px] font-mono tracking-wider ${isMe ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
          <div className="flex items-center gap-1.5">
            {isPlaying && (
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </span>
            )}
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Speed Multiplier Pill */}
          <button
            onClick={cycleSpeed}
            disabled={!isReady}
            title="Toggle playback speed"
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border transition-all ${
              isMe
                ? 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                : 'bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-white/10'
            }`}
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoicePlayer;
