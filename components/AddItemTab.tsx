
import React, { useState, useRef } from 'react';
import { Product, CategoryKey, GeminiAnalysisResult } from '../types';
import { CATEGORY_LIST } from '../constants';
import { analyzeProductImage } from '../services/geminiService';

interface AddItemTabProps {
    addProduct: (productData: Omit<Product, 'id' | 'totalSold' | 'lastSold'>) => void;
}

const AddItemTab: React.FC<AddItemTabProps> = ({ addProduct }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<CategoryKey>('beverages');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [initialStock, setInitialStock] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cost = parseFloat(costPrice);
        const selling = parseFloat(sellingPrice);
        const stock = parseInt(initialStock, 10);

        if (!name || isNaN(cost) || isNaN(selling) || isNaN(stock) || stock < 0) {
            alert('Please fill all fields with valid numbers!');
            return;
        }

        addProduct({
            name,
            category,
            costPrice: cost,
            sellingPrice: selling,
            stock: stock,
            initialStock: stock,
            dateAdded: new Date().toISOString()
        });

        // Reset form
        setName('');
        setCategory('beverages');
        setCostPrice('');
        setSellingPrice('');
        setInitialStock('');
    };
    
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            const result: GeminiAnalysisResult = await analyzeProductImage(file);
            setName(result.name);
            setCategory(result.category);
            setCostPrice(result.costPrice.toString());
            setSellingPrice(result.sellingPrice.toString());
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn space-y-6">
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><i className="ti ti-camera text-brand-text"></i> Add with AI</h3>
                <p className="text-sm text-gray-500 mb-3">Upload a photo of a product to automatically fill the form.</p>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full bg-accent text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                    <i className="ti ti-upload"></i> {isLoading ? 'Analyzing Image...' : 'Upload Product Photo'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-4">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2"><i className="ti ti-edit text-brand-text"></i> Add Manually</h3>
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Product Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Coke 1.5L" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300" />
                </div>
                 <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value as CategoryKey)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 bg-white">
                        {CATEGORY_LIST.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Cost Price (₱)</label>
                        <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="15" step="0.01" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-600 mb-1 block">Selling Price (₱)</label>
                        <input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="20" step="0.01" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-600 mb-1 block">Initial Stock</label>
                    <input type="number" value={initialStock} onChange={e => setInitialStock(e.target.value)} placeholder="10" min="0" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300" />
                </div>

                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                    <i className="ti ti-plus"></i> Add Product to Inventory
                </button>
            </form>
        </div>
    );
};

export default AddItemTab;
