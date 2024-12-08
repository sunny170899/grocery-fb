import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Import Navbar component
import '../styles/shopping.css';

const CheckoutPage = () => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                fetchCart(user.email);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                updateCartOnServer(user.email, cart);
            }
            calculateTotals(cart);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const fetchCart = async (email) => {
        try {
            const response = await axios.get('http://localhost:5000/cart', { params: { email } });
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const updateCartOnServer = async (email, cartData) => {
        try {
            await axios.post('http://localhost:5000/cart', { email, cart: cartData });
        } catch (error) {
            console.error('Error updating cart on server:', error);
        }
    };

    const handleQuantityChange = (id, delta) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + delta;
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const applyOffers = (cart) => {
        let updatedCart = [...cart];

        updatedCart = updatedCart.map((item) => {
            if (item.name === 'Coca-Cola' && item.quantity >= 6) {
                const freeCans = Math.floor(item.quantity / 6);
                const freeItems = Array(freeCans).fill({ id: 'free-coke', name: 'Free Coca-Cola', price: 0, quantity: 1 });
                updatedCart.push(...freeItems);
            }
            return item;
        });

        updatedCart = updatedCart.map((item) => {
            if (item.name === 'Croissant' && item.quantity >= 3) {
                const freeCoffees = Math.floor(item.quantity / 3);
                const freeItems = Array(freeCoffees).fill({ id: 'free-coffee', name: 'Free Coffee', price: 3, quantity: 1 });
                updatedCart.push(...freeItems);
            }
            return item;
        });

        return updatedCart;
    };

    const calculateTotals = (cart) => {
        let subtotal = 0;
        let discount = 0;

        const updatedCart = applyOffers(cart);

        updatedCart.forEach((item) => {
            if (item.name === 'Coca-Cola' && item.quantity >= 6) {
                const freeCans = Math.floor(item.quantity / 6);
                discount += freeCans * parseInt(item.price.replace(/\D/g, ""), 10);
            }
            if (item.name === 'Croissant' && item.quantity >= 3) {
                const freeCoffee = Math.floor(item.quantity / 3);
                discount += freeCoffee * 3;
            }
            subtotal += item.quantity * parseInt(item.price.replace(/\D/g, ""), 10);
        });

        setTotals({ subtotal, discount, total: subtotal - discount });
        setCart(updatedCart);
    };

    return (
        <div className="checkout-container">
            <Navbar /> {/* Add Navbar component here */}
            <h2>Checkout</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty. Add items to continue.</p>
            ) : (
                <>
                    <div className="cart-summary">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.img} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p>{item.name}</p>
                                    <p>Price: ${parseInt(item.price.replace(/\D/g, ""), 10)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                    <p>Total: ${(item.quantity * parseInt(item.price.replace(/\D/g, ""), 10)).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="totals">
                        <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
                        <p>Discount: -${totals.discount.toFixed(2)}</p>
                        <p>Total: ${totals.total.toFixed(2)}</p>
                    </div>
                </>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>
                Back to Products
            </button>
        </div>
    );
};

export default CheckoutPage;
