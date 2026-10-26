export type EstadoPersonaje = 'Alive' | 'Dead' | 'unknown';

export interface Personaje {
  id: number;
  name: string;
  status: EstadoPersonaje;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];
}

export interface RespuestaPersonajes {
  info: { 
  count: number; 
  pages: number; 
  next: string | null; 
  prev: string | null 
};
  results: Personaje[];
}