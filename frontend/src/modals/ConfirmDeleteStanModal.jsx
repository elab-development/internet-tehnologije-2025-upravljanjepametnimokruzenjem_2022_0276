import React, { useState } from 'react';
import api from '../api/axios';

const ConfirmDeleteStanModal = ({ isOpen, onClose, onDeleted, stan }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !stan) return null;

    const handleDelete = async () => {
        setLoading(true);
        try {
            // Modal samostalno izvršava brisanje
            await api.delete(`/stanovi/${stan.idStan}`);
            
            // Obaveštavamo Dashboard da je brisanje uspelo
            // Prosleđujemo id stana da bi Dashboard znao da li da ga deselektuje
            onDeleted(stan.idStan); 
            onClose();
        } catch (err) {
            console.error("Greška pri brisanju stana:", err);
            alert(err.response?.data?.message || "Došlo je do greške pri brisanju stana.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 font-black text-2xl">
                    {loading ? '...' : '!'}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">Brisanje Stana</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Da li ste sigurni da želite da obrišete objekat na adresi:<br/>
                    <span className="text-white font-bold block mt-1">"{stan.adresa}"</span>
                    <span className="block mt-2 text-[11px] text-red-400/80 uppercase font-black tracking-widest">
                        Sve sobe i uređaji će biti trajno obrisani.
                    </span>
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
                        {loading ? 'Brisanje...' : 'Obriši Stan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteStanModal;