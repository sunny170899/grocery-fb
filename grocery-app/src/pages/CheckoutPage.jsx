import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/shopping.css';

const CheckoutPage = () => {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        calculateTotals(cart);
        localStorage.setItem('cart', JSON.stringify(cart)); // Sync cart with localStorage
    }, [cart]);

    const handleAdd = (product) => {
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            if (existingProduct.quantity < product.available) {
                existingProduct.quantity += 1; // Increase quantity if stock is available
                setCart([...cart]);
            } else {
                alert('Stock limit reached for this product!');
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleSubtract = (productId) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId) {
                        const newQuantity = item.quantity - 1;
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                    }
                    return item;
                })
                .filter(Boolean) // Remove items with 0 quantity
        );
    };

    const getCartQuantity = (productId) => {
        const item = cart.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    };
    const calculateTotals = (cart) => {
        let subtotal = 0;
        let discount = 0;

        // Calculate subtotals and apply discounts
        cart.forEach((item) => {
            const itemTotal = item.quantity * parseInt(item.price.replace(/\D/g, ''), 10)/100;
            subtotal += itemTotal;

            // Discounts for Coca-Cola
            if (item.name === 'Coca-Cola' && item.quantity >= 6) {
                const freeCans = Math.floor(item.quantity / 6);
                discount += freeCans * parseInt(item.price.replace(/\D/g, ''), 10)/100;
            }

            // Discounts for Croissants
            if (item.name === 'Croissants' && item.quantity >= 3) {
                const freeCoffee = Math.floor(item.quantity / 3);
                discount += freeCoffee *  parseInt(item.price.replace(/\D/g, ''), 10)/100;
            }
        });

        setTotals({ subtotal, discount, total: subtotal - discount });
    };

    return (
        
        <div className="checkout-container">
            <Navbar />
            <h2>Checkout</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty. Add items to continue shopping.</p>
            ) : (
                <>
                    <div className="cart-summary">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.img} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p>{item.name}</p>
                                    <p>Price: €{parseInt(item.price.replace(/\D/g, ''), 10)/100}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleSubtract(item.id)}>-</button>
                                        <span>{getCartQuantity(item.id)}</span>
                                        <button onClick={() => handleAdd(item)}>+</button>
                                    </div>
                                    <p>
                                        Item Total: €
                                        {(item.quantity * parseInt(item.price.replace(/\D/g, ''), 10)/100).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="totals">
                        <p>Subtotal: €{totals.subtotal.toFixed(2)}</p>
                        <p>Discount: -€{totals.discount.toFixed(2)}</p>
                        <p>Total: €{totals.total.toFixed(2)}</p>
                    </div>
                </>
            )}
            <button className="back-button" onClick={() => navigate('/')}>
                Back to Products
            </button>
            {cart.length > 0 && (
                <button className="checkout-button" onClick={() => alert('Proceeding to Payment')}>
                    Proceed to Payment
                </button>
            )}
        </div>
    );
};

export default CheckoutPage;
