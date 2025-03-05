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
                <h3>Log in</h3>
                <label>Email:</label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <label>Password:</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button disaabled={isLoading} onClick={handleMoveToHome}>Log in</button>
                {error && <div className="error">{error}</div>}
                <button id="fingerprintLogin">Login with Fingerprint</button>
            </form>
        )
    }
    export default Login