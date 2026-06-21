'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSettings, useSettingsMutation } from '@/hooks/useApi';

const settingFields = [
  { key: 'siteName', label: 'Site Name', type: 'text' },
  { key: 'siteRole', label: 'Role/Title', type: 'text' },
  { key: 'siteDescription', label: 'Description', type: 'textarea' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'resumeUrl', label: 'Resume URL', type: 'text' },
];

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useSettings();
  const mutation = useSettingsMutation();
  const [form, setForm] = useState({});
  const isInitialLoad = useRef(true);

  // Initialize form when settings load
  useEffect(() => {
    if (settings && isInitialLoad.current) {
      setForm(settings);
      isInitialLoad.current = false;
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate that we have data to save
    if (!form || Object.keys(form).length === 0) {
      toast.error('No settings to save');
      return;
    }

    try {
      await mutation.mutateAsync(form);
      toast.success('Settings updated successfully!');
      
      // Refetch to get fresh data
      const freshSettings = await refetch();
      if (freshSettings.data) {
        setForm(freshSettings.data);
        isInitialLoad.current = true;
      }
    } catch (err) {
      console.error('Settings update error:', err);
      // Show a more specific error message
      const errorMessage = err.message || 'Failed to update settings';
      toast.error(errorMessage);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl space-y-4">
          {settingFields.map(field => (
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
                />
              )}
            </div>
          ))}
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}