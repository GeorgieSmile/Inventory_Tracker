import { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';
import ErrorMessage from '../ErrorMessage';

export default function SaleForm({ onSubmit, onCancel, initialData = {}, mode = 'create' }) {
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
        sale_datetime: initialData.sale_datetime || getCurrentDateTimeLocalString(),
        payment_method: initialData.payment_method || 'Cash',
        notes: initialData.notes || '',
        items: []
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
                unit_price: '',
                discount: 0
            }]
        }));
    };

    const updateItem = (index, field, value) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item, [field]: value };
                    
                    // Auto-set price when product changes
                    if (field === 'product_id' && value) {
                        const product = products.find(p => p.product_id == value);
                        if (product) {
                            updatedItem.unit_price = product.price;
                        }
                    }
                    
                    return updatedItem;
                }
                return item;
            })
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
                sale_datetime: form.sale_datetime,
                payment_method: form.payment_method,
                notes: form.notes || null,
                items: form.items
                    .filter(item => item.product_id)
                    .map(item => ({
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity),
                        unit_price: item.unit_price ? Number(item.unit_price) : null,
                        discount: Number(item.discount) || 0
                    }))
            };
            await onSubmit(payload);
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'edit' ? 'แก้ไขรายการขาย' : 'เพิ่มรายการขาย'}
                </h2>

                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">วันที่ขาย</label>
                            <input
                                type="datetime-local"
                                name="sale_datetime"
                                value={form.sale_datetime}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">วิธีการชำระเงิน</label>
                            <select
                                name="payment_method"
                                value={form.payment_method}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                                disabled={loading}
                            >
                                <option value="Cash">เงินสด</option>
                                <option value="Card">บัตรเครดิต</option>
                                <option value="QR">QR Code</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">โน้ตเพิ่มเติม <span className="text-gray-400">(ไม่บังคับ)</span></label>
                        <input
                            type="text"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="เว้นว่างได้"
                            disabled={loading}
                        />
                    </div>

                    {/* Sale Items - Only show when creating */}
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
                                            <label className="block mb-1 text-sm font-medium">ราคาต่อหน่วย</label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                min="0"
                                                required
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">ส่วนลด</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.discount}
                                                onChange={(e) => updateItem(index, 'discount', e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                min="0"
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