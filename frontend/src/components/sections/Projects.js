'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose, IoGlobe, IoLogoGithub, IoDocumentText } from 'react-icons/io5';
import { useProjects } from '@/hooks/useApi';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const { data: projects = [] } = useProjects();

  const filters = ['all', 'React', 'Next.js', 'Node.js', 'Full Stack', 'Frontend'];

  const filtered = projects.filter(p => {
    const cat = filter === 'all' || p.category === filter || p.technologies?.includes(filter);
    const q = search.toLowerCase();
    const match = p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return cat && match;
  });

  return (
    <section id="projects" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Featured Projects
        </motion.h2>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${filter === f ? 'bg-primary text-white' : 'glass text-gray-300 hover:text-primary'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative max-w-md mx-auto mb-10">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div key={p._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }} className="glass rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setSelected(p)}>
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold gradient-text opacity-50">{p.title?.[0]}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Live' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.technologies?.slice(0, 4).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{t}</span>
                    ))}
                    {p.technologies?.length > 4 && <span className="px-2 py-0.5 text-gray-400 rounded text-xs">+{p.technologies.length - 4}</span>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{p.date}</span>
                    <span className="text-primary">{p.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && <p className="text-center text-gray-500 py-12">No projects found.</p>}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold gradient-text">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"><IoClose size={24} /></button>
              </div>
              <div className="h-48 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center mb-6">
                {selected.image ? <img src={selected.image} alt={selected.title} className="w-full h-full object-cover rounded-xl" /> : <span className="text-6xl font-bold gradient-text opacity-30">{selected.title?.[0]}</span>}
              </div>
              <p className="text-gray-400 mb-4">{selected.longDescription || selected.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selected.technologies?.map(t => <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{t}</span>)}
              </div>
              {selected.features?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selected.features.map(f => (
                      <li key={f} className="text-sm text-gray-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/60" />{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-3">
                {selected.liveDemo && (
                  <motion.a href={selected.liveDemo} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm"><IoGlobe /> Live Demo</motion.a>
                )}
                {selected.github && (
                  <motion.a href={selected.github} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm"><IoLogoGithub /> GitHub</motion.a>
                )}
                {selected.caseStudy && (
                  <motion.a href={selected.caseStudy} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm"><IoDocumentText /> Case Study</motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
