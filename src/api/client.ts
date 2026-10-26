import axios, { AxiosInstance } from 'axios';
import { log } from '../utils/logger';

// Cliente de MockAPI -> datos favoritos ingresados por el usuario 
export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

