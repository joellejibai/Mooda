import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const signup = async (email, password, gender) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, gender })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error); // stays on signup page and shows error
        } else {
            setIsLoading(false);
            navigate('/login'); // ✅ go to login page after signup success
        }
    };

    return { signup, isLoading, error };
};
