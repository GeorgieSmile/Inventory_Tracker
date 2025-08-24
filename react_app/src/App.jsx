import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CategoriesList from "./components/Categories/CategoriesList";
import ProductsList from "./components/Products/ProductsList";
import SalesList from "./components/Sales/SalesList";
import SaleItemsList from "./components/Sales/SaleItemList";

function Placeholder({ title }) {
  return <div className="text-sm text-gray-600">{title} (coming soon)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/sales/:saleId/items" element={<SaleItemsList />} />
        <Route path="/sales" element={<SalesList />} />
      </Route>
    </Routes>
  );
}