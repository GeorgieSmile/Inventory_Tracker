import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { SalesAPI, SaleItemsAPI } from "../../services/api";
import SaleItem from "./SaleItem";
import SaleItemForm from "./SaleItemForm";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function SaleItemsList() {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
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
  const pmText = (m) => ({ Cash: "เงินสด", Card: "บัตรเครดิต", QR: "QR Code" }[m] || m);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const s = await SalesAPI.getById(saleId); // GET /sales/{sale_id}
      setSale(s);

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
  }, [saleId]);

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
    if (!window.confirm(`ลบรายการสินค้า #${it.sale_item_id} ใช่หรือไม่?`)) return;
    try {
      await SaleItemsAPI.remove(saleId, it.sale_item_id);
      showSuccessMessage("ลบรายการสินค้าแล้ว");
      fetchData();
    } catch (e) {
      setError(e.message || "ลบรายการสินค้าล้มเหลว");
    }
  };

  const onSubmitForm = async (payload) => {
    try {
      if (mode === "create") {
        await SaleItemsAPI.create(saleId, payload);
        showSuccessMessage("เพิ่มรายการสินค้าแล้ว");
      } else if (mode === "edit" && editingItem) {
        await SaleItemsAPI.update(saleId, editingItem.sale_item_id, payload);
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

  if (!sale) {
    return (
      <div className="space-y-4">
        <ErrorMessage message="ไม่พบบิลขาย" />
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
        <h2 className="text-lg font-semibold">รายการสินค้าในบิลขาย #{sale.sale_id}</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-gray-200" onClick={() => navigate("/sales")}>
            กลับไปยังรายการขาย
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

      {/* Sale summary */}
      <div className="border rounded p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-gray-500">วันที่เวลา: </span>
            <span className="font-medium">{formatTH(sale.sale_datetime)}</span>
          </div>
          <div>
            <span className="text-gray-500">วิธีการชำระ: </span>
            <span className="font-medium">{pmText(sale.payment_method)}</span>
          </div>
          <div>
            <span className="text-gray-500">ยอดรวม: </span>
            <span className="font-medium text-green-600">{money(sale.total_amount)}</span>
          </div>
          {sale.notes && (
            <div className="md:col-span-3">
              <span className="text-gray-500">หมายเหตุ: </span>
              <span className="font-medium">{sale.notes}</span>
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
            <SaleItem key={it.sale_item_id} saleItem={it} onEdit={openEdit} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <SaleItemForm
          mode={mode}
          initialData={editingItem || {}}
          onSubmit={onSubmitForm}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
