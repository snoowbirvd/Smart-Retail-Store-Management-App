
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [date, setDate] = useState({ weekday: '', monthday: '' });

    useEffect(() => {
        const now = new Date();
        const weekday = now.toLocaleDateString(navigator.language || 'en-US', { weekday: 'long' });
        const month = now.toLocaleDateString(navigator.language || 'en-US', { month: 'long' });
        const day = now.getDate();
        setDate({ weekday: `${weekday},`, monthday: `${month} ${day}` });
    }, []);

    return (
        <div className="bg-gradient-to-br from-brand-1 via-brand-2 to-brand-3 text-[#2b2b2b] p-4 pb-16 text-left rounded-br-3xl flex justify-between items-center relative">
            <div className="header-text">
                <h1 className="text-2xl font-bold">TindaTech</h1>
                <p className="opacity-90 text-sm tracking-wide">Smart Inventory for your store</p>
            </div>
            <div className="text-4xl" aria-hidden="true"><i className="ti ti-building-store"></i></div>
            <div className="absolute right-4 top-2.5 text-right text-xs font-bold leading-tight">
                <div className="text-[#2b2b2b]">{date.weekday}</div>
                <div className="text-[#3c3c3c] font-semibold">{date.monthday}</div>
            </div>
        </div>
    );
};

export default Header;
