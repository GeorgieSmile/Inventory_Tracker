import { useEffect, useState } from "react";
import { InventoryMovementsAPI } from "../../services/api";
import IvMvItem from "./IvMvItem";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function IvMvList() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [movementType, setMovementType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Load movements from API with filters
    const fetchMovements = async () => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page,
                limit,
            };
            if (search) params.product_id = search;
            if (movementType) params.movement_type = movementType;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            console.log('API call params:', params); // Debug log to see what's being sent

            const data = await InventoryMovementsAPI.list(params);
            
            console.log('API response:', data); // Debug log to see what's returned
            
            setMovements(data?.items || data || []);
            setTotalPages(data.total_pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            setError(e.message || "โหลดรายการเคลื่อนไหวสต๊อกล้มเหลว");
            setMovements([]);
            setTotalPages(1);
            setTotal(0);
        }
        setLoading(false);
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1);
            fetchMovements();
        }, 400);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        fetchMovements();
    }, [page, limit, movementType, startDate, endDate]);

    // Handlers
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleMovementTypeChange = (e) => {
        setMovementType(e.target.value);
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">รายการเคลื่อนไหว</h2>
            </div>

            {/* Filter & Search UI */}
            <div className="mb-4 flex flex-col md:flex-row gap-2 md:items-end">
                <div>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full max-w-xs"
                        placeholder="ค้นหาด้วย ID สินค้า"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div>
                    <select
                        className="border rounded px-3 py-2"
                        value={movementType}
                        onChange={handleMovementTypeChange}
                    >
                        <option value="">ประเภทการเคลื่อนไหวทั้งหมด</option>
                        <option value="SALE">ขาย</option>
                        <option value="OPENING">สต๊อกเปิด</option>
                        <option value="STOCK_IN">เพิ่มสต๊อก</option>
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

            {/* Table Header */}
            {!loading && movements.length > 0 && (
                <div className="border rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-3">สินค้า</div>
                        <div className="col-span-2">ประเภท</div>
                        <div className="col-span-1">จำนวน</div>
                        <div className="col-span-1">อ้างอิง</div>
                        <div className="col-span-2">ราคา</div>
                        <div className="col-span-2">วันที่</div>
                    </div>
                </div>
            )}

            {error && <ErrorMessage message={error} />}

            {loading ? (
                <LoadingSpinner label="กำลังโหลดรายการเคลื่อนไหว..." />
            ) : movements.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                    ยังไม่มีรายการเคลื่อนไหวสต๊อก
                </div>
            ) : (
                <div className="space-y-2">
                    {movements.map((movement) => (
                        <IvMvItem
                            key={movement.movement_id}
                            movementItem={movement}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && movements.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        ก่อนหน้า
                    </button>
                    <span className="text-sm">
                        หน้า {page} / {totalPages} (รวมทั้งหมด {total} รายการ)
                    </span>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        ถัดไป
                    </button>
                </div>
            )}

            {/* Summary Statistics */}
            {!loading && movements.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">สถิติรายการเคลื่อนไหวในหน้าปัจจุบัน</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700">รายการขาย: </span>
                            <span className="font-medium">
                                {movements.filter(m => m.movement_type === 'SALE').length}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700">สต๊อกเปิด: </span>
                            <span className="font-medium">
                                {movements.filter(m => m.movement_type === 'OPENING').length}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700">เพิ่มสต๊อก: </span>
                            <span className="font-medium">
                                {movements.filter(m => m.movement_type === 'STOCK_IN').length}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}