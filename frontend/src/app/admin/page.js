'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProjects, useSkills, useServices, useTestimonials, useExperiences } from '@/hooks/useApi';
import { IoCodeSlash, IoBarChart, IoServer, IoPeople, IoBriefcase, IoArrowForward } from 'react-icons/io5';

const statCards = [
  { label: 'Projects', href: '/admin/projects', icon: IoCodeSlash, hook: 'projects' },
  { label: 'Skills', href: '/admin/skills', icon: IoBarChart, hook: 'skills' },
  { label: 'Services', href: '/admin/services', icon: IoServer, hook: 'services' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: IoPeople, hook: 'testimonials' },
  { label: 'Experience', href: '/admin/experience', icon: IoBriefcase, hook: 'experience' },
];

export default function DashboardPage() {
  const hooks = {
    projects: useProjects(),
    skills: useSkills(),
    services: useServices(),
    testimonials: useTestimonials(),
    experience: useExperiences(),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const count = hooks[card.hook]?.data?.length || 0;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={card.href} className="glass p-6 rounded-2xl block hover:border-primary/30 transition-all group">
                <Icon className="text-primary mb-3" size={28} />
                <p className="text-3xl font-bold gradient-text">{count}</p>
                <p className="text-sm text-gray-400 mt-1">{card.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Add Project', href: '/admin/projects' },
            { label: 'Add Skill', href: '/admin/skills' },
            { label: 'Add Service', href: '/admin/services' },
            { label: 'Add Testimonial', href: '/admin/testimonials' },
            { label: 'Add Experience', href: '/admin/experience' },
            { label: 'Update Settings', href: '/admin/settings' },
          ].map(action => (
            <Link key={action.label} href={action.href}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm text-gray-400 hover:text-white">
              {action.label} <IoArrowForward />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
