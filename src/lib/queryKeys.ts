export const queryKeys = {
  pokemon: {
    all: ['pokemon'] as const,
    lista: (pagina: number) => ['pokemon', 'lista', pagina] as const,
    detalle: (id: number) => ['pokemon', 'detalle', id] as const,
  },
  favoritos: {
    all: ['favoritos'] as const,
    lista: () => ['favoritos', 'lista'] as const,
    detalle: (id: string) => ['favoritos', 'detalle', id] as const,
  },
};

export const mutationKeys = {
  crearFavorito: ['favoritos', 'crear'] as const,
  editarFavorito: ['favoritos', 'editar'] as const,
};