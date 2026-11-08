// Stories do intervalo entre o Ep. 2 e o Ep. 3: resultado da votação e aviso do horário.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Camera} from './camera';
import {Relojoaria, LOJA2, REL} from './cenarios2';
import {COR} from './pecas';

const ANTON = 'Anton, sans-serif';
const BARLOW = "'Barlow Condensed', sans-serif";
const L2 = {W: LOJA2.W, H: LOJA2.H, lim: LOJA2.lim};
const contorno = (px: number) => ({WebkitTextStroke: `${px}px ${COR.tinta}`, paintOrder: 'stroke fill'} as React.CSSProperties);

/** Resultado da votação do Ep. 2: A venceu. */
export const ResultadoEp02: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: 1300 - 360 / 0.8, y: 740, z: 0.8}]} {...L2}>
      <Relojoaria t={2.1} ponteiro={8} roseX={1300} roseExpr="surpresa" fotoTirada portaAbre={0.6} sombra={1} />
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.85) 0%, rgba(20,22,27,.6) 50%, rgba(20,22,27,.2) 80%, rgba(20,22,27,.4) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center'}}>
      <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 52, color: COR.ipe, letterSpacing: 6}}>RESULTADO DO EP. 2</div>
      <div style={{fontFamily: ANTON, fontSize: 130, color: '#fff', ...contorno(14), lineHeight: 1.02, marginTop: 10}}>VOCÊS<br />ESCOLHERAM</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 720, background: '#fff', border: `6px solid ${COR.tinta}`, borderRadius: 34, padding: '24px 20px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.45)', transform: 'rotate(-2deg)'}}>
        <div style={{width: 150, height: 150, margin: '0 auto 10px', borderRadius: 75, background: COR.ipe, border: `6px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 110, lineHeight: '140px', color: COR.tinta}}>A</div>
        <div style={{fontFamily: ANTON, fontSize: 76, color: COR.tinta, lineHeight: 1.05}}>SE ESCONDER<br />E ESPERAR</div>
        <div style={{position: 'absolute', right: -40, top: -36, transform: 'rotate(12deg)', fontFamily: ANTON, fontSize: 64, color: COR.praca, border: `7px solid ${COR.praca}`, borderRadius: 12, padding: '0 20px', background: 'rgba(255,248,236,.95)', letterSpacing: 3}}>VENCEU</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 60, width: 640, top: 1250, textAlign: 'left', fontFamily: ANTON, fontSize: 76, color: '#fff', ...contorno(10), lineHeight: 1.05}}>A ROSE VAI SE <span style={{color: COR.ipe}}>ESCONDER…</span></div>
    <div style={{position: 'absolute', left: 60, width: 640, top: 1440, textAlign: 'left', fontFamily: BARLOW, fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: 2, textShadow: '0 3px 8px rgba(0,0,0,.7)'}}>E VER QUEM ENTROU</div>
  </AbsoluteFill>
);

/** Aviso do horário do Ep. 3 (10:45). Área livre pro adesivo de contagem regressiva: y 1130–1430. */
export const AvisoEp03: React.FC = () => {
  const ah = ((10 + 45 / 60) / 12) * 360, am = (45 / 60) * 360;
  return (
    <AbsoluteFill style={{background: COR.tinta}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, rgba(242,193,78,.45) 0%, rgba(242,193,78,.12) 35%, rgba(43,36,32,0) 60%)'}} />
      {Array.from({length: 40}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 197) % 1080, top: (i * 331) % 1920, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, borderRadius: 6, background: '#FFF8EC', opacity: 0.25}} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
        <span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '8px 34px', fontFamily: BARLOW, fontWeight: 800, fontSize: 46, color: COR.tinta, letterSpacing: 3}}>EPISÓDIO 3</span>
      </div>
      {/* relógio de bolso marcando 10:45 */}
      <svg style={{position: 'absolute', left: 290, top: 360}} width={500} height={540} viewBox="-250 -290 500 540">
        <path d="M60,-210 C150,-280 230,-200 240,-120" stroke="#C9A04A" strokeWidth="12" fill="none" />
        <rect x="-26" y="-258" width="52" height="46" rx="10" fill="#E2B85C" stroke={COR.tinta} strokeWidth="6" />
        <circle r="215" fill="#E2B85C" stroke={COR.tinta} strokeWidth="8" />
        <circle r="180" fill="#FFF8EC" stroke="#8A6A40" strokeWidth="6" />
        {Array.from({length: 12}, (_, i) => <rect key={i} x={-4} y={-170} width={8} height={i % 3 ? 20 : 36} fill={COR.tinta} transform={`rotate(${i * 30})`} />)}
        <rect x={-9} y={-95} width={18} height={105} rx={9} fill={COR.tinta} transform={`rotate(${ah})`} />
        <rect x={-6} y={-150} width={12} height={160} rx={6} fill={COR.tinta} transform={`rotate(${am})`} />
        <rect x={-2} y={-160} width={4} height={175} fill="#D9483B" transform="rotate(20)" />
        <circle r={16} fill="#D9483B" />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 880, textAlign: 'center'}}>
        <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 58, color: '#BFD3E6', letterSpacing: 4}}>SAI ÀS</div>
        <div style={{fontFamily: ANTON, fontSize: 210, color: COR.ipe, lineHeight: 0.95, ...contorno(12)}}>10:45</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1460, textAlign: 'center', fontFamily: ANTON, fontSize: 70, color: '#fff', lineHeight: 1.1}}>QUEM VOLTOU<br /><span style={{color: COR.ipe}}>PRO RELÓGIO?</span></div>
    </AbsoluteFill>
  );
};
