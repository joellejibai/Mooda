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
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response:', response);

      const json = await response.json();
      console.log('Response JSON:', json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || json.error || json.Error || 'Login failed');
        console.log('Login failed:', json.message || json.error || json.Error);
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      console.log('User saved to localStorage:', json);

      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
      console.log('Login successful');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'An error occurred during login');
      console.log('Error:', err.message);
    }
  };

  return { login, isLoading, error };
};