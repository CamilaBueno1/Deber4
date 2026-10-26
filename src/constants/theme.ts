import { Brand, mono } from '@/constants/brand';

const light = {
  text: Brand.tinta,
  textSecondary: Brand.gris,
  background: Brand.fondo,
  backgroundElement: Brand.blanco,
  backgroundSelected: Brand.acido,
  tint: Brand.cielo,
} as const;

export const Colors = {
  light,
  dark: light,
} as const;

export type ThemeColor = keyof typeof light;

export const Fonts = {
  mono,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
} as const;

export const MaxContentWidth = 960;
