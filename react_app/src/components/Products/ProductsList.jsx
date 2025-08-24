import { useEffect, useState } from "react";
import { ProductsAPI } from "../../services/api";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'
    const [editingProduct, setEditingProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [searchMode, setSearchMode] = useState("name"); // 'name' or 'id'
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Show success message for 3 seconds
    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    // Load products from API with filters
    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit,
            };
            if (search) {
                if (searchMode === "name") {
                    params.search = search;
                } else if (searchMode === "id") {
                    params.category_id = search;
                }
            }
            if (minPrice) params.min_price = minPrice;
            if (maxPrice) params.max_price = maxPrice;

            const data = await ProductsAPI.list(params);
            setProducts(data?.items || data || []);
            setTotalPages(data.total_pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            setError(e.message || "โหลดสินค้าล้มเหลว");
            setProducts([]);
            setTotalPages(1);
            setTotal(0);
        }
        setLoading(false);
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
        setPage(1);
        fetchProducts({ search, page: 1 });
        }, 400); // 400ms debounce

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [page, limit, searchMode, minPrice, maxPrice]);

    // Handlers
    const handleAdd = () => {
        setFormMode("create");
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product) => {
        setFormMode("edit");
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (product) => {
        if (!window.confirm("ลบสินค้านี้ใช่หรือไม่?")) return;
        try {
            await ProductsAPI.remove(product.product_id);
            showSuccessMessage("ลบสินค้าสำเร็จ");
            fetchProducts();
        } catch (e) {
            setError(e.message || "ลบสินค้าล้มเหลว");
        }
    };

    const handleFormSubmit = async (formData) => {
        if (formMode === "create") {
            await ProductsAPI.create(formData);
            showSuccessMessage("เพิ่มสินค้าสำเร็จ");
        } else if (formMode === "edit" && editingProduct) {
            await ProductsAPI.update(editingProduct.product_id, formData);
            showSuccessMessage("แก้ไขสินค้าสำเร็จ");
        }
        setShowForm(false);
        fetchProducts();
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleSearchModeToggle = () => {
        setSearchMode((prev) => (prev === "name" ? "id" : "name"));
        setSearch("");
        setPage(1);
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
        setPage(1);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">รายการสินค้า</h2>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAdd}
                >
                    เพิ่มสินค้า
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {/* Filter & Search UI */}
            <div className="mb-4 flex flex-col md:flex-row gap-2 md:items-end">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        placeholder={
                            searchMode === "name"
                                ? "ค้นหาด้วยชื่อหรือ SKU"
                                : "ค้นหาด้วยรหัสหมวดหมู่สินค้า"
                        }
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
                        onClick={handleSearchModeToggle}
                        type="button"
                    >
                        {searchMode === "name" ? "ค้นหาด้วยรหัสหมวดหมู่สินค้า" : "ค้นหาด้วยชื่อ"}
                    </button>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Min Price</label>
                    <input
                        type="number"
                        min="0"
                        className="border rounded px-2 py-1 w-24"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        placeholder="0"
                    />
                    <label className="text-sm">Max Price</label>
                    <input
                        type="number"
                        min="0"
                        className="border rounded px-2 py-1 w-24"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        placeholder="∞"
                    />
                </div>
            </div>

            {error && <ErrorMessage message={error} />}

            {loading ? (
                <LoadingSpinner label="กำลังโหลดสินค้า..." />
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    ยังไม่มีสินค้า
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                >
                    ก่อนหน้า
                </button>
                <span>
                    หน้า {page} / {totalPages} (รวมทั้งหมด {total} สินค้า)
                </span>
                <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    ถัดไป
                </button>
            </div>

            {showForm && (
                <ProductForm
                    mode={formMode}
                    initialData={editingProduct || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}