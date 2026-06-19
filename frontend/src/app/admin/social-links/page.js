'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useSocialLinks, useSocialLinkMutations } from '@/hooks/useApi';

const fields = [
  { key: 'platform', label: 'Platform', type: 'text' },
  { key: 'url', label: 'URL', type: 'text' },
  { key: 'icon', label: 'Icon Name', type: 'text' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function SocialLinksPage() {
  const hook = useSocialLinks;
  hook.mutations = useSocialLinkMutations();
  return <AdminCrudPage title="Social Links" fields={fields} useHook={hook} endpoint="social-links" />;
}
