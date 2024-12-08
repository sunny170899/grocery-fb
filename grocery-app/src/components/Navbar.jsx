import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  // Import the CSS file for styling

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        localStorage.removeItem('cart');
        navigate('/'); // Redirect to login page or home page
    };

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h3 className="logo">Shopping App</h3>
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <span>Welcome, {user.email}</span>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="login-button" onClick={() => navigate('/')}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
