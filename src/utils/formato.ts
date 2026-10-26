export const etiquetaEstado = (estado: string) =>
  estado === 'Alive' ? 'VIVO' : estado === 'Dead' ? 'MUERTO' : 'DESCONOCIDO';

export const fechaCorta = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }) : 'Sin fecha';