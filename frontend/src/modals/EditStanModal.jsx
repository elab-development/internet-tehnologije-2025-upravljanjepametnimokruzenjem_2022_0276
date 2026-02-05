import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const EditStanModal = ({ isOpen, onClose, stan, onUpdate }) => {
    const [formData, setFormData] = useState({ adresa: '', brojStana: '', sprat: '' });
    const [loading, setLoading] = useState(false);

    // Punimo formu podacima čim se modal otvori sa selektovanim stanom
    useEffect(() => {
        if (stan) {
            setFormData({ 
                adresa: stan.adresa || '', 
                brojStana: stan.brojStana || '', 
                sprat: stan.sprat || '' 
            });
        }
    }, [stan]);

    const handleUpdateStan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/stanovi/${stan.idStan}`, formData);
            onUpdate(); // Osvežava listu u Dashboardu
            onClose();  // Zatvara modal
        } catch (err) {
            console.error("Greška pri ažuriranju:", err);
            alert("Nije uspelo ažuriranje podataka o stanu.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !stan) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
                {/* Dugme za zatvaranje (X) u uglu */}
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-2 text-white">Izmeni podatke</h2>
                <p className="text-slate-400 text-sm mb-6 font-medium">Ažurirajte osnovne informacije o objektu.</p>
                
                <form onSubmit={handleUpdateStan} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Adresa objekta</label>
                        <input 
                            type="text" 
                            required
                            value={formData.adresa} 
                            onChange={e => setFormData({...formData, adresa: e.target.value})} 
                            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-colors" 
                            placeholder="Ulica i broj" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Broj stana</label>
                            <input 
                                type="number" 
                                required
                                value={formData.brojStana} 
                                onChange={e => setFormData({...formData, brojStana: e.target.value})} 
                                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-colors" 
                                placeholder="Npr. 12" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Sprat</label>
                            <input 
                                type="number" 
                                required
                                value={formData.sprat} 
                                onChange={e => setFormData({...formData, sprat: e.target.value})} 
                                className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-colors" 
                                placeholder="Npr. 2" 
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-600/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Čuvanje...' : 'Sačuvaj izmene'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStanModal;