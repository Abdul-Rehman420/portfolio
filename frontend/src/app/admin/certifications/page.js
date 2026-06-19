'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useCertifications, useCertificationMutations } from '@/hooks/useApi';

const fields = [
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'link', label: 'Verification Link', type: 'text' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function CertificationsPage() {
  const hook = useCertifications;
  hook.mutations = useCertificationMutations();
  return <AdminCrudPage title="Certifications" fields={fields} useHook={hook} endpoint="certifications" />;
}
