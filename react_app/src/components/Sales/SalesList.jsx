import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SalesAPI } from "../../services/api";
import SaleForm from "./SaleForm";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function SalesList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [editingSale, setEditingSale] = useState(null);
    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
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

    // Load sales from API with filters
    const fetchSales = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit,
            };
            if (search) params.search = search;
            if (paymentMethod) params.payment_method = paymentMethod;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const data = await SalesAPI.list(params);
            setSales(data?.items || data || []);
            setTotalPages(data.total_pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            setError(e.message || "โหลดรายการขายล้มเหลว");
            setSales([]);
            setTotalPages(1);
            setTotal(0);
        }
        setLoading(false);
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            fetchSales({ search, page: 1 });
        }, 400);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchSales();
    }, [page, limit, paymentMethod, startDate, endDate]);

    // Handlers
    const handleAdd = () => {
        setFormMode("create");
        setEditingSale(null);
        setShowForm(true);
    };

    const handleEdit = (sale) => {
        setFormMode("edit");
        setEditingSale(sale);
        setShowForm(true);
    };

    const handleDelete = async (sale) => {
        if (!window.confirm("ลบรายการขายนี้ใช่หรือไม่?")) return;
        try {
            await SalesAPI.remove(sale.sale_id);
            showSuccessMessage("ลบรายการขายสำเร็จ");
            fetchSales();
        } catch (e) {
            setError(e.message || "ลบรายการขายล้มเหลว");
        }
    };

    const handleSaleClick = (sale) => {
        navigate(`/sales/${sale.sale_id}/items`);
    };

    const handleFormSubmit = async (formData) => {
        if (formMode === "create") {
            await SalesAPI.create(formData);
            showSuccessMessage("เพิ่มรายการขายสำเร็จ");
        } else if (formMode === "edit" && editingSale) {
            await SalesAPI.update(editingSale.sale_id, formData);
            showSuccessMessage("แก้ไขรายการขายสำเร็จ");
        }
        setShowForm(false);
        fetchSales();
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
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

    const getPaymentMethodText = (method) => {
        const methodMap = {
            'Cash': 'เงินสด',
            'Card': 'บัตรเครดิต',
            'QR': 'QR Code'
        };
        return methodMap[method] || method;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">รายการขาย</h2>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAdd}
                >
                    เพิ่มรายการขาย
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
                <div>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        placeholder="ค้นหาด้วยโน้ตเพิ่มเติม"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div>
                    <select
                        className="border rounded px-3 py-2"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                    >
                        <option value="">วิธีการชำระทั้งหมด</option>
                        <option value="Cash">เงินสด</option>
                        <option value="Card">บัตรเครดิต</option>
                        <option value="QR">QR Code</option>
                    </select>
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
                <LoadingSpinner label="กำลังโหลดรายการขาย..." />
            ) : sales.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    ยังไม่มีรายการขาย
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-4">
                    {sales.map((sale) => (
                        <div 
                            key={sale.sale_id} 
                            className="border rounded shadow p-4 flex flex-col gap-2 bg-white cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSaleClick(sale)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">รายการขาย #{sale.sale_id}</h3>
                                <span className="text-sm text-gray-500">{formatDateTime(sale.sale_datetime)}</span>
                            </div>
                            
                            <div className="mb-2">
                                <p className="text-gray-700">ยอดรวม: <span className="font-medium text-green-600">{formatCurrency(sale.total_amount)}</span></p>
                                <p className="text-gray-700">วิธีการชำระ: <span className="font-medium">{getPaymentMethodText(sale.payment_method)}</span></p>
                                {sale.notes && (
                                    <p className="text-gray-700">โน้ตเพิ่มเติม: <span className="font-medium">{sale.notes}</span></p>
                                )}
                            </div>
                            
                            <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleEdit(sale)}
                                >
                                    แก้ไข
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleDelete(sale)}
                                >
                                    ลบ
                                </button>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    onClick={() => handleSaleClick(sale)}
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
                <SaleForm
                    mode={formMode}
                    initialData={editingSale || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}