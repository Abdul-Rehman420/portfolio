'use client';
import { motion } from 'framer-motion';
import { IoLocation, IoBriefcase, IoLanguage, IoTime, IoGlobe } from 'react-icons/io5';
import { useSettings, useEducation } from '@/hooks/useApi';

const About = () => {
  const { data: settings } = useSettings();
  const { data: education } = useEducation();
  const s = settings || {};
  const edu = education?.[0] || {};

  const infoCards = [
    { icon: IoLocation, label: 'Location', value: s.location || 'Karachi, Pakistan' },
    { icon: IoBriefcase, label: 'Experience', value: 'Senior Level' },
    { icon: IoLanguage, label: 'Languages', value: 'English, Urdu' },
    { icon: IoTime, label: 'Availability', value: 'Available for Full-Time' },
    { icon: IoGlobe, label: 'Freelance', value: 'Available' },
  ];

  return (
    <section id="about" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
          About Me
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-gray-400 leading-relaxed mb-6">
              I am a passionate Full Stack Web Developer with 3+ years of experience building modern, scalable web applications. I specialize in the MERN stack and have a deep understanding of frontend and backend technologies.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              I specialize in building modern web applications using React.js, Node.js, Express.js, and MongoDB. I am passionate about writing clean, maintainable code and creating exceptional user experiences.
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
            <h3 className="text-lg font-semibold mb-4">Career Objective</h3>
            <p className="text-gray-400 leading-relaxed">
              To leverage my technical expertise in full-stack development to build innovative web solutions that drive business growth, while continuously learning and contributing to open-source communities.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-lg font-semibold mb-6">My Journey</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
              {[
                { year: '2018', title: 'Started University', desc: 'Began BS in Computer Science' },
                { year: '2020', title: 'First Freelance Project', desc: 'Built my first professional website' },
                { year: '2021', title: 'First Developer Job', desc: 'Started as Junior Developer' },
                { year: '2022', title: 'Full Stack Developer', desc: 'Leveled up to Full Stack role' },
                { year: '2023', title: 'Senior Frontend Developer', desc: 'Promoted to Senior role' },
                { year: '2024', title: 'Tech Lead & Speaker', desc: 'Leading projects and speaking at conferences' },
              ].map((item, i) => (
                <motion.div key={item.year} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }} className="relative pl-12 pb-8 last:pb-0">
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-dark-bg" />
                  <span className="text-xs text-primary font-semibold">{item.year}</span>
                  <h4 className="font-medium mt-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {edu._id && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="glass p-6 rounded-xl">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-primary">{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-1">{edu.duration}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>
                  {edu.description && <p className="text-sm text-gray-400 mt-2">{edu.description}</p>}
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
