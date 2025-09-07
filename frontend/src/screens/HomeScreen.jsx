import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import AdminDashboard from "../dashboard/AdminDashboard";
import StaffDashboard from "../dashboard/StaffDashboard";
import CustomerDashboard from "../dashboard/CustomerDashboard";

const HomeScreen = () => {
  const { state } = useContext(UserContext);
  const { user } = state;

  if (user) {
    if (user.role === "admin") {
      return <AdminDashboard />;
    } else if (user.role === "staff") {
      return <StaffDashboard />;
    } else if (user.role === "customer") {
      return <CustomerDashboard />;
    }
  }

  // Fallback for non-logged-in users
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="text-center">Welcome to the Grocery Billing System</h1>
    </div>
  );
};

export default HomeScreen;
