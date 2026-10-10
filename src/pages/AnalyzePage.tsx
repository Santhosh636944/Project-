import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { MealType } from '../types';
import { LoadingSteps } from '../components/LoadingSteps';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  X,
  Check,
  RotateCcw,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface AnalyzePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const { isDemoMode } = useDemo();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Sample quick presets for rapid testing
  const samplePresets = [
    {
      title: 'Chicken Biryani Plate',
      category: 'Lunch',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      description: 'Aromatic basmati rice, tender spiced chicken, boiled egg, and cool raita.',
    },
    {
      title: 'Rice + Chicken + Egg + Salad',
      category: 'Dinner',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      description: 'Multiple foods in one plate: high protein meal with white rice, grilled breast, egg, and salad.',
    },
    {
      title: 'Crispy Masala Dosa',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      description: 'Fermented crepe with spiced potato filling, served with vegetable lentil sambar.',
    },
    {
      title: 'Toasted Bread & Eggs',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
      description: 'Two slices of whole wheat bread with soft boiled eggs.',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setError(null);
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Unsupported format. Please upload JPG, PNG, or WEBP images.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image exceeds maximum allowed size of 10 MB.');
      return;
    }

    setSelectedFile(file);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof samplePresets[0]) => {
    setError(null);
    setSelectedImage(preset.image);
    setSelectedFile(null);
    setMimeType('image/jpeg');
    setMealType(preset.category as MealType);
  };

  const handleCameraCapture = (base64Data: string, mime: string) => {
    setError(null);
    setSelectedImage(base64Data);
    setSelectedFile(null);
    setMimeType(mime);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const res = await api.analysis.analyze({
        imageBase64: selectedImage,
        mimeType: mimeType,
        mealType: mealType,
        isDemo: isDemoMode,
        sampleImageUrl: !selectedFile && selectedImage.startsWith('http') ? selectedImage : undefined,
      });

      // Navigate to result page
      onNavigate('analysis-detail', { id: res.analysis._id });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'We could not identify the food. Try uploading a clearer image.');
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Computer Vision Food Nutrition Analyzer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Analyze Food &amp; Portions
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Upload or capture any meal photo to identify foods, estimate volume, and calculate macronutrients.
        </p>
      </div>

      {/* Main Analysis Stage */}
      {isAnalyzing ? (
        <div className="py-12">
          <LoadingSteps />
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Recognition Notice</span>
                {error}
              </div>
            </div>
          )}

          {/* Meal Type Classification Selector (Section 17) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Meal Category:
              </span>
              <span className="text-[11px] text-slate-400">Classify for weekly calorie analytics</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type)}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mealType === type
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone or Image Preview */}
          {!selectedImage ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              {/* Native mobile camera capture input */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    Drag and drop your food photo here
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports JPG, JPEG, PNG, WEBP (Max 10 MB)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Browse Files</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Try webcam modal or native camera capture
                      if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                        setCameraModalOpen(true);
                      } else {
                        cameraInputRef.current?.click();
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Use Camera</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Image Preview with Action Buttons */
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden aspect-16/9 sm:aspect-2/1 bg-slate-900 shadow-xl border border-slate-200">
                <img src={selectedImage} alt="Food Preview" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ready for AI Recognition ({mealType})</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-950 text-white rounded-xl transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                  >
                    <span>Cancel</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Food</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Presets Carousel */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Or Try Sample Dishes (1-Click Test)
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Ready-to-analyze presets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="group relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all hover:border-emerald-400"
                >
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end">
                    <span className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition">
                      {preset.title}
                    </span>
                    <span className="text-[9px] text-slate-300 uppercase tracking-wider">{preset.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
