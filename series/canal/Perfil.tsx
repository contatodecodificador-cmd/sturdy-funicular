/* =====================================================================================
   videos/canal/Perfil: a foto de perfil do Contos do Vigia (1080x1080, sem texto: o nome não se lê
   na bolinha). Tudo que importa fica dentro do círculo central.
     Canal-Perfil  quadro 0 = o olho, 1 = a torre de vigia, 2 = a lanterna
     npx remotion still src/index.ts Canal-Perfil out/perfil-0.png --frame=0
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import { COR } from '../../kit/pecas';

const V = '224,24,45';
const L = 1080;

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={L} height={L} viewBox={`0 0 ${L} ${L}`} style={{ position: 'absolute', inset: 0 }}>
    {children}
  </svg>
);

const Fundo: React.FC<{ x?: number; y?: number; forca?: number }> = ({ x = 540, y = 540, forca = 0.35 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(${V},${forca}) 0%, rgba(${V},${forca * 0.25}) 35%, ${COR.breu} 70%)` }} />
);

/** 1. o olho entreaberto no escuro, a íris acesa */
const Olho: React.FC = () => (
  <AbsoluteFill style={{ background: COR.breu }}>
    <Fundo forca={0.3} />
    <Svg>
      <defs>
        <clipPath id="olho">
          <path d="M150,560 C320,330 760,330 930,560 C760,700 320,700 150,560 Z" />
        </clipPath>
        <radialGradient id="iris">
          <stop offset="0" stopColor="#FF6A5A" />
          <stop offset="0.55" stopColor="#E0182D" />
          <stop offset="1" stopColor="#5A0610" />
        </radialGradient>
      </defs>
      {/* o branco do olho, apagado */}
      <path d="M150,560 C320,330 760,330 930,560 C760,700 320,700 150,560 Z" fill="#2A1A1C" />
      <g clipPath="url(#olho)">
        <circle cx={540} cy={545} r={150} fill="url(#iris)" />
        <circle cx={540} cy={545} r={58} fill="#0A0607" />
        <circle cx={590} cy={500} r={22} fill="#FFE6E0" opacity={0.85} />
        {/* a pálpebra de cima, pesada: o olho entreaberto */}
        <path d="M150,560 C320,438 760,438 930,560 L930,300 L150,300 Z" fill="#140B0D" />
      </g>
      {/* o contorno das pálpebras */}
      <path d="M150,560 C320,438 760,438 930,560" fill="none" stroke="#F5EFEA" strokeWidth={14} strokeLinecap="round" opacity={0.9} />
      <path d="M150,560 C320,700 760,700 930,560" fill="none" stroke="#F5EFEA" strokeWidth={8} strokeLinecap="round" opacity={0.35} />
    </Svg>
    <AbsoluteFill style={{ mixBlendMode: 'screen', background: `radial-gradient(circle at 540px 545px, rgba(${V},0.45) 0%, rgba(${V},0) 30%)` }} />
  </AbsoluteFill>
);

/** 2. a torre de vigia no morro, à noite, uma janela acesa */
const Torre: React.FC = () => (
  <AbsoluteFill style={{ background: COR.breu }}>
    <Fundo x={540} y={360} forca={0.22} />
    <Svg>
      {/* a lua, apagada */}
      <circle cx={760} cy={300} r={70} fill="#F5EFEA" opacity={0.12} />
      {/* o morro */}
      <path d="M0,880 C220,780 420,760 540,770 C680,780 860,820 1080,900 L1080,1080 L0,1080 Z" fill="#160C0F" />
      {/* a torre: quatro pernas, a cabine e o telhado */}
      <path d="M440,790 L500,430 M640,790 L580,430 M470,600 L610,600 M455,700 L625,700 M470,600 L625,700 M610,600 L455,700" stroke="#2A1A1E" strokeWidth={16} strokeLinecap="round" />
      <rect x={455} y={330} width={170} height={120} fill="#241418" />
      <path d="M430,335 L540,250 L650,335 Z" fill="#2E1A1F" />
      <rect x={440} y={445} width={200} height={14} fill="#2E1A1F" />
      {/* a janela acesa */}
      <rect x={505} y={360} width={70} height={60} fill="#E0182D" />
      <rect x={538} y={360} width={4} height={60} fill="#5A0610" />
    </Svg>
    <AbsoluteFill style={{ mixBlendMode: 'screen', background: `radial-gradient(circle at 540px 390px, rgba(${V},0.6) 0%, rgba(${V},0.15) 18%, rgba(${V},0) 40%)` }} />
  </AbsoluteFill>
);

/** 3. a lanterna antiga acesa */
const Lanterna: React.FC = () => {
  const f = useCurrentFrame();
  const chama = 1 + Math.sin(f / 3) * 0.03;
  return (
    <AbsoluteFill style={{ background: COR.breu }}>
      <Fundo x={540} y={600} forca={0.4} />
      <Svg>
        {/* a alça */}
        <path d="M410,330 C410,200 670,200 670,330" fill="none" stroke="#3A2A2C" strokeWidth={22} />
        {/* o chapéu */}
        <path d="M380,360 L540,280 L700,360 Z" fill="#3A2A2C" />
        <rect x={370} y={355} width={340} height={30} rx={10} fill="#4A3436" />
        {/* o vidro */}
        <path d="M410,385 L670,385 L690,760 L390,760 Z" fill="#E0182D" opacity={0.25} />
        {/* a chama */}
        <g transform={`translate(540 640) scale(1 ${chama}) translate(-540 -640)`}>
          <path d="M540,470 C600,560 610,640 540,700 C470,640 480,560 540,470 Z" fill="#FF5A4A" />
          <path d="M540,540 C575,600 578,650 540,690 C502,650 505,600 540,540 Z" fill="#FFD8B0" />
        </g>
        {/* as barras do vidro */}
        <path d="M410,385 L390,760 M670,385 L690,760 M540,385 L540,470 M540,700 L540,760" stroke="#3A2A2C" strokeWidth={14} />
        {/* a base */}
        <rect x={360} y={755} width={360} height={50} rx={12} fill="#4A3436" />
        <rect x={400} y={800} width={280} height={40} rx={10} fill="#3A2A2C" />
      </Svg>
      <AbsoluteFill style={{ mixBlendMode: 'screen', background: `radial-gradient(circle at 540px 620px, rgba(${V},0.55) 0%, rgba(${V},0.15) 25%, rgba(${V},0) 45%)` }} />
    </AbsoluteFill>
  );
};

const OPCOES = [Olho, Torre, Lanterna];

const Perfil: React.FC = () => {
  const f = useCurrentFrame();
  const O = OPCOES[Math.min(f, OPCOES.length - 1)];
  return <O />;
};

export const ComposicaoPerfil: React.FC = () => <Composition id="Canal-Perfil" component={Perfil} durationInFrames={OPCOES.length} fps={30} width={L} height={L} />;
