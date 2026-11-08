/* =====================================================================================
   o-bunker/parte4/cenarios: os cenários da parte 4 (o túnel e a sala das telas).
     CenaTunel       o túnel de terra em perspectiva (CSS 3D), as paredes cheias de risquinhos de outras
                     pessoas, a lanterna tremendo e, no fim, a grade com a luz vermelha piscando
                     (fim = 0 a 1: o quanto o fim do túnel aparece)
     CenaSalaTelas   a sala embaixo da TORRE 7: uma parede de telas (CAM 01 a CAM 12), cada uma com um
                     quintal ou um bunker do bairro, com alguém lá embaixo; a CAM 07 é o bunker dele
                     (cam7 = o que a CAM 07 mostra); grade = as barras na frente (vista de dentro do túnel)
     TELA            onde fica cada tela na parede (pra câmera achar a CAM 07)
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { Brilho, Escuro } from '../../../kit/luz';
import { H, W } from '../../../kit/pecas';
import { FONTEM } from '../../../tema';
import { Riscos } from '../pecas';

const VERMELHO = '224,24,45';

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------ o túnel */
const TERRA = { parede: '#5A4634', chao: '#3E3024', teto: '#3A2C22' };

/** uma parede do túnel com risquinhos de muita gente (grupos em tamanhos e cores diferentes) */
const ParedeRiscada: React.FC<{ semente: string }> = ({ semente }) => (
  <div style={{ position: 'absolute', inset: 0, background: TERRA.parede }}>
    {Array.from({ length: 44 }, (_, i) => {
      const x = random(`${semente}-x-${i}`) * 2400;
      const y = 200 + random(`${semente}-y-${i}`) * 1800;
      const esc = 0.7 + random(`${semente}-e-${i}`) * 0.7;
      const cor = ['#D8C8AE', '#A8987E', '#E8DCC6', '#8A7A66'][i % 4];
      return <Riscos key={i} x={x} y={y} escala={esc} n={10 + Math.floor(random(`${semente}-n-${i}`) * 25)} colunas={5} cor={cor} />;
    })}
  </div>
);

export const CenaTunel: React.FC<{ avanca?: number; fim?: number; treme?: boolean; lanterna?: boolean }> = ({ avanca = 0, fim = 0, treme = true, lanterna = true }) => {
  const f = useCurrentFrame();
  const tremor = treme ? Math.sin(f * 1.7) * 3 + Math.sin(f * 0.6) * 4 : 0;
  const pisca = Math.floor(f / 10) % 2 === 0;
  const prof = 2600;
  return (
    <AbsoluteFill style={{ background: '#0A0607' }}>
      <AbsoluteFill style={{ perspective: 800, perspectiveOrigin: '540px 960px' }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${avanca * 700}px)` }}>
          {/* paredes, chão e teto */}
          <div style={{ position: 'absolute', left: -60, top: -200, width: prof, height: 2320, transformOrigin: '0 0', transform: 'rotateY(90deg)' }}>
            <ParedeRiscada semente="esq" />
          </div>
          <div style={{ position: 'absolute', left: 1140, top: -200, width: prof, height: 2320, transformOrigin: '0 0', transform: 'rotateY(90deg)' }}>
            <ParedeRiscada semente="dir" />
          </div>
          <div style={{ position: 'absolute', left: -60, top: 2120, width: 1200, height: prof, transformOrigin: '0 0', transform: 'rotateX(90deg)', background: TERRA.chao }} />
          <div style={{ position: 'absolute', left: -60, top: -200, width: 1200, height: prof, transformOrigin: '0 0', transform: 'rotateX(90deg)', background: TERRA.teto }} />
          {/* o fim do túnel: a grade e a luz vermelha piscando atrás */}
          <div style={{ position: 'absolute', left: -60, top: -200, width: 1200, height: 2320, transform: `translateZ(${-prof}px)`, background: `rgba(${VERMELHO},${pisca ? 0.6 : 0.22})`, opacity: fim }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ position: 'absolute', left: 60 + i * 135, top: 0, width: 40, height: 2320, background: '#1E1A1A' }} />
            ))}
            <div style={{ position: 'absolute', left: 0, top: 1100, width: 1200, height: 40, background: '#1E1A1A' }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* a lanterna dele, de baixo pra frente, tremendo */}
      <Escuro
        opacidade={0.86}
        cones={lanterna ? [{ x: 540 + tremor, y: 1950, angulo: 270 + tremor * 0.6, abertura: 34, alcance: 1900, forca: 0.95 }] : []}
        luzes={[{ x: 540, y: 960, r: 260, forca: 0.5 * fim }, { x: 540, y: 1400, rx: 700, ry: 500, r: 700, forca: 0.3 }]}
      />
      {fim > 0 ? <Brilho x={540} y={960} r={340} cor={VERMELHO} forca={(pisca ? 0.5 : 0.2) * fim} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ a sala das telas */
/** a parede de telas: 3 colunas × 4 linhas */
export const TELA = (n: number) => {
  const i = n - 1;
  const col = i % 3;
  const lin = Math.floor(i / 3);
  return { x: 120 + col * 290, y: 420 + lin * 230, w: 260, h: 190 };
};

/** a imagem pequena de cada câmera: um bunker com alguém sentado, ou um quintal à noite */
const Miniatura: React.FC<{ n: number; w: number; h: number }> = ({ n, w, h }) => {
  const bunker = n % 2 === 1;
  const vazio = n === 10; // a pista: um bunker vazio, com a escotilha aberta
  const tom = ['#5A5048', '#4E4640', '#5E544A'][n % 3];
  return (
    <svg width={w} height={h} viewBox="0 0 260 190">
      {bunker ? (
        <>
          <rect width={260} height={190} fill={tom} />
          <path d="M0,0 L60,40 L200,40 L260,0 Z" fill="#3E3832" />
          <path d="M0,190 L60,150 L200,150 L260,190 Z" fill="#3A342E" />
          <rect x={60} y={40} width={140} height={110} fill="#6A6058" />
          {/* os risquinhos de cada um */}
          {Array.from({ length: 4 + (n % 4) }, (_, k) => (
            <path key={k} d={`M${74 + k * 14},60 l0,16 M${78 + k * 14},60 l0,16`} stroke="#2E2A26" strokeWidth={2} />
          ))}
          {vazio ? (
            <ellipse cx={130} cy={46} rx={30} ry={8} fill="#E8E0D0" />
          ) : (
            <g>
              {/* alguém sentado na cama, de costas */}
              <rect x={70 + (n % 3) * 20} y={128} width={90} height={18} fill="#4A4630" />
              <circle cx={110 + (n % 3) * 20} cy={98} r={14} fill="#2A2420" />
              <path d={`M${92 + (n % 3) * 20},132 Q${110 + (n % 3) * 20},104 ${128 + (n % 3) * 20},132 Z`} fill="#3A3A36" />
            </g>
          )}
        </>
      ) : (
        <>
          <rect width={260} height={190} fill="#1E1A26" />
          <rect x={0} y={120} width={260} height={70} fill="#2E3A24" />
          <path d="M40,120 L40,70 L100,40 L160,70 L160,120 Z" fill="#3A3434" />
          <ellipse cx={200} cy={150} rx={34} ry={12} fill="#555" />
        </>
      )}
    </svg>
  );
};

export const CenaSalaTelas: React.FC<{ cam7?: React.ReactNode; apagadas?: boolean; grade?: number; luzMic?: number }> = ({ cam7, apagadas = false, grade = 0, luzMic = 0 }) => {
  const f = useCurrentFrame();
  const rec = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: '#0C0809' }}>
      <Svg>
        {/* a parede de concreto e a mesa com o microfone */}
        <rect x={0} y={0} width={W} height={H} fill="#1A1516" />
        <rect x={60} y={360} width={960} height={980} rx={10} fill="#141012" />
        <rect x={0} y={1400} width={W} height={520} fill="#120E0F" />
        <rect x={240} y={1360} width={600} height={40} fill="#2A2224" />
        <rect x={520} y={1250} width={14} height={110} fill="#3A3436" />
        <ellipse cx={527} cy={1240} rx={26} ry={34} fill="#2A2426" />
        <circle cx={560} cy={1300} r={10} fill={luzMic > 0 ? '#E0182D' : '#3A2024'} />
      </Svg>
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const t = TELA(n);
        const ruido = random(`ruido-${n}-${Math.floor(f / 3)}`);
        return (
          <div key={n} style={{ position: 'absolute', left: t.x, top: t.y, width: t.w, height: t.h, background: '#050404', border: '6px solid #2A2426', borderRadius: 8, overflow: 'hidden' }}>
            {apagadas ? null : n === 7 && cam7 ? (
              <div style={{ position: 'absolute', inset: 0 }}>{cam7}</div>
            ) : (
              <Miniatura n={n} w={t.w - 12} h={t.h - 12} />
            )}
            {apagadas ? null : (
              <>
                <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)`, opacity: 0.7 + ruido * 0.3 }} />
                <div style={{ position: 'absolute', left: 8, top: 6, fontFamily: FONTEM.mono, fontWeight: 700, fontSize: 16, color: '#F5EFEA', textShadow: '0 1px 2px #000' }}>
                  CAM {String(n).padStart(2, '0')}
                </div>
                <div style={{ position: 'absolute', right: 10, top: 9, width: 10, height: 10, borderRadius: 5, background: rec ? '#E0182D' : '#5A1018' }} />
              </>
            )}
          </div>
        );
      })}
      {/* a luz das telas na sala */}
      <Brilho x={540} y={860} r={900} cor="170,190,200" forca={apagadas ? 0 : 0.16} />
      <Brilho x={560} y={1300} r={120} cor={VERMELHO} forca={0.6 * luzMic} />
      {/* as barras da grade, na frente (vista de dentro do túnel) */}
      {grade > 0 ? (
        <Svg>
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={20 + i * 130} y={0} width={30} height={H} fill="#151112" opacity={grade} />
          ))}
          <rect x={0} y={1080} width={W} height={34} fill="#151112" opacity={grade} />
        </Svg>
      ) : null}
    </AbsoluteFill>
  );
};
