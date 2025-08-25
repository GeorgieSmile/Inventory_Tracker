export default function KPICard({ title, value, subtitle, icon, color = "blue", loading = false }) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="animate-pulse">
                    {/* Placeholder for Title */}
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    {/* Placeholder for Value */}
                    <div className="h-9 bg-gray-200 rounded w-1/2 mb-2"></div>
                    {/* Placeholder for Subtitle */}
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">

            <div className="absolute -right-4 -bottom-4 text-8xl text-gray-900 opacity-10 pointer-events-none">
                {icon}
            </div>

            <div className="relative">
                {/* MODIFIED: Title text is larger (text-sm -> text-base) */}
                <p className="text-base font-medium text-gray-600 mb-1">{title}</p>
                
                {/* MODIFIED: Value text is significantly larger (text-2xl -> text-3xl) */}
                <p className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</p>

                {/* MODIFIED: Subtitle text is larger (text-xs -> text-sm) */}
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </div>
    );
};