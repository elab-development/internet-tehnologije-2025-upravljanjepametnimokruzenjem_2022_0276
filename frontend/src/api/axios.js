import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/api", 
});

// Ovo dodaje token u zaglavlje svakog zahteva ako on postoji u memoriji browsera
// a trebalo bi da postoji nakon logina ili registera
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;