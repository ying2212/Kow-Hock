export const AUTH = {
  SEND_OTP: "/api/users/send-otp",
  VERIFY_OTP: "/api/users/verify-otp",
  ME: "/api/users/me",
};

export const USER = {
  PROFILE: "/api/users/me",
};

export const PRODUCT = {
  GET_ALL: "/api/products",
  GET_ONE: (id) => `/api/products/${id}`,
  CREATE: "/api/products",
  UPDATE: (id) => `/api/products/${id}`,
  DELETE: (id) => `/api/products/${id}`,
};

export const ORDER = {
  CREATE: "/api/orders",
  GET_ALL: "/api/orders",
  GET_ONE: (id) => `/api/orders/${id}`,
  UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
};

export const DELIVERY = {
  GET_ALL: "/api/deliveries",
  CREATE: "/api/deliveries",
  UPDATE_STATUS: (id) => `/api/deliveries/${id}/status`,
};

export const DRIVER = {
  GET_ALL: "/api/drivers",
  CREATE: "/api/drivers",
};