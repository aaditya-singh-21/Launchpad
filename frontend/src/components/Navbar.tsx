import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="absolute top-0 left-0 w-full py-6 z-[100] bg-transparent">
      <div className="container mx-auto px-6 flex justify-between items-center max-w-[1280px]">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-[#1a1a1a]">
            Launchpad
          </Link>
          <div className="flex gap-6">
            <Link
              to="/explore"
              className="text-sm font-medium text-[#E67A62] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#E67A62] after:rounded-sm transition-colors duration-200"
            >
              Explore
            </Link>
            <Link
              to="/share"
              className="text-sm font-medium text-zinc-500 hover:text-[#E67A62] transition-colors duration-200"
            >
              Share Project
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-60">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-9 h-9 border-gray-300 bg-transparent text-[13px] text-[#1a1a1a] placeholder:text-zinc-500 focus-visible:ring-[#E67A62]/20 focus-visible:border-[#E67A62]"
            />
          </div>

          {user ? (
            /* Authenticated state */
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-[#E67A62] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E67A62] to-[#F59E7E] flex items-center justify-center text-white text-[11px] font-extrabold">
                  {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="h-8 px-3 rounded-lg border border-gray-200 text-[12px] font-semibold text-zinc-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Unauthenticated state */
            <>
              <Link to="/signin" className="text-sm font-medium text-zinc-500 hover:text-[#E67A62] transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className={cn(buttonVariants(), "bg-[#E67A62] hover:bg-[#D66D57] text-white font-semibold border-none")}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
