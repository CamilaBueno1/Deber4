import { useMutation } from '@tanstack/react-query';
import { Favorito } from '../types/favorito';
import { mutationKeys } from '../lib/queryKeys';

export function useEditarFavorito() {
  return useMutation<Favorito, Error, Favorito>({ 
    mutationKey: mutationKeys.editarFavorito 
});
}