import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to format large numbers for the Y-axis (e.g., 1000 -> 1k)
const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    return tickItem;
};

// Custom tooltip for better display of currency
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        // Formats a number to a string with commas and two decimal places.
        const formatCurrency = (value) => 
            new Intl.NumberFormat('th-TH', { 
                style: 'currency', 
                currency: 'THB',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value).replace('฿', ''); // Remove the currency symbol for a cleaner look

        return (
            <div className="bg-white p-3 border rounded-lg shadow-sm text-sm">
                <p className="font-semibold mb-2">
                    {payload[0].payload.name}
                </p>
                <div className="space-y-1">
                    <p style={{ color: payload[0].color }}>
                        {`${payload[0].name}: ${formatCurrency(payload[0].value)} บาท`}
                    </p>
                    <p style={{ color: payload[1].color }}>
                        {`${payload[1].name}: ${formatCurrency(payload[1].value)} บาท`}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};


export default function ProfitBarChart({ data }) {
    const chartData = [
        {
            name: 'สรุปผลประกอบการ',
            'รายได้': data?.total_revenue || 0,
            'ต้นทุนขาย': data?.total_cogs || 0, 
        },
    ];

    const hasData = chartData.some(d => d['รายได้'] > 0 || d['ต้นทุนขาย'] > 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border h-80 flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-4 flex-shrink-0">เปรียบเทียบรายได้และต้นทุน</h3>
            <div className="flex-grow w-full h-full">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={false} width={40} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} />
                            <Legend iconType="circle" verticalAlign="bottom" />
                            <Bar dataKey="รายได้" fill="#22C55E" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="ต้นทุนขาย" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        ไม่มีข้อมูลผลประกอบการ
                    </div>
                )}
            </div>
        </div>
    );
}