'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronForward, IoStar } from 'react-icons/io5';
import Image from 'next/image';
import { useTestimonials } from '@/hooks/useApi';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const { data: testimonials = [] } = useTestimonials();

  const next = () => { setDir(1); setCurrent(p => (p + 1) % testimonials.length); };
  const prev = () => { setDir(-1); setCurrent(p => (p - 1 + testimonials.length) % testimonials.length); };

  if (testimonials.length === 0) return null;

  const t = testimonials[current];
  const variants = { enter: (d) => ({ x: d > 0 ? 200 : -200, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d) => ({ x: d > 0 ? -200 : 200, opacity: 0 }) };

  return (
    <section id="testimonials" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">Testimonials</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">What people say about working with me</motion.p>
        <div className="max-w-3xl mx-auto relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={current} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                className="glass p-8 md:p-10 rounded-2xl text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary via-secondary to-accent p-0.5 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                    {t.image ? <Image src={t.image} alt={t.name} width={80} height={80} className="w-full h-full rounded-full object-cover" unoptimized={t.image.startsWith('http')} /> : <span className="text-2xl font-bold gradient-text">{t.name?.[0]}</span>}
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-primary mb-1">{t.position}{t.company ? ` at ${t.company}` : ''}</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => <IoStar key={i} className="text-yellow-400" size={16} />)}
                </div>
                <p className="text-gray-400 leading-relaxed italic">&ldquo;{t.review}&rdquo;</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={prev} aria-label="Previous" className="p-2 glass rounded-full hover:text-primary transition-all cursor-pointer"><IoChevronBack size={20} /></button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === current ? 'bg-primary w-6' : 'bg-gray-600'}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Next" className="p-2 glass rounded-full hover:text-primary transition-all cursor-pointer"><IoChevronForward size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
