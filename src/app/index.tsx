import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { POR_PAGINA } from '@/api/pokemon.service';
import { DetallePokemon } from '@/components/DetallePokemon';
import { Brand } from '@/constants/brand';
import { usePokemonLista } from '@/hooks/usePokemon';
import { capitalizar, idDesdeUrl, imagenOficial } from '@/lib/pokemon';

export default function Catalogo() {
  const [pagina, setPagina] = useState(1);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const { data, isLoading, error } = usePokemonLista(pagina);

  if (isLoading) return <ActivityIndicator style={{ flex: 1, backgroundColor: Brand.bg }} color={Brand.accent} />;
  if (error && !data) return <Text style={s.error}>No se pudo cargar: {error.message}</Text>;

  const totalPaginas = data ? Math.ceil(data.count / POR_PAGINA) : 1;

  return (
    <View style={s.pantalla}>
      <FlatList
        data={data?.results}
        keyExtractor={(p) => p.name}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => {
          const id = idDesdeUrl(item.url);
          return (
            <Pressable style={s.fila} onPress={() => setSeleccion(id)}>
              <Image source={imagenOficial(id)} style={s.foto} contentFit="contain" />
              <View style={{ flex: 1 }}>
                <Text style={s.numero}>N.º {String(id).padStart(3, '0')}</Text>
                <Text style={s.nombre}>{capitalizar(item.name)}</Text>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View style={s.pager}>
            <Pressable disabled={!data?.previous} onPress={() => setPagina((p) => p - 1)} style={[s.pagBtn, !data?.previous && { opacity: 0.35 }]}>
              <Text style={s.pagTxt}>Anterior</Text>
            </Pressable>
            <Text style={s.dato}>Página {pagina} de {totalPaginas}</Text>
            <Pressable disabled={!data?.next} onPress={() => setPagina((p) => p + 1)} style={[s.pagBtn, !data?.next && { opacity: 0.35 }]}>
              <Text style={s.pagTxt}>Siguiente</Text>
            </Pressable>
          </View>
        }
      />
      <DetallePokemon id={seleccion} onClose={() => setSeleccion(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Brand.bg },
  error: { color: Brand.danger, padding: 20 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Brand.surface, borderRadius: Brand.radius, padding: 12, borderWidth: 1, borderColor: Brand.border, borderLeftWidth: 4, borderLeftColor: Brand.accent },
  foto: { width: 72, height: 72 },
  numero: { color: Brand.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  nombre: { color: Brand.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  dato: { color: Brand.muted },
  pager: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  pagBtn: { borderWidth: 1, borderColor: Brand.accent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  pagTxt: { color: Brand.accent, fontWeight: '800' },
});