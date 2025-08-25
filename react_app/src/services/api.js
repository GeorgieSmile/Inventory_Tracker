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

// ================================== STOCK IN ==================================

export const StocksInAPI = {
  /** GET /stock-in/ */
  list: async (params = {}) => {
    try {
      return await unwrap(api.get(coll(ENDPOINTS.stockIn), { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET /stock-in/{stock_in_id} */
  getById: async (stock_in_id) => {
    try {
      return await unwrap(api.get(item(ENDPOINTS.stockIn, stock_in_id)));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /stock-in/ */
  create: async (payload /* { stock_in_datetime, ref_no, note, items } */) => {
    try {
      return await unwrap(api.post(coll(ENDPOINTS.stockIn), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PATCH /stock-in/{stock_in_id} */
  update: async (stock_in_id, payload /* { stock_in_datetime, ref_no,note } */) => {
    try {
      return await unwrap(api.patch(item(ENDPOINTS.stockIn, stock_in_id), payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /stock-in/{stock_in_id} */
  remove: async (stock_in_id) => {
    try {
      return await unwrap(api.delete(item(ENDPOINTS.stockIn, stock_in_id)));
    } catch (e) {
      handleError(e);
    }
  },
};

// ================================== STOCK IN ITEMS==================================

export const StockInItemsAPI = {
  /** GET /stock-in/items/{stock_in_item_id} - Get Stock In Item by ID */
  getById: async (stock_in_item_id) => {
    try {
      return await unwrap(api.get(`${ENDPOINTS.stockInItems}/${stock_in_item_id}`));
    } catch (e) {
      handleError(e);
    }
  },

  /** POST /stock-in/{stock_in_id}/items - Add Stock In Item */
  create: async (stock_in_id, payload /* { product_id, quantity, price } */) => {
    try {
      return await unwrap(api.post(`${ENDPOINTS.stockIn}/${stock_in_id}/items`, payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** PATCH /stock-in/{stock_in_id}/items/{item_id} - Update Stock In Item */
  update: async (stock_in_id, item_id, payload /* { product_id, quantity, price } */) => {
    try {
      return await unwrap(api.patch(`${ENDPOINTS.stockIn}/${stock_in_id}/items/${item_id}`, payload));
    } catch (e) {
      handleError(e);
    }
  },

  /** DELETE /stock-in/{stock_in_id}/items/{item_id} - Delete Stock In Item */
  remove: async (stock_in_id, item_id) => {
    try {
      return await unwrap(api.delete(`${ENDPOINTS.stockIn}/${stock_in_id}/items/${item_id}`));
    } catch (e) {
      handleError(e);
    }
  },
};

// ================================== INVENTORY MOVEMENTS ==================================

export const InventoryMovementsAPI = {
  /** GET /inventory-movements/ */
  list: async (params = {}) => {
    try {
      return await unwrap(api.get(coll(ENDPOINTS.inventoryMovements), { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET /inventory-movements/{movement_id} */
  getById: async (movement_id) => {
    try {
      return await unwrap(api.get(item(ENDPOINTS.inventoryMovements, movement_id)));
    } catch (e) {
      handleError(e);
    }
  },

};

// ================================== REPORTS ==================================

export const ReportsAPI = {

  /** GET reports/product-stock */
  getProductStock: async (params = {}) => {
    try {
      return await unwrap(api.get(ENDPOINTS.reports.productStock, { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET reports/profitability */
  getProfitability: async (params = {}) => {
    try {
      return await unwrap(api.get(ENDPOINTS.reports.profitability, { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET reports/product-stock/summary */
  getProductStockSummary: async (params = {}) => {
    try {
      return await unwrap(api.get(ENDPOINTS.reports.productStockSummary, { params }));
    } catch (e) {
      handleError(e);
    }
  },

  /** GET reports/profitability/summary */
  getProfitabilitySummary: async (params = {}) => {
    try {
      return await unwrap(api.get(ENDPOINTS.reports.profitabilitySummary, { params }));
    } catch (e) {
      handleError(e);
    }
  }

}

export default api;