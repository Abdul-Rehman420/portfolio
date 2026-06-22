// frontend/src/components/Footer.js
'use client';
import { useSocialLinks, useSettings } from '@/hooks/useApi';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaWhatsapp, FaYoutube, FaFacebook, FaDiscord, FaTelegram } from 'react-icons/fa';
import { IoArrowUp } from 'react-icons/io5';

const iconMap = { 
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, 
  FaWhatsapp, FaYoutube, FaFacebook, FaDiscord, FaTelegram 
};

const Footer = () => {
  const { data: links = [] } = useSocialLinks();
  const { data: settings } = useSettings();
  const s = settings || {};

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Parse footer quick links from settings
  let quickLinks = [];
  try {
    if (s.footerQuickLinks) {
      quickLinks = typeof s.footerQuickLinks === 'string' 
        ? JSON.parse(s.footerQuickLinks) 
        : s.footerQuickLinks;
    }
  } catch (e) {
    console.error('Error parsing footer quick links:', e);
    quickLinks = [];
  }

  // Parse footer social links from settings or fallback to social links from API
  let footerSocialLinks = [];
  try {
    if (s.footerSocialLinks) {
      footerSocialLinks = typeof s.footerSocialLinks === 'string' 
        ? JSON.parse(s.footerSocialLinks) 
        : s.footerSocialLinks;
    }
  } catch (e) {
    console.error('Error parsing footer social links:', e);
    footerSocialLinks = [];
  }

  // Use social links from API if no footer social links are set
  const socialLinksToShow = footerSocialLinks.length > 0 ? footerSocialLinks : links;

  // Default quick links if none are set
  if (quickLinks.length === 0) {
    quickLinks = [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Skills', href: '#skills' },
      { label: 'Projects', href: '#projects' },
      { label: 'Experience', href: '#experience' },
      { label: 'Services', href: '#services' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#contact' }
    ];
  }

  const showSocialLinks = s.footerShowSocialLinks !== 'false';
  const showQuickLinks = s.footerShowQuickLinks !== 'false';
  const showTagline = s.footerShowTagline !== 'false';
  const showCopyright = s.footerShowCopyright !== 'false';
  const showBackToTop = s.footerShowBackToTop !== 'false';

  return (
    <footer className="relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid ${showTagline && showQuickLinks ? 'md:grid-cols-3' : showTagline || showQuickLinks ? 'md:grid-cols-2' : ''} gap-8 mb-8`}>
          {/* Left Column - Brand */}
          {showTagline && (
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">{s.siteName || 'Abdul Rehman'}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {s.footerTagline || 'Full Stack Web Developer specializing in modern web technologies.'}
              </p>
            </div>
          )}

          {/* Middle Column - Quick Links */}
          {showQuickLinks && (
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Right Column - Social Links */}
          {showSocialLinks && (
            <div>
              <h4 className="font-semibold mb-4">Stay Connected</h4>
              <div className="flex gap-3 mb-4 flex-wrap">
                {socialLinksToShow.map((link, index) => {
                  const Icon = iconMap[link.icon] || FaGithub;
                  return (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={link.platform}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row - Copyright and Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          {showCopyright && (
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} {s.siteName || 'Abdul Rehman'}. {s.footerCopyright || 'All rights reserved.'}
            </p>
          )}
          {showBackToTop && (
            <button 
              onClick={scrollToTop} 
              aria-label="Back to top"
              className="p-2 glass rounded-full text-primary hover:text-primary/80 transition-all cursor-pointer"
            >
              <IoArrowUp size={16} />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;