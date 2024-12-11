import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SearchPage from './pages/SearchPage'; // This will be rendered first
import CheckoutPage from './pages/CheckoutPage';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Change the default route ("/") to render SearchPage */}
        <Route path="/" element={<SearchPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
