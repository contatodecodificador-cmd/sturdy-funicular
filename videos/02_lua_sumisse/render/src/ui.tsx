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
export const Cena: React.FC<{from: number; to: number; children: React.ReactNode; zoom?: number; fade?: number; fixo?: React.ReactNode}> = ({from, to, children, zoom = 0.04, fade = 0.6, fixo}) => {
  const f = useCurrentFrame() / FPS;
  if (f < from - fade || f > to + fade) return null;
  const op = interpolate(f, [from - fade, from + fade * 0.2, to - fade * 0.2, to + fade], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = 1 + zoom * interpolate(f, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opTxt = interpolate(f, [from - fade * 0.2, from + fade * 0.6, to - fade * 1.6, to - fade * 0.4], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <AbsoluteFill style={{opacity: op}}>
        <AbsoluteFill style={{transform: `scale(${sc})`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {fixo && <AbsoluteFill style={{opacity: opTxt}}>{fixo}</AbsoluteFill>}
    </>
  );
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

export const Caixa: React.FC<{cor?: string; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({cor = C.ouro, children, size = 50, style}) => (
  <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '12px 30px 0', borderRadius: 12,
    background: 'linear-gradient(180deg, rgba(10,16,30,0.86), rgba(6,10,20,0.86))', border: '1px solid rgba(227,176,75,0.22)',
    boxShadow: '0 10px 34px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)', ...style}}>
    <span style={{fontFamily: F.titulo, fontWeight: 600, fontSize: size, letterSpacing: 2, color: C.info, lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>{children}</span>
    <span style={{display: 'block', width: '55%', height: 4, borderRadius: 2, background: cor, marginTop: 10, marginBottom: 10, boxShadow: `0 0 14px ${cor}88`}} />
  </div>
);

export const Palavras: React.FC = () => {
  const t = useT();
  const ev = (data as any).eventos.palavra as any[];
  const cur = ev.filter((e) => t >= e.t - 0.1 && t <= e.t + e.dur + 0.5);
  return (
    <>
      {cur.slice(-1).map((e, i) => {
        const op = interpolate(t, [e.t, e.t + 0.3, e.t + e.dur, e.t + e.dur + 0.4], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = interpolate(t, [e.t, e.t + 0.45], [12, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        const sc = interpolate(t, [e.t, e.t + 0.45], [0.96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
        return (
          <div key={i} style={{position: 'absolute', top: 170, width: '100%', display: 'flex', justifyContent: 'center', opacity: op, transform: `translateY(${y}px) scale(${sc})`}}>
            <Caixa cor={corDe(e.cor)}>{e.texto}</Caixa>
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
          <div key={i} style={{position: 'absolute', left: 80, bottom: 80, opacity: op, transform: `translateX(${x}px)`, padding: '18px 30px 20px 26px', borderRadius: 12,
            background: 'linear-gradient(90deg, rgba(6,10,20,0.88), rgba(6,10,20,0.6))', borderLeft: `4px solid ${C.ouro}`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            <div style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 19, letterSpacing: 5, color: '#B9C2D3'}}>{e.small}</div>
            <div style={{height: 8}} />
            <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 58, color: C.info, letterSpacing: 1.5, lineHeight: 1.05}}>{e.big}</div>
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
        const op = interpolate(t, [e.t, e.t + 0.6, e.t + 6, e.t + 7], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <div key={i} style={{position: 'absolute', right: 60, bottom: 46, opacity: op, fontFamily: F.rotulo, fontWeight: 500, fontSize: 16, letterSpacing: 1.5, color: '#C3CAD8', maxWidth: 820, textAlign: 'right', padding: '6px 14px', borderRadius: 8, background: 'rgba(6,10,20,0.7)'}}>{e.texto.toUpperCase()}</div>;
      })}
    </>
  );
};

// ---------- contador (odômetro) ----------
type CEv = {t: number; from: number; to: number; dur?: number; hold?: number; label?: string; blink?: boolean; centro?: boolean};
export const CONTADOR: CEv[] = [];
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
