import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface LoadingStepsProps {
  onComplete?: () => void;
}

export const LoadingSteps: React.FC<LoadingStepsProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Uploading image', duration: 700 },
    { label: 'Identifying food components', duration: 1100 },
    { label: 'Estimating portions & volume', duration: 1000 },
    { label: 'Calculating nutritional values', duration: 900 },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 700);
    const timer2 = setTimeout(() => setCurrentStep(2), 1800);
    const timer3 = setTimeout(() => setCurrentStep(3), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-2xl border border-slate-100 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative">
        <Sparkles className="w-8 h-8 animate-pulse text-emerald-500" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1">Analyzing your food...</h3>
      <p className="text-xs text-slate-500 mb-6">
        Our multi-stage computer vision model is detecting items on your plate.
      </p>

      {/* Step checklist */}
      <div className="space-y-3.5 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div key={idx} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  isDone
                    ? 'text-slate-700'
                    : isCurrent
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Gemini 3.8 Flash Vision Engine</span>
      </div>
    </div>
  );
};
