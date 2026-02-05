import React from 'react';

const StanButton = ({ stan, isActive, onClick, onDelete, onEdit, onManageUsers, variant = 'blue' }) => {
    const activeClass = variant === 'blue' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-600 shadow-emerald-500/20';
    const isVlasnik = variant === 'blue';

    return (
        <div className="group relative">
            <button
                onClick={() => onClick(stan)}
                className={`w-full text-left p-4 rounded-2xl mb-2 transition-all ${
                    isActive
                        ? `${activeClass} shadow-lg text-white`
                        : 'hover:bg-slate-800 text-slate-400'
                }`}
            >

                <p className="">ID:{stan.idStan}</p>
                <p className="font-bold truncate pr-20">{stan.adresa}</p>
                <p className="text-[10px] opacity-50 uppercase tracking-tighter">
                    Sprat {stan.sprat} • Stan {stan.brojStana} 
                </p>
            </button>

            {/* Kontrole za vlasnika - vidljive na hoveru */}
            {isVlasnik && (
                <div className="absolute right-3 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    {/* Dugme za STANARE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageUsers(stan);
                        }}
                        className={`p-1 transition-all ${
                            isActive ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-emerald-400'
                        }`}
                        title="Upravljaj stanarima"
                    >
                        <span style={{ fontSize: '18px' }}>👥</span>
                    </button>

                    {/* Dugme za EDIT */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(stan);
                        }}
                        className={`p-1 transition-all ${
                            isActive ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-blue-400'
                        }`}
                        title="Izmeni podatke o stanu"
                    >
                        <span style={{ fontSize: '18px' }}>⚙</span>
                    </button>

                    {/* Dugme za BRISANJE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(stan);
                        }}
                        className={`p-1 transition-all ${
                            isActive ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-red-400'
                        }`}
                        title="Obriši stan"
                    >
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>✕</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default StanButton;