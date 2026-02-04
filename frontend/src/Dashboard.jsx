import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Pozivamo Laravel rutu koju smo dodali u api.php
                const response = await api.get('/me');
                setUser(response.data);
            } catch (err) {
                console.error("Greška pri preuzimanju podataka:", err);
                // Ako token nije validan (401), brišemo sve i pravac login
                localStorage.clear();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        // localStorage.clear();
        // navigate('/login');
        // Klijentski

        try {
            await api.post('/logout');

            console.log("Token je obrisan iz baze.");
        } catch (err) {
            
            console.error("Greška pri odjavi na serveru:", err);
        } finally {
            localStorage.clear();

            navigate('/login');
        }


    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-blue-500 text-xl font-bold animate-pulse">Učitavanje profila...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header / Navigacija */}
            <nav className="max-w-5xl mx-auto flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
                        {user?.ime[0]}{user?.prezime[0]}
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">{user?.ime} {user?.prezime}</h2>
                        <span className="text-slate-400 text-xs uppercase tracking-wider">{user?.uloga}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-slate-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all text-sm font-semibold"
                >
                    Odjavi se
                </button>
            </nav>

            {/* Glavni Sadržaj */}
            <main className="max-w-5xl mx-auto">
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 text-center">
                    <h1 className="text-4xl font-black mb-4">
                        Dobrodošli nazad, <span className="text-blue-400">{user?.ime}</span>!
                    </h1>
                </div>

                {/* Ovde ćemo kasnije dodati grid sa stanovima */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="p-6 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                        <p>Ovde će biti lista tvojih stanova...</p>
                    </div>
                    <div className="p-6 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                        <p>I stanovi gde boraviš...</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;