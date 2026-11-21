import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Pessoa, VOCE, ANNA, BLAGDEN, WILLIE, CIENTISTA, CIENTISTA2} from './personagens';
import {F} from './theme';
const L = [['VOCÊ', 'protagonista · todas as portas', VOCE, 'neutro'], ['ANNA BÅGENHOLM', 'porta 3 · 13,7 °C', ANNA, 'frio'], ['CHARLES BLAGDEN', 'porta 9 · sala a ~127 °C', BLAGDEN, 'calmo'], ['WILLIE JONES', 'porta 4 · 46,5 °C', WILLIE, 'dor'], ['CIENTISTA', 'Bremen · Nasa (portas 17)', CIENTISTA, 'sorriso'], ['CIENTISTA', 'KSTAR · CERN (portas 18-19)', CIENTISTA2, 'neutro']] as const;
const EX = ['neutro', 'susto', 'frio', 'calor', 'fechado', 'sorriso'] as const;
export const Folha: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#0E1830,#060A14)'}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {L.map(([, , v, e], i) => (
        <g key={i} transform={`translate(${190 + i * 300},${700}) scale(1.22)`}><ellipse cx={0} cy={0} rx={70} ry={10} fill="rgba(0,0,0,0.35)" /><Pessoa v={v as any} expr={e as any} t={1} /></g>
      ))}
      {EX.map((e, i) => <g key={e} transform={`translate(${560 + i * 170},${1430}) scale(2.2)`}><Pessoa v={VOCE} expr={e} t={1} semPernas /></g>)}
      <g transform="translate(330,1050) scale(0.62)"><Pessoa v={VOCE} vista="costas" t={1} /></g>
    </svg>
    {L.map(([n, sub], i) => <div key={i} style={{position: 'absolute', top: 718, left: 190 + i * 300 - 150, width: 300, textAlign: 'center'}}><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 19, letterSpacing: 2, color: '#E8ECF4'}}>{n}</div><div style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 15, color: '#8A93A6', marginTop: 4}}>{sub}</div></div>)}
    <div style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 52, color: '#fff', letterSpacing: 3}}>PERSONAGENS — VÍDEO 5 (TEMPERATURA)</div>
    <div style={{position: 'absolute', top: 820, left: 400, fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#8A93A6'}}>DE COSTAS (CORREDOR)</div>
    <div style={{position: 'absolute', top: 820, left: 520, width: 1100, textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#8A93A6'}}>EXPRESSÕES: NEUTRO · SUSTO · FRIO · CALOR · OLHOS FECHADOS · SORRISO</div>
  </AbsoluteFill>
);
