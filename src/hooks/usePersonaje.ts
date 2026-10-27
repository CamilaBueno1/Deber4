import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { personajesService } from '../api/personajes.service'
import { PUBLICA } from '../config/cacheConfig';
import { queryKeys } from '../config/queryKeys';
import { Personaje } from '../types/personaje';
import { log } from '../utils/logger';

export function usePersonajesLista(pagina: number) {
  return useQuery({
    queryKey: queryKeys.personajes.lista(pagina),
    queryFn: () => {
      log(`Consultando personajes: pagina=${pagina} (API Rick and Morty)`);
      return personajesService.lista(pagina);
    },
    ...PUBLICA,
    placeholderData: keepPreviousData,
  });
}

// El personaje de la lista se usa como valor provisional:
// el detalle se ve al instante, incluso sin conexión.
export function usePersonajeDetalle(base: Personaje | null) {
  const id = base?.id ?? 0;
  return useQuery({
    queryKey: queryKeys.personajes.detalle(id),
    queryFn: () => {
      log(`Consultando detalle del personaje: id=${id} (API Rick and Morty)`);
      return personajesService.detalle(id);
    },
    enabled: base != null,
    placeholderData: base ?? undefined,
    ...PUBLICA,
  });
}