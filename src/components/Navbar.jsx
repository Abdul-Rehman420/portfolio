import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { navLinks } from "../data/personal";
import { IoMoon, IoSunny, IoLanguage } from "react-icons/io5";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path) => {
    setMobileOpen(false);
    const id = path.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("home"); }}
            className="text-2xl font-bold gradient-text cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Abdul Rehman
          </motion.a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.path.slice(1)); }}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all cursor-pointer"
            >
              {theme === "dark" ? <IoSunny size={20} /> : <IoMoon size={20} />}
            </button>
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all cursor-pointer"
            >
              <IoLanguage size={20} />
            </button>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick("contact"); }}
              className="hidden sm:inline-flex px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              Hire Me
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-white/5 transition-all cursor-pointer"
            >
              {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.path.slice(1)); }}
                  className="block px-4 py-3 text-gray-300 hover:text-primary hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick("contact"); }}
                className="block px-4 py-3 bg-primary text-white rounded-lg text-center font-medium"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
