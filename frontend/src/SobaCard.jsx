import React from 'react';

const SobaCard = ({ soba, onClick }) => {
    return (
        <div 
            onClick={() => onClick(soba)}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-lg"
        >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🚪
            </div>
            {/* Koristimo nazivSobe jer je tako definisano u tvom modelu */}
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                {soba.nazivSobe}
            </h3>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                    ID: {soba.rbSoba}
                </span>
                <span className="text-blue-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity italic">
                    Pregledaj uređaje →
                </span>
            </div>
        </div>
    );
};

export default SobaCard;