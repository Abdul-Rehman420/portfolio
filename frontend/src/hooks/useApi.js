// frontend/src/hooks/useApi.js
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAll, fetchById, createItem, updateItem, deleteItem } from '@/lib/api';
import api from '@/lib/api';

const useGenericQuery = (key, endpoint, params = {}) =>
  useQuery({ 
    queryKey: [key, params], 
    queryFn: () => fetchAll(endpoint), 
    staleTime: 0, // Always refetch on mount
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    ...params 
  });

const useGenericMutation = (key, endpoint) => {
  const qc = useQueryClient();
  const create = useMutation({ 
    mutationFn: (d) => createItem(endpoint, d), 
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }) 
  });
  const update = useMutation({ 
    mutationFn: ({ id, ...d }) => updateItem(endpoint, id, d), 
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }) 
  });
  const remove = useMutation({ 
    mutationFn: (id) => deleteItem(endpoint, id), 
    onSuccess: () => qc.invalidateQueries({ queryKey: [key] }) 
  });
  return { create, update, remove };
};

export const useProjects = (params) => useGenericQuery('projects', 'projects', params);
export const useProject = (id) => useQuery({ 
  queryKey: ['project', id], 
  queryFn: () => fetchById('projects', id), 
  enabled: !!id 
});
export const useProjectMutations = () => useGenericMutation('projects', 'projects');

export const useSkills = (params) => useGenericQuery('skills', 'skills', params);
export const useSkillMutations = () => useGenericMutation('skills', 'skills');

export const useServices = (params) => useGenericQuery('services', 'services', params);
export const useServiceMutations = () => useGenericMutation('services', 'services');

export const useTestimonials = (params) => useGenericQuery('testimonials', 'testimonials', params);
export const useTestimonialMutations = () => useGenericMutation('testimonials', 'testimonials');

export const useExperiences = (params) => useGenericQuery('experience', 'experience', params);
export const useExperienceMutations = () => useGenericMutation('experience', 'experience');

export const useEducation = (params) => useGenericQuery('education', 'education', params);
export const useEducationMutations = () => useGenericMutation('education', 'education');

export const useCertifications = (params) => useGenericQuery('certifications', 'certifications', params);
export const useCertificationMutations = () => useGenericMutation('certifications', 'certifications');

export const useSocialLinks = (params) => useGenericQuery('social-links', 'social-links', params);
export const useSocialLinkMutations = () => useGenericMutation('social-links', 'social-links');

export const useSettings = () => useQuery({ 
  queryKey: ['settings'], 
  queryFn: () => fetchAll('settings'),
  staleTime: 0, // Always refetch on mount
  refetchOnMount: true,
  refetchOnWindowFocus: false,
});

export const useSettingsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.put('/settings', data);
        return response.data;
      } catch (error) {
        console.error('Settings mutation error:', error);
        if (error.response) {
          throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response from server. Please check your network connection.');
        } else {
          throw new Error(error.message || 'Failed to update settings');
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      console.error('Settings mutation error:', error);
    },
  });
};