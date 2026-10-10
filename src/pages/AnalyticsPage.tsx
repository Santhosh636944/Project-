import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalyticsResponse } from '../types';
import { MacronutrientPieChart } from '../components/MacronutrientPieChart';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Utensils,
  Award,
  TrendingUp,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState('7d');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.analytics.get(range);
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [range]);

  const summary = analytics?.summary;
  const dailyCalories = analytics?.dailyCalories || [];
  const mostFrequentFoods = analytics?.mostFrequentFoods || [];
  const macroTotals = analytics?.macroTotals || { protein: 0, carbs: 0, fat: 0 };

  const ranges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nutrition Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive intake trends, caloric distribution, and food frequency analysis.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                range === r.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Daily Calories</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.averageDailyCalories || 0}{' '}
            <span className="text-xs font-medium text-slate-400">kcal/day</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Calculated over active days</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Protein</span>
            <Beef className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.averageProtein || 0}{' '}
            <span className="text-xs font-medium text-slate-400">g/day</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Lean muscle maintenance</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Carbs</span>
            <Wheat className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.averageCarbs || 0}{' '}
            <span className="text-xs font-medium text-slate-400">g/day</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Primary daily energy</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Fat</span>
            <Droplet className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.averageFat || 0}{' '}
            <span className="text-xs font-medium text-slate-400">g/day</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Essential lipid nutrients</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-tr from-purple-700 to-indigo-600 text-white p-5 rounded-3xl shadow-md">
          <div className="flex items-center justify-between text-purple-200 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Meals</span>
            <Utensils className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{summary?.totalMealsAnalyzed || 0}</div>
          <span className="text-[11px] text-purple-200 mt-1 block">Logged food items</span>
        </div>
      </div>

      {/* Row 1: Daily Calories Line Chart & Weekly Breakdown Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Calories Line Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daily Calorie Progression</h3>
            <p className="text-xs text-slate-500">Track calorie consumption across dates</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyCalories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl">
                          <div className="font-semibold text-slate-300">{label}</div>
                          <div className="font-bold text-amber-400">{payload[0].value} kcal</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  name="Calories (kcal)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Calories / Macronutrient Intake Bar Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Macronutrients Over Time</h3>
            <p className="text-xs text-slate-500">Protein, Carbohydrates, and Fat distribution by date</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCalories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend
                  wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
                  formatter={(val) => <span className="text-slate-600 font-semibold">{val}</span>}
                />
                <Bar dataKey="protein" name="Protein (g)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="carbs" name="Carbs (g)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="fat" name="Fat (g)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Most Frequently Analyzed Foods & Overall Macronutrients Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Frequently Analyzed Foods (Horizontal Bar Chart) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Most Frequently Analyzed Foods</h3>
            <p className="text-xs text-slate-500">Your top consumed dishes based on AI detections</p>
          </div>

          {mostFrequentFoods.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No food logs available for this period.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={mostFrequentFoods}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#334155"
                    fontSize={11}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'count' ? `${value} times` : `${value} kcal`,
                      name === 'count' ? 'Logged' : 'Total Energy',
                    ]}
                  />
                  <Bar dataKey="count" name="Times Logged" fill="#8b5cf6" radius={[0, 6, 6, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Aggregate Macronutrient Distribution Donut */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Total Macro Ratio</h3>
            <p className="text-xs text-slate-500">Cumulative energy percentage share across timeframe</p>
          </div>

          <MacronutrientPieChart
            protein={macroTotals.protein}
            carbohydrates={macroTotals.carbs}
            fat={macroTotals.fat}
          />

          <div className="p-3 bg-purple-50 text-purple-900 rounded-2xl text-xs text-center border border-purple-100">
            Total active timeframe intake: <span className="font-bold">{summary?.totalCalories || 0} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
