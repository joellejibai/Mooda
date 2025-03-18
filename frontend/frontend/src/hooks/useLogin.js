import { useState } from 'react';
import { useAuthPages } from './useAuthPages';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthPages();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    console.log('Logging in...');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorMessage = await response.text(); // Get server error message
        throw new Error(`Login failed: ${errorMessage}`);
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data));
      console.log('User saved to localStorage:', data);

      // Dispatch login action
      dispatch({ type: 'LOGIN', payload: data });

      setIsLoading(false);
      console.log('Login successful');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred during login');
      console.error('Error during login:', err.message);
    }
  };

  return { login, isLoading, error };
};
