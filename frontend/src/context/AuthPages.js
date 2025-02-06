import { createContext, useReducer } from 'react'
export const AuthPages = createContext()



export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthPagesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })
    console.log('AuthPages state:', state)
    return (
        <AuthPages.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthPages.Provider>
    )
}