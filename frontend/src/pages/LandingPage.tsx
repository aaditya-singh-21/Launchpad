import { Link } from 'react-router-dom';
import { buttonVariants } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import Footer from '../components/Footer';

// TODO: Replace with real projects fetched from the backend
const projects: never[] = [];

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
        {/* Line numbers */}
        <div className="select-none px-3 py-5 text-right font-mono text-[12px] leading-7 text-zinc-600 border-r border-white/5">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code content */}
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

const LandingPage = () => {
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
              <Link
                to="/signup"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'secondary' }),
                  'bg-[#E2DFDB] hover:bg-[#D5D1CC] text-[#1a1a1a] px-8 py-6 text-base rounded-xl font-bold border-none transition-all hover:-translate-y-[1px]'
                )}
              >
                Share Your Project
              </Link>
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

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#E67A62]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#E67A62]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm font-medium">Projects will appear here once loaded from the backend.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ProjectCard components rendered here */}
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
              Join a community of 50k+ developers building the next generation of web and mobile applications.
            </p>
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white hover:bg-gray-100 text-[#E67A62] px-8 py-6 text-base rounded-xl font-bold border-none transition-all hover:-translate-y-[1px]'
              )}
            >
              Create Your Project
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;