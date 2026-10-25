import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { favoritosService } from '../api/favoritos.service';
import { Favorito, NuevoFavorito } from '../types/favorito';
import { MAX_AGE } from './cacheConfig';
import { log } from './logger';
import { mutationKeys, queryKeys } from './querykeys';

// QueryClient: gcTime por defecto
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: MAX_AGE, retry: 1 },
    mutations: { gcTime: MAX_AGE },
  },
});

//Persister con AsyncStorage
export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 500, 
});

//onlineManager
onlineManager.setEventListener((setOnline) => {
  const sub = Network.addNetworkStateListener((estado) => {
    const online = !!estado.isConnected;
    log(`Red: ${online ? 'CONECTADO' : 'SIN CONEXIÓN'}`);
    setOnline(online);
  });
  return () => sub.remove();
});

//    Funciones de mutación registradas con mutationKey.
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

//Mutaciones sin conexion

export async function alRestaurarCache() {

  const estado = await Network.getNetworkStateAsync();
  onlineManager.setOnline(!!estado.isConnected);

  const pausadas = queryClient.getMutationCache().getAll().filter((m) => m.state.isPaused).length;
  log(`Caché restaurada desde AsyncStorage · ${pausadas} mutación(es) pendiente(s)`);

  await queryClient.resumePausedMutations();
  if (pausadas > 0 && onlineManager.isOnline()) log('resumePausedMutations() ejecutado');
}