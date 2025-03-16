import { useContext } from 'react';
import { AuthPages } from '../context/AuthPages';

export const useAuthPages = () => {
  const context = useContext(AuthPages);
  if (!context) {
    throw new Error('useAuthPages must be used inside an AuthPagesProvider');
  }
  return context;
};