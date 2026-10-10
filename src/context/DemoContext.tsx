import React, { createContext, useContext, useState } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('nutrivision_demo_mode') === 'true';
  });

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    localStorage.setItem('nutrivision_demo_mode', String(val));
  };

  const toggleDemoMode = () => {
    setDemoMode(!isDemoMode);
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, setDemoMode, toggleDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
