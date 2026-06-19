import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward, IoStar } from "react-icons/io5";
import { testimonials } from "../data/testimonials";
import { useInView } from "../hooks";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Testimonials
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          What people say about working with me
        </motion.p>

        <div className="max-w-3xl mx-auto relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="glass p-8 md:p-10 rounded-2xl text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-0.5 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                    <span className="text-2xl font-bold gradient-text">{t.name[0]}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-primary mb-1">{t.role} at {t.company}</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <IoStar key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-400 leading-relaxed italic">&ldquo;{t.review}&rdquo;</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button onClick={prev} aria-label="Previous testimonial" className="p-2 glass rounded-full hover:text-primary transition-all cursor-pointer">
              <IoChevronBack size={20} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === current ? "bg-primary w-6" : "bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next testimonial" className="p-2 glass rounded-full hover:text-primary transition-all cursor-pointer">
              <IoChevronForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
