import { useState } from "react";
import { motion } from "framer-motion";
import { IoPaperPlane, IoCheckmarkCircle } from "react-icons/io5";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { personalInfo } from "../data/personal";
import { useInView } from "../hooks";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section id="contact" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Get In Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Have a project in mind or just want to say hello? Let's connect
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                aria-label="Your Name"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                aria-label="Your Email"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              aria-label="Subject"
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              aria-label="Your Message"
              rows={5}
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={sent}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                sent ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {sent ? (
                <><IoCheckmarkCircle size={20} /> Message Sent!</>
              ) : (
                <><IoPaperPlane size={18} /> Send Message</>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl overflow-hidden h-48">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="font-medium">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <a href={`mailto:${personalInfo.email}`} className="text-sm text-primary hover:underline">{personalInfo.email}</a>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm">{personalInfo.phone}</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm">{personalInfo.location}</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Freelance</p>
                <p className="text-sm text-green-400">Available</p>
              </div>
            </div>

            <div className="flex gap-3">
              {[
                { icon: FaGithub, url: personalInfo.social.github, label: "GitHub" },
                { icon: FaLinkedin, url: personalInfo.social.linkedin, label: "LinkedIn" },
                { icon: FaWhatsapp, url: personalInfo.social.whatsapp, label: "WhatsApp" },
              ].map(({ icon: Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="p-3 glass rounded-xl text-gray-400 hover:text-primary transition-all"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
