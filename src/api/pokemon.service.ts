import axios from 'axios';
import { Pokemon, RespuestaPokemon } from '../types/pokemon';


const publico = axios.create({ baseURL: process.env.EXPO_PUBLIC_POKEAPI_URL });

export const POR_PAGINA = 20;

export const pokemonService = {
  lista: async (pagina: number) =>
    (await publico.get<RespuestaPokemon>('/pokemon', {
      params: { limit: POR_PAGINA, offset: (pagina - 1) * POR_PAGINA },
    })).data,
  detalle: async (id: number) => (await publico.get<Pokemon>(`/pokemon/${id}`)).data,
};