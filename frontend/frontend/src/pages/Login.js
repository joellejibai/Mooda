    import { useState } from 'react'
    import {useLogin} from '../hooks/useLogin'
    import { useNavigate } from 'react-router-dom'

    const Login = () => {
        const navigate = useNavigate()
        const [email, setEmail] = useState('')
        
        const [password, setPassword] = useState('')
        const {login,error,isLoading}=useLogin()
        const handleSubmit = async (e) => {
            e.preventDefault()
            await login(email,password)
        }

        const handleMoveToHome = () => {
            navigate('/home')
        } 

        return (
            <form className="login" onSubmit={handleSubmit}>
                <h3>Welcome Back!</h3>
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
                <p>Don't have an account? <a href="signup">Sign up</a></p>
                <button disaabled={isLoading} onClick={handleMoveToHome}>LOG IN</button>
                {error && <div className="error">{error}</div>}
                
            </form>
        )
    }
    export default Login