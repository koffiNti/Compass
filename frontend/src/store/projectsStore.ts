import { create } from 'zustand';
import { Project } from '../types';
import { projectsService } from '../services/projects';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (projData: Partial<Project>) => Promise<void>;
  addMilestone: (projectId: string, title: string) => Promise<void>;
  addNote: (projectId: string, title: string, content: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const list = await projectsService.listProjects();
      set({ projects: list, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch projects.', isLoading: false });
    }
  },

  createProject: async (projData) => {
    try {
      await projectsService.createProject(projData);
      get().fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  },

  addMilestone: async (projectId, title) => {
    try {
      await projectsService.addMilestone(projectId, title);
      get().fetchProjects();
    } catch (err) {
      console.error('Error adding project milestone:', err);
    }
  },

  addNote: async (projectId, title, content) => {
    try {
      await projectsService.addNote(projectId, title, content);
      get().fetchProjects();
    } catch (err) {
      console.error('Error adding project note:', err);
    }
  },
}));
