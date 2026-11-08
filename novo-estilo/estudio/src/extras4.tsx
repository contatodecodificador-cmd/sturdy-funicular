// Ep. 4 "16:48": capa, Stories de apresentação e Stories da enquete.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import TEMPOS from './tempos-ep04.json';
import {Camera, Legenda, Palavra} from './camera';
import {Ladeira, LADEIRA, ruaY} from './cenarios4';
import {FotoClose} from './cenarios2';
import {Carimbo, COR, useEntrada} from './pecas';

const ANTON = 'Anton, sans-serif';
const BARLOW = "'Barlow Condensed', sans-serif";
const LD = {W: LADEIRA.W, H: LADEIRA.H, lim: LADEIRA.lim};
const contorno = (px: number) => ({WebkitTextStroke: `${px}px ${COR.tinta}`, paintOrder: 'stroke fill'} as React.CSSProperties);
const Selo: React.FC<{texto: string; x: number; y: number; cor?: string; corTexto?: string; rot?: number}> = ({texto, x, y, cor = COR.terracota, corTexto = '#fff', rot = -4}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: cor, color: corTexto, fontFamily: ANTON, fontSize: 52, padding: '6px 30px', borderRadius: 16, border: `5px solid ${COR.tinta}`, boxShadow: '0 12px 30px rgba(0,0,0,.35)', letterSpacing: 2}}>{texto}</div>
);
const sepia = (n: React.ReactNode) => <div style={{position: 'absolute', inset: 0, filter: 'sepia(.85) contrast(1.05) brightness(.95)'}}>{n}</div>;

/** CAPA do Ep. 4: as duas Roses no alto da ladeira, o ônibus lá embaixo */
export const CapaEp04: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: 1050, y: 600, z: 1.05}]} {...LD}>
      <Ladeira t={0.4} roseX={980} velhaX={820} expr="surpresa" velhaExpr="desconfiada" />
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.62) 0%, rgba(20,22,27,0) 34%, rgba(20,22,27,0) 75%, rgba(20,22,27,.45) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 240, textAlign: 'center', lineHeight: 1}}>
      <div style={{fontFamily: ANTON, fontSize: 210, color: COR.ipe, ...contorno(16)}}>16:48</div>
      <div style={{fontFamily: ANTON, fontSize: 84, color: '#fff', ...contorno(14), marginTop: 6}}>O ÔNIBUS DELA PERDE O FREIO</div>
    </div>
    <Selo texto="EP. 4" x={70} y={620} cor={COR.ipe} corTexto={COR.tinta} />
    <Selo texto="A OU B?" x={700} y={900} rot={4} />
  </AbsoluteFill>
);

// ------------------------------------------------------------ STORIES Ep. 4 (~16 s)
const TR = [
  {ini: 28.85, fim: 34.95, entra: 1.6},   // "Às 16:48, esse ônibus perde o freio… direto pra praça."
  {ini: 59.3, fim: 63.95, entra: 8.0},    // "Essa letra não é minha. Então quem mais tá acordado?"
];
export const STORIES4_DUR = 16.5;
const PAL: Palavra[] = TR.flatMap((tr) => (TEMPOS as any).palavras
  .filter((p: Palavra) => p.s >= tr.ini && p.s < tr.fim)
  .map((p: Palavra) => ({w: p.w, s: p.s - tr.ini + tr.entra, e: p.e - tr.ini + tr.entra})));
const DEST = new Set(['1648', 'freio', 'praca', 'minha', 'acordado']);

export const StoriesEp04: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const s = (x: number) => Math.round(x * fps);
  const pA = useEntrada(0.05, 240, 13);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={s(1.6)}>
        <AbsoluteFill style={{background: COR.tinta, alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${pA})`, textAlign: 'center'}}>
            <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 56, color: COR.ipe, letterSpacing: 8}}>EPISÓDIO 4</div>
            <div style={{fontFamily: ANTON, fontSize: 240, color: '#fff', lineHeight: 1}}>16:48</div>
          </div>
        </AbsoluteFill>
      </Sequence>
      {/* a lembrança: o ônibus descendo sem freio (sépia) */}
      <Sequence from={s(1.6)} durationInFrames={s(6.4)}>
        {sepia(<Camera chaves={[{t: 0, x: 1400, y: 1380, z: 1.2}, {t: 6.4, x: 2100, y: 1620, z: 1.0}]} {...LD} tremor={t > 4.5 ? 4 : 0}><Ladeira t={t} onibusDx={interpolate(t, [3.6, 8], [0, 640], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} /></Camera>)}
        <Carimbo x={540} y={420} texto="16:48 · SEM FREIO" em={31.48 - TR[0].ini} tam={90} />
      </Sequence>
      {/* o bilhete: "essa letra não é minha" */}
      <Sequence from={s(8.0)} durationInFrames={s(4.7)}>
        <Camera chaves={[{t: 0, x: 540, y: 880, z: 1.2}, {t: 4.7, x: 540, y: 880, z: 1.4}]} W={1080} H={1920} tremor={3}>
          <FotoClose verso giro={1} letra={1} tremor={Math.sin(t * 40) * 1.5} />
        </Camera>
        <Carimbo x={540} y={1170} texto="NÃO É DELA" em={60.3 - TR[1].ini} tam={110} />
      </Sequence>
      <Sequence from={s(12.7)}>
        <Camera chaves={[{t: 0, x: 1050, y: 1150, z: 1.0}, {t: 3.8, x: 1050, y: 1150, z: 1.1}]} {...LD}>
          <Ladeira t={t} roseX={980} velhaX={820} expr="desconfiada" />
        </Camera>
        <AbsoluteFill style={{background: 'rgba(20,22,27,.62)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
          <div style={{fontFamily: ANTON, fontSize: 130, color: '#fff', ...contorno(14), lineHeight: 1.02}}>QUEM MAIS TÁ<br /><span style={{color: COR.ipe}}>ACORDADO?</span></div>
          <div style={{display: 'inline-block', marginTop: 50, background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 22, padding: '12px 40px', fontFamily: ANTON, fontSize: 76, color: COR.tinta}}>EP. 4 JÁ NO AR</div>
          <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 22, letterSpacing: 2}}>ASSISTE NO PERFIL</div>
          <div style={{fontFamily: ANTON, fontSize: 84, color: COR.ipe}}>↓</div>
        </div>
      </Sequence>
      <Legenda pal={PAL} destaques={DEST} y={() => 1420} />
      <Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.4} />
      {TR.map((tr, i) => <Sequence key={i} from={s(tr.entra)}><Audio src={staticFile('ep04/audio.mp3')} startFrom={s(tr.ini)} endAt={s(tr.fim)} /></Sequence>)}
      <Sequence from={s(12.7)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.6} /></Sequence>
      <Sequence from={s(12.85)}><Audio src={staticFile('sfx/soco.wav')} volume={0.7} /></Sequence>
      <Sequence from={s(13.1)}><Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

/** Stories fixo pra enquete A/B do Ep. 4 (área livre pro adesivo à esquerda, y 930–1300) */
export const EnqueteEp04: React.FC = () => {
  const bt = (l: string, txt: string, cor: string) => (
    <div style={{width: 430, background: '#fff', border: `5px solid ${COR.tinta}`, borderRadius: 26, padding: '14px 12px', textAlign: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.35)'}}>
      <div style={{width: 84, height: 84, margin: '0 auto 6px', borderRadius: 42, background: cor, border: `5px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 58, lineHeight: '78px', color: COR.tinta}}>{l}</div>
      <div style={{fontFamily: ANTON, fontSize: 46, color: COR.tinta, lineHeight: 1.05}}>{txt}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera chaves={[{t: 0, x: 720, y: 440, z: 0.9}]} {...LD}>
        <Ladeira t={1.1} roseX={980} velhaX={820} expr="desconfiada" />
      </Camera>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.85) 0%, rgba(20,22,27,.55) 42%, rgba(20,22,27,.1) 70%, rgba(20,22,27,.3) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
        <span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '8px 34px', fontFamily: BARLOW, fontWeight: 800, fontSize: 44, color: COR.tinta, letterSpacing: 3}}>EP. 4 · VOCÊ DECIDE</span>
        <div style={{fontFamily: ANTON, fontSize: 116, color: '#fff', ...contorno(14), lineHeight: 1.02, marginTop: 34}}>POR ONDE ELAS<br /><span style={{color: COR.ipe}}>COMEÇAM?</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', gap: 22, justifyContent: 'center'}}>{bt('A', 'CONSERTAR O FREIO', COR.ipe)}{bt('B', 'TIRAR TODO MUNDO', COR.ceu)}</div>
      <div style={{position: 'absolute', left: 60, width: 520, top: 1600, textAlign: 'left', fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 2, textShadow: '0 3px 8px rgba(0,0,0,.7)'}}>O MAIS VOTADO VIRA O EP. 5</div>
    </AbsoluteFill>
  );
};
