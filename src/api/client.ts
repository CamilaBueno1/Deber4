import axios from 'axios';

// Cliente de MockAPI
export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});