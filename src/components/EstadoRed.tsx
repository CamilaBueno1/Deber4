import { StyleSheet, Text, View } from 'react-native';
import { Brand } from '@/constants/brand';
import { useOnline } from '@/hooks/useOnline';

export function EstadoRed() {
  const online = useOnline();
  const color = online ? Brand.ok : Brand.danger;
  return (
    <View style={[s.pill, { borderColor: color }]}>
      <View style={[s.punto, { backgroundColor: color }]} />
      <Text style={[s.txt, { color }]}>{online ? 'EN LÍNEA' : 'SIN RED'}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  pill: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 6, 
    borderWidth: 1, 
    borderRadius: 20, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    marginRight: 14 
},
  punto: { 
    width: 7, 
    height: 7, 
    borderRadius: 4 
},
  txt: { 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 0.8 
},
});