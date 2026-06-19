'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useExperiences, useExperienceMutations } from '@/hooks/useApi';

const fields = [
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'duration', label: 'Duration', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'type', label: 'Type', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea', hidden: true },
  { key: 'responsibilities', label: 'Responsibilities', type: 'tags', placeholder: 'Add responsibility' },
  { key: 'technologies', label: 'Technologies', type: 'tags', placeholder: 'Add technology' },
  { key: 'achievements', label: 'Achievements', type: 'tags', placeholder: 'Add achievement' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function ExperiencePage() {
  const hook = useExperiences;
  hook.mutations = useExperienceMutations();
  return <AdminCrudPage title="Experience" fields={fields} useHook={hook} endpoint="experience" />;
}
