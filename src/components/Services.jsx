import { motion } from "framer-motion";
import { services } from "../data/services";
import { useInView } from "../hooks";
import { IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct } from "react-icons/io5";

const iconMap = {
  IoCodeSlash, IoServer, IoLogoReact, IoRocket, IoGitNetwork, IoFlash, IoConstruct,
};

const Services = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="services" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Professional services I offer to help you build amazing digital products
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="glass p-6 rounded-2xl group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  {Icon && <Icon className="text-primary" size={24} />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feat) => (
                    <li key={feat} className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
