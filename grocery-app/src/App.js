import { HashRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Fallback for undefined routes */}
        <Route path="*" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
