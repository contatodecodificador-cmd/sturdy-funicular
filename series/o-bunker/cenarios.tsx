/* =====================================================================================
   o-bunker/cenarios: o cenário de cada cena de "O Bunker" (1080x1920), já com a luz.
   Cada um recebe o estado que muda na cena e desenha:
   cenário e personagens → <Escuro> → o que emite luz (lâmpada, visor, luzes do medidor) → tom da luz.
     CenaBunker      1, 7, 8, 9  o bunker hoje: concreto, a cama de campanha, a parede dos risquinhos,
                                 o filtro, o medidor, o rádio, a escada até a escotilha no teto e a
                                 luz vermelha de emergência
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Caixa, Comodo, proj, type Sala3D } from '../../kit/casa';
import { Brilho, Escuro } from '../../kit/luz';
import { COR, H, W } from '../../kit/pecas';
import { AMARELO, Filtro, Medidor, METAL, Radio, Riscos, VERDE, VISOR } from './pecas';
import { type Expressao, Otavio } from './personagens';

const VERMELHO = '224,24,45';

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------ o bunker */
export const SB: Sala3D = { x1: 160, y1: 420, x2: 920, y2: 1180, vx: 540, vy: 780, F: 900 };
const CONCRETO = { fundo: '#8A867E', lado: '#77736B', teto: '#5E5B55', piso: '#66625B', linhaPiso: '#55514B', rodape: '#55514B' };

/** onde ficam as coisas na parede do fundo (coordenadas de tela, z = 0) */
export const BUNKER = {
  riscos: { x: 196, y: 468, escala: 0.5, colunas: 7, n: 70 },
  filtro: { x: 708, y: 486, escala: 0.56 },
  medidor: { x: 712, y: 712, escala: 0.56 },
  lampada: { x: 636, y: 446 },
  escada: { x1: 500, x2: 580 },
  radio: { x: 700, y: 1086, escala: 0.62 },
  /** o rosto do Otávio sentado na cama */
  rosto: { x: 236, y: 880 },
};

/** a lâmpada de emergência com a grade, na parede do fundo, perto do teto */
const Lampada: React.FC<{ acesa?: number }> = ({ acesa = 1 }) => {
  const { x, y } = BUNKER.lampada;
  return (
    <Svg>
      <rect x={x - 34} y={y - 10} width={68} height={16} rx={4} fill={METAL.escuro} />
      <ellipse cx={x} cy={y + 26} rx={28} ry={24} fill={`rgba(${VERMELHO},${0.35 + 0.65 * acesa})`} />
      <ellipse cx={x - 8} cy={y + 18} rx={8} ry={6} fill="#FFD0D5" opacity={0.5 * acesa} />
      <path d={`M${x - 28},${y + 26} L${x + 28},${y + 26} M${x},${y + 2} L${x},${y + 50} M${x - 20},${y + 8} Q${x},${y + 60} ${x + 20},${y + 8}`} fill="none" stroke={METAL.breu} strokeWidth={4} />
    </Svg>
  );
};

/** a escada de ferro na parede do fundo, subindo até a escotilha no teto */
const Escada: React.FC = () => {
  const { x1, x2 } = BUNKER.escada;
  const topo = proj(SB, (x1 + x2) / 2, SB.y1, 160);
  return (
    <Svg>
      {/* a escotilha no teto, vista de baixo */}
      <ellipse cx={topo[0]} cy={topo[1] + 6} rx={92} ry={26} fill={METAL.breu} />
      <ellipse cx={topo[0]} cy={topo[1]} rx={80} ry={20} fill={METAL.medio} />
      <ellipse cx={topo[0]} cy={topo[1]} rx={34} ry={9} fill="none" stroke={METAL.escuro} strokeWidth={6} />
      {/* os trilhos e os degraus */}
      <path d={`M${x1},${SB.y2} L${x1},${SB.y1 + 4} M${x2},${SB.y2} L${x2},${SB.y1 + 4}`} stroke={METAL.escuro} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={x1} y1={SB.y2 - 40 - i * 62} x2={x2} y2={SB.y2 - 40 - i * 62} stroke={METAL.medio} strokeWidth={8} />
      ))}
    </Svg>
  );
};

export const CenaBunker: React.FC<{
  /** giro do ventilador do filtro (graus) */
  giro?: number;
  /** a luz DENTRO do medidor acesa (pisca na cena 8) */
  dentro?: boolean;
  /** força da luz de emergência (0 a 1: falha um pouco quando o filtro para) */
  luz?: number;
  otavio?: { expressao?: Expressao; cima?: number; olhar?: number } | null;
}> = ({ giro = 0, dentro = true, luz = 1, otavio = { expressao: 'cansada' } }) => {
  const r = BUNKER;
  // a cama de campanha, encostada na parede da esquerda
  const cama = { bx1: SB.x1, bx2: 430, by1: 1030, by2: SB.y2, z1: 120, z2: 440 };
  return (
    <AbsoluteFill style={{ background: COR.breu }}>
      <Comodo S={SB} cores={CONCRETO} piso="liso" />
      {/* as manchas do concreto */}
      <Svg>
        <path d="M640,420 C650,520 630,600 646,700 M250,1000 C300,1040 360,1030 420,1060" fill="none" stroke="#6E6A63" strokeWidth={6} opacity={0.5} />
      </Svg>
      <Riscos x={r.riscos.x} y={r.riscos.y} escala={r.riscos.escala} n={r.riscos.n} colunas={r.riscos.colunas} cor="#3A3632" />
      <Filtro x={r.filtro.x} y={r.filtro.y} escala={r.filtro.escala} giro={giro} />
      <Medidor x={r.medidor.x} y={r.medidor.y} escala={r.medidor.escala} dentroLigado={dentro} />
      <Escada />
      {/* a mesinha do rádio, à direita */}
      <Caixa S={SB} bx1={640} bx2={860} by1={1010} by2={SB.y2} z1={60} z2={300} frente="#5A4A3C" topo="#6E5B4A" lado="#4A3D32" />
      <Radio x={r.radio.x} y={r.radio.y} escala={r.radio.escala} />
      {/* prateleira de latas, na parede do fundo, embaixo dos risquinhos */}
      <Svg>
        <rect x={196} y={880} width={260} height={10} fill="#5A4A3C" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={204 + i * 41} y={832} width={32} height={48} rx={4} fill={i % 2 ? '#A69C8E' : '#8E8576'} />
        ))}
      </Svg>
      {/* a cama de campanha e o Otávio sentado na beirada */}
      <Caixa S={SB} {...cama} frente="#565234" topo="#6B6640" lado="#4A462C" />
      {/* a beirada da lona, clara, pra ler o assento */}
      <Svg>
        {(() => {
          const a = proj(SB, cama.bx1, cama.by1, cama.z2);
          const b = proj(SB, cama.bx2, cama.by1, cama.z2);
          return <line x1={a[0]} y1={a[1] + 4} x2={b[0]} y2={b[1] + 4} stroke="#8C8660" strokeWidth={12} strokeLinecap="round" />;
        })()}
      </Svg>
      {otavio ? (
        <Otavio x={r.rosto.x} y={r.rosto.y + 830 * 0.92} escala={0.92} sentado expressao={otavio.expressao ?? 'cansada'} cima={otavio.cima ?? 0} olhar={otavio.olhar ?? 0.6} />
      ) : null}
      <Escuro
        opacidade={0.9}
        luzes={[
          { x: r.lampada.x, y: r.lampada.y + 30, r: 820 * (0.6 + 0.4 * luz), forca: 0.72 * luz },
          { x: r.rosto.x + 40, y: r.rosto.y + 60, r: 420, forca: 0.35 },
          { x: r.rosto.x + 20, y: r.rosto.y + 470, rx: 330, ry: 260, r: 330, forca: 0.42 },
          { x: r.filtro.x + 90, y: r.filtro.y + 150, r: 260, forca: 0.3 },
          { x: r.radio.x + 140, y: r.radio.y + 60, r: 420, forca: 0.55 },
          /* o chão e a frente da mesinha, pra o pé da tela não virar uma mancha preta */
          { x: 640, y: 1380, rx: 620, ry: 360, r: 620, forca: 0.45 },
        ]}
      />
      {/* o que emite luz, por cima do escuro */}
      <Lampada acesa={luz} />
      <Brilho x={r.lampada.x} y={r.lampada.y + 30} r={900} cor={VERMELHO} forca={0.34 * luz} />
      {/* as luzes do medidor e o visor do rádio */}
      <Brilho x={r.medidor.x + 47} y={r.medidor.y + 65} r={34} cor="242,179,61" forca={dentro ? 0.9 : 0} />
      <Brilho x={r.medidor.x + 121} y={r.medidor.y + 65} r={34} cor="63,210,122" forca={0.9} />
      <Svg>
        <circle cx={r.medidor.x + 47} cy={r.medidor.y + 65} r={15} fill={dentro ? AMARELO : '#3A3634'} />
        <circle cx={r.medidor.x + 121} cy={r.medidor.y + 65} r={15} fill={VERDE} />
      </Svg>
      <Brilho x={r.radio.x + 160} y={r.radio.y + 65} r={60} cor="232,176,74" forca={0.5} />
      <div style={{ position: 'absolute', left: r.radio.x + 180 * r.radio.escala, top: r.radio.y + 72 * r.radio.escala, width: 156 * r.radio.escala, height: 64 * r.radio.escala, display: 'grid', placeItems: 'center', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 23 * r.radio.escala, color: VISOR }}>
        TER 07:00
      </div>
    </AbsoluteFill>
  );
};
