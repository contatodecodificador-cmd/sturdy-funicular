import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing, Img, staticFile} from 'remotion';
import {C, F, FPS} from './theme';

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const sm = (k: number) => k * k * (3 - 2 * k);
export const K = (t: number, a: number, b: number) => sm(prog(t, a, b));
export const eo = (k: number) => 1 - Math.pow(1 - k, 3); // ease-out
export const KO = (t: number, a: number, b: number) => eo(prog(t, a, b));
// easeInOutSine: o movimento de câmera mais suave (sem tranco no começo nem no fim)
export const es = (k: number) => -(Math.cos(Math.PI * clamp01(k)) - 1) / 2;
export const KS = (t: number, a: number, b: number) => es(prog(t, a, b));
export const rnd = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
export const useT = () => useCurrentFrame() / FPS;

// cores do vídeo 5 (frio x calor)
export const FR = {gelo: '#9FD8FF', gelo2: '#5FA8E0', geloEsc: '#123A5C', azul: '#3E8EDE'};
export const QU = {brasa: '#FF7A2F', fogo: '#FFB547', lava: '#E2452B', escuro: '#2A0E08'};

// ---------- tomada: corte seco; o conteúdo recebe o tempo local ----------
export const Shot: React.FC<{a: number; b: number; fade?: number; children: (lt: number, d: number) => React.ReactNode}> = ({a, b, fade = 0, children}) => {
  const t = useT();
  if (t < a - fade || t >= b) return null;
  const op = fade > 0 ? es(prog(t, a - fade, a)) : 1;
  return <AbsoluteFill style={{opacity: op}}>{children(t - a, b - a)}</AbsoluteFill>;
};

// leve "punch-in" de câmera dentro da tomada
export const Cam: React.FC<{lt: number; d: number; z0?: number; z1?: number; ox?: number; oy?: number; shake?: number; children: React.ReactNode}> = ({lt, d, z0 = 1, z1 = 1.02, ox = 50, oy = 50, shake = 0, children}) => {
  const k = es(lt / d);
  const s = lerp(z0, z1, k);
  const sx = shake ? Math.sin(lt * 61) * shake * Math.exp(-lt * 5) : 0;
  const sy = shake ? Math.cos(lt * 47) * shake * Math.exp(-lt * 5) : 0;
  return <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) scale(${s})`, transformOrigin: `${ox}% ${oy}%`}}>{children}</AbsoluteFill>;
};

// ---------- textos ----------
const caixaBg = 'linear-gradient(180deg, rgba(8,12,24,0.88), rgba(4,7,16,0.88))';
export const sombra = '0 12px 36px rgba(0,0,0,0.6)';

// palavra-chave (faixa superior y≈160–265, reservada)
export const Chave: React.FC<{lt: number; t0?: number; cor?: string; children: React.ReactNode; size?: number; top?: number; sai?: number}> = ({lt, t0 = 0, cor = C.ouro, children, size = 64, top = 150, sai}) => {
  const k = KO(lt, t0, t0 + 0.35);
  const out = sai !== undefined ? 1 - prog(lt, sai, sai + 0.25) : 1;
  if (k <= 0) return null;
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: k * out, transform: `translateY(${(1 - k) * 18}px) scale(${lerp(0.94, 1, k)})`}}>
      <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '10px 34px 0', borderRadius: 14, background: caixaBg, border: '1px solid rgba(255,255,255,0.08)', boxShadow: sombra}}>
        <span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: size, letterSpacing: 2, color: C.info, lineHeight: 1.15, whiteSpace: 'nowrap', textShadow: '0 3px 12px rgba(0,0,0,0.6)'}}>{children}</span>
        <span style={{display: 'block', width: '50%', height: 5, borderRadius: 3, background: cor, margin: '10px 0 12px', boxShadow: `0 0 16px ${cor}`}} />
      </div>
    </div>
  );
};

// etiqueta (canto inferior esquerdo): rótulo pequeno + número grande
export const Etq: React.FC<{lt: number; t0?: number; small: string; big: string; cor?: string; left?: number; bottom?: number; sai?: number}> = ({lt, t0 = 0, small, big, cor = C.ouro, left = 80, bottom = 80, sai}) => {
  const k = KO(lt, t0, t0 + 0.4);
  const out = sai !== undefined ? 1 - prog(lt, sai, sai + 0.25) : 1;
  if (k <= 0) return null;
  return (
    <div style={{position: 'absolute', left, bottom, opacity: k * out, transform: `translateX(${(1 - k) * -20}px)`, padding: '16px 30px 18px 24px', borderRadius: 12, background: 'linear-gradient(90deg, rgba(6,10,20,0.9), rgba(6,10,20,0.72))', borderLeft: `5px solid ${cor}`, boxShadow: sombra}}>
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 19, letterSpacing: 5, color: '#B9C2D3'}}>{small}</div>
      <div style={{height: 6}} />
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 60, color: C.info, letterSpacing: 1.5, lineHeight: 1.02}}>{big}</div>
    </div>
  );
};

// tag fixa em HTML (não escala com zoom de câmera)
export const Tag: React.FC<{x: number; y: number; cor?: string; children: React.ReactNode; op?: number; anchor?: 'start' | 'middle' | 'end'; size?: number}> = ({x, y, cor = C.ouro, children, op = 1, anchor = 'start', size = 24}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: `translate(${anchor === 'start' ? '0' : anchor === 'middle' ? '-50%' : '-100%'}, -50%)`,
    padding: '8px 18px', borderRadius: 9, background: 'rgba(6,10,20,0.84)', borderLeft: `4px solid ${cor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    fontFamily: F.rotulo, fontWeight: 700, fontSize: size, letterSpacing: 2.5, color: C.info, whiteSpace: 'nowrap'}}>{children}</div>
);

// número gigante com brilho
export const Numero: React.FC<{children: React.ReactNode; cor: string; size?: number; op?: number; style?: React.CSSProperties}> = ({children, cor, size = 150, op = 1, style}) => (
  <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: C.info, lineHeight: 1, letterSpacing: 2, opacity: op, whiteSpace: 'nowrap',
    textShadow: `0 0 28px ${cor}, 0 0 60px ${cor}88, 0 6px 18px rgba(0,0,0,0.75)`, ...style}}>{children}</div>
);

// clarão de corte (3–5 quadros)
export const Flash: React.FC<{t: number; cor?: string; dur?: number}> = ({t, cor = '#fff', dur = 0.16}) => {
  const now = useT();
  const k = prog(now, t, t + dur);
  if (now < t || now > t + dur) return null;
  return <AbsoluteFill style={{background: cor, opacity: 0.55 * (1 - k), mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

export const Vinheta: React.FC<{forca?: number}> = ({forca = 0.6}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${forca}) 100%)`}} />
);

// grão de filme leve (dá textura "profissional")
export const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const dx = -((f * 37) % 90), dy = -((f * 53) % 90);
  return (
    <AbsoluteFill style={{opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none', overflow: 'hidden'}}>
      <Img src={staticFile('grao.png')} style={{position: 'absolute', left: dx, top: dy, width: 2020, height: 1180}} />
    </AbsoluteFill>
  );
};

// tremor suave (soma de senos): deslocamento e rotação proporcionais à intensidade (0..1)
export const tremor = (t: number, k: number, seed = 0) => {
  if (k <= 0) return {x: 0, y: 0, r: 0};
  const f = 1 + k * 2.2;
  const x = (Math.sin(t * 23 * f + seed) * 0.6 + Math.sin(t * 37 * f + seed * 2) * 0.4) * 18 * k;
  const y = (Math.sin(t * 29 * f + seed * 3) * 0.6 + Math.sin(t * 41 * f + seed) * 0.4) * 10 * k;
  const r = Math.sin(t * 19 * f + seed * 5) * 0.6 * k;
  return {x, y, r};
};
