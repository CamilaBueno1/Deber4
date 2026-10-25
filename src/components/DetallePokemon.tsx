import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Brand } from '@/constants/brand';
import { useCrearFavorito } from '@/hooks/useCrearFavorito';
import { usePokemonDetalle } from '@/hooks/usePokemon';
import { capitalizar, imagenOficial } from '@/lib/pokemon';

const ETIQUETA_STAT: Record<string, string> = {
  hp: 'PS', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'At. esp.', 'special-defense': 'Def. esp.', speed: 'Velocidad',
};

export function DetallePokemon({ id, onClose }: { id: number | null; onClose: () => void }) {
  const { data: p, isLoading } = usePokemonDetalle(id);
  const crear = useCrearFavorito();
  const [nota, setNota] = useState('');

  const guardar = () => {
    if (!p) return;
    crear.mutate({
      pokemonId: p.id,
      nombre: capitalizar(p.name),
      imagen: imagenOficial(p.id),
      nota: nota.trim(),
      creadoEn: new Date().toISOString(),
    });
    setNota('');
    onClose();
  };

  return (
    <Modal visible={id != null} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.fondo}>
        <View style={s.hoja}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {isLoading || !p ? (
              <ActivityIndicator color={Brand.accent} />
            ) : (
              <>
                <Image source={imagenOficial(p.id)} style={s.foto} contentFit="contain" />
                <Text style={s.numero}>N.º {String(p.id).padStart(3, '0')}</Text>
                <Text style={s.nombre}>{capitalizar(p.name)}</Text>

                <View style={s.tipos}>
                  {p.types.map((t) => (
                    <View key={t.slot} style={s.tipo}>
                      <Text style={s.tipoTxt}>{t.type.name.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
                <Text style={s.dato}>Altura {p.height / 10} m · Peso {p.weight / 10} kg</Text>

                {p.stats.map((st) => (
                  <View key={st.stat.name} style={s.statFila}>
                    <Text style={s.statEtiqueta}>{ETIQUETA_STAT[st.stat.name] ?? st.stat.name}</Text>
                    <View style={s.statPista}>
                      <View style={[s.statBarra, { width: `${Math.min(st.base_stat / 150, 1) * 100}%` }]} />
                    </View>
                    <Text style={s.statValor}>{st.base_stat}</Text>
                  </View>
                ))}

                <TextInput
                  value={nota}
                  onChangeText={setNota}
                  placeholder="Tu nota sobre este Pokémon"
                  placeholderTextColor={Brand.muted}
                  style={s.input}
                  multiline
                />
                <Pressable style={s.boton} onPress={guardar}>
                  <Text style={s.botonTxt}>Guardar en favoritos</Text>
                </Pressable>
              </>
            )}
            <Pressable onPress={onClose} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: Brand.muted }}>Cerrar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1,
backgroundColor: '#000B', justifyContent: 'flex-end' },
  hoja: { maxHeight: '92%', backgroundColor: Brand.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, borderTopWidth: 3, borderColor: Brand.accent },
  foto: { width: 170, height: 170, alignSelf: 'center' },
  numero: { color: Brand.accent, fontWeight: '900', textAlign: 'center', letterSpacing: 1.2 },
  nombre: { color: Brand.text, fontSize: 26, fontWeight: '900', textAlign: 'center', marginTop: 2 },
  tipos: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10 },
  tipo: { borderWidth: 1, borderColor: Brand.accent, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  tipoTxt: { color: Brand.accent, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  dato: { color: Brand.muted, textAlign: 'center', marginTop: 10, marginBottom: 6 },
  statFila: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  statEtiqueta: { color: Brand.muted, width: 70, fontSize: 12 },
  statPista: { flex: 1, height: 7, borderRadius: 4, backgroundColor: Brand.bg },
  statBarra: { height: 7, borderRadius: 4, backgroundColor: Brand.accent },
  statValor: { color: Brand.text, width: 30, textAlign: 'right', fontWeight: '800', fontSize: 12 },
  input: { backgroundColor: Brand.bg, borderColor: Brand.border, borderWidth: 1, borderRadius: Brand.radius, color: Brand.text, padding: 12, marginTop: 18, minHeight: 70 },
  boton: { backgroundColor: Brand.accent, borderRadius: Brand.radius, padding: 14, alignItems: 'center', marginTop: 14 },
  botonTxt: { color: '#fff', fontWeight: '900' },
});