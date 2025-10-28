
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { getDashboardInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardTabProps {
    inventory: Product[];
    salesHistory: Sale[];
}

const KpiCard: React.FC<{ title: string; value: string | number; change?: string; icon: string; }> = ({ title, value, change, icon }) => (
    <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
        <div className="text-sm text-gray-500 flex items-center gap-2"><i className={`ti ${icon} text-brand-text`}></i> {title}</div>
        <div className="text-2xl font-extrabold text-gray-800 mt-1">{value}</div>
        {change && <div className="text-xs text-gray-400 mt-1">{change}</div>}
    </div>
);

const InsightCard: React.FC<{ title: string; children: React.ReactNode; icon: string; isLoading?: boolean }> = ({ title, children, icon, isLoading }) => (
    <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><i className={`ti ${icon} text-brand-text`}></i> {title}</h3>
        <div className="text-sm text-gray-600 leading-relaxed">
            {isLoading ? <div className="animate-pulse h-12 bg-gray-200 rounded-md"></div> : children}
        </div>
    </div>
);

const DashboardTab: React.FC<DashboardTabProps> = ({ inventory, salesHistory }) => {
    const [insights, setInsights] = useState<{ topSelling: string; profitAnalysis: string; aiRecommendations: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inventoryValue = inventory.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const itemsAtRisk = inventory.filter(p => p.stock > 0 && p.stock <= 5).length;

    const generateInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getDashboardInsights(inventory, salesHistory);
            setInsights(result);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const salesData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        return { name: dayName, date: dayKey, Sales: 0, Profit: 0 };
    }).reverse();

    salesHistory.forEach(sale => {
        const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
        const dayData = salesData.find(d => d.date === saleDate);
        if (dayData) {
            dayData.Sales += sale.sellingPrice;
            dayData.Profit += sale.profit;
        }
    });

    return (
        <div className="animate-fadeIn space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Inventory Value" value={`₱${inventoryValue.toFixed(2)}`} change="capital in stock" icon="ti-currency-peso" />
                <KpiCard title="Items at Risk" value={itemsAtRisk} change="stock <= 5" icon="ti-alert-triangle" />
            </div>

             <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 text-center">7-Day Sales & Profit</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{ fontSize: 12 }}/>
                        <Bar dataKey="Sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="p-2">
                <button onClick={generateInsights} disabled={isLoading} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2">
                    <i className="ti ti-robot"></i> {isLoading ? 'Analyzing Data...' : 'Generate AI Insights'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>

            <InsightCard title="Top Selling Products" icon="ti-trending-up" isLoading={isLoading}>
                {insights ? insights.topSelling : 'Click the button above to generate insights.'}
            </InsightCard>

            <InsightCard title="Profit Analysis" icon="ti-cash" isLoading={isLoading}>
                {insights ? insights.profitAnalysis : 'Insights will appear here.'}
            </InsightCard>

            <InsightCard title="AI Recommendations" icon="ti-bulb" isLoading={isLoading}>
                {insights ? insights.aiRecommendations : 'Personalized suggestions will appear here.'}
            </InsightCard>
        </div>
    );
};

export default DashboardTab;
