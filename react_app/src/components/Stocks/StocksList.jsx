import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StocksInAPI } from "../../services/api";
import StockForm from "./StockForm";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function StocksList() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [editingStock, setEditingStock] = useState(null);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    
    const navigate = useNavigate();

    // Show success message for 3 seconds
    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    // Load stocks from API with filters
    const fetchStocks = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit,
            };
            if (search) params.search = search;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const data = await StocksInAPI.list(params);
            setStocks(data?.items || []);
            setTotalPages(data.total_pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            setError(e.message || "โหลดรายการสต็อกล้มเหลว");
            setStocks([]);
            setTotalPages(1);
            setTotal(0);
        }
        setLoading(false);
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            fetchStocks({ search, page: 1 });
        }, 400);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchStocks();
    }, [page, limit, startDate, endDate]);

    // Handlers
    const handleAdd = () => {
        setFormMode("create");
        setEditingStock(null);
        setShowForm(true);
    };

    const handleEdit = (stock) => {
        setFormMode("edit");
        setEditingStock(stock);
        setShowForm(true);
    };

    const handleDelete = async (stock) => {
        if (!window.confirm("ลบรายการสต็อกนี้ใช่หรือไม่?")) return;
        try {
            await StocksInAPI.remove(stock.stock_in_id);
            showSuccessMessage("ลบรายการสต็อกสำเร็จ");
            fetchStocks();
        } catch (e) {
            setError(e.message || "ลบรายการสต็อกล้มเหลว");
        }
    };

    const handleStockClick = (stock) => {
        navigate(`/stocks/${stock.stock_in_id}/items`);
    };

    const handleFormSubmit = async (formData) => {
        if (formMode === "create") {
            await StocksInAPI.create(formData);
            showSuccessMessage("เพิ่มรายการสต็อกสำเร็จ");
        } else if (formMode === "edit" && editingStock) {
            await StocksInAPI.update(editingStock.stock_in_id, formData);
            showSuccessMessage("แก้ไขรายการสต็อกสำเร็จ");
        }
        setShowForm(false);
        fetchStocks();
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };


    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('th-TH');
    };

    const formatCurrency = (amount) => {
        return `${amount} บาท`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">รายการสต็อก</h2>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAdd}
                >
                    เพิ่มรายการสต็อก
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {/* Filter & Search UI */}
            <div className="mb-4 flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-grow">
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full"
                        placeholder="ค้นหาด้วยโน้ตเพิ่มเติมหรือเลขที่อ้างอิง"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm">วันที่เริ่ม</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                    <label className="text-sm">วันที่สิ้นสุด</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                </div>
            </div>

            {error && <ErrorMessage message={error} />}

            {loading ? (
                <LoadingSpinner label="กำลังโหลดรายการสต็อก..." />
            ) : stocks.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    ยังไม่มีรายการสต็อก
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-4">
                    {stocks.map((stock) => (
                        <div 
                            key={stock.stock_in_id} 
                            className="border rounded shadow p-4 flex flex-col gap-2 bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => handleStockClick(stock)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">รายการสต็อก #{stock.stock_in_id}</h3>
                                <span className="text-sm text-gray-500">{formatDateTime(stock.stock_in_date)}</span>
                            </div>
                            
                            <div className="mb-2">
                                <p className="text-gray-700">ยอดรวม: <span className="font-medium text-green-600">{formatCurrency(stock.total_cost)}</span></p>
                                {stock.ref_no && (
                                    <p className="text-gray-700">เลขที่อ้างอิง: <span className="font-medium">{stock.ref_no}</span></p>
                                )}
                                {stock.notes && (
                                    <p className="text-gray-700">โน้ตเพิ่มเติม: <span className="font-medium">{stock.notes}</span></p>
                                )}
                            </div>
                            
                            <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleEdit(stock)}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleDelete(stock)}
                                >
                                    ลบ
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleStockClick(stock)}
                                >
                                    รายการสินค้า
                                </button>
                            </div>
                        </div>
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
                    หน้า {page} / {totalPages} (รวมทั้งหมด {total} รายการ)
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
                <StockForm
                    mode={formMode}
                    initialData={editingStock || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}