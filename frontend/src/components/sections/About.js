'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoCheckmarkCircle, IoFolder, IoRibbon, IoTime } from 'react-icons/io5';
import { useSettings, useEducation } from '@/hooks/useApi';

const statCards = [
  { icon: IoCheckmarkCircle, label: 'Happy Clients', key: 'statClients', default: '30+' },
  { icon: IoFolder, label: 'Projects Done', key: 'heroProjectsDone', default: '20+' },
  { icon: IoRibbon, label: 'Awards Won', key: 'heroAwardsWon', default: '5+' },
  { icon: IoTime, label: 'Years Exp', key: 'heroYearsExp', default: '3+' },
];

const About = () => {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: education = [], isLoading: educationLoading } = useEducation();
  const s = settings || {};

  const profileImage = s.profileImage;
  const aboutImage2 = s.aboutImage2;

  if (settingsLoading || educationLoading) {
    return (
      <section id="about" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={s.siteName || 'Profile'}
                    fill
                    className="object-cover"
                    unoptimized={profileImage.startsWith('http')}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-faint">{s.siteName?.charAt(0) || 'A'}</span>
                  </div>
                )}
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass mt-8">
                {aboutImage2 ? (
                  <Image
                    src={aboutImage2}
                    alt="About"
                    fill
                    className="object-cover"
                    unoptimized={aboutImage2.startsWith('http')}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#22c55e]/5 to-[#16a34a]/5">
                    <span className="text-4xl font-bold text-faint">AR</span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#22c55e]/5 border border-[#22c55e]/10 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#16a34a]/5 border border-[#16a34a]/10 -z-10" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-body">
              About <span className="text-[#22c55e]">Me</span>
            </h2>

            <p className="text-muted leading-relaxed mb-4">
              {s.aboutDescription || 'I am a passionate Full Stack Web Developer with 3+ years of experience building modern, scalable web applications.'}
            </p>
            <p className="text-muted leading-relaxed mb-8">
              {s.aboutDescription2 || 'I specialize in building modern web applications using React.js, Node.js, Express.js, and MongoDB.'}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {statCards.map(({ icon: Icon, label, key, default: def }) => {
                const value = s[key] || def;
                return (
                  <div key={label} className="glass rounded-xl p-3 text-center">
                    <Icon className="text-[#22c55e] mx-auto mb-1.5" size={18} />
                    <p className="text-sm font-bold text-body">{value}</p>
                    <p className="text-[10px] text-dim uppercase tracking-wider">{label}</p>
                  </div>
                );
              })}
            </div>

            {s.careerObjective && (
              <p className="text-sm text-muted leading-relaxed italic border-l-2 border-[#22c55e]/30 pl-4">
                {s.careerObjective}
              </p>
            )}

            {education.length > 0 && (
              <div className="mt-8 pt-6 border-t border-theme">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Education</h3>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={edu._id || index} className="glass rounded-xl p-4 hover:border-primary/20 transition-all">
                      <h4 className="font-medium text-sm text-body">{edu.degree}</h4>
                      <p className="text-xs text-[#22c55e] mt-0.5">{edu.institution}</p>
                      <p className="text-[11px] text-dim mt-1">
                        {edu.duration}
                        {edu.cgpa ? ` | ${edu.cgpa}` : ''}
                      </p>
                    </div>
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
