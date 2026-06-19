'use client';
import { useSocialLinks, useSettings } from '@/hooks/useApi';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { IoArrowUp } from 'react-icons/io5';

const iconMap = { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope };

const Footer = () => {
  const { data: links = [] } = useSocialLinks();
  const { data: settings } = useSettings();
  const s = settings || {};

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">{s.siteName || 'Abdul Rehman'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Full Stack Web Developer specializing in modern web technologies.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Services', 'Testimonials', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-primary transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <div className="flex gap-3 mb-4">
              {links.map(link => {
                const Icon = iconMap[link.icon] || FaGithub;
                return <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}
                  className="text-gray-400 hover:text-primary transition-colors"><Icon size={18} /></a>;
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} {s.siteName || 'Abdul Rehman'}. All rights reserved.</p>
          <button onClick={scrollToTop} aria-label="Back to top"
            className="p-2 glass rounded-full text-primary hover:text-primary/80 transition-all cursor-pointer"><IoArrowUp size={16} /></button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
