import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // Replace with your actual base URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Allow cookies to be sent with requests
});

// Ensure Authorization token is included
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }, { withCredentials: true }),
};

export const stocks = {
  getAll: () => api.get('/stocks'),
  buy: (userId: string, stockId: string, quantity: number) =>
    api.post('/trades/buy', { userId, stockId, quantity }),
  sell: (userId: string, stockId: string, quantity: number) =>
    api.post('/trades/sell', { userId, stockId, quantity }),
  getPortfolio: (userId: string) => api.get(`/portfolio/${userId}`),
};
