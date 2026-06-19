import { motion } from "framer-motion";
import { skillsCategories } from "../data/skills";
import { useInView } from "../hooks";

const SkillBar = ({ name, level, index, isInView }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ delay: 0.1 * index }}
    className="group"
  >
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-primary">{level}%</span>
    </div>
    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${level}%` } : {}}
        transition={{ duration: 1, delay: 0.2 + 0.1 * index, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow"
      />
    </div>
  </motion.div>
);

const Skills = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="skills" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Skills & Expertise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Technologies and tools I use to bring ideas to life
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * catIndex }}
              className="glass p-6 rounded-2xl hover:border-primary/30 transition-all group"
            >
              <h3 className="text-lg font-semibold mb-4 gradient-text">{category.category}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <SkillBar key={skill.name} {...skill} index={index} isInView={isInView} />
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
