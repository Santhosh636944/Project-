import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Analysis } from '../types';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutGrid,
  List,
  UtensilsCrossed,
  Plus,
  Clock,
} from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.history.getList({
        search: search.trim() || undefined,
        mealType: mealType !== 'All' ? mealType : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit: 10,
      });
      setAnalyses(res.analyses);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalItems(res.pagination.totalItems || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, mealType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleResetFilters = () => {
    setSearch('');
    setMealType('All');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis from your history?')) return;
    try {
      await api.analysis.delete(id);
      fetchHistory();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse, search, and manage all your past food analyses ({totalItems} total logs)
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyze')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Analyze New Food</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food name (e.g. Biryani, Rice)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Meal Type Filter */}
          <div className="sm:col-span-2">
            <select
              value={mealType}
              onChange={(e) => {
                setMealType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="All">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Date From */}
          <div className="sm:col-span-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Filter from date"
            />
          </div>

          {/* Date To */}
          <div className="sm:col-span-2">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Filter to date"
            />
          </div>

          {/* Search Button */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {analyses.length} of {totalItems} meals
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analyses Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading history logs...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No analyses match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, date range, or meal category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {analyses.map((analysis) => {
            const foodTitles = analysis.foods.map((f) => f.name).join(' + ');
            const dateStr = new Date(analysis.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={analysis._id}
                onClick={() => onNavigate('analysis-detail', { id: analysis._id })}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={analysis.imageUrl}
                    alt={foodTitles}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                    {analysis.mealType}
                  </div>
                  {analysis.isDemo && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                      DEMO
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                      {foodTitles}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                    <div className="bg-amber-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-amber-700 font-semibold block">Calories</span>
                      <span className="font-bold text-amber-900">{analysis.totalNutrition.calories}</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-emerald-700 font-semibold block">Protein</span>
                      <span className="font-bold text-emerald-900">{analysis.totalNutrition.protein}g</span>
                    </div>
                    <div className="bg-blue-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-blue-700 font-semibold block">Carbs</span>
                      <span className="font-bold text-blue-900">{analysis.totalNutrition.carbohydrates}g</span>
                    </div>
                    <div className="bg-rose-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-rose-700 font-semibold block">Fat</span>
                      <span className="font-bold text-rose-900">{analysis.totalNutrition.fat}g</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span>View Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      onClick={(e) => handleDelete(analysis._id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 pl-6">Meal</th>
                  <th className="py-3.5">Category</th>
                  <th className="py-3.5">Calories</th>
                  <th className="py-3.5">Protein</th>
                  <th className="py-3.5">Carbs</th>
                  <th className="py-3.5">Fat</th>
                  <th className="py-3.5">Date</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {analyses.map((analysis) => {
                  const foodTitles = analysis.foods.map((f) => f.name).join(' + ');
                  const dateStr = new Date(analysis.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={analysis._id}
                      onClick={() => onNavigate('analysis-detail', { id: analysis._id })}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="py-3.5 pl-6 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={analysis.imageUrl}
                          alt={foodTitles}
                          className="w-10 h-10 rounded-xl object-cover border"
                        />
                        <span className="line-clamp-1 max-w-xs">{foodTitles}</span>
                      </td>
                      <td className="py-3.5 text-slate-600">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 font-semibold">
                          {analysis.mealType}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-amber-600">{analysis.totalNutrition.calories} kcal</td>
                      <td className="py-3.5 text-emerald-700">{analysis.totalNutrition.protein} g</td>
                      <td className="py-3.5 text-blue-700">{analysis.totalNutrition.carbohydrates} g</td>
                      <td className="py-3.5 text-rose-700">{analysis.totalNutrition.fat} g</td>
                      <td className="py-3.5 text-slate-400">{dateStr}</td>
                      <td className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('analysis-detail', { id: analysis._id });
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(analysis._id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-600 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
