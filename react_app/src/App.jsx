import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CategoriesList from "./components/Categories/CategoriesList";
import ProductsList from "./components/Products/ProductsList";
import SalesList from "./components/Sales/SalesList";
import SaleItemsList from "./components/Sales/SaleItemList";
import StockList from "./components/Stocks/StocksList";
import StockItemsList from "./components/Stocks/StockItemList";
import IvMvList from "./components/Inventory-Movements/IvMvList";
import Homepage from "./components/Homepage/Homepage";

function Placeholder({ title }) {
  return <div className="text-sm text-gray-600">{title} (coming soon)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/:saleId/items" element={<SaleItemsList />} />
        <Route path="/stocks" element={<StockList />} />
        <Route path="/stocks/:stockInId/items" element={<StockItemsList />} />
        <Route path="/inventory-movements" element={<IvMvList />} />
      </Route>
    </Routes>
  );
}