import { useMutation } from '@tanstack/react-query';
import { Favorito, NuevoFavorito } from '../types/favorito';
import { mutationKeys } from '../lib/queryKeys';


export function useCrearFavorito() {
  return useMutation<Favorito, Error, NuevoFavorito>({
     mutationKey: mutationKeys.crearFavorito 
    });
}