import React from 'react';
import { Utensils, AlertCircle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Important Disclaimer Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Medical &amp; Nutritional Disclaimer</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nutrition values shown by NutriVision AI are estimates for informational purposes only. Actual
              nutritional values may vary based on ingredients, preparation methods, recipes, and portion sizes. This
              application is not intended for medical diagnosis, dietary prescription, or medical treatment
              recommendations.
            </p>
          </div>
        </div>

        {/* Links and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Nutri<span className="text-emerald-400">Vision</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              See your food. Understand your nutrition. Next-generation computer vision food analysis for conscious,
              healthier living.
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 max-w-sm">
              <span className="text-emerald-400 font-semibold">Demo credentials:</span> User:{' '}
              <code className="text-slate-200">demo@nutrivision.ai</code> / <code className="text-slate-200">demo123</code>
              <br />
              Admin: <code className="text-slate-200">admin@nutrivision.ai</code> / <code className="text-slate-200">admin123</code>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigation</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('analyze')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Analyze Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('history')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('analytics')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('foods')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  Food Database
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>JWT Protected API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemini Vision Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portion Calibration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offline Demo Mode</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} NutriVision AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for mindful nutrition &amp; wellness <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
