import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDemo } from '../context/DemoContext';
import {
  Utensils,
  Camera,
  LayoutDashboard,
  History,
  BarChart3,
  Database,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Food', icon: Camera, primary: true },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'foods', label: 'Food DB', icon: Database },
  ];

  const handleNav = (id: string, params?: any) => {
    onNavigate(id, params);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Banner if active */}
      {isDemoMode && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 mx-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEMO MODE ACTIVE: Using predefined sample food profiles and calibrated nutritional models.</span>
          </div>
          <button
            onClick={toggleDemoMode}
            className="text-xs bg-amber-600 hover:bg-amber-700 px-2 py-0.5 rounded text-white font-medium transition cursor-pointer"
          >
            Turn Off
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Nutri<span className="text-emerald-600">Vision</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                See your food. Understand your nutrition.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = currentPage === link.id;
                if (link.primary) {
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      className="ml-2 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </button>
                  );
                }
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                    currentPage === 'admin'
                      ? 'bg-purple-100 text-purple-800 font-semibold'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
            </nav>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo Toggle */}
            <button
              onClick={toggleDemoMode}
              title={isDemoMode ? 'Demo mode is ON' : 'Turn on Demo mode'}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isDemoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <img
                    src={user.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nutri'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Goals</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 flex items-center gap-2 transition cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-500" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        handleNav('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDemoMode}
              className={`p-1.5 rounded-lg border text-xs ${
                isDemoMode ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Demo: {isDemoMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                <img
                  src={user?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nutri'}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      currentPage === link.id
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => handleNav('profile')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <User className="w-5 h-5 text-slate-500" />
                <span>My Profile</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 bg-purple-50 transition cursor-pointer"
                >
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  <span>Admin Panel</span>
                </button>
              )}

              <div className="border-t border-slate-100 pt-2">
                <button
                  onClick={() => {
                    logout();
                    handleNav('landing');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleNav('login')}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
