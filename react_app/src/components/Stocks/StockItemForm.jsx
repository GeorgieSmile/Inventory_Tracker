import { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';
import ErrorMessage from '../ErrorMessage';

export default function StockItemForm({ onSubmit, onCancel, initialData = {}, mode = 'create' }) {
    const [form, setForm] = useState({
        product_id: initialData.product_id || '',
        quantity: initialData.quantity || 1,
        unit_cost: initialData.unit_cost || '',
    });
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            product_id: Number(form.product_id),
            quantity: Number(form.quantity),
            unit_cost: Number(form.unit_cost)
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
                    {mode === 'edit' ? 'แก้ไขรายการสต็อก' : 'เพิ่มรายการสต็อก'}
                </h2>

                {/* Error Message */}
                {error && <ErrorMessage message={error} />}

                <div>
                    <label className="block mb-1 font-medium">ค้นหาสินค้า</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full border rounded px-3 py-2 mb-2"
                        placeholder="พิมพ์ชื่อสินค้าหรือ SKU"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">สินค้า</label>
                    <select
                        name="product_id"
                        value={form.product_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                        disabled={loading}
                    >
                        <option value="">เลือกสินค้า</option>
                        {filteredProducts.map(product => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.name} {product.sku && ` (${product.sku})`}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">จำนวน</label>
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        min="1"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">ราคาต้นทุนต่อหน่วย</label>
                    <input
                        type="number"
                        step="0.01"
                        name="unit_cost"
                        value={form.unit_cost}
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