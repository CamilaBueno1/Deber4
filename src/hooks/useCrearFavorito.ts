import { useMutation } from '@tanstack/react-query';
import { mutationKeys } from '../config/queryKeys';
import { Favorito, NuevoFavorito } from '../types/favorito';

// La función y la invalidación están en setMutationDefaults (config/queryClient.ts)
export function useCrearFavorito() {
  return useMutation<Favorito, Error, NuevoFavorito>({ mutationKey: mutationKeys.crearFavorito });
}