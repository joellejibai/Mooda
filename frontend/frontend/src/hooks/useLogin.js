import { useState } from 'react';
import { useAuthPages } from './useAuthPages';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // IMPORTANT: Call the hook (with parentheses) to get the context values.
  const { dispatch } = useAuthPages();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        // Adjust the property name based on your backend's error response.
        setError(json.error || json.Error || 'Signup failed');
        return;
      }

      // Save the user data to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // Update the auth state via dispatch
      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return { login, isLoading, error };
};

