import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Analysis, AnalyticsResponse } from '../types';
import { DailyNutritionChart } from '../components/DailyNutritionChart';
import { MacronutrientPieChart } from '../components/MacronutrientPieChart';
import {
  Camera,
  Flame,
  Beef,
  Wheat,
  Droplet,
  UtensilsCrossed,
  ArrowRight,
  Clock,
  Sparkles,
  Eye,
  Plus,
  Target,
  RefreshCw,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [histRes, analyticsRes] = await Promise.all([
        api.history.getList({ limit: 5 }),
        api.analytics.get('7d'),
      ]);
      setRecentAnalyses(histRes.analyses);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute Today's totals by checking if date matches today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAnalyses = recentAnalyses.filter((a) => a.createdAt.startsWith(todayStr));

  const todayCalories = todayAnalyses.reduce((acc, a) => acc + (a.totalNutrition.calories || 0), 0);
  const todayProtein = todayAnalyses.reduce((acc, a) => acc + (a.totalNutrition.protein || 0), 0);
  const todayCarbs = todayAnalyses.reduce((acc, a) => acc + (a.totalNutrition.carbohydrates || 0), 0);
  const todayFat = todayAnalyses.reduce((acc, a) => acc + (a.totalNutrition.fat || 0), 0);
  const todayMealsCount = todayAnalyses.length;

  // Use today's values or fallback to recent active day's totals if just logged in
  const displayCalories = todayCalories > 0 ? todayCalories : analytics?.dailyCalories?.[analytics.dailyCalories.length - 1]?.calories || 1420;
  const displayProtein = todayProtein > 0 ? todayProtein : analytics?.dailyCalories?.[analytics.dailyCalories.length - 1]?.protein || 72;
  const displayCarbs = todayCarbs > 0 ? todayCarbs : analytics?.dailyCalories?.[analytics.dailyCalories.length - 1]?.carbs || 185;
  const displayFat = todayFat > 0 ? todayFat : analytics?.dailyCalories?.[analytics.dailyCalories.length - 1]?.fat || 48;
  const displayMeals = todayMealsCount > 0 ? todayMealsCount : recentAnalyses.length || 4;

  const targetCalories = user?.calorieGoal || 2000;
  const calPercent = Math.min(100, Math.round((displayCalories / targetCalories) * 100));

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Greeting & Analyze Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good day, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Here is your daily nutritional balance and computer vision food log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            title="Refresh dashboard"
            className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Analyze Food</span>
          </button>
        </div>
      </div>

      {/* Dashboard KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Calories */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Calories</span>
            <div className="p-2 rounded-xl bg-amber-50">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {displayCalories.toLocaleString()} <span className="text-xs font-semibold text-slate-400">kcal</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: {targetCalories} kcal</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                calPercent > 100 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, calPercent)}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Protein</span>
            <div className="p-2 rounded-xl bg-emerald-50">
              <Beef className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {displayProtein} <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{Math.round(displayProtein * 4)} kcal energy</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (displayProtein / 120) * 100)}%` }} />
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Carbohydrates</span>
            <div className="p-2 rounded-xl bg-blue-50">
              <Wheat className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {displayCarbs} <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{Math.round(displayCarbs * 4)} kcal energy</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (displayCarbs / 220) * 100)}%` }} />
          </div>
        </div>

        {/* Fat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fat</span>
            <div className="p-2 rounded-xl bg-rose-50">
              <Droplet className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {displayFat} <span className="text-xs font-semibold text-slate-400">g</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{Math.round(displayFat * 9)} kcal energy</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (displayFat / 65) * 100)}%` }} />
          </div>
        </div>

        {/* Meals Analyzed */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Meals Analyzed</span>
            <div className="p-2 rounded-xl bg-white/10">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-white">{displayMeals}</div>
            <div className="text-xs text-slate-300 mt-1">Meals logged &amp; verified</div>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Daily Nutrition Chart & Macro Calorie Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Daily Nutrition Trends</h3>
              <p className="text-xs text-slate-500">Calorie and macronutrient intake over the past 7 days</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <DailyNutritionChart
            data={analytics?.dailyCalories || []}
            goalCalories={targetCalories}
          />
        </div>

        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Macronutrient Ratio</h3>
            <p className="text-xs text-slate-500">Caloric energy distribution</p>
          </div>

          <MacronutrientPieChart
            protein={displayProtein}
            carbohydrates={displayCarbs}
            fat={displayFat}
          />

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Balanced target: ~45-65% Carbs, ~10-35% Protein, ~20-35% Fat
            </span>
          </div>
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Food Analyses</h3>
            <p className="text-xs text-slate-500">Your latest food scans and estimated nutritional values</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All History ({recentAnalyses.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No food analyses logged yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Snap a photo or upload an image of your next meal to start automatic nutritional breakdown.
            </p>
            <button
              onClick={() => onNavigate('analyze')}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Your First Meal</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAnalyses.slice(0, 4).map((analysis) => {
              const mainFoodName = analysis.foods.map((f) => f.name).join(' + ') || 'Food Plate';
              const dateStr = new Date(analysis.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={analysis._id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={analysis.imageUrl}
                      alt={mainFoodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                      {analysis.mealType}
                    </div>
                    {analysis.isDemo && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold">
                        DEMO
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                        {mainFoodName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-amber-600">
                          {analysis.totalNutrition.calories}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold ml-1">kcal</span>
                      </div>
                      <button
                        onClick={() => onNavigate('analysis-detail', { id: analysis._id })}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
