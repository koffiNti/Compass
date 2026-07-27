import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { JournalView } from './components/journal/JournalView';
import { MetricsView } from './components/metrics/MetricsView';
import { HabitsView } from './components/habits/HabitsView';
import { GoalsView } from './components/goals/GoalsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { VaultView } from './components/vault/VaultView';
import { CoachView } from './components/coach/CoachView';
import { AISearchView } from './components/search/AISearchView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CommandPalette } from './components/command/CommandPalette';
import { AISettingsModal } from './components/settings/AISettingsModal';

export const App: React.FC = () => {
  const { fetchCurrentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'journal':
        return <JournalView />;
      case 'metrics':
        return <MetricsView />;
      case 'habits':
        return <HabitsView />;
      case 'goals':
        return <GoalsView />;
      case 'projects':
        return <ProjectsView />;
      case 'vault':
        return <VaultView />;
      case 'coach':
        return <CoachView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'search':
        return <AISearchView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
      >
        {renderActiveTab()}
      </AppLayout>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />
    </>
  );
};

export default App;
