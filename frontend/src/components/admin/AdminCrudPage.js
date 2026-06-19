'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoAdd, IoSearch, IoTrash, IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { createItem, updateItem, deleteItem, uploadImage } from '@/lib/api';

const fieldTypes = {
  text: (props) => <input {...props} type="text" className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />,
  textarea: (props) => <textarea {...props} rows={3} className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />,
  number: (props) => <input {...props} type="number" className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />,
  select: (props) => <select {...props} className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">{props.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>,
  tags: ({ value = [], onChange, placeholder }) => {
    const [input, setInput] = useState('');
    const addTag = () => { if (input.trim()) { onChange([...value, input.trim()]); setInput(''); } };
    return (
      <div>
        <div className="flex gap-2 mb-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder={placeholder} className="flex-1 px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button type="button" onClick={addTag} className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 cursor-pointer">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {value.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
              {t} <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-red-400 cursor-pointer">&times;</button>
            </span>
          ))}
        </div>
      </div>
    );
  },
  image: ({ value, onChange, label }) => {
    const handleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const { uploadImage } = await import('@/lib/api');
        const result = await uploadImage(file);
        onChange(result.url);
        toast.success('Image uploaded');
      } catch {
        toast.error('Upload failed');
      }
    };
    return (
      <div>
        {value && <img src={value} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
        <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm hover:file:bg-primary/30" />
      </div>
    );
  },
};

export default function AdminCrudPage({ title, fields, useHook, endpoint }) {
  const { data: items = [], isLoading } = useHook();
  const mutations = useHook().mutations || useGenericMutations(endpoint);
  const { create, update, remove } = mutations;
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});

  const filtered = items.filter(item => {
    if (!search) return true;
    return Object.values(item).some(v => String(v).toLowerCase().includes(search.toLowerCase()));
  });

  const resetForm = () => {
    setForm({});
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (item) => {
    setForm(item);
    setEditing(item);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing?._id) {
        await update.mutateAsync({ id: editing._id, ...form });
        toast.success('Updated successfully');
      } else {
        await create.mutateAsync(form);
        toast.success('Created successfully');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting._id);
      toast.success('Deleted successfully');
      setDeleting(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  if (isLoading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer">
          <IoAdd size={18} /> Add New
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => resetForm()}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} {title.slice(0, -1)}</h2>
                <button onClick={resetForm} className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"><IoClose size={24} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {fields.map(field => {
                  const Field = fieldTypes[field.type] || fieldTypes.text;
                  const val = form[field.key] ?? field.default ?? '';
                  return (
                    <div key={field.key}>
                      <label className="text-sm text-gray-400 mb-1 block">{field.label}</label>
                      <Field
                        value={val}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        options={field.options}
                        onChange={(v) => {
                          const value = v?.target ? v.target.value : v;
                          setForm(p => ({ ...p, [field.key]: value }));
                        }}
                      />
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={create.isPending || update.isPending}
                    className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer">
                    {create.isPending || update.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-6 py-2 glass rounded-xl text-sm font-medium hover:text-primary transition-all cursor-pointer">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass rounded-2xl max-w-md w-full p-6 text-center">
              <IoTrash className="text-red-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Delete {title.slice(0, -1)}?</h3>
              <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleDelete} className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all cursor-pointer">Delete</button>
                <button onClick={() => setDeleting(null)} className="px-6 py-2 glass rounded-xl text-sm font-medium hover:text-primary transition-all cursor-pointer">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Table/List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                {fields.filter(f => !f.hidden).map(f => <th key={f.key} className="text-left px-4 py-3 font-medium">{f.label}</th>)}
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {fields.filter(f => !f.hidden).map(f => (
                    <td key={f.key} className="px-4 py-3">
                      {f.render ? f.render(item[f.key], item) : (
                        <span className="line-clamp-1">
                          {f.type === 'image' && item[f.key] ? <img src={item[f.key]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          : f.type === 'tags' ? (item[f.key] || []).join(', ')
                          : f.type === 'number' ? item[f.key]
                          : String(item[f.key] || '')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-all cursor-pointer">Edit</button>
                      <button onClick={() => setDeleting(item)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all cursor-pointer">Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={fields.length + 1} className="text-center py-8 text-gray-500">No {title.toLowerCase()} found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function useGenericMutations(endpoint) {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (d) => createItem(endpoint, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
  const update = useMutation({
    mutationFn: ({ id, ...d }) => updateItem(endpoint, id, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
  const remove = useMutation({
    mutationFn: (id) => deleteItem(endpoint, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [endpoint] }),
  });
  return { create, update, remove };
}
