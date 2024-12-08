import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import Logout from './components/Logout'; // Import Logout component

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/logout" element={<Logout />} /> {/* Add Logout route */}
          </Routes>
      </Router>
  );
}

export default App;
