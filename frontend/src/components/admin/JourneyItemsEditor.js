// frontend/src/components/admin/JourneyItemsEditor.js
'use client';
import { useState } from 'react';
import { IoAdd, IoTrash, IoArrowUp, IoArrowDown } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const JourneyItemsEditor = ({ value = [], onChange }) => {
  // Ensure value is an array
  const items = Array.isArray(value) ? value : [];
  
  const [newItem, setNewItem] = useState({ year: '', title: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const addItem = () => {
    if (newItem.year && newItem.title) {
      const updated = [...items, { ...newItem }];
      onChange(updated);
      setNewItem({ year: '', title: '', description: '' });
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

  return (
    <div className="space-y-4">
      {/* Add New Item Form */}
      <div className="glass p-4 rounded-xl space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Add New Journey Item</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Year (e.g., 2024)"
            value={newItem.year}
            onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
            className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="text"
            placeholder="Title (e.g., Tech Lead)"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 transition-all cursor-pointer"
        >
          <IoAdd size={16} /> Add Journey Item
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No journey items added yet.</p>
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
                // Edit Mode
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateItem(index, 'year', e.target.value)}
                      className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="px-3 py-1.5 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
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
                // View Mode
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-primary font-semibold">{item.year}</span>
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-gray-400 truncate">— {item.description}</span>
                      )}
                    </div>
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

      {/* Help text */}
      <p className="text-xs text-gray-500">
        Add your journey milestones in chronological order. Use the arrows to reorder items.
      </p>
    </div>
  );
};

export default JourneyItemsEditor;