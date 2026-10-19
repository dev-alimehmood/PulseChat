import { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, Camera, Image as ImageIcon, ZoomIn, ZoomOut, RotateCw, 
  Check, RefreshCw, AlertCircle, SwitchCamera, CheckCircle2,
  Sparkles, Move, Sliders
} from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../shared/Avatar";
import { resolveAvatarUrl } from "../../utils/chat";

const VIEWPORT_SIZE = 280; // Standard crop viewport square (280x280)
const OUTPUT_SIZE = 512;   // High-res square avatar export (512x512)

/**
 * ImageCropperModal
 * Production-grade profile photo studio:
 * - Real-time webcam & mobile camera with front/back toggle
 * - Exact center-square snapshot matching the viewfinder
 * - Mathematically synchronized viewport preview & 512x512 canvas export
 * - Intelligent boundary clamping to eliminate empty black borders
 * - Live avatar mini-preview showing profile squircle and chat circle in real-time
 */
const ImageCropperModal = ({ isOpen, onClose, onSave, currentPhoto, currentName = "User" }) => {
  const [mode, setMode] = useState("select"); // "select" | "camera" | "crop"
  const [imageSrc, setImageSrc] = useState(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // "user" | "environment"

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const imageRef = useRef(null);

  // Safely stop active camera tracks
  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Reset state whenever modal is closed
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setMode("select");
      setImageSrc(null);
      setImgDimensions({ width: 0, height: 0 });
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setCameraError(null);
    }
  }, [isOpen, stopCamera]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start live webcam or mobile camera
  const startLiveCamera = async (facing = facingMode) => {
    setCameraError(null);
    setMode("camera");
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facing,
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError("Live camera unavailable or permission denied. You can still upload from files.");
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  // Toggle front/back camera on mobile
  const toggleFacingMode = () => {
    const nextFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextFacing);
    startLiveCamera(nextFacing);
  };

  // Capture snapshot from live camera feed
  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const minDim = Math.min(vw, vh);

    // Extract exact center square visible in the square viewfinder
    const sx = (vw - minDim) / 2;
    const sy = (vh - minDim) / 2;

    const captureSize = Math.min(minDim, 1080);
    const canvas = document.createElement("canvas");
    canvas.width = captureSize;
    canvas.height = captureSize;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // If using selfie front camera, mirror horizontally so snapshot matches viewfinder
    if (facingMode === "user") {
      ctx.translate(captureSize, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, captureSize, captureSize);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

    stopCamera();

    // Load snapshot into crop mode with natural dimension tracking
    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageSrc(dataUrl);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setMode("crop");
    };
    img.src = dataUrl;
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setImageSrc(dataUrl);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setMode("crop");
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  // Re-adjust existing profile photo directly in cropper
  const handleEditCurrentPhoto = () => {
    if (!currentPhoto) return;
    const resolved = resolveAvatarUrl(currentPhoto);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageSrc(resolved);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setMode("crop");
    };
    img.onerror = () => {
      // Fallback if crossOrigin is blocked
      const fallback = new Image();
      fallback.onload = () => {
        setImgDimensions({ width: fallback.naturalWidth, height: fallback.naturalHeight });
        setImageSrc(resolved);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setMode("crop");
      };
      fallback.src = resolved;
    };
    img.src = resolved;
  };

  // ─────────────────────────────────────────────────────────────
  // MATHEMATICAL DIMENSIONS & BOUNDARY CLAMPING
  // ─────────────────────────────────────────────────────────────
  const isSideways = rotation % 180 !== 0;
  const effectiveNaturalW = isSideways ? imgDimensions.height : imgDimensions.width;
  const effectiveNaturalH = isSideways ? imgDimensions.width : imgDimensions.height;

  // Base scale so the image completely fills the viewport square with 0 empty margins
  const baseScale = effectiveNaturalW > 0 && effectiveNaturalH > 0
    ? Math.max(VIEWPORT_SIZE / effectiveNaturalW, VIEWPORT_SIZE / effectiveNaturalH)
    : 1;

  const baseWidth = imgDimensions.width * baseScale;
  const baseHeight = imgDimensions.height * baseScale;

  // Current visual bounds on screen
  const currentVisualW = (isSideways ? baseHeight : baseWidth) * zoom;
  const currentVisualH = (isSideways ? baseWidth : baseHeight) * zoom;

  const maxPanX = Math.max(0, (currentVisualW - VIEWPORT_SIZE) / 2);
  const maxPanY = Math.max(0, (currentVisualH - VIEWPORT_SIZE) / 2);

  const clampPan = (x, y) => ({
    x: Math.max(-maxPanX, Math.min(maxPanX, x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, y)),
  });

  // Re-clamp pan whenever zoom or rotation changes
  useEffect(() => {
    if (mode === "crop" && imgDimensions.width > 0) {
      setPan((prev) => clampPan(prev.x, prev.y));
    }
  }, [zoom, rotation, baseWidth, baseHeight, mode]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan(clampPan(newX, newY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan handlers for mobile screens
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setPan(clampPan(newX, newY));
  };

  // ─────────────────────────────────────────────────────────────
  // GENERATE CRISP 512x512 EDGE-TO-EDGE EXPORT
  // ─────────────────────────────────────────────────────────────
  const handleApplyCrop = () => {
    if (!imageRef.current || !imgDimensions.width) return;
    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const exportScale = OUTPUT_SIZE / VIEWPORT_SIZE;

    // 1. Move origin to canvas center
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    // 2. Apply scaled pan offset
    ctx.translate(pan.x * exportScale, pan.y * exportScale);

    // 3. Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // 4. Calculate drawn width and height
    const drawW = baseWidth * zoom * exportScale;
    const drawH = baseHeight * zoom * exportScale;

    // 5. Draw image centered
    ctx.drawImage(
      image,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );

    // Export clean, high-resolution JPEG without dark padding
    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.92);
    onSave(croppedBase64);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="w-full max-w-lg bg-white dark:bg-[#0c1228] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#38bdf8] text-white flex items-center justify-center shadow-md">
              <Camera className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {mode === "camera" ? "Take Profile Photo" : mode === "crop" ? "Crop & Adjust Photo" : "Profile Picture Studio"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === "camera" 
                  ? "Align your face within the frame and capture" 
                  : mode === "crop" 
                  ? "Drag to center • Zoom or rotate to fit" 
                  : "Choose live camera or upload photo"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 flex flex-col items-center justify-center min-h-[350px]">
          
          {/* Mode 1: Initial Selection */}
          {mode === "select" && (
            <div className="w-full space-y-5 py-2">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-28 h-28 rounded-3xl ring-4 ring-[#2dd4bf]/25 shadow-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white/10">
                  <Avatar
                    src={currentPhoto}
                    name={currentName || "Profile"}
                    size="w-full h-full text-4xl"
                    rounded="rounded-3xl"
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo Preview</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                  Snap a fresh selfie with your camera, select a photo, or adjust your current profile.
                </p>

                {currentPhoto && (
                  <button
                    type="button"
                    onClick={handleEditCurrentPhoto}
                    className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Adjust & Crop Current Photo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {/* Take Photo with Camera */}
                <button
                  type="button"
                  onClick={() => startLiveCamera("user")}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/5 transition-all group text-left cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#38bdf8] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Camera Capture</h4>
                    <p className="text-[11px] text-slate-400">Mobile lens or webcam</p>
                  </div>
                </button>

                {/* Upload from Files */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/5 transition-all group text-left cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#38bdf8] to-[#2dd4bf] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Choose from Files</h4>
                    <p className="text-[11px] text-slate-400">Gallery or desktop file</p>
                  </div>
                </button>
              </div>

              {/* Hidden file & mobile camera triggers */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Mode 2: Live Camera Viewfinder */}
          {mode === "camera" && (
            <div className="w-full flex flex-col items-center space-y-4">
              <div 
                style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
                className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-[#38bdf8]/50 ring-4 ring-[#38bdf8]/15 flex items-center justify-center"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                />

                {/* Circular face alignment guide */}
                <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-dashed border-white/60 m-3 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />

                {/* Camera flip toggle button */}
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Switch front/rear camera"
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>

                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono pointer-events-none">
                  {facingMode === "user" ? "Front Camera" : "Rear Camera"}
                </span>
              </div>

              {cameraError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </p>
              )}

              <div className="flex items-center gap-3 pt-1 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setMode("select");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-bold text-xs shadow-lg shadow-[#38bdf8]/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Shot</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: Mathematically Synchronized Cropper */}
          {mode === "crop" && (
            <div className="w-full flex flex-col items-center space-y-4">
              
              {/* Interactive Viewport (280x280) */}
              <div
                style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border-2 border-[#38bdf8]/50 ring-4 ring-[#38bdf8]/15 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none select-none"
              >
                {/* Target Image with Synchronized Transforms */}
                {imageSrc && (
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    crossOrigin="anonymous"
                    alt="Crop Preview"
                    style={{
                      width: `${baseWidth}px`,
                      height: `${baseHeight}px`,
                      maxWidth: "none",
                      maxHeight: "none",
                      transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                      transformOrigin: "center center",
                      transition: isDragging ? "none" : "transform 0.08s ease-out",
                    }}
                    className="pointer-events-none select-none block"
                    draggable={false}
                  />
                )}

                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-dashed border-white/70 m-2.5 shadow-[0_0_0_9999px_rgba(10,15,30,0.55)]" />

                {/* Profile Squircle Boundary Line */}
                <div className="absolute inset-2.5 pointer-events-none border border-white/20 rounded-2xl" />

                {/* Micro Drag Hint */}
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono pointer-events-none tracking-wide flex items-center gap-1 shadow-md">
                  <Move className="w-3 h-3 text-[#38bdf8]" /> Drag to align
                </span>
              </div>

              {/* Controls Toolbar: Zoom, Rotate, Reset */}
              <div className="w-full max-w-sm space-y-3 pt-1">
                {/* Zoom Slider */}
                <div className="flex items-center gap-3 px-2">
                  <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.02"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#38bdf8] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Action Buttons: Rotate & Reset */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[#38bdf8]/40 transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setRotation(0);
                        setPan({ x: 0, y: 0 });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[#38bdf8]/40 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Real-time Mini Avatar Preview */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Preview:</span>
                    {/* Squircle Preview */}
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border border-white/20 relative shadow-sm">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Mini Preview"
                          style={{
                            width: `${baseWidth * (36 / VIEWPORT_SIZE)}px`,
                            height: `${baseHeight * (36 / VIEWPORT_SIZE)}px`,
                            maxWidth: "none",
                            maxHeight: "none",
                            transform: `translate(${pan.x * (36 / VIEWPORT_SIZE)}px, ${pan.y * (36 / VIEWPORT_SIZE)}px) rotate(${rotation}deg) scale(${zoom})`,
                            transformOrigin: "center center",
                          }}
                          className="pointer-events-none block"
                        />
                      )}
                    </div>
                    {/* Circle Preview */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 border border-white/20 relative shadow-sm">
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Mini Preview"
                          style={{
                            width: `${baseWidth * (36 / VIEWPORT_SIZE)}px`,
                            height: `${baseHeight * (36 / VIEWPORT_SIZE)}px`,
                            maxWidth: "none",
                            maxHeight: "none",
                            transform: `translate(${pan.x * (36 / VIEWPORT_SIZE)}px, ${pan.y * (36 / VIEWPORT_SIZE)}px) rotate(${rotation}deg) scale(${zoom})`,
                            transformOrigin: "center center",
                          }}
                          className="pointer-events-none block"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="w-full flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setMode("select")}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Choose Different
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#38bdf8] to-[#2dd4bf] text-white font-bold text-xs shadow-lg shadow-[#2dd4bf]/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply & Save</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default ImageCropperModal;
