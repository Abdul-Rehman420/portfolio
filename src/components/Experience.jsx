import { motion } from "framer-motion";
import { experience, certifications, achievements } from "../data/personal";
import { useInView } from "../hooks";

const Experience = () => {
  const [ref, isInView] = useInView({ threshold: 0.05 });

  return (
    <section id="experience" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Experience
        </motion.h2>

        <div className="relative mb-16">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2" />
          {experience.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="hidden md:block flex-1" />
              <div className="absolute left-4 md:left-1/2 top-0 w-3 h-3 rounded-full bg-primary border-2 border-dark-bg -translate-x-1/2 z-10" />
              <div className={`flex-1 ml-10 md:ml-0 ${index % 2 === 0 ? "md:text-right md:mr-8" : "md:ml-8"}`}>
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{exp.location} | {exp.type}</p>
                  <ul className="space-y-1 mb-3">
                    {exp.responsibilities.slice(0, 3).map((r) => (
                      <li key={r} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6 gradient-text">Certifications</h3>
            <div className="space-y-4">
              {certifications.slice(0, 3).map((cert) => (
                <div key={cert.title} className="glass p-4 rounded-xl">
                  <h4 className="font-medium text-sm">{cert.title}</h4>
                  <p className="text-xs text-gray-400">{cert.issuer} • {cert.date}</p>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                    Verify Certificate
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6 gradient-text">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach.title} className="glass p-4 rounded-xl text-center">
                  <span className="text-3xl mb-2 block">{ach.icon}</span>
                  <h4 className="font-medium text-sm">{ach.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
