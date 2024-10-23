import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://incubationbackend.vercel.app/api/reset-password', {
                email,
                token,
                newPassword,
            });
            setMessage(response.data.message);
            // Redirect to login page after a successful reset
            setTimeout(() => {
                navigate('/login'); // Adjust the path if your login route is different
            }, 2000); // Wait for 2 seconds before redirecting
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
            {/* Link to login page */}
            <p>
                Remembered your password? <a href="/login">Login here</a>
            </p>
        </div>
    );
};

export default ResetPassword;