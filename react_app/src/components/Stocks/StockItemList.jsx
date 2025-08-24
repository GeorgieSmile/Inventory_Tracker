import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StocksInAPI, StockInItemsAPI } from "../../services/api";
import StockItem from "./StockItem";
import StockItemForm from "./StockItemForm";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function StockItemsList() {
  const { stockInId } = useParams();
  const navigate = useNavigate();

  const [stockIn, setStockIn] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [editingItem, setEditingItem] = useState(null);

  const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
  };

  const formatTH = (d) => new Date(d).toLocaleString("th-TH");
  const money = (n) => `${Number(n ?? 0)} บาท`;

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await StocksInAPI.getById(stockInId); // GET /stocks_in/{stock_in_id}
      setStockIn(s);

      let list = (Array.isArray(s?.items) && s.items) || [];
        
      setItems(list);
    } catch (e) {
      setError(e.message || "โหลดข้อมูลบิลขายล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stockInId]);

  // CRUD handlers
  const openCreate = () => {
    setMode("create");
    setEditingItem(null);
    setShowForm(true);
  };

  const openEdit = (it) => {
    setMode("edit");
    setEditingItem(it);
    setShowForm(true);
  };

  const onDelete = async (it) => {
    if (!window.confirm(`ลบรายการสินค้า #${it.stock_in_item_id} ใช่หรือไม่?`)) return;
    try {
      await StockInItemsAPI.remove(stockInId, it.stock_in_item_id);
      showSuccessMessage("ลบรายการสินค้าแล้ว");
      fetchData();
    } catch (e) {
      setError(e.message || "ลบรายการสินค้าล้มเหลว");
    }
  };

  const onSubmitForm = async (payload) => {
    try {
      if (mode === "create") {
        await StockInItemsAPI.create(stockInId, payload);
        showSuccessMessage("เพิ่มรายการสินค้าแล้ว");
      } else if (mode === "edit" && editingItem) {
        await StockInItemsAPI.update(stockInId, editingItem.stock_in_item_id, payload);
        showSuccessMessage("แก้ไขรายการสินค้าแล้ว");
      }
      setShowForm(false);
      fetchData();
    } catch (e) {
      setError(e.message || "บันทึกรายการสินค้าล้มเหลว");
    }
  };

  if (loading) return <LoadingSpinner label="กำลังโหลดข้อมูลบิลขาย..." />;
  if (error) return <ErrorMessage message={error} />;

  if (!stockIn) {
    return (
      <div className="space-y-4">
        <ErrorMessage message="ไม่พบบิลรับสินค้า" />
        <button className="px-3 py-2 rounded bg-gray-200" onClick={() => navigate(-1)}>
          กลับ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">รายการสินค้าในบิลรับสินค้า #{stockIn.stock_in_id}</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-gray-200" onClick={() => navigate("/stocks")}>
            กลับไปยังรายการรับสินค้า
          </button>
          <button className="px-3 py-2 rounded bg-green-500 text-white" onClick={openCreate}>
            เพิ่มสินค้าในบิลนี้
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Stock summary */}
      <div className="border rounded p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-gray-500">วันที่เวลา: </span>
            <span className="font-medium">{formatTH(stockIn.stock_in_date)}</span>
          </div>
          <div>
            <span className="text-gray-500">ยอดรวม: </span>
            <span className="font-medium text-green-600">{money(stockIn.total_cost)}</span>
          </div>
          {stockIn.ref_no && (
            <div className="md:col-span-3">
              <span className="text-gray-500">เลขที่อ้างอิง: </span>
              <span className="font-medium">{stockIn.ref_no}</span>
            </div>
          )}
          {stockIn.notes && (
            <div className="md:col-span-3">
              <span className="text-gray-500">โน้ตเพิ่มเติม: </span>
              <span className="font-medium">{stockIn.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
          ยังไม่มีรายการสินค้าในบิลนี้
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <StockItem key={it.stock_in_item_id} stockItem={it} onEdit={openEdit} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <StockItemForm
          mode={mode}
          initialData={editingItem || {}}
          onSubmit={onSubmitForm}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
