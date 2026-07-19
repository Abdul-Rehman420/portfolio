'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMail, IoCall, IoArrowForward, IoPaperPlane, IoCheckmarkCircle, IoLocation } from 'react-icons/io5';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaWhatsapp, FaYoutube, FaFacebook, FaDiscord, FaTelegram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSocialLinks, useSettings } from '@/hooks/useApi';
import { sendContactMessage } from '@/lib/api';

const iconMap = {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope,
  FaWhatsapp, FaYoutube, FaFacebook, FaDiscord, FaTelegram,
};

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { data: links = [] } = useSocialLinks();
  const { data: settings } = useSettings();
  const s = settings || {};

  let quickLinks = [];
  try {
    if (s.footerQuickLinks) {
      quickLinks = typeof s.footerQuickLinks === 'string' ? JSON.parse(s.footerQuickLinks) : s.footerQuickLinks;
    }
  } catch (e) {
    quickLinks = [];
  }

  if (quickLinks.length === 0) {
    quickLinks = [
      { label: 'Work', href: '#projects' },
      { label: 'About', href: '#about' },
      { label: 'Process', href: '#process' },
      { label: 'Contact', href: '#contact' },
    ];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSending(true);
    try {
      const result = await sendContactMessage(form);
      if (result.success) {
        setSent(true);
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <footer id="contact" className="relative py-20 border-t border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Let's Create + Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-body">
              Let&apos;s <br />
              <span className="text-[#22c55e]">Create</span>
            </h2>
            <p className="text-muted max-w-md mb-8 leading-relaxed">
              Have a project in mind? Let&apos;s work together to build something amazing.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#22c55e] text-[#000000] rounded-lg font-medium hover:bg-[#16a34a] transition-all text-sm"
                >
                  <IoMail size={16} />
                  {s.email}
                </a>
              )}
              {s.phone && (
                <a
                  href={`tel:${s.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 glass rounded-lg text-sm font-medium text-body hover:text-body bg-hover transition-all"
                >
                  <IoCall size={16} />
                  Schedule a Call
                  <IoArrowForward size={14} />
                </a>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm">
              {s.phone && (
                <div className="glass rounded-xl p-4">
                  <IoCall className="text-[#22c55e] mb-1.5" size={16} />
                  <p className="text-[10px] text-dim uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-body mt-0.5">{s.phone}</p>
                </div>
              )}
              {s.location && (
                <div className="glass rounded-xl p-4">
                  <IoLocation className="text-[#22c55e] mb-1.5" size={16} />
                  <p className="text-[10px] text-dim uppercase tracking-wider">Location</p>
                  <p className="text-sm text-body mt-0.5">{s.location}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {links.length > 0 && (
              <div className="flex gap-3 mb-8">
                {links.map(link => {
                  const Icon = iconMap[link.icon] || FaGithub;
                  return (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="w-10 h-10 rounded-xl glass flex items-center justify-center text-dim hover:text-[#22c55e] hover:border-[#22c55e]/20 transition-all"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Quick Links */}
            {quickLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-2 max-w-xs">
                  {quickLinks.map((link, i) => (
                    <a key={i} href={link.href} className="text-sm text-muted hover:text-[#22c55e] transition-colors">{link.label}</a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-theme">
              <p className="text-xs text-faint">Available for freelance and full-time opportunities</p>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-body"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-body"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-body"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 text-body resize-none"
              />
              <button
                type="submit"
                disabled={isSending || sent}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  sent ? 'bg-[#22c55e] text-[#000000]' :
                  isSending ? 'bg-[#22c55e]/70 text-[#000000] cursor-not-allowed' :
                  'bg-[#22c55e] text-[#000000] hover:bg-[#16a34a]'
                }`}
              >
                {isSending ? (
                  <><div className="w-4 h-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" /> Sending...</>
                ) : sent ? (
                  <><IoCheckmarkCircle size={18} /> Message Sent!</>
                ) : (
                  <><IoPaperPlane size={16} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
