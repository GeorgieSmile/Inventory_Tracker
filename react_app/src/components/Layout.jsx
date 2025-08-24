import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold">
            IR
          </div>
          <h1 className="text-base font-semibold">Inventory & Retail</h1>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 p-4">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="rounded-xl border bg-white p-3">
            <ul className="space-y-2">
              <li><NavLink to="/" className={linkClass}>Dashboard</NavLink></li>
              <li><NavLink to="/categories" className={linkClass}>Categories</NavLink></li>
              <li><NavLink to="/products" className={linkClass}>Products</NavLink></li>
              <li><NavLink to="/sales" className={linkClass}>Sales</NavLink></li>
              <li><NavLink to="/stocks" className={linkClass}>Stock</NavLink></li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="rounded-xl border bg-white p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
