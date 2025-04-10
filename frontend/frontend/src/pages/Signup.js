import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState(''); // New state for gender selection
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password, gender); // Send gender along with email and password
    }

    const handleMoveToLogin = () => {
        navigate('/login');
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

            {/* Gender Selection */}
            <label>Gender</label>
            <div className="gender-selection">
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Male
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={(e) => setGender(e.target.value)}
                    />
                    Female
                </label>
            </div>

            <p>Have an account? <a href="login">Log in </a></p>
            <button disabled={isLoading} onClick={handleMoveToLogin}>SIGN UP</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup;
