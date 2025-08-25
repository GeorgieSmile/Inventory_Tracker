import { useState, useEffect } from 'react';
import { ReportsAPI } from '../../services/api';
import VProductStockItem from './VProductStockItem';
import VProfitabilityItem from './VProfitabilityItem';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import KPICard from './KPICard'; 
import StockPieChart from './StockPieChart';
import ProfitBarChart from './ProfitBarChart';
import TopProfitableProducts from './TopProfitableProducts';

export default function Homepage() {
    // State for summary data
    const [stockSummary, setStockSummary] = useState(null);
    const [profitSummary, setProfitSummary] = useState(null);
    
    // Active table toggle
    const [activeTable, setActiveTable] = useState('stock'); // 'stock' or 'profit'
    
    // State for stock data
    const [stockData, setStockData] = useState([]);
    const [stockSearch, setStockSearch] = useState("");
    const [stockProductFilter, setStockProductFilter] = useState("");
    const [stockPage, setStockPage] = useState(1);
    const [stockTotalPages, setStockTotalPages] = useState(1);
    const [stockTotal, setStockTotal] = useState(0);
    const [stockLimit] = useState(10);
    
    // State for profit data
    const [profitData, setProfitData] = useState([]);
    const [profitStartDate, setProfitStartDate] = useState("");
    const [profitEndDate, setProfitEndDate] = useState("");
    const [profitPage, setProfitPage] = useState(1);
    const [profitTotalPages, setProfitTotalPages] = useState(1);
    const [profitTotal, setProfitTotal] = useState(0);
    const [profitLimit] = useState(10);
    
    // State for profit search
    const [profitSearchQuery, setProfitSearchQuery] = useState("");
    const [profitSearchMode, setProfitSearchMode] = useState('name'); // 'name' or 'id'

    // Loading states
    const [loadingStockSummary, setLoadingStockSummary] = useState(true);
    const [loadingProfitSummary, setLoadingProfitSummary] = useState(true);
    const [loadingStock, setLoadingStock] = useState(true);
    const [loadingProfit, setLoadingProfit] = useState(true);
    
    // Error states
    const [summaryError, setSummaryError] = useState("");
    const [stockError, setStockError] = useState("");
    const [profitError, setProfitError] = useState("");

    // Fetch summary data
    const fetchStockSummary = async () => {
        setLoadingStockSummary(true);
        setSummaryError("");
        try {
            const res = await ReportsAPI.getProductStockSummary();
            setStockSummary(res);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสรุปสต๊อก:', error);
            setSummaryError(error.message || "โหลดข้อมูลสรุปล้มเหลว");
        }
        setLoadingStockSummary(false);
    };

    const fetchProfitSummary = async () => {
        setLoadingProfitSummary(true);
        setSummaryError("");
        try {
        const params = {};
        if (profitStartDate) params.start_date = profitStartDate;
        if (profitEndDate) params.end_date = profitEndDate;
            const res = await ReportsAPI.getProfitabilitySummary(params);
            setProfitSummary(res);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสรุปกำไร:', error);
            setSummaryError(error.message || "โหลดข้อมูลสรุปกำไรล้มเหลว");
            setProfitSummary(null);
        }
        setLoadingProfitSummary(false);
    };


    // Fetch stock data
    const fetchStockData = async () => {
        setLoadingStock(true);
        setStockError("");
        try {
            const params = {
                page: stockPage,
                limit: stockLimit,
            };
            if (stockSearch) params.search = stockSearch;
            if (stockProductFilter) params.productFilter = stockProductFilter;

            const data = await ReportsAPI.getProductStock(params);
            setStockData(data?.items || data || []);
            setStockTotalPages(data.total_pages || 1);
            setStockTotal(data.total || 0);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลสต๊อก:', error);
            setStockError(error.message || "โหลดข้อมูลสต๊อกสินค้าล้มเหลว");
            setStockData([]);
            setStockTotalPages(1);
            setStockTotal(0);
        }
        setLoadingStock(false);
    };

    // Fetch profit data
    const fetchProfitData = async () => {
        setLoadingProfit(true);
        setProfitError("");
        try {
            const params = {
                page: profitPage,
                limit: profitLimit,
            };
            if (profitSearchQuery) {
                if (profitSearchMode === 'name') {
                    params.search = profitSearchQuery;
                } else {
                    params.product_id = profitSearchQuery;
                }
            }
            if (profitStartDate) params.start_date = profitStartDate;
            if (profitEndDate) params.end_date = profitEndDate;

            const data = await ReportsAPI.getProfitability(params);
            setProfitData(data?.items || data || []);
            setProfitTotalPages(data.total_pages || 1);
            setProfitTotal(data.total || 0);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลผลกำไร:', error);
            setProfitError(error.message || "โหลดข้อมูลผลกำไรล้มเหลว");
            setProfitData([]);
            setProfitTotalPages(1);
            setProfitTotal(0);
        }
        setLoadingProfit(false);
    };

    // Debounced search for stock
    useEffect(() => {
        const handler = setTimeout(() => {
            setStockPage(1);
            fetchStockData();
        }, 400);
        return () => clearTimeout(handler);
    }, [stockSearch, stockProductFilter]);
    
    // Debounced search for profit
    useEffect(() => {
        const handler = setTimeout(() => {
            setProfitPage(1);
            fetchProfitData();
        }, 400);
        return () => clearTimeout(handler);
    }, [profitSearchQuery, profitSearchMode, profitStartDate, profitEndDate]);

    // Re-fetch ONLY the profitability summary when date range changes (debounced)
    useEffect(() => {
        const t = setTimeout(() => {
            fetchProfitSummary();
        }, 300);
        return () => clearTimeout(t);
    }, [profitStartDate, profitEndDate])

    // Load summary data on mount
    useEffect(() => {
        fetchStockSummary();
        fetchProfitSummary();
    }, []);

    // Load stock data on page change
    useEffect(() => {
        fetchStockData();
    }, [stockPage, stockLimit]);

    // Load profit data on page change
    useEffect(() => {
        fetchProfitData();
    }, [profitPage, profitLimit]);

    // Format number helper
    const formatNumber = (num) => {
        const numericValue = parseFloat(num);
        if (isNaN(numericValue)) {
            return '0.00';
        }
        return numericValue.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleStockSearchChange = (e) => {
        setStockSearch(e.target.value);
    };
    
    const handleProfitQueryChange = (e) => {
        setProfitSearchQuery(e.target.value);
    };
    
    const handleToggleProfitSearchMode = () => {
        setProfitSearchMode(prevMode => (prevMode === 'name' ? 'id' : 'name'));
        setProfitSearchQuery(''); // Clear input when toggling
    };

    const handleStockProductFilterChange = (e) => {
        setStockProductFilter(e.target.value);
    };

    const handleProfitStartDateChange = (e) => {
        setProfitStartDate(e.target.value);
    };

    const handleProfitEndDateChange = (e) => {
        setProfitEndDate(e.target.value);
    };

    const handleStockPageChange = (newPage) => {
        if(newPage > 0 && newPage <= stockTotalPages) setStockPage(newPage);
    };

    const handleProfitPageChange = (newPage) => {
        if(newPage > 0 && newPage <= profitTotalPages) setProfitPage(newPage);
    };

    const generateKpiProfitSubTitle = (baseTitle, startDate, endDate) => {
        if (startDate && endDate) {
            // Case 1: Both start and end dates are selected
            return `${baseTitle} (ช่วง ${startDate} ถึง ${endDate})`;
        } else if (startDate) {
            // Case 2: Only start date is selected
            return `${baseTitle} (ตั้งแต่ ${startDate} จนถึงปัจจุบัน)`;
        } else if (endDate) {
            // Case 3: Only end date is selected
            return `${baseTitle} (ตั้งแต่เริ่มจนถึง ${endDate})`;
        }
        // Case 4: No dates are selected
        return `${baseTitle}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">หน้าหลัก</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="จำนวนสินค้าทั้งหมด"
                    value={`${stockSummary?.total_products} รายการ`}
                    subtitle={`มูลค่า ${formatNumber(stockSummary?.total_stock_value)} บาท`}
                    icon="📦"
                    color="blue"
                    loading={loadingStockSummary}
                />
                <KPICard
                    title="สินค้าที่ต้องเติมสต๊อก"
                    value={`${stockSummary?.products_needing_restock} รายการ`}
                    subtitle={`${stockSummary?.restock_percentage || 0}% ของทั้งหมด`}
                    icon="⚠️"
                    color="red"
                    loading={loadingStockSummary}
                />
                <KPICard
                    title='รายได้รวม'
                    value={`${formatNumber(profitSummary?.total_revenue)} บาท`}
                    subtitle={`จากยอดขาย ${profitSummary?.total_sales} รายการ ${generateKpiProfitSubTitle('', profitStartDate, profitEndDate)}`}
                    icon="💰"
                    color="green"
                    loading={loadingProfitSummary}
                />
                <KPICard
                    title='กำไรขั้นต้น'
                    value={`${formatNumber(profitSummary?.total_gross_profit)} บาท`}
                    subtitle={`Margin ${profitSummary?.average_profit_margin || 0}% ${generateKpiProfitSubTitle('', profitStartDate, profitEndDate)}`}
                    icon="📈"
                    color="purple"
                    loading={loadingProfitSummary}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* We only show the charts when the data is loaded */}
                {!loadingStockSummary && stockSummary ? (
                    <StockPieChart data={stockSummary} />
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm border h-80 flex items-center justify-center">
                        <LoadingSpinner label="กำลังโหลดข้อมูลสต๊อก..."/>
                    </div>
                )}
                {!loadingProfitSummary && profitSummary ? (
                    <ProfitBarChart data={profitSummary} />
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm border h-80 flex items-center justify-center">
                        <LoadingSpinner label="กำลังโหลดข้อมูลกำไร..."/>
                    </div>
                )}
            </div>

            
            {/* Top profitable products */}
            {!loadingProfitSummary && profitSummary && (
                <TopProfitableProducts products={profitSummary.top_profitable_products} />
            )}

            {summaryError && <ErrorMessage message={summaryError} />}

            <div className="flex space-x-2">
                <button
                    onClick={() => setActiveTable('stock')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTable === 'stock'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    📦 สต๊อกสินค้า
                </button>
                <button
                    onClick={() => setActiveTable('profit')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTable === 'profit'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    📈 ผลการขายและกำไร
                </button>
            </div>

            {activeTable === 'stock' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">📦 สต๊อกสินค้า</h3>
                        <span className="text-sm text-gray-500">รวม {formatNumber(stockTotal)} รายการ</span>
                    </div>
                    <div className="flex flex-row gap-4 items-end">
                        <div>
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 w-full max-w-xs"
                                placeholder="ค้นหาชื่อสินค้า"
                                value={stockSearch}
                                onChange={handleStockSearchChange}
                            />
                        </div>
                        <div>
                            <select
                                className="border rounded-lg px-3 py-2"
                                value={stockProductFilter}
                                onChange={handleStockProductFilterChange}
                            >
                                <option value="">สถานะสต๊อกทั้งหมด</option>
                                <option value="r">ต้องเติมสต๊อก</option>
                                <option value="nr">สต๊อกเพียงพอ</option>
                            </select>
                        </div>
                    </div>
                    {!loadingStock && stockData.length > 0 && (
                        <div className="border rounded-lg bg-gray-50 p-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-4">สินค้า</div>
                                <div className="col-span-2">สถานะ</div>
                                <div className="col-span-1">คงเหลือ</div>
                                <div className="col-span-1">จุดสั่งซื้อ</div>
                                <div className="col-span-3 text-right">มูลค่า</div>
                            </div>
                        </div>
                    )}
                    {stockError && <ErrorMessage message={stockError} />}
                    {loadingStock ? (
                        <LoadingSpinner label="กำลังโหลดข้อมูลสต๊อกสินค้า..." />
                    ) : stockData.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                            ไม่พบข้อมูลสต๊อกสินค้าตามเงื่อนไขที่ระบุ
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {stockData.map((stockItem) => (
                                <VProductStockItem 
                                    key={stockItem.product_id} 
                                    stockItem={stockItem} 
                                />
                            ))}
                        </div>
                    )}
                    {!loadingStock && stockData.length > 0 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleStockPageChange(stockPage - 1)}
                                disabled={stockPage <= 1}
                            >
                                ก่อนหน้า
                            </button>
                            <span className="text-sm">
                                หน้า {stockPage} / {stockTotalPages} (รวมทั้งหมด {formatNumber(stockTotal)} รายการ)
                            </span>
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleStockPageChange(stockPage + 1)}
                                disabled={stockPage >= stockTotalPages}
                            >
                                ถัดไป
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTable === 'profit' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">📈 ผลการขายและกำไร</h3>
                        <span className="text-sm text-gray-500">รวม {formatNumber(profitTotal)} รายการ</span>
                    </div>
                    <div className="flex flex-row gap-4 items-end">
                        <div className="relative">
                            <input
                                type={profitSearchMode === 'name' ? 'text' : 'number'}
                                className="border rounded-lg px-3 py-2 w-full max-w-xs pr-10"
                                placeholder={profitSearchMode === 'name' ? 'ค้นหาชื่อสินค้า...' : 'ค้นหา Product ID...'}
                                value={profitSearchQuery}
                                onChange={handleProfitQueryChange}
                            />
                            <button
                                onClick={handleToggleProfitSearchMode}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                                title="สลับระหว่างการค้นหาด้วยชื่อและ ID"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <label className="text-sm">วันที่เริ่ม</label>
                            <input
                                type="date"
                                className="border rounded-lg px-2 py-2"
                                value={profitStartDate}
                                onChange={handleProfitStartDateChange}
                            />
                            <label className="text-sm">วันที่สิ้นสุด</label>
                            <input
                                type="date"
                                className="border rounded-lg px-2 py-2"
                                value={profitEndDate}
                                onChange={handleProfitEndDateChange}
                            />
                        </div>
                    </div>
                    {!loadingProfit && profitData.length > 0 && (
                        <div className="border rounded-lg bg-gray-50 p-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                <div className="col-span-1 text-center">ID</div>
                                <div className="col-span-3">สินค้า</div>
                                <div className="col-span-2 text-right">รายได้</div>
                                <div className="col-span-2 text-right">ต้นทุน</div>
                                <div className="col-span-2 text-right">กำไร</div>
                                <div className="col-span-2 text-right">วันที่</div>
                            </div>
                        </div>
                    )}
                    {profitError && <ErrorMessage message={profitError} />}
                    {loadingProfit ? (
                        <LoadingSpinner label="กำลังโหลดข้อมูลผลกำไร..." />
                    ) : profitData.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                            ไม่พบข้อมูลผลการขายตามเงื่อนไขที่ระบุ
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {profitData.map((profitItem) => (
                                <VProfitabilityItem 
                                    key={profitItem.sale_item_id} 
                                    profitabilityItem={profitItem} 
                                />
                            ))}
                        </div>
                    )}
                    {!loadingProfit && profitData.length > 0 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleProfitPageChange(profitPage - 1)}
                                disabled={profitPage <= 1}
                            >
                                ก่อนหน้า
                            </button>
                            <span className="text-sm">
                                หน้า {profitPage} / {profitTotalPages} (รวมทั้งหมด {formatNumber(profitTotal)} รายการ)
                            </span>
                            <button
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleProfitPageChange(profitPage + 1)}
                                disabled={profitPage >= profitTotalPages}
                            >
                                ถัดไป
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}