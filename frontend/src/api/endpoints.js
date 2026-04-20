import api from "./axios";

// ===== AUTH =====
export const sendOtp = (data) => api.post("/api/users/send-otp", data);
export const verifyOtp = (data) => api.post("/api/users/verify-otp", data);
export const getMe = () => api.get("/api/users/me");

// ===== USER =====
export const getProfile = () => api.get("/api/users/me");

// ===== PRODUCT =====
export const getAllProducts = () => api.get("/api/products");
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (data) => api.post("/api/products", data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// ===== ORDER =====
export const createOrder = (data) => api.post("/api/orders", data);
export const getAllOrders = () => api.get("/api/orders");
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const updateOrderStatus = (id, data) =>
  api.patch(`/api/orders/${id}/status`, data);

// ===== DELIVERY =====
export const getAllDeliveries = () => api.get("/api/deliveries");
export const createDelivery = (data) => api.post("/api/deliveries", data);
export const updateDeliveryStatus = (id, data) =>
  api.patch(`/api/deliveries/${id}/status`, data); 

// ===== DRIVER =====
export const getAllDrivers = () => api.get("/api/drivers");
export const createDriver = (data) => api.post("/api/drivers", data);

// ==== STORE =====
export const getAllStores = () => api.get("/api/stores");
export const getStoreById = (id) => api.get(`/api/stores/${id}`);
export const createStore = (data) => api.post("/api/stores", data);
export const updateStore = (id, data) => api.put(`/api/stores/${id}`, data);

// ===== FUEL =====
export const getAllFuels = () => api.get("/api/fuels");
export const getFuelsByDriver = (driverId) => api.get(`/api/fuels/driver/${driverId}`);
export const createFuel = (data) => api.post("/api/fuels", data);
export const updateFuel = (id, data) => api.put(`/api/fuels/${id}`, data);
export const deleteFuel = (id) => api.delete(`/api/fuels/${id}`);
