'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoPaperPlane, IoCheckmarkCircle, IoLocation, IoMail, IoCall } from 'react-icons/io5';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSocialLinks, useSettings } from '@/hooks/useApi';
import { sendContactMessage } from '@/lib/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { data: links = [] } = useSocialLinks();
  const { data: settings } = useSettings();
  const s = settings || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email
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
        
        // Reset sent state after 5 seconds
        setTimeout(() => setSent(false), 5000);
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text"
        >
          Get In Touch
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Have a project in mind? Let&apos;s connect
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.form 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
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
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                value={form.email} 
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <input 
              type="text" 
              name="subject" 
              placeholder="Subject" 
              value={form.subject} 
              onChange={handleChange}
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              value={form.message} 
              onChange={handleChange}
              required 
              rows={5}
              className="w-full px-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
            />
            <motion.button 
              type="submit" 
              disabled={isSending || sent}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                sent ? 'bg-green-500 text-white' : 
                isSending ? 'bg-primary/70 text-white cursor-not-allowed' : 
                'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : sent ? (
                <><IoCheckmarkCircle size={20} /> Message Sent!</>
              ) : (
                <><IoPaperPlane size={18} /> Send Message</>
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl">
                <IoMail className="text-primary mb-2" size={20} />
                <p className="text-xs text-gray-400">Email</p>
                <a href={`mailto:${s.email || ''}`} className="text-sm text-primary hover:underline">
                  {s.email || 'email@example.com'}
                </a>
              </div>
              <div className="glass p-4 rounded-xl">
                <IoCall className="text-primary mb-2" size={20} />
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm">{s.phone || '+92 300 1234567'}</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <IoLocation className="text-primary mb-2" size={20} />
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm">{s.location || 'Karachi, Pakistan'}</p>
              </div>
              <div className="glass p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Freelance</p>
                <p className="text-sm text-green-400">Available</p>
              </div>
            </div>
            <div className="flex gap-3">
              {links.map(link => {
                const Icon = { FaGithub, FaLinkedin, FaWhatsapp }[link.icon] || FaGithub;
                return (
                  <motion.a 
                    key={link._id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={link.platform}
                    whileHover={{ scale: 1.1, y: -3 }} 
                    className="p-3 glass rounded-xl text-gray-400 hover:text-primary transition-all"
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;