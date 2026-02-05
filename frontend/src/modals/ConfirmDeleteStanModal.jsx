import React from 'react';

const ConfirmDeleteStanModal = ({ isOpen, onClose, onConfirm, stanAdresa }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
                {/* Ikonica upozorenja */}
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 font-black text-2xl">
                    !
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">Brisanje Stana</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Da li ste sigurni da želite da obrišete objekat na adresi:<br/>
                    <span className="text-white font-bold block mt-1">"{stanAdresa}"</span>
                    <span className="block mt-2 text-[11px] text-red-400/80 uppercase font-black tracking-widest">
                        Sve sobe i uređaji će biti trajno obrisani.
                    </span>
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 p-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-all text-slate-300"
                    >
                        Odustani
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 p-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 text-white"
                    >
                        Obriši Stan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteStanModal;