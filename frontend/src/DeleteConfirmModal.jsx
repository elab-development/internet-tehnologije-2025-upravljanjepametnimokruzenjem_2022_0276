import React, { useState } from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, deviceName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    ⚠️
                </div>
                <h2 className="text-xl font-black text-center mb-2">Brisanje uređaja</h2>
                <p className="text-slate-400 text-center text-sm mb-8">
                    Da li ste sigurni da želite da uklonite <span className="text-white font-bold">{deviceName}</span>? Ova akcija je nepovratna.
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-slate-700 p-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
                    >
                        Otkaži
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 p-3 rounded-xl font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
                    >
                        Obriši
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;