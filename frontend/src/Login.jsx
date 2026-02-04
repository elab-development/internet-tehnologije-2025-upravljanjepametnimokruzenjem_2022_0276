import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from './api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; 

        setLoading(true); 

        try {
            const response = await api.post('/login', {
                username: username,
                password: password
            });

            localStorage.setItem('access_token', response.data.access_token);

            navigate('/dashboard');
        } catch (err) {
            console.error('Greška:', err.response?.data);
            alert('Greška pri logovanju. Proveri podatke.');
        } finally {
            setLoading(false); // Otključaj dugme (bilo da je uspelo ili puklo)
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center w-full">
            <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 w-96">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Prijava</h2>

                <div className="mb-4">
                    <label className="block text-slate-400 mb-2">Korisničko ime</label>
                    <input
                        type="text"
                        disabled={loading}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-slate-400 mb-2">Lozinka</label>
                    <input
                        type="password"
                        disabled={loading}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-bold py-2 rounded transition flex items-center justify-center ${loading
                        ? 'bg-blue-800 cursor-not-allowed text-slate-300'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin mr-2">◌</span> Prijava u toku...
                        </>
                    ) : 'Uloguj se'}
                </button>
            </form>
            <p className="text-slate-400 mt-6 text-center text-sm">
                Nemate nalog?{' '}
                <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium underline">
                    Registruj se
                </Link>
            </p>
        </div>
    );
};

export default Login;