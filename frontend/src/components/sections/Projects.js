'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose, IoGlobe, IoLogoGithub, IoDocumentText, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useProjects } from '@/hooks/useApi';
import Image from 'next/image';

// Image Slider Component with Next.js Image
const ImageSlider = ({ images, mainImage, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine main image with additional images
  const allImages = [];
  
  // Add main image first if it exists
  if (mainImage) {
    allImages.push(mainImage);
  }
  
  // Add additional images
  if (images && Array.isArray(images) && images.length > 0) {
    allImages.push(...images);
  }
  
  // If no images at all, use placeholder
  if (allImages.length === 0) {
    allImages.push('/placeholder.jpg');
  }
  
  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  // Get the current image
  const currentImage = allImages[currentIndex];
  const isPlaceholder = currentImage === '/placeholder.jpg';

  return (
    <div className="relative w-full aspect-video bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center relative"
        >
          {!isPlaceholder ? (
            <Image
              src={currentImage}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              unoptimized={currentImage.startsWith('http')}
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <span className="text-6xl font-bold gradient-text opacity-30">{title?.[0] || 'P'}</span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-dark-bg via-transparent to-transparent pointer-events-none" />

      {/* Navigation Arrows - only show if more than 1 image */}
      {allImages.length > 1 && !isPlaceholder && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/20 transition-all z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <IoChevronBack size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/20 transition-all z-10 cursor-pointer"
            aria-label="Next image"
          >
            <IoChevronForward size={24} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {allImages.length > 1 && !isPlaceholder && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {allImages.length > 1 && !isPlaceholder && (
        <div className="absolute top-3 left-3 px-2 py-1 glass rounded text-xs text-white/80 z-10">
          {currentIndex + 1} / {allImages.length}
        </div>
      )}
    </div>
  );
};

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
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text"
        >
          Featured Projects
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-8"
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filter === f ? 'bg-primary text-white' : 'glass text-gray-300 hover:text-primary'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="relative max-w-md mx-auto mb-10"
        >
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setSelected(p)}
              >
                {/* Image Slider in Project Card - Full width with aspect ratio */}
                <ImageSlider 
                  mainImage={p.image}
                  images={p.images || []} 
                  title={p.title}
                />

                <div className="p-5">
                  <h3 className="font-semibold mb-1 text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.technologies?.slice(0, 4).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{t}</span>
                    ))}
                    {p.technologies?.length > 4 && (
                      <span className="px-2 py-0.5 text-gray-400 rounded text-xs">+{p.technologies.length - 4}</span>
                    )}
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

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No projects found.</p>
        )}
      </div>

      {/* Modal with full slider - Larger display */}
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
              className="glass rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur-sm p-4 border-b border-white/10 flex justify-between items-start">
                <h3 className="text-2xl font-bold gradient-text">{selected.title}</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <IoClose size={28} />
                </button>
              </div>

              {/* Modal Image Slider - Larger */}
              <div className="p-4">
                <div className="relative rounded-xl overflow-hidden bg-dark-card">
                  <div className="w-full aspect-video">
                    <ImageSlider 
                      mainImage={selected.image}
                      images={selected.images || []} 
                      title={selected.title}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-gray-300 text-base">{selected.longDescription || selected.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {selected.technologies?.map(t => (
                      <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{t}</span>
                    ))}
                  </div>

                  {selected.features?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selected.features.map(f => (
                          <li key={f} className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {selected.liveDemo && (
                      <motion.a
                        href={selected.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm"
                      >
                        <IoGlobe /> Live Demo
                      </motion.a>
                    )}
                    {selected.github && (
                      <motion.a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm"
                      >
                        <IoLogoGithub /> GitHub
                      </motion.a>
                    )}
                    {selected.caseStudy && (
                      <motion.a
                        href={selected.caseStudy}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm"
                      >
                        <IoDocumentText /> Case Study
                      </motion.a>
                    )}
                  </div>
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