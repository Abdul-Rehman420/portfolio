import { motion } from "framer-motion";
import { IoLocation, IoBriefcase, IoLanguage, IoTime, IoGlobe } from "react-icons/io5";
import { personalInfo, journeyTimeline, education } from "../data/personal";
import { useInView } from "../hooks";

const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const infoCards = [
    { icon: IoLocation, label: "Location", value: personalInfo.location },
    { icon: IoBriefcase, label: "Experience", value: personalInfo.experienceLevel },
    { icon: IoLanguage, label: "Languages", value: personalInfo.languages.join(", ") },
    { icon: IoTime, label: "Availability", value: personalInfo.availability },
    { icon: IoGlobe, label: "Freelance", value: personalInfo.freelanceAvailable ? "Available" : "Not Available" },
  ];

  return (
    <section id="about" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-title gradient-text"
        >
          About Me
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-400 leading-relaxed mb-6">{personalInfo.longBio}</p>
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6">My Journey</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
              {journeyTimeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative pl-12 pb-8 last:pb-0"
                >
                  <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-dark-bg" />
                  <span className="text-xs text-primary font-semibold">{item.year}</span>
                  <h4 className="font-medium mt-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              {education.map((edu) => (
                <div key={edu.degree} className="glass p-6 rounded-xl">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-primary">{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-1">{edu.duration} | CGPA: {edu.cgpa}</p>
                  <p className="text-sm text-gray-400 mt-2">{edu.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
