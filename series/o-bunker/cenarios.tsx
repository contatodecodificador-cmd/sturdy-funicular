/* =====================================================================================
   o-bunker/cenarios: o cenário de cada cena de "O Bunker" (1080x1920), já com a luz.
   Cada um recebe o estado que muda na cena e desenha:
   cenário e personagens → <Escuro> → o que emite luz (lâmpada, visor, luzes do medidor) → tom da luz.
     CenaBunker      1, 7, 8, 9  o bunker hoje: concreto, a cama de campanha, a parede dos risquinhos,
                                 o filtro, o medidor, o rádio, a escada até a escotilha no teto e a
                                 luz vermelha de emergência
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Caixa, Comodo, proj, type Sala3D } from '../../kit/casa';
import { Brilho, type Cone, Escuro } from '../../kit/luz';
import { COR, H, W } from '../../kit/pecas';
import { FONTEM } from '../../tema';
import { AMARELO, Caneca, Filtro, Medidor, METAL, Radio, Riscos, VERDE, VISOR } from './pecas';
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
  otavio?: { expressao?: Expressao; cima?: number; olhar?: number; costas?: boolean; sombra?: boolean } | null;
  /** o Otávio em pé (parte 3), em vez de sentado na cama */
  emPe?: { x: number; y: number; escala: number; vista?: 'frente' | 'costas'; passo?: number | null; mascara?: boolean; expressao?: Expressao; olhar?: number } | null;
  /** a parte 3: a caneca quente na mesinha, o risco novo, a escrita "falta pouco" (0 a 1) e as pegadas */
  p3?: { caneca?: boolean; riscoNovo?: number; escrita?: number; pegadas?: boolean | 'fortes' };
  /** a parte 4: a estante de latas que esconde a passagem (abre = 0 a 1) e a câmera no teto */
  p4?: { abre?: number; camera?: boolean };
  /** a lanterna (cones de luz) */
  cones?: Cone[];
}> = ({ giro = 0, dentro = true, luz = 1, otavio = { expressao: 'cansada' }, emPe = null, p3, p4, cones = [] }) => {
  const f = useCurrentFrame();
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
      {p3 ? (
        <Svg>
          <defs>
            <clipPath id="escrita-p3">
              <rect x={200} y={790} width={260 * (p3.escrita ?? 0)} height={48} />
            </clipPath>
          </defs>
          {/* o risco novo, claro, de quem riscou agora */}
          <line x1={482} y1={756} x2={478} y2={784} stroke="#EDE6DA" strokeWidth={5} strokeLinecap="round" opacity={p3.riscoNovo ?? 0} />
          {/* "falta pouco", riscado na parede */}
          <text x={204} y={826} fontFamily={FONTEM.pincel} fontSize={32} fill="#EDE6DA" clipPath="url(#escrita-p3)">
            falta pouco
          </text>
          {/* as pegadas de terra molhada, da escada até atrás da prateleira */}
          {p3.pegadas
            ? Array.from({ length: 7 }, (_, i) => {
                const t = i / 6;
                const px = 540 - 230 * t + (i % 2 ? 18 : -18);
                const py = 1430 - 230 * t;
                const k = 1 - 0.45 * t;
                const forte = p3.pegadas === 'fortes';
                return (
                  <g key={i} transform={`rotate(${-35} ${px} ${py})`}>
                    {/* a sola: a frente larga e o salto separado */}
                    <ellipse cx={px} cy={py - 10 * k} rx={15 * k} ry={22 * k} fill={forte ? '#4A3624' : '#3A2E22'} opacity={forte ? 0.95 : 0.6} />
                    <ellipse cx={px} cy={py + 24 * k} rx={11 * k} ry={10 * k} fill={forte ? '#4A3624' : '#3A2E22'} opacity={forte ? 0.95 : 0.6} />
                    {forte ? (
                      <>
                        <path d={`M${px - 9 * k},${py - 22 * k} l18,0 M${px - 11 * k},${py - 12 * k} l22,0 M${px - 10 * k},${py - 2 * k} l20,0`} stroke="#2A1E14" strokeWidth={2.5 * k} opacity={0.8} />
                        <ellipse cx={px - 5 * k} cy={py - 16 * k} rx={5 * k} ry={8 * k} fill="#C8B89E" opacity={0.55} />
                      </>
                    ) : null}
                  </g>
                );
              })
            : null}
          {p3.pegadas ? <path d="M318,1196 l10,-26 l6,24" fill="none" stroke="#5E6F3C" strokeWidth={4} /> : null}
        </Svg>
      ) : null}
      <Filtro x={r.filtro.x} y={r.filtro.y} escala={r.filtro.escala} giro={giro} />
      <Medidor x={r.medidor.x} y={r.medidor.y} escala={r.medidor.escala} dentroLigado={dentro} />
      <Escada />
      {/* a mesinha do rádio, à direita */}
      <Caixa S={SB} bx1={640} bx2={860} by1={1010} by2={SB.y2} z1={60} z2={300} frente="#5A4A3C" topo="#6E5B4A" lado="#4A3D32" />
      <Radio x={r.radio.x} y={r.radio.y} escala={r.radio.escala} />
      {p3?.caneca ? (
        <>
          <Caneca x={636} y={1046} escala={0.55} />
          <Svg>
            {[0, 1, 2].map((i) => {
              const sobe = ((f * 1.2 + i * 18) % 54) / 54;
              return <path key={i} d={`M${652 + i * 9},${1050 - sobe * 70} q-8,-14 0,-28 q8,-14 0,-28`} fill="none" stroke="#F5EFEA" strokeWidth={3} opacity={0.6 * (1 - sobe)} />;
            })}
          </Svg>
        </>
      ) : null}
      {/* prateleira de latas, na parede do fundo, embaixo dos risquinhos */}
      {p4 ? (
        <Svg>
          {/* a passagem que ele nunca construiu, atrás da estante */}
          <rect x={214} y={880} width={222} height={300} fill="#0A0607" />
          <rect x={232} y={900} width={186} height={280} fill="url(#fundo-passagem)" />
          <defs>
            <radialGradient id="fundo-passagem" cx="0.5" cy="0.35" r="0.6">
              <stop offset="0" stopColor="#5A0E18" />
              <stop offset="1" stopColor="#0A0607" />
            </radialGradient>
          </defs>
          {/* a estante de latas, que desliza pra direita */}
          <g transform={`translate(${(p4.abre ?? 0) * 236} 0)`}>
            <rect x={200} y={850} width={250} height={330} fill="#5A4A3C" />
            <rect x={210} y={860} width={230} height={310} fill="#3E3228" />
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <rect x={210} y={950 + r * 100} width={230} height={10} fill="#6E5B4A" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={220 + i * 44} y={902 + r * 100} width={32} height={48} rx={4} fill={(i + r) % 2 ? '#A69C8E' : '#8E8576'} />
                ))}
              </g>
            ))}
          </g>
        </Svg>
      ) : (
        <Svg>
          <rect x={196} y={880} width={260} height={10} fill="#5A4A3C" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={204 + i * 41} y={832} width={32} height={48} rx={4} fill={i % 2 ? '#A69C8E' : '#8E8576'} />
          ))}
        </Svg>
      )}
      {p4?.camera ? (
        <Svg>
          {/* a câmera escondida no canto do teto, que ele nunca tinha notado */}
          <rect x={176} y={430} width={46} height={26} rx={5} fill="#2A2624" />
          <circle cx={190} cy={443} r={8} fill="#121010" />
          <circle cx={212} cy={438} r={4} fill="#E0182D" />
        </Svg>
      ) : null}
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
        <Otavio x={r.rosto.x} y={r.rosto.y + 830 * 0.92} escala={0.92} sentado vista={otavio.costas ? 'costas' : 'frente'} expressao={otavio.expressao ?? 'cansada'} cima={otavio.cima ?? 0} olhar={otavio.olhar ?? 0.6} />
      ) : null}
      {otavio?.sombra && !otavio.costas ? (
        <Svg>
          {/* o rosto na sombra: só o brilho dos olhos */}
          <ellipse cx={r.rosto.x} cy={r.rosto.y + 10} rx={92} ry={110} fill="#050304" />
          <circle cx={r.rosto.x - 30} cy={r.rosto.y - 4} r={6} fill="#F5EFEA" />
          <circle cx={r.rosto.x + 30} cy={r.rosto.y - 4} r={6} fill="#F5EFEA" />
        </Svg>
      ) : null}
      {emPe ? <Otavio x={emPe.x} y={emPe.y} escala={emPe.escala} vista={emPe.vista ?? 'frente'} passo={emPe.passo ?? null} mascara={emPe.mascara ?? false} expressao={emPe.expressao ?? 'preocupada'} olhar={emPe.olhar ?? 0} /> : null}
      <Escuro
        opacidade={cones.length ? 0.95 : 0.9}
        cones={cones}
        luzes={cones.length ? [
          { x: r.lampada.x, y: r.lampada.y + 30, r: 500, forca: 0.35 * luz },
          { x: 540, y: 1500, rx: 500, ry: 300, r: 500, forca: 0.18 },
        ] : [
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
