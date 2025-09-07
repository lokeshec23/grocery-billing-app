import axios from "axios";

// Create a new axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default api;
