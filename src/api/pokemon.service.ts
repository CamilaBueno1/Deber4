import axios from 'axios';
import { log } from '../lib/logger';
import { Pokemon, RespuestaPokemon } from '../types/personaje';

// Cliente de PokeAPI: API pública de solo lectura
const publico = axios.create({
  baseURL: process.env.EXPO_PUBLIC_POKEAPI_URL ?? 'https://pokeapi.co/api/v2',
});

// Diagnóstico: registra la URL completa cuando una petición falla
publico.interceptors.response.use(
  (r) => r,
  (e) => {
    log(`ERROR ${e.response?.status ?? 'sin respuesta'} → ${e.config ? publico.getUri(e.config) : 'sin config'}`);
    return Promise.reject(e);
  },
);

export const POR_PAGINA = 20;

export const pokemonService = {

  lista: async (pagina: number) =>
    (await publico.get<RespuestaPokemon>('/pokemon', {
      params: { limit: POR_PAGINA, offset: (pagina - 1) * POR_PAGINA },
    })).data,
  detalle: async (id: number) => (await publico.get<Pokemon>(`/pokemon/${id}`)).data,
};