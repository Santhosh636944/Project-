import React from 'react';
import {
  Camera,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  PieChart,
  History,
  TrendingUp,
  Scale,
  ShieldCheck,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Food Recognition',
      desc: 'Deep computer vision identifies multiple distinct foods, proteins, carbs, and condiments in a single photo.',
      color: 'bg-emerald-500 text-white',
    },
    {
      icon: Flame,
      title: 'Calorie Estimation',
      desc: 'Automatic caloric density calculations calibrated per portion size, preparation, and culinary volume.',
      color: 'bg-amber-500 text-white',
    },
    {
      icon: PieChart,
      title: 'Macro Tracking',
      desc: 'Comprehensive breakdown of protein, carbohydrates, fat, dietary fiber, and sugars with percentage shares.',
      color: 'bg-blue-500 text-white',
    },
    {
      icon: Scale,
      title: 'Portion Estimation',
      desc: 'AI-assisted volumetric estimation with easy manual correction for grams, pieces, cups, and bowls.',
      color: 'bg-indigo-500 text-white',
    },
    {
      icon: History,
      title: 'Nutrition History',
      desc: 'Keep an organized visual log of your breakfast, lunch, dinner, and snacks with search & filters.',
      color: 'bg-teal-500 text-white',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      desc: 'Interactive Recharts trends of daily averages, weekly caloric intake, and most frequent meals.',
      color: 'bg-purple-500 text-white',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload Image', desc: 'Snap a live photo or drag & drop any meal photo in JPG, PNG, or WEBP.' },
    { num: '02', title: 'AI Identifies Food', desc: 'Gemini Vision isolates every food item visible on your plate.' },
    { num: '03', title: 'Estimate Portion', desc: 'Detects serving size or allows 1-click manual gram adjustment.' },
    { num: '04', title: 'Calculate Nutrition', desc: 'Computes calories, macros, fiber, and sugar with scientific database cross-reference.' },
    { num: '05', title: 'View Results', desc: 'Explore macronutrient charts, AI insights, and track towards your goals.' },
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-300 via-teal-200 to-amber-200 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Powered by Gemini Vision 3.8 &amp; Nutrition Science</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Understand What’s On Your Plate with <span className="text-emerald-600">AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload a food image and get an AI-powered estimate of calories, protein, carbohydrates, fat, and other
            nutritional information.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate(isAuthenticated ? 'analyze' : 'register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Analyze Food</span>
            </button>
            <button
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'login')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Interactive Hero Showcase Preview */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-4/3 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
                  alt="Balanced Bowl"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Multi-Food Plate Detected</span>
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Real-time Sample Preview
                  </span>
                  <span className="text-xs text-slate-400 font-medium">94% Confidence</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mediterranean Grain &amp; Protein Bowl</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Detected: Steamed Rice, Grilled Chicken, Boiled Egg, Garden Greens
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-700 block uppercase">Calories</span>
                    <span className="text-lg font-black text-amber-900">556</span>
                    <span className="text-[10px] text-amber-600 block">kcal</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">Protein</span>
                    <span className="text-lg font-black text-emerald-900">49.9</span>
                    <span className="text-[10px] text-emerald-600 block">g</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-700 block uppercase">Carbs</span>
                    <span className="text-lg font-black text-blue-900">60.6</span>
                    <span className="text-[10px] text-blue-600 block">g</span>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-rose-700 block uppercase">Fat</span>
                    <span className="text-lg font-black text-rose-900">10.4</span>
                    <span className="text-[10px] text-rose-600 block">g</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(isAuthenticated ? 'analyze' : 'login')}
                  className="w-full py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Test this analysis in your dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Smart Nutritional Intelligence</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Precision &amp; Simplicity
          </h3>
          <p className="text-slate-600 text-sm">
            Everything you need to effortlessly understand macros, plan portions, and maintain accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {feat.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl max-w-7xl mx-4 sm:mx-6 lg:mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Simple 5-Step Process
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How NutriVision AI Works</h3>
          <p className="text-slate-400 text-sm">
            From snapshot to complete macronutrient breakdown in less than 5 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((st, idx) => (
            <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3 relative">
              <span className="text-2xl font-black text-emerald-400 font-mono block">{st.num}</span>
              <h5 className="text-base font-bold text-white">{st.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prominent Disclaimer Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-amber-950 uppercase tracking-wide">
            Nutrition &amp; Health Notice
          </h4>
          <p className="text-sm text-amber-900 leading-relaxed max-w-2xl mx-auto font-medium">
            “Nutrition values shown by NutriVision AI are estimates for informational purposes only. Actual nutritional
            values may vary based on ingredients, preparation methods, recipes, and portion sizes.”
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900">Ready to transform your food awareness?</h3>
        <p className="text-slate-600 text-sm max-w-md mx-auto">
          Start logging meals with intelligent food vision in seconds. No credit card required.
        </p>
        <button
          onClick={() => onNavigate(isAuthenticated ? 'analyze' : 'register')}
          className="px-9 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          Get Started with NutriVision AI
        </button>
      </section>
    </div>
  );
};
