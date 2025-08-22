import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CategoriesList from "./components/Categories/CategoriesList";

function Placeholder({ title }) {
  return <div className="text-sm text-gray-600">{title} (coming soon)</div>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/products" element={<Placeholder title="Products" />} />
        <Route path="/sales" element={<Placeholder title="Sales" />} />
      </Route>
    </Routes>
  );
}