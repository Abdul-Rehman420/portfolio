'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import TrustedBy from '@/components/sections/TrustedBy';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Process from '@/components/sections/Process';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import ParticleBackground from '@/components/ParticleBackground';

import StatusBadge from '@/components/StatusBadge';
import { useSettings } from '@/hooks/useApi';

const sectionOrder = ['showHero', 'showTrustedBy', 'showAbout', 'showSkills', 'showProjects', 'showProcess', 'showExperience', 'showServices', 'showTestimonials', 'showContact'];

const sectionsMap = {
  showHero: Hero,
  showTrustedBy: TrustedBy,
  showAbout: About,
  showSkills: Skills,
  showProjects: Projects,
  showProcess: Process,
  showExperience: Experience,
  showServices: Services,
  showTestimonials: Testimonials,
  showContact: Contact,
};

const particleSections = ['showHero', 'showTrustedBy'];

export default function HomeClient() {
  const { data: settings } = useSettings();
  const s = settings || {};

  const showSection = (key) => s[key] !== 'false';

  return (
    <>
      <ParticleBackground className="fixed inset-0 -z-10" />
      <div className="scanlines" />
      <div className="vignette" />
      <StatusBadge />
      <Navbar />
      <main>
        {sectionOrder.map(key => {
          if (!showSection(key)) return null;
          const Section = sectionsMap[key];
          if (!Section) return null;
          const showBg = particleSections.includes(key);
          return (
            <div key={key} className={showBg ? 'relative' : 'bg-body relative'}>
              <Section />
              {key === 'showTrustedBy' && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--bg)] pointer-events-none z-10" />
              )}
            </div>
          );
        })}
      </main>
      <div className="bg-body"><Footer /></div>
    </>
  );
}
