import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchPublic, fetchWithAuth } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { User } from '../context/AuthContext';

export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  livelink?: string;
  owner: Owner;
  createdAt: string;
  upvotes?: string[];
  upvoteCount?: number;
}

export interface CommentAuthor { _id: string; name: string; email: string; }
export interface IComment { _id: string; content: string; author: CommentAuthor; createdAt: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const avatarColors = [
  'from-[#E67A62] to-[#F59E7E]',
  'from-[#6366f1] to-[#a5b4fc]',
  'from-[#10b981] to-[#6ee7b7]',
  'from-[#f59e0b] to-[#fcd34d]',
  'from-[#ec4899] to-[#f9a8d4]',
];

export const ownerColor = (id: string) =>
  avatarColors[id.charCodeAt(id.length - 1) % avatarColors.length];

// ── GitHub SVG ────────────────────────────────────────────────────────────────
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ── Comments Section ─────────────────────────────────────────────────────────
const CommentsSection = ({
  projectId,
  projectOwnerId,
  currentUser,
}: {
  projectId: string;
  projectOwnerId: string;
  currentUser: User | null;
}) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchPublic(`/project/${projectId}/comment`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setComments(d.comments ?? []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [projectId]);

  const handlePost = async () => {
    if (!currentUser) { navigate('/signin'); return; }
    if (draft.trim().length < 3) return;
    setSubmitting(true);
    try {
      const res = await fetchWithAuth(`/project/${projectId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content: draft.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => [data.comment, ...prev]);
        setDraft('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (editDraft.trim().length < 3) return;
    try {
      const res = await fetchWithAuth(`/project/${projectId}/comment/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editDraft.trim() }),
      });
      if (res.ok) {
        setComments(prev => prev.map(c =>
          c._id === commentId ? { ...c, content: editDraft.trim() } : c
        ));
        setEditingId(null);
      }
    } catch {}
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetchWithAuth(`/project/${projectId}/comment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {}
  };

  const canEdit = (c: IComment) => currentUser?._id === c.author._id;
  const canDelete = (c: IComment) =>
    currentUser?._id === c.author._id || currentUser?._id === projectOwnerId;

  return (
    <div className="mt-6 border-t border-gray-100 pt-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Discussion</p>

      {/* Post box */}
      {currentUser ? (
        <div className="flex gap-3 mb-5">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${ownerColor(currentUser._id)} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 mt-0.5`}>
            {getInitials(currentUser.name)}
          </div>
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Share your thoughts…"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/80 text-[13px] text-[#1a1a1a] placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#E67A62]/20 focus:border-[#E67A62] transition-colors resize-none"
            />
            <button
              onClick={handlePost}
              disabled={submitting || draft.trim().length < 3}
              className="mt-2 h-8 px-4 rounded-xl bg-[#E67A62] hover:bg-[#D66D57] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-bold transition-all"
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/signin')}
          className="mb-5 w-full py-2.5 rounded-xl border border-dashed border-gray-200 text-[13px] text-zinc-400 hover:border-[#E67A62]/40 hover:text-[#E67A62] transition-colors"
        >
          Sign in to leave a comment
        </button>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#E67A62] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-[13px] text-zinc-400 py-6">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map(c => (
            <div key={c._id} className="bg-[#faf7f2] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${ownerColor(c.author._id)} flex items-center justify-center text-white text-[9px] font-extrabold shrink-0`}>
                  {getInitials(c.author.name)}
                </div>
                <span className="text-[12px] font-semibold text-zinc-600">{c.author.name}</span>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] text-zinc-400">
                  {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                {/* Actions */}
                <div className="ml-auto flex items-center gap-2">
                  {canEdit(c) && editingId !== c._id && (
                    <button
                      onClick={() => { setEditingId(c._id); setEditDraft(c.content); }}
                      className="text-zinc-300 hover:text-[#E67A62] transition-colors"
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                  {canDelete(c) && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-zinc-300 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Content / edit inline */}
              {editingId === c._id ? (
                <div className="pl-8">
                  <textarea
                    value={editDraft}
                    onChange={e => setEditDraft(e.target.value)}
                    rows={2}
                    autoFocus
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-[13px] text-[#1a1a1a] outline-none focus:ring-2 focus:ring-[#E67A62]/20 focus:border-[#E67A62] transition-colors resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(c._id)}
                      disabled={editDraft.trim().length < 3}
                      className="h-7 px-3 rounded-lg bg-[#E67A62] hover:bg-[#D66D57] disabled:opacity-40 text-white text-[11px] font-bold transition-all"
                    >Save</button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="h-7 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-zinc-500 text-[11px] font-semibold transition-all"
                    >Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="pl-8 text-[13px] text-zinc-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const ProjectDetailModal = ({
  project,
  onClose,
  onUpvote,
  currentUserId,
  currentUser,
}: {
  project: Project | null;
  onClose: () => void;
  onUpvote: (id: string, e?: React.MouseEvent) => void;
  currentUserId?: string;
  currentUser: User | null;
}) => {
  if (!project) return null;

  const ownerName = project.owner?.name ?? 'Unknown';
  const ownerInitials = getInitials(ownerName);
  const color = ownerColor(project.owner?._id ?? '0');
  const date = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-[560px] bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-gray-100 z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Coloured accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E67A62] to-[#F59E7E] shrink-0" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-8 pt-6 mt-2">
          {/* Title */}
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight mb-2 pr-4">
            {project.title}
          </h2>

          {/* Author row */}
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}
            >
              {ownerInitials}
            </div>
            <span className="text-[13px] font-semibold text-zinc-500">{ownerName}</span>
            {date && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-[12px] text-zinc-400">{date}</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="bg-[#faf7f2] rounded-2xl p-5 mb-5">
            <p className="text-[13px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</p>
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Tech stack */}
          {project.techStack.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[#E67A62]/10 text-[#E67A62] text-[12px] font-bold rounded-full border border-[#E67A62]/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={(e) => project && onUpvote(project._id, e)}
              className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-[13px] font-semibold transition-all ${
                project?.upvotes?.includes(currentUserId || '')
                  ? 'bg-[#E67A62]/10 border-[#E67A62]/30 text-[#E67A62] hover:bg-[#E67A62]/20'
                  : 'bg-white border-gray-200 text-zinc-600 hover:text-[#1a1a1a] hover:border-gray-400'
              }`}
            >
              <svg viewBox="0 0 24 24" fill={project?.upvotes?.includes(currentUserId || '') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {project?.upvoteCount || 0}
            </button>
            {(project?.githubLink || project?.livelink) && (
              <>
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 text-[13px] font-semibold text-zinc-600 hover:text-[#1a1a1a] hover:border-gray-400 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                    View on GitHub
                  </a>
                )}
                {project.livelink && (
                  <a
                    href={project.livelink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#E67A62] hover:bg-[#D66D57] text-white text-[13px] font-bold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(230,122,98,0.3)]"
                  >
                    Live Demo ↗
                  </a>
                )}
              </>
            )}
          </div>

          {/* Comments */}
          <CommentsSection
            projectId={project._id}
            projectOwnerId={project.owner._id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────────
const ExploreCard = ({
  project,
  onClick,
  onUpvote,
  currentUserId,
}: {
  project: Project;
  onClick: () => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  currentUserId?: string;
}) => {
  const ownerName = project.owner?.name ?? 'Unknown';
  const ownerInitials = getInitials(ownerName);
  const color = ownerColor(project.owner?._id ?? '0');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-6 flex flex-col cursor-pointer hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#E67A62]/40"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight line-clamp-2 flex-1 group-hover:text-[#E67A62] transition-colors">
          {project.title}
        </h3>
        {project.livelink && (
          <span className="shrink-0 text-[11px] font-bold text-[#E67A62] border border-[#E67A62]/30 rounded-full px-2.5 py-0.5">
            Live ↗
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-3 mb-4 flex-1">
        {project.description}
      </p>

      {/* Tech tags */}
      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-[#faf7f2] text-zinc-600 text-[11px] font-semibold rounded-full border border-gray-100"
            >
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}
          >
            {ownerInitials}
          </div>
          <span className="text-[12px] font-semibold text-zinc-500 truncate max-w-[130px]">
            {ownerName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(project._id, e); }}
            className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors ${
              project.upvotes?.includes(currentUserId || '')
                ? 'text-[#E67A62]'
                : 'text-zinc-400 group-hover:text-zinc-600'
            }`}
          >
            <svg viewBox="0 0 24 24" fill={project.upvotes?.includes(currentUserId || '') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {project.upvoteCount || 0}
          </button>
          <span className="text-[11px] text-zinc-400 group-hover:text-[#E67A62] transition-colors font-medium">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ExplorePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchPublic('/project');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProjects(data.response ?? []);
      } catch {
        setError('Could not load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Gather all unique tech tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const handleUpvote = async (projectId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user) {
      navigate('/signin');
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p._id === projectId) {
        const hasUpvoted = p.upvotes?.includes(user._id);
        const upvotes = hasUpvoted
          ? (p.upvotes || []).filter(id => id !== user._id)
          : [...(p.upvotes || []), user._id];
        const upvoteCount = hasUpvoted
          ? Math.max(0, (p.upvoteCount || 0) - 1)
          : (p.upvoteCount || 0) + 1;
        
        const updatedProject = { ...p, upvotes, upvoteCount };
        if (selectedProject?._id === projectId) {
          setSelectedProject(updatedProject);
        }
        return updatedProject;
      }
      return p;
    }));

    try {
      await fetchWithAuth(`/project/${projectId}/upvote`, { method: 'PATCH' });
    } catch {
      // Silently fail or revert on error
    }
  };

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.owner?.name?.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q));
      const matchesTech = !techFilter || p.techStack.includes(techFilter);
      return matchesSearch && matchesTech;
    });
  }, [projects, search, techFilter]);

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] pt-[100px]">
      {/* ── Hero ── */}
      <section className="container mx-auto px-6 max-w-[1100px] py-12 pb-6">
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#E67A62] bg-[#E67A62]/10 rounded-full px-3 py-1 mb-4">
          Community Projects
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight mb-3">
          Explore what builders{' '}
          <span className="text-[#E67A62]">are shipping</span>
        </h1>
        <p className="text-base text-zinc-500 max-w-[520px] leading-relaxed">
          Discover projects shared by developers in the Launchpad community — from side projects to full-stack apps.
        </p>
      </section>

      {/* ── Filters ── */}
      <section className="container mx-auto px-6 max-w-[1100px] pb-8">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="explore-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, tech, author…"
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 bg-gray-50/80 text-[13px] text-[#1a1a1a] placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#E67A62]/20 focus:border-[#E67A62] transition-colors"
            />
          </div>

          {/* Tech filter pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 flex-1">
              <button
                onClick={() => setTechFilter('')}
                className={`h-8 px-3 rounded-full text-[12px] font-semibold transition-colors ${
                  techFilter === ''
                    ? 'bg-[#E67A62] text-white shadow-[0_2px_8px_rgba(230,122,98,0.3)]'
                    : 'bg-gray-100 text-zinc-500 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {allTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTechFilter(techFilter === tag ? '' : tag)}
                  className={`h-8 px-3 rounded-full text-[12px] font-semibold transition-colors ${
                    techFilter === tag
                      ? 'bg-[#E67A62] text-white shadow-[0_2px_8px_rgba(230,122,98,0.3)]'
                      : 'bg-gray-100 text-zinc-500 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Count */}
          {!isLoading && (
            <span className="shrink-0 text-[12px] text-zinc-400 font-medium">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <section className="container mx-auto px-6 max-w-[1100px] pb-24">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-[3px] border-[#E67A62] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400">Loading projects…</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E67A62]/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E67A62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-[17px] font-extrabold text-[#1a1a1a] mb-1">No projects found</h3>
            <p className="text-sm text-zinc-500 max-w-[280px] mx-auto">
              {projects.length === 0
                ? 'No one has shared a project yet. Be the first!'
                : 'Try adjusting your search or filter.'}
            </p>
            {(search || techFilter) && (
              <button
                onClick={() => { setSearch(''); setTechFilter(''); }}
                className="mt-5 h-9 px-5 rounded-xl bg-[#E67A62] text-white text-[13px] font-semibold hover:bg-[#D66D57] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <ExploreCard
                key={project._id}
                project={project}
                onClick={() => setSelectedProject(project)}
                onUpvote={handleUpvote}
                currentUserId={user?._id}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Detail Modal ── */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpvote={handleUpvote}
        currentUserId={user?._id}
        currentUser={user}
      />
    </div>
  );
};

export default ExplorePage;
