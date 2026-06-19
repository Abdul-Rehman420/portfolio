'use client';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useApi';

const SkillBar = ({ name, level, index }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
    transition={{ delay: 0.05 * index }} className="group">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-primary">{level}%</span>
    </div>
    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.1 + 0.05 * index, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow" />
    </div>
  </motion.div>
);

const Skills = () => {
  const { data: skills = [] } = useSkills();
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Skills & Expertise
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Technologies and tools I use to bring ideas to life
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, ci) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 * ci }} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all group">
              <h3 className="text-lg font-semibold mb-4 gradient-text">{cat}</h3>
              <div className="space-y-4">
                {skills.filter(s => s.category === cat).map((skill, i) => (
                  <SkillBar key={skill._id} name={skill.name} level={skill.level} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
