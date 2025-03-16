import { createContext, useReducer, useEffect } from 'react';

// Create the context
export const AuthPages = createContext();

// Define the reducer to handle authentication actions
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

// Create the provider component
export const AuthPagesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  // Check for user in localStorage on initial load
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }, []);

  if (process.env.NODE_ENV === 'development') {
    console.log('AuthPages state:', state);
  }

  return (
    <AuthPages.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthPages.Provider>
  );
};