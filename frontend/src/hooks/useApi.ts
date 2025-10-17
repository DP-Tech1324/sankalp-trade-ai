import axios from 'axios';
export const API_BASE = import.meta.env.VITE_API_BASE || "https://sankalp-trade-ai.vercel.app";
export const api = axios.create({ baseURL: API_BASE });
