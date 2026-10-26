import { Platform, StyleSheet } from 'react-native';

export const Brand = {
  fondo: '#FFF4D6',   
  tinta: '#14110F',  
  acido: '#B8F23A',  
  rosa: '#FF5CA8',
  cielo: '#6EC8FF',
  alerta: '#FFC400',  
  peligro: '#FF4D3D',
  blanco: '#FFFFFF',
  gris: '#6B6659',
  borde: 3,
  radio: 8,
} as const;

export const mono = Platform.select({ ios: 'Menlo', default: 'monospace' });

export const colorEstado = (estado: string) =>
  estado === 'Alive' ? Brand.acido : estado === 'Dead' ? Brand.peligro : Brand.cielo;

export const ui = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Brand.fondo },
  titulo: { fontSize: 26, fontWeight: '900', color: Brand.tinta, textTransform: 'uppercase', letterSpacing: -0.5 },
  codigo: { fontFamily: mono, fontSize: 11, fontWeight: '700', color: Brand.gris, letterSpacing: 1 },
  input: {
    backgroundColor: Brand.blanco,
    borderWidth: Brand.borde,
    borderColor: Brand.tinta,
    borderRadius: Brand.radio,
    padding: 12,
    fontSize: 16,
    color: Brand.tinta,
    minHeight: 84,
    textAlignVertical: 'top',
  },
  botonCara: { paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center' },
  botonTxt: { color: Brand.tinta, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
});