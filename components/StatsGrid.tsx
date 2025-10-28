
import React from 'react';

interface StatsGridProps {
    totalProducts: number;
    todaySales: number;
    todayProfit: number;
}

const StatCard: React.FC<{ value: string | number; label: string; prefix?: string }> = ({ value, label, prefix = '' }) => (
    <div className="bg-white p-4 rounded-2xl text-center shadow-lg border border-[#f1e4de]">
        <div className="text-3xl font-extrabold text-gray-800">{prefix}{value}</div>
        <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">{label}</div>
    </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ totalProducts, todaySales, todayProfit }) => {
    return (
        <div className="grid grid-cols-3 gap-3 px-4 -mt-9 relative z-10">
            <StatCard value={totalProducts} label="Products" />
            <StatCard value={todaySales.toFixed(2)} label="Today's Sales" prefix="₱" />
            <StatCard value={todayProfit.toFixed(2)} label="Today's Profit" prefix="₱" />
        </div>
    );
};

export default StatsGrid;
