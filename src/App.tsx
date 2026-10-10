import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FoodDatabasePage } from './pages/FoodDatabasePage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Page routing state
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [routeParams, setRouteParams] = useState<any>({});

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (!hash) {
        return;
      }
      if (hash.startsWith('analysis/')) {
        const id = hash.split('/')[1];
        setCurrentPage('analysis-detail');
        setRouteParams({ id });
      } else {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When auth changes, redirect accordingly
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
        navigateTo('dashboard');
      } else if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register') {
        navigateTo('login');
      }
    }
  }, [isAuthenticated, loading]);

  const navigateTo = (page: string, params?: any) => {
    setCurrentPage(page);
    setRouteParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'analysis-detail' && params?.id) {
      window.location.hash = `#/analysis/${params.id}`;
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading NutriVision AI...
          </p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'analyze':
        return <AnalyzePage onNavigate={navigateTo} />;
      case 'analysis-detail':
        return <AnalysisDetailPage id={routeParams.id} onNavigate={navigateTo} />;
      case 'history':
        return <HistoryPage onNavigate={navigateTo} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'foods':
        return <FoodDatabasePage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <DashboardPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </AuthProvider>
  );
}
