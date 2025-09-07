import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      {" "}
      {/* Wrap the App with UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
