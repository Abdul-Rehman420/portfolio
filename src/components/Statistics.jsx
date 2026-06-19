import { motion } from "framer-motion";
import { statistics } from "../data/personal";
import { useInView } from "../hooks";
import { useEffect, useState } from "react";

const CountUp = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}{suffix}</>;
};

const Statistics = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Statistics
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Numbers that speak volumes about my work
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className="glass p-6 rounded-2xl text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {isInView ? <CountUp target={stat.value} suffix={stat.suffix} /> : "0"}
              </div>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
