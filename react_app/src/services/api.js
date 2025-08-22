import axios from 'axios';
import { BASE_URL, ENDPOINTS } from "./constant";

// ---- Axios instance ----
const api = axios.create({
  baseURL: BASE_URL?.replace(/\/+$/, ""), // strip trailing slash just in case
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ---- Small utils ----
const unwrap = (p) => p.then((r) => r.data);
const coll = (base) => (base.endsWith("/") ? base : base + "/"); // ensure trailing slash for collections
const item = (base, id) => `${base.replace(/\/+$/, "")}/${id}`;
const handleError = (error) => {
  const message = error?.response?.data?.detail || error?.message || "Request failed";
  console.error("API error:", message);
  throw new Error(message);
};

// ================================== CATEGORIES ==================================
export const CategoriesAPI = {
  /** GET /categories/ */
  list: async (params = {}) => {
  try {
    return await unwrap(api.get(coll(ENDPOINTS.categories), { params }));
  } catch (e) {
    handleError(e);
  }
},

  /** GET /categories/{category_id} */
  getById: async (category_id) => {
    try {
      return await unwrap(api.get(item(ENDPOINTS.categories, category_id)));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /categories/ */
  create: async (payload /* { name } */) => {
    try {
      return await unwrap(api.post(coll(ENDPOINTS.categories), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PUT /categories/{category_id} */
  update: async (category_id, payload /* { name } */) => {
    try {
      return await unwrap(api.put(item(ENDPOINTS.categories, category_id), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /categories/{category_id} */
  remove: async (category_id) => {
    try {
      return await unwrap(api.delete(item(ENDPOINTS.categories, category_id)));
    } catch (e) {
      handleError(e);
    }
  },
};

export default api;