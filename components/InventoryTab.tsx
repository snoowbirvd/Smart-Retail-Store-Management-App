
import React, { useState, useMemo } from 'react';
import { Product, CategoryKey } from '../types';
import { CATEGORIES, CATEGORY_LIST } from '../constants';

interface InventoryTabProps {
    inventory: Product[];
    onProductAction: (productId: number) => void;
    isTransactionActive: boolean;
}

const ProductItem: React.FC<{ product: Product; onAction: (id: number) => void; actionLabel: string }> = ({ product, onAction, actionLabel }) => {
    const marginPct = product.costPrice > 0 ? ((product.sellingPrice - product.costPrice) / product.costPrice * 100) : 0;
    const profitMargin = marginPct.toFixed(1);
    
    let profitClass = 'bg-green-100 text-green-800';
    if (marginPct < 20) profitClass = 'bg-red-100 text-red-800';
    else if (marginPct < 40) profitClass = 'bg-yellow-100 text-yellow-800';

    return (
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex justify-between items-center transition-all duration-200 shadow-sm hover:border-orange-300 hover:bg-orange-50">
            <div className="flex-1 pr-2">
                <div className="font-bold text-gray-800 mb-1 flex items-center gap-2 flex-wrap">
                    <span>{product.name}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${profitClass}`}>{profitMargin}%</span>
                </div>
                <div className="text-xs text-gray-500">
                    Buy: ₱{product.costPrice.toFixed(2)} | Sell: ₱{product.sellingPrice.toFixed(2)} | Sold: {product.totalSold}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <span className="font-bold text-gray-700 min-w-[30px] text-center bg-stone-100 p-1 rounded-md text-sm">{product.stock}</span>
                <button 
                    onClick={() => onAction(product.id)}
                    className="bg-green-600 text-white border border-green-700 py-2 px-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-1.5 text-sm"
                    aria-label={`${actionLabel} ${product.name}`}
                >
                    <i className="ti ti-shopping-cart-plus"></i> {actionLabel}
                </button>
            </div>
        </div>
    );
};

const InventoryTab: React.FC<InventoryTabProps> = ({ inventory, onProductAction, isTransactionActive }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
    const [filtersVisible, setFiltersVisible] = useState(false);

    const actionLabel = isTransactionActive ? 'ADD' : 'SELL';

    const filteredInventory = useMemo(() => {
        let filtered = [...inventory];
        if (activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filtered;
    }, [inventory, searchTerm, activeCategory]);

    const groupedInventory = useMemo(() => {
        const grouped: { [key in CategoryKey]?: Product[] } = {};
        filteredInventory.forEach(p => {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category]?.push(p);
        });
        return grouped;
    }, [filteredInventory]);
    
    const categoryOrder = CATEGORY_LIST.map(c => c.key);

    return (
        <div className="animate-fadeIn">
            <div className="bg-white rounded-xl p-4 mb-4 border border-stone-200">
                <div className="relative mb-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items…"
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-full text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="flex justify-end">
                     <button onClick={() => setFiltersVisible(!filtersVisible)} className="flex items-center gap-2 py-2 px-4 bg-white border border-chip-border rounded-full text-sm font-bold text-brand-text">
                        <i className="ti ti-adjustments-alt text-lg"></i> Filters
                    </button>
                </div>
                {filtersVisible && (
                     <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => setActiveCategory('all')} className={`py-1.5 px-4 rounded-full text-sm font-bold border transition ${activeCategory === 'all' ? 'bg-chip-active text-brand-text border-chip-active-border' : 'bg-white text-gray-600 border-chip-border'}`}>
                            <i className="ti ti-filter"></i> All
                        </button>
                        {CATEGORY_LIST.map(cat => (
                            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`py-1.5 px-4 rounded-full text-sm font-bold border transition flex items-center gap-1.5 ${activeCategory === cat.key ? 'bg-chip-active text-brand-text border-chip-active-border' : 'bg-white text-gray-600 border-chip-border'}`}>
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {inventory.length === 0 ? (
                     <div className="text-center p-10 text-gray-500">
                        <i className="ti ti-package text-5xl mb-4"></i>
                        <p>No products yet. Add your first item!</p>
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="text-center p-10 text-gray-500">
                        <i className="ti ti-search text-5xl mb-4"></i>
                        <p>No products found. Try a different search or category.</p>
                    </div>
                ) : (
                    categoryOrder.map(categoryKey => {
                        const products = groupedInventory[categoryKey];
                        if (!products || products.length === 0) return null;
                        const category = CATEGORIES[categoryKey];
                        return (
                            <div key={categoryKey}>
                                <div className="bg-white p-2.5 px-4 my-2 rounded-lg font-bold text-gray-600 flex items-center gap-2 border border-stone-200">
                                    {category.icon} {category.name}
                                    <span className="ml-auto bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-1 rounded-full">{products.length}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                {products.map(product => (
                                    <ProductItem key={product.id} product={product} onAction={onProductAction} actionLabel={actionLabel} />
                                ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default InventoryTab;
