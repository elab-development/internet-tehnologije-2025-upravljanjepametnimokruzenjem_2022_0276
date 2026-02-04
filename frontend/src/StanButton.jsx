import React from 'react';

const StanButton = ({ stan, isActive, onClick, variant = 'blue' }) => {
    const activeClass = variant === 'blue' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-600 shadow-emerald-500/20';
    
    return (
        <button
            onClick={() => onClick(stan)}
            className={`w-full text-left p-4 rounded-2xl mb-2 transition-all ${
                isActive 
                ? `${activeClass} shadow-lg text-white` 
                : 'hover:bg-slate-800 text-slate-400'
            }`}
        >
            <p className="font-bold truncate">{stan.adresa}</p>
            <p className="text-[10px] opacity-50 uppercase tracking-tighter">
                Sprat {stan.sprat} • Stan {stan.brojStana}
            </p>
        </button>
    );
};

export default StanButton;