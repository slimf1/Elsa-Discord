import axios from 'axios';

export const axiosInstance = axios.create({
    timeout: 5000,
    headers: { 'User-Agent': 'Elsa-Mina/1.0.0' }
});
