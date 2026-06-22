// frontend/src/components/sections/About.js
'use client';
import { motion } from 'framer-motion';
import { IoLocation, IoBriefcase, IoLanguage, IoTime, IoGlobe } from 'react-icons/io5';
import { useSettings, useEducation } from '@/hooks/useApi';

const About = () => {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: education = [], isLoading: educationLoading } = useEducation();
  const s = settings || {};

  // Parse journey items from settings with fallback
  let journeyItems = [];
  try {
    if (s.journeyItems) {
      journeyItems = typeof s.journeyItems === 'string' 
        ? JSON.parse(s.journeyItems) 
        : s.journeyItems;
    }
  } catch (e) {
    console.error('Error parsing journey items:', e);
    journeyItems = [];
  }

  // Fallback journey items if none are set
  if (journeyItems.length === 0) {
    journeyItems = [
      { year: '2018', title: 'Started University', description: 'Began BS in Computer Science' },
      { year: '2020', title: 'First Freelance Project', description: 'Built my first professional website' },
      { year: '2021', title: 'First Developer Job', description: 'Started as Junior Developer' },
      { year: '2022', title: 'Full Stack Developer', description: 'Leveled up to Full Stack role' },
      { year: '2023', title: 'Senior Frontend Developer', description: 'Promoted to Senior role' },
      { year: '2024', title: 'Tech Lead & Speaker', description: 'Leading projects and speaking at conferences' }
    ];
  }

  const infoCards = [
    { icon: IoLocation, label: 'Location', value: s.aboutLocation || s.location || 'Karachi, Pakistan' },
    { icon: IoBriefcase, label: 'Experience', value: s.aboutExperience || 'Senior Level' },
    { icon: IoLanguage, label: 'Languages', value: s.aboutLanguages || 'English, Urdu' },
    { icon: IoTime, label: 'Availability', value: s.aboutAvailability || 'Available for Full-Time' },
    { icon: IoGlobe, label: 'Freelance', value: s.aboutFreelance || 'Available' },
  ];

  if (settingsLoading || educationLoading) {
    return (
      <section id="about" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
        >
          {s.aboutTitle || 'About Me'}
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <p className="text-gray-400 leading-relaxed mb-6">
              {s.aboutDescription || 'I am a passionate Full Stack Web Developer with 3+ years of experience building modern, scalable web applications. I specialize in the MERN stack and have a deep understanding of frontend and backend technologies.'}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              {s.aboutDescription2 || 'I specialize in building modern web applications using React.js, Node.js, Express.js, and MongoDB. I am passionate about writing clean, maintainable code and creating exceptional user experiences.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {infoCards.map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass p-4 rounded-xl">
                  <Icon className="text-primary mb-2" size={20} />
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
            
            {s.careerObjective && (
              <>
                <h3 className="text-lg font-semibold mb-4">Career Objective</h3>
                <p className="text-gray-400 leading-relaxed">
                  {s.careerObjective}
                </p>
              </>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">My Journey</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-primary via-secondary to-accent" />
              {journeyItems.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }} 
                  className="relative pl-12 pb-8 last:pb-0"
                >
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-dark-bg" />
                  <span className="text-xs text-primary font-semibold">{item.year}</span>
                  <h4 className="font-medium mt-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Education Section - Shows ALL education entries */}
            {education.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <motion.div 
                      key={edu._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="glass p-6 rounded-xl"
                    >
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-primary">{edu.institution}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {edu.duration}
                        {edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}
                      </p>
                      {edu.description && (
                        <p className="text-sm text-gray-400 mt-2">{edu.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;