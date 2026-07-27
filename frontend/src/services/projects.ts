import { api } from './api';
import { Project } from '../types';

export const projectsService = {
  listProjects: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data;
  },

  createProject: async (projData: Partial<Project>): Promise<Project> => {
    const res = await api.post('/projects', projData);
    return res.data;
  },

  addMilestone: async (projectId: string, title: string) => {
    const res = await api.post(`/projects/${projectId}/milestones`, null, { params: { title } });
    return res.data;
  },

  addNote: async (projectId: string, title: string, content: string) => {
    const res = await api.post(`/projects/${projectId}/notes`, null, { params: { title, content } });
    return res.data;
  },
};
