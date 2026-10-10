import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Analysis, DetectedFood } from '../types';
import { NutritionCards } from '../components/NutritionCard';
import { MacronutrientPieChart } from '../components/MacronutrientPieChart';
import { FoodItemEditorModal } from '../components/FoodItemEditorModal';
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Sparkles,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  Scale,
  Flame,
  Clock,
  Info,
  Layers,
} from 'lucide-react';

interface AnalysisDetailPageProps {
  id: string;
  onNavigate: (page: string, params?: any) => void;
}

export const AnalysisDetailPage: React.FC<AnalysisDetailPageProps> = ({ id, onNavigate }) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        const res = await api.analysis.getById(id);
        setAnalysis(res.analysis);
      } catch (err: any) {
        setError(err.message || 'Failed to load analysis record.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  const handleFoodUpdated = (updatedFood: DetectedFood) => {
    if (!analysis || editingFoodIndex === null) return;
    const updatedFoods = [...analysis.foods];
    updatedFoods[editingFoodIndex] = updatedFood;

    // Recalculate totals
    const newTotals = updatedFoods.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.nutrition?.calories || 0),
        protein: Number((acc.protein + (item.nutrition?.protein || 0)).toFixed(1)),
        carbohydrates: Number((acc.carbohydrates + (item.nutrition?.carbohydrates || 0)).toFixed(1)),
        fat: Number((acc.fat + (item.nutrition?.fat || 0)).toFixed(1)),
        fiber: Number((acc.fiber + (item.nutrition?.fiber || 0)).toFixed(1)),
        sugar: Number((acc.sugar + (item.nutrition?.sugar || 0)).toFixed(1)),
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0 }
    );

    setAnalysis({
      ...analysis,
      foods: updatedFoods,
      totalNutrition: newTotals,
      portionUncertain: false,
    });
  };

  const handleSaveToServer = async () => {
    if (!analysis) return;
    try {
      setIsSaving(true);
      await api.analysis.update(analysis._id, {
        foods: analysis.foods,
        mealType: analysis.mealType,
        notes: analysis.notes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!analysis) return;
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await api.analysis.delete(analysis._id);
      onNavigate('history');
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Retrieving nutritional breakdown...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-sm">
          {error || 'Analysis record not found.'}
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const dateFormatted = new Date(analysis.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('history')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis History</span>
        </button>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </span>
          )}
          <button
            onClick={handleSaveToServer}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Adjustments'}</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
            title="Delete analysis"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image & Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 shadow-md">
          <img src={analysis.imageUrl} alt="Food analysis" className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
            {analysis.mealType}
          </div>
          {analysis.isDemo && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold shadow-xs">
              DEMO MODE
            </div>
          )}
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
              {Math.round(analysis.aiConfidence * 100)}% AI Match Confidence
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted}</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {analysis.foods.map((f) => f.name).join(' + ')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {analysis.foods.length} distinct food components identified on plate
            </p>
          </div>

          {/* AI Explanation Box (Section 11) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Recognition Summary</span>
            </div>
            <p className="leading-relaxed">{analysis.explanation}</p>
          </div>

          {/* Portion Estimation Uncertainty Warning if detected (Section 12) */}
          {analysis.portionUncertain && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Portion estimation is uncertain.</span>
                <span>Please adjust the quantity or food name manually using the edit buttons below.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nutrition Summary Cards (Section 11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Total Plate Nutrition</h3>
          <span className="text-xs text-slate-400 font-medium">Estimated values based on portion density</span>
        </div>
        <NutritionCards nutrition={analysis.totalNutrition} />
      </div>

      {/* Macronutrient Caloric Donut Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Macronutrient Caloric Distribution</h3>
          <p className="text-xs text-slate-500">
            Energy breakdown from Protein (4 kcal/g), Carbohydrates (4 kcal/g), and Fat (9 kcal/g)
          </p>
        </div>

        <MacronutrientPieChart
          protein={analysis.totalNutrition.protein}
          carbohydrates={analysis.totalNutrition.carbohydrates}
          fat={analysis.totalNutrition.fat}
        />
      </div>

      {/* Detected Food Items Breakdown Table & Manual Correction (Section 10 & 14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Detected Components &amp; Portions</h3>
            <p className="text-xs text-slate-500">
              Click “Edit” on any item to change the food name, portion weight, or serving unit.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Auto-Recalculating
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Food Name</th>
                <th className="pb-3">Portion / Quantity</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Calories</th>
                <th className="pb-3">Protein</th>
                <th className="pb-3">Carbs</th>
                <th className="pb-3">Fat</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {analysis.foods.map((food, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 pl-2 font-bold text-slate-900">{food.name}</td>
                  <td className="py-3.5 text-slate-600">
                    <span className="font-semibold text-slate-800">{food.estimated_quantity}</span> {food.unit}
                  </td>
                  <td className="py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {Math.round(food.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-amber-600">{food.nutrition?.calories} kcal</td>
                  <td className="py-3.5 text-emerald-700">{food.nutrition?.protein} g</td>
                  <td className="py-3.5 text-blue-700">{food.nutrition?.carbohydrates} g</td>
                  <td className="py-3.5 text-rose-700">{food.nutrition?.fat} g</td>
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      onClick={() => setEditingFoodIndex(idx)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1 ml-auto transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Food Item Editor Modal */}
      {editingFoodIndex !== null && (
        <FoodItemEditorModal
          isOpen={editingFoodIndex !== null}
          food={analysis.foods[editingFoodIndex]}
          onClose={() => setEditingFoodIndex(null)}
          onSave={handleFoodUpdated}
        />
      )}
    </div>
  );
};
