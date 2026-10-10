import React from 'react';
import { Flame, Beef, Wheat, Droplet, Sparkles, Cookie } from 'lucide-react';
import { NutritionData } from '../types';

interface NutritionCardsProps {
  nutrition: NutritionData;
  goalCalories?: number;
}

export const NutritionCards: React.FC<NutritionCardsProps> = ({ nutrition, goalCalories = 2000 }) => {
  const cards = [
    {
      label: 'Calories',
      value: nutrition.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-200/80',
      badgeColor: 'bg-amber-500',
      sub: goalCalories ? `${Math.round((nutrition.calories / goalCalories) * 100)}% daily target` : undefined,
    },
    {
      label: 'Protein',
      value: nutrition.protein,
      unit: 'g',
      icon: Beef,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      badgeColor: 'bg-emerald-500',
      sub: `${Math.round(nutrition.protein * 4)} kcal`,
    },
    {
      label: 'Carbohydrates',
      value: nutrition.carbohydrates,
      unit: 'g',
      icon: Wheat,
      color: 'text-blue-700 bg-blue-50 border-blue-200/80',
      badgeColor: 'bg-blue-500',
      sub: `${Math.round(nutrition.carbohydrates * 4)} kcal`,
    },
    {
      label: 'Fat',
      value: nutrition.fat,
      unit: 'g',
      icon: Droplet,
      color: 'text-rose-700 bg-rose-50 border-rose-200/80',
      badgeColor: 'bg-rose-500',
      sub: `${Math.round(nutrition.fat * 9)} kcal`,
    },
    {
      label: 'Fiber',
      value: nutrition.fiber,
      unit: 'g',
      icon: Sparkles,
      color: 'text-teal-700 bg-teal-50 border-teal-200/80',
      badgeColor: 'bg-teal-500',
      sub: 'Gut & digestion',
    },
    {
      label: 'Sugar',
      value: nutrition.sugar,
      unit: 'g',
      icon: Cookie,
      color: 'text-purple-700 bg-purple-50 border-purple-200/80',
      badgeColor: 'bg-purple-500',
      sub: 'Natural & added',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${card.color} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.label}</span>
              <Icon className="w-4 h-4 opacity-75" />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {card.value}
                </span>
                <span className="text-xs font-bold text-slate-500">{card.unit}</span>
              </div>
              {card.sub && (
                <div className="text-[11px] font-medium text-slate-500 mt-1 truncate">
                  {card.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
