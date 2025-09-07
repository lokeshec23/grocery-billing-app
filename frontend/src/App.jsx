import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductAddScreen from "./screens/ProductAddScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import BillingScreen from "./screens/BillingScreen";
import InventoryScreen from "./screens/InventoryScreen";
import OrderListScreen from "./screens/OrderListScreen";
import ProductCatalogScreen from "./screens/ProductCatalogScreen";
import SupplierScreen from "./screens/SupplierScreen";
import PurchaseScreen from "./screens/PurchaseScreen";
import DiscountScreen from "./screens/DiscountScreen";
import StaffRegisterScreen from "./screens/StaffRegisterScreen";

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
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/my-orders" element={<MyOrdersScreen />} />
            <Route path="/billing" element={<BillingScreen />} />
            <Route path="/inventory" element={<InventoryScreen />} />
            <Route path="/admin/sales-report" element={<OrderListScreen />} />
            <Route path="/admin/suppliers" element={<SupplierScreen />} />
            <Route path="/admin/purchases" element={<PurchaseScreen />} />
            <Route path="/admin/discounts" element={<DiscountScreen />} />
            <Route
              path="/admin/register-staff"
              element={<StaffRegisterScreen />}
            />
            <Route path="/catalog" element={<ProductCatalogScreen />} />
            <Route path="/" element={<HomeScreen />} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
