import { StyleSheet, Text, View } from 'react-native';
import { Brand, mono } from '@/constants/brand';
import { useOnline } from '@/hooks/useOnline';

export function EstadoRed() {
  const online = useOnline();
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={online ? 'Con conexión a internet' : 'Sin conexión a internet'}
      style={[s.caja, { backgroundColor: online ? Brand.acido : Brand.blanco }]}>
      <View style={[s.punto, { backgroundColor: online ? Brand.tinta : Brand.gris }]} />
      <Text style={s.txt}>{online ? 'EN LÍNEA' : 'SIN SEÑAL'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  caja: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Brand.tinta, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, marginRight: 14 },
  punto: { width: 7, height: 7, borderRadius: 1 },
  txt: { fontFamily: mono, fontSize: 10, fontWeight: '900', letterSpacing: 0.8, color: Brand.tinta },
});