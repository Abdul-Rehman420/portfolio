'use client';
import AdminCrudPage from '@/components/admin/AdminCrudPage';
import { useTestimonials, useTestimonialMutations } from '@/hooks/useApi';

const fields = [
  { key: 'image', label: 'Photo', type: 'image' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'position', label: 'Position', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'review', label: 'Review', type: 'textarea' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'order', label: 'Order', type: 'number' },
];

export default function TestimonialsPage() {
  const mutations = useTestimonialMutations();
  return <AdminCrudPage 
    title="Testimonials" 
    fields={fields} 
    useHook={useTestimonials} 
    mutations={mutations}
    endpoint="testimonials" 
  />;
}