import axios from "axios";

const defaultHeaders = { 'Content-Type': 'application/json' };
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (storedToken) defaultHeaders['Authorization'] = `Bearer ${storedToken}`;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
//   timeout: 10000, // Aborts request if it takes longer than 10 seconds
    withCredentials: true, // Include cookies in requests
  headers: { 'Content-Type': 'application/json' }
});


export default axiosClient;