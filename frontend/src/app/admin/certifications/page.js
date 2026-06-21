'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useEducation, useEducationMutations } from '@/hooks/useApi';

const fields = [
  { key: 'degree', label: 'Degree', type: 'text' },
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text' },
  { key: 'cgpa', label: 'CGPA', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'certificates', label: 'Certificates', type: 'tags', placeholder: 'Add certificate' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function EducationPage() {
  const mutations = useEducationMutations();
  return <AdminCrudPage 
    title="Education" 
    fields={fields} 
    useHook={useEducation} 
    mutations={mutations}
    endpoint="education" 
  />;
}