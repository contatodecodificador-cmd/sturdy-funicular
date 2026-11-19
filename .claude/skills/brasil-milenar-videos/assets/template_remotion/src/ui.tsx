import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, F, FPS} from './theme';
import data from './data.json';

const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
export const s2f = (s: number) => Math.round(s * FPS);

// ---------- fundo de espaço (estrelas + nebulosa verde-petróleo/azul) ----------
const rnd = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const STARS = Array.from({length: 420}, (_, i) => ({
  x: rnd(i) * 1920, y: rnd(i + 1000) * 1080, r: rnd(i + 2000) < 0.93 ? 0.6 + rnd(i + 3000) * 1.1 : 1.6 + rnd(i + 4000) * 1.6,
  a: 0.35 + rnd(i + 5000) * 0.65, tw: rnd(i + 6000) * 6.28,
}));
export const Espaco: React.FC<{drift?: number; dim?: number}> = ({drift = 1, dim = 1}) => {
  const f = useCurrentFrame();
  const dx = (f * 0.06 * drift) % 1920;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.bg1} 0%, ${C.bg0} 75%)`}}>
      <AbsoluteFill style={{opacity: 0.55 * dim,
        background: 'radial-gradient(ellipse 55% 40% at 72% 30%, rgba(30,120,130,0.28), transparent 70%), radial-gradient(ellipse 45% 35% at 20% 70%, rgba(40,70,150,0.25), transparent 70%), radial-gradient(ellipse 30% 25% at 50% 55%, rgba(20,90,110,0.15), transparent 70%)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: dim}}>
        {STARS.map((s, i) => {
          const x = (s.x - dx + 1920) % 1920;
          const a = s.a * (0.75 + 0.25 * Math.sin(f / 25 + s.tw));
          return <circle key={i} cx={x} cy={s.y} r={s.r} fill="#fff" opacity={a} />;
        })}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- fade de cena + leve push-in ----------
export const Cena: React.FC<{from: number; to: number; children: React.ReactNode; zoom?: number; fade?: number}> = ({from, to, children, zoom = 0.04, fade = 0.6}) => {
  const f = useCurrentFrame() / FPS;
  if (f < from - fade || f > to + fade) return null;
  const op = interpolate(f, [from - fade, from + fade * 0.2, to - fade * 0.2, to + fade], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = 1 + zoom * interpolate(f, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: op, transform: `scale(${sc})`}}>{children}</AbsoluteFill>;
};

// progresso 0→1 entre dois tempos (segundos)
export const useP = (a: number, b: number, e = true) => {
  const f = useCurrentFrame() / FPS;
  return interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e ? ease : undefined});
};
export const useT = () => useCurrentFrame() / FPS;

// tempo de início de um parágrafo do roteiro
export const P = (i: number) => (data as any).paragrafos[i].t as number;
export const PE = (i: number) => (data as any).paragrafos[i].t_end as number;
export const SEG = (i: number) => (data as any).segmentos[i] as {start: number; end: number};

// ---------- texto ----------
const corDe = (c: string) => ({impacto: C.impacto, perigo: C.perigo, dado: C.dado, info: C.info} as any)[c] || C.info;

export const Palavras: React.FC = () => {
  const t = useT();
  const ev = (data as any).eventos.palavra as any[];
  const cur = ev.filter((e) => t >= e.t - 0.1 && t <= e.t + e.dur + 0.5);
  return (
    <>
      {cur.map((e, i) => {
        const op = interpolate(t, [e.t, e.t + 0.35, e.t + e.dur, e.t + e.dur + 0.45], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = interpolate(t, [e.t, e.t + 0.5], [10, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        return (
          <div key={i} style={{position: 'absolute', top: 178, width: '100%', textAlign: 'center', opacity: op, transform: `translateY(${y}px)`,
            fontFamily: F.titulo, fontWeight: 700, fontSize: 58, letterSpacing: 1.5, color: corDe(e.cor), textShadow: '0 2px 18px rgba(0,0,0,0.75)'}}>
            {e.texto}
          </div>
        );
      })}
    </>
  );
};

export const Etiquetas: React.FC = () => {
  const t = useT();
  const ev = (data as any).eventos.etiqueta as any[];
  const cur = ev.filter((e) => t >= e.t - 0.1 && t <= e.t + 6.5);
  return (
    <>
      {cur.map((e, i) => {
        const op = interpolate(t, [e.t, e.t + 0.5, e.t + 5.6, e.t + 6.4], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const x = interpolate(t, [e.t, e.t + 0.6], [-14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        return (
          <div key={i} style={{position: 'absolute', left: 96, bottom: 96, opacity: op, transform: `translateX(${x}px)`}}>
            <div style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 21, letterSpacing: 5, color: C.cinza}}>{e.small}</div>
            <div style={{width: 46, height: 2, background: C.ouro, margin: '10px 0 8px'}} />
            <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64, color: C.info, letterSpacing: 1, textShadow: '0 2px 16px rgba(0,0,0,0.7)'}}>{e.big}</div>
          </div>
        );
      })}
    </>
  );
};

export const Fontes: React.FC = () => {
  const t = useT();
  const ev = (data as any).eventos.fonte as any[];
  const cur = ev.filter((e) => t >= e.t && t <= e.t + 7);
  return (
    <>
      {cur.slice(-1).map((e, i) => {
        const op = interpolate(t, [e.t, e.t + 0.6, e.t + 6, e.t + 7], [0, 0.75, 0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={i} style={{position: 'absolute', right: 70, bottom: 52, opacity: op, fontFamily: F.rotulo, fontSize: 17, letterSpacing: 1.5, color: C.cinza, maxWidth: 780, textAlign: 'right'}}>{e.texto.toUpperCase()}</div>;
      })}
    </>
  );
};

// ---------- contador (odômetro) ----------
type CEv = {t: number; from: number; to: number; dur?: number; hold?: number; label?: string; blink?: boolean; centro?: boolean};
export const CONTADOR: CEv[] = [
  {t: 0.1, from: 0, to: 250000000, dur: 2, hold: 6},
  {t: P(1), from: 250000000, to: 0, dur: 1.4, hold: 2},
  {t: P(4), from: 0, to: 0},
  {t: P(8), from: 0, to: 19},
  {t: P(13), from: 19, to: 74},
  {t: P(18), from: 74, to: 150},
  {t: P(23), from: 150, to: 274},
  {t: P(28), from: 274, to: 2000, dur: 9, hold: 3},
  {t: P(29), from: 2000, to: 2000},
  {t: P(33), from: 2000, to: 7200},
  {t: P(38), from: 7200, to: 12000},
  {t: P(42), from: 12000, to: 25000},
  {t: P(46), from: 0, to: 0, blink: true, hold: 5},
  {t: P(50), from: 25000, to: 100000},
  {t: P(55), from: 100000, to: 1000000, dur: 4, hold: 1},
  {t: P(56), from: 1000000, to: 1000000},
  {t: P(63), from: 1000000, to: 254000000, dur: 2.2, hold: 3, label: 'ANOS NO PASSADO'},
  {t: P(67), from: 1000000, to: 5000000, dur: 3},
  {t: P(71), from: 5000000, to: 10000000},
  {t: P(75), from: 20000000, to: 50000000, dur: 6, hold: 2},
  {t: P(79), from: 50000000, to: 250000000, dur: 2.5},
  {t: P(85), from: 250000000, to: 250000000, blink: true},
];
const fmt = (n: number) => {
  const s = Math.max(0, Math.round(n)).toString().padStart(10, '0');
  return `${s[0]}.${s.slice(1, 4)}.${s.slice(4, 7)}.${s.slice(7, 10)}`;
};
export const Contador: React.FC<{fimCentro: number}> = ({fimCentro}) => {
  const t = useT();
  const centro = t >= fimCentro;
  let e: CEv | undefined;
  for (const x of CONTADOR) if (t >= x.t - 0.05) e = x;
  if (centro) e = {t: fimCentro, from: 250000000, to: 250000000, hold: 999};
  if (!e) return null;
  const dur = e.dur ?? 1.3, hold = e.hold ?? 3.2;
  const end = e.t + dur + hold;
  if (t > end + 0.6) return null;
  const op = interpolate(t, [e.t, e.t + 0.35, end, end + 0.6], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const k = interpolate(t, [e.t, e.t + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  // escala logarítmica dá sensação de odômetro acelerando
  const lg = (v: number) => Math.log10(v + 1);
  const val = Math.pow(10, lg(e.from) + (lg(e.to) - lg(e.from)) * k) - 1;
  const s = e.blink && !centro ? '?.???.???.???' : fmt(val);
  const firstSig = s.search(/[1-9?]/);
  const blinkOp = e.blink && !centro ? 0.55 + 0.45 * Math.abs(Math.sin(t * 3)) : 1;
  const big = centro ? 1.9 : 1;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: centro ? 400 : 40, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: op * blinkOp, transform: `scale(${big})`, transformOrigin: 'top center'}}>
      <div style={{padding: '10px 28px', borderRadius: 14, background: 'rgba(6,10,20,0.72)', border: `1.5px solid ${C.ouro}55`, boxShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
        <span style={{fontFamily: F.titulo, fontWeight: 500, fontSize: 46, letterSpacing: 4, fontVariantNumeric: 'tabular-nums'}}>
          {s.split('').map((ch, i) => (
            <span key={i} style={{color: firstSig === -1 || i < firstSig ? '#4B5468' : C.info}}>{ch}</span>
          ))}
        </span>
      </div>
      <div style={{marginTop: 8, fontFamily: F.rotulo, fontWeight: 500, fontSize: 15, letterSpacing: 6, color: C.cinza}}>{e.label ?? 'ANOS NO FUTURO'}</div>
    </div>
  );
};

export const Rotulo: React.FC<{x: number; y: number; children: React.ReactNode; cor?: string; size?: number; op?: number; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, children, cor = C.info, size = 24, op = 1, anchor = 'start'}) => (
  <text x={x} y={y} fill={cor} opacity={op} textAnchor={anchor} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: size, letterSpacing: 2}}>{children}</text>
);
