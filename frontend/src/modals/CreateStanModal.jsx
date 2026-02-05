import React, { useState } from 'react';
import api from '../api/axios';

const CreateStanModal = ({ isOpen, onClose, onStanCreated }) => {
    const [podaci, setPodaci] = useState({
        adresa: '',
        sprat: '',
        brojStana: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setPodaci({ ...podaci, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!podaci.adresa.trim()) {
            setError('Adresa je obavezna.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Šaljemo podatke ka tvojoj ruti za kreiranje stana
            await api.post('/stanovi', {
                adresa: podaci.adresa,
                sprat: podaci.sprat,
                brojStana: podaci.brojStana
            });
            
            // Resetujemo formu i osvežavamo listu stanova u Dashboardu
            setPodaci({ adresa: '', sprat: '', brojStana: '' });
            onStanCreated(); 
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Došlo je do greške pri kreiranju objekta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-black mb-6">Novi Objekt</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ADRESA */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adresa / Naziv</label>
                        <input 
                            name="adresa"
                            type="text" 
                            required
                            className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl mt-1 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            placeholder="npr. Bulevar Oslobođenja 12"
                            value={podaci.adresa}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* SPRAT */}
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sprat</label>
                            <input 
                                name="sprat"
                                type="text" 
                                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl mt-1 focus:border-blue-500 outline-none transition-all"
                                placeholder="npr. 4"
                                value={podaci.sprat}
                                onChange={handleChange}
                            />
                        </div>

                        {/* BROJ STANA */}
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Br. Stana</label>
                            <input 
                                name="brojStana"
                                type="text" 
                                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl mt-1 focus:border-blue-500 outline-none transition-all"
                                placeholder="npr. 22"
                                value={podaci.brojStana}
                                onChange={handleChange}
                            />
                        </div>
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
                            className="flex-1 p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? 'Kreiranje...' : 'Sačuvaj'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStanModal;