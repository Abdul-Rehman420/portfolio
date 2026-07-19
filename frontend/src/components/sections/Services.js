'use client';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useApi';
import { IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct, IoArrowForward } from 'react-icons/io5';

const iconMap = { IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct };

const Services = () => {
  const { data: services = [] } = useServices();

  return (
    <section id="services" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-body"
        >
          What I <span className="text-[#22c55e]">Do</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted mb-16 max-w-2xl mx-auto"
        >
          Professional services I offer to help you build amazing digital products
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = iconMap[svc.icon] || IoCodeSlash;
            return (
              <motion.div
                key={svc._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 group cursor-default hover:border-[#22c55e]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center mb-5 group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/5 transition-all">
                  <Icon className="text-muted group-hover:text-[#22c55e] transition-colors" size={22} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-body">{svc.title}</h3>
                <p className="text-sm text-muted mb-5 leading-relaxed">{svc.description}</p>
                {svc.features?.length > 0 && (
                  <ul className="space-y-1.5 mb-5">
                    {svc.features.slice(0, 3).map(f => (
                      <li key={f} className="text-xs text-dim flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#22c55e]/60" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-dim group-hover:text-[#22c55e] transition-colors">
                  Learn more <IoArrowForward size={12} />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
