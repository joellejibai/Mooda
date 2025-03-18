import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted with:", email, password); // Debugging log
        await login(email, password);
    };
    

    const handleMoveToHome = () => {
        navigate('/home');
    };

    const handleFingerprintLogin = async () => {
        if (!window.PublicKeyCredential) {
            alert('Your browser does not support WebAuthn.');
            return;
        }
        
        try {
            const credential = await navigator.credentials.get({ publicKey: { challenge: new Uint8Array(32), userVerification: 'required' } });
            if (credential) {
                // Simulate login success (You should send credential data to the backend for verification)
                alert('Fingerprint authentication successful!');
                navigate('/home');
            }
        } catch (err) {
            alert('Fingerprint authentication failed. Please try again.');
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Welcome Back!</h3>
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
            
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
            <p>Don't have an account? <a href="signup">Sign up</a></p>
            <button type="button" onClick={handleFingerprintLogin} style={{ border: 'none', background: 'none' }}>
                <img src="/finger.png" alt="Login with Fingerprint" style={{ width: '50px', height: '50px', cursor: 'pointer' }} />
            </button>
            <button disabled={isLoading} onClick={handleMoveToHome}>LOG IN</button>
            
            
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default Login;
