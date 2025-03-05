import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const{signup,error,isLoading}=useSignup()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(email,password)
    }
    const handleMoveToLogin = () => {
        navigate('/login')
    }
    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up Now!</h3>
            <label>Email</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <p>Have an account? <a href="login">Log in </a></p>
            <button disabled={isLoading} onClick={handleMoveToLogin}>SIGN UP</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}
export default Signup