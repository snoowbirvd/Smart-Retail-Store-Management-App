
import React from 'react';
import { Category, CategoryKey } from './types';

export const CATEGORIES: Record<CategoryKey, Category> = {
  beverages: { key: 'beverages', name: 'Beverages', icon: <i className="ti ti-bottle"></i> },
  noodles: { key: 'noodles', name: 'Noodles', icon: <i className="ti ti-noodles"></i> },
  snacks: { key: 'snacks', name: 'Snacks', icon: <i className="ti ti-cookie"></i> },
  canned: { key: 'canned', name: 'Canned Goods', icon: <i className="ti ti-box"></i> },
  coffee: { key: 'coffee', name: 'Coffee & Tea', icon: <i className="ti ti-coffee"></i> },
  dairy: { key: 'dairy', name: 'Dairy & Eggs', icon: <i className="ti ti-milk"></i> },
  condiments: { key: 'condiments', name: 'Condiments', icon: <i className="ti ti-salt"></i> },
  personal: { key: 'personal', name: 'Personal Care', icon: <i className="ti ti-hand-soap"></i> },
  firstaid: { key: 'firstaid', name: 'First Aid', icon: <i className="ti ti-first-aid-kit"></i> },
  household: { key: 'household', name: 'Household', icon: <i className="ti ti-broom"></i> },
  candy: { key: 'candy', name: 'Candy & Sweets', icon: <i className="ti ti-candy"></i> },
  cigarettes: { key: 'cigarettes', name: 'Cigarettes', icon: <i className="ti ti-smoking"></i> },
  other: { key: 'other', name: 'Other', icon: <i className="ti ti-package"></i> },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
