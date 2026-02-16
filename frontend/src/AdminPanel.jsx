import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('users'); // 'users' ili 'devices'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [editingUserId, setEditingUserId] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    // Modali
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

    // Forme
    const [newUser, setNewUser] = useState({
        ime: '', prezime: '', username: '', password: '', uloga: 'obican'
    });
    const [newDevice, setNewDevice] = useState({
        marka: '', model: '', tipUredjaja: ''
    });

    const [editingDeviceId, setEditingDeviceId] = useState(null);
    const [editDeviceData, setEditDeviceData] = useState({ marka: '', model: '', tipUredjaja: '' });

    useEffect(() => {
        // Postavi naslov stranice
        document.title = "SmartHome | Admin";

        const initAdmin = async () => {
            setLoading(true); // Osiguraj da loading krene odmah
            try {
                const userRes = await api.get('/me');
                if (userRes.data.uloga !== 'admin') {
                    navigate('/dashboard');
                    return;
                }
                setUser(userRes.data);
                // Odmah učitaj korisnike nakon što potvrdiš da je admin
                const res = await api.get('/korisnici');
                setData(res.data);
                setView('users');
            } catch (err) {
                console.error("Auth error:", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        initAdmin();
    }, [navigate]);

    const fetchData = async (resource) => {
        setLoading(true);
        try {
            const res = await api.get(`/${resource}`);
            setData(res.data);
            setView(resource === 'korisnici' ? 'users' : 'devices');
        } catch (err) {
            console.error("Greška pri učitavanju podataka:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- AKCIJE ZA KORISNIKE ---
    const saveNewPassword = async (idKorisnik) => {
        if (newPassword.length < 6) return alert("Lozinka mora imati bar 6 karaktera!");
        try {
            await api.patch(`/korisnici/${idKorisnik}`, { password: newPassword });
            setEditingUserId(null);
            setNewPassword('');
            alert("Lozinka uspešno promenjena!");
        } catch (err) { alert("Greška pri čuvanju lozinke."); }
    };

    const deleteUser = async (id, ime) => {
        if (window.confirm(`Da li ste sigurni da želite da obrišete korisnika ${ime}?`)) {
            try {
                await api.delete(`/korisnici/${id}`);
                fetchData('korisnici');
            } catch (err) { alert("Greška pri brisanju korisnika."); }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/korisnici', newUser);
            setShowAddUserModal(false);
            setNewUser({ ime: '', prezime: '', username: '', password: '', uloga: 'obican' });
            fetchData('korisnici');
        } catch (err) { alert(err.response?.data?.message || "Greška pri dodavanju korisnika."); }
    };

    // --- AKCIJE ZA UREĐAJE ---
    const handleAddDevice = async (e) => {
        e.preventDefault();
        try {
            await api.post('/uredjaji', newDevice);
            setShowAddDeviceModal(false);
            setNewDevice({ marka: '', model: '', tipUredjaja: '' });
            fetchData('uredjaji');
            alert("Uređaj uspešno dodat!");
        } catch (err) { alert("Greška pri dodavanju uređaja."); }
    };

    const deleteDevice = async (id, model) => {
        if (window.confirm(`Obrisati uređaj ${model}?`)) {
            try {
                await api.delete(`/uredjaji/${id}`);
                fetchData('uredjaji');
            } catch (err) { alert("Nije moguće obrisati uređaj."); }
        }
    };

    const handleEditDevice = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/uredjaji/${editingDeviceId}`, editDeviceData);
            setEditingDeviceId(null);
            fetchData('uredjaji');
            alert("Uređaj uspešno ažuriran!");
        } catch (err) {
            console.error(err.response?.data);
            alert(err.response?.data?.message || "Greška pri izmeni uređaja.");
        }
    };

    if (loading && !user) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-blue-500 font-bold animate-pulse text-2xl font-mono uppercase tracking-widest">
                    Ucitavanje...
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-800/50 border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-black text-amber-500">🛡️ Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => fetchData('korisnici')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        👥 Korisnici
                    </button>
                    <button
                        onClick={() => fetchData('uredjaji')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'devices' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        🔌 Uređaji
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">← Nazad na Dashboard</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-800/20">
                    <h1 className="text-xl font-bold italic uppercase tracking-tighter text-slate-200">
                        Upravljanje <span className="text-blue-500">{view === 'users' ? 'Korisnicima' : 'Uređajima'}</span>
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-900">
                    {loading ? (
                        <div className="text-blue-500 font-bold animate-pulse text-center mt-20 text-xl font-mono uppercase">Učitavanje podataka...</div>
                    ) : (
                        <>
                            <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-800/60 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                        <tr>
                                            {view === 'users' ? (
                                                <>
                                                    <th className="px-6 py-5">ID</th>
                                                    <th className="px-6 py-5">Korisnik</th>
                                                    <th className="px-6 py-5">Username</th>
                                                    <th className="px-6 py-5">Uloga / Akcije</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-6 py-5">ID</th>
                                                    <th className="px-6 py-5">Marka</th>
                                                    <th className="px-6 py-5">Model</th>
                                                    <th className="px-6 py-5">Tip</th>
                                                    <th className="px-6 py-5 text-right">Akcije</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {data.map((item) => (
                                            <tr key={item.idKorisnik || item.idUredjaj} className="hover:bg-blue-500/5 transition-colors group">
                                                {view === 'users' ? (
                                                    <>
                                                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{item.idKorisnik}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-200">{item.ime} {item.prezime}</td>
                                                        <td className="px-6 py-4 text-blue-400/80 font-medium">{item.username}</td>
                                                        <td className="px-6 py-4">
                                                            {editingUserId === item.idKorisnik ? (
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="password"
                                                                        placeholder="Nova lozinka"
                                                                        className="bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-1 text-sm text-white"
                                                                        value={newPassword}
                                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                                        autoFocus
                                                                    />
                                                                    <button onClick={() => saveNewPassword(item.idKorisnik)} className="text-green-500" title="Sačuvaj">✔</button>
                                                                    <button onClick={() => setEditingUserId(null)} className="text-slate-500">✖</button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-between min-w-[140px]">
                                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${item.uloga === 'admin' ? 'bg-amber-500/20 text-amber-500' : item.uloga === 'dete' ? 'bg-purple-500/20 text-purple-500' : 'bg-slate-700/50 text-slate-300'}`}>
                                                                        {item.uloga}
                                                                    </span>
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => setEditingUserId(item.idKorisnik)} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg" title="Promeni lozinku">🔑</button>
                                                                        <button onClick={() => deleteUser(item.idKorisnik, item.ime)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg" title="Obriši korisnika">🗑️</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{item.idUredjaj}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-200">{item.marka}</td>
                                                        <td className="px-6 py-4 text-blue-400/80 font-medium">{item.model}</td>
                                                        <td className="px-6 py-4 italic text-slate-400 text-sm">{item.tipUredjaja}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingDeviceId(item.idUredjaj);
                                                                    setEditDeviceData({ marka: item.marka, model: item.model, tipUredjaja:item.tipUredjaja });
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                                                title="Izmeni uređaj"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => deleteDevice(item.idUredjaj, item.model)}
                                                                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                                title="Obriši uređaj"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-center mt-12 pb-10">
                                <button
                                    onClick={() => view === 'users' ? setShowAddUserModal(true) : setShowAddDeviceModal(true)}
                                    className="group flex items-center gap-4 bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 px-10 py-4 rounded-[2rem] transition-all duration-300 shadow-2xl active:scale-95"
                                >
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-slate-800 transition-colors text-xl font-bold">+</div>
                                    <span className="block text-base font-bold text-white uppercase tracking-tight">
                                        Dodaj {view === 'users' ? 'novog korisnika' : 'novi uređaj'}
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* MODALI OSTALI ISTI KAO TVOJI... */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Novi Profil</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Ime" required value={newUser.ime} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewUser({ ...newUser, ime: e.target.value })} />
                                <input type="text" placeholder="Prezime" required value={newUser.prezime} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewUser({ ...newUser, prezime: e.target.value })} />
                            </div>
                            <input type="text" placeholder="Username" required value={newUser.username} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                            <input type="password" placeholder="Lozinka" required value={newUser.password} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                            <select
                                value={newUser.uloga}
                                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white font-bold"
                                onChange={(e) => setNewUser({ ...newUser, uloga: e.target.value })}
                            >
                                <option value="obican">Običan</option>
                                <option value="admin">Admin</option>
                                <option value="dete">Dete</option>
                            </select>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl mt-4 transition-all">KREIRAJ PROFIL</button>
                            <button type="button" onClick={() => setShowAddUserModal(false)} className="w-full text-slate-500 text-sm mt-2">ZATVORI</button>
                        </form>
                    </div>
                </div>
            )}

            {showAddDeviceModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter text-amber-500">Novi Uređaj</h2>
                        <form onSubmit={handleAddDevice} className="space-y-4">
                            <input type="text" placeholder="Marka (npr. Apple)" required value={newDevice.marka} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewDevice({ ...newDevice, marka: e.target.value })} />
                            <input type="text" placeholder="Model (npr. iPhone 15)" required value={newDevice.model} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white" onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })} />
                            <select
                                value={newDevice.tipUredjaja}
                                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white font-bold"
                                required
                                onChange={(e) => setNewDevice({ ...newDevice, tipUredjaja: e.target.value })}
                            >
                                <option value="">Odaberi tip uređaja...</option>
                                <option value="Klima">Klima</option>
                                <option value="Svetlo">Svetlo</option>
                                <option value="Grejalica">Grejalica</option>
                            </select>
                            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl mt-4 transition-all uppercase tracking-widest">Registruj Uređaj</button>
                            <button type="button" onClick={() => setShowAddDeviceModal(false)} className="w-full text-slate-500 text-sm mt-2 font-bold italic">ODUSTANI</button>
                        </form>
                    </div>
                </div>
            )}

            {editingDeviceId && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter text-blue-500">Izmena Uređaja</h2>
                        <form onSubmit={handleEditDevice} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Marka</label>
                                <input
                                    type="text"
                                    required
                                    value={editDeviceData.marka}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white mt-1"
                                    onChange={(e) => setEditDeviceData({ ...editDeviceData, marka: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-2">Model</label>
                                <input
                                    type="text"
                                    required
                                    value={editDeviceData.model}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white mt-1"
                                    onChange={(e) => setEditDeviceData({ ...editDeviceData, model: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl mt-4 transition-all">
                                SAČUVAJ IZMENE
                            </button>
                            <button type="button" onClick={() => setEditingDeviceId(null)} className="w-full text-slate-500 text-sm mt-2 font-bold uppercase">
                                Odustani
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;