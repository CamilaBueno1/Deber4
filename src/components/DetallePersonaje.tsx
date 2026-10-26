import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Bloque } from '@/components/Bloque';
import { Brand, colorEstado, MAX_CARACTERES_NOTA, mono, ui } from '@/constants/brand';
import { useCrearFavorito } from '@/hooks/useCrearFavorito';
import { usePersonajeDetalle } from '@/hooks/usePersonaje';
import { Personaje } from '@/types/personaje';
import { etiquetaEstado } from '@/utils/formato';

type Props = { personaje: Personaje | null; onClose: () => void };

export function DetallePersonaje({ personaje, onClose }: Props) {
  const { height } = useWindowDimensions();
  const compacto = height < 740;
  const { data } = usePersonajeDetalle(personaje);
  const crear = useCrearFavorito();
  const [nota, setNota] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const p = data ?? personaje;

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (personaje) scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => subscription.remove();
  }, [personaje]);

  const guardar = () => {
    if (!p) return;
    crear.mutate({
      personajeId: p.id,
      nombre: p.name,
      especie: p.species,
      imagen: p.image,
      nota: nota.trim(),
      creadoEn: new Date().toISOString(),
    });
    setNota('');
    onClose();
  };

  return (
    <Modal visible={personaje != null} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.teclado} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.fondo}>
          <View style={[s.hoja, compacto && s.hojaCompacta]}>
            <ScrollView
              ref={scrollRef}
              style={s.scroll}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              contentContainerStyle={s.contenido}>
              {p && (
                <>
                  <View style={[s.hero, compacto && s.heroCompacto]}>
                    <Image source={p.image} style={[s.foto, compacto && s.fotoCompacta]} contentFit="cover" />
                    <View style={s.heroTexto}>
                      <Text style={s.sobretitulo}>ARCHIVO · FICHA #{String(p.id).padStart(4, '0')}</Text>
                      <Text style={[s.nombre, compacto && s.nombreCompacto]} numberOfLines={2}>{p.name}</Text>
                      <View style={[s.estado, { backgroundColor: colorEstado(p.status) }]}>
                        <Text style={s.estadoTxt}>{etiquetaEstado(p.status)}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[s.seccion, compacto && s.seccionCompacta]}>DATOS DE IDENTIDAD</Text>
                  <View style={s.cuadricula}>
                    <Dato titulo="Especie" valor={p.type ? `${p.species} · ${p.type}` : p.species} />
                    <Dato titulo="Género" valor={p.gender} />
                    <Dato titulo="Origen" valor={p.origin.name} />
                    <Dato titulo="Ubicación" valor={p.location.name} />
                  </View>

                  <View style={[s.apariciones, compacto && s.aparicionesCompactas]}>
                    <View>
                      <Text style={s.aparicionesLabel}>REGISTRO DE</Text>
                      <Text style={s.aparicionesTitulo}>APARICIONES</Text>
                    </View>
                    <Text style={s.aparicionesValor}>{p.episode.length}</Text>
                  </View>

                  <Text style={s.notaTitulo}>UNA NOTA PARA RECORDARLO</Text>
                  <TextInput
                    value={nota}
                    onChangeText={setNota}
                    maxLength={MAX_CARACTERES_NOTA}
                    accessibilityLabel="Nota para guardar este personaje en favoritos"
                    placeholder="Escribe por qué quieres conservarlo"
                    placeholderTextColor={Brand.gris}
                    style={[ui.input, s.nota, compacto && s.notaCompacta]}
                    onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    multiline
                    textAlignVertical="top"
                  />
                  <Text style={s.contadorNota}>{nota.length}/{MAX_CARACTERES_NOTA}</Text>
                  <View style={[s.guardar, compacto && s.guardarCompacto]}>
                    <Bloque
                      accessibilityLabel={`Guardar a ${p.name} en favoritos`}
                      color={Brand.acido}
                      onPress={guardar}
                      style={ui.botonCara}>
                      <Text style={ui.botonTxt}>Guardar en favoritos</Text>
                    </Bloque>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar ficha del personaje"
                    onPress={onClose}
                    style={[s.cerrar, compacto && s.cerrarCompacto]}>
                    <Text style={{ color: Brand.tinta, fontWeight: '800', textDecorationLine: 'underline' }}>Cerrar</Text>
                  </Pressable>
                </>
              )}
              {!p && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar ficha del personaje"
                  onPress={onClose}
                  style={s.cerrar}>
                  <Text style={{ color: Brand.tinta, fontWeight: '800', textDecorationLine: 'underline' }}>Cerrar</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View style={s.dato}>
      <Text style={s.filaTitulo} numberOfLines={1}>{titulo}</Text>
      <Text style={s.filaValor} numberOfLines={2} ellipsizeMode="tail">{valor}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#14110FCC', justifyContent: 'flex-end', alignItems: 'stretch' },
  teclado: { flex: 1 },
  hoja: { width: '100%', height: '88%', backgroundColor: Brand.fondo, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio, padding: 14 },
  hojaCompacta: { height: '94%', padding: 8 },
  scroll: { flex: 1 },
  contenido: { flexGrow: 1, justifyContent: 'space-between', paddingBottom: 4 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Brand.blanco, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio, padding: 10 },
  heroCompacto: { gap: 8, padding: 6 },
  foto: { width: 104, height: 116, borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: 4 },
  fotoCompacta: { width: 72, height: 82 },
  heroTexto: { flex: 1, minWidth: 0, alignItems: 'flex-start' },
  sobretitulo: { fontFamily: mono, color: Brand.gris, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  nombre: { color: Brand.tinta, fontSize: 27, lineHeight: 29, fontWeight: '900', textTransform: 'uppercase', letterSpacing: -0.6, marginTop: 6 },
  nombreCompacto: { fontSize: 21, lineHeight: 23 },
  estado: { borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, marginTop: 8 },
  estadoTxt: { fontFamily: mono, fontWeight: '900', fontSize: 9, letterSpacing: 0.6, color: Brand.tinta },
  seccion: { color: Brand.tinta, fontFamily: mono, fontWeight: '900', fontSize: 10, letterSpacing: 0.8, marginTop: 10, marginBottom: 5 },
  seccionCompacta: { marginTop: 6, marginBottom: 3 },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dato: { flexGrow: 1, flexBasis: '46%', minWidth: 0, minHeight: 64, justifyContent: 'center', paddingHorizontal: 9, paddingVertical: 7, backgroundColor: Brand.blanco, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4 },
  filaTitulo: { fontFamily: mono, fontSize: 9, fontWeight: '700', color: Brand.gris, textTransform: 'uppercase', marginBottom: 3 },
  filaValor: { color: Brand.tinta, fontSize: 14, lineHeight: 17, fontWeight: '900' },
  apariciones: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Brand.tinta, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
  aparicionesCompactas: { paddingVertical: 5, marginTop: 5 },
  aparicionesLabel: { color: Brand.fondo, fontFamily: mono, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  aparicionesTitulo: { color: Brand.fondo, fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  aparicionesValor: { color: Brand.acido, fontFamily: mono, fontSize: 22, fontWeight: '900' },
  notaTitulo: { color: Brand.tinta, fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.6, marginTop: 10, marginBottom: 5 },
  guardar: { marginTop: 7 },
  guardarCompacto: { marginTop: 3 },
  nota: { minHeight: 60, padding: 8 },
  notaCompacta: { minHeight: 46, padding: 6 },
  contadorNota: { alignSelf: 'flex-end', color: Brand.gris, fontFamily: mono, fontSize: 10, fontWeight: '700', marginTop: 3 },
  cerrar: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  cerrarCompacto: { minHeight: 36 },
});