
import React from 'react';

interface SettingsTabProps {
    totalProducts: number;
    exportData: () => void;
    clearAllData: () => void;
}

const SettingItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-stone-200">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
);

const SettingsTab: React.FC<SettingsTabProps> = ({ totalProducts, exportData, clearAllData }) => {
    
    const handleClearData = () => {
        if (window.confirm('Are you sure? This will delete all your data!')) {
            if (window.confirm('This action cannot be undone. Continue?')) {
                clearAllData();
            }
        }
    };

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">Store Information</h3>
                <SettingItem label="Store Name" value="My Sari-Sari Store" />
                <SettingItem label="Total Products" value={totalProducts} />
            </div>

            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-2">Alert Settings</h3>
                <SettingItem label="Prediction Method" value="Blended (AI)" />
                <SettingItem label="Smart Alerts" value="Enabled ✓" />
            </div>

            <div className="space-y-3">
                 <button onClick={exportData} className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                    <i className="ti ti-download"></i> Export Data
                </button>
                 <button onClick={handleClearData} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-red-500 flex items-center justify-center gap-2">
                    <i className="ti ti-trash"></i> Clear All Data
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
