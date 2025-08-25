import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the colors
const COLORS = ['#FF8042', '#01abfaff'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded-lg shadow-sm">
                <p className="font-semibold">{`${payload[0].name}`}</p>
                <p className="text-sm">{`จำนวน: ${payload[0].value} รายการ`}</p>
            </div>
        );
    }
    return null;
};

export default function StockPieChart({ data }) {
    const chartData = [
        { name: 'สินค้าต้องเติมสต๊อก', value: data?.products_needing_restock || 0 },
        { name: 'สินค้าสต๊อกเพียงพอ', value: (data?.total_products || 0) - (data?.products_needing_restock || 0) },
    ];

    
    const hasData = chartData.some(item => item.value > 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border h-80 flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-4 flex-shrink-0">สรุปสถานะสต๊อกสินค้า</h3>
            <div className="flex-grow w-full h-full">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        ไม่มีข้อมูลสต๊อก
                    </div>
                )}
            </div>
        </div>
    );
}