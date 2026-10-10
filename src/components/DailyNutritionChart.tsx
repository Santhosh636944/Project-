import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DailyCaloriePoint } from '../types';

interface DailyNutritionChartProps {
  data: DailyCaloriePoint[];
  goalCalories?: number;
}

export const DailyNutritionChart: React.FC<DailyNutritionChartProps> = ({ data, goalCalories = 2000 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
        <p>No recent meal data logged yet.</p>
        <p className="text-xs text-slate-400 mt-1">Analyze a food image to view your daily trend.</p>
      </div>
    );
  }

  // Format dates for display
  const chartData = data.map((d) => {
    const parts = d.date.split('-');
    const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.date;
    return {
      ...d,
      displayDate: label,
      target: goalCalories,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 space-y-1.5">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</div>
          <div className="text-amber-400 font-semibold">Calories: {payload[0]?.value} kcal</div>
          <div className="text-emerald-400">Protein: {payload[1]?.value} g</div>
          <div className="text-blue-400">Carbs: {payload[2]?.value} g</div>
          <div className="text-rose-400">Fat: {payload[3]?.value} g</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(val) => <span className="text-slate-600 font-medium capitalize">{val}</span>}
          />
          <Bar dataKey="calories" name="Calories (kcal)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="protein" name="Protein (g)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar dataKey="carbs" name="Carbs (g)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar dataKey="fat" name="Fat (g)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
