import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../lib/api';
import { buttonVariants } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';
import type { SubmitEvent } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  livelink?: string;
  owner: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  techStack: string;
  githubLink: string;
  livelink: string;
}

const EMPTY_FORM: ProjectFormData = {
  title: '',
  description: '',
  techStack: '',
  githubLink: '',
  livelink: '',
};

// ── Modal ────────────────────────────────────────────────────────────────────
interface ProjectModalProps {
  isOpen: boolean;
  editingProject: Project | null;
  onClose: () => void;
  onSaved: () => void;
}

const ProjectModal = ({ isOpen, editingProject, onClose, onSaved } : ProjectModalProps) => {
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProject) {
      setForm({
        title: editingProject.title,
        description: editingProject.description,
        techStack: editingProject.techStack.join(', '),
        githubLink: editingProject.githubLink ?? '',
        livelink: editingProject.livelink ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [editingProject, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      githubLink: form.githubLink.trim() || undefined,
      livelink: form.livelink.trim() || undefined,
    };

    setIsLoading(true);
    try {
      const res = editingProject
        ? await fetchWithAuth(`/project/${editingProject._id}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await fetchWithAuth('/project', { method: 'POST', body: JSON.stringify(payload) });

      if (!res.ok) {
        const data = await res.json();
        setError(data.msg || 'Something went wrong.');
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError('Unable to reach the server.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-[500px] bg-white rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.12)] border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-xl font-extrabold text-[#1a1a1a] mb-1 tracking-tight">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h2>
        <p className="text-[13px] text-zinc-500 mb-6">
          {editingProject ? 'Update the details below.' : "Share something you've built."}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1a1a1a] pl-1">Title *</label>
            <Input
              name="title"
              placeholder="My awesome project"
              value={form.title}
              onChange={handleChange}
              className="bg-gray-50/80 border-gray-200 h-10 text-[14px] focus-visible:ring-[#E67A62]/20 focus-visible:border-[#E67A62]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1a1a1a] pl-1">Description *</label>
            <textarea
              name="description"
              placeholder="What does it do?"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-[14px] text-[#1a1a1a] placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#E67A62]/20 focus:border-[#E67A62] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1a1a1a] pl-1">Tech Stack</label>
            <Input
              name="techStack"
              placeholder="React, TypeScript, Node.js (comma-separated)"
              value={form.techStack}
              onChange={handleChange}
              className="bg-gray-50/80 border-gray-200 h-10 text-[14px] focus-visible:ring-[#E67A62]/20 focus-visible:border-[#E67A62]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1a1a1a] pl-1">GitHub URL</label>
              <Input
                name="githubLink"
                placeholder="https://github.com/..."
                value={form.githubLink}
                onChange={handleChange}
                className="bg-gray-50/80 border-gray-200 h-10 text-[14px] focus-visible:ring-[#E67A62]/20 focus-visible:border-[#E67A62]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1a1a1a] pl-1">Live URL</label>
              <Input
                name="livelink"
                placeholder="https://..."
                value={form.livelink}
                onChange={handleChange}
                className="bg-gray-50/80 border-gray-200 h-10 text-[14px] focus-visible:ring-[#E67A62]/20 focus-visible:border-[#E67A62]"
              />
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500 font-medium pl-1">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-gray-200 text-[14px] font-semibold text-zinc-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                buttonVariants({ size: 'default' }),
                'flex-1 h-10 bg-[#E67A62] hover:bg-[#D66D57] text-white rounded-xl font-bold border-none transition-all disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Profile Page ────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/project');
      if (res.ok) {
        const data = await res.json();
        const all: Project[] = data.response ?? [];
        // Filter to only this user's projects
        setProjects(all.filter((p) => p.owner === user?._id));
      }
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setIsFetching(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await fetchWithAuth(`/project/${projectId}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch {
      console.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // Initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] pt-[100px]">
      {/* ── Profile Header ── */}
      <section className="container mx-auto px-6 max-w-[1100px] py-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E67A62] to-[#F59E7E] flex items-center justify-center text-white text-2xl font-extrabold shrink-0 shadow-[0_8px_24px_rgba(230,122,98,0.25)]">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight truncate">{user?.name}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
            {user?.bio && (
              <p className="text-[14px] text-zinc-600 mt-2 leading-relaxed">{user.bio}</p>
            )}

            {/* Tech tags */}
            {user?.tech && user.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.tech.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-[#E67A62]/10 text-[#E67A62] text-[11px] font-bold rounded-full uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Socials */}
            {user?.socials && (
              <div className="flex items-center gap-4 mt-3">
                {user.socials.github && (
                  <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#1a1a1a] transition-colors text-[13px] font-medium flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                    GitHub
                  </a>
                )}
                {user.socials.linkedin && (
                  <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#0077B5] transition-colors text-[13px] font-medium flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    LinkedIn
                  </a>
                )}
                {user.socials.portfolio && (
                  <a href={user.socials.portfolio} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-[#E67A62] transition-colors text-[13px] font-medium">
                    Portfolio ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            className="shrink-0 h-9 px-4 rounded-xl border border-gray-200 text-[13px] font-semibold text-zinc-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className="container mx-auto px-6 max-w-[1100px] pb-20">
        {/* Section header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#1a1a1a] tracking-tight">My Projects</h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} published
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'bg-[#E67A62] hover:bg-[#D66D57] text-white font-semibold border-none rounded-xl px-4 transition-transform hover:-translate-y-[1px]'
            )}
          >
            + Add Project
          </button>
        </div>

        {/* Loading */}
        {isFetching && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-[#E67A62] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isFetching && projects.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E67A62]/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E67A62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <h3 className="text-[17px] font-extrabold text-[#1a1a1a] mb-1">No projects yet</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-[280px] mx-auto">
              You haven't published any projects yet. Add your first one!
            </p>
            <button
              onClick={handleOpenAdd}
              className={cn(buttonVariants({ size: 'sm' }), 'bg-[#E67A62] hover:bg-[#D66D57] text-white font-semibold border-none rounded-xl px-5')}
            >
              Add Your First Project
            </button>
          </div>
        )}

        {/* Project grid */}
        {!isFetching && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 flex flex-col hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Title */}
                <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight mb-1.5 truncate">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 text-zinc-600 text-[11px] font-semibold rounded-full">
                        {t}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-zinc-400 text-[11px] font-semibold rounded-full">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 mb-5 text-[12px] font-semibold">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-zinc-500 hover:text-[#1a1a1a] transition-colors">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                      GitHub
                    </a>
                  )}
                  {project.livelink && (
                    <a href={project.livelink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#E67A62] hover:text-[#D66D57] transition-colors">
                      Live ↗
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="flex-1 h-8 rounded-lg border border-gray-200 text-[12px] font-semibold text-zinc-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="flex-1 h-8 rounded-lg border border-transparent text-[12px] font-semibold text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingId === project._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <ProjectModal
        isOpen={modalOpen}
        editingProject={editingProject}
        onClose={() => setModalOpen(false)}
        onSaved={fetchProjects}
      />
    </div>
  );
};

export default ProfilePage;
