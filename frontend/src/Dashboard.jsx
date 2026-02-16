import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import Sidebar from './components/Sidebar';
import SobaCard from './components/SobaCard';
import UredjajCard from './components/UredjajCard';
import AddDeviceModal from './modals/AddDeviceModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import CreateStanModal from './modals/CreateStanModal';
import ConfirmDeleteStanModal from './modals/ConfirmDeleteStanModal';
import EditStanModal from './modals/EditStanModal';
import ManageStanariModal from './modals/ManageStanariModal';
import CreateSobaModal from './modals/CreateSobaModal';
import ConfirmDeleteSobaModal from './modals/ConfirmDeleteSobaModal';
import EditSobaModal from './modals/EditSobaModal';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [vlasnikStanovi, setVlasnikStanovi] = useState([]);
    const [stanarStanovi, setStanarStanovi] = useState([]);
    const [selectedStan, setSelectedStan] = useState(null);
    const [selectedSoba, setSelectedSoba] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);

    // State za dodavanje stana - samo otvara modal
    const [showCreateStanModal, setShowCreateStanModal] = useState(false);

    // State za brisanje stana
    const [isConfirmDeleteStanOpen, setIsConfirmDeleteStanOpen] = useState(false);
    const [stanZaBrisanje, setStanZaBrisanje] = useState(null);

    // State za brisanje uređaja
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);

    // State za edit stana
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stanZaEdit, setStanZaEdit] = useState(null);

    // State za izmenu stanara stana - Dodavanje/brisanje stanara
    const [isManageStanariOpen, setIsManageStanariOpen] = useState(false);
    const [stanZaMenjanjeStanara, setStanZaMenjanjeStanara] = useState(null);

    // State za dodavanje sobe
    const [showCreateSobaModal, setShowCreateSobaModal] = useState(false);

    // State za brisanje sobe
    const [isDeleteSobaModalOpen, setIsDeleteSobaModalOpen] = useState(false);
    const [sobaZaBrisanje, setSobaZaBrisanje] = useState(null);

    // State za edit sobe
    const [isEditSobaModalOpen, setIsEditSobaModalOpen] = useState(false);
    const [sobaZaEdit, setSobaZaEdit] = useState(null);


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
            setShowDeleteModal(false); // Zatvara modal za brisanje uredjaja iz sobe
            setDeviceToDelete(null);
            await fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba);
        } catch (err) {
            console.error("Greška pri brisanju:", err);
            alert("Došlo je do greške prilikom brisanja uređaja.");
        }
    };



    const handleLogout = async () => {
        try {
            await api.post('/logout');
        }
        finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    // otvara modal za brisanje stana
    const openDeleteStanModal = (stan) => {
        setStanZaBrisanje(stan);
        setIsConfirmDeleteStanOpen(true);
    };

    // nakon sto je obrisan stan se zove
    const handleAfterDeleteStan = (obrisanStanId) => {
        if (selectedStan?.idStan === obrisanStanId) {
            setSelectedStan(null);
            setSelectedSoba(null);
        }

        fetchStanovi();
    };


    // otvara modal za edit stana
    const handleEditClick = (stan) => {
        setStanZaEdit(stan);
        setIsEditModalOpen(true);
    };

    // otvara modal za izmenu stanara u stanu
    const handleManageStanariClick = (stan) => {
        setStanZaMenjanjeStanara(stan);
        setIsManageStanariOpen(true);
    };

    // Radi refresh, da se odmah vidi promena stanara u stanu - na modalu
    const handleStanarUpdate = async () => {
        // 1. Povuci sve sveže podatke (ovo postavlja vlasnikStanovi i stanarStanovi)
        await fetchStanovi(selectedStan?.idStan, selectedSoba?.rbSoba);

        // pronadji taj stan u vec osvezenim listama
        // modal dobija najnoviju verziju stana sa novim stanarom
        setVlasnikStanovi((prevVlasnik) => {
            const svezStan = prevVlasnik.find(s => s.idStan === stanZaMenjanjeStanara.idStan);
            if (svezStan) setStanZaMenjanjeStanara(svezStan);
            return prevVlasnik;
        });
    };

    // Otvara modal za brisanje sobe
    const openDeleteSobaModal = (soba) => {
        setSobaZaBrisanje(soba);
        setIsDeleteSobaModalOpen(true);
    };

    // Otvara modal za editovanje sobe
    const openEditSobaModal = (soba) => {
        setSobaZaEdit(soba);
        setIsEditSobaModalOpen(true);
    };


    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-500 font-bold">Učitavanje...</div>;

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            <Sidebar
                stanoviVlasnik={vlasnikStanovi}
                stanoviStanar={stanarStanovi}
                onStanSelect={handleStanSelect}
                selectedStanId={selectedStan?.idStan}
                userRole={user?.uloga} // Prosleđujemo ulogu
                onCreateStan={() => setShowCreateStanModal(true)} // Otvaramo modal za kreiranje
                onDeleteStan={openDeleteStanModal}
                onEditStan={handleEditClick}           // Nova funkcija za edit stana
                onManageUsersStan={handleManageStanariClick}
            />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-800/30">
                    <div>
                        <h2 className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                            {selectedSoba ? selectedSoba.nazivSobe : 'Pregled'}
                        </h2>
                        <h1 className="text-xl font-bold">{selectedStan?.adresa || 'Izaberite stan'}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* NOVO: Admin dugme koje vidi samo admin */}
                        {user?.uloga === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-500 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/10"
                            >
                                🛡️ Admin Panel
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="font-bold">{user?.ime} {user?.prezime}</p>
                            <p className="text-xs text-blue-400 uppercase">{user?.uloga}</p>
                        </div>
                        <button onClick={handleLogout} className="bg-slate-700 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all">Odjavi se</button>
                    </div>
                </header>

                {/*Centralni deo*/}
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
                                                onDelete={openDeleteSobaModal}
                                                onEdit={openEditSobaModal} // <--- Dodaj ovo
                                                isVlasnik={user?.uloga !== 'dete' && selectedStan.vlasnik_id === user?.idKorisnik}
                                            />
                                        ))}

                                        {user?.uloga !== 'dete' && selectedStan.vlasnik_id === user?.idKorisnik && (
                                            <button
                                                onClick={() => setShowCreateSobaModal(true)} // Otvara se modal za dodavanje sobe
                                                className="border-2 border-dashed border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-500/5 transition-all group min-h-[160px]"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-blue-600 transition-colors text-white">
                                                    +
                                                </div>
                                                <span className="text-slate-500 font-bold group-hover:text-blue-400">Nova Soba</span>
                                            </button>
                                        )}
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
                                                onDelete={(device) => {
                                                    setDeviceToDelete(device);
                                                    setShowDeleteModal(true); // Prikazuje modal za brisanje uredjaja iz sobe
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

            {/* Modal za dodavanje uredjaja u sobu */}
            <AddDeviceModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                rbSoba={selectedSoba?.rbSoba}
                onDeviceAdded={() => fetchStanovi(selectedStan.idStan, selectedSoba?.rbSoba)}
            />

            {/* Modal za brisanje uredjaja iz sobe */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                deviceName={deviceToDelete?.nazivUredjaja}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteUredjaj}
            />

            {/* Modal za kreiranje stana */}
            <CreateStanModal
                isOpen={showCreateStanModal}
                onClose={() => setShowCreateStanModal(false)}
                onStanCreated={() => fetchStanovi()}
            />

            {/* Modal za brisanje stana */}
            <ConfirmDeleteStanModal
                isOpen={isConfirmDeleteStanOpen}
                onClose={() => {
                    setIsConfirmDeleteStanOpen(false);
                    setStanZaBrisanje(null);
                }}
                stan={stanZaBrisanje}
                onDeleted={handleAfterDeleteStan}
            />

            {/* Modal za edit stana  */}
            <EditStanModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                stan={stanZaEdit}
                onUpdate={() => fetchStanovi(selectedStan?.idStan, selectedSoba?.rbSoba)} // Osvežava listu nakon svake promene
            />

            {/* Modal za izmenu stanara u stanu */}
            <ManageStanariModal
                isOpen={isManageStanariOpen}
                onClose={() => setIsManageStanariOpen(false)}
                stan={stanZaMenjanjeStanara}
                onUpdate={handleStanarUpdate}
            />

            {/* Modal za dodavanje sobe u stan */}
            <CreateSobaModal
                isOpen={showCreateSobaModal}
                onClose={() => setShowCreateSobaModal(false)}
                stanId={selectedStan?.idStan}
                onSobaCreated={() => fetchStanovi(selectedStan.idStan)}
            />

            {/* Modal za brisanje sobe */}
            <ConfirmDeleteSobaModal
                isOpen={isDeleteSobaModalOpen}
                onClose={() => setIsDeleteSobaModalOpen(false)}
                soba={sobaZaBrisanje}
                onConfirm={() => fetchStanovi(selectedStan.idStan)} // Samo osveži podatke nakon uspešnog API poziva u modalu
            />

            {/* Modal za editovanje sobe */}
            <EditSobaModal
                isOpen={isEditSobaModalOpen}
                onClose={() => setIsEditSobaModalOpen(false)}
                soba={sobaZaEdit}
                onSobaUpdated={() => fetchStanovi(selectedStan.idStan)}
            />

        </div>
    );
};

export default Dashboard;