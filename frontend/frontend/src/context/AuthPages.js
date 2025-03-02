import { createContext, useReducer,useEffect } from 'react';

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
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if (user){
      dispatch({type:'LOGIN',payload:user})
    }
  },[])
  console.log("AuthPages state:", state);

  return (
    <AuthPages.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthPages.Provider>
  );
};
