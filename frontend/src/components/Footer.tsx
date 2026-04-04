import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 py-16 pb-20 bg-[#faf7f2] border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-[1280px] flex justify-between flex-wrap gap-12">
        <div className="max-w-[250px]">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-[#1a1a1a] mb-3 inline-block">
            Launchpad
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wide">
            &copy; 2026 Launchpad. Crafted for developers.
          </p>
        </div>
        
        <div className="min-w-[120px]">
          <p className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-6">
            Platform
          </p>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/about" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/web-apps" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                Web Apps
              </Link>
            </li>
            <li>
              <Link to="/mobile" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                Mobile
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="min-w-[120px]">
          <p className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-6">
            Resources
          </p>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/ai-tools" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                AI Tools
              </Link>
            </li>
            <li>
              <Link to="/open-source" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                Open Source
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="min-w-[120px]">
          <p className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-6">
            Legal
          </p>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/terms" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-[13px] text-zinc-500 font-medium uppercase tracking-wider hover:text-[#E67A62] transition-colors">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;