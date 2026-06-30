'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IoAdd, IoSearch, IoTrash, IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { createItem, updateItem, deleteItem, uploadImage } from '@/lib/api';
import Image from 'next/image';
import ImageCropModal from '@/components/admin/ImageCropModal';

// Component for tags input
const TagsInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const addTag = () => { 
    if (input.trim()) { 
      onChange([...value, input.trim()]); 
      setInput(''); 
    } 
  };
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => { 
            if (e.key === 'Enter') { 
              e.preventDefault(); 
              addTag(); 
            } 
          }}
          placeholder={placeholder} 
          className="flex-1 px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
        />
        <button 
          type="button" 
          onClick={addTag} 
          className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm hover:bg-primary/30 cursor-pointer"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.isArray(value) && value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
            {t} 
            <button 
              type="button" 
              onClick={() => onChange(value.filter((_, j) => j !== i))} 
              className="hover:text-red-400 cursor-pointer"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// Image upload component with Next.js Image and Crop Modal
const ImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setShowCropModal(true);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile) => {
    setUploading(true);
    try {
      const result = await uploadImage(croppedFile);
      onChange(result.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      {value && (
        <div className="w-full h-32 relative rounded-lg mb-2 overflow-hidden">
          <Image 
            src={value} 
            alt="preview" 
            fill
            className="object-cover"
            unoptimized={value.startsWith('http')}
          />
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFile}
        disabled={uploading}
        className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm hover:file:bg-primary/30 disabled:opacity-50 cursor-pointer" 
      />
      {uploading && <span className="text-xs text-primary ml-2">Uploading...</span>}

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
};

// ✅ FIXED: Multi-image upload component with safety checks
const MultiImageUpload = ({ value = [], onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // ✅ CRITICAL FIX: Ensure value is always an array
  const images = Array.isArray(value) ? value : [];

  const handleFile = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length === 1) {
      setSelectedFile(files[0]);
      setShowCropModal(true);
      e.target.value = '';
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setUploadStatus(`Uploading 0/${files.length}...`);
    
    try {
      const newImages = [];
      let completed = 0;
      
      for (const file of files) {
        setUploadStatus(`Uploading ${completed + 1}/${files.length}...`);
        try {
          const result = await uploadImage(file);
          newImages.push(result.url);
          completed++;
          setProgress(Math.round((completed / files.length) * 100));
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          toast.error(`Failed to upload ${file.name}: ${err.message}`);
        }
      }
      
      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadStatus('');
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setUploading(true);
    try {
      const result = await uploadImage(croppedFile);
      onChange([...images, result.url]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
            <Image 
              src={url} 
              alt={`Project image ${index + 1}`} 
              fill
              className="object-cover"
              unoptimized={url.startsWith('http')}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <IoClose size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {uploading ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-primary whitespace-nowrap">{progress}%</span>
          </div>
          <p className="text-xs text-gray-400">{uploadStatus}</p>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFile}
          disabled={uploading}
          className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm hover:file:bg-primary/30 disabled:opacity-50 cursor-pointer"
        />
      )}

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
};

// Field renderer components
const TextField = (props) => (
  <input {...props} type="text" className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
);

const TextareaField = (props) => (
  <textarea {...props} rows={3} className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
);

const NumberField = (props) => (
  <input {...props} type="number" className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
);

const SelectField = ({ options, ...props }) => (
  <select {...props} className="w-full px-3 py-2 glass rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
    {options?.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const fieldTypes = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  tags: TagsInput,
  image: ImageUpload,
  multiImage: MultiImageUpload,
};

// Mutations Wrapper Component
const MutationsWrapper = ({ endpoint, children }) => {
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
  
  return children({ create, update, remove });
};

// AdminCrudContent Component
const AdminCrudContent = ({ 
  title, 
  fields, 
  items, 
  filtered, 
  search, 
  setSearch,
  editing,
  setEditing,
  deleting,
  setDeleting,
  showForm,
  setShowForm,
  form,
  setForm,
  resetForm,
  openEdit,
  mutations 
}) => {
  const { create, update, remove } = mutations;

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

  // Ensure form has default values for all fields
  const getDefaultForm = () => {
    const defaults = {};
    fields.forEach(field => {
      if (field.type === 'multiImage') {
        defaults[field.key] = [];
      } else if (field.type === 'tags') {
        defaults[field.key] = [];
      } else {
        defaults[field.key] = field.default ?? '';
      }
    });
    return defaults;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button 
          onClick={() => { 
            resetForm(); 
            setForm(getDefaultForm());
            setShowForm(true); 
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer"
        >
          <IoAdd size={18} /> Add New
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder={`Search ${title.toLowerCase()}...`} 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
        />
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
            onClick={() => resetForm()}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} 
              className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} {title.slice(0, -1)}</h2>
                <button onClick={resetForm} className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer">
                  <IoClose size={24} />
                </button>
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
                  <button 
                    type="submit" 
                    disabled={create.isPending || update.isPending}
                    className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
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

      {/* Delete Confirmation */}
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
              <IoTrash className="text-red-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold mb-2">Delete {title.slice(0, -1)}?</h3>
              <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={handleDelete} 
                  className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all cursor-pointer"
                >
                  Delete
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

      {/* Items Table/List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                {fields.filter(f => !f.hidden).map(f => (
                  <th key={f.key} className="text-left px-4 py-3 font-medium">{f.label}</th>
                ))}
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filtered) && filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <motion.tr 
                    key={item._id || i} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {fields.filter(f => !f.hidden).map(f => (
                      <td key={f.key} className="px-4 py-3">
                        {f.render ? f.render(item[f.key], item) : (
                          <span className="line-clamp-1">
                            {f.type === 'image' && item[f.key] ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                                <Image 
                                  src={item[f.key]} 
                                  alt="" 
                                  fill
                                  className="object-cover"
                                  unoptimized={item[f.key].startsWith('http')}
                                />
                              </div>
                            ) : f.type === 'multiImage' ? (
                              <span className="text-xs text-primary">
                                {Array.isArray(item[f.key]) ? item[f.key].length : 0} image{Array.isArray(item[f.key]) && item[f.key].length !== 1 ? 's' : ''}
                              </span>
                            ) : f.type === 'tags' ? (
                              (Array.isArray(item[f.key]) ? item[f.key] : []).join(', ')
                            ) : f.type === 'number' ? (
                              item[f.key]
                            ) : (
                              String(item[f.key] || '')
                            )}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(item)} 
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleting(item)} 
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={fields.filter(f => !f.hidden).length + 1} className="text-center py-8 text-gray-500">
                    {search ? 'No matching results found' : `No ${title.toLowerCase()} found`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main AdminCrudPage Component
export default function AdminCrudPage({ title, fields, useHook, mutations: propMutations, endpoint }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});

  // Use the hook to get data
  const hookResult = useHook();
  
  // Safely extract data and loading state
  let items = [];
  let isLoading = false;
  let error = null;
  let hookMutations = null;
  
  if (Array.isArray(hookResult)) {
    items = hookResult;
  } else if (hookResult && typeof hookResult === 'object') {
    items = hookResult.data || [];
    isLoading = hookResult.isLoading || false;
    error = hookResult.error || null;
    hookMutations = hookResult.mutations || null;
    
    if (Array.isArray(hookResult.items)) {
      items = hookResult.items;
    }
  }
  
  // Ensure items is always an array
  if (!Array.isArray(items)) {
    console.warn('Items is not an array, defaulting to empty array:', items);
    items = [];
  }

  // Use propMutations if provided, otherwise use hookMutations
  const mutations = propMutations || hookMutations;

  const resetForm = () => {
    setForm({});
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (item) => {
    // ✅ Ensure images and other array fields are always arrays
    const safeItem = {
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      technologies: Array.isArray(item.technologies) ? item.technologies : [],
      features: Array.isArray(item.features) ? item.features : [],
      responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : [],
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      certificates: Array.isArray(item.certificates) ? item.certificates : [],
    };
    // Convert booleans to strings for select field compatibility
    fields.forEach(field => {
      if (field.type === 'select' && typeof safeItem[field.key] === 'boolean') {
        safeItem[field.key] = String(safeItem[field.key]);
      }
    });
    setForm(safeItem);
    setEditing(safeItem);
    setShowForm(true);
  };

  // Filter items
  const filtered = items.filter(item => {
    if (!search) return true;
    return Object.values(item).some(v => {
      if (v === null || v === undefined) return false;
      return String(v).toLowerCase().includes(search.toLowerCase());
    });
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-400">Error loading {title.toLowerCase()}: {error.message}</div>;
  }

  // If no mutations available, use the wrapper
  if (!mutations) {
    return (
      <MutationsWrapper endpoint={endpoint}>
        {(wrapperMutations) => (
          <AdminCrudContent
            title={title}
            fields={fields}
            items={items}
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            editing={editing}
            setEditing={setEditing}
            deleting={deleting}
            setDeleting={setDeleting}
            showForm={showForm}
            setShowForm={setShowForm}
            form={form}
            setForm={setForm}
            resetForm={resetForm}
            openEdit={openEdit}
            mutations={wrapperMutations}
          />
        )}
      </MutationsWrapper>
    );
  }

  // Use the provided mutations
  return (
    <AdminCrudContent
      title={title}
      fields={fields}
      items={items}
      filtered={filtered}
      search={search}
      setSearch={setSearch}
      editing={editing}
      setEditing={setEditing}
      deleting={deleting}
      setDeleting={setDeleting}
      showForm={showForm}
      setShowForm={setShowForm}
      form={form}
      setForm={setForm}
      resetForm={resetForm}
      openEdit={openEdit}
      mutations={mutations}
    />
  );
}