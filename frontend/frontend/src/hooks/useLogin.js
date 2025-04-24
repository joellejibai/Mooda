import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext, useAuthPages } from './useAuthPages';
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuthPages();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return false;
    }

    // ✅ Save user to localStorage
    localStorage.setItem('user', JSON.stringify(json));

    // ✅ Dispatch login to update global auth state
    dispatch({ type: 'LOGIN', payload: json });

    setIsLoading(false);
    navigate('/home');
    return true;
  };

  return { login, isLoading, error };
};
