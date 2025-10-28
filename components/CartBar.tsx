
import React from 'react';
import { CartItem } from '../types';

interface CartBarProps {
    cartItems: CartItem[];
    onQtyChange: (productId: number, delta: number) => void;
    onCancel: () => void;
    onPay: () => void;
}

const CartBar: React.FC<CartBarProps> = ({ cartItems, onQtyChange, onCancel, onPay }) => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    return (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-2 w-[calc(100%-16px)] max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl z-50">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-t-2xl">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                    <i className="ti ti-shopping-cart text-xl"></i>
                    <span>{totalItems} items • ₱{totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.productId} className="grid grid-cols-[1fr_auto] gap-2 items-center py-2 border-b border-dashed border-stone-200">
                            <div>
                                <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <span>₱{item.price.toFixed(2)}</span>
                                    <div className="inline-flex items-center gap-2">
                                        <button onClick={() => onQtyChange(item.productId, -1)} className="w-6 h-6 rounded-md border border-stone-300 bg-white font-bold">-</button>
                                        <span className="min-w-[20px] text-center font-bold">{item.qty}</span>
                                        <button onClick={() => onQtyChange(item.productId, 1)} className="w-6 h-6 rounded-md border border-stone-300 bg-white font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="font-extrabold text-gray-800">
                                ₱{(item.qty * item.price).toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 py-4">Tap items to add to the sale.</p>
                )}
            </div>

            <div className="flex gap-2 p-3 bg-white rounded-b-2xl">
                <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl hover:bg-gray-300 flex items-center justify-center gap-2">
                    <i className="ti ti-x"></i> Cancel
                </button>
                <button onClick={onPay} className="flex-1 bg-gray-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                    <i className="ti ti-credit-card"></i> Pay
                </button>
            </div>
        </div>
    );
};

export default CartBar;
