'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSettings, useSettingsMutation } from '@/hooks/useApi';
import { uploadImage } from '@/lib/api';
import Image from 'next/image';
import ImageCropModal from '@/components/admin/ImageCropModal';

const settingFields = [
  { key: 'siteName', label: 'Site Name', type: 'text' },
  { key: 'siteRole', label: 'Role/Title', type: 'text' },
  { key: 'siteDescription', label: 'Description', type: 'textarea' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'resumeUrl', label: 'Resume URL', type: 'text' },
  { key: 'typewriterRoles', label: 'Typewriter Roles (comma separated)', type: 'text', 
    description: 'Enter roles separated by commas. Example: MERN Stack Developer,Frontend Developer,React Developer' },
  { key: 'profileImage', label: 'Profile Image', type: 'image',
    description: 'Upload your profile photo (Recommended: Square image, 400x400px or larger)' },
];

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useSettings();
  const mutation = useSettingsMutation();
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (settings && isInitialLoad.current) {
      setForm(settings);
      isInitialLoad.current = false;
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form || Object.keys(form).length === 0) {
      toast.error('No settings to save');
      return;
    }

    try {
      await mutation.mutateAsync(form);
      toast.success('Settings updated successfully!');
      
      const freshSettings = await refetch();
      if (freshSettings.data) {
        setForm(freshSettings.data);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show crop modal with the selected file
    setSelectedFile(file);
    setShowCropModal(true);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile) => {
    setUploading(true);
    try {
      const result = await uploadImage(croppedFile);
      handleChange('profileImage', result.url);
      toast.success('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const removeImage = () => {
    handleChange('profileImage', '');
    toast.success('Profile image removed');
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl space-y-4">
          {settingFields.map(field => {
            // Special handling for image field
            if (field.type === 'image') {
              return (
                <div key={field.key} className="border-b border-white/10 pb-4">
                  <label className="text-sm text-gray-400 mb-2 block">{field.label}</label>
                  
                  {/* Preview current image */}
                  {form[field.key] && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-primary/30">
                      <Image 
                        src={form[field.key]} 
                        alt="Profile" 
                        fill
                        className="object-cover"
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

            // Regular text/textarea fields
            return (
              <div key={field.key}>
                <label className="text-sm text-gray-400 mb-1 block">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    value={form[field.key] || ''} 
                    onChange={e => handleChange(field.key, e.target.value)}
                    rows={3} 
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
                  />
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
            disabled={mutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </motion.div>

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setSelectedFile(null);
        }}
        onCropComplete={handleCropComplete}
        imageFile={selectedFile}
      />
    </div>
  );
}