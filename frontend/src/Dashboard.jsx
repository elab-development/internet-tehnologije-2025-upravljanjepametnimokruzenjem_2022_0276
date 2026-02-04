import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import Sidebar from './Sidebar';
import SobaCard from './SobaCard';
import UredjajCard from './UredjajCard';
import AddDeviceModal from './AddDeviceModal';
import DeleteConfirmModal from './DeleteConfirmModal'; // Importuj modal za potvrdu

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [vlasnikStanovi, setVlasnikStanovi] = useState([]);
    const [stanarStanovi, setStanarStanovi] = useState([]);
    const [selectedStan, setSelectedStan] = useState(null);
    const [selectedSoba, setSelectedSoba] = useState(null);
    
    const [showAddModal, setShowAddModal] = useState(false);
    
    // State za brisanje uređaja
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStanovi = useCallback(async (currentStanId, currentSobaId) => {
        try {
            const res = await api.get('/stanovi');
            const vlasnik = res.data.vlasnik || [];
            const stanar = res.data.stanar || [];
            
            setVlasnikStanovi(vlasnik);
            setStanarStanovi(stanar);

            if (currentStanId) {
                const sviStanovi = [...vlasnik, ...stanar];
                const svezStan = sviStanovi.find(s => s.idStan === currentStanId);
                
                if (svezStan) {
                    setSelectedStan(svezStan);
                    if (currentSobaId) {
                        const svezaSoba = svezStan.sobe.find(so => so.rbSoba === currentSobaId);
                        if (svezaSoba) setSelectedSoba(svezaSoba);
                    }
                }
            }
        } catch (err) {
            console.error("Greška pri učitavanju stanova:", err);
        }
    }, []);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const userRes = await api.get('/me');
                setUser(userRes.data);
                await fetchStanovi();
            } catch (err) {
                localStorage.clear();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        initDashboard();
    }, [navigate, fetchStanovi]);

    const handleStanSelect = async (stan) => {
        await fetchStanovi(stan.idStan);
        setSelectedSoba(null);
    };

    const handleSobaSelect = async (soba) => {
        await fetchStanovi(selectedStan.idStan, soba.rbSoba);
    };

    const handleToggle = async (stanje) => {
        try {
            await api.patch(`/stanja-uredjaja/${stanje.rbStanje}`, { ukljucen: !stanje.ukljucen });
            await fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba);
        } catch (err) { console.error(err); }
    };

    const handleSettingsChange = async (stanje, novaPodesavanja) => {
        try {
            const kompletanJson = { ...stanje.podesavanja, ...novaPodesavanja };
            await api.patch(`/stanja-uredjaja/${stanje.rbStanje}`, { podesavanja: kompletanJson });
            await fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba);
        } catch (err) { console.error(err); }
    };

    const handleDeleteUredjaj = async () => {
        if (!deviceToDelete) return;
        try {
            await api.delete(`/stanja-uredjaja/${deviceToDelete.rbStanje}`);
            setShowDeleteModal(false);
            setDeviceToDelete(null);
            await fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba);
        } catch (err) {
            console.error("Greška pri brisanju:", err);
            alert("Došlo je do greške prilikom brisanja uređaja.");
        }
    };

    const handleLogout = async () => {
        try { await api.post('/logout'); }
        finally { localStorage.clear(); navigate('/login'); }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-500 font-bold">Učitavanje...</div>;

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            <Sidebar
                stanoviVlasnik={vlasnikStanovi}
                stanoviStanar={stanarStanovi}
                onStanSelect={handleStanSelect}
                selectedStanId={selectedStan?.idStan}
            />

            <div className="flex-1 flex flex-col">
                <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-800/30">
                    <div>
                        <h2 className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                            {selectedSoba ? selectedSoba.nazivSobe : 'Pregled'}
                        </h2>
                        <h1 className="text-xl font-bold">{selectedStan?.adresa || 'Izaberite stan'}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="font-bold">{user?.ime} {user?.prezime}</p>
                            <p className="text-xs text-blue-400 uppercase">{user?.uloga}</p>
                        </div>
                        <button onClick={handleLogout} className="bg-slate-700 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all">Odjavi se</button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-900/50">
                    {selectedStan ? (
                        <div className="animate-in fade-in duration-500">
                            {!selectedSoba ? (
                                <>
                                    <h1 className="text-4xl font-black mb-10 text-white/90">Sobe</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedStan.sobe?.map(soba => (
                                            <SobaCard 
                                                key={soba.rbSoba} 
                                                soba={soba} 
                                                onClick={() => handleSobaSelect(soba)} 
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setSelectedSoba(null)} 
                                        className="mb-6 text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                                    >
                                        ← Nazad na sve sobe
                                    </button>
                                    <h1 className="text-4xl font-black mb-10 text-white/90">Uređaji</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedSoba.stanja_uredjaja?.map(stanje => (
                                            <UredjajCard
                                                key={stanje.rbStanje}
                                                stanje={stanje}
                                                userRole={user?.uloga} 
                                                onToggle={handleToggle} 
                                                onChange={handleSettingsChange} 
                                                onDelete={(device) => { // otvaranje modal dialoga
                                                    setDeviceToDelete(device);
                                                    setShowDeleteModal(true);
                                                }}
                                            />
                                        ))}

                                        {user?.uloga !== 'dete' && (
                                            <button 
                                                onClick={() => setShowAddModal(true)}
                                                className="border-2 border-dashed border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-500/5 transition-all group min-h-[160px]"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-blue-600 transition-colors">
                                                    +
                                                </div>
                                                <span className="text-slate-500 font-bold group-hover:text-blue-400">Dodaj uređaj</span>
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <div className="text-6xl mb-4 text-slate-700">🏠</div>
                            <p className="text-lg font-medium">Izaberite stan iz menija sa leve strane.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALI */}
            <AddDeviceModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)}
                rbSoba={selectedSoba?.rbSoba}
                onDeviceAdded={() => fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba)}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                deviceName={deviceToDelete?.nazivUredjaja}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteUredjaj}
            />
        </div>
    );
};

export default Dashboard;