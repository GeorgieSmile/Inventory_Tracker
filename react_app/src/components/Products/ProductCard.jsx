export default function ProductCard({ product, onDelete, onEdit }) {
    const categoryText =
        product.category && product.category.category_id && product.category.name
            ? `${product.category.category_id}-${product.category.name}`
            : "";

    return (
        <div className="product-card border rounded shadow p-4 flex flex-col gap-2 bg-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span className="text-sm text-gray-500">#{product.product_id}</span>
            </div>
            <div className="mb-2">
                <p className="text-gray-700">หมวดหมู่สินค้า: <span className="font-medium">{categoryText}</span></p>
                <p className="text-gray-700">ราคา: <span className="font-medium">{product.price} บาท</span></p>
                <p className="text-gray-700">SKU: <span className="font-medium">{product.sku || ""}</span></p>
                <p className="text-gray-700">จำนวนขั้นต่ำของสินค้า: <span className="font-medium">{product.reorder_level}</span></p>
            </div>
            <div className="flex gap-2 mt-2">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => onEdit(product)}
                >
                    แก้ไข
                </button>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => onDelete(product)}
                >
                    ลบ
                </button>
            </div>
        </div>
    );
}