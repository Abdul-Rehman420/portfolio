'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAdd, IoTrash, IoClose, IoEye, IoEyeOff, 
  IoArrowUp, IoArrowDown, IoWarning, IoRefresh
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useCategories, useCategoryMutations } from '@/hooks/useApi';

export default function CategoriesPage() {
  const { data: categories = [], isLoading, refetch } = useCategories(true);
  const { create, update, remove, toggleVisibility } = useCategoryMutations();
  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', order: 0 });
  const [showHidden, setShowHidden] = useState(false);

  // Filter categories based on visibility
  const visibleCategories = categories.filter(c => !c.isHidden);
  const hiddenCategories = categories.filter(c => c.isHidden);
  const displayedCategories = showHidden ? categories : visibleCategories;

  const resetForm = () => {
    setForm({ name: '', description: '', order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!form.name || form.name.trim() === '') {
      toast.error('Category name is required');
      return;
    }

    try {
      if (editing) {
        await update.mutateAsync({ id: editing._id, ...form });
        toast.success('Category updated successfully');
      } else {
        await create.mutateAsync(form);
        toast.success('Category created successfully');
      }
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    
    try {
      const result = await remove.mutateAsync(deleting._id);
      toast.success(result.message || 'Category deleted successfully');
      setDeleting(null);
      refetch();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      toast.error(msg);
      setDeleting(null);
    }
  };

  const handleToggleVisibility = async (category) => {
    try {
      await toggleVisibility.mutateAsync({ 
        id: category._id, 
        isHidden: !category.isHidden 
      });
      toast.success(`Category "${category.name}" ${category.isHidden ? 'shown' : 'hidden'}`);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleMove = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= displayedCategories.length) return;
    
    // Swap orders
    const current = displayedCategories[index];
    const target = displayedCategories[newIndex];
    
    try {
      await Promise.all([
        update.mutateAsync({ id: current._id, order: target.order }),
        update.mutateAsync({ id: target._id, order: current.order }),
      ]);
      refetch();
    } catch (err) {
      toast.error('Failed to reorder categories');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading categories...</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Project Categories</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage categories for filtering projects on the portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
              showHidden ? 'bg-primary/20 text-primary' : 'glass text-gray-400'
            }`}
          >
            {showHidden ? 'Hide Hidden' : 'Show Hidden'}
            <span className="ml-1 text-xs">
              ({hiddenCategories.length})
            </span>
          </button>
          <button
            onClick={() => refetch()}
            className="p-2 glass rounded-lg text-gray-400 hover:text-primary transition-all cursor-pointer"
          >
            <IoRefresh size={18} />
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer"
          >
            <IoAdd size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-center px-4 py-3 font-medium">Projects</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No categories found. Create your first category!
                  </td>
                </tr>
              ) : (
                displayedCategories.map((cat, i) => (
                  <motion.tr
                    key={cat._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      cat.isHidden ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {cat.projectCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        cat.isHidden 
                          ? 'bg-red-500/10 text-red-400' 
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        {cat.isHidden ? (
                          <><IoEyeOff size={12} /> Hidden</>
                        ) : (
                          <><IoEye size={12} /> Visible</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMove(i, -1)}
                          disabled={i === 0}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move up"
                        >
                          <IoArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMove(i, 1)}
                          disabled={i === displayedCategories.length - 1}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move down"
                        >
                          <IoArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(cat);
                            setForm({ 
                              name: cat.name, 
                              description: cat.description || '',
                              order: cat.order || 0 
                            });
                            setShowForm(true);
                          }}
                          className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(cat)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            cat.isHidden 
                              ? 'text-green-400 hover:bg-green-500/10' 
                              : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                          }`}
                          title={cat.isHidden ? 'Show' : 'Hide'}
                        >
                          {cat.isHidden ? <IoEye size={14} /> : <IoEyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => setDeleting(cat)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete category"
                        >
                          <IoTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-2xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editing ? 'Edit' : 'Add'} Category
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Category Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Full Stack, Mobile, AI/ML"
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional description of this category"
                    rows={2}
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={create.isPending || update.isPending}
                    className="flex-1 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {create.isPending || update.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 glass rounded-xl text-sm font-medium hover:text-primary transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass rounded-2xl max-w-md w-full p-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <IoWarning className="text-red-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Category?</h3>
              <p className="text-sm text-gray-400 mb-2">
                Are you sure you want to delete <span className="text-white font-medium">&quot;{deleting.name}&quot;</span>?
              </p>
              
              {deleting.projectCount > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                  <p className="text-sm text-red-400">
                    ⚠️ This category is used by <strong>{deleting.projectCount}</strong> project(s).
                    You must reassign or delete those projects first.
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mb-6">
                {deleting.projectCount > 0 
                  ? 'This action cannot be performed until all projects are removed from this category.'
                  : 'This action cannot be undone.'}
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDelete}
                  disabled={deleting.projectCount > 0}
                  className={`px-6 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    deleting.projectCount > 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {deleting.projectCount > 0 ? 'Cannot Delete' : 'Permanently Delete'}
                </button>
                <button
                  onClick={() => setDeleting(null)}
                  className="px-6 py-2 glass rounded-xl text-sm font-medium hover:text-primary transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}