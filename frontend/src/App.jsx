import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductAddScreen from "./screens/ProductAddScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import BillingScreen from "./screens/BillingScreen";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/admin/product/add" element={<ProductAddScreen />} />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditScreen />}
            />
            <Route path="/products" element={<ProductListScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/billing" element={<BillingScreen />} />
            <Route path="/" element={<HomeScreen />} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
