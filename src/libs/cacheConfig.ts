const MIN = 60 * 1000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

// Tiempo máximo que el persister conserva la caché en AsyncStorage
export const MAX_AGE = DIA;


export const PUBLICA = { staleTime: HORA, gcTime: 7 * DIA };

export const PROPIA = { staleTime: 30 * 1000, gcTime: MAX_AGE };