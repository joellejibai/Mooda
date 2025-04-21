import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext, useAuthPages } from './useAuthPages';
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthPages();


  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if (!response.ok) {
      dispatch({ type: 'LOGIN', payload: json });

      // 2. Optional: save to localStorage
      localStorage.setItem('user', JSON.stringify(json));
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(json));
      setIsLoading(false);
      navigate('/home');
    }
  };

  return { login, isLoading, error };
};