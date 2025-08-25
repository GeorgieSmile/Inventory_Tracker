import { useState, useEffect } from 'react';
import { ProductsAPI } from '../../services/api';

export default function IvMvItem({ movementItem }) {
    const [productName, setProductName] = useState("");

    useEffect(() => {
        const fetchProductName = async () => {
            try {
                const product = await ProductsAPI.getById(movementItem.product_id);
                setProductName(product.name || `Product #${movementItem.product_id}`);
            }
            catch (error) {
                console.error("เกิดข้อผิดพลาดในการหาชื่อสินค้า:", error);
                setProductName(`Product #${movementItem.product_id}`);
            }
        }
        fetchProductName();
    }, [movementItem.product_id]);

    // Format date
    const formatDate = (d) => new Date(d).toLocaleString("th-TH");

    // Get movement type display
    const getMovementTypeDisplay = (type) => {
        switch(type) {
            case 'SALE': return { text: 'ขาย', color: 'text-red-600 bg-red-50' };
            case 'OPENING': return { text: 'สต๊อกเปิด', color: 'text-blue-600 bg-blue-50' };
            case 'STOCK_IN': return { text: 'เพิ่มสต๊อก', color: 'text-green-600 bg-green-50' };
            default: return { text: type, color: 'text-gray-600 bg-gray-50' };
        }
    };

    const movementType = getMovementTypeDisplay(movementItem.movement_type);
    const isNegativeQuantity = movementItem.quantity < 0;

    return (
        <div className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="grid grid-cols-12 gap-4 p-4 items-center">
                {/* Movement ID */}
                <div className="col-span-1">
                    <span className="text-sm text-gray-500">#{movementItem.movement_id}</span>
                </div>

                {/* Product Name */}
                <div className="col-span-3">
                    <h3 className="font-medium text-gray-900 truncate" title={productName}>
                        {productName}
                    </h3>
                    <span className="text-xs text-gray-500">ID: {movementItem.product_id}</span>
                </div>

                {/* Movement Type  */}
                <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${movementType.color}`}>
                        {movementType.text}
                    </span>
                </div>

                {/* Quantity */}
                <div className="col-span-1">
                    <span className={`font-medium ${isNegativeQuantity ? 'text-red-600' : 'text-green-600'}`}>
                        {movementItem.quantity > 0 ? '+' : ''}{movementItem.quantity}
                    </span>
                </div>

                {/* Reference ID  */}
                <div className="col-span-1">
                    {(movementItem.movement_type === 'OPENING' || movementItem.movement_type === 'STOCK_IN') ? (
                        <div>
                            <span className="text-sm text-gray-700">#{movementItem.stock_in_item_id || 'N/A'}</span>
                            <div className="text-xs text-gray-500">Stock In ID</div>
                        </div>
                    ) : movementItem.movement_type === 'SALE' ? (
                        <div>
                            <span className="text-sm text-gray-700">#{movementItem.sale_item_id || 'N/A'}</span>
                            <div className="text-xs text-gray-500">Sale Item ID</div>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">-</span>
                    )}
                </div>

                {/* Unit Price/Cost */}
                <div className="col-span-2">
                    {(movementItem.movement_type === 'OPENING' || movementItem.movement_type === 'STOCK_IN') && movementItem.unit_cost ? (
                        <div>
                            <span className="text-sm text-gray-700">{movementItem.unit_cost.toLocaleString()} บาท</span>
                            <div className="text-xs text-gray-500">ต้นทุน/หน่วย</div>
                        </div>
                    ) : movementItem.movement_type === 'SALE' && movementItem.sale_price ? (
                        <div>
                            <span className="text-sm text-gray-700">{movementItem.sale_price.toLocaleString()} บาท</span>
                            <div className="text-xs text-gray-500">ราคาขาย/หน่วย</div>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">-</span>
                    )}
                </div>

                {/* Date */}
                <div className="col-span-2">
                    <span className="text-sm text-gray-700">{formatDate(movementItem.movement_date)}</span>
                </div>
            </div>
        </div>
    );
}