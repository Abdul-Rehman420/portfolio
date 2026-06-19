'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useServices, useServiceMutations } from '@/hooks/useApi';

const fields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon Name', type: 'text' },
  { key: 'features', label: 'Features', type: 'tags', placeholder: 'Add feature' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function ServicesPage() {
  const hook = useServices;
  hook.mutations = useServiceMutations();
  return <AdminCrudPage title="Services" fields={fields} useHook={hook} endpoint="services" />;
}
