import { AuthPages } from '..context/AuthPages'
import { useContext } from 'react'
export const useAuthPages = () => {
    const context = useContext(AuthPages)
    if (!context) {
        throw Error('useAuthPages must be used insided an AuthPagesProvider')
    }
    return context
}