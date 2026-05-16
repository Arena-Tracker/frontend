// src/config/api.config.js
export const API_URLS = {
  BASE: import.meta.env.VITE_API_URL,
  USERS: import.meta.env.VITE_USERS_SERVICE_URL,
  COURT: import.meta.env.VITE_COURT_SERVICE_URL,
  PAYMENTS: import.meta.env.VITE_PAYMENT_SERVICE_URL,
  SECURITY: import.meta.env.VITE_SECURITY_SERVICE_URL,
  BOOKING: import.meta.env.VITE_BOOKING_SERVICE_URL,
};
