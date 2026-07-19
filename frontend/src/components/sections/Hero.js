'use client';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useSettings } from '@/hooks/useApi';
import { IoArrowForward } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { modeNames, palettes } from '@/components/ParticleBackground';

const Hero = () => {
  const [mode, setMode] = useState(0);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const { theme } = useTheme();
  const { data: settings } = useSettings();

  useEffect(() => {
    if (theme === 'light') {
      handleSetPalette(4); // white mode
    } else {
      handleSetPalette(0); // green mode
    }
  }, [theme]);

  const s = settings || {};
  const profileImage = s.profileImage;
  const name = s.siteName || 'Abdul Rehman';

  const rolesString = s.typewriterRoles || 'Full Stack Developer';
  const roles = rolesString.split(',').map(r => r.trim()).filter(Boolean);
  const typedText = useTypewriter(roles, 60, 30, 1200);

  const yearsExp = s.heroYearsExp || '3+';
  const projectsDone = s.heroProjectsDone || '20+';
  const awardsWon = s.heroAwardsWon || '5+';

  const letters = useMemo(() => name.split(''), [name]);

  const handleSetMode = (idx) => {
    setMode(idx);
    if (window.__particleSetMode) window.__particleSetMode(idx);
  };

  const handleSetPalette = (idx) => {
    setPaletteIdx(idx);
    if (window.__particleSetPalette) window.__particleSetPalette(idx);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16 w-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-white/20">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover object-center"
                  unoptimized={profileImage.startsWith('http')}
                  priority
                  sizes="(max-width: 640px) 128px, 160px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <span className="text-5xl sm:text-6xl font-bold text-white/40">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-white">
              <span className="flex flex-wrap justify-center">
                {letters.map((letter, i) => (
                  <span
                    key={i}
                    className="animate-letter"
                    style={{ animationDelay: `${0.3 + i * 0.06}s`, opacity: 0 }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
            </h1>

            <div className="text-lg sm:text-xl text-gray-400 mb-4 h-7">
              <span>{typedText}</span>
              <span className="animate-pulse text-[#22c55e]">|</span>
            </div>

            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              {s.siteDescription || 'Crafting digital experiences that blend creativity with technology. Specializing in UI/UX, branding, and design systems.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-3 font-semibold hover:bg-white/90 transition-all text-sm"
            >
              View my work
              <IoArrowForward size={16} />
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-white px-8 py-3 text-sm font-medium hover:bg-white/20 transition-all"
            >
              About me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-6 sm:gap-10 text-sm text-gray-400"
          >
            <div className="text-center">
              <span className="text-lg font-bold text-white">{yearsExp}</span>
              <p className="text-xs mt-0.5">Years Experience</p>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="text-center">
              <span className="text-lg font-bold text-white">{projectsDone}</span>
              <p className="text-xs mt-0.5">Projects Completed</p>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <div className="text-center">
              <span className="text-lg font-bold text-white">{awardsWon}</span>
              <p className="text-xs mt-0.5">Awards Won</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-30 right-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="flex gap-1.5 justify-end">
          {palettes.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSetPalette(i)}
              className={`w-5 h-5 rounded-full transition-all duration-300 ring-1 ring-white/10 hover:scale-110 cursor-pointer ${
                paletteIdx === i ? 'scale-110 ring-2 ring-white/40' : ''
              }`}
              style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
              aria-label={`Color palette ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          {modeNames.map((name, i) => (
            <button
              key={name}
              onClick={() => handleSetMode(i)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all cursor-pointer ${
                mode === i
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
