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

// ================================== PRODUCTS ==================================

export const ProductsAPI = {
  /** GET /products/ */
  list: async (params = {}) => {
    try {
      return await unwrap(api.get(coll(ENDPOINTS.products), { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET /products/{product_id} */
  getById: async (product_id) => {
    try {
      return await unwrap(api.get(item(ENDPOINTS.products, product_id)));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /products/ */
  create: async (payload /* { name, category_id, SKU, price, reorder_level } */) => {
    try {
      return await unwrap(api.post(coll(ENDPOINTS.products), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PATCH /products/{product_id} */
  update: async (product_id, payload /* { name, category_id, SKU, price, reorder_level } */) => {
    try {
      return await unwrap(api.patch(item(ENDPOINTS.products, product_id), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /products/{product_id} */
  remove: async (product_id) => {
    try {
      return await unwrap(api.delete(item(ENDPOINTS.products, product_id)));
    } catch (e) {
      handleError(e);
    }
  },
};

// ================================== SALES ==================================

export const SalesAPI = {
  /** GET /sales/ */
  list: async (params = {}) => {
    try {
      return await unwrap(api.get(coll(ENDPOINTS.sales), { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET /sales/{sale_id} */
  getById: async (sale_id) => {
    try {
      return await unwrap(api.get(item(ENDPOINTS.sales, sale_id)));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /sales/ */
  create: async (payload /* { sale_datetime, payment_method, note, items } */) => {
    try {
      return await unwrap(api.post(coll(ENDPOINTS.sales), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PATCH /sales/{sale_id} */
  update: async (sale_id, payload /* { sale_datetime, payment_method, note } */) => {
    try {
      return await unwrap(api.patch(item(ENDPOINTS.sales, sale_id), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /sales/{sale_id} */
  remove: async (sale_id) => {
    try {
      return await unwrap(api.delete(item(ENDPOINTS.sales, sale_id)));
    } catch (e) {
      handleError(e);
    }
  },
};

// ================================== SALE ITEMS ==================================

export const SaleItemsAPI = {
  /** GET /sales/items/{sale_item_id} - Get Sale Item by ID */
  getById: async (sale_item_id) => {
    try {
      return await unwrap(api.get(`${ENDPOINTS.salesItems}/${sale_item_id}`));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /sales/{sale_id}/items - Add Sale Item */
  create: async (sale_id, payload /* { product_id, quantity, price } */) => {
    try {
      return await unwrap(api.post(`${ENDPOINTS.sales}/${sale_id}/items`, payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PATCH /sales/{sale_id}/items/{item_id} - Update Sale Item */
  update: async (sale_id, item_id, payload /* { product_id, quantity, price } */) => {
    try {
      return await unwrap(api.patch(`${ENDPOINTS.sales}/${sale_id}/items/${item_id}`, payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /sales/{sale_id}/items/{item_id} - Delete Sale Item */
  remove: async (sale_id, item_id) => {
    try {
      return await unwrap(api.delete(`${ENDPOINTS.sales}/${sale_id}/items/${item_id}`));
    } catch (e) {
      handleError(e);
    }
  },
};

export default api;