/* =====================================================================================
   o-bunker/parte2/camera: a câmera com marcações (mais movimento, pedido do dono em 07/11/2026).
     <Mov chaves={[[quadro, x, y, zoom], ...]} curva? tremor? />
        cada chave diz: no quadro tal, o ponto (x, y) do cenário fica no meio da tela, com tal zoom.
        Entre duas chaves a câmera anda suave (ou rápida, com curva="rapida": o "punch-in" da virada).
        A câmera nunca mostra a borda do cenário (o centro é limitado pelo zoom).
        tremor = câmera na mão (px de balanço; 0 = parada).
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useCenaM } from '../../../cena';
import { H, W } from '../../../kit/pecas';

export type Chave = [number, number, number, number];

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rapida = (t: number) => 1 - Math.pow(1 - t, 4);

export const Mov: React.FC<{ chaves: Chave[]; curva?: 'suave' | 'rapida'; tremor?: number; children: React.ReactNode }> = ({ chaves, curva = 'suave', tremor = 3, children }) => {
  const { frame: f } = useCenaM();
  const ks = [...chaves].sort((a, b) => a[0] - b[0]);
  let [, x, y, z] = ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const [q0, x0, y0, z0] = ks[i];
    const [q1, x1, y1, z1] = ks[i + 1];
    if (f >= q1) {
      [x, y, z] = [x1, y1, z1];
    } else if (f > q0) {
      const t = (curva === 'rapida' ? rapida : suave)((f - q0) / Math.max(1, q1 - q0));
      x = x0 + (x1 - x0) * t;
      y = y0 + (y1 - y0) * t;
      z = z0 + (z1 - z0) * t;
      break;
    } else break;
  }
  z = Math.max(1, z);
  // o centro não deixa a borda do cenário aparecer
  const cx = Math.min(W - W / 2 / z, Math.max(W / 2 / z, x));
  const cy = Math.min(H - H / 2 / z, Math.max(H / 2 / z, y));
  const dx = Math.sin(f / 23) * tremor + Math.sin(f / 9) * tremor * 0.3;
  const dy = Math.cos(f / 29) * tremor;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${W / 2 - cx * z + dx}px, ${H / 2 - cy * z + dy}px) scale(${z})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
