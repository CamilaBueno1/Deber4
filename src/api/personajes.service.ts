import axios from 'axios';
import { Personaje, RespuestaPersonajes } from '../types/personaje';


// Cliente de Rick and Morty: API pública de solo lectura
const publico = axios.create({
  baseURL: process.env.EXPO_PUBLIC_RICKMORTY_URL ?? 'https://rickandmortyapi.com/api',
});


export const personajesService = {
  // La API pagina con el parámetro page
  lista: async (pagina: number) =>
    (await publico.get<RespuestaPersonajes>('/character', { params: { page: pagina } })).data,
  detalle: async (id: number) => (await publico.get<Personaje>(`/character/${id}`)).data,
};