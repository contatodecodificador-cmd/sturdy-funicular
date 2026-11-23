/* Kit CapCut: só os planos de motion graphics (G:), um atrás do outro, sem HUD nem palavra-chave.
   Planos seguidos com o mesmo gráfico continuam a animação (sem recomeçar). */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import T from './timeline_kit.json';
import * as A from './cenas8a';
import * as B from './cenas8b';
import * as Cc from './cenas8c';

type Pl = {id: string; t0: number; t1: number; vis: string};
const G = (T as Pl[]).filter((p) => p.vis.startsWith('G:'));
// início de cada plano no vídeo de gráficos + início da sequência (planos seguidos iguais na linha do tempo original)
let acc = 0;
export const GPL = G.map((p) => { const o = {...p, g0: acc, d: p.t1 - p.t0}; acc += p.t1 - p.t0; return o; });
export const FIM_G = acc;
const TODOS = T as Pl[];
const seqIni = (p: Pl) => { let i = TODOS.findIndex((x) => x.id === p.id); let t = 0; while (i > 0 && TODOS[i - 1].vis === p.vis) { i--; t += TODOS[i].t1 - TODOS[i].t0; } return t; };
const seqDur = (p: Pl) => { let i = TODOS.findIndex((x) => x.id === p.id); while (i > 0 && TODOS[i - 1].vis === p.vis) i--; let d = 0; while (i < TODOS.length && TODOS[i].vis === p.vis) { d += TODOS[i].t1 - TODOS[i].t0; i++; } return d; };
const MAP: Record<string, React.FC<A.P>> = {Sismo: A.Sismo, MapaLaPaz: A.MapaLaPaz, MapaBR: A.MapaBR, Viagem: A.Viagem, Jornal: A.Jornal, Estante: A.Estante, Pasta: A.Pasta,
  MapaSP: A.MapaSP, MapaAM: B.MapaAM, Relogio8: B.Relogio8, Caderno: B.Caderno, Calendario: B.Calendario, Tunguska: B.Tunguska, ArtigoRusso: B.ArtigoRusso,
  Airburst: Cc.Airburst, GloboBolidos: Cc.GloboBolidos, Regua: Cc.Regua, Mexico: Cc.Mexico, TamanhoPedra: Cc.TamanhoPedra, Celular: Cc.Celular, Split: Cc.Split,
  Bramon: Cc.Bramon, Hipoteses: Cc.Hipoteses, Cartela: Cc.Cartela};
export const Graficos: React.FC = () => {
  const f = useCurrentFrame(); const tg = f / 30;
  const p = GPL.find((x) => tg >= x.g0 && tg < x.g0 + x.d) || GPL[GPL.length - 1];
  const [, nome, ...resto] = p.vis.split(':'); const arg = resto.join(':') || undefined;
  const C = MAP[nome];
  const lt = seqIni(p) + (tg - p.g0); const d = seqDur(p);
  return <AbsoluteFill style={{background: '#000'}}>{C ? <C lt={lt} d={d} t={p.t0 + (tg - p.g0)} arg={arg} /> : null}</AbsoluteFill>;
};
