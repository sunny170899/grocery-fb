import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Searchbar from '../components/Searchbar'; // Import the Navbar component
import '../styles/shopping.css';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
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
        fetchProducts();
    }, [category]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            updateCartOnServer(user.email, cart);
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Sync cart to localStorage
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

    const updateCartOnServer = async (email, cartData) => {
        try {
            await axios.post('http://localhost:5000/cart', { email, cart: cartData });
        } catch (error) {
            console.error('Error updating cart on server:', error);
        }
    };

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

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isInCart = (productId) => cart.some((item) => item.id === productId);

    const getCartQuantity = (productId) => {
        const item = cart.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    };
    
    return (
        <div className="shopping-container">
            
            <Searchbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cart={cart}
                setCart={setCart}
                user={JSON.parse(localStorage.getItem('user'))}
                
            />
            <div className="category-selector">
                <button onClick={() => setCategory('all')}>All items</button>
                <button onClick={() => setCategory('drinks')}>Drinks</button>
                <button onClick={() => setCategory('fruit')}>Fruit</button>
                <button onClick={() => setCategory('bakery')}>Bakery</button>
            </div>
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <img src={product.img} alt={product.name} className="product-image" />
                        <p>Price: {product.price}</p>
                        <p>
                            {product.available-getCartQuantity(product.id) >= 10
                                ? 'Available'
                                : `Stock: ${product.available-getCartQuantity(product.id)}`}
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
                ))}
            </div>
           
        </div>
    );
};

export default SearchPage;