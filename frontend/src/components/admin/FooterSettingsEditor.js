// frontend/src/components/admin/FooterSettingsEditor.js
'use client';
import { useState } from 'react';
import { IoAdd, IoTrash, IoArrowUp, IoArrowDown } from 'react-icons/io5';
import { motion } from 'framer-motion';

const FooterSettingsEditor = ({ type, value = [], onChange }) => {
  const items = Array.isArray(value) ? value : [];
  
  const [newItem, setNewItem] = useState(
    type === 'quickLinks' 
      ? { label: '', href: '' }
      : { platform: '', url: '', icon: 'FaGithub' }
  );
  const [editingIndex, setEditingIndex] = useState(null);

  const addItem = () => {
    const isValid = type === 'quickLinks' 
      ? newItem.label && newItem.href
      : newItem.platform && newItem.url;
      
    if (isValid) {
      const updated = [...items, { ...newItem }];
      onChange(updated);
      setNewItem(
        type === 'quickLinks' 
          ? { label: '', href: '' }
          : { platform: '', url: '', icon: 'FaGithub' }
      );
    }
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const getPlaceholders = () => {
    if (type === 'quickLinks') {
      return { field1: 'Label (e.g., Home)', field2: 'URL (e.g., #home)' };
    }
    return { field1: 'Platform (e.g., github)', field2: 'URL (e.g., https://github.com/username)' };
  };

  const placeholders = getPlaceholders();

  const getItemDisplay = (item) => {
    if (type === 'quickLinks') {
      return `${item.label} → ${item.href}`;
    }
    return `${item.platform} → ${item.url}`;
  };

  const availableIcons = [
    'FaGithub', 'FaLinkedin', 'FaTwitter', 'FaInstagram', 'FaEnvelope', 
    'FaWhatsapp', 'FaYoutube', 'FaFacebook', 'FaDiscord', 'FaTelegram'
  ];

  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-xl space-y-3">
        <h4 className="text-sm font-medium text-gray-400">
          Add New {type === 'quickLinks' ? 'Quick Link' : 'Social Link'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder={placeholders.field1}
            value={type === 'quickLinks' ? newItem.label : newItem.platform}
            onChange={(e) => setNewItem({ ...newItem, [type === 'quickLinks' ? 'label' : 'platform']: e.target.value })}
            className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="text"
            placeholder={placeholders.field2}
            value={type === 'quickLinks' ? newItem.href : newItem.url}
            onChange={(e) => setNewItem({ ...newItem, [type === 'quickLinks' ? 'href' : 'url']: e.target.value })}
            className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {type === 'socialLinks' && (
            <select
              value={newItem.icon}
              onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
              className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {availableIcons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-all cursor-pointer"
        >
          <IoAdd size={16} /> Add {type === 'quickLinks' ? 'Link' : 'Social Link'}
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No {type === 'quickLinks' ? 'quick links' : 'social links'} added yet.
          </p>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="glass p-3 rounded-xl"
            >
              {editingIndex === index ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={type === 'quickLinks' ? item.label : item.platform}
                      onChange={(e) => updateItem(index, type === 'quickLinks' ? 'label' : 'platform', e.target.value)}
                      className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      value={type === 'quickLinks' ? item.href : item.url}
                      onChange={(e) => updateItem(index, type === 'quickLinks' ? 'href' : 'url', e.target.value)}
                      className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {type === 'socialLinks' && (
                      <select
                        value={item.icon || 'FaGithub'}
                        onChange={(e) => updateItem(index, 'icon', e.target.value)}
                        className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-xs hover:bg-primary/30 transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm truncate block">
                      {getItemDisplay(item)}
                    </span>
                    {type === 'socialLinks' && item.icon && (
                      <span className="text-xs text-gray-500">Icon: {item.icon}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                    >
                      <IoArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                    >
                      <IoArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(index)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      title="Delete"
                    >
                      <IoTrash size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-500">
        {type === 'quickLinks' 
          ? 'Add links that appear in the footer navigation. Use # for section anchors.'
          : 'Add social media links that appear in the footer. Select an icon from the dropdown.'}
      </p>
    </div>
  );
};

export default FooterSettingsEditor;