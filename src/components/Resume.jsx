import { motion } from "framer-motion";
import { IoDownload, IoPrint } from "react-icons/io5";
import { personalInfo } from "../data/personal";
import { useInView } from "../hooks";

const Resume = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="resume" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Resume
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Download my resume to learn more about my experience and skills
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl overflow-hidden mb-6">
            <div className="aspect-[8.5/11] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-0.5 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                    <span className="text-2xl font-bold gradient-text">AR</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{personalInfo.fullName}</h3>
                <p className="text-primary mb-4">{personalInfo.role}</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{personalInfo.email}</p>
                  <p>{personalInfo.phone}</p>
                  <p>{personalInfo.location}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400">Click download to view the full resume</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <motion.a
              href={personalInfo.resumeUrl}
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              <IoDownload /> Download Resume
            </motion.a>
            <motion.button
              onClick={() => window.print()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full font-medium hover:text-primary transition-all cursor-pointer"
            >
              <IoPrint /> Print
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
