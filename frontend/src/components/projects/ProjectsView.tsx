import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Github, ExternalLink, Plus, Code2, BookOpen, Layers } from 'lucide-react';
import { useProjectsStore } from '../../store/projectsStore';

export const ProjectsView: React.FC = () => {
  const { projects, fetchProjects, createProject, addNote } = useProjectsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [progress, setProgress] = useState(0);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const techs = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    await createProject({
      title,
      description,
      technologies: techs,
      repo_url: repoUrl,
      demo_url: demoUrl,
      progress_percentage: progress,
    });
    setTitle('');
    setDescription('');
    setTechInput('');
    setRepoUrl('');
    setDemoUrl('');
    setShowAddModal(false);
  };

  const handleAddNote = async (projectId: string) => {
    if (!noteTitle || !noteContent) return;
    await addNote(projectId, noteTitle, noteContent);
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Add Project Button */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white">Software Architecture Projects</h2>
          <p className="text-xs text-zinc-400">Track repositories, milestones, stack choices, and project notes.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-zinc-500 text-xs rounded-2xl">
            No projects added yet. Click "New Project" to track software builds.
          </div>
        ) : (
          projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold">{p.progress_percentage}% Done</span>
                  <div className="flex items-center space-x-2">
                    {p.repo_url && (
                      <a
                        href={p.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.demo_url && (
                      <a
                        href={p.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white mb-1">{p.title}</h3>
                {p.description && <p className="text-xs text-zinc-400 mb-4">{p.description}</p>}

                {/* Tech Pills */}
                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-white/5 text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Architectural Note Form */}
              <div className="border-t border-white/5 pt-3 mt-2">
                <p className="text-[11px] font-semibold text-zinc-400 mb-2">Architectural Note</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Note Title (e.g. RAG Pipeline Spec)"
                    value={selectedProjectId === p.id ? noteTitle : ''}
                    onChange={(e) => {
                      setSelectedProjectId(p.id);
                      setNoteTitle(e.target.value);
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
                  />
                  <textarea
                    rows={2}
                    placeholder="Note content markdown..."
                    value={selectedProjectId === p.id ? noteContent : ''}
                    onChange={(e) => {
                      setSelectedProjectId(p.id);
                      setNoteContent(e.target.value);
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                  <button
                    onClick={() => handleAddNote(p.id)}
                    className="w-full py-1.5 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Add Software Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compass AI OS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Python, FastAPI, React, PostgreSQL, pgvector"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Repository Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Project architecture overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
