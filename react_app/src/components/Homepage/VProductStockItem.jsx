export default function VProductStockItem({ stockItem }) {
    // Format number with commas for better readability
    const formatNumber = (num) => num.toLocaleString();

    // Get stock status display
    const getStockStatus = (needsRestock, stockOnHand, reorderLevel) => {
        if (needsRestock) {
            return { 
                text: 'ต้องเติมสต๊อก', 
                color: 'text-red-600 bg-red-50 border-red-200',
                icon: '⚠️'
            };
        } else if (stockOnHand <= reorderLevel * 1.2) {
            return { 
                text: 'ใกล้หมด', 
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                icon: '⚡'
            };
        } else {
            return { 
                text: 'ปกติ', 
                color: 'text-green-600 bg-green-50 border-green-200',
                icon: '✅'
            };
        }
    };

    // Calculate stock value
    const stockValue = stockItem.stock_on_hand * stockItem.price;
    
    const stockStatus = getStockStatus(
        stockItem.needs_restock, 
        stockItem.stock_on_hand, 
        stockItem.reorder_level
    );

    return (
        <div className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 items-center">
                {/* Product ID */}
                <div className="col-span-1">
                    <span className="text-sm text-gray-500">#{stockItem.product_id}</span>
                </div>

                {/* Product Name */}
                <div className="col-span-4">
                    <h3 className="font-medium text-gray-900 truncate" title={stockItem.name}>
                        {stockItem.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                        ราคา: {formatNumber(stockItem.price)} บาท
                    </span>
                </div>

                {/* Stock Status */}
                <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                        {stockStatus.icon} {stockStatus.text}
                    </span>
                </div>

                {/* Stock on Hand */}
                <div className="col-span-1">
                    <div className="text-center">
                        <span className="text-lg font-bold text-gray-900">
                            {formatNumber(stockItem.stock_on_hand)}
                        </span>
                        <div className="text-xs text-gray-500">หน่วย</div>
                    </div>
                </div>

                {/* Reorder Level */}
                <div className="col-span-1">
                    <div className="text-center">
                        <span className="text-sm text-gray-700">
                            {formatNumber(stockItem.reorder_level)}
                        </span>
                        <div className="text-xs text-gray-500">หน่วย</div>
                    </div>
                </div>

                {/* Stock Value */}
                <div className="col-span-3 text-right">
                    <div>
                        <span className="text-lg font-semibold text-gray-900">
                            {formatNumber(stockValue)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">บาท</span>
                    </div>
                </div>
            </div>

            {/* Additional Info Row (when stock needs attention) */}
            {stockItem.needs_restock && (
                <div className="border-t bg-red-50 px-4 py-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-red-700">
                            ⚠️ สต๊อกต่ำกว่าจุดสั่งซื้อ แนะนำให้เติมสต๊อก
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}