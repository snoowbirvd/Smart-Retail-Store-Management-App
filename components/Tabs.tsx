
import React from 'react';
import { ActiveTab } from '../types';

interface TabsProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const TabButton: React.FC<{
    label: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClasses = 'bg-chip-active text-brand-text border-chip-active-border ring-2 ring-orange-200';
    const inactiveClasses = 'bg-white text-gray-700 border-chip-border';

    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-2xl cursor-pointer font-bold transition-all duration-200 hover:-translate-y-0.5 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <i className={`ti ${icon} text-lg`}></i> {label}
        </button>
    );
};

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex gap-2 p-3" role="tablist" aria-label="Main sections">
            <TabButton label="Inventory" icon="ti-packages" isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
            <TabButton label="Dashboard" icon="ti-chart-bar" isActive={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
            <TabButton label="Add Item" icon="ti-plus" isActive={activeTab === 'add'} onClick={() => setActiveTab('add')} />
            <TabButton label="Settings" icon="ti-settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
    );
};

export default Tabs;
