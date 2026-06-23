'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useExperiences, useCertifications } from '@/hooks/useApi';

const Experience = () => {
  const { data: experiences = [] } = useExperiences();
  const { data: certifications = [] } = useCertifications();

  return (
    <section id="experience" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
          Experience
        </motion.h2>

        <div className="relative mb-16">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2" />
          {experiences.map((exp, i) => (
            <motion.div key={exp._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block flex-1" />
              <div className="absolute left-4 md:left-1/2 top-0 w-3 h-3 rounded-full bg-primary border-2 border-dark-bg -translate-x-1/2 z-10" />
              <div className={`flex-1 ml-10 md:ml-0 ${i % 2 === 0 ? 'md:text-right md:mr-8' : 'md:ml-8'}`}>
                <div className="glass p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{exp.duration}</span>
                  </div>
                  {exp.responsibilities?.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {exp.responsibilities.slice(0, 3).map(r => (
                        <li key={r} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies?.map(t => <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {certifications.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-semibold mb-6 gradient-text text-center">Certifications</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {certifications.map(cert => (
                <div key={cert._id} className="glass p-4 rounded-xl">
                  {cert.image && <Image src={cert.image} alt={cert.title} width={400} height={200} className="w-full h-auto object-contain rounded-lg mb-3" unoptimized={cert.image.startsWith('http')} />}
                  <h4 className="font-medium text-sm">{cert.title}</h4>
                  <p className="text-xs text-gray-400">{cert.issuer} • {cert.date}</p>
                  {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">Verify</a>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;
