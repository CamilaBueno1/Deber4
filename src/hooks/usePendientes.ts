import { useMutationState } from '@tanstack/react-query';
import { mutationKeys } from '../config/queryKeys';
import { Favorito, NuevoFavorito } from '../types/favorito';

export function usePendientes() {
  const crear = useMutationState({
    filters: { mutationKey: mutationKeys.crearFavorito, status: 'pending' },
    select: (m) => ({ key: m.mutationId, vars: m.state.variables as NuevoFavorito, pausada: m.state.isPaused }),
  });
  const editar = useMutationState({
    filters: { mutationKey: mutationKeys.editarFavorito, status: 'pending' },
    select: (m) => ({ key: m.mutationId, vars: m.state.variables as Favorito, pausada: m.state.isPaused }),
  });
  return { crear, editar };
}