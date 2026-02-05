import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddDeviceModal = ({ isOpen, onClose, onDeviceAdded, rbSoba }) => {
    const [sviModeliUredjaja, setSviModeliUredjaja] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [novoStanje, setNovoStanje] = useState({ naziv: '', idUredjaj: '' });

    // Učitaj modele čim se modal otvori
    useEffect(() => {
        if (isOpen) {
            const fetchModeli = async () => {
                setModalLoading(true);
                setModalError('');
                try {
                    const res = await api.get('/uredjaji');
                    setSviModeliUredjaja(res.data);
                } catch (err) {
                    setModalError('Neuspelo učitavanje modela iz baze.');
                } finally {
                    setModalLoading(false);
                }
            };
            fetchModeli();
        }
    }, [isOpen]);

    const handleAddUredjaj = async () => {
        if (!novoStanje.naziv.trim() || !novoStanje.idUredjaj) {
            setModalError('Morate uneti naziv i izabrati model uređaja.');
            return;
        }

        setSaveLoading(true);
        setModalError('');

        const izabraniModel = sviModeliUredjaja.find(u => u.idUredjaj === parseInt(novoStanje.idUredjaj));
        let defaultPodesavanja = {};

        if (izabraniModel?.tipUredjaja === 'Klima') {
            defaultPodesavanja = { temperatura: 20, mod: 'Hladjenje', brzina_ventilatora: 1 };
        } else if (izabraniModel?.tipUredjaja === 'Grejalica') {
            defaultPodesavanja = { temperatura: 20, jacina_grejaca: 1 };
        } else if (izabraniModel?.tipUredjaja === 'Svetlo') {
            defaultPodesavanja = { jacina_svetla: 50, boja: 1 };
        }

        try {
            await api.post('/stanja-uredjaja', {
                nazivUredjaja: novoStanje.naziv,
                uredjaj_id: parseInt(novoStanje.idUredjaj),
                soba_id: rbSoba,
                ukljucen: false,
                podesavanja: defaultPodesavanja
            });
            
            // Resetuj formu i obavesti roditelja
            setNovoStanje({ naziv: '', idUredjaj: '' });
            onDeviceAdded(); 
            onClose();
        } catch (err) {
            setModalError('Greška prilikom čuvanja uređaja.');
        } finally {
            setSaveLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
                <h2 className="text-2xl font-black mb-6">Novi uređaj</h2>
                
                {modalLoading ? (
                    <div className="py-10 flex flex-col items-center gap-4 text-blue-500">
                        <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Učitavam modele...</span>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {modalError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold">
                                ⚠️ {modalError}
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] text-slate-500 font-black uppercase mb-2 block tracking-widest">Personalizovani naziv</label>
                            <input 
                                type="text"
                                disabled={saveLoading}
                                placeholder="npr. Moja Klima"
                                className={`w-full bg-slate-900 border ${modalError && !novoStanje.naziv ? 'border-red-500' : 'border-slate-700'} rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors text-white`}
                                value={novoStanje.naziv}
                                onChange={(e) => setNovoStanje({...novoStanje, naziv: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-500 font-black uppercase mb-2 block tracking-widest">Izaberite model</label>
                            <select 
                                disabled={saveLoading}
                                className={`w-full bg-slate-900 border ${modalError && !novoStanje.idUredjaj ? 'border-red-500' : 'border-slate-700'} rounded-xl p-3 focus:outline-none focus:border-blue-500 text-white`}
                                value={novoStanje.idUredjaj}
                                onChange={(e) => setNovoStanje({...novoStanje, idUredjaj: e.target.value})}
                            >
                                <option value="">Izaberi model...</option>
                                {sviModeliUredjaja.map(u => (
                                    <option key={u.idUredjaj} value={u.idUredjaj} className="bg-slate-800">
                                        {u.tipUredjaja}: {u.marka} {u.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button"
                                disabled={saveLoading}
                                onClick={onClose} 
                                className="flex-1 bg-slate-700 p-3 rounded-xl font-bold hover:bg-slate-600 transition-all disabled:opacity-50"
                            >
                                Otkaži
                            </button>
                            <button 
                                type="button"
                                disabled={saveLoading}
                                onClick={handleAddUredjaj} 
                                className="flex-1 bg-blue-600 p-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                            >
                                {saveLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Sačuvaj'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddDeviceModal;