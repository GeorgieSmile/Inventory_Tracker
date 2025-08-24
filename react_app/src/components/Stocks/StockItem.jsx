import { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';

export default function StockItem({ stockItem, onDelete, onEdit }) {
    const [productName, setProductName] = useState("");
    const totalPrice = (stockItem.quantity * stockItem.unit_cost);

    useEffect(() => {
        const fetchProductName = async () => {
            try {
                const product = await ProductsAPI.getById(stockItem.product_id);
                setProductName(product.name || `Product #${stockItem.product_id}`);
            }
            catch (error) {
                console.error("เกิดข้อผิดพลาดในการหาชื่อสินค้า:", error);
            }
        }
        fetchProductName();

    }, [stockItem.product_id]);

    return (
        <div className="border rounded shadow p-4 flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    {productName}
                </h3>
                <span className="text-sm text-gray-500">#{stockItem.stock_in_id}</span>
            </div>
            
            <div className="mb-2">
                <p className="text-gray-700">จำนวน: <span className="font-medium">{stockItem.quantity} ชิ้น</span></p>
                <p className="text-gray-700">ราคาต้นทุนต่อหน่วย: <span className="font-medium">{stockItem.unit_cost} บาท</span></p>
                <p className="text-gray-700">ราคารวม: <span className="font-medium text-green-600">{totalPrice} บาท</span></p>
            </div>
            
            <div className="flex gap-2 mt-2">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => onEdit(stockItem)}
                >
                    แก้ไข
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => onDelete(stockItem)}
                >
                    ลบ
                </button>
            </div>
        </div>
    );
}