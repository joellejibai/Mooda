import { useAuthPages } from "./useAuthPages"

export const useLogout = () => {
    const { dispatch } = useAuthPages() // Get dispatch from context

    const logout = () => {
        // ✅ Remove user from local storage
        localStorage.removeItem('user')

        // ✅ Dispatch logout action to update state
        dispatch({ type: 'LOGOUT' })

        // ✅ Optionally, redirect to login page
        window.location.href = '/login' // Ensure user is redirected
    }

    return { logout }
}
