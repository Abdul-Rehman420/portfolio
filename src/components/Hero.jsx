import { motion } from "framer-motion";
import { IoDownload, IoEye } from "react-icons/io5";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { personalInfo } from "../data/personal";
import { useTypewriter } from "../hooks";
import ParticleBackground from "./ParticleBackground";

const roles = [
  "MERN Stack Developer",
  "Frontend Developer",
  "React Developer",
  "JavaScript Developer",
  "UI Developer",
];

const Hero = () => {
  const typedText = useTypewriter(roles);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 mb-2"
            >
              {personalInfo.greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
            >
              <span className="gradient-text">{personalInfo.fullName}</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-300 mb-6 h-8"
            >
              <span>{typedText}</span>
              <span className="animate-pulse">|</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              {personalInfo.shortBio}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.a
                href={personalInfo.resumeUrl}
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
              >
                <IoDownload /> Download Resume
              </motion.a>
              <motion.a
                href="#projects"
                onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary/50 text-primary rounded-full font-medium hover:bg-primary/10 transition-all"
              >
                <IoEye /> View Projects
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              {[
                { icon: FaGithub, url: personalInfo.social.github, label: "GitHub" },
                { icon: FaLinkedin, url: personalInfo.social.linkedin, label: "LinkedIn" },
                { icon: FaEnvelope, url: `mailto:${personalInfo.email}`, label: "Email" },
                { icon: FaTwitter, url: personalInfo.social.twitter, label: "Twitter" },
                { icon: FaInstagram, url: personalInfo.social.instagram, label: "Instagram" },
              ].map(({ icon: Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, y: -3 }}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full animate-spin-slow opacity-30 blur-2xl" />
              <div className="absolute inset-4 bg-gradient-to-br from-primary via-secondary to-accent rounded-full animate-spin-slow opacity-40" style={{ animationDirection: "reverse" }} />
              <div className="absolute inset-8 glass rounded-full flex items-center justify-center overflow-hidden">
                <div className="text-7xl sm:text-8xl lg:text-9xl font-bold gradient-text">
                  AR
                </div>
              </div>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-primary/40 rounded-full"
                  style={{
                    top: `${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
