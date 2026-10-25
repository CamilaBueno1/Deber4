
export const idDesdeUrl = (url: string) => Number(url.split('/').filter(Boolean).pop());

// Las imágenes viven en el repositorio público de sprites de PokeAPI,
// con el id en el nombre del archivo. Así no hace falta una petición por Pokémon.
export const imagenOficial = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);