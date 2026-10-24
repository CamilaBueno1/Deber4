export interface Personaje {
  id: number; 
  name: string; 
  status: string; 
  species: string; 
  gender: string;
  image: string; 
  origin: { name: string }; 
  location: { name: string };
}
export interface RespuestaPersonajes {
info: { 
    count: number; 
    pages: number; 
    next: string | null; 
    prev: string | null };
    results: Personaje[];
}