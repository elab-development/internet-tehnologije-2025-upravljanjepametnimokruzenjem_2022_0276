import React, { useState } from 'react';
import api from '../api/axios';

const ConfirmDeleteSobaModal = ({ isOpen, onClose, onConfirm, soba }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !soba) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            // Modal samostalno izvršava brisanje
            await api.delete(`/sobe/${soba.rbSoba}`);
            
            // Obaveštavamo Dashboard da osveži listu
            onConfirm(); 
            onClose();
        } catch (err) {
            console.error("Greška pri brisanju sobe:", err);
            alert(err.response?.data?.message || "Greška pri brisanju sobe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border border-red-500/20">
                    ⚠️
                </div>
                
                <h2 className="text-2xl font-black mb-2 text-white">Obriši sobu?</h2>
                <p className="text-slate-400 mb-8">
                    Da li ste sigurni da želite da obrišete sobu <span className="text-white font-bold">"{soba.nazivSobe}"</span>? 
                    Svi uređaji unutar ove sobe će takođe biti uklonjeni.
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="flex-1 p-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-all text-slate-300 disabled:opacity-50"
                    >
                        Odustani
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 p-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 text-white disabled:opacity-50"
                    >
                        {loading ? 'Brisanje...' : 'Obriši'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteSobaModal;