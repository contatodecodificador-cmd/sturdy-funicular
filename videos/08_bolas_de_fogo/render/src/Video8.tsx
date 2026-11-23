/* Vídeo 8 — O Dia em Que Bolas de Fogo Caíram na Amazônia */
import React from 'react';
import {AbsoluteFill, getInputProps} from 'remotion';
import {F} from './theme';
import {Shot, Chave, Grao, Vinheta, KO, lerp, clamp01, useT, K} from './base';
import planosJ from './planos8.json';
import * as A from './cenas8a';
import * as B from './cenas8b';
import * as Cc from './cenas8c';
import * as Fo from './fotos8';
import {COR} from './comum7';

type Plano = {id: string; t0: number; t1: number; vis: string; mov: string; desc: string; tela: string | null; prova: number | null; par: number; bloco: string; fala: string};
export const PLANOS = planosJ as Plano[];
export const FIM8 = PLANOS[PLANOS.length - 1].t1;
const LIMPO = Boolean((getInputProps() as {limpo?: boolean}).limpo);

const CENAS: Record<string, React.FC<A.P>> = {
  Rio: A.Rio, Explosoes: A.Explosoes, Sismo: A.Sismo, MapaLaPaz: A.MapaLaPaz, MapaBR: A.MapaBR, Viagem: A.Viagem, Jornal: A.Jornal,
  Estante: A.Estante, Cristo: A.Cristo, Pasta: A.Pasta, Frei: A.Frei, Satelite: A.Satelite, MapaSP: A.MapaSP,
  MapaAM: B.MapaAM, Vila: B.Vila, Familia: B.Familia, Relogio8: B.Relogio8, Caderno: B.Caderno, Calendario: B.Calendario, Meteoro: B.Meteoro,
  Tunguska: B.Tunguska, Rio1930: B.Rio1930, Armagh: B.Armagh, ArtigoRusso: B.ArtigoRusso, Biblioteca: B.Biblioteca, TresPedras: B.TresPedras, Perseidas: B.Perseidas,
  Expedicao: Cc.Expedicao, Mexico: Cc.Mexico, TamanhoPedra: Cc.TamanhoPedra, Airburst: Cc.Airburst, Floresta: Cc.Floresta, Regua: Cc.Regua, Chelyabinsk: Cc.Chelyabinsk,
  Sertao: Cc.Sertao, Celular: Cc.Celular, Split: Cc.Split, Bramon: Cc.Bramon, Sonear: Cc.Sonear, Bendego: Cc.Bendego, Checklist: Cc.Checklist, GloboBolidos: Cc.GloboBolidos,
  Hipoteses: Cc.Hipoteses, Mata: Cc.MataCima, Cartela: Cc.Cartela,
};
export const registrar = (m: Record<string, React.FC<A.P>>) => Object.assign(CENAS, m);

const ZoomLin: React.FC<{lt: number; d: number; children: React.ReactNode}> = ({lt, d, children}) => (
  <AbsoluteFill style={{transform: `scale(${lerp(1, 1.05, clamp01(lt / d))})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
);
const Falta: React.FC<{p: Plano}> = ({p}) => (
  <AbsoluteFill style={{background: '#0B1428', alignItems: 'center', justifyContent: 'center', fontFamily: F.titulo, fontSize: 48, color: '#556'}}>{p.vis} · {p.desc}</AbsoluteFill>
);
// cenas com foto realista (substituem as silhuetas); args que continuam gráficos ficam de fora
const FOTO = (nome: string, arg?: string): React.FC<Fo.PF> | null => {
  const m: Record<string, React.FC<Fo.PF>> = {Rio: Fo.RioF, Explosoes: Fo.ExplosoesF, Cristo: Fo.CristoF, Frei: Fo.FreiF, Vila: Fo.VilaF, Familia: Fo.FamiliaF,
    Meteoro: Fo.MeteoroF, TresPedras: Fo.TresPedrasF, Rio1930: Fo.Rio1930F, Armagh: Fo.ArmaghF, Biblioteca: Fo.BibliotecaF, Perseidas: Fo.PerseidasF,
    Satelite: Fo.SateliteF, Expedicao: Fo.ExpedicaoF, Floresta: Fo.FlorestaF, Chelyabinsk: Fo.ChelyabinskF, Sertao: Fo.SertaoF, Sonear: Fo.SonearF,
    Bendego: Fo.BendegoF, Checklist: Fo.ChecklistF, Mata: Fo.MataF};
  if (nome === 'Sismo' && arg === 'tambor') return Fo.SismoF;
  if (nome === 'Caderno' && arg !== 'escreve') return Fo.CadernoF;
  if (nome === 'Tunguska' && (arg === 'leque' || arg === 'centro')) return Fo.TunguskaF;
  if (nome === 'Viagem' && (arg === '1' || arg === '2')) return Fo.ViagemF;
  if (nome === 'Mexico' && !arg) return Fo.MexicoF;
  if (nome === 'Bramon' && !arg) return Fo.BramonF;
  return m[nome] || null;
};
// sequências de planos iguais: a animação continua (não recomeça no corte); k = índice do plano na sequência
type Seq = {t0: number; t1: number; k: number};
const SEQ: Record<string, Seq> = {};
{
  let i = 0;
  while (i < PLANOS.length) {
    let j = i; while (j + 1 < PLANOS.length && PLANOS[j + 1].vis === PLANOS[i].vis) j++;
    for (let a = i; a <= j; a++) SEQ[PLANOS[a].id] = {t0: PLANOS[i].t0, t1: PLANOS[j].t1, k: a - i};
    i = j + 1;
  }
}
const cena = (p: Plano, t: number) => {
  const s = SEQ[p.id]; const lt = t - s.t0, d = s.t1 - s.t0;
  const [nome, ...resto] = p.vis.split(':'); const arg = resto.join(':') || undefined;
  const Fc = FOTO(nome, arg);
  if (Fc) return <Fc lt={lt} d={d} t={t} arg={arg} k={s.k} />;
  const C = CENAS[nome]; if (!C) return <Falta p={p} />;
  const el = <C lt={lt} d={d} t={t} arg={arg} />;
  const corpo = p.mov === 'zoom' ? <ZoomLin lt={lt} d={d}>{el}</ZoomLin> : el;
  if (s.k === 0) return corpo;
  // novo enquadramento a cada corte dentro da mesma sequência (não é loop: a animação continua)
  const Q: [number, number][] = [[50, 50], [32, 42], [68, 58], [50, 30]];
  const [ox, oy] = Q[s.k % Q.length];
  return <AbsoluteFill style={{transform: `scale(${1.1 + 0.04 * (s.k % 2)})`, transformOrigin: `${ox}% ${oy}%`}}>{corpo}</AbsoluteFill>;
};

// ---------- HUD: pasta do caso (canto superior esquerdo) ----------
const T_PROVA = PLANOS.filter((p) => p.prova).map((p) => [p.t0, p.prova!] as [number, number]);
const T_FIM_INTRO = PLANOS.find((p) => p.par === 10)!.t0;
const Hud: React.FC<{t: number}> = ({t}) => {
  const p = PLANOS.find((x) => t >= x.t0 && t < x.t1);
  if (!p || t < 4 || ['Pasta', 'Cartela', 'Jornal', 'Estante'].includes(p.vis.split(':')[0])) return null;
  let n = 0, tUlt = -9; for (const [t0, k] of T_PROVA) if (t >= t0) { n = k; tUlt = t0; }
  const pop = 1 + 0.25 * Math.max(0, 1 - (t - tUlt) / 0.5);
  const cont = t >= (PLANOS.find((x) => x.par === 43)?.t0 ?? 1e9);
  return (
    <div style={{position: 'absolute', left: 56, top: 46, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px 10px 16px', borderRadius: 12, background: 'rgba(6,10,20,0.8)', borderLeft: `5px solid ${COR.ouro}`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', opacity: K(t, 4, 4.6)}}>
      <svg width={38} height={30} style={{position: 'relative'}}><path d="M2,6 L14,6 L18,10 L36,10 L36,28 L2,28 Z" fill={COR.ouro} /></svg>
      <div>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 14, letterSpacing: 4, color: '#B9C2D3'}}>CASO CURUÇÁ · 13/08/1930</div>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30, color: '#F2F4F8', letterSpacing: 2}}>
          PROVAS <span style={{display: 'inline-block', transform: `scale(${pop})`, color: cont ? COR.perigo : COR.ouro}}>{n}</span>/6{t < T_FIM_INTRO ? '' : ''}
        </div>
      </div>
    </div>
  );
};

export const Video8: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {PLANOS.map((p) => (
        <Shot key={p.id} a={p.t0} b={p.t1}>{(lt, d) => <>
          {cena(p, t)}
          {p.tela && !LIMPO && <Chave lt={lt} t0={0.25} size={60} top={150}>{p.tela}</Chave>}
        </>}</Shot>
      ))}
      {!LIMPO && <><Hud t={t} /><Vinheta forca={0.35} /><Grao /></>}
    </AbsoluteFill>
  );
};
