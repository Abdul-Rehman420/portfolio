'use client';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useApi';
import { IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct } from 'react-icons/io5';

const iconMap = { IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct };

const Services = () => {
  const { data: services = [] } = useServices();

  return (
    <section id="services" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">Services</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Professional services I offer to help you build amazing digital products
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = iconMap[svc.icon] || IoCodeSlash;
            return (
              <motion.div key={svc._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 * i }} whileHover={{ y: -8 }} className="glass p-6 rounded-2xl group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{svc.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{svc.description}</p>
                {svc.features?.length > 0 && (
                  <ul className="space-y-2">
                    {svc.features.map(f => (
                      <li key={f} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />{f}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
