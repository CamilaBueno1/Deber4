import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Brand } from '@/constants/brand';
import { useEditarFavorito } from '@/hooks/useEditarFavorito';
import { useFavoritos } from '@/hooks/useFavoritos';
import { usePendientes } from '@/hooks/usePendientes';
import { Favorito } from '@/types/favorito';

function Badge({ pausada }: { pausada: boolean }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeTxt}>{pausada ? 'PENDIENTE · SIN RED' : 'ENVIANDO...'}</Text>
    </View>
  );
}

export default function Favoritos() {
  const { data = [], isLoading, error } = useFavoritos();
  const { crear, editar: editarPend } = usePendientes();
  const editar = useEditarFavorito();
  const [editando, setEditando] = useState<Favorito | null>(null);
  const [nota, setNota] = useState('');

  const abrir = (f: Favorito) => { setEditando(f); setNota(f.nota); };
  const guardar = () => {
    if (editando) editar.mutate({ ...editando, nota: nota.trim() });
    setEditando(null);
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1, backgroundColor: Brand.bg }} color={Brand.accent} />;

  return (
    <View style={s.pantalla}>
      {error && !data.length && <Text style={s.error}>Sin datos: {error.message}</Text>}
      <FlatList
        data={[...data].reverse()}
        keyExtractor={(f) => f.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            {crear.map((c) => (
              <View key={c.key} style={[s.card, { borderColor: Brand.accent2 }]}>
                <Image source={c.vars.imagen} style={s.foto} contentFit="contain" />
                <View style={{ flex: 1 }}>
                  <Text style={s.nombre}>{c.vars.nombre}</Text>
                  <Text style={s.nota}>{c.vars.nota || 'Sin nota'}</Text>
                  <Badge pausada={c.pausada} />
                </View>
              </View>
            ))}
          </View>
        }
        ListEmptyComponent={crear.length ? null : <Text style={s.nota}>Aún no tienes favoritos. Guarda uno desde la Pokédex.</Text>}
        renderItem={({ item }) => {
          const pend = editarPend.find((e) => e.vars.id === item.id);
          return (
            <View style={[s.card, pend && { borderColor: Brand.accent2 }]}>
              <Image source={item.imagen} style={s.foto} contentFit="contain" />
              <View style={{ flex: 1 }}>
                <Text style={s.nombre}>{item.nombre}</Text>
                <Text style={s.nota}>{(pend ? pend.vars.nota : item.nota) || 'Sin nota'}</Text>
                {pend && <Badge pausada={pend.pausada} />}
                <Pressable onPress={() => abrir(item)} style={s.editar}>
                  <Text style={s.editarTxt}>Editar nota</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      <Modal visible={!!editando} transparent animationType="fade" onRequestClose={() => setEditando(null)}>
        <View style={s.fondo}>
          <View style={s.hoja}>
            <Text style={s.nombre}>Editar nota de {editando?.nombre}</Text>
            <TextInput value={nota} onChangeText={setNota} multiline style={s.input} placeholderTextColor={Brand.muted} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Pressable style={[s.btn, s.btnSec]} onPress={() => setEditando(null)}><Text style={{ color: Brand.text }}>Cancelar</Text></Pressable>
              <Pressable style={s.btn} onPress={guardar}><Text style={{ color: '#fff', fontWeight: '900' }}>Guardar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Brand.bg },
  error: { color: Brand.danger, padding: 16 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Brand.surface, borderRadius: Brand.radius, padding: 12, borderWidth: 1, borderColor: Brand.border },
  foto: { width: 72, height: 72 },
  nombre: { color: Brand.text, fontSize: 16, fontWeight: '800' },
  nota: { color: Brand.muted, marginTop: 4 },
  badge: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: Brand.accent2, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { color: Brand.bg, fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  editar: { alignSelf: 'flex-start', marginTop: 8 },
  editarTxt: { color: Brand.accent, fontWeight: '800' },
  fondo: { flex: 1, backgroundColor: '#000B', justifyContent: 'center', padding: 20 },
  hoja: { backgroundColor: Brand.surface, borderRadius: 22, padding: 20 },
  input: { backgroundColor: Brand.bg, borderColor: Brand.border, borderWidth: 1, borderRadius: Brand.radius, color: Brand.text, padding: 12, marginTop: 12, minHeight: 80 },
  btn: { flex: 1, backgroundColor: Brand.accent, borderRadius: Brand.radius, padding: 13, alignItems: 'center' },
  btnSec: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Brand.border },
});