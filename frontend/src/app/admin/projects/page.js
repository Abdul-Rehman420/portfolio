'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useProjects, useProjectMutations } from '@/hooks/useApi';

const fields = [
  { key: 'image', label: 'Main Image', type: 'image' },
  { key: 'images', label: 'Additional Images', type: 'multiImage' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: [{ value: 'Live', label: 'Live' }, { value: 'Development', label: 'Development' }, { value: 'Archived', label: 'Archived' }] },
  { key: 'technologies', label: 'Technologies', type: 'tags', placeholder: 'Add technology' },
  { key: 'features', label: 'Features', type: 'tags', placeholder: 'Add feature' },
  { key: 'github', label: 'GitHub URL', type: 'text' },
  { key: 'liveDemo', label: 'Live Demo URL', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'featured', label: 'Featured', type: 'select', options: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }] },
  { key: 'longDescription', label: 'Long Description', type: 'textarea', hidden: true },
  { key: 'architecture', label: 'Architecture', type: 'textarea', hidden: true },
  { key: 'problem', label: 'Problem', type: 'textarea', hidden: true },
  { key: 'challenges', label: 'Challenges', type: 'textarea', hidden: true },
  { key: 'solution', label: 'Solution', type: 'textarea', hidden: true },
  { key: 'performance', label: 'Performance', type: 'text', hidden: true },
];

export default function ProjectsPage() {
  const mutations = useProjectMutations();
  return <AdminCrudPage 
    title="Projects" 
    fields={fields} 
    useHook={useProjects} 
    mutations={mutations}
    endpoint="projects" 
  />;
}