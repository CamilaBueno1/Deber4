import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Tabs } from 'expo-router';
import { EstadoRed } from '@/components/EstadoRed';
import { Brand } from '@/constants/brand';
import { MAX_AGE } from '@/lib/cacheConfig';
import { alRestaurarCache, persister, queryClient } from '@/lib/queryClient';

export default function Layout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: MAX_AGE }}
      onSuccess={alRestaurarCache}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: Brand.surface },
          headerTintColor: Brand.text,
          headerRight: () => <EstadoRed />,
          tabBarStyle: { backgroundColor: Brand.surface, borderTopColor: Brand.border },
          tabBarActiveTintColor: Brand.accent,
          tabBarInactiveTintColor: Brand.muted,
        }}>
        <Tabs.Screen name="index" options={{ title: 'Pokédex' }} />
        <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
        <Tabs.Screen name="logs" options={{ title: 'Registro' }} />
      </Tabs>
    </PersistQueryClientProvider>
  );
}