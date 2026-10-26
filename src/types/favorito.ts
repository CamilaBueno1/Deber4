export interface Favorito {
  id: string;
  personajeId: number;
  nombre: string;
  especie: string;
  imagen: string;
  nota: string;
  creadoEn: string;
}


export type NuevoFavorito = Omit<Favorito, 'id'>;