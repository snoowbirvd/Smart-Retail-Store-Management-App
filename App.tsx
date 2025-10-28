
import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, Product, Sale, TransactionRecord, CartItem } from './types';

import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import Tabs from './components/Tabs';
import InventoryTab from './components/InventoryTab';
import DashboardTab from './components/DashboardTab';
import AddItemTab from './components/AddItemTab';
import SettingsTab from './components/SettingsTab';
import CartBar from './components/CartBar';

const App: React.FC = () => {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
    const [currentTransaction, setCurrentTransaction] = useState<CartItem[] | null>(null);

    useEffect(() => {
        setInventory(JSON.parse(localStorage.getItem('tindatech_inventory') || '[]'));
        setSalesHistory(JSON.parse(localStorage.getItem('tindatech_sales') || '[]'));
        setTransactions(JSON.parse(localStorage.getItem('tindatech_transactions') || '[]'));
    }, []);

    const saveData = (newInventory: Product[], newSales: Sale[], newTransactions: TransactionRecord[]) => {
        localStorage.setItem('tindatech_inventory', JSON.stringify(newInventory));
        localStorage.setItem('tindatech_sales', JSON.stringify(newSales));
        localStorage.setItem('tindatech_transactions', JSON.stringify(newTransactions));
    };

    const addProduct = (productData: Omit<Product, 'id' | 'totalSold' | 'lastSold'>) => {
        const newProduct: Product = {
            ...productData,
            id: Date.now(),
            totalSold: 0,
            lastSold: null,
        };
        const newInventory = [...inventory, newProduct];
        setInventory(newInventory);
        saveData(newInventory, salesHistory, transactions);
        alert(`${newProduct.name} has been added!`);
        setActiveTab('inventory');
    };

    const startTransaction = () => {
        setCurrentTransaction([]);
    };
    
    const cancelTransaction = () => {
        setCurrentTransaction(null);
    };

    const handleProductAction = (productId: number) => {
        const product = inventory.find(p => p.id === productId);
        if (!product) return;

        if (currentTransaction !== null) {
            // Add to cart
            const existingItem = currentTransaction.find(item => item.productId === productId);
            if (product.stock <= (existingItem?.qty ?? 0)) {
                alert(`Not enough stock for ${product.name}`);
                return;
            }
            if (existingItem) {
                setCurrentTransaction(currentTransaction.map(item => item.productId === productId ? { ...item, qty: item.qty + 1 } : item));
            } else {
                setCurrentTransaction([...currentTransaction, { productId, name: product.name, price: product.sellingPrice, costPrice: product.costPrice, qty: 1 }]);
            }
        } else {
            // Quick sell
            if (product.stock > 0) {
                const newInventory = inventory.map(p => p.id === productId ? { ...p, stock: p.stock - 1, totalSold: p.totalSold + 1, lastSold: new Date().toISOString() } : p);
                const newSale: Sale = { productId, productName: product.name, sellingPrice: product.sellingPrice, costPrice: product.costPrice, profit: product.sellingPrice - product.costPrice, timestamp: new Date().toISOString() };
                const newSalesHistory = [...salesHistory, newSale];

                setInventory(newInventory);
                setSalesHistory(newSalesHistory);
                saveData(newInventory, newSalesHistory, transactions);
            } else {
                alert(`No stock for ${product.name}`);
            }
        }
    };
    
    const handleCartQtyChange = (productId: number, delta: number) => {
        if (!currentTransaction) return;
        const product = inventory.find(p => p.id === productId);
        const cartItem = currentTransaction.find(item => item.productId === productId);
        if (!product || !cartItem) return;

        const newQty = cartItem.qty + delta;
        if (newQty > product.stock) {
            alert(`Max stock reached for ${product.name}`);
            return;
        }

        if (newQty <= 0) {
            setCurrentTransaction(currentTransaction.filter(item => item.productId !== productId));
        } else {
            setCurrentTransaction(currentTransaction.map(item => item.productId === productId ? { ...item, qty: newQty } : item));
        }
    };

    const finalizeTransaction = () => {
        if (!currentTransaction || currentTransaction.length === 0) return;
        
        let newInventory = [...inventory];
        let newSalesHistory = [...salesHistory];
        const transactionId = Date.now();
        let totalRevenue = 0;
        let totalProfit = 0;

        for (const item of currentTransaction) {
            const productIndex = newInventory.findIndex(p => p.id === item.productId);
            if (productIndex === -1 || newInventory[productIndex].stock < item.qty) {
                alert(`Not enough stock for ${item.name}!`);
                return;
            }
            newInventory[productIndex] = {
                ...newInventory[productIndex],
                stock: newInventory[productIndex].stock - item.qty,
                totalSold: newInventory[productIndex].totalSold + item.qty,
                lastSold: new Date().toISOString(),
            };
            for (let i = 0; i < item.qty; i++) {
                newSalesHistory.push({
                    transactionId,
                    productId: item.productId,
                    productName: item.name,
                    sellingPrice: item.price,
                    costPrice: item.costPrice,
                    profit: item.price - item.costPrice,
                    timestamp: new Date().toISOString(),
                });
            }
            totalRevenue += item.qty * item.price;
            totalProfit += item.qty * (item.price - item.costPrice);
        }

        const newTransactionRecord: TransactionRecord = {
            id: transactionId,
            timestamp: new Date().toISOString(),
            items: currentTransaction.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
            totalRevenue,
            totalProfit,
        };
        const newTransactions = [...transactions, newTransactionRecord];
        
        setInventory(newInventory);
        setSalesHistory(newSalesHistory);
        setTransactions(newTransactions);
        saveData(newInventory, newSalesHistory, newTransactions);
        setCurrentTransaction(null);
    };

    const exportData = () => {
        const data = { inventory, salesHistory, transactions, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tindatech_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAllData = () => {
        setInventory([]);
        setSalesHistory([]);
        setTransactions([]);
        saveData([], [], []);
    };
    
    const stats = useMemo(() => {
        const today = new Date().toDateString();
        const todaySales = salesHistory.filter(s => new Date(s.timestamp).toDateString() === today);
        return {
            totalProducts: inventory.length,
            todayRevenue: todaySales.reduce((sum, s) => sum + s.sellingPrice, 0),
            todayProfit: todaySales.reduce((sum, s) => sum + s.profit, 0)
        };
    }, [inventory, salesHistory]);

    return (
        <div className={`max-w-md mx-auto bg-white min-h-screen shadow-2xl pb-24 ${currentTransaction !== null ? 'pb-48' : ''}`}>
            <Header />
            <StatsGrid totalProducts={stats.totalProducts} todaySales={stats.todayRevenue} todayProfit={stats.todayProfit} />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="p-4">
                {activeTab === 'inventory' && (
                    <>
                        <div className="mb-4">
                            <button onClick={startTransaction} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:opacity-90 flex items-center justify-center gap-2">
                                <i className="ti ti-shopping-cart"></i> Start New Sale
                            </button>
                        </div>
                        <InventoryTab inventory={inventory} onProductAction={handleProductAction} isTransactionActive={currentTransaction !== null} />
                    </>
                )}
                {activeTab === 'insights' && <DashboardTab inventory={inventory} salesHistory={salesHistory} />}
                {activeTab === 'add' && <AddItemTab addProduct={addProduct} />}
                {activeTab === 'settings' && <SettingsTab totalProducts={inventory.length} exportData={exportData} clearAllData={clearAllData}/>}
            </main>
            {currentTransaction !== null && (
                <CartBar 
                    cartItems={currentTransaction} 
                    onQtyChange={handleCartQtyChange}
                    onCancel={cancelTransaction}
                    onPay={finalizeTransaction}
                />
            )}
        </div>
    );
};

export default App;
