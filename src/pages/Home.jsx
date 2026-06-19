import { motion } from "framer-motion";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Blog from "../components/Blog";
import Statistics from "../components/Statistics";
import Resume from "../components/Resume";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Testimonials />
      <Blog />
      <Statistics />
      <Resume />
      <Contact />
    </motion.div>
  );
};

export default Home;
