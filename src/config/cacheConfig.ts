const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

// Tiempo máximo que el persister conserva la caché en AsyncStorage
export const MAX_AGE = DIA;

// Rick and Morty: catálogo casi estático. gcTime (3 días) >= maxAge
export const PUBLICA = { staleTime: 45 * MIN, gcTime: 3 * DIA };
// MockAPI: datos del usuario, cambian más. gcTime = maxAge
export const PROPIA = { staleTime: 30 * 1000, gcTime: MAX_AGE };