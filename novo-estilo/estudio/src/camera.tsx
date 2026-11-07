// Câmera e legenda da série. Câmera = enquadra um "mundo" grande (W x H) e anda por ele.
import React from 'react';
import {AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR} from './pecas';

export type Chave = {t: number; x: number; y: number; z: number; r?: number};

/** Interpola chaves (t em segundos dentro da cena). Soco = zoom 110% → 100% em 6 quadros. */
export function posCamera(chaves: Chave[], t: number) {
  if (t <= chaves[0].t) return chaves[0];
  for (let i = 0; i < chaves.length - 1; i++) {
    const a = chaves[i], b = chaves[i + 1];
    if (t <= b.t) {
      const k = Easing.inOut(Easing.cubic)((t - a.t) / Math.max(0.001, b.t - a.t));
      return {t, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k, r: (a.r || 0) + ((b.r || 0) - (a.r || 0)) * k};
    }
  }
  return chaves[chaves.length - 1];
}

export type Limites = {x0: number; y0: number; x1: number; y1: number};
export const Camera: React.FC<{chaves: Chave[]; socos?: number[]; tremor?: number; children: React.ReactNode; W: number; H: number; lim?: Limites}> = ({chaves, socos = [], tremor = 0, children, W, H, lim}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const c = {...posCamera(chaves, t)};
  const L = lim || {x0: 0, y0: 0, x1: W, y1: H};
  // a câmera nunca mostra fora do cenário: zoom mínimo e centro presos aos limites
  c.z = Math.max(c.z, 1080 / (L.x1 - L.x0), 1920 / (L.y1 - L.y0));
  c.x = Math.min(Math.max(c.x, L.x0 + 540 / c.z), L.x1 - 540 / c.z);
  c.y = Math.min(Math.max(c.y, L.y0 + 960 / c.z), L.y1 - 960 / c.z);
  let z = c.z;
  for (const s of socos) {
    const d = (f - s * fps);
    if (d >= 0 && d < 8) z *= 1 + 0.12 * (1 - d / 8) ** 2;
  }
  const tx = tremor ? Math.sin(f * 2.1) * tremor + Math.sin(f * 3.7) * tremor * 0.5 : 0;
  const ty = tremor ? Math.cos(f * 2.7) * tremor : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0',
        transform: `translate(${540 + tx}px, ${960 + ty}px) rotate(${c.r || 0}deg) scale(${z}) translate(${-c.x}px, ${-c.y}px)`}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export type Palavra = {w: string; s: number; e: number};
const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Agrupa palavras em blocos de até 3, quebrando em pontuação. */
export function blocos(pal: Palavra[]) {
  const out: Palavra[][] = [];
  let cur: Palavra[] = [];
  for (const p of pal) {
    cur.push(p);
    if (cur.length >= 3 || /[.,:;?!…"]$/.test(p.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}

/** Legenda palavra por palavra. `t` = tempo absoluto do vídeo. */
export const Legenda: React.FC<{pal: Palavra[]; destaques: Set<string>; y: (t: number) => number}> = ({pal, destaques, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const bs = React.useMemo(() => blocos(pal), [pal]);
  let atual: Palavra[] | null = null;
  for (let i = 0; i < bs.length; i++) {
    const ini = bs[i][0].s - 0.05;
    const fim = Math.min(bs[i + 1] ? bs[i + 1][0].s - 0.05 : Infinity, bs[i][bs[i].length - 1].e + 0.7);
    if (t >= ini && t < fim) { atual = bs[i]; break; }
  }
  if (!atual) return null;
  return (
    <div style={{position: 'absolute', left: 40, right: 180, top: y(t), transform: 'translateY(-50%)', textAlign: 'center', lineHeight: 1.0}}>
      {atual.map((p, i) => {
        const k = interpolate(t, [p.s - 0.03, p.s + 0.09], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const hi = destaques.has(norm(p.w));
        const txt = p.w.replace(/["“”]/g, '').toUpperCase();
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 12px', fontFamily: 'Anton, sans-serif', fontSize: hi ? 128 : 112,
            color: hi ? COR.ipe : '#fff', WebkitTextStroke: `16px ${COR.tinta}`, paintOrder: 'stroke fill',
            transform: `scale(${0.6 + 0.4 * k}) translateY(${(1 - k) * 30}px)`, opacity: k < 0.01 ? 0 : 1}}>{txt}</span>
        );
      })}
    </div>
  );
};
