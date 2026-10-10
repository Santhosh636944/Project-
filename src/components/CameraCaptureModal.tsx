import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setError(null);
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setError('Unable to access camera. Please allow camera permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage, 'image/jpeg');
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-700 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold">Capture Food Photo</h3>
        </div>

        {error ? (
          <div className="p-6 text-center bg-slate-800 rounded-2xl border border-rose-500/30">
            <p className="text-sm text-rose-300 mb-3">{error}</p>
            <p className="text-xs text-slate-400">
              You can still select a photo or use your device camera using the native file picker!
            </p>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Crosshair */}
            {!capturedImage && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/40 border-dashed rounded-3xl" />
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={toggleCamera}
            disabled={!!capturedImage || !!error}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch Cam</span>
          </button>

          {capturedImage ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCapturedImage(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </div>
          ) : (
            <button
              onClick={takePhoto}
              disabled={!!error}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 border-4 border-slate-900 shadow-xl flex items-center justify-center cursor-pointer transition transform active:scale-95 disabled:opacity-40"
            >
              <div className="w-6 h-6 rounded-full bg-white" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
