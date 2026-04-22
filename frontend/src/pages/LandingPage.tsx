import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonVariants } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { fetchPublic, fetchWithAuth } from '../lib/api';
import { type Project, getInitials, ownerColor } from './ExplorePage';

// ── Code Preview Widget ───────────────────────────────────────────────────────
const CodePreview = () => (
  <div className="relative w-full max-w-[520px]">
    {/* Glow */}
    <div className="absolute -inset-6 bg-gradient-to-br from-[#E67A62]/15 to-violet-400/10 rounded-3xl blur-3xl pointer-events-none" />
    {/* Window */}
    <div className="relative bg-[#1a1b26] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#16172a] border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-zinc-500 font-mono tracking-wide">launchpad / app.tsx</span>
      </div>
      {/* Line numbers + code */}
      <div className="flex">
        <div className="select-none px-3 py-5 text-right font-mono text-[12px] leading-7 text-zinc-600 border-r border-white/5">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="px-4 py-5 font-mono text-[13px] leading-7 overflow-x-auto">
          <div><span className="text-[#bb9af7]">import</span> <span className="text-[#7dcfff]">{'{ Launchpad }'}</span> <span className="text-[#bb9af7]">from</span> <span className="text-[#9ece6a]">'@launchpad/core'</span></div>
          <div><span className="text-[#bb9af7]">import</span> <span className="text-[#7dcfff]">{'{ deploy }'}</span> <span className="text-[#bb9af7]">from</span> <span className="text-[#9ece6a]">'@launchpad/cli'</span></div>
          <div className="h-4" />
          <div><span className="text-[#bb9af7]">const</span> <span className="text-[#7dcfff]">project</span> <span className="text-gray-400">= {'{'}</span></div>
          <div className="pl-4"><span className="text-[#e0af68]">name</span><span className="text-gray-400">:</span> <span className="text-[#9ece6a]">"My Awesome App"</span><span className="text-gray-400">,</span></div>
          <div className="pl-4"><span className="text-[#e0af68]">stack</span><span className="text-gray-400">:</span> <span className="text-[#9ece6a]">["React", "TypeScript"]</span><span className="text-gray-400">,</span></div>
          <div className="pl-4"><span className="text-[#e0af68]">visibility</span><span className="text-gray-400">:</span> <span className="text-[#9ece6a]">"public"</span><span className="text-gray-400">,</span></div>
          <div className="pl-4"><span className="text-[#e0af68]">deploy</span><span className="text-gray-400">: </span><span className="text-[#bb9af7]">true</span><span className="text-gray-400">,</span></div>
          <div><span className="text-gray-400">{'}'}</span></div>
          <div className="h-4" />
          <div><span className="text-zinc-500">// 🚀 Launch with one command</span></div>
          <div><span className="text-[#7dcfff]">deploy</span><span className="text-gray-400">(project)</span></div>
          <div className="h-4" />
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-5 bg-[#E67A62] rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#E67A62] text-[11px] font-mono text-white/90">
        <span>✓ Ready to deploy</span>
        <span>TypeScript · UTF-8</span>
      </div>
    </div>
  </div>
);

// ── Trending Project Card ─────────────────────────────────────────────────────
const TrendingCard = ({ project, onClick, onUpvote, currentUserId }: { project: Project; onClick: () => void; onUpvote: (id: string, e: React.MouseEvent) => void; currentUserId?: string; }) => {
  const ownerName = project.owner?.name ?? 'Unknown';
  const color = ownerColor(project.owner?._id ?? '0');
  const initials = getInitials(ownerName);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 flex flex-col cursor-pointer hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#E67A62]/40"
    >
      <h3 className="text-[15px] font-extrabold text-[#1a1a1a] tracking-tight mb-2 group-hover:text-[#E67A62] transition-colors line-clamp-1">
        {project.title}
      </h3>
      <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 mb-4 flex-1">
        {project.description}
      </p>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-[#faf7f2] text-zinc-500 text-[11px] font-semibold rounded-full">
              {t}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-zinc-400 text-[11px] font-semibold rounded-full">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${color} flex items-center justify-center text-white text-[9px] font-extrabold`}>
            {initials}
          </div>
          <span className="text-[12px] text-zinc-400 font-medium truncate max-w-[100px]">{ownerName}</span>
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
          {project.livelink && (
            <span className="text-[11px] font-bold text-[#E67A62]">Live ↗</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Inline Detail Modal (reused from ExplorePage pattern) ─────────────────────
const MiniModal = ({ project, onClose, onUpvote, currentUserId }: { project: Project | null; onClose: () => void; onUpvote: (id: string, e?: React.MouseEvent) => void; currentUserId?: string; }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!project) return null;

  const ownerName = project.owner?.name ?? 'Unknown';
  const ownerInitials = getInitials(ownerName);
  const color = ownerColor(project.owner?._id ?? '0');
  const date = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[560px] bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-gray-100 z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E67A62] to-[#F59E7E]" />
        <div className="overflow-y-auto flex-1 p-8">
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight mb-2 pr-10">{project.title}</h2>
          <div className="flex items-center gap-2.5 mb-5">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-[10px] font-extrabold shrink-0`}>{ownerInitials}</div>
            <span className="text-[13px] font-semibold text-zinc-500">{ownerName}</span>
            {date && <><span className="text-zinc-300">·</span><span className="text-[12px] text-zinc-400">{date}</span></>}
          </div>
          <div className="bg-[#faf7f2] rounded-2xl p-5 mb-5">
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
          {project.techStack.length > 0 && (
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2.5">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t} className="px-3 py-1 bg-[#E67A62]/10 text-[#E67A62] text-[12px] font-bold rounded-full border border-[#E67A62]/20">{t}</span>
                ))}
              </div>
            </div>
          )}
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
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 text-[13px] font-semibold text-zinc-600 hover:text-[#1a1a1a] hover:border-gray-400 transition-all">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                    View on GitHub
                  </a>
                )}
                {project.livelink && (
                  <a href={project.livelink} target="_blank" rel="noreferrer" className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#E67A62] hover:bg-[#D66D57] text-white text-[13px] font-bold transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(230,122,98,0.3)]">
                    Live Demo ↗
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Landing Page ─────────────────────────────────────────────────────────
const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trendingProjects, setTrendingProjects] = useState<Project[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchPublic('/project');
        if (res.ok) {
          const data = await res.json();
          // Show the 4 most recent projects
          setTrendingProjects((data.response ?? []).slice(0, 4));
        }
      } catch {
        // silently fail — not critical
      } finally {
        setIsTrendingLoading(false);
      }
    };
    load();
  }, []);

  const handleShareProject = () => {
    navigate(user ? '/profile' : '/signup');
  };

  const handleUpvote = async (projectId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user) {
      navigate('/signin');
      return;
    }

    setTrendingProjects(prev => prev.map(p => {
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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 items-center gap-16 pt-32 pb-24">
          {/* Left: Text */}
          <div className="max-w-[560px] mx-auto lg:mx-0 text-center lg:text-left">
            <Badge
              variant="secondary"
              className="bg-[#f0ede8] text-zinc-500 text-[10px] font-bold tracking-[1.5px] uppercase py-1 px-4 rounded-full mb-8 hover:bg-[#f0ede8] border-none"
            >
              EVOLUTIONARY DEVELOPMENT
            </Badge>
            <h1 className="text-[52px] sm:text-[62px] leading-[1.08] font-extrabold text-[#1a1a1a] mb-6 tracking-[-2.5px]">
              Launch Your Ideas.<br />
              <span className="text-[#E67A62]">Discover the Future.</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-10 max-w-[480px]">
              A modern platform for developers to showcase and explore cutting-edge projects.
              Build your portfolio, find inspiration, and connect with the next generation of creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/explore"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-[#E67A62] hover:bg-[#D66D57] text-white px-8 py-6 text-base rounded-xl font-semibold border-none shadow-[0_4px_20px_rgba(230,122,98,0.35)] hover:shadow-[0_6px_24px_rgba(230,122,98,0.45)] transition-all hover:-translate-y-[1px]'
                )}
              >
                Explore Projects →
              </Link>
              <button
                onClick={handleShareProject}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'secondary' }),
                  'bg-[#E2DFDB] hover:bg-[#D5D1CC] text-[#1a1a1a] px-8 py-6 text-base rounded-xl font-bold border-none transition-all hover:-translate-y-[1px]'
                )}
              >
                Share Your Project
              </button>
            </div>
          </div>

          {/* Right: Code preview */}
          <div className="hidden lg:flex justify-center items-center">
            <CodePreview />
          </div>
        </div>
      </section>

      {/* Trending Projects Section */}
      <section className="bg-[#faf7f2] py-20 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-[32px] font-extrabold text-[#1a1a1a] mb-2 tracking-tight">Trending Projects</h2>
              <p className="text-base text-zinc-500">Handpicked innovations from our global community.</p>
            </div>
            <Link
              to="/explore"
              className="text-[#E67A62] font-semibold text-sm flex items-center gap-1 hover:text-[#D66D57] transition-colors"
            >
              View all projects →
            </Link>
          </div>

          {/* Loading */}
          {isTrendingLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-[3px] border-[#E67A62] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isTrendingLoading && trendingProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#E67A62]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#E67A62]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm font-medium">Be the first to share a project!</p>
            </div>
          )}

          {/* Grid */}
          {!isTrendingLoading && trendingProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProjects.map((project) => (
                <TrendingCard
                  key={project._id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  onUpvote={handleUpvote}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-[1280px]">
          <div className="bg-[#E67A62] rounded-2xl py-16 px-6 sm:px-10 text-center text-white shadow-[0_20px_60px_rgba(230,122,98,0.25)]">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Ready to showcase your craft?</h2>
            <p className="text-lg max-w-[560px] mx-auto mb-10 opacity-90 leading-relaxed">
              Join a community of developers building the next generation of web and mobile applications.
            </p>
            <button
              onClick={handleShareProject}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white hover:bg-gray-100 text-[#E67A62] px-8 py-6 text-base rounded-xl font-bold border-none transition-all hover:-translate-y-[1px]'
              )}
            >
              {user ? 'Go to My Projects' : 'Create Your Project'}
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Project detail modal */}
      <MiniModal project={selectedProject} onClose={() => setSelectedProject(null)} onUpvote={handleUpvote} currentUserId={user?._id} />
    </div>
  );
};

export default LandingPage;