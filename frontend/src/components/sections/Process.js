'use client';
import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useApi';
import { IoSearch, IoCodeSlash, IoRocket } from 'react-icons/io5';

const steps = [
  {
    number: '01',
    title: 'Research & Strategy',
    description: 'Understanding your goals, target audience, and project requirements to create a strategic roadmap.',
    icon: IoSearch,
    code: `// Discovery Phase
async function discover() {
  const goals = await analyze(client.needs);
  const research = await marketAnalysis();
  return { goals, research };
}`,
  },
  {
    number: '02',
    title: 'Design & Prototype',
    description: 'Creating wireframes, interactive prototypes, and visual designs that bring ideas to life.',
    icon: IoCodeSlash,
    code: `// Design Phase
function design(user, brand) {
  const wireframe = sketch(user.flow);
  const prototype = buildInteractive(wireframe);
  return brand.apply(prototype);
}`,
  },
  {
    number: '03',
    title: 'Test & Refine',
    description: 'Rigorous testing, user feedback integration, and continuous refinement for perfection.',
    icon: IoRocket,
    code: `// Launch Phase
async function launch(app) {
  await test(app);
  const feedback = await collectUserFeedback(app);
  return deploy(refine(app, feedback));
}`,
  },
];

const Process = () => {
  const { data: settings } = useSettings();
  const s = settings || {};
  const title = s.processTitle || 'How I Work';

  return (
    <section id="process" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-body"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted mb-16 max-w-2xl mx-auto"
        >
          A streamlined approach to delivering exceptional digital products
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i }}
                className="group"
              >
                <div className="glass rounded-2xl p-6 hover:border-[#22c55e]/20 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center group-hover:bg-[#22c55e]/20 transition-all">
                      <Icon className="text-[#22c55e]" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-faint">{step.number}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-body">{step.title}</h3>
                  <p className="text-sm text-muted mb-4 flex-grow">{step.description}</p>

                  <div className="bg-code rounded-xl p-3 font-mono text-[10px]/relaxed text-code overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-500/50" />
                      <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <span className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <pre className="whitespace-pre-wrap">{step.code}</pre>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
