import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacronutrientPieChartProps {
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  height?: number;
}

export const MacronutrientPieChart: React.FC<MacronutrientPieChartProps> = ({
  protein,
  carbohydrates,
  fat,
  height = 220,
}) => {
  // Convert grams to calories for true caloric breakdown:
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
  const proteinKcal = Math.max(0, protein * 4);
  const carbsKcal = Math.max(0, carbohydrates * 4);
  const fatKcal = Math.max(0, fat * 9);
  const totalKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const data = [
    {
      name: 'Protein',
      grams: protein,
      kcal: Math.round(proteinKcal),
      percent: Math.round((proteinKcal / totalKcal) * 100),
      color: '#10b981', // emerald-500
    },
    {
      name: 'Carbs',
      grams: carbohydrates,
      kcal: Math.round(carbsKcal),
      percent: Math.round((carbsKcal / totalKcal) * 100),
      color: '#3b82f6', // blue-500
    },
    {
      name: 'Fat',
      grams: fat,
      kcal: Math.round(fatKcal),
      percent: Math.round((fatKcal / totalKcal) * 100),
      color: '#f43f5e', // rose-500
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-xl border border-slate-700">
          <div className="font-bold flex items-center gap-1.5 mb-1" style={{ color: item.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </div>
          <div>{item.grams} g ({item.kcal} kcal)</div>
          <div className="text-[11px] text-slate-300 font-medium">{item.percent}% of macronutrient calories</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-full sm:w-1/2 h-[200px]">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
              dataKey="kcal"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full sm:w-1/2 space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <span className="text-xs font-bold text-slate-800">{item.name}</span>
                <span className="text-[11px] text-slate-500 ml-1.5 font-medium">({item.grams}g)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-900">{item.percent}%</span>
              <span className="text-[10px] text-slate-400 block font-medium">{item.kcal} kcal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
