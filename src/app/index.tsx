import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Bloque } from '@/components/Bloque';
import { DetallePersonaje } from '@/components/DetallePersonaje';
import { Brand, colorEstado, mono, ui } from '@/constants/brand';
import { usePersonajesLista } from '@/hooks/usePersonaje';
import { Personaje } from '@/types/personaje';
import { etiquetaEstado } from '@/utils/formato';

export default function Personajes() {
  const [pagina, setPagina] = useState(1);
  const [seleccion, setSeleccion] = useState<Personaje | null>(null);
  const { data, error, fetchStatus } = usePersonajesLista(pagina);

  if (!data) {
    return (
      <View style={s.centro}>
        {error ? (
          <View style={s.estadoVacio}>
            <Text style={ui.codigo}>ARCHIVO · ERROR DE LECTURA</Text>
            <Text style={[ui.titulo, s.tituloVacio]}>No se pudo abrir</Text>
            <Text style={s.aviso}>{error.message}</Text>
          </View>
        ) : fetchStatus === 'paused' ? (
          <View style={s.estadoVacio}>
            <Text style={ui.codigo}>ARCHIVO · FUERA DE LÍNEA</Text>
            <Text style={[ui.titulo, s.tituloVacio]}>Aún está vacío</Text>
            <Text style={s.aviso}>No hay fichas guardadas en este dispositivo.{'\n'}Conéctate para cargar el archivo por primera vez.</Text>
          </View>
        ) : (
          <View style={s.estadoVacio}>
            <ActivityIndicator color={Brand.tinta} size="large" />
            <Text style={[ui.codigo, s.cargando]}>CONSULTANDO EL ARCHIVO...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={ui.pantalla}>
      <FlatList
        data={data.results}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={s.lista}
        ListHeaderComponent={
          <Bloque color={Brand.acido} style={s.encabezadoArchivo}>
            <Text style={s.tituloArchivo}>Personajes</Text>
            <Text style={s.subtituloArchivo}>FICHAS · RICK AND MORTY</Text>
          </Bloque>
        }
        renderItem={({ item }) => (
          <Bloque
            accessibilityLabel={`Abrir ficha de ${item.name}, ${etiquetaEstado(item.status)}`}
            onPress={() => setSeleccion(item)}
            style={s.ficha}>
            <View style={[s.franjaEstado, { backgroundColor: colorEstado(item.status) }]} />
            <Image source={item.image} style={s.foto} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={ui.codigo}>#{String(item.id).padStart(4, '0')}</Text>
              <Text style={s.nombre} numberOfLines={1}>{item.name}</Text>
              <Text style={s.especie}>{item.species}</Text>
              <View style={[s.estado, { backgroundColor: colorEstado(item.status) }]}>
                <Text style={s.estadoTxt}>{etiquetaEstado(item.status)}</Text>
              </View>
            </View>
          </Bloque>
        )}
        ListFooterComponent={
          <View style={s.pager}>
            <Bloque
              accessibilityLabel="Ir a la página anterior"
              color={Brand.cielo}
              desactivado={!data.info.prev}
              onPress={() => setPagina((p) => p - 1)}
              style={s.pagBtn}>
              <Text style={ui.botonTxt}>Anterior</Text>
            </Bloque>
            <Text style={ui.codigo}>PÁG. {pagina} / {data.info.pages}</Text>
            <Bloque
              accessibilityLabel="Ir a la página siguiente"
              color={Brand.cielo}
              desactivado={!data.info.next}
              onPress={() => setPagina((p) => p + 1)}
              style={s.pagBtn}>
              <Text style={ui.botonTxt}>Siguiente</Text>
            </Bloque>
          </View>
        }
      />
      <DetallePersonaje personaje={seleccion} onClose={() => setSeleccion(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, backgroundColor: Brand.fondo, alignItems: 'center', justifyContent: 'center', padding: 28 },
  estadoVacio: { width: '100%', maxWidth: 360, alignItems: 'center', backgroundColor: Brand.blanco, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio, padding: 22 },
  tituloVacio: { marginTop: 12, textAlign: 'center' },
  aviso: { color: Brand.gris, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  cargando: { marginTop: 16 },
  lista: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16, gap: 9 },
  encabezadoArchivo: { padding: 12, marginBottom: 3 },
  tituloArchivo: { color: Brand.tinta, fontSize: 28, lineHeight: 33, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.8, marginTop: 3 },
  subtituloArchivo: { color: Brand.tinta, fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginTop: 3 },
  ficha: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 7, minHeight: 90 },
  franjaEstado: { width: 6, alignSelf: 'stretch', borderWidth: 1, borderColor: Brand.tinta, borderRadius: 2 },
  foto: { width: 68, height: 68, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4 },
  nombre: { color: Brand.tinta, fontSize: 18, fontWeight: '900', marginTop: 2 },
  especie: { color: Brand.gris, marginTop: 1 },
  estado: { alignSelf: 'flex-start', minHeight: 24, justifyContent: 'center', marginTop: 6, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  estadoTxt: { fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.8, color: Brand.tinta },
  pager: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5, paddingTop: 8, paddingBottom: 6 },
  pagBtn: { minWidth: 76, minHeight: 44, paddingVertical: 7, paddingHorizontal: 8, alignItems: 'center' },
});