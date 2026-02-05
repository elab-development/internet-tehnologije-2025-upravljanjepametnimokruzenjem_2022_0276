import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const EditSobaModal = ({ isOpen, onClose, onSobaUpdated, soba }) => {
    const [nazivSobe, setNazivSobe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Punimo input trenutnim nazivom kada se modal otvori
    useEffect(() => {
        if (isOpen && soba) {
            setNazivSobe(soba.nazivSobe);
            setError('');
        }
    }, [isOpen, soba]);

    if (!isOpen || !soba) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nazivSobe.trim()) {
            setError('Naziv sobe ne može biti prazan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
    await api.patch(`/sobe/${soba.rbSoba}`, { // Prebacujemo na PATCH
        nazivSobe: nazivSobe
    });

    onSobaUpdated();
    onClose();
} catch (err) {
            setError(err.response?.data?.message || 'Greška pri izmeni sobe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-6 text-white">Izmeni Sobu</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Novi Naziv Sobe
                        </label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl mt-1 focus:border-blue-500 outline-none transition-all text-white"
                            value={nazivSobe}
                            onChange={(e) => setNazivSobe(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="flex-1 p-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold transition-all text-slate-300"
                        >
                            Odustani
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 text-white"
                        >
                            {loading ? 'Čuvanje...' : 'Sačuvaj izmene'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSobaModal;