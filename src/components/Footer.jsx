import { motion } from "framer-motion";
import { IoArrowUp } from "react-icons/io5";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { personalInfo, navLinks } from "../data/personal";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (path) => {
    const id = path.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Abdul Rehman</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Full Stack Web Developer specializing in modern web technologies. Building exceptional digital experiences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.slice(0, 8).map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.path.slice(1)); }}
                  className="text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <div className="flex gap-3 mb-4">
              {[
                { icon: FaGithub, url: personalInfo.social.github, label: "GitHub" },
                { icon: FaLinkedin, url: personalInfo.social.linkedin, label: "LinkedIn" },
                { icon: FaTwitter, url: personalInfo.social.twitter, label: "Twitter" },
                { icon: FaInstagram, url: personalInfo.social.instagram, label: "Instagram" },
                { icon: FaEnvelope, url: `mailto:${personalInfo.email}`, label: "Email" },
              ].map(({ icon: Icon, url, label }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-gray-400 hover:text-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                aria-label="Subscribe to newsletter"
                className="flex-1 px-3 py-2 glass rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-all cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            className="p-2 glass rounded-full text-primary hover:text-primary/80 transition-all cursor-pointer"
            aria-label="Back to top"
          >
            <IoArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
