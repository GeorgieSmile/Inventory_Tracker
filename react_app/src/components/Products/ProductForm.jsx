import {useState} from 'react';
import ErrorMessage from '../ErrorMessage';

export default function ProductForm({ onSubmit, onCancel, initialData = {}, mode = 'create' }) {
    const [form, setForm] = useState({
        name: initialData.name || '',
        category_id: initialData.category?.category_id || '',
        price: initialData.price || '',
        sku: initialData.sku || '',
        reorder_level: initialData.reorder_level || '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            ...form,
            price: form.price ? Number(form.price) : 0,
            reorder_level: form.reorder_level ? Number(form.reorder_level) : 10,
            category_id: form.category_id ? Number(form.category_id) : null,
            sku: form.sku || null,
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <form
                className="bg-white p-6 rounded shadow-lg w-full max-w-md flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-semibold mb-2">
                    {mode === 'edit' ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
                </h2>

                {/* Error Message */}
                {error && <ErrorMessage message={error} />}

                <div>
                    <label className="block mb-1 font-medium">ชื่อสินค้า</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">ID หมวดหมู่สินค้า <span className="text-gray-400">(ไม่บังคับ)</span></label>
                    <input
                        type="text"
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="เว้นว่างได้"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">ราคา</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        step="0.01"
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">SKU <span className="text-gray-400">(ไม่บังคับ)</span></label>
                    <input
                        type="text"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="เว้นว่างได้"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">จำนวนขั้นต่ำของสินค้า</label>
                    <input
                        type="number"
                        name="reorder_level"
                        value={form.reorder_level}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'กำลังบันทึก...' : (mode === 'edit' ? 'บันทึก' : 'เพิ่ม')}
                    </button>
                </div>
            </form>
        </div>
    );
}