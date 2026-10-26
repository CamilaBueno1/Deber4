import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { favoritosService } from '../api/favoritos.service';
import { Favorito, NuevoFavorito } from '../types/favorito';
import { log } from '../utils/logger';
import { MAX_AGE } from './cacheConfig';
import { mutationKeys, queryKeys } from './queryKeys';

// 1) QueryClient: gcTime por defecto = maxAge (también para mutaciones)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: MAX_AGE, retry: 1 },
    mutations: { gcTime: MAX_AGE },
  },
});

// 2) Persister con AsyncStorage
export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 500, // escribe en disco como máximo cada 0.5 s
});

// 3) onlineManager conectado a expo-network
onlineManager.setEventListener((setOnline) => {
  const sub = Network.addNetworkStateListener((estado) => {
    const online = !!estado.isConnected;
    log(`Red: ${online ? 'CONECTADO' : 'SIN CONEXIÓN'}`);
    setOnline(online);
  });
  return () => sub.remove();
});

// 4) Funciones de mutación registradas por mutationKey.
//    Las funciones no se guardan en disco: al reabrir la app, TanStack
//    las busca aquí para reanudar las mutaciones pausadas.
queryClient.setMutationDefaults(mutationKeys.crearFavorito, {
  mutationFn: async (vars: NuevoFavorito) => {
    log(`POST favoritos → "${vars.nombre}" enviando a MockAPI...`);
    const creado = await favoritosService.crear(vars);
    log(`POST favoritos OK (id ${creado.id})`);
    return creado;
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
  retry: 2,
});

queryClient.setMutationDefaults(mutationKeys.editarFavorito, {
  mutationFn: async (vars: Favorito) => {
    log(`PUT favoritos/${vars.id} → enviando nota editada...`);
    const editado = await favoritosService.editar(vars);
    log(`PUT favoritos/${vars.id} OK`);
    return editado;
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
  retry: 2,
});

// 5) Se llama en el onSuccess del provider (caché ya restaurada)
export async function alRestaurarCache() {
  // Se lee la red real ANTES de reanudar: onlineManager arranca asumiendo
  // "online" y enviaría las mutaciones estando sin conexión.
  const estado = await Network.getNetworkStateAsync();
  onlineManager.setOnline(!!estado.isConnected);

  const pausadas = queryClient.getMutationCache().getAll().filter((m) => m.state.isPaused).length;
  log(`Caché restaurada desde AsyncStorage · ${pausadas} cambio(s) pendiente(s)`);

  await queryClient.resumePausedMutations();
  if (pausadas > 0 && onlineManager.isOnline()) log('resumePausedMutations() ejecutado');
}