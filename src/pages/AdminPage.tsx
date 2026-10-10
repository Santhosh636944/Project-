import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, FoodItem } from '../types';
import {
  ShieldAlert,
  Users,
  Database,
  BarChart,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Ban,
  Flame,
  Utensils,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'foods' | 'stats'>('users');

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Foods state
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodModalOpen, setFoodModalOpen] = useState(false);

  // System stats state
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Food form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Main Dish');
  const [formCalories, setFormCalories] = useState(150);
  const [formProtein, setFormProtein] = useState(5);
  const [formCarbs, setFormCarbs] = useState(20);
  const [formFat, setFormFat] = useState(5);
  const [formFiber, setFormFiber] = useState(2);
  const [formSugar, setFormSugar] = useState(2);
  const [formServingUnit, setFormServingUnit] = useState('serving');
  const [formServingSize, setFormServingSize] = useState(100);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await api.admin.getUsers(userSearch.trim() || undefined);
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      setFoodsLoading(true);
      const res = await api.foods.search(foodSearch.trim() || undefined);
      setFoods(res.foods);
    } catch (err) {
      console.error(err);
    } finally {
      setFoodsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.admin.getStats();
      setStats(res.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'foods') fetchFoods();
    if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  const handleToggleUser = async (id: string) => {
    try {
      await api.admin.toggleUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await api.admin.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Delete user failed.');
    }
  };

  const openFoodModal = (food?: FoodItem) => {
    if (food) {
      setEditingFood(food);
      setFormName(food.name);
      setFormCategory(food.category);
      setFormCalories(food.caloriesPer100g);
      setFormProtein(food.proteinPer100g);
      setFormCarbs(food.carbsPer100g);
      setFormFat(food.fatPer100g);
      setFormFiber(food.fiberPer100g);
      setFormSugar(food.sugarPer100g);
      setFormServingUnit(food.servingUnit);
      setFormServingSize(food.servingSizeGrams);
    } else {
      setEditingFood(null);
      setFormName('');
      setFormCategory('Main Dish');
      setFormCalories(150);
      setFormProtein(5);
      setFormCarbs(20);
      setFormFat(5);
      setFormFiber(2);
      setFormSugar(2);
      setFormServingUnit('serving');
      setFormServingSize(100);
    }
    setFoodModalOpen(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.admin.updateFood(editingFood._id, {
          name: formName,
          category: formCategory,
          caloriesPer100g: Number(formCalories),
          proteinPer100g: Number(formProtein),
          carbsPer100g: Number(formCarbs),
          fatPer100g: Number(formFat),
          fiberPer100g: Number(formFiber),
          sugarPer100g: Number(formSugar),
          servingUnit: formServingUnit,
          servingSizeGrams: Number(formServingSize),
        });
      } else {
        await api.admin.createFood({
          name: formName,
          category: formCategory,
          caloriesPer100g: Number(formCalories),
          proteinPer100g: Number(formProtein),
          carbsPer100g: Number(formCarbs),
          fatPer100g: Number(formFat),
          fiberPer100g: Number(formFiber),
          sugarPer100g: Number(formSugar),
          servingUnit: formServingUnit,
          servingSizeGrams: Number(formServingSize),
        });
      }
      setFoodModalOpen(false);
      fetchFoods();
    } catch (err: any) {
      alert(err.message || 'Failed to save food item.');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm('Delete this food standard from reference database?')) return;
    try {
      await api.admin.deleteFood(id);
      fetchFoods();
    } catch (err: any) {
      alert(err.message || 'Failed to delete food.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrator Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Platform governance, user account management, reference food standards, and system analytics.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'users' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'foods' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Food Database</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'stats' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Platform Stats</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search registered users by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Filter Users
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 pl-6">User</th>
                    <th className="py-3.5">Email</th>
                    <th className="py-3.5">Role</th>
                    <th className="py-3.5">Status</th>
                    <th className="py-3.5">Joined</th>
                    <th className="py-3.5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 pl-6 flex items-center gap-2.5">
                        <img
                          src={u.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full border"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </td>
                      <td className="py-3 text-slate-600">{u.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 w-max ${
                            u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-600' : 'bg-rose-600'}`}
                          />
                          <span>{u.isActive ? 'Active' : 'Disabled'}</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleUser(u._id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              u.isActive
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Food Database Management */}
      {activeTab === 'foods' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder="Search food database..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={fetchFoods}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Search
              </button>
              <button
                onClick={() => openFoodModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 pl-6">Food Name</th>
                    <th className="py-3.5">Category</th>
                    <th className="py-3.5">Calories / 100g</th>
                    <th className="py-3.5">Protein</th>
                    <th className="py-3.5">Carbs</th>
                    <th className="py-3.5">Fat</th>
                    <th className="py-3.5">Serving</th>
                    <th className="py-3.5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {foods.map((f) => (
                    <tr key={f._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 pl-6 font-bold text-slate-900">{f.name}</td>
                      <td className="py-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-amber-600">{f.caloriesPer100g} kcal</td>
                      <td className="py-3 text-emerald-700">{f.proteinPer100g}g</td>
                      <td className="py-3 text-blue-700">{f.carbsPer100g}g</td>
                      <td className="py-3 text-rose-700">{f.fatPer100g}g</td>
                      <td className="py-3 text-slate-500">
                        {f.servingSizeGrams}g ({f.servingUnit})
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openFoodModal(f)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(f._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: System Analytics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalUsers || 0}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Registered profiles</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Analyses</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalAnalyses || 0}</div>
              <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Meals processed</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Food Database</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalFoodsInDb || 0}</div>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Standard items</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Calories / Meal</span>
              <div className="text-3xl font-black text-amber-600 mt-2">{stats?.avgCalories || 0} kcal</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Platform-wide average</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Most Frequently Analyzed Dishes</h3>
            <p className="text-xs text-slate-500">Global breakdown of top detected dishes across all users</p>

            <div className="divide-y divide-slate-100">
              {stats?.mostAnalyzedFoods?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">{item.count} detections</span>
                    <span className="font-bold text-amber-600">{item.calories} total kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Item Modal */}
      {foodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setFoodModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editingFood ? 'Edit Food Standard' : 'Add New Food Standard'}
            </h3>

            <form onSubmit={handleSaveFood} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Food Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Calories (100g)</label>
                  <input
                    type="number"
                    value={formCalories}
                    onChange={(e) => setFormCalories(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formProtein}
                    onChange={(e) => setFormProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formFat}
                    onChange={(e) => setFormFat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formFiber}
                    onChange={(e) => setFormFiber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formSugar}
                    onChange={(e) => setFormSugar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serving Unit</label>
                  <input
                    type="text"
                    value={formServingUnit}
                    onChange={(e) => setFormServingUnit(e.target.value)}
                    placeholder="e.g. plate, cup, piece"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serving Size (Grams)</label>
                  <input
                    type="number"
                    value={formServingSize}
                    onChange={(e) => setFormServingSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFoodModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Save Food Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
