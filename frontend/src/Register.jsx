import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axios';

const Register = () => {
    // U useState-u postavi početnu ulogu na 'dete'
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        username: '',
        password: '',
        uloga: 'obican'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            await api.post('/register', formData);
            
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                alert('Uspešna registracija!');
                navigate('/dashboard'); 
            }

        } catch (err) {
            console.error('Greška pri registraciji:', err.response?.data);
            alert('Greška! ', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Registracija</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        placeholder="Ime"
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500"
                        onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Prezime"
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500"
                        onChange={(e) => setFormData({ ...formData, prezime: e.target.value })}
                        required
                    />
                </div>

                <input
                    placeholder="Korisničko ime"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white mb-4 outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />

                <input
                    type="password"
                    placeholder="Lozinka"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white mb-4 outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <div className="mb-6">
                    <label className="block text-slate-400 mb-2 text-sm">Tip korisnika:</label>
                    <select
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500"
                        value={formData.uloga}
                        onChange={(e) => setFormData({ ...formData, uloga: e.target.value })}
                    >
                        <option value="dete">Dete</option>
                        <option value="obican">Običan korisnik</option>
                    </select>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition disabled:opacity-50"
                >
                    {loading ? 'Slanje...' : 'Napravi nalog'}
                </button>

                <p className="text-slate-400 mt-4 text-center text-sm">
                    Već imate nalog? <Link to="/login" className="text-blue-500 underline">Prijavi se</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;