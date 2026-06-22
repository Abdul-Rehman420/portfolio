// frontend/src/app/HomeClient.js
'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import { useSettings } from '@/hooks/useApi';

export default function HomeClient() {
  const { data: settings } = useSettings();
  const s = settings || {};

  // Helper function to check if a section should be shown
  const showSection = (key) => {
    return s[key] !== 'false';
  };

  return (
    <>
      <Navbar />
      <main>
        {showSection('showHero') && <Hero />}
        {showSection('showAbout') && <About />}
        {showSection('showSkills') && <Skills />}
        {showSection('showProjects') && <Projects />}
        {showSection('showExperience') && <Experience />}
        {showSection('showServices') && <Services />}
        {showSection('showTestimonials') && <Testimonials />}
        {showSection('showContact') && <Contact />}
      </main>
      <Footer />
    </>
  );
}