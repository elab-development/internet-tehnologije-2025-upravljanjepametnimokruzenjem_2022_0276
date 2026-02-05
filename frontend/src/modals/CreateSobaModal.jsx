import React, { useState } from 'react';
import api from '../api/axios';

const CreateSobaModal = ({ isOpen, onClose, onSobaCreated, stanId }) => {
    const [nazivSobe, setNazivSobe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!nazivSobe.trim()) {
            setError('Naziv sobe je obavezan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Šaljemo zahtev direktno iz modala
            await api.post('/sobe', {
                nazivSobe: nazivSobe,
                stan_id: stanId
            });

            // Reset i osvežavanje Dashboard-a
            setNazivSobe('');
            onSobaCreated(); 
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Došlo je do greške pri kreiranju sobe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-6">Nova Soba</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Naziv Sobe
                        </label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl mt-1 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="npr. Dnevna soba"
                            value={nazivSobe}
                            onChange={(e) => setNazivSobe(e.target.value)}
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
                            className="flex-1 p-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                            {loading ? 'Kreiranje...' : 'Sačuvaj'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSobaModal;