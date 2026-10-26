import { ReactNode, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Brand } from '@/constants/brand';

const SOMBRA = 5;

type Props = {
  children: ReactNode;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  desactivado?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Bloque({
  children,
  color = Brand.blanco,
  onPress,
  accessibilityLabel,
  desactivado = false,
  style,
}: Props) {
  const [hundido, setHundido] = useState(false);

  const cuerpo = (
    <View style={[s.contenedor, desactivado && { opacity: 0.45 }]}>
      <View style={s.sombra} />
      <View style={[s.cara, { backgroundColor: color }, hundido && s.hundida, style]}>{children}</View>
    </View>
  );

  if (!onPress) return cuerpo;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: desactivado }}
      disabled={desactivado}
      onPress={onPress}
      onPressIn={() => setHundido(true)}
      onPressOut={() => setHundido(false)}>
      {cuerpo}
    </Pressable>
  );
}

const s = StyleSheet.create({
  contenedor: { marginRight: SOMBRA, marginBottom: SOMBRA },
  sombra: {
    position: 'absolute',
    top: SOMBRA,
    left: SOMBRA,
    right: -SOMBRA,
    bottom: -SOMBRA,
    backgroundColor: Brand.tinta,
    borderRadius: Brand.radio,
  },
  cara: { borderWidth: Brand.borde, borderColor: Brand.tinta, borderRadius: Brand.radio },
  hundida: { transform: [{ translateX: SOMBRA - 1 }, { translateY: SOMBRA - 1 }] },
});