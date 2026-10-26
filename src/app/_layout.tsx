import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { EstadoRed } from '@/components/EstadoRed';
import { Brand, mono } from '@/constants/brand';
import { MAX_AGE } from '@/config/cacheConfig';
import { alRestaurarCache, persister, queryClient } from '@/config/queryClient';

export default function Layout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: MAX_AGE }}
      onSuccess={alRestaurarCache}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: Brand.fondo, borderBottomWidth: Brand.borde, borderBottomColor: Brand.tinta, elevation: 0, shadowOpacity: 0 },
          headerTintColor: Brand.tinta,
          headerTitle: () => null,
          headerLeft: () => (
            <View accessibilityLabel="R&M · Archivo central" accessible style={s.marca}>
              <Text style={s.marcaIniciales}>R&M</Text>
              <Text style={s.marcaArchivo}>ARCHIVO{'\n'}CENTRAL</Text>
            </View>
          ),
          headerLeftContainerStyle: { paddingLeft: 12 },
          headerRight: () => <EstadoRed />,
          headerRightContainerStyle: { paddingRight: 8, paddingLeft: 4 },
          tabBarStyle: { minHeight: 62, backgroundColor: Brand.fondo, borderTopWidth: Brand.borde, borderTopColor: Brand.tinta, paddingHorizontal: 10, paddingVertical: 5, elevation: 0 },
          tabBarItemStyle: { flex: 1, minWidth: 0, minHeight: 48, marginHorizontal: 5, borderRadius: 4 },
          tabBarActiveTintColor: Brand.tinta,
          tabBarInactiveTintColor: Brand.gris,
          tabBarLabelStyle: { fontFamily: mono, fontSize: 11, lineHeight: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.1 },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Personajes' }} />
        <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      </Tabs>
    </PersistQueryClientProvider>
  );
}

const s = StyleSheet.create({
  marca: { maxWidth: 195, minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 9 },
  marcaIniciales: { color: Brand.tinta, fontSize: 30, lineHeight: 34, fontWeight: '900', letterSpacing: -1.4 },
  marcaArchivo: { color: Brand.gris, fontFamily: mono, fontSize: 9, lineHeight: 11, fontWeight: '900', letterSpacing: 0.7 },
});