export interface Favorito {
  id: string; 
  pokemonId: number; 
  nombre: string; 
  imagen: string; 
  nota: string; 
  creadoEn: string;
}
export type NuevoFavorito = Omit<Favorito, 'id'>;