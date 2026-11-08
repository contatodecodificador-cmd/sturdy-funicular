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

// ====================================================================== Ep. 3: capa, Stories, enquete
import {Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import TEMPOS3 from './tempos-ep03.json';
import {Legenda, Palavra} from './camera';
import {Esconderijo, ESCOND, Fresta} from './cenarios3';
import {Carimbo, Cartao, useEntrada} from './pecas';

const Selo3: React.FC<{texto: string; x: number; y: number; cor?: string; corTexto?: string; rot?: number}> = ({texto, x, y, cor = COR.terracota, corTexto = '#fff', rot = -4}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: cor, color: corTexto, fontFamily: ANTON, fontSize: 52, padding: '6px 30px', borderRadius: 16, border: `5px solid ${COR.tinta}`, boxShadow: '0 12px 30px rgba(0,0,0,.35)', letterSpacing: 2}}>{texto}</div>
);

/** CAPA do Ep. 3: a visita em silhueta e a Rose de pé atrás do balcão (sem estragar a revelação) */
export const CapaEp03: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: 1080, y: 1060, z: 1.45}]} {...L2}>
      <Relojoaria t={0.6} ponteiro={30} roseX={950} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={1180} velhaSil={1} velhaBraco={-20} relogioPego />
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.65) 0%, rgba(20,22,27,0) 36%, rgba(20,22,27,0) 72%, rgba(20,22,27,.5) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', lineHeight: 1}}>
      <div style={{fontFamily: ANTON, fontSize: 150, color: '#fff', ...contorno(16)}}>ELA SABIA</div>
      <div style={{fontFamily: ANTON, fontSize: 88, color: COR.ipe, ...contorno(14), marginTop: 10}}>QUE VOCÊS IAM ESCOLHER A</div>
    </div>
    <Selo3 texto="EP. 3" x={70} y={560} cor={COR.ipe} corTexto={COR.tinta} />
    <Selo3 texto="QUEM É ELA?" x={600} y={1460} rot={4} />
  </AbsoluteFill>
);

const TR3 = [
  {ini: 43.35, fim: 48.75, entra: 1.6},   // "Detalhe número três… Só que o cabelo é branco."
  {ini: 54.35, fim: 59.1, entra: 7.4},    // "Pode sair, Rose… Eu sabia que você ia se esconder."
];
export const STORIES3_DUR = 17;
const PAL3: Palavra[] = TR3.flatMap((tr) => (TEMPOS3 as any).palavras
  .filter((p: Palavra) => p.s >= tr.ini && p.s < tr.fim)
  .map((p: Palavra) => ({w: p.w, s: p.s - tr.ini + tr.entra, e: p.e - tr.ini + tr.entra})));
const DEST3 = new Set(['tres', 'faixa', 'branco', 'rose', 'sabia', 'esconder']);

export const StoriesEp03: React.FC = () => {
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
            <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 56, color: COR.ipe, letterSpacing: 8}}>EPISÓDIO 3</div>
            <div style={{fontFamily: ANTON, fontSize: 150, color: '#fff', lineHeight: 1.05}}>O DONO<br />DO RELÓGIO</div>
          </div>
        </AbsoluteFill>
      </Sequence>
      {/* pela fresta: a faixa… e o cabelo branco */}
      <Sequence from={s(1.6)} durationInFrames={s(5.8)}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + Math.max(0, t - 5) * 0.12})`}}><Fresta alvo="cabelo" abre={interpolate(t, [1.6, 2.2], [0.1, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} /></div>
        <Cartao titulo="DETALHE 3" sub="A FAIXA" em={0.1} y={330} />
        <Carimbo x={540} y={1250} texto="BRANCO" em={48.14 - TR3[0].ini} tam={110} cor="#ECE8E1" />
      </Sequence>
      {/* a silhueta fala */}
      <Sequence from={s(7.4)} durationInFrames={s(2.9)}>
        <Camera chaves={[{t: 0, x: 1180, y: 1300, z: 1.9}, {t: 2.9, x: 1150, y: 1250, z: 1.5}]} {...L2}>
          <Relojoaria t={t} ponteiro={32 + t} roseVisivel={false} fotoTirada portaAbre={0.65} sombra={0.3} velhaX={1180} velhaSil={1} velhaBraco={-20} relogioPego velhaFalando />
        </Camera>
      </Sequence>
      {/* a Rose escondida ouve o próprio nome */}
      <Sequence from={s(10.3)} durationInFrames={s(2.1)}>
        <Camera chaves={[{t: 0, x: 540 - 260 / 2.4, y: 995, z: 2.4}, {t: 2.1, x: 540 - 260 / 2.8, y: 975, z: 2.8}]} W={ESCOND.W} H={ESCOND.H} lim={ESCOND.lim} tremor={5}>
          <Esconderijo t={t} expr="surpresa" sombra={1} />
        </Camera>
      </Sequence>
      <Sequence from={s(12.4)}>
        <Camera chaves={[{t: 0, x: 1080, y: 1060, z: 1.0}, {t: 4.6, x: 1080, y: 1060, z: 1.1}]} {...L2}>
          <Relojoaria t={t} ponteiro={40 + t} roseX={950} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={1180} velhaSil={1} velhaBraco={-20} relogioPego />
        </Camera>
        <AbsoluteFill style={{background: 'rgba(20,22,27,.62)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
          <div style={{fontFamily: ANTON, fontSize: 150, color: '#fff', ...contorno(14), lineHeight: 1.02}}>QUEM É <span style={{color: COR.ipe}}>ELA?</span></div>
          <div style={{display: 'inline-block', marginTop: 50, background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 22, padding: '12px 40px', fontFamily: ANTON, fontSize: 76, color: COR.tinta}}>EP. 3 JÁ NO AR</div>
          <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 22, letterSpacing: 2}}>ASSISTE NO PERFIL</div>
          <div style={{fontFamily: ANTON, fontSize: 84, color: COR.ipe}}>↓</div>
        </div>
      </Sequence>
      <Legenda pal={PAL3} destaques={DEST3} y={(tt) => (tt > 10.3 && tt < 12.4 ? 470 : 1420)} />
      <Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.4} />
      {TR3.map((tr, i) => <Sequence key={i} from={s(tr.entra)}><Audio src={staticFile('ep03/audio.mp3')} startFrom={s(tr.ini)} endAt={s(tr.fim)} /></Sequence>)}
      <Sequence from={s(12.4)}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.6} /></Sequence>
      <Sequence from={s(12.55)}><Audio src={staticFile('sfx/soco.wav')} volume={0.7} /></Sequence>
      <Sequence from={s(12.9)}><Audio src={staticFile('sfx/relogio_bolso.wav')} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};

/** Stories fixo pra enquete A/B do Ep. 3 (área livre pro adesivo: x 80–720, y 930–1300) */
export const EnqueteEp03: React.FC = () => {
  const bt = (l: string, txt: string, cor: string) => (
    <div style={{width: 430, background: '#fff', border: `5px solid ${COR.tinta}`, borderRadius: 26, padding: '14px 12px', textAlign: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.35)'}}>
      <div style={{width: 84, height: 84, margin: '0 auto 6px', borderRadius: 42, background: cor, border: `5px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 58, lineHeight: '78px', color: COR.tinta}}>{l}</div>
      <div style={{fontFamily: ANTON, fontSize: 46, color: COR.tinta, lineHeight: 1.05}}>{txt}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera chaves={[{t: 0, x: 1065 - 280 / 0.8, y: 760, z: 0.8}]} {...L2}>
        <Relojoaria t={1.1} ponteiro={60} roseX={950} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={1180} velhaExpr="feliz" velhaBraco={-30} relogioPego />
      </Camera>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.85) 0%, rgba(20,22,27,.55) 45%, rgba(20,22,27,.12) 75%, rgba(20,22,27,.35) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
        <span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '8px 34px', fontFamily: BARLOW, fontWeight: 800, fontSize: 44, color: COR.tinta, letterSpacing: 3}}>EP. 3 · VOCÊ DECIDE</span>
        <div style={{fontFamily: ANTON, fontSize: 120, color: '#fff', ...contorno(14), lineHeight: 1.02, marginTop: 34}}>A ROSE CONFIA<br /><span style={{color: COR.ipe}}>NELA MESMA?</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', gap: 22, justifyContent: 'center'}}>{bt('A', 'CONFIAR E IR COM ELA', COR.ipe)}{bt('B', 'NÃO ACREDITAR E FUGIR', COR.ceu)}</div>
      <div style={{position: 'absolute', left: 60, width: 520, top: 1560, textAlign: 'left', fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: '#fff', letterSpacing: 2, textShadow: '0 3px 8px rgba(0,0,0,.7)'}}>O MAIS VOTADO VIRA O EP. 4</div>
    </AbsoluteFill>
  );
};

/** Resultado da votação do Ep. 3: A venceu (confiar e ir com ela). */
export const ResultadoEp03: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Camera chaves={[{t: 0, x: 1065 - 300 / 0.8, y: 740, z: 0.8}]} {...L2}>
      <Relojoaria t={2.4} ponteiro={60} roseX={950} roseExpr="feliz" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={1180} velhaExpr="feliz" velhaBraco={-30} relogioPego />
    </Camera>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,22,27,.85) 0%, rgba(20,22,27,.6) 50%, rgba(20,22,27,.15) 80%, rgba(20,22,27,.4) 100%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center'}}>
      <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 52, color: COR.ipe, letterSpacing: 6}}>RESULTADO DO EP. 3</div>
      <div style={{fontFamily: ANTON, fontSize: 130, color: '#fff', ...contorno(14), lineHeight: 1.02, marginTop: 10}}>VOCÊS<br />ESCOLHERAM</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 720, background: '#fff', border: `6px solid ${COR.tinta}`, borderRadius: 34, padding: '24px 20px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.45)', transform: 'rotate(-2deg)'}}>
        <div style={{width: 150, height: 150, margin: '0 auto 10px', borderRadius: 75, background: COR.ipe, border: `6px solid ${COR.tinta}`, fontFamily: ANTON, fontSize: 110, lineHeight: '140px', color: COR.tinta}}>A</div>
        <div style={{fontFamily: ANTON, fontSize: 72, color: COR.tinta, lineHeight: 1.05}}>CONFIAR E<br />IR COM ELA</div>
        <div style={{position: 'absolute', right: -40, top: -36, transform: 'rotate(12deg)', fontFamily: ANTON, fontSize: 64, color: COR.praca, border: `7px solid ${COR.praca}`, borderRadius: 12, padding: '0 20px', background: 'rgba(255,248,236,.95)', letterSpacing: 3}}>VENCEU</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 60, width: 560, top: 1250, textAlign: 'left', fontFamily: ANTON, fontSize: 74, color: '#fff', ...contorno(10), lineHeight: 1.05}}>AS DUAS ROSES <span style={{color: COR.ipe}}>JUNTAS…</span></div>
    <div style={{position: 'absolute', left: 60, width: 560, top: 1440, textAlign: 'left', fontFamily: BARLOW, fontWeight: 800, fontSize: 44, color: '#fff', letterSpacing: 2, textShadow: '0 3px 8px rgba(0,0,0,.7)'}}>E O QUE ACONTECE ÀS 16:48?</div>
  </AbsoluteFill>
);
