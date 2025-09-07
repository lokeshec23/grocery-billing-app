import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

// Lazy-loaded screens
const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));
const MyOrdersScreen = lazy(() => import("./screens/MyOrdersScreen"));
const ProductListScreen = lazy(() => import("./screens/ProductListScreen"));
const ProductAddScreen = lazy(() => import("./screens/ProductAddScreen"));
const ProductEditScreen = lazy(() => import("./screens/ProductEditScreen"));
const BillingScreen = lazy(() => import("./screens/BillingScreen"));
const InventoryScreen = lazy(() => import("./screens/InventoryScreen"));
const OrderListScreen = lazy(() => import("./screens/OrderListScreen"));
const ProductCatalogScreen = lazy(() =>
  import("./screens/ProductCatalogScreen")
);
const SupplierScreen = lazy(() => import("./screens/SupplierScreen"));
const PurchaseScreen = lazy(() => import("./screens/PurchaseScreen"));
const DiscountScreen = lazy(() => import("./screens/DiscountScreen"));
const StaffRegisterScreen = lazy(() => import("./screens/StaffRegisterScreen"));

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/login" element={<LoginScreen />} />

              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/my-orders" element={<MyOrdersScreen />} />
              <Route path="/billing" element={<BillingScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/products" element={<ProductListScreen />} />
              <Route path="/catalog" element={<ProductCatalogScreen />} />

              {/* Grouped Admin Routes */}
              <Route path="/admin">
                <Route path="product/add" element={<ProductAddScreen />} />
                <Route
                  path="product/:id/edit"
                  element={<ProductEditScreen />}
                />
                <Route path="sales-report" element={<OrderListScreen />} />
                <Route path="suppliers" element={<SupplierScreen />} />
                <Route path="purchases" element={<PurchaseScreen />} />
                <Route path="discounts" element={<DiscountScreen />} />
                <Route
                  path="register-staff"
                  element={<StaffRegisterScreen />}
                />
              </Route>
            </Routes>
          </Suspense>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
