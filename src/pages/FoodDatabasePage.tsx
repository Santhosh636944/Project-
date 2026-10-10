import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FoodItem } from '../types';
import { Database, Search, Filter, Flame, Info, Check, Plus } from 'lucide-react';

interface FoodDatabasePageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const FoodDatabasePage: React.FC<FoodDatabasePageProps> = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Main Dish',
    'South Indian',
    'Grains',
    'Poultry',
    'Dairy & Eggs',
    'Fruits',
    'Vegetables',
    'Bakery',
    'Breads',
    'Asian',
    'Seafood',
    'Legumes',
    'Salads',
  ];

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.foods.search(
        search.trim() || undefined,
        selectedCategory !== 'All' ? selectedCategory : undefined
      );
      setFoods(res.foods);
    } catch (err) {
      console.error('Failed to fetch food database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFoods();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Database className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nutrition Database
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Calibrated nutritional reference standards per 100 grams used by NutriVision AI for portion estimation.
        </p>
      </div>

      {/* Search and Category filter */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search standard foods (e.g. Biryani, Dosa, Rice, Chicken)..."
            className="w-full pl-10 pr-24 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading reference foods...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">No matching food items found.</p>
          <p className="text-xs text-slate-500">Try changing your search term or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{food.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {food.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-600">{food.caloriesPer100g}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">kcal / 100g</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                <span>Standard serving:</span>
                <span className="font-semibold text-slate-800">
                  {food.servingSizeGrams}g ({food.servingUnit})
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs pt-1 border-t border-slate-100">
                <div className="bg-emerald-50/60 p-1.5 rounded-lg">
                  <span className="text-[9px] text-emerald-700 font-bold block uppercase">Prot</span>
                  <span className="font-bold text-slate-800 text-[11px]">{food.proteinPer100g}g</span>
                </div>
                <div className="bg-blue-50/60 p-1.5 rounded-lg">
                  <span className="text-[9px] text-blue-700 font-bold block uppercase">Carb</span>
                  <span className="font-bold text-slate-800 text-[11px]">{food.carbsPer100g}g</span>
                </div>
                <div className="bg-rose-50/60 p-1.5 rounded-lg">
                  <span className="text-[9px] text-rose-700 font-bold block uppercase">Fat</span>
                  <span className="font-bold text-slate-800 text-[11px]">{food.fatPer100g}g</span>
                </div>
                <div className="bg-teal-50/60 p-1.5 rounded-lg">
                  <span className="text-[9px] text-teal-700 font-bold block uppercase">Fiber</span>
                  <span className="font-bold text-slate-800 text-[11px]">{food.fiberPer100g}g</span>
                </div>
                <div className="bg-purple-50/60 p-1.5 rounded-lg">
                  <span className="text-[9px] text-purple-700 font-bold block uppercase">Sugar</span>
                  <span className="font-bold text-slate-800 text-[11px]">{food.sugarPer100g}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
