// Capa e Stories do Ep. 2 "O rastro na poeira".
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import TEMPOS from './tempos-ep02.json';
import {Camera, Legenda, Palavra} from './camera';
import {Relojoaria, LOJA2, REL, FotoClose} from './cenarios2';
import {Carimbo, COR, useEntrada} from './pecas';

const ANTON = 'Anton, sans-serif';
const BARLOW = "'Barlow Condensed', sans-serif";

const Titulo: React.FC<{l1: string; l2: string; y: number; tam?: number; em?: number}> = ({l1, l2, y, tam = 140, em = 0}) => {
  const p = useEntrada(em, 260, 13);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${p})`, lineHeight: 1}}>
      <div style={{fontFamily: ANTON, fontSize: tam, color: '#fff', WebkitTextStroke: `16px ${COR.tinta}`, paintOrder: 'stroke fill'}}>{l1}</div>
      <div style={{fontFamily: ANTON, fontSize: tam * 0.92, color: COR.ipe, WebkitTextStroke: `16px ${COR.tinta}`, paintOrder: 'stroke fill', marginTop: 6}}>{l2}</div>
    </div>
  );
};
const Selo: React.FC<{texto: string; x: number; y: number; cor?: string; corTexto?: string; rot?: number; tam?: number}> = ({texto, x, y, cor = COR.terracota, corTexto = '#fff', rot = -4, tam = 52}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: cor, color: corTexto, fontFamily: ANTON, fontSize: tam, padding: '6px 30px', borderRadius: 16, border: `5px solid ${COR.tinta}`, boxShadow: '0 12px 30px rgba(0,0,0,.35)', letterSpacing: 2}}>{texto}</div>
);
const L2 = {W: LOJA2.W, H: LOJA2.H, lim: LOJA2.lim};

/** CAPA do Ep. 2 (título e rosto no miolo 1080x1440 pro corte da grade) */
export const CapaEp02: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: 1180, y: 1000, z: 1.45}]} {...L2}>
      <Relojoaria t={0.8} ponteiro={7} roseX={1300} roseExpr="surpresa" portaAbre={0.55} sombra={0.9} />
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.6) 0%, rgba(20,22,27,0) 36%, rgba(20,22,27,0) 72%, rgba(20,22,27,.5) 100%)'}} />
    <Titulo l1="ALGUÉM VIGIAVA" l2="A ROSE." y={250} tam={124} em={-2} />
    <Selo texto="EP. 2" x={70} y={600} cor={COR.ipe} corTexto={COR.tinta} />
    <Selo texto="A OU B?" x={300} y={1450} rot={4} />
  </AbsoluteFill>
);

// ------------------------------------------------------------ STORIES Ep. 2 (~18 s)
// trechos da voz (tempo no áudio do episódio) e onde entram no Stories
const TR = [
  {ini: 73.15, fim: 79.65, entra: 1.6},  // "Uma foto da Rose… um minuto antes do mundo parar."
  {ini: 84.2, fim: 85.95, entra: 8.3},   // "Volto pra buscar o relógio."
  {ini: 86.5, fim: 91.05, entra: 10.3},  // "E nesse exato segundo, o sino da porta toca. Alguém tá entrando."
];
export const STORIES2_DUR = 18.5;
const PAL: Palavra[] = TR.flatMap((tr) => (TEMPOS as any).palavras
  .filter((p: Palavra) => p.s >= tr.ini && p.s < tr.fim)
  .map((p: Palavra) => ({w: p.w, s: p.s - tr.ini + tr.entra, e: p.e - tr.ini + tr.entra})));
const DEST = new Set(['foto', 'rose', '1646', 'antes', 'volto', 'sino', 'entrando']);

const Abertura: React.FC = () => {
  const p = useEntrada(0.05, 240, 13);
  return (
    <AbsoluteFill style={{background: COR.tinta, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${p})`, textAlign: 'center'}}>
        <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 56, color: COR.ipe, letterSpacing: 8}}>EPISÓDIO 2</div>
        <div style={{fontFamily: ANTON, fontSize: 150, color: '#fff', lineHeight: 1.05}}>O RASTRO<br />NA POEIRA</div>
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const p = useEntrada(0.1, 220, 12);
  const bt = (l: string, txt: string, cor: string) => (
    <div style={{width: 380, background: '#fff', border: `5px solid ${COR.tinta}`, borderRadius: 26, padding: '14px 10px', textAlign: 'center'}}>
      <div style={{width: 80, height: 80, margin: '0 auto 6px', borderRadius: 40, background: cor, border: `5px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 56, lineHeight: '74px', color: COR.tinta}}>{l}</div>
      <div style={{fontFamily: ANTON, fontSize: 44, color: COR.tinta, lineHeight: 1.05}}>{txt}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(20,22,27,.66)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', transform: `scale(${p})`}}>
        <div style={{fontFamily: ANTON, fontSize: 120, color: '#fff', WebkitTextStroke: `12px ${COR.tinta}`, paintOrder: 'stroke fill', lineHeight: 1.05}}>O QUE A ROSE <span style={{color: COR.ipe}}>FAZ?</span></div>
        <div style={{display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40}}>{bt('A', 'SE ESCONDER E ESPERAR', COR.ipe)}{bt('B', 'PEGAR O RELÓGIO E FUGIR', COR.ceu)}</div>
        <div style={{display: 'inline-block', marginTop: 44, background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 22, padding: '12px 40px', fontFamily: ANTON, fontSize: 70, color: COR.tinta}}>EP. 2 JÁ NO AR</div>
        <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 50, color: '#fff', marginTop: 20, letterSpacing: 2}}>VOTA NOS COMENTÁRIOS</div>
        <div style={{fontFamily: ANTON, fontSize: 84, color: COR.ipe}}>↓</div>
      </div>
    </AbsoluteFill>
  );
};

export const StoriesEp02: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const s = (x: number) => Math.round(x * fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={s(1.6)}><Abertura /></Sequence>
      {/* a foto */}
      <Sequence from={s(1.6)} durationInFrames={s(6.7)}>
        <Camera chaves={[{t: 0, x: 540, y: 900, z: 0.95}, {t: 3.5, x: 600, y: 1000, z: 1.3}, {t: 6.7, x: 540, y: 900, z: 1.15}]} W={1080} H={1920} tremor={t > 6 ? 3 : 0}>
          <FotoClose verso={false} giro={0} letra={0} tremor={0} />
        </Camera>
        <Carimbo x={540} y={1180} texto="SEG · 16:46" em={76.22 - TR[0].ini} tam={100} />
        <Carimbo x={540} y={330} texto="UM MINUTO ANTES" em={78.48 - TR[0].ini} tam={70} />
      </Sequence>
      {/* o verso */}
      <Sequence from={s(8.3)} durationInFrames={s(2.0)}>
        {(() => { const lt = t - 8.3; const g = interpolate(lt, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'});
          return <Camera chaves={[{t: 0, x: 540, y: 880, z: 1.2}, {t: 2, x: 540, y: 880, z: 1.35}]} W={1080} H={1920}><FotoClose verso={g > 0.5} giro={g} letra={interpolate(lt, [0.3, 1.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} tremor={0} /></Camera>; })()}
      </Sequence>
      {/* o sino e a sombra */}
      <Sequence from={s(10.3)} durationInFrames={s(4.6)}>
        {(() => { const lt = t - 10.3; const ts = 89.54 - TR[2].ini; const k = interpolate(lt, [ts, 4.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <Camera chaves={[{t: 0, x: 1000, y: 1150, z: 1.2}, {t: ts - 0.3, x: 700, y: 1000, z: 1.1}, {t: ts + 0.1, x: REL.sino.x + 60, y: REL.sino.y + 80, z: 2.2}, {t: 4.6, x: 560, y: 1200, z: 0.95}]} socos={[ts]} {...L2}>
            <Relojoaria t={lt} ponteiro={20 + lt} roseX={1300} roseExpr="surpresa" fotoTirada portaAbre={0.6 * k} sombra={k} sinoBalanca={lt > ts ? 18 * Math.sin((lt - ts) * 14) * Math.exp(-(lt - ts) * 1.5) : 0} />
          </Camera>; })()}
      </Sequence>
      <Sequence from={s(14.9)}>
        <Camera chaves={[{t: 0, x: 1200, y: 1000, z: 1.0}, {t: 3.6, x: 1200, y: 1000, z: 1.1}]} {...L2}>
          <Relojoaria t={t} ponteiro={30 + t} roseX={1300} roseExpr="desconfiada" fotoTirada portaAbre={0.6} sombra={1} />
        </Camera>
        <Final />
      </Sequence>
      <Legenda pal={PAL} destaques={DEST} y={() => 1420} />
      {/* som */}
      <Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.45} />
      {TR.map((tr, i) => <Sequence key={i} from={s(tr.entra)}><Audio src={staticFile('ep02/audio.mp3')} startFrom={s(tr.ini)} endAt={s(tr.fim)} /></Sequence>)}
      <Sequence from={s(1.55)}><Audio src={staticFile('sfx/foto.wav')} volume={0.6} /></Sequence>
      <Sequence from={s(8.25)}><Audio src={staticFile('sfx/foto.wav')} volume={0.5} /></Sequence>
      <Sequence from={s(14.9)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.6} /></Sequence>
      <Sequence from={s(15.05)}><Audio src={staticFile('sfx/soco.wav')} volume={0.7} /></Sequence>
      <Sequence from={s(15.3)}><Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

/** Stories fixo (imagem) pra enquete A/B do Ep. 2. Área livre pro adesivo: x 80–720, y 930–1300. */
export const EnqueteEp02: React.FC = () => {
  const bt = (l: string, txt: string, cor: string) => (
    <div style={{width: 430, background: '#fff', border: `5px solid ${COR.tinta}`, borderRadius: 26, padding: '14px 12px', textAlign: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.35)'}}>
      <div style={{width: 84, height: 84, margin: '0 auto 6px', borderRadius: 42, background: cor, border: `5px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 58, lineHeight: '78px', color: COR.tinta}}>{l}</div>
      <div style={{fontFamily: ANTON, fontSize: 46, color: COR.tinta, lineHeight: 1.05}}>{txt}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera chaves={[{t: 0, x: 1300 - 300 / 0.8, y: 975, z: 0.8}]} {...L2}>
        <Relojoaria t={1.3} ponteiro={8} roseX={1300} roseExpr="desconfiada" fotoTirada portaAbre={0.6} sombra={1} />
      </Camera>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.82) 0%, rgba(20,22,27,.55) 45%, rgba(20,22,27,.15) 75%, rgba(20,22,27,.35) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
        <span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '8px 34px', fontFamily: BARLOW, fontWeight: 800, fontSize: 44, color: COR.tinta, letterSpacing: 3}}>EP. 2 · VOCÊ DECIDE</span>
        <div style={{fontFamily: ANTON, fontSize: 132, color: '#fff', WebkitTextStroke: `14px ${COR.tinta}`, paintOrder: 'stroke fill', lineHeight: 1.02, marginTop: 34}}>O QUE A ROSE<br /><span style={{color: COR.ipe}}>FAZ AGORA?</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', gap: 22, justifyContent: 'center'}}>{bt('A', 'SE ESCONDER E ESPERAR', COR.ipe)}{bt('B', 'PEGAR O RELÓGIO E FUGIR', COR.ceu)}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1560, textAlign: 'center', fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 2, textShadow: '0 3px 8px rgba(0,0,0,.6)'}}>O MAIS VOTADO VIRA O EP. 3</div>
    </AbsoluteFill>
  );
};
