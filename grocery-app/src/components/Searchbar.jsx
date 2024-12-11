import React, { useState, useEffect } from 'react';
import { FaHeart, FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Searchbar.css';

const Searchbar = ({ searchQuery, setSearchQuery, cart, setCart, user }) => {
    const [isUserHovering, setIsUserHovering] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        localStorage.removeItem('cart');
        navigate('/'); // Redirect to login page or home page
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);  // Make sure this gets the correct event
    };

    const handleCartClick = () => {
        navigate('/checkout'); // Redirect to checkout page
    };


    const handleOutsideClick = (e) => {
        // Close the dropdown when clicking outside
        if (!e.target.closest(".searchbar-item")) {
            setIsUserHovering(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);
    return (
        <div className="searchbar-container">
            <div className="searchbar-left">
                <h2>Grocery</h2>
            </div>
            <div className="searchbar-center">
                <input
                    className="searchbar-input"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}  // Make sure this is passed correctly
                    placeholder="Search for products"
                />
            </div>
            <div className="searchbar-right">
                {/* Favorites */}
                <div className="searchbar-item" id="Favorites">
                    <FaHeart />
                </div>

                {/* User Profile */}
                <div
                    className={`searchbar-item ${isUserHovering ? "active" : ""}`}
                    onMouseEnter={() => setIsUserHovering(true)}
                >
                    <FaUserCircle className="user-icon" />
                    {/* {isUserHovering && (
                        <div className="searchbar-user-info">
                            <p className="user-name mb-1">{user?.name}</p>
                            <p className="user-email text-muted mb-2">{user?.email}</p>
                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )} */}
                </div>

                {/* Cart */}
                <div
                    className="searchbar-item"
                    onClick={handleCartClick} // Ensure this triggers the redirection
                    title="Cart"
                >
                    <FaShoppingCart />
                </div>

            </div>
        </div>
    );
};

export default Searchbar;
