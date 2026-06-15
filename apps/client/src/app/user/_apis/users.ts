import type { Me } from '@/app/user/_types/types';
import { apiFetch } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export const getMe = () => apiFetch<Me>('/users/me');

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const withdraw = async () => {
  await apiFetch<null>('/users/me', { method: 'delete' });
  await supabase.auth.signOut();
};
