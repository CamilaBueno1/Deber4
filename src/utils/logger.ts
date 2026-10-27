export type Entrada = { id: number; hora: string; msg: string };

let entradas: Entrada[] = [];
let contador = 0;
const oyentes = new Set<() => void>();

export function log(msg: string) {
  const d = new Date();
  const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
  console.log(`[${hora}] ${msg}`);
  entradas = [{ id: contador++, hora, msg }, ...entradas].slice(0, 200);
  oyentes.forEach((o) => o());
}
export const suscribirLogs = (o: () => void) => {
  oyentes.add(o);
  return () => {
    oyentes.delete(o);
  };
};
export const obtenerLogs = () => entradas;