import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';
import Navbar from '../Navbar'; // Import Navbar component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) navigate('/search'); // Redirect if logged in
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            alert(response.data.message);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
            navigate('/search');
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <Navbar /> {/* Include Navbar here */}
            <div className="login-form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => navigate('/register')}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
