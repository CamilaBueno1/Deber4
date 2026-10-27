import { useQuery } from '@tanstack/react-query';
import { favoritosService } from '../api/favoritos.service';
import { PROPIA } from '../config/cacheConfig';
import { queryKeys } from '../config/queryKeys';
import { log } from '../utils/logger';

export function useFavoritos() {
  return useQuery({
    queryKey: queryKeys.favoritos.lista(),
    queryFn: () => {
      log('Consultando favoritos en MockAPI');
      return favoritosService.lista();
    },
    ...PROPIA,
  });
}