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
                <p className="text-[10px] opacity-70">ID:{stan.idStan}</p>
                <p className="font-bold truncate pr-20">{stan.adresa}</p>
                <p className="text-[10px] opacity-50 uppercase tracking-tighter">
                    Sprat {stan.sprat} • Stan {stan.brojStana} 
                </p>
            </button>

            {/* Kontrole za vlasnika - vidljive samo kada je isActive i na hoveru */}
            {(isVlasnik && isActive) && (
                <div className="absolute right-3 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                    {/* Dugme za STANARE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onManageUsers(stan);
                        }}
                        className="p-1 text-white/60 hover:text-emerald-400 transition-colors"
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
                        className="p-1 text-white/60 hover:text-yellow-400 transition-colors"
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
                        // Ovde je ključ: uklonjen ternarni operator koji je forsirao belu boju
                        className="p-1 text-white/60 hover:text-red-500 transition-colors"
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