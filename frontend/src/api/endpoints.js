// Central place to store all backend routes

export const AUTH = {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    ME: "/auth/me",
  };
  
  export const USER = {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/update",
  };
  
  export const PRODUCT = {
    CREATE: "/product/post-lost-item",
    GET_ALL: "/product/retrieve-item-posts",
    DELETE: (id) => `/product/delete-item-post/${id}`,
    CLAIM: (id) => `/product/claim/${id}`,
  };
  
  export const ORDER = {
    CREATE: "/orders/create",
    GET_ALL: "/orders",
    GET_ONE: (id) => `/orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/update/${id}`,
  };
  
  export const DELIVERY = {
    GET_ALL: "/deliveries",
    UPDATE: (id) => `/deliveries/update/${id}`,
  };
  