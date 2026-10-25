import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { pokemonService } from '../api/pokemon.service';
import { PUBLICA } from '../lib/cacheConfig';
import { log } from '../lib/logger';
import { queryKeys } from '../lib/queryKeys';

export function usePokemonLista(pagina: number) {
  return useQuery({
    queryKey: queryKeys.pokemon.lista(pagina),
    queryFn: () => {
      log(`GET pokemon página ${pagina} (PokeAPI)`);
      return pokemonService.lista(pagina);
    },
    ...PUBLICA,
    placeholderData: keepPreviousData,
  });
}

export function usePokemonDetalle(id: number | null) {
  return useQuery({
    queryKey: queryKeys.pokemon.detalle(id ?? 0),
    queryFn: () => {
      log(`GET pokemon ${id} (PokeAPI)`);
      return pokemonService.detalle(id as number);
    },
    enabled: id != null,
    ...PUBLICA,
  });
}