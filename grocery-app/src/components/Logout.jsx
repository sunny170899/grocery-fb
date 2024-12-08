import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any stored user authentication data (if implemented in localStorage/sessionStorage)
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        alert('Logged out successfully!');
        navigate('/'); // Redirect to login page
    }, [navigate]);

    return null; // No UI needed for logout
};

export default Logout;
