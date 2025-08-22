// The base URL for all API requests.
export const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000";

// ===== Frontend routes =====
export const ROUTES = {
  dashboard: "/",
  categories: "/categories",
  products: "/products",
  sales: "/sales",
  stockIn: "/stock-in",
  inventory: "/inventory",
  reports: "/reports",
};

// ===== Backend endpoints =====
export const ENDPOINTS = {
  root: "/",

  // Core resources
  categories: "/categories",
  products: "/products",
  sales: "/sales",
  stockIn: "/stock-in",
  inventoryMovements: "/inventory-movements",

  // Nested item lookups
  salesItems: "/sales/items",           // /sales/items/{sale_item_id}
  stockInItems: "/stock-in/items",      // /stock-in/items/{stock_in_item_id}

  // Reports
  reports: {
    productStock: "/reports/product-stock",
    profitability: "/reports/profitability",
    productStockSummary: "/reports/product-stock/summary",
    profitabilitySummary: "/reports/profitability/summary",
  },
};

// ===== Common query defaults =====
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// ===== Allowed list/filter params per collection =====
export const QUERY_PARAMS = {
  categories: ["page", "limit", "search"],
  products: ["page", "limit", "search", "category_id", "min_price", "max_price"],
  sales: ["page", "limit", "search", "payment_method", "start_date", "end_date"],
  stockIn: ["page", "limit", "search", "start_date", "end_date"],
  inventoryMovements: ["page", "limit", "product_id", "movement_type", "start_date", "end_date"],
  reportProductStock: ["page", "limit", "search", "productFilter"],
  reportProfitability: ["page", "limit", "search", "product_id", "start_date", "end_date"],
  reportProductStockSummary: ["needs_restock_only"],
  reportProfitabilitySummary: ["start_date", "end_date"],
};

// Enumerated values for payment methods.
export const PAYMENT_METHODS = Object.freeze({
  CASH: 'Cash',
  CARD: 'Card',
  QR: 'QR',
});

// Enumerated values for inventory movement types.
export const MOVEMENT_TYPES = Object.freeze({
  STOCK_IN: 'StockIn',
  SALE: 'Sale',
  OPENING: 'Opening',
});