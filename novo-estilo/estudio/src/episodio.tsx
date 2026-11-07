// Base comum dos episódios (do Ep. 2 em diante): cenas presas aos tempos da voz, câmera, marcas, legenda, áudio.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera, Chave, Legenda, Palavra, Marca} from './camera';
import {Etiqueta, Topo, useT} from './pecas';

export const FPS = 30;
export type MarcaDef = {x: number; y: number; texto: string; em?: number; seta?: 'baixo' | 'cima' | 'esq' | 'dir'; cor?: string; corTexto?: string; tam?: number};
export type Cena = {
  W?: number; H?: number; lim?: {x0: number; y0: number; x1: number; y1: number};
  fundo?: (t: number, d: number) => React.ReactNode; cam?: (d: number) => Chave[]; socos?: number[]; tremor?: number;
  marcas?: (d: number) => MarcaDef[]; hud?: (d: number) => React.ReactNode;
  /** cena desenhada por conta própria (várias câmeras, montagem) */
  render?: (t: number, d: number) => React.ReactNode;
  topo?: string; leg?: number | null; lado?: 'esq' | 'centro' | 'dir'; escuro?: number;
};

export const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
/** centro da câmera pra pessoa no x do mundo `rx` ficar à direita da tela (legenda à esquerda) */
export const ladoRose = (rx: number, z: number) => rx - 260 / z;

export const Escuro: React.FC<{o?: number}> = ({o = 0.4}) => <AbsoluteFill style={{background: `rgba(20,22,27,${o})`}} />;

export const Glitch: React.FC<{em: number}> = ({em}) => {
  const t = useT();
  const d = t - em;
  if (d < 0 || d > 0.6) return null;
  const f = Math.floor(d * 30);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      {[0, 1, 2, 3, 4].map((k) => (
        <div key={k} style={{position: 'absolute', left: 0, right: 0, top: ((f * 37 + k * 211) % 1700), height: 30 + ((f + k) % 4) * 22, background: k % 2 ? 'rgba(255,40,80,.45)' : 'rgba(40,200,255,.45)', transform: `translateX(${((f * 13 + k * 7) % 60) - 30}px)`}} />
      ))}
    </AbsoluteFill>
  );
};

export const MarcasView: React.FC<{ms: MarcaDef[]}> = ({ms}) => (
  <>{ms.map((m, k) => <Marca key={'m' + k} x={m.x} y={m.y}><Etiqueta x={0} y={0} texto={m.texto} em={m.em} seta={m.seta} cor={m.cor} corTexto={m.corTexto} tam={m.tam} /></Marca>)}</>
);

const CenaView: React.FC<{c: Cena; d: number}> = ({c, d}) => {
  const t = useT();
  if (c.render) return <AbsoluteFill style={{background: '#000'}}>{c.render(t, d)}{c.escuro ? <Escuro o={c.escuro} /> : null}{c.hud ? c.hud(d) : null}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera chaves={c.cam!(d)} socos={c.socos} tremor={c.tremor} W={c.W!} H={c.H!} lim={c.lim}>
        {(() => {
          const f = c.fundo!(t, d);
          const camadas = Array.isArray(f) ? f : [f];
          return <>{camadas[0]}<MarcasView ms={c.marcas ? c.marcas(d) : []} />{camadas.slice(1)}</>;
        })()}
      </Camera>
      {c.escuro ? <Escuro o={c.escuro} /> : null}
      {c.hud ? c.hud(d) : null}
    </AbsoluteFill>
  );
};

export type Tempos = {inicio_cenas: number[]; duracao: number; palavras: Palavra[]};

/** Ferramentas de tempo de um episódio */
export function tempos(T: Tempos) {
  const INI = T.inicio_cenas.map((x, i) => (i === 0 ? 0 : x - 0.12));
  const DUR = T.duracao + 0.8;
  const FIM = INI.slice(1).concat([DUR]);
  const PAL = T.palavras;
  /** tempo (dentro da cena i, base 0) em que a palavra é falada */
  const W = (i: number, palavra: string, fallback = 0.3) => {
    const p = PAL.find((x) => x.s >= INI[i] - 0.1 && x.s <= FIM[i] + 0.1 && norm(x.w) === norm(palavra));
    return p ? p.s - INI[i] : fallback;
  };
  return {INI, FIM, DUR, PAL, W};
}

export const Episodio: React.FC<{T: ReturnType<typeof tempos>; C: Cena[]; audio: string; destaques: Set<string>; topoPadrao: string}> = ({T, C, audio, destaques, topoPadrao}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const cenaEm = (tt: number) => Math.max(0, T.INI.findIndex((x, i) => tt >= x && tt < T.FIM[i]));
  const idx = cenaEm(t);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {C.map((c, i) => (
        <Sequence key={i} from={Math.round(T.INI[i] * fps)} durationInFrames={Math.max(1, Math.round((T.FIM[i] - T.INI[i]) * fps))}>
          <CenaView c={c} d={T.FIM[i] - T.INI[i]} />
        </Sequence>
      ))}
      <Topo texto={C[idx].topo || topoPadrao} />
      <Legenda pal={T.PAL} destaques={destaques} y={(tt) => { const l = C[cenaEm(tt)].leg; return l === null ? -9999 : (l || 1430); }} lado={(tt) => C[cenaEm(tt)].lado || 'centro'} />
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
