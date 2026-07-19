// frontend/src/app/admin/settings/page.js
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSettings, useSettingsMutation } from '@/hooks/useApi';
import { uploadImage } from '@/lib/api';
import Image from 'next/image';
import ImageCropModal from '@/components/admin/ImageCropModal';
import FooterSettingsEditor from '@/components/admin/FooterSettingsEditor';
import { 
  IoHome, IoPerson, IoCodeSlash, IoFolder, IoBriefcase, 
  IoSettings, IoPeople, IoMail, IoEyeOff, IoEye 
} from 'react-icons/io5';

const settingFields = [
  // General Settings
  { key: 'siteName', label: 'Site Name', type: 'text', section: 'General' },
  { key: 'siteDescription', label: 'Description', type: 'textarea', section: 'General' },
  { key: 'location', label: 'Location', type: 'text', section: 'General' },
  { key: 'email', label: 'Email', type: 'text', section: 'General' },
  { key: 'phone', label: 'Phone', type: 'text', section: 'General' },
  { key: 'resumeUrl', label: 'Resume URL', type: 'text', section: 'General' },
  { key: 'typewriterRoles', label: 'Typewriter Roles (comma separated)', type: 'text', section: 'General',
    description: 'Enter roles separated by commas. Example: MERN Stack Developer,Frontend Developer,React Developer' },
  { key: 'profileImage', label: 'Profile Image', type: 'image', section: 'General',
    description: 'Upload your profile photo (Recommended: Square image, 400x400px or larger)' },
  { key: 'heroYearsExp', label: 'Years of Experience (Hero stat)', type: 'text', section: 'General',
    description: 'Example: 3+, 8+' },
  { key: 'heroProjectsDone', label: 'Projects Completed (Hero stat)', type: 'text', section: 'General',
    description: 'Example: 20+, 50+' },
  { key: 'heroAwardsWon', label: 'Awards Won (Hero stat)', type: 'text', section: 'General',
    description: 'Example: 5+, 12+' },
  { key: 'statClients', label: 'Happy Clients (About stat)', type: 'text', section: 'General',
    description: 'Example: 30+, 100+' },
  { key: 'technologies', label: 'Technologies', type: 'text', section: 'General',
    description: 'Comma-separated technology names. Example: React,Next.js,Node.js,TypeScript,MongoDB' },
  { key: 'processTitle', label: 'Process Section Title', type: 'text', section: 'General' },
  { key: 'aboutImage2', label: 'About Gallery Image 2', type: 'image', section: 'General',
    description: 'Second image for About section gallery' },

  // Section Visibility
  { key: 'showHero', label: 'Show Hero Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showAbout', label: 'Show About Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showSkills', label: 'Show Skills Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showProjects', label: 'Show Projects Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showExperience', label: 'Show Experience Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showServices', label: 'Show Services Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showTestimonials', label: 'Show Testimonials Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showContact', label: 'Show Contact Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showTrustedBy', label: 'Show Trusted By Section', type: 'toggle', section: 'Section Visibility' },
  { key: 'showProcess', label: 'Show Process Section', type: 'toggle', section: 'Section Visibility' },

  // About Section
  { key: 'aboutDescription', label: 'About Description (Paragraph 1)', type: 'textarea', section: 'About Section' },
  { key: 'aboutDescription2', label: 'About Description (Paragraph 2)', type: 'textarea', section: 'About Section' },
  { key: 'careerObjective', label: 'Career Objective', type: 'textarea', section: 'About Section' },

  // Footer Settings
  { key: 'footerCopyright', label: 'Copyright Text', type: 'text', section: 'Footer',
    description: 'Text shown after the year and your name. Example: "All rights reserved."' },
  { key: 'footerQuickLinks', label: 'Quick Links', type: 'footerLinks', section: 'Footer' },
  { key: 'footerShowCopyright', label: 'Show Copyright', type: 'select', section: 'Footer',
    options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  { key: 'footerShowBackToTop', label: 'Show Back to Top Button', type: 'select', section: 'Footer',
    options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
];

const sectionIcons = {
  showHero: IoHome,
  showAbout: IoPerson,
  showSkills: IoCodeSlash,
  showProjects: IoFolder,
  showExperience: IoBriefcase,
  showServices: IoSettings,
  showTestimonials: IoPeople,
  showContact: IoMail,
};

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useSettings();
  const mutation = useSettingsMutation();
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeSection, setActiveSection] = useState('General');
  const isInitialLoad = useRef(true);
  const isCroppingRef = useRef(false);

  useEffect(() => {
    if (settings && isInitialLoad.current) {
      // Skip if we're in the middle of a crop operation
      if (isCroppingRef.current) {
        return;
      }
      
      const parsedSettings = { ...settings };
      
      if (typeof parsedSettings.footerQuickLinks === 'string') {
        try {
          parsedSettings.footerQuickLinks = JSON.parse(parsedSettings.footerQuickLinks);
        } catch (e) {
          parsedSettings.footerQuickLinks = [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Experience', href: '#experience' },
            { label: 'Services', href: '#services' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Contact', href: '#contact' }
          ];
        }
      }
      
      setForm(parsedSettings);
      isInitialLoad.current = false;
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form || Object.keys(form).length === 0) {
      toast.error('No settings to save');
      return;
    }

    const dataToSave = { ...form };
    
    if (dataToSave.footerQuickLinks) {
      dataToSave.footerQuickLinks = JSON.stringify(dataToSave.footerQuickLinks);
    }
    
    try {
      await mutation.mutateAsync(dataToSave);
      toast.success('Settings updated successfully!');
      
      const freshSettings = await refetch();
      if (freshSettings.data) {
        const parsedSettings = { ...freshSettings.data };
        
        if (typeof parsedSettings.footerQuickLinks === 'string') {
          try {
            parsedSettings.footerQuickLinks = JSON.parse(parsedSettings.footerQuickLinks);
          } catch (e) {
            parsedSettings.footerQuickLinks = [];
          }
        }
        
        setForm(parsedSettings);
        isInitialLoad.current = true;
      }
    } catch (err) {
      console.error('Settings update error:', err);
      const errorMessage = err.message || 'Failed to update settings';
      toast.error(errorMessage);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setShowCropModal(true);
    e.target.value = '';
  };

  const handleCropComplete = useCallback(async (croppedFile) => {
    // Prevent multiple calls
    if (uploading) return;
    
    isCroppingRef.current = true;
    setUploading(true);
    
    try {
      // Upload the image
      const result = await uploadImage(croppedFile);
      
      // Update the form with the new image URL
      setForm(prev => ({ ...prev, profileImage: result.url }));
      toast.success('Profile image uploaded successfully!');
      
      // Close the modal FIRST - this ensures the modal is closed before any other state changes
      setShowCropModal(false);
      setSelectedFile(null);
      
      // Wait a tiny bit for the modal to close
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now save the settings with the new image
      const dataToSave = { ...form, profileImage: result.url };
      
      // Stringify any JSON fields
      if (dataToSave.footerQuickLinks) {
        dataToSave.footerQuickLinks = JSON.stringify(dataToSave.footerQuickLinks);
      }
      
      // Save to backend
      await mutation.mutateAsync(dataToSave);
      
      // Refetch settings to get the latest data
      await refetch();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
      // Keep modal open on error so user can retry
      setShowCropModal(true);
    } finally {
      setUploading(false);
      // Clear the cropping flag after a delay
      setTimeout(() => {
        isCroppingRef.current = false;
      }, 500);
    }
  }, [form, uploading, mutation, refetch]);

  const handleModalClose = useCallback(() => {
    if (uploading) {
      // Don't close while uploading
      toast.info('Please wait for the upload to complete');
      return;
    }
    setShowCropModal(false);
    setSelectedFile(null);
    isCroppingRef.current = false;
  }, [uploading]);

  const removeImage = () => {
    setForm(prev => ({ ...prev, profileImage: '' }));
    toast.success('Profile image removed');
  };

  const sections = {};
  settingFields.forEach(field => {
    const section = field.section || 'General';
    if (!sections[section]) sections[section] = [];
    sections[section].push(field);
  });

  const sectionNames = Object.keys(sections);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {sectionNames.map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeSection === section 
                ? 'bg-primary text-white' 
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeSection}
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl"
      >
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl space-y-4">
          {sections[activeSection]?.map(field => {
            // Toggle fields for section visibility
            if (field.type === 'toggle') {
              const Icon = sectionIcons[field.key];
              const isEnabled = form[field.key] !== 'false';
              return (
                <div key={field.key} className="border-b border-white/10 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="text-gray-400" size={20} />}
                      <label className="text-sm text-gray-300">{field.label}</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(field.key, isEnabled ? 'false' : 'true')}
                      className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
                        isEnabled ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                          isEnabled ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isEnabled ? (
                      <span className="text-green-400 flex items-center gap-1">
                        <IoEye size={12} /> Visible on website
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <IoEyeOff size={12} /> Hidden from website
                      </span>
                    )}
                  </p>
                </div>
              );
            }

            if (field.type === 'image') {
              return (
                <div key={field.key} className="border-b border-white/10 pb-4">
                  <label className="text-sm text-gray-400 mb-2 block">{field.label}</label>
                  
                  {/* Profile image preview - rounded-full for circle display */}
                  {form[field.key] && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-primary/30">
                      <Image 
                        src={form[field.key]} 
                        alt="Profile" 
                        fill
                        className="object-cover object-center"
                        unoptimized={form[field.key].startsWith('http')}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm hover:file:bg-primary/30 disabled:opacity-50 cursor-pointer" 
                  />
                  {uploading && <span className="text-xs text-primary ml-2">Uploading...</span>}
                  {field.description && (
                    <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                  )}
                </div>
              );
            }

            if (field.type === 'footerLinks') {
              return (
                <div key={field.key} className="border-b border-white/10 pb-4">
                  <label className="text-sm text-gray-400 mb-2 block">{field.label}</label>
                  <FooterSettingsEditor
                    type="quickLinks"
                    value={form[field.key] || []}
                    onChange={(value) => handleChange(field.key, value)}
                  />
                </div>
              );
            }

            return (
              <div key={field.key} className="border-b border-white/10 pb-4 last:border-0">
                <label className="text-sm text-gray-400 mb-1 block">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    value={form[field.key] || ''} 
                    onChange={e => handleChange(field.key, e.target.value)}
                    rows={3} 
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={form[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={form[field.key] || ''} 
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  />
                )}
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            );
          })}
          
          <button 
            type="submit" 
            disabled={mutation.isPending || uploading}
            className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </motion.div>

      <ImageCropModal
        isOpen={showCropModal}
        onClose={handleModalClose}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
      />
    </div>
  );
}