import { client } from './client';
import { Favorito, NuevoFavorito } from '../types/favorito';

export const favoritosService = {
  lista: async () => (await client.get<Favorito[]>('favoritos')).data,
  crear: async (f: NuevoFavorito) => (await client.post<Favorito>('favoritos', f)).data,
  // Se envía el objeto completo para no perder campos con el PUT
  editar: async (f: Favorito) => (await client.put<Favorito>(`favoritos/${f.id}`, f)).data,
};