import React, { useState, useEffect } from 'react';
import { DetectedFood, FoodItem } from '../types';
import { api } from '../services/api';
import { X, Check, Search, Calculator, AlertTriangle } from 'lucide-react';

interface FoodItemEditorModalProps {
  food: DetectedFood | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFood: DetectedFood) => void;
}

export const FoodItemEditorModal: React.FC<FoodItemEditorModalProps> = ({
  food,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !food) return null;

  const [name, setName] = useState(food.name);
  const [quantity, setQuantity] = useState(food.estimated_quantity);
  const [unit, setUnit] = useState(food.unit || 'g');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [previewNutrition, setPreviewNutrition] = useState(food.nutrition);

  // Search standard foods as user types
  useEffect(() => {
    if (name.trim().length >= 2) {
      setSearching(true);
      const timer = setTimeout(async () => {
        try {
          const res = await api.foods.search(name.trim());
          setSuggestions(res.foods.slice(0, 4));
        } catch (err) {
          // ignore
        } finally {
          setSearching(false);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [name]);

  // Recalculate preview nutrition whenever quantity or unit changes
  useEffect(() => {
    const scale = food.estimated_quantity > 0 ? quantity / food.estimated_quantity : 1;
    setPreviewNutrition({
      calories: Math.round(food.nutrition.calories * scale),
      protein: Number((food.nutrition.protein * scale).toFixed(1)),
      carbohydrates: Number((food.nutrition.carbohydrates * scale).toFixed(1)),
      fat: Number((food.nutrition.fat * scale).toFixed(1)),
      fiber: Number((food.nutrition.fiber * scale).toFixed(1)),
      sugar: Number((food.nutrition.sugar * scale).toFixed(1)),
    });
  }, [quantity, unit, food]);

  const selectSuggestion = (item: FoodItem) => {
    setName(item.name);
    setUnit('g');
    const factor = (quantity || 100) / 100;
    setPreviewNutrition({
      calories: Math.round(item.caloriesPer100g * factor),
      protein: Number((item.proteinPer100g * factor).toFixed(1)),
      carbohydrates: Number((item.carbsPer100g * factor).toFixed(1)),
      fat: Number((item.fatPer100g * factor).toFixed(1)),
      fiber: Number((item.fiberPer100g * factor).toFixed(1)),
      sugar: Number((item.sugarPer100g * factor).toFixed(1)),
    });
    setSuggestions([]);
  };

  const handleSave = () => {
    onSave({
      ...food,
      name: name.trim(),
      estimated_quantity: Number(quantity) || 1,
      unit,
      nutrition: previewNutrition,
      confidence: 1.0, // user confirmed
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit Food &amp; Portion</h3>
            <p className="text-xs text-slate-500">Correct detection or calibrate portion size.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Food Name with autocompletion */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Food Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chicken Biryani, Dosa, Rice"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="mt-1.5 p-1.5 bg-white rounded-xl border border-slate-200 shadow-md space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                  Database matches (per 100g)
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => selectSuggestion(item)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-slate-500">{item.caloriesPer100g} kcal / 100g</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Quantity</label>
              <input
                type="number"
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Serving Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 bg-white"
              >
                <option value="g">grams (g)</option>
                <option value="piece">piece / item</option>
                <option value="slice">slice</option>
                <option value="cup">cup</option>
                <option value="bowl">bowl</option>
                <option value="plate">plate</option>
                <option value="ml">milliliters (ml)</option>
              </select>
            </div>
          </div>

          {/* Recalculated Live Preview */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
              <span>Recalculated Nutrition:</span>
              <span className="text-sm font-extrabold text-emerald-700">{previewNutrition.calories} kcal</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Protein</span>
                <span className="font-bold text-slate-800">{previewNutrition.protein}g</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Carbs</span>
                <span className="font-bold text-slate-800">{previewNutrition.carbohydrates}g</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Fat</span>
                <span className="font-bold text-slate-800">{previewNutrition.fat}g</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Fiber</span>
                <span className="font-bold text-slate-800">{previewNutrition.fiber}g</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Sugar</span>
                <span className="font-bold text-slate-800">{previewNutrition.sugar}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
