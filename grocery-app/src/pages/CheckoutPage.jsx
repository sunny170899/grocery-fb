import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Searchbar from '../components/Searchbar';
import '../styles/shopping.css';

const CheckoutPage = () => {
    const [products, setProducts] = useState([]); // Stores all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Stores products based on search query
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
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

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=${category}`
            );
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch products when the category changes
    useEffect(() => {
        fetchProducts();
    }, [category]);

    // Filter products based on search query
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts([]); // Show no products if search is empty
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered); // Update filtered products
        }
    }, [searchQuery, products]);

    const isInCart = (productId) => cart.some((item) => item.id === productId);

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
            <Searchbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cart={cart}
                setCart={setCart}
                user={JSON.parse(localStorage.getItem('user'))}
            />

            {/* Display products only if there are filtered products */}
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <img src={product.img} alt={product.name} className="product-image" />
                            <p>Price: {product.price}</p>
                            <p>
                                {product.available - getCartQuantity(product.id) >= 10
                                    ? 'Available'
                                    : `Stock: ${product.available - getCartQuantity(product.id)}`}
                            </p>
                            {isInCart(product.id) ? (
                                <div className="quantity-controls">
                                    <button onClick={() => handleSubtract(product.id)}>-</button>
                                    <span>{getCartQuantity(product.id)}</span>
                                    <button onClick={() => handleAdd(product)}>+</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleAdd(product)}
                                    disabled={product.available === 0}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>You can add more products.</p>
                )}
            </div>

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
                                    {/* <p>Price: €{parseInt(item.price.replace(/\D/g, ''), 10)/100}</p> */}
                                    <div className="quantity-controls">
                                        <button onClick={() => handleSubtract(item.id)}>-</button>
                                        <span>{getCartQuantity(item.id)}</span>
                                        <button onClick={() => handleAdd(item)}>+</button>
                                    </div>
                                    <p>
                                        €
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
