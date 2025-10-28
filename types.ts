
// FIX: Import React to make the JSX namespace available for type definitions.
import React from 'react';

export type CategoryKey = 'beverages' | 'noodles' | 'snacks' | 'canned' | 'coffee' | 'dairy' | 'condiments' | 'personal' | 'firstaid' | 'household' | 'candy' | 'cigarettes' | 'other';

export interface Category {
  key: CategoryKey;
  name: string;
  icon: JSX.Element;
}

export interface Product {
  id: number;
  category: CategoryKey;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  initialStock: number;
  totalSold: number;
  lastSold: string | null;
  dateAdded: string;
}

export interface Sale {
  transactionId?: number;
  productId: number;
  productName: string;
  sellingPrice: number;
  costPrice: number;
  profit: number;
  timestamp: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  costPrice: number;
  qty: number;
}

export interface Transaction {
  id: number;
  createdAt: string;
  items: CartItem[];
}

export interface TransactionRecord {
  id: number;
  timestamp: string;
  items: { productId: number; name: string; qty: number; price: number }[];
  totalRevenue: number;
  totalProfit: number;
}

export type ActiveTab = 'inventory' | 'insights' | 'add' | 'settings';

export interface GeminiAnalysisResult {
  name: string;
  category: CategoryKey;
  costPrice: number;
  sellingPrice: number;
}