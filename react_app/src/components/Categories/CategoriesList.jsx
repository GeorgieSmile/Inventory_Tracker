import { useEffect, useState } from "react";
import { CategoriesAPI } from "../../services/api";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";
import CategoryForm from "./CategoryForm";
import CategoryUpdateForm from "./CategoryUpdateForm";
import CategoryItem from "./CategoryItem";

export default function CategoriesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      load({ search, page: 1 });
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [search]);

  const load = async (params = {}) => {
    try {
      setError("");
      setLoading(true);
      const data = await CategoriesAPI.list({
        search: params.search ?? search,
        page: params.page ?? page,
        limit: params.limit ?? limit,
      });
      setItems(data.items || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการโหลดหมวดหมู่สินค้า");
      setItems([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit]);

  const handleCreate = async (payload) => {
    try {
      setCreating(true);
      await CategoriesAPI.create(payload);
      setPage(1);
      await load({ page: 1 });
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการสร้างหมวดหมู่สินค้า");
    } finally {
      setCreating(false);
    }
  };

  const handleEditId = (id) => setEditingId(id);

  const handleUpdate = async (payload) => {
    try {
      setUpdating(true);
      await CategoriesAPI.update(editingId, payload);
      await load();
      setEditingId(null);
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่สินค้า");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await CategoriesAPI.remove(id);
      await load();
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาดในการลบหมวดหมู่สินค้า");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">หมวดหมู่สินค้า</h2>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="ค้นหาชื่อหมวดหมู่สินค้า"
            value={search}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <CategoryForm onCreate={handleCreate} pending={creating} />

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner label="กำลังโหลดหมวดหมู่สินค้า..." />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
          ยังไม่มีหมวดหมู่สินค้า
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((c) =>
            editingId === c.category_id ? (
              <CategoryUpdateForm
                key={c.category_id}
                initial={c}
                onUpdate={handleUpdate}
                pending={updating}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <CategoryItem
                key={c.category_id}
                category={c}
                onEdit={handleEditId}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          หน้า {page} จาก {totalPages} ({total} หมวดหมู่สินค้า)
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            ก่อนหน้า
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
