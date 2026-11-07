// Capa do Ep. 1 e vídeo de Stories de apresentação.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import TEMPOS from './tempos-ep01.json';
import {Camera, Legenda, Palavra} from './camera';
import {Rua, RUA, POS} from './cenarios';
import {Medidor, Relogios, Flash, COR, useEntrada} from './pecas';

const ANTON = 'Anton, sans-serif';
const BARLOW = "'Barlow Condensed', sans-serif";
const duas = (p: React.ComponentProps<typeof Rua>) => [<Rua key="b" {...p} camada="base" />, <Rua key="r" {...p} camada="rose" />];

const Titulo: React.FC<{l1: string; l2: string; y: number; tam?: number; em?: number}> = ({l1, l2, y, tam = 150, em = 0}) => {
  const p = useEntrada(em, 260, 13);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `scale(${p})`, lineHeight: 1}}>
      <div style={{fontFamily: ANTON, fontSize: tam, color: '#fff', WebkitTextStroke: `16px ${COR.tinta}`, paintOrder: 'stroke fill'}}>{l1}</div>
      <div style={{fontFamily: ANTON, fontSize: tam * 0.86, color: COR.ipe, WebkitTextStroke: `16px ${COR.tinta}`, paintOrder: 'stroke fill', marginTop: 6}}>{l2}</div>
    </div>
  );
};

const Selo: React.FC<{texto: string; x: number; y: number; cor?: string; corTexto?: string; rot?: number; tam?: number}> = ({texto, x, y, cor = COR.terracota, corTexto = '#fff', rot = -4, tam = 52}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: cor, color: corTexto, fontFamily: ANTON, fontSize: tam, padding: '6px 30px', borderRadius: 16, border: `5px solid ${COR.tinta}`, boxShadow: '0 12px 30px rgba(0,0,0,.35)', letterSpacing: 2}}>{texto}</div>
);

/** CAPA: miolo 1080x1440 (y 240–1680) guarda título e rosto, pro corte da grade do Instagram. */
export const CapaEp01: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: POS.predio, y: 1330, z: 1.6}]} W={RUA.W} H={RUA.H} lim={RUA.lim}>
      <>{duas({congelado: 1, roseX: POS.predio, roseExpr: 'surpresa', roseT: 1.2, joaoX: POS.joao, onibusX: -20})}</>
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.55) 0%, rgba(20,22,27,0) 34%, rgba(20,22,27,0) 70%, rgba(20,22,27,.5) 100%)'}} />
    <Titulo l1="O MUNDO PAROU." l2="SÓ ELA SE MEXE." y={250} tam={118} em={-2} />
    <Selo texto="EP. 1" x={60} y={1420} cor={COR.ipe} corTexto={COR.tinta} />
    <Selo texto="16:47 ❚❚" x={740} y={1420} rot={4} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ STORIES (14 s)
const TRECHO = {ini: 11.85, fim: 18.25, entra: 1.7};
const PAL: Palavra[] = (TEMPOS as any).palavras
  .filter((p: Palavra) => p.s >= TRECHO.ini && p.s < TRECHO.fim)
  .map((p: Palavra) => ({w: p.w, s: p.s - TRECHO.ini + TRECHO.entra, e: p.e - TRECHO.ini + TRECHO.entra}));
const DEST = new Set(['bilhoes', 'uma', 'rose', 'voce']);

const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const seg = Math.min(47, Math.floor(44 + t * 2.2));
  return (
    <AbsoluteFill style={{background: COR.tinta, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 56, color: COR.ipe, letterSpacing: 8}}>NOVA SÉRIE</div>
      <div style={{fontFamily: ANTON, fontSize: 300, color: '#fff', lineHeight: 1}}>16:{seg}</div>
      <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 50, color: '#BFD3E6', letterSpacing: 4}}>SEGUNDA-FEIRA</div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const p = useEntrada(0.1, 220, 12);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(20,22,27,.62)'}} />
      <Titulo l1="O QUE VOCÊ" l2="FARIA?" y={330} tam={150} em={0.05} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', transform: `scale(${p})`}}>
        <div style={{display: 'inline-block', background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 22, padding: '14px 40px', fontFamily: ANTON, fontSize: 84, color: COR.tinta}}>EP. 1 JÁ NO AR</div>
        <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 26, letterSpacing: 2}}>ASSISTE AGORA NO PERFIL</div>
        <div style={{fontFamily: ANTON, fontSize: 90, color: COR.ipe, marginTop: 6}}>↓</div>
      </div>
    </AbsoluteFill>
  );
};

export const STORIES_DUR = 14;
export const StoriesEp01: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={Math.round(1.7 * fps)}><Abertura /></Sequence>
      <Sequence from={Math.round(1.7 * fps)} durationInFrames={Math.round(4.6 * fps)}>
        {(() => {
          const lt = t - 1.7;
          return (
            <AbsoluteFill>
              <Camera chaves={[{t: 0, x: 1700, y: 1150, z: 1.2}, {t: 4.6, x: 1500, y: 1120, z: 0.62}]} W={RUA.W} H={RUA.H} lim={RUA.lim}>
                <>{duas({congelado: 1, roseX: POS.predio, roseExpr: 'surpresa', roseT: lt, joaoX: POS.joao, onibusX: -20})}</>
              </Camera>
              <Flash em={0} />
              <Medidor x={60} y={300} rotulo="PESSOAS SE MEXENDO" de={8120000000} para={1} em={0.1} dur={3.9} largura={900} tamNum={92} corNum={COR.terracota} seta="▼" />
            </AbsoluteFill>
          );
        })()}
      </Sequence>
      <Sequence from={Math.round(6.3 * fps)} durationInFrames={Math.round(2.2 * fps)}>
        <Camera chaves={[{t: 0, x: POS.predio - 100, y: 1180, z: 2.4}, {t: 2.2, x: POS.predio - 80, y: 1160, z: 3.0}]} W={RUA.W} H={RUA.H} lim={RUA.lim}>
          <>{duas({congelado: 1, roseX: POS.predio, roseExpr: 'surpresa', roseT: t, joaoX: POS.joao, onibusX: -20})}</>
        </Camera>
        <Relogios rose="16:47:12" em={0.1} y={300} />
      </Sequence>
      <Sequence from={Math.round(8.5 * fps)}>
        <Camera chaves={[{t: 0, x: 1300, y: 1150, z: 0.7}, {t: 5.5, x: 1300, y: 1150, z: 0.8}]} W={RUA.W} H={RUA.H} lim={RUA.lim}>
          <>{duas({congelado: 1, roseX: POS.predio, roseExpr: 'desconfiada', roseT: t, joaoX: POS.joao, onibusX: -20})}</>
        </Camera>
        <Final />
      </Sequence>
      <Legenda pal={PAL} destaques={DEST} y={() => 1250} lado={(tt) => (tt > 6.3 ? 'esq' : 'centro')} />
      {/* som */}
      <Audio src={staticFile('sfx/tiquetaque.wav')} volume={0.35} />
      <Sequence from={Math.round(0.85 * fps)}><Audio src={staticFile('sfx/congela.wav')} volume={0.7} /></Sequence>
      <Sequence from={Math.round(1.75 * fps)}><Audio src={staticFile('sfx/contador.wav')} volume={0.35} /></Sequence>
      <Sequence from={Math.round(TRECHO.entra * fps)}><Audio src={staticFile('ep01/audio.mp3')} startFrom={Math.round(TRECHO.ini * fps)} endAt={Math.round(TRECHO.fim * fps)} /></Sequence>
      <Sequence from={Math.round(8.5 * fps)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.6} /></Sequence>
      <Sequence from={Math.round(8.65 * fps)}><Audio src={staticFile('sfx/soco.wav')} volume={0.7} /></Sequence>
      <Sequence from={Math.round(9.6 * fps)}><Audio src={staticFile('sfx/tiquetaque.wav')} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};
