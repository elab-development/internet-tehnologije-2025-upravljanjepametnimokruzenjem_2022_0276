import React, { useState } from 'react';
import api from '../api/axios';

const ManageStanariModal = ({ isOpen, onClose, stan, onUpdate }) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!username) return;
        setLoading(true);
        setError('');
        
        try {
            await api.post(`/stanovi/${stan.idStan}/dodaj-stanara`, { username });
            setUsername('');
            onUpdate(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Greška pri dodavanju');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (korisnikId) => {
        if (!window.confirm("Ukloniti pristup ovom korisniku?")) return;
        
        try {
            await api.post(`/stanovi/${stan.idStan}/ukloni-stanara`, { korisnik_id: korisnikId });
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen || !stan) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Upravljaj stanarima</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
                </div>

                {/* Forma za dodavanje po username-u */}
                <form onSubmit={handleAdd} className="mb-8">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Dodaj novog po username-u</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex-1 p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white text-sm focus:border-emerald-500 outline-none transition-all"
                            placeholder="npr. nikola123"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-all disabled:opacity-50"
                        >
                            {loading ? '...' : '+'}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
                </form>

                {/* Lista trenutnih stanara */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block">Trenutni stanari</label>
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                        {stan.korisnici && stan.korisnici.length > 0 ? (
                            stan.korisnici.map(k => (
                                <div key={k.idKorisnik} className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl group">
                                    <div>
                                        <p className="text-sm font-bold text-white">{k.ime} {k.prezime}</p>
                                        <p className="text-[10px] text-slate-500">@{k.username}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(k.idKorisnik)}
                                        className="text-xs font-bold text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        Ukloni
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-600 italic py-4">Nema dodatih stanara.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStanariModal;