import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ensureOwnerKey() {
  const existing = localStorage.getItem('ownerKey');
  if (existing) return existing;

  const key = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem('ownerKey', key);
  return key;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'x-owner-key': ensureOwnerKey() }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
