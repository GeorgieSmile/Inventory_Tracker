export default function VProfitabilityItem({ profitabilityItem }) {
    // Format number with commas for better readability
    const formatNumber = (num) => {
        const numericValue = parseFloat(num);
        if (isNaN(numericValue)) {
            return '0.00';
        }
        return numericValue.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };
    
    // Format date
    const formatDate = (d) => new Date(d).toLocaleString("th-TH");

    // Calculate profit margin percentage
    const profitMargin = profitabilityItem.total_revenue > 0 
        ? (profitabilityItem.gross_profit / profitabilityItem.total_revenue) * 100 
        : 0;

    return (
        <div className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 items-center">
                {/* Sale Item ID */}
                <div className="col-span-1 text-center">
                    <span className="text-sm text-gray-500">#{profitabilityItem.sale_item_id}</span>
                    <div className="text-xs text-gray-400">Sale #{profitabilityItem.sale_id}</div>
                </div>

                {/* Product Name & Quantity */}
                <div className="col-span-3">
                    <h3 className="font-medium text-gray-900 truncate" title={profitabilityItem.product_name}>
                        {profitabilityItem.product_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>ID: {profitabilityItem.product_id}</span>
                        <span>•</span>
                        <span className="font-medium text-blue-600">จำนวน: {formatNumber(profitabilityItem.quantity)} หน่วย</span>
                    </div>
                </div>

                {/* Revenue */}
                <div className="col-span-2 text-right">
                    <span className="text-md font-semibold text-green-600">
                        {formatNumber(profitabilityItem.total_revenue)} บาท
                    </span>
                    <div className="text-xs text-gray-400">
                        ({formatNumber(profitabilityItem.unit_price)}/หน่วย)
                        {profitabilityItem.discount > 0 && (
                                <span className="text-red-500 ml-1">-{profitabilityItem.discount * 100}%</span>
                        )}
                    </div>
                    
                </div>

                {/* COGS */}
                <div className="col-span-2 text-right">
                    <span className="text-md font-medium text-red-600">
                        {formatNumber(profitabilityItem.total_cogs.toFixed(2))} บาท
                    </span>
                    <div className="text-xs text-gray-400">
                        ({formatNumber(profitabilityItem.average_cost_at_sale.toFixed(2))}/หน่วย)
                    </div>
                </div>

                {/* Gross Profit */}
                <div className="col-span-2 text-right">
                    <span className={`text-lg font-bold ${
                        profitabilityItem.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {profitabilityItem.gross_profit >= 0 ? '+' : ''}{formatNumber(profitabilityItem.gross_profit.toFixed(2))}
                    </span>
                    <div className="text-xs font-medium text-gray-700">
                        {profitMargin.toFixed(2)}% margin
                    </div>
                </div>

                {/* Sale Date */}
                <div className="col-span-2 text-right">
                    <span className="text-sm text-gray-700">
                        {formatDate(profitabilityItem.sale_datetime)}
                    </span>
                </div>
            </div>
        </div>
    );
}