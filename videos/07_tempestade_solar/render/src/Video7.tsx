/* Vídeo 7 — O Que a Maior Tempestade Solar da História Faria com o Brasil */
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, Img, staticFile} from 'remotion';
import {F} from './theme';
import {Shot, Chave, Grao, Vinheta, KO, lerp, prog, clamp01, useT} from './base';
import planosJ from './planos7.json';
import tem3d from './tem3d.json';
import * as A from './cenas7a';
import * as B from './cenas7b';
import {COR} from './comum7';

type Plano = {id: string; t0: number; t1: number; vis: string; mov: string; movtxt: string; desc: string; tela: string | null; rel: string | null; fala: string};
export const PLANOS = planosJ as Plano[];
export const FIM7 = PLANOS[PLANOS.length - 1].t1;
const TEM3D = new Set(tem3d as string[]);

const CENAS: Record<string, React.FC<A.P>> = {
  q_ondas: A.Ondas, q_radio: A.Radio, q_aviao: A.Aviao, q_protons: A.Protons, q_relogio: A.RelogioG, q_nucleo: A.Nucleo, q_lua_nucleo: A.LuaNucleo, q_dinamo: A.Dinamo,
  q_escudo: A.Escudo, q_aurora: A.Aurora, q_arquivo: A.Arquivo, ficha: A.Ficha, q_aurora_eua: A.AuroraEua, q_tratores: A.Tratores, q_tratores_torto: A.TratoresTorto, q_dolar: A.Dolar,
  q_plantadeira: A.Plantadeira, q_relogio_parede: A.RelogioParede, q_quebec: A.Quebec, q_neve: A.Neve, q_orbita: A.Orbita, q_jornal_nasa: A.JornalNasa, q_observatorio: A.Observatorio,
  q_carrington: A.Carrington, q_carrington_flash: A.CarringtonFlash, q_papel: A.Papel, q_telegrafistas: A.Telegrafistas, q_americas: A.Americas, q_rio: A.Rio,
  q_observatorio_imperial: A.ObservatorioImperial, q_caderno: A.Caderno, q_floresta: A.Floresta, q_anel: A.Anel, q_escala774: A.Escala774,
  q_brasil: B.BrasilMapa, q_L1: B.L1, q_gps: B.Gps, q_equador_magnetico: B.EquadorMagnetico, q_inpe_mapa: B.InpeMapa, q_celular_gps: B.CelularGps, q_torres: B.Torres,
  q_mundo_polos: B.MundoPolos, q_transformador: B.Transformador, q_amperimetro: B.Amperimetro, q_torres_linha: B.TorresLinha, q_itaipu: B.Itaipu, q_antena: B.Antena,
  q_ceu_sul: B.CeuSul, q_anomalia_cresce: B.AnomaliaCresce, q_anomalia_dividida: B.AnomaliaDividida, q_hubble: B.Hubble, q_astronauta: B.Astronauta,
  q_satelites_caindo: B.SatelitesCaindo, q_atmosfera_incha: B.AtmosferaIncha, q_amazonia: B.Amazonia, q_fazenda_antena: B.FazendaAntena, q_previsao_sul: B.PrevisaoSul,
  q_mundo_reparos: B.MundoReparos, q_pessoa_ceu: B.PessoaCeu, q_operador: B.Operador, q_inpe: B.Inpe, q_celular: B.CelularSemSinal, q_comentarios: B.Comentarios, q_cartela: B.Cartela,
};

// zoom leve e LINEAR do primeiro ao último quadro (nunca para, nunca volta)
const ZoomLin: React.FC<{lt: number; d: number; children: React.ReactNode}> = ({lt, d, children}) => (
  <AbsoluteFill style={{transform: `scale(${lerp(1, 1.05, clamp01(lt / d))})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
);

const Plano3D: React.FC<{p: Plano; lt: number; d: number}> = ({p, lt, d}) => {
  if (TEM3D.has(p.id)) return (
    <Sequence from={Math.round(p.t0 * 30)} layout="none">
      <AbsoluteFill style={{background: '#000'}}><OffthreadVideo src={staticFile(`3d/${p.id}.mp4`)} muted style={{width: '100%', height: '100%'}} /></AbsoluteFill>
    </Sequence>
  );
  // sem o render ainda: prévia com deslize lento
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}><Img src={staticFile(`prev/${p.vis.slice(3)}.png`)} style={{width: 2016, height: 1134, transform: `translate(${-48 * clamp01(lt / d)}px, -27px)`}} /></AbsoluteFill>;
};

const cena = (p: Plano, lt: number, d: number, t: number) => {
  if (p.vis.startsWith('3D:')) return <Plano3D p={p} lt={lt} d={d} />;
  const [nome, ...resto] = p.vis.slice(3).split(':'); const arg = resto.join(':') || undefined;
  const C = CENAS[nome]; if (!C) return <AbsoluteFill style={{background: '#300'}} />;
  const el = <C lt={lt} d={d} t={t} arg={arg} />;
  return p.mov === 'zoom' ? <ZoomLin lt={lt} d={d}>{el}</ZoomLin> : el;
};

// ---------- relógio da contagem regressiva (fio condutor) ----------
const T_CLARAO = PLANOS.find((p) => p.desc.startsWith('Terra e Sol: CLARÃO'))!.t0;
const T_IMPACTO = PLANOS.find((p) => p.rel === '00:00:00')?.t0 ?? 343;
const T_30 = PLANOS.find((p) => p.rel === '00:30:00')!.t0;
const fmt = (s: number) => { s = Math.max(0, Math.floor(s)); return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
const valorRelogio = (t: number): number => {
  if (t < T_CLARAO) return 63360;
  if (t < 87) return 63360 - (t - T_CLARAO);
  if (t < T_30) { const alvo = 62400 - (t - 87); const v0 = 63360 - (87 - T_CLARAO); return lerp(v0, alvo, clamp01((t - 87) / 0.8)); }
  if (t < T_IMPACTO) { const alvo = 1800 - (t - T_30); const v0 = 62400 - (T_30 - 87); return lerp(v0, alvo, clamp01((t - T_30) / 0.8)); }
  return lerp(1800 - (T_IMPACTO - T_30), 0, clamp01((t - T_IMPACTO) / 0.5));
};
const Relogio: React.FC<{t: number}> = ({t}) => {
  const p = PLANOS.find((x) => t >= x.t0 && t < x.t1);
  const fim = p && p.rel && p.rel.includes('ATRAS');
  const vis = (t >= 4.0 && t < T_IMPACTO + 2.5 && !(p && p.vis.startsWith('2D:q_relogio')) && !(p && p.vis === '2D:q_cartela' && t > 84)) || fim;
  if (!vis) return null;
  const v = valorRelogio(t); const verm = t >= T_30 - 0.05; const corre = t >= T_CLARAO;
  const txt = fim ? '8:20 ATRASADO' : fmt(v);
  const cor = fim ? COR.ouro : verm ? COR.perigo : '#F2F4F8';
  return (
    <div style={{position: 'absolute', right: 64, top: 52, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 22px', borderRadius: 12, background: 'rgba(6,10,20,0.82)', border: `1px solid ${cor}55`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
      <div style={{width: 12, height: 12, borderRadius: 6, background: cor, opacity: corre && !fim ? (Math.floor(t * 2) % 2 ? 1 : 0.35) : 1}} />
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 15, letterSpacing: 4, color: '#B9C2D3'}}>{fim ? 'A LUZ DO SOL CHEGA' : 'CHEGADA DA NUVEM'}</div>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: cor, letterSpacing: 2, minWidth: 190, textAlign: 'right', textShadow: verm ? `0 0 16px ${cor}` : 'none'}}>{txt}</div>
    </div>
  );
};

const Clarao: React.FC<{t: number; t0: number; dur?: number; forca?: number}> = ({t, t0, dur = 0.6, forca = 0.95}) => {
  if (t < t0 || t > t0 + dur) return null;
  return <AbsoluteFill style={{background: '#fff', opacity: forca * (1 - prog(t, t0, t0 + dur)), pointerEvents: 'none'}} />;
};

export const Video7: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {PLANOS.map((p) => (
        <Shot key={p.id} a={p.t0} b={p.t1}>{(lt, d) => <>
          {cena(p, lt, d, t)}
          {p.tela && <Chave lt={lt} t0={0.25} size={56} top={150}>{p.tela}</Chave>}
        </>}</Shot>
      ))}
      <Clarao t={t} t0={T_CLARAO} />
      <Clarao t={t} t0={T_IMPACTO} dur={0.5} forca={0.8} />
      <Relogio t={t} />
      <Vinheta forca={0.35} />
      <Grao />
    </AbsoluteFill>
  );
};
