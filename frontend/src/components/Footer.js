'use client';
import { useSettings } from '@/hooks/useApi';
import { IoArrowUp } from 'react-icons/io5';

const Footer = () => {
  const { data: settings } = useSettings();
  const s = settings || {};

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const showBackToTop = s.footerShowBackToTop !== 'false';
  const showCopyright = s.footerShowCopyright !== 'false';

  return (
    <footer className="relative border-t border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {showCopyright && (
            <p className="text-xs text-faint">
              &copy; {new Date().getFullYear()} {s.siteName || 'Abdul Rehman'}. {s.footerCopyright || 'All rights reserved.'}
            </p>
          )}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-8 h-8 glass rounded-lg flex items-center justify-center text-dim hover:text-[#22c55e] hover:border-[#22c55e]/20 transition-all cursor-pointer"
            >
              <IoArrowUp size={14} />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
