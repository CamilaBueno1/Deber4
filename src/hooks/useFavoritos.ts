import { useQuery } from '@tanstack/react-query';
import { favoritosService } from '../api/favoritos.service';
import { PROPIA } from '../lib/cacheConfig';
import { log } from '../lib/logger';
import { queryKeys } from '../lib/queryKeys';

export function useFavoritos() {
  return useQuery({
    queryKey: queryKeys.favoritos.lista(),
    queryFn: () => {
      log('GET favoritos (MockAPI)');
      return favoritosService.lista();
    },
    ...PROPIA,
  });
}