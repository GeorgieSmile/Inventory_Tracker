import { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';
import ErrorMessage from '../ErrorMessage';

export default function StockForm({ onSubmit, onCancel, initialData = {}, mode = 'create' }) {
    const getCurrentDateTimeLocalString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    const [form, setForm] = useState({
        stock_in_date: initialData.stock_in_date || getCurrentDateTimeLocalString(),
        ref_no: initialData.ref_no || '',
        notes: initialData.notes || '',
        items: initialData.items || [] 
    });
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load products for dropdown
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await ProductsAPI.list({ limit: 100 });
            setProducts(response.items || []);
        } catch (err) {
            setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const addItem = () => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, {
                product_id: '',
                quantity: 1,
                unit_cost: ''
            }]
        }));
    };

    const updateItem = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const removeItem = (index) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                stock_in_date: form.stock_in_date,
                ref_no: form.ref_no || null,
                notes: form.notes || null,
                items: form.items
                    .filter(item => item.product_id)
                    .map(item => ({
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity),
                        unit_cost: Number(item.unit_cost) || 0 
                    }))
            };
            await onSubmit(payload);
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสต็อก');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'edit' ? 'แก้ไขรายการรับเข้าสต็อก' : 'สร้างรายการรับเข้าสต็อก'}
                </h2>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Stock Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">วันที่รับเข้า</label>
                            <input
                                type="datetime-local"
                                name="stock_in_date"
                                value={form.stock_in_date}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">เลขที่อ้างอิง <span className="text-gray-400">(ไม่บังคับ)</span></label>
                            <input
                                type="text"
                                name="ref_no"
                                value={form.ref_no}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">โน้ตเพิ่มเติม <span className="text-gray-400">(ไม่บังคับ)</span></label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            rows="2"
                            disabled={loading}
                        />
                    </div>

                    {/* Stock Items - Only show when creating */}
                    {mode === 'create' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-medium">รายการสินค้า</label>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
                                    disabled={loading}
                                >
                                    เพิ่มสินค้า
                                </button>
                            </div>

                            {form.items.map((item, index) => (
                                <div key={index} className="border rounded p-3 mb-2">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">สินค้า</label>
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">เลือกสินค้า</option>
                                                {products.map(product => (
                                                    <option key={product.product_id} value={product.product_id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">จำนวน</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                min="1"
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">ราคาต้นทุนต่อหน่วย</label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={item.unit_cost}
                                                onChange={(e) => updateItem(index, 'unit_cost', e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                min="0"
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="w-full px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                                                disabled={loading}
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {form.items.length === 0 && (
                                <p className="text-gray-500 text-sm">ยังไม่มีรายการสินค้า (สามารถสร้างรายการขายว่างได้)</p>
                            )}
                        </div>
                    )}

                    {/* Form Actions */}
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
        </div>
    );
}