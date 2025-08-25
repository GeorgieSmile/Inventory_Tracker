const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value).replace('฿', '');
};

// Medals for the top 3 ranks
const MEDALS = ['🥇', '🥈', '🥉'];

export default function TopProfitableProducts({ products }) {
    // Ensure we only work with an array and limit to the top 3
    const productList = Array.isArray(products) ? products.slice(0, 3) : [];

    if (productList.length === 0) {
        return null; // Don't render anything if there are no products
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">🏆 สินค้าทำกำไรสูงสุด</h3>
            <div className="space-y-3">
                {productList.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                            <span className="text-xl w-8 text-center">{MEDALS[index] || '•'}</span>
                            <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                        <span className="font-semibold text-green-600">
                            {formatCurrency(product.total_profit)} บาท
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}