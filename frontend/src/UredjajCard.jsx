import React, { useState } from 'react';

const UredjajCard = ({ stanje, onToggle, onChange, onDelete, userRole }) => {
    const { nazivUredjaja, ukljucen, podesavanja, rbStanje, uredjaj } = stanje;

    const [isUpdating, setIsUpdating] = useState(false);

    const tip = uredjaj?.tipUredjaja;
    const marka = uredjaj?.marka || 'Nepoznata marka';
    const modelUredjaja = uredjaj?.model || 'Nepoznat model';

    const handleAction = async (actionFn, ...args) => {
        if (!actionFn) return;
        setIsUpdating(true);
        try {
            await actionFn(...args);
        } finally {
            setIsUpdating(false);
        }
    };

    const getIcon = () => {
        switch (tip) {
            case 'Klima': return '❄️';
            case 'Svetlo': return '💡';
            case 'Grejalica': return '🔥';
            default: return '🔌';
        }
    };

    const bojeSvetla = {
        1: 'bg-blue-100', 2: 'bg-slate-50', 3: 'bg-white', 4: 'bg-orange-50', 5: 'bg-amber-200'
    };

    const sjajBoje = {
        1: 'shadow-[0_0_20px_rgba(191,219,254,0.3)]',
        2: 'shadow-[0_0_20px_rgba(248,250,252,0.3)]',
        3: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]',
        4: 'shadow-[0_0_20px_rgba(255,247,237,0.3)]',
        5: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
    };

    return (
        <div className={`bg-slate-800 border p-5 rounded-2xl flex flex-col gap-4 group transition-all shadow-lg relative overflow-hidden ${isUpdating ? 'border-blue-500/50 opacity-90' : 'border-slate-700 hover:border-blue-500/50'
            }`}>

            {/* LOADER OVERLAY */}
            {isUpdating && (
                <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* DUGME ZA BRISANJE - Sakriveno za ulogu 'dete' */}
            {userRole !== 'dete' && (
                <button
                    onClick={() => onDelete(stanje)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 z-20"
                    title="Obriši uređaj"
                >
                    <span className="text-xs">✕</span>
                </button>
            )}

            {/* Pozadinski sjaj za svetlo */}
            {tip === 'Svetlo' && ukljucen && (
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full ${bojeSvetla[podesavanja.boja]}`} />
            )}

            {/* 1. SEKCIJA: Zaglavlje */}
            <div className={`flex items-start justify-between z-10 ${isUpdating ? 'pointer-events-none' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${ukljucen ? 'bg-blue-600/20 text-blue-400 ' + sjajBoje[podesavanja.boja || 3] : 'bg-slate-700 text-slate-500'
                        }`}>
                        {getIcon()}
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg leading-tight">{nazivUredjaja}</h4>
                        <p className="text-[11px] text-blue-400/80 font-medium uppercase tracking-wider">
                            {marka} <span className="text-slate-500">•</span> {modelUredjaja}
                        </p>
                    </div>
                </div>

                {/* Toggle prekidač pomeren malo ulevo ako postoji delete dugme da se ne preklapaju na mobilnom */}
                <button
                    onClick={() => handleAction(onToggle, stanje)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 mr-8 ${ukljucen ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${ukljucen ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* 2. SEKCIJA: Kontrole */}
            {ukljucen && podesavanja && (
                <div className={`pt-4 border-t border-slate-700/50 space-y-4 z-10 ${isUpdating ? 'pointer-events-none' : ''}`}>

                    {/* KLIMA KONTROLE */}
                    {tip === 'Klima' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/30">
                                    <span className="text-[8px] text-slate-500 block uppercase font-black mb-2">Ciljna Temp.</span>
                                    <div className="flex items-center justify-between px-1">
                                        <button onClick={() => handleAction(onChange, stanje, { temperatura: Math.max(18, podesavanja.temperatura - 1) })} className="w-6 h-6 bg-slate-700 rounded hover:bg-slate-600 text-white">-</button>
                                        <span className="text-sm text-orange-400 font-bold">{podesavanja.temperatura}°C</span>
                                        <button onClick={() => handleAction(onChange, stanje, { temperatura: Math.min(28, podesavanja.temperatura + 1) })} className="w-6 h-6 bg-slate-700 rounded hover:bg-slate-600 text-white">+</button>
                                    </div>
                                </div>
                                <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/30">
                                    <span className="text-[8px] text-slate-500 block uppercase font-black mb-1">Režim</span>
                                    <select
                                        value={podesavanja.mod}
                                        onChange={(e) => handleAction(onChange, stanje, { mod: e.target.value })}
                                        className="bg-transparent text-xs text-blue-300 font-bold w-full focus:outline-none cursor-pointer"
                                    >
                                        {["Hlađenje", "Grejanje", "Eko"].map(m => <option key={m} value={m} className="bg-slate-800">{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/30 flex justify-between items-center px-3">
                                <span className="text-[8px] text-slate-500 uppercase font-black">Ventilator</span>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => handleAction(onChange, stanje, { brzina_ventilatora: n })}
                                            className={`w-2 h-4 rounded-full transition-all ${n <= podesavanja.brzina_ventilatora ? 'bg-blue-500' : 'bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SVETLO KONTROLE */}
                    {tip === 'Svetlo' && (
                        <div className="space-y-3">
                            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] text-slate-500 uppercase font-black">Intenzitet</span>
                                    <span className="text-xs text-yellow-400 font-bold">{podesavanja.jacina_svetla}%</span>
                                </div>
                                <div className="flex gap-1">
                                    {[25, 50, 75, 100].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => handleAction(onChange, stanje, { jacina_svetla: val })}
                                            className={`h-1.5 flex-1 rounded-full transition-all ${podesavanja.jacina_svetla >= val ? 'bg-yellow-400' : 'bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
                                <span className="text-[8px] text-slate-500 block uppercase font-black mb-2">Boja</span>
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map(id => (
                                        <button
                                            key={id}
                                            onClick={() => handleAction(onChange, stanje, { boja: id })}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${bojeSvetla[id]} ${podesavanja.boja === id ? 'border-blue-500' : 'border-transparent'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GREJALICA KONTROLE */}
                    {tip === 'Grejalica' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/30">
                                <span className="text-[8px] text-slate-500 block uppercase font-black mb-1">Cilj</span>
                                <div className="flex items-center justify-between">
                                    <button onClick={() => handleAction(onChange, stanje, { temperatura: podesavanja.temperatura - 1 })} className="text-red-400 font-bold px-2">-</button>
                                    <span className="text-sm text-red-400 font-bold">{podesavanja.temperatura}°C</span>
                                    <button onClick={() => handleAction(onChange, stanje, { temperatura: podesavanja.temperatura + 1 })} className="text-red-400 font-bold px-2">+</button>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/30">
                                <span className="text-[8px] text-slate-500 block uppercase font-black mb-1">Snaga</span>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => handleAction(onChange, stanje, { jacina_grejaca: n })}
                                            className={`h-1.5 flex-1 rounded-full ${n <= podesavanja.jacina_grejaca ? 'bg-red-400' : 'bg-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UredjajCard;