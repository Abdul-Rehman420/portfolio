'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoGlobe, IoLogoGithub, IoDocumentText, IoArrowForward, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useProjects } from '@/hooks/useApi';
import Image from 'next/image';

const Projects = () => {
  const [selected, setSelected] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const { data: projects = [] } = useProjects();

  const allImages = selected ? [selected.image, ...(selected.images || [])].filter(Boolean) : [];

  const prevImage = useCallback(() => {
    setImgIndex(i => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const nextImage = useCallback(() => {
    setImgIndex(i => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, prevImage, nextImage]);

  const featured = projects.filter(p => p.featured).slice(0, 4);
  const displayProjects = featured.length >= 4 ? featured : projects.slice(0, 4);

  return (
    <section id="projects" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-body"
        >
          Featured <span className="text-[#22c55e]">Work</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted mb-16 max-w-2xl mx-auto"
        >
          A selection of recent projects I&apos;ve worked on
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {displayProjects.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] glass hover:border-[#22c55e]/20 transition-all"
              onClick={() => { setSelected(p); setImgIndex(0); }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-[var(--bg)]/30 to-transparent z-10" />
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={p.image.startsWith('http')}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#22c55e]/10 to-[#16a34a]/5">
                  <span className="text-5xl font-bold text-faint">{p.title.charAt(0)}</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#22c55e] font-medium">
                    {p.category || 'Project'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-body group-hover:text-[#22c55e] transition-colors">{p.title}</h3>
                <p className="text-xs text-muted mt-1 line-clamp-1">{p.description}</p>
              </div>

              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-8 h-8 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/30 flex items-center justify-center backdrop-blur-sm">
                  <IoArrowForward className="text-[#22c55e]" size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <span className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body transition-colors cursor-pointer">
            View all projects <IoArrowForward size={14} />
          </span>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-body/90 backdrop-blur-sm p-5 border-b border-theme flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-body">{selected.title}</h3>
                  {selected.category && (
                    <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full mt-1 inline-block">{selected.category}</span>
                  )}
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-5">
                {allImages.length > 0 && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 glass group/carousel">
                    <Image
                      src={allImages[imgIndex]}
                      alt={`${selected.title} ${imgIndex + 1}`}
                      fill
                      className="object-cover transition-opacity duration-300"
                      unoptimized={allImages[imgIndex].startsWith('http')}
                    />

                    {allImages.length > 1 && (
                      <>
                        <button onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/70 transition-all cursor-pointer">
                          <IoChevronBack size={20} />
                        </button>
                        <button onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-black/70 transition-all cursor-pointer">
                          <IoChevronForward size={20} />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {allImages.map((_, idx) => (
                            <button key={idx} onClick={() => setImgIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === imgIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'}`} />
                          ))}
                        </div>
                      </>
                    )}

                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                      {imgIndex + 1} / {allImages.length}
                    </div>
                  </div>
                )}

                <p className="text-muted text-sm leading-relaxed mb-6">
                  {selected.longDescription || selected.description}
                </p>

                {selected.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.technologies.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 border border-theme text-muted rounded-full text-xs">{t}</span>
                    ))}
                  </div>
                )}

                {selected.features?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-body">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selected.features.map(f => (
                        <li key={f} className="text-sm text-muted flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#22c55e]/60" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2 border-t border-theme">
                  {selected.liveDemo && (
                    <a href={selected.liveDemo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-[#000000] rounded-lg text-sm font-medium hover:bg-[#16a34a] transition-all">
                      <IoGlobe size={16} /> Live Demo
                    </a>
                  )}
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm text-body hover:text-body transition-all">
                      <IoLogoGithub size={16} /> GitHub
                    </a>
                  )}
                  {selected.caseStudy && (
                    <a href={selected.caseStudy} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm text-body hover:text-body transition-all">
                      <IoDocumentText size={16} /> Case Study
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
