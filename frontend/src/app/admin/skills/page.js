'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useSkills, useSkillMutations } from '@/hooks/useApi';

const fields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'level', label: 'Level (%)', type: 'number' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function SkillsPage() {
  const hook = useSkills;
  hook.mutations = useSkillMutations();
  return <AdminCrudPage title="Skills" fields={fields} useHook={hook} endpoint="skills" />;
}
