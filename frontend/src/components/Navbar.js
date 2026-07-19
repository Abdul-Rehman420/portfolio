'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoArrowForward, IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/hooks/useApi';

const navLinkDefs = [
  { name: 'Home', href: '#home', key: 'showHero' },
  { name: 'About', href: '#about', key: 'showAbout' },
  { name: 'Skills', href: '#skills', key: 'showSkills' },
  { name: 'Projects', href: '#projects', key: 'showProjects' },
  { name: 'Experience', href: '#experience', key: 'showExperience' },
  { name: 'Services', href: '#services', key: 'showServices' },
  { name: 'Testimonials', href: '#testimonials', key: 'showTestimonials' },
  { name: 'Contact', href: '#contact', key: 'showContact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: settings } = useSettings();
  const s = settings || {};
  const navLinks = navLinkDefs.filter(l => s[l.key] !== 'false');

  useEffect(() => {
    const handleScroll = () => {
      // Mobile menu closes on scroll
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  const handleClick = (href) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const initials = (s.siteName || 'Abdul Rehman')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 my-4 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative max-w-7xl mx-auto ring-1 ring-nav-ring nav-glass rounded-2xl px-6 shadow-lg backdrop-blur-lg"
      >
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleClick('home'); }}
            className="group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="group-hover:bg-nav-border transition-colors bg-nav-bg border border-nav-border rounded-xl px-3 py-2 backdrop-blur-md">
                <span className="block text-lg font-semibold tracking-tight">{initials}</span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a
                key={l.name}
                href={l.href}
                onClick={(e) => { e.preventDefault(); handleClick(l.href.slice(1)); }}
                className="text-sm font-medium nav-text transition-colors duration-200"
              >
                {l.name}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl bg-nav-bg border border-nav-border p-2.5 nav-text hover:bg-nav-border backdrop-blur-md transition-all cursor-pointer"
            >
              {theme === 'dark' ? <IoSunny size={16} /> : <IoMoon size={16} />}
            </button>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleClick('contact'); }}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/90 text-black px-5 py-2.5 text-sm font-semibold hover:bg-white transition-all duration-200 hover:scale-105 backdrop-blur-md shadow-lg cursor-pointer"
            >
              Let&apos;s connect
              <IoArrowForward size={16} />
            </a>

            <button
              id="menuBtn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden rounded-xl bg-nav-bg border border-nav-border p-2.5 nav-text hover:bg-nav-border backdrop-blur-md transition-all cursor-pointer"
            >
              {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobileNav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-nav-border"
            >
              <div className="px-2 py-4 space-y-2">
                {navLinks.map(l => (
                  <a
                    key={l.name}
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); handleClick(l.href.slice(1)); }}
                    className="block rounded-xl px-4 py-3 text-base font-medium nav-text hover:bg-hover transition-colors"
                  >
                    {l.name}
                  </a>
                ))}
                <div className="pt-2 border-t border-nav-border">
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleClick('contact'); }}
                    className="flex items-center justify-center gap-2 rounded-full bg-white/90 text-black px-6 py-3 text-base font-semibold shadow-lg backdrop-blur-md"
                  >
                    Let&apos;s connect
                    <IoArrowForward size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};

export default Navbar;
