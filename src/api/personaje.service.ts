import axios from 'axios';
import { Personaje, RespuestaPersonajes } from '../types/personaje';

const publico = axios.create({ baseURL: 'https://rickandmortyapi.com/api' });

export const personajesService = {lista: async (pagina: number) =>
    (await publico.get<RespuestaPersonajes>
    ('/character', { params: { page: pagina } })).data,
    detalle: async (id: number) => (await publico.get<Personaje>
    (`/character/${id}`)).data,
};