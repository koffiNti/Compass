import React from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { Header } from './Header';
import { AuthModal } from '../auth/AuthModal';
import { useAuthStore } from '../../store/authStore';

interface AppLayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenCommandPalette: () => void;
  onOpenAISettings?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onOpenAISettings,
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  const tabTitles: Record<NavTab, string> = {
    dashboard: 'Overview & Daily Operating Picture',
    journal: 'Daily Reflection & Journal',
    metrics: 'Configurable Daily Tracking Metrics',
    habits: 'Habit Consistency & Heatmaps',
    goals: 'Multi-Horizon Goals Engine',
    projects: 'Software Architecture Projects',
    vault: 'Knowledge Vault & RAG Search',
    coach: 'AI Personal Operating Coach',
    analytics: 'Multi-Year Habit & Productivity Analytics',
    search: 'AI Universal Operating Search',
  };

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={onOpenCommandPalette}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={tabTitles[activeTab]} onOpenAISettings={onOpenAISettings} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="fixed -top-40 right-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="fixed bottom-10 left-60 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
          {children}
        </main>
      </div>
    </div>
  );
};
