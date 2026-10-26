import { useMutation } from '@tanstack/react-query';
import { mutationKeys } from '../config/queryKeys';
import { Favorito } from '../types/favorito';

export function useEditarFavorito() {
  return useMutation<Favorito, Error, Favorito>({ mutationKey: mutationKeys.editarFavorito });
}