import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Bloque } from '@/components/Bloque';
import { Brand, MAX_CARACTERES_NOTA, mono, ui } from '@/constants/brand';
import { useEditarFavorito } from '@/hooks/useEditarFavorito';
import { useFavoritos } from '@/hooks/useFavoritos';
import { usePendientes } from '@/hooks/usePendientes';
import { Favorito } from '@/types/favorito';
import { fechaCorta } from '@/utils/formato';

function Sello({ pausada }: { pausada: boolean }) {
  return (
    <View style={[s.sello, { backgroundColor: pausada ? Brand.alerta : Brand.acido }]}>
      <Text style={s.selloTxt}>{pausada ? 'PENDIENTE · SIN SEÑAL' : 'ENVIANDO...'}</Text>
    </View>
  );
}

export default function Favoritos() {
  const { data = [], isPending, error } = useFavoritos();
  const { crear, editar: editarPend } = usePendientes();
  const editar = useEditarFavorito();
  const [editando, setEditando] = useState<Favorito | null>(null);
  const [nota, setNota] = useState('');
  const editorScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (editando) editorScrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => subscription.remove();
  }, [editando]);

  const abrir = (f: Favorito) => {
    setEditando(f);
    setNota(f.nota.slice(0, MAX_CARACTERES_NOTA));
  };
  const guardar = () => {
    if (editando) editar.mutate({ ...editando, nota: nota.trim() });
    setEditando(null);
  };

  if (isPending) {
    return (
      <View style={s.cargando}>
        <ActivityIndicator color={Brand.tinta} size="large" />
        <Text style={ui.codigo}>ABRIENDO TU COLECCIÓN...</Text>
      </View>
    );
  }

  return (
    <View style={ui.pantalla}>
      {error && !data.length && (
        <View style={s.error}>
          <Text style={ui.codigo}>FAVORITOS · ERROR DE LECTURA</Text>
          <Text style={s.errorTxt}>No se pudieron cargar tus notas.</Text>
          <Text style={s.errorDetalle}>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={[...data].reverse()}
        keyExtractor={(f) => f.id}
        contentContainerStyle={s.lista}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <View style={s.encabezado}>
              <Text style={ui.codigo}>R&M · COLECCIÓN PERSONAL</Text>
              <Text style={s.tituloFavoritos}>Mis favoritos</Text>
              <Text style={s.subtitulo}>PERSONAJES QUE QUIERES CONSERVAR</Text>
            </View>
            {crear.map((c) => (
              <Bloque key={c.key} color={Brand.alerta} style={s.tarjeta}>
                <Image source={c.vars.imagen} style={s.foto} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={s.nombre}>{c.vars.nombre}</Text>
                  <View style={s.etiquetaNota}><Text style={s.nota}>{c.vars.nota || 'Sin nota'}</Text></View>
                  <Sello pausada={c.pausada} />
                </View>
              </Bloque>
            ))}
          </View>
        }
        ListEmptyComponent={
          crear.length ? null : (
            <View style={s.vacio}>
              <Text style={ui.codigo}>COLECCIÓN VACÍA</Text>
              <Text style={s.vacioTitulo}>Tu próxima ficha empieza en Personajes.</Text>
              <Text style={s.vacioTexto}>Abre un personaje, toca «Guardar en favoritos» y añade una nota.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const pend = editarPend.find((e) => e.vars.id === item.id);
          return (
            <Bloque color={pend ? Brand.alerta : Brand.blanco} style={s.tarjeta}>
              <Image source={item.imagen} style={s.foto} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={ui.codigo}>{fechaCorta(item.creadoEn)} · {(item.especie ?? 'SIN ESPECIE').toUpperCase()}</Text>
                <Text style={s.nombre}>{item.nombre}</Text>
                <View style={s.etiquetaNota}><Text style={s.nota}>{(pend ? pend.vars.nota : item.nota) || 'Sin nota'}</Text></View>
                {pend && <Sello pausada={pend.pausada} />}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar nota de ${item.nombre}`}
                  onPress={() => abrir(item)}
                  style={s.botonEditar}>
                  <Text style={s.editar}>Editar nota</Text>
                </Pressable>
              </View>
            </Bloque>
          );
        }}
      />

      <Modal visible={!!editando} transparent animationType="fade" onRequestClose={() => setEditando(null)}>
        <KeyboardAvoidingView style={s.teclado} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.fondo}>
            <ScrollView
              ref={editorScrollRef}
              style={s.editorScroll}
              contentContainerStyle={s.modalScroll}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive">
              <Bloque color={Brand.fondo} style={s.editorPanel}>
                <View style={s.editorCabecera}>
                  <Image
                    source={editando?.imagen}
                    style={s.editorFoto}
                    contentFit="cover"
                    accessibilityLabel={editando ? `Imagen de ${editando.nombre}` : undefined}
                  />
                  <View style={s.editorIdentidad}>
                    <Text style={s.editorKicker}>NOTA PERSONAL · FAVORITOS</Text>
                    <Text style={s.editorNombre} numberOfLines={2}>{editando?.nombre}</Text>
                  </View>
                </View>
                <TextInput
                  accessibilityLabel={`Nota de favorito para ${editando?.nombre ?? 'personaje'}`}
                  value={nota}
                  onChangeText={setNota}
                  maxLength={MAX_CARACTERES_NOTA}
                  multiline
                  textAlignVertical="top"
                  style={[ui.input, s.editorInput]}
                  placeholder="Escribe o edita tu nota"
                  placeholderTextColor={Brand.gris}
                  onFocus={() => editorScrollRef.current?.scrollToEnd({ animated: true })}
                />
                <Text style={s.contadorNota}>{nota.length}/{MAX_CARACTERES_NOTA} CARACTERES</Text>
                <View style={s.accionesEditor}>
                  <View style={{ flex: 1 }}>
                    <Bloque
                      accessibilityLabel="Cancelar edición de la nota"
                      color={Brand.blanco}
                      onPress={() => setEditando(null)}
                      style={ui.botonCara}>
                      <Text style={ui.botonTxt}>Cancelar</Text>
                    </Bloque>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Bloque
                      accessibilityLabel="Guardar cambios en la nota"
                      color={Brand.cieloMuestra}
                      onPress={guardar}
                      style={ui.botonCara}>
                      <Text style={ui.botonTxt}>Guardar</Text>
                    </Bloque>
                  </View>
                </View>
              </Bloque>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  lista: { padding: 16, gap: 10, flexGrow: 1 },
  encabezado: { backgroundColor: Brand.cieloMuestra, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio, padding: 12 },
  tituloFavoritos: { color: Brand.tinta, fontSize: 27, lineHeight: 33, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.8, transform: [{ rotate: '-1deg' }], marginTop: 4 },
  subtitulo: { color: Brand.tinta, fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.8, marginTop: 2 },
  error: { backgroundColor: Brand.blanco, borderWidth: Brand.borde, borderColor: Brand.peligro, borderRadius: Brand.radio, padding: 14, marginHorizontal: 16, marginTop: 16 },
  errorTxt: { color: Brand.peligro, fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginTop: 8 },
  errorDetalle: { color: Brand.gris, marginTop: 4 },
  vacio: { alignItems: 'center', backgroundColor: Brand.blanco, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio, padding: 20, marginTop: 8 },
  vacioTitulo: { color: Brand.tinta, fontSize: 18, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', marginTop: 10 },
  vacioTexto: { color: Brand.gris, textAlign: 'center', marginTop: 6, lineHeight: 22 },
  tarjeta: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, minHeight: 96 },
  foto: { width: 74, height: 74, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4 },
  nombre: { color: Brand.tinta, fontSize: 17, fontWeight: '900', marginTop: 2 },
  etiquetaNota: { alignSelf: 'flex-start', maxWidth: '100%', backgroundColor: Brand.blanco, borderWidth: 1, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 4, marginTop: 6 },
  nota: { color: Brand.tinta, fontSize: 13, fontWeight: '600', fontStyle: 'italic' },
  botonEditar: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center', marginTop: 2 },
  editar: { color: Brand.tinta, fontWeight: '900', textDecorationLine: 'underline' },
  sello: { alignSelf: 'flex-start', marginTop: 8, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, transform: [{ rotate: '-2deg' }] },
  selloTxt: { color: Brand.tinta, fontFamily: mono, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  fondo: { flex: 1, backgroundColor: '#14110FCC' },
  teclado: { flex: 1 },
  editorScroll: { flex: 1 },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  editorPanel: { padding: 12 },
  editorCabecera: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Brand.cieloMuestra, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, padding: 8, marginBottom: 10 },
  editorFoto: { width: 56, height: 56, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4 },
  editorIdentidad: { flex: 1, minWidth: 0 },
  editorKicker: { color: Brand.tinta, fontFamily: mono, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  editorNombre: { color: Brand.tinta, fontSize: 18, lineHeight: 22, fontWeight: '900', textTransform: 'uppercase', marginTop: 4 },
  editorInput: { minHeight: 100, maxHeight: 180 },
  contadorNota: { alignSelf: 'flex-end', color: Brand.gris, fontFamily: mono, fontSize: 10, fontWeight: '700', marginTop: 5 },
  accionesEditor: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cargando: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: Brand.fondo },
});