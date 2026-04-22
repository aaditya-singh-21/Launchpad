import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            navigate('/profile', { replace: true });
        } else {
            // If no token is found, redirect to signin
            navigate('/signin?error=auth_failed', { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#faf7f2]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#E67A62] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-600 font-medium">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
