/* =====================================================================================
   o-bunker/parte2/cenarios: os cenários da parte 2 (o fim de tarde, cinco anos depois).
     CenaQuintalTarde  2, 3, 10  o quintal tomado de mato; fundo 'cerca' (a casa vizinha) ou 'casa'
                                 (os fundos da casa do Otávio); cabeca = 0 a 1 (ele saindo da escotilha);
                                 anoitecer = 0 a 1
     CenaRuaVazia      4         a cerca caída no mato e, pelo buraco, a rua vazia
     CenaSala          6, 7, 9   a sala: a TV ligada no aviso, o sofá com o controle limpo, a janela com
                                 a torre de rádio ao fundo; aviso = 'antigo' | 'pisca' | 'novo'
     CenaTVData        8         a TV de perto, a data no canto e os olhos dele por cima da máscara
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { Caixa, Comodo, JanelaFundo, type Sala3D } from '../../../kit/casa';
import { Brilho, Escuro } from '../../../kit/luz';
import { H, W } from '../../../kit/pecas';
import { AVISO_NOVO, Controle, Escotilha, Torre, TVAviso } from '../pecas';
import { type Expressao, Otavio } from '../personagens';

const VERMELHO = '224,24,45';
export const LARANJA = '255,170,96';
export const DATA = 'TER 09/11/2021 · 07:00';
const CEU_TARDE = 'linear-gradient(180deg, #3B2A55 0%, #8E4A6A 38%, #E07E4A 72%, #F2B26A 100%)';
const CEU_NOITE = 'linear-gradient(180deg, #120C1E 0%, #2A1A36 50%, #5A3046 100%)';

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
    {children}
  </svg>
);

/** o mato alto: folhas finas balançando devagar, de y0 (fundo) até o pé da tela */
const Mato: React.FC<{ y0: number; n?: number; cores?: string[] }> = ({ y0, n = 170, cores = ['#4E5E33', '#5E6F3C', '#6E7F45', '#43502C'] }) => {
  const f = useCurrentFrame();
  return (
    <Svg>
      <rect x={0} y={y0 + 40} width={W} height={H - y0} fill="#4A5A30" />
      {Array.from({ length: n }, (_, i) => {
        const t = random(`mato-y-${i}`);
        const gy = y0 + t * t * (H - y0) + 60;
        const gx = random(`mato-x-${i}`) * (W + 80) - 40;
        const alto = (60 + 260 * random(`mato-h-${i}`)) * (0.35 + (gy - y0) / (H - y0));
        const vento = Math.sin(f / 22 + i) * alto * 0.08;
        const cor = cores[i % cores.length];
        return <path key={i} d={`M${gx - 7},${gy} Q${gx + vento * 0.5},${gy - alto * 0.6} ${gx + vento},${gy - alto} Q${gx + 4},${gy - alto * 0.5} ${gx + 7},${gy} Z`} fill={cor} />;
      })}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 2, 3 e 10. o quintal no fim de tarde */
export const CenaQuintalTarde: React.FC<{
  fundo?: 'cerca' | 'casa';
  cabeca?: number;
  otavio?: { x: number; y: number; escala: number; passo: number | null; mascara: boolean; vista: 'frente' | 'costas'; expressao?: Expressao } | null;
  anoitecer?: number;
}> = ({ fundo = 'cerca', cabeca = 0, otavio = null, anoitecer = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: CEU_TARDE }} />
    <AbsoluteFill style={{ background: CEU_NOITE, opacity: anoitecer }} />
    <Svg>
      {fundo === 'cerca' ? (
        <>
          {/* a casa vizinha, fechada, e a árvore seca */}
          <rect x={520} y={420} width={520} height={520} fill="#8E7E6E" />
          <path d="M490,430 L780,250 L1070,430 Z" fill="#5E3A32" />
          <rect x={600} y={540} width={160} height={180} fill="#2A2224" />
          <path d="M604,544 L756,544 M604,600 L756,600 M604,660 L756,660" stroke="#5A4A44" strokeWidth={14} />
          <rect x={860} y={620} width={110} height={320} fill="#4E3A2E" />
          <path d="M127,960 L127,560 M127,700 L60,600 M127,640 L210,540 M127,600 L150,470" stroke="#3A2E26" strokeWidth={22} strokeLinecap="round" />
          {/* a cerca, inteira deste lado, cinza de tempo */}
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={i * 80} y={860} width={70} height={190} fill={i % 2 ? '#6E6258' : '#655A50'} stroke="#4A4038" strokeWidth={4} />
          ))}
        </>
      ) : (
        <>
          {/* os fundos da casa do Otávio: parede, a porta dos fundos e a janela da cozinha */}
          <rect x={120} y={420} width={840} height={620} fill="#A08C74" />
          <path d="M80,430 L540,200 L1000,430 Z" fill="#6A3E32" />
          <rect x={460} y={660} width={160} height={380} fill="#4E3A2E" />
          <circle cx={600} cy={860} r={8} fill="#C9B79A" />
          <rect x={200} y={560} width={200} height={170} fill="#3A2E2E" />
          <rect x={720} y={560} width={180} height={170} fill="#3A2E2E" />
          <rect x={200} y={560} width={200} height={170} fill="none" stroke="#D8CCBC" strokeWidth={10} />
          <rect x={720} y={560} width={180} height={170} fill="none" stroke="#D8CCBC" strokeWidth={10} />
        </>
      )}
    </Svg>
    <Mato y0={980} />
    <Escotilha x={300} y={1180} escala={1.3} aberta />
    {/* ele saindo pela escotilha: só a cabeça e os ombros acima da borda */}
    {cabeca > 0 ? (
      <AbsoluteFill style={{ clipPath: `polygon(0 0, 100% 0, 100% ${1330 / H * 100}%, 0 ${1330 / H * 100}%)` }}>
        <Otavio x={534} y={1330 + 830 * 0.95 - cabeca * 420} escala={0.95} expressao="desconfiada" olhar={Math.sin(cabeca * 6) * 0.8} />
      </AbsoluteFill>
    ) : null}
    {otavio ? <Otavio x={otavio.x} y={otavio.y} escala={otavio.escala} vista={otavio.vista} passo={otavio.passo} mascara={otavio.mascara} expressao={otavio.expressao ?? 'desconfiada'} /> : null}
    {/* a luz baixa do fim de tarde, vindo da direita */}
    <Brilho x={1000} y={700} r={1100} cor={LARANJA} forca={0.28 * (1 - anoitecer)} />
    {anoitecer > 0 ? <AbsoluteFill style={{ background: `rgba(10,6,14,${0.45 * anoitecer})` }} /> : null}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ 4. a cerca caída e a rua vazia */
export const CenaRuaVazia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CEU_TARDE }}>
      <Svg>
        {/* a rua lá fora, sem ninguém */}
        <path d="M0,900 L1080,880 L1080,1100 L0,1120 Z" fill="#6E6660" />
        <path d="M0,1010 L1080,990" stroke="#BFB4A4" strokeWidth={8} strokeDasharray="60 50" />
        {[
          [40, 640, 260, 260, '#8E7E6E', '#5E3A32'],
          [360, 680, 220, 220, '#867664', '#563630'],
          [640, 650, 240, 250, '#8A7A68', '#5A3830'],
          [920, 690, 200, 210, '#7E6E5E', '#52342C'],
        ].map(([x, y, w, h, parede, telhado], i) => (
          <g key={i}>
            <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={parede as string} />
            <path d={`M${(x as number) - 14},${(y as number) + 6} L${(x as number) + (w as number) / 2},${(y as number) - (h as number) * 0.4} L${(x as number) + (w as number) + 14},${(y as number) + 6} Z`} fill={telhado as string} />
            <rect x={(x as number) + (w as number) * 0.32} y={(y as number) + (h as number) * 0.3} width={(w as number) * 0.3} height={(h as number) * 0.32} fill="#2A2224" />
          </g>
        ))}
        <rect x={560} y={500} width={14} height={420} fill="#4A4644" />
        {/* folhas secas rolando na rua, devagar */}
        {Array.from({ length: 14 }, (_, i) => {
          const lx = ((random(`folha-${i}`) * W + f * (1.2 + random(`fv-${i}`))) % (W + 60)) - 30;
          const ly = 930 + random(`fy-${i}`) * 150;
          return <ellipse key={i} cx={lx} cy={ly} rx={10} ry={5} fill={i % 2 ? '#8A5A30' : '#A06A38'} transform={`rotate(${(f * 4 + i * 40) % 360} ${lx} ${ly})`} />;
        })}
      </Svg>
      <Mato y0={1060} n={120} />
      <Svg>
        {/* o que sobrou da cerca: dois mourões em pé e as tábuas caídas no mato */}
        <rect x={120} y={860} width={40} height={420} fill="#5A4E44" />
        <rect x={900} y={860} width={40} height={420} fill="#5A4E44" />
        {[
          [200, 1230, -8],
          [300, 1300, 12],
          [480, 1260, -3],
          [640, 1320, 9],
          [760, 1250, -14],
        ].map(([x, y, g], i) => (
          <rect key={i} x={x} y={y} width={190} height={46} rx={4} fill={i % 2 ? '#6E6258' : '#655A50'} stroke="#4A4038" strokeWidth={4} transform={`rotate(${g} ${x + 95} ${y + 23})`} />
        ))}
      </Svg>
      <Brilho x={1000} y={700} r={1100} cor={LARANJA} forca={0.28} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 6, 7 e 9. a sala */
export const SS: Sala3D = { x1: 110, y1: 380, x2: 970, y2: 1160, vx: 540, vy: 760, F: 900 };
const CORES_SALA = { fundo: '#8E8070', lado: '#7C6E60', teto: '#6E6256', piso: '#6A5442', linhaPiso: '#584434', rodape: '#584434' };
export const TV_SALA = { x: 200, y: 640, escala: 0.95 };
export const JANELA_SALA = { bx1: 700, bx2: 930, by1: 470, by2: 760 };

/** a TV da sala; aviso 'antigo' (FIQUEM EM CASA), 'pisca' (a imagem falhando), 'novo' (o nome dele,
    palavras = quantas palavras do aviso novo já entraram) */
export const TVSala: React.FC<{ x: number; y: number; escala: number; aviso: 'antigo' | 'pisca' | 'novo'; palavras?: number; data?: boolean }> = ({ x, y, escala, aviso, palavras = 99, data = true }) => {
  const f = useCurrentFrame();
  if (aviso === 'pisca') {
    const on = random(`pisca-${Math.floor(f / 2)}`) > 0.5;
    return <TVAviso x={x} y={y} escala={escala} aceso={on ? 1 : 0} palavras={0} data={on ? DATA : undefined} />;
  }
  return <TVAviso x={x} y={y} escala={escala} aceso={1} linhas={aviso === 'novo' ? AVISO_NOVO : undefined} palavras={palavras} data={data ? DATA : undefined} />;
};

export const CenaSala: React.FC<{
  aviso?: 'antigo' | 'pisca' | 'novo';
  palavras?: number;
  otavio?: { x: number; y: number; escala: number; passo: number | null; expressao?: Expressao } | null;
  torre?: boolean;
}> = ({ aviso = 'antigo', palavras = 99, otavio = null, torre = true }) => {
  const f = useCurrentFrame();
  const luzTorre = Math.floor(f / 14) % 2 === 0 ? 1 : 0.2;
  const tela = aviso === 'pisca' ? (random(`pisca-${Math.floor(f / 2)}`) > 0.5 ? 1 : 0.2) : 1;
  return (
    <AbsoluteFill style={{ background: '#140C0E' }}>
      <Comodo S={SS} cores={CORES_SALA} piso="taco" />
      {/* a janela: o fim de tarde lá fora e a torre de rádio no morro */}
      <JanelaFundo {...JANELA_SALA} vidro="#E07E4A" moldura="#B8A890">
        <rect x={700} y={470} width={230} height={150} fill="#8E4A6A" />
        <path d="M700,700 Q800,640 930,690 L930,760 L700,760 Z" fill="#3A2A36" />
        {torre ? <Torre x={790} y={520} escala={0.2} luz={luzTorre} cor="#2A1E26" /> : null}
      </JanelaFundo>
      {/* o rack e a TV */}
      <Caixa S={SS} bx1={180} bx2={640} by1={960} by2={1160} z1={0} z2={120} frente="#4E3C30" topo="#5E4A3C" lado="#43342A" />
      <TVSala x={TV_SALA.x} y={TV_SALA.y} escala={TV_SALA.escala} aviso={aviso} palavras={palavras} />
      {/* o Otávio */}
      {otavio ? <Otavio x={otavio.x} y={otavio.y} escala={otavio.escala} vista="costas" mascara passo={otavio.passo} expressao={otavio.expressao ?? 'preocupada'} /> : null}
      {/* o sofá na frente, à esquerda, e o controle remoto limpo em cima */}
      <Caixa S={SS} bx1={SS.x1} bx2={420} by1={1040} by2={SS.y2} z1={330} z2={560} frente="#5A4A52" topo="#6A5862" lado="#4A3C44" />
      <Controle x={150} y={1420} escala={0.75} />
      {/* poeira e a teia */}
      <Svg>
        <path d="M970,380 L840,400 M970,380 L860,460 M970,380 L930,520 M930,390 Q910,440 950,470" fill="none" stroke="#D8CCBC" strokeWidth={3} opacity={0.45} />
      </Svg>
      <Escuro
        opacidade={0.82}
        luzes={[
          { x: TV_SALA.x + 200, y: TV_SALA.y + 140, r: 760, forca: 0.85 * tela },
          { x: 815, y: 615, r: 380, forca: 0.6 },
          { x: 230, y: 1490, r: 220, forca: 0.45 },
        ]}
      />
      <Brilho x={TV_SALA.x + 200} y={TV_SALA.y + 140} r={900} cor={VERMELHO} forca={0.42 * tela} />
      <Brilho x={815} y={615} r={420} cor={LARANJA} forca={0.3} />
      {torre ? <Brilho x={790 + 36} y={522} r={40} cor={VERMELHO} forca={0.9 * luzTorre} /> : null}
      {/* a poeira boiando na luz vermelha */}
      <Svg>
        {Array.from({ length: 40 }, (_, i) => {
          const px = TV_SALA.x + random(`p-${i}`) * 520 + Math.sin(f / 30 + i) * 20;
          const py = TV_SALA.y - 100 + ((random(`py-${i}`) * 700 + f * 0.6) % 700);
          return <circle key={i} cx={px} cy={py} r={2 + random(`pr-${i}`) * 2.5} fill="#FFD8D0" opacity={0.35 * tela} />;
        })}
      </Svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 8. a data, de perto */
export const CenaTVData: React.FC<{ expressao?: Expressao }> = ({ expressao = 'desconfiada' }) => (
  <AbsoluteFill style={{ background: '#1E0C0F' }}>
    <TVAviso x={120} y={110} escala={2.0} aceso={1} data={DATA} />
    <Otavio x={300} y={2250} escala={1.6} mascara expressao={expressao} olhar={0.6} />
    <Brilho x={540} y={500} r={1000} cor={VERMELHO} forca={0.42} />
    <AbsoluteFill style={{ background: `rgba(${VERMELHO},0.16)`, mixBlendMode: 'multiply' }} />
  </AbsoluteFill>
);
