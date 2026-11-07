/* =====================================================================================
   o-bunker/lembranca: os cenários da manhã do alerta (cenas 2 a 6) e os do fim (cena 10 e a capa).
     CenaQuintal     2, 6  o quintal de dia: grama, cerca, a casa vizinha e a tampa da escotilha
                           (aberta / fechada); névoa = 0 a 1 (a névoa vermelha passando a cerca);
                           otavio = posição da corrida (null = sem ele)
     CenaCozinha     3     a cozinha de dia: o Otávio à mesa com a caneca, a TV na bancada
                           (tv = 0 a 1: a tela vira vermelha)
     CenaTV          4     a TV de perto e o rosto do Otávio na luz vermelha
     CenaRua         5     pela janela da cozinha: a rua e a névoa descendo (nevoa = 0 a 1)
     CenaSai / CenaFica 10 os dois lados do cartão: a escotilha aberta com luz / o Otávio no filtro
     <Nevoa />             a névoa vermelha (manchas borradas que andam devagar)
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Caixa, Comodo, JanelaFundo, type Sala3D } from '../../kit/casa';
import { Brilho, Escuro } from '../../kit/luz';
import { COR, H, W } from '../../kit/pecas';
import { BUNKER, CenaBunker, SB } from './cenarios';
import { Escotilha, METAL, TVAviso } from './pecas';
import { type Expressao, Otavio } from './personagens';

const VERMELHO = '224,24,45';

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    {children}
  </svg>
);

/* ------------------------------------------------------------------ a névoa */
/** a névoa vermelha: manchas borradas. topo/base = a faixa da tela que ela ocupa; forca = 0 a 1 */
export const Nevoa: React.FC<{ topo: number; base: number; forca?: number; esquerda?: number; direita?: number }> = ({ topo, base, forca = 1, esquerda = -200, direita = W + 200 }) => {
  const f = useCurrentFrame();
  if (forca <= 0) return null;
  const n = 9;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', filter: 'blur(38px)', opacity: forca }}>
      {Array.from({ length: n }, (_, i) => {
        const fx = esquerda + ((direita - esquerda) * (i + 0.5)) / n + Math.sin(f / 40 + i * 1.7) * 60;
        const fy = topo + (base - topo) * (0.3 + 0.5 * ((i * 37) % 10) / 10) + Math.cos(f / 50 + i) * 30;
        const r = 220 + ((i * 53) % 120);
        return <div key={i} style={{ position: 'absolute', left: fx - r, top: fy - r * 0.6, width: r * 2, height: r * 1.2, borderRadius: '50%', background: `rgba(${VERMELHO},0.55)` }} />;
      })}
      <div style={{ position: 'absolute', left: esquerda, width: direita - esquerda, top: topo + (base - topo) * 0.45, height: (base - topo) * 0.55, background: `rgba(${VERMELHO},0.45)` }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 2 e 6. o quintal de dia */
const CEU = 'linear-gradient(180deg, #B9CCD6 0%, #DCD9CF 60%, #E8E0D2 100%)';

export const CenaQuintal: React.FC<{ aberta?: boolean; nevoa?: number; otavio?: { x: number; y: number; escala: number; passo: number } | null; tampa?: number }> = ({
  aberta = false,
  nevoa = 0,
  otavio = null,
}) => (
  <AbsoluteFill style={{ background: CEU }}>
    <Svg>
      {/* a casa vizinha, do outro lado da cerca */}
      <rect x={520} y={420} width={520} height={520} fill="#CDBBA2" />
      <path d="M490,430 L780,250 L1070,430 Z" fill="#8E4A3A" />
      <rect x={600} y={540} width={160} height={180} fill="#3A3436" />
      <rect x={600} y={540} width={160} height={180} fill="none" stroke="#EDE5D8" strokeWidth={12} />
      <rect x={604} y={544} width={70} height={172} fill="#B9A894" />
      <rect x={860} y={620} width={110} height={320} fill="#7A5A44" />
      {/* uma árvore à esquerda */}
      <rect x={110} y={560} width={34} height={400} fill="#5A4636" />
      <circle cx={127} cy={520} r={140} fill="#6F8A55" />
      <circle cx={60} cy={590} r={90} fill="#647E4C" />
      <circle cx={200} cy={600} r={96} fill="#7B9660" />
    </Svg>
    {/* a névoa vem por trás da cerca */}
    <Nevoa topo={420} base={1000} forca={nevoa} />
    <Svg>
      {/* a cerca de madeira */}
      <rect x={0} y={880} width={W} height={160} fill="#8A6A4E" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 80} y={860} width={70} height={190} fill={i % 2 ? '#957457' : '#8A6A4E'} stroke="#6E5440" strokeWidth={4} />
      ))}
      {/* a grama em perspectiva */}
      <path d={`M0,1040 L${W},1040 L${W},${H} L0,${H} Z`} fill="#6E8B4A" />
      {Array.from({ length: 40 }, (_, i) => {
        const gx = (i * 97) % W;
        const gy = 1080 + ((i * 53) % 820);
        return <path key={i} d={`M${gx},${gy} l6,-22 l6,22`} fill="none" stroke="#5E7A3E" strokeWidth={4} />;
      })}
    </Svg>
    <Escotilha x={300} y={1120} escala={1.3} aberta={aberta} />
    {otavio ? <Otavio x={otavio.x} y={otavio.y} escala={otavio.escala} epoca="lembranca" vista="costas" passo={otavio.passo} /> : null}
    {/* a névoa também chega pela frente, rente ao chão */}
    <Nevoa topo={900} base={1300} forca={Math.max(0, nevoa - 0.4) * 1.4} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ 3. a cozinha de dia */
export const SC: Sala3D = { x1: 110, y1: 360, x2: 970, y2: 1140, vx: 540, vy: 760, F: 900 };
const CORES_COZINHA = { fundo: '#E3D8C6', lado: '#D3C7B3', teto: '#EEE7DB', piso: '#BBA98F', linhaPiso: '#A69479', rodape: '#A69479' };
export const TV_COZINHA = { x: 728, y: 836, escala: 0.52 };

export const CenaCozinha: React.FC<{ tv?: number; expressao?: Expressao }> = ({ tv = 0, expressao = 'neutra' }) => (
  <AbsoluteFill style={{ background: COR.papel }}>
    <Comodo S={SC} cores={CORES_COZINHA} piso="taco" />
    <JanelaFundo bx1={180} bx2={480} by1={420} by2={700} vidro="#C9D9E2" moldura="#F2ECE2">
      <rect x={180} y={600} width={300} height={100} fill="#B7A68F" />
      <rect x={220} y={560} width={90} height={140} fill="#A89580" />
    </JanelaFundo>
    {/* armário e bancada à direita, com a TV */}
    <Caixa S={SC} bx1={640} bx2={960} by1={420} by2={600} z1={0} z2={80} frente="#C9B79C" lado="#B5A285" topo="#B5A285" />
    <Caixa S={SC} bx1={640} bx2={970} by1={960} by2={1140} z1={0} z2={220} frente="#B9A587" topo="#E9E1D3" lado="#A69276" />
    <TVAviso x={TV_COZINHA.x} y={TV_COZINHA.y} escala={TV_COZINHA.escala} aceso={tv} palavras={0} />
    {/* o Otávio à mesa, olhando pra TV */}
    <Otavio x={380} y={1530} escala={0.95} epoca="lembranca" pose="caneca" expressao={expressao} olhar={1} />
    {/* a mesa na frente dele */}
    <Caixa S={SC} bx1={180} bx2={620} by1={1050} by2={1140} z1={120} z2={420} frente="#8E6A4C" topo="#A57E5C" lado="#7A5A40" />
    {tv > 0 ? <Brilho x={TV_COZINHA.x + 110} y={TV_COZINHA.y + 70} r={900} cor={VERMELHO} forca={0.45 * tv} /> : null}
    {tv > 0 ? <AbsoluteFill style={{ background: `rgba(${VERMELHO},${0.12 * tv})`, mixBlendMode: 'multiply' }} /> : null}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ 4. a TV de perto */
export const CenaTV: React.FC<{ palavras: number; expressao?: Expressao }> = ({ palavras, expressao = 'preocupada' }) => (
  <AbsoluteFill style={{ background: '#1E0C0F' }}>
    <TVAviso x={78} y={150} escala={2.2} aceso={1} palavras={palavras} />
    <Otavio x={300} y={2408} escala={1.6} epoca="lembranca" expressao={expressao} olhar={1} />
    <Brilho x={540} y={500} r={1000} cor={VERMELHO} forca={0.45} />
    <AbsoluteFill style={{ background: `rgba(${VERMELHO},0.18)`, mixBlendMode: 'multiply' }} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ 5. a rua pela janela */
export const CenaRua: React.FC<{ nevoa: number }> = ({ nevoa }) => {
  // a névoa desce a rua: começa lá no alto, no fim da rua, e vem chegando
  const frente = 520 + 900 * nevoa;
  return (
    <AbsoluteFill style={{ background: CEU }}>
      <Svg>
        {/* a rua subindo em perspectiva até o morro */}
        <path d="M300,1920 L500,700 L580,700 L780,1920 Z" fill="#7C7670" />
        <path d="M0,1920 L0,760 L500,700 L300,1920 Z M1080,1920 L1080,760 L580,700 L780,1920 Z" fill="#9C9A88" />
        <path d="M540,720 L540,800 M540,880 L540,1000 M540,1100 L540,1280 M540,1400 L540,1640" stroke="#E8E0D2" strokeWidth={10} />
        {/* as casas baixas dos dois lados */}
        {[
          [0, 560, 260, 300, '#C8B49A', '#7E4536'],
          [250, 620, 170, 180, '#B8A68E', '#6E3D30'],
          [400, 650, 90, 90, '#A99A86', '#5E352B'],
          [820, 560, 260, 300, '#C2B29C', '#7A4234'],
          [680, 620, 160, 180, '#B4A28A', '#6A3B2F'],
          [600, 650, 90, 90, '#A49582', '#5A3329'],
        ].map(([x, y, w, h, parede, telhado], i) => (
          <g key={i}>
            <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={parede as string} />
            <path d={`M${(x as number) - 14},${(y as number) + 6} L${(x as number) + (w as number) / 2},${(y as number) - (h as number) * 0.4} L${(x as number) + (w as number) + 14},${(y as number) + 6} Z`} fill={telhado as string} />
            <rect x={(x as number) + (w as number) * 0.3} y={(y as number) + (h as number) * 0.3} width={(w as number) * 0.3} height={(h as number) * 0.3} fill="#4A4244" />
          </g>
        ))}
        {/* o poste */}
        <rect x={860} y={420} width={16} height={700} fill="#5A5654" />
        <path d="M868,430 L790,430" stroke="#5A5654" strokeWidth={10} />
        <ellipse cx={790} cy={440} rx={22} ry={10} fill="#E9E3D6" />
      </Svg>
      {/* a névoa: do fundo da rua pra frente, cobrindo tudo */}
      <Nevoa topo={360} base={frente} forca={Math.min(1, nevoa * 3)} />
      {/* a moldura da janela da cozinha, por cima */}
      <Svg>
        <path d={`M0,0 L${W},0 L${W},${H} L0,${H} Z M80,200 L1000,200 L1000,1500 L80,1500 Z`} fill="#E3D8C6" fillRule="evenodd" />
        <rect x={60} y={180} width={960} height={1340} fill="none" stroke="#F2ECE2" strokeWidth={40} />
        <rect x={530} y={200} width={20} height={1300} fill="#F2ECE2" />
        <rect x={20} y={1500} width={1040} height={44} fill="#F2ECE2" />
      </Svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 10. os dois lados da escolha */
/** SAI: a escotilha aberta no teto do bunker, a luz de fora entrando */
export const CenaSai: React.FC = () => (
  <AbsoluteFill style={{ background: '#2A2624' }}>
    <Svg>
      <rect x={0} y={0} width={W} height={H} fill="#3A3633" />
      {/* o feixe de luz descendo */}
      <path d="M380,520 L700,520 L980,1500 L100,1500 Z" fill="#F4EEDF" opacity={0.18} />
      <ellipse cx={540} cy={520} rx={200} ry={60} fill={METAL.breu} />
      <ellipse cx={540} cy={510} rx={170} ry={46} fill="#F6F0E2" />
      {/* a tampa aberta, de lado */}
      <path d="M370,500 L330,260 L420,240 L470,480 Z" fill={METAL.medio} stroke={METAL.escuro} strokeWidth={8} />
      {/* a escada */}
      <path d="M480,540 L470,1500 M600,540 L610,1500" stroke={METAL.escuro} strokeWidth={14} />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={476} y1={600 + i * 72} x2={604} y2={600 + i * 72} stroke={METAL.medio} strokeWidth={10} />
      ))}
    </Svg>
    <Brilho x={540} y={540} r={520} cor="246,240,226" forca={0.6} />
  </AbsoluteFill>
);

/** FICA: o Otávio no filtro, com a chave de fenda */
export const CenaFica: React.FC = () => (
  <AbsoluteFill>
    <CenaBunker otavio={null} giro={20} dentro={false} />
    <Otavio x={BUNKER.filtro.x - 30} y={1500} escala={0.85} pose="chave" expressao="preocupada" olhar={1} />
    <Escuro opacidade={0.5} luzes={[{ x: BUNKER.filtro.x, y: 900, r: 600, forca: 0.8 }]} />
    <Brilho x={BUNKER.lampada.x} y={BUNKER.lampada.y} r={900} cor={VERMELHO} forca={0.3} />
  </AbsoluteFill>
);

/** a capa: o Otávio de costas no bunker, olhando pra escotilha no teto */
export const FundoCapa: React.FC = () => (
  <AbsoluteFill>
    <CenaBunker otavio={null} giro={20} />
    <Otavio x={(BUNKER.escada.x1 + BUNKER.escada.x2) / 2 - 150} y={1560} escala={0.95} vista="costas" cima={1} pisca={false} respira={false} />
    <Escuro opacidade={0.45} luzes={[{ x: 470, y: 900, r: 700, forca: 0.8 }]} />
    <Brilho x={BUNKER.lampada.x} y={BUNKER.lampada.y} r={1000} cor={VERMELHO} forca={0.35} />
  </AbsoluteFill>
);

export { SB };
