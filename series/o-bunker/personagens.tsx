/* =====================================================================================
   o-bunker/personagens: o elenco de "O Bunker" (ilustração chapada, SVG).
     <Otavio x y escala epoca vista expressao pose olhar cima pisca respira passo />
        x, y = ponto entre os pés na tela; escala = px por unidade (o desenho tem 400 x 1000)
        epoca 'hoje' (barba grisalha comprida, gorro mostarda) | 'lembranca' (barba curta escura, sem gorro)
        vista 'frente' | 'costas'
        pose 'parado' | 'caneca' (segura a caneca com as duas mãos, no peito) |
             'chave' (a mão direita dele levantada com a chave de fenda)
        cima = 0 a 1: inclina a cabeça pra olhar pra cima (a escotilha no teto)
        passo = quadro do passo (null = parado), como a Júlia do kit
     A voz do rádio e o Vigia (narrador) não aparecem.
   Desenhe com estas cores "acesas" e escureça a cena com <Escuro> (kit/luz).
   ===================================================================================== */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { useIdSvg } from '../../kit/luz';
import { type Expressao, Rosto } from '../../kit/rosto';

export type { Expressao };
export type Epoca = 'hoje' | 'lembranca';

export const OTAVIO = {
  pele: '#A8754F',
  peleSombra: '#875A3A',
  labio: '#6A3F2C',
  iris: '#2E1E14',
  camisa: '#5B6B5A',
  camisaListra: '#3A443A',
  camisaNova: '#4F6B4C',
  camisaListraNova: '#2F4530',
  calca: '#4A3F35',
  calcaSombra: '#3A3129',
  botina: '#2A211B',
  /* hoje */
  /* grisalho: o escuro de antes com fios brancos misturados (só passaram cinco anos) */
  cabeloGrisalho: '#4E4741',
  barbaGrisalha: '#4E4741',
  barbaGrisalhaSombra: '#2E2925',
  fioBranco: '#B8B2AA',
  gorro: '#C9962B',
  gorroSombra: '#A07420',
  /* na lembrança */
  cabeloEscuro: '#2B2420',
  barbaEscura: '#2B2420',
  /* a caneca e a chave de fenda */
  caneca: '#E8E0D6',
  canecaSombra: '#BDB2A6',
  ferro: '#9AA0A3',
  cabo: '#C9962B',
};

const CORPO = 'M140,296 C164,306 236,306 260,296 L304,316 C318,324 324,338 327,356 L340,560 L296,568 L290,414 L292,604 C254,616 146,616 108,604 L110,414 L104,568 L60,560 L73,356 C76,338 82,324 96,316 Z';

const Pernas: React.FC<{ fase: number }> = ({ fase }) => {
  const C = OTAVIO;
  return (
    <>
      {[
        { x: 158, d: fase },
        { x: 242, d: -fase },
      ].map((p, i) => (
        <g key={i} transform={`rotate(${p.d * 9} ${p.x} 604)`}>
          <path d={`M${p.x - 42},600 L${p.x + 42},600 L${p.x + 36},948 L${p.x - 36},948 Z`} fill={C.calca} />
          <path d={`M${p.x + (i ? -8 : 8)},640 L${p.x + (i ? -6 : 6)},930`} stroke={C.calcaSombra} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${p.x - 42},958 C${p.x - 42},938 ${p.x + 30},930 ${p.x + 44},946 L${p.x + 48},972 L${p.x - 42},972 Z`} fill={C.botina} />
        </g>
      ))}
    </>
  );
};

export const Otavio: React.FC<{
  x: number;
  y: number;
  escala?: number;
  epoca?: Epoca;
  vista?: 'frente' | 'costas';
  expressao?: Expressao;
  pose?: 'parado' | 'caneca' | 'chave';
  olhar?: number;
  cima?: number;
  pisca?: boolean;
  respira?: boolean;
  passo?: number | null;
}> = ({ x, y, escala = 0.9, epoca = 'hoje', vista = 'frente', expressao = 'neutra', pose = 'parado', olhar = 0, cima = 0, pisca = true, respira = true, passo = null }) => {
  const f = useCurrentFrame();
  const id = useIdSvg();
  const C = OTAVIO;
  const hoje = epoca === 'hoje';
  const costas = vista === 'costas';
  const fechado = pisca && (f + 51) % 103 < 4;
  const r = respira ? Math.sin(f / 19) : 0;
  const fase = passo === null ? 0 : Math.sin((passo / 15) * Math.PI);
  const bob = passo === null ? 0 : -Math.abs(Math.cos((passo / 15) * Math.PI)) * 9;
  const camisa = hoje ? C.camisa : C.camisaNova;
  const listra = hoje ? C.camisaListra : C.camisaListraNova;
  const cabelo = hoje ? C.cabeloGrisalho : C.cabeloEscuro;
  const sobrancelha = hoje ? '#6E6A64' : C.cabeloEscuro;
  const maoD = pose === 'chave' && !costas; // a mão direita dele (lado esquerdo da tela) levantada
  return (
    <svg width={400 * escala} height={1000 * escala} viewBox="0 0 400 1000" style={{ position: 'absolute', left: x - 200 * escala, top: y - 1000 * escala, overflow: 'visible' }}>
      <defs>
        <pattern id={`xadrez${id}`} width={44} height={44} patternUnits="userSpaceOnUse">
          <rect width={44} height={44} fill={camisa} />
          <rect x={0} y={16} width={44} height={12} fill={listra} opacity={0.55} />
          <rect x={16} y={0} width={12} height={44} fill={listra} opacity={0.55} />
          <rect x={30} y={0} width={3} height={44} fill={listra} opacity={0.4} />
        </pattern>
      </defs>
      <g transform={`translate(0 ${bob})`}>
        <Pernas fase={fase} />
        {/* pescoço */}
        <rect x={174} y={236} width={52} height={72} fill={C.pele} />
        {/* camisa xadrez de manga comprida (os braços vêm dentro dela) */}
        <g transform={`translate(0 ${r * 1.5})`}>
          <path d={CORPO} fill={`url(#xadrez${id})`} />
          {maoD ? <path d="M96,316 C82,324 76,338 73,356 L60,420 L112,430 L110,414 Z" fill={listra} opacity={0.35} /> : null}
          {costas ? (
            <path d="M140,300 C164,310 236,310 260,300" fill="none" stroke={listra} strokeWidth={10} strokeLinecap="round" />
          ) : (
            <>
              <path d="M200,304 L200,604" stroke={listra} strokeWidth={4} />
              {[360, 420, 480, 540].map((by) => (
                <circle key={by} cx={208} cy={by} r={5} fill="#E8E0D6" opacity={0.8} />
              ))}
              <path d="M146,294 L174,286 L198,334 L168,340 Z M254,294 L226,286 L202,334 L232,340 Z" fill={camisa} stroke={listra} strokeWidth={4} strokeLinejoin="round" />
              <rect x={226} y={380} width={52} height={50} rx={4} fill="none" stroke={listra} strokeWidth={4} />
            </>
          )}
          <path d="M110,414 Q118,450 112,500 M290,414 Q282,450 288,500" fill="none" stroke={listra} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          {/* as mãos */}
          {pose === 'parado' || costas ? (
            <>
              <ellipse cx={82} cy={584} rx={20} ry={26} fill={C.pele} />
              <ellipse cx={318} cy={584} rx={20} ry={26} fill={C.pele} />
            </>
          ) : null}
          {pose === 'caneca' && !costas ? (
            <>
              <path d="M84,520 L170,470 M316,520 L230,470" stroke={camisa} strokeWidth={46} strokeLinecap="round" />
              <path d="M84,520 L170,470 M316,520 L230,470" stroke={listra} strokeWidth={46} strokeLinecap="round" opacity={0.3} />
              <rect x={168} y={410} width={64} height={78} rx={10} fill={C.caneca} />
              <path d="M232,428 C258,428 258,470 232,470" fill="none" stroke={C.caneca} strokeWidth={10} />
              <rect x={168} y={410} width={64} height={12} rx={6} fill={C.canecaSombra} />
              <ellipse cx={170} cy={466} rx={20} ry={18} fill={C.pele} />
              <ellipse cx={230} cy={466} rx={20} ry={18} fill={C.pele} />
            </>
          ) : null}
          {maoD ? (
            <>
              {/* o braço levantado, a chave de fenda na mão */}
              <path d="M86,400 Q60,330 92,262" stroke={camisa} strokeWidth={44} strokeLinecap="round" fill="none" />
              <path d="M86,400 Q60,330 92,262" stroke={listra} strokeWidth={44} strokeLinecap="round" fill="none" opacity={0.3} />
              <rect x={86} y={150} width={10} height={86} rx={4} fill={C.ferro} />
              <rect x={78} y={226} width={26} height={54} rx={9} fill={C.cabo} />
              <ellipse cx={92} cy={250} rx={22} ry={26} fill={C.pele} />
              <ellipse cx={318} cy={584} rx={20} ry={26} fill={C.pele} />
            </>
          ) : null}
        </g>
        {/* cabeça */}
        <g transform={`translate(${olhar * 3} ${r * 1.8 - cima * 6}) rotate(${-cima * 7} 200 250)`}>
          <ellipse cx={124} cy={186} rx={12} ry={20} fill={C.pele} />
          <ellipse cx={276} cy={186} rx={12} ry={20} fill={C.pele} />
          {costas ? (
            <>
              {/* a nuca: cabelo e, hoje, o coque baixo */}
              <path d="M124,180 C118,100 154,62 200,62 C246,62 282,100 276,180 C276,220 262,248 238,258 L162,258 C138,248 124,220 124,180 Z" fill={cabelo} />
              {hoje ? (
                <>
                  {/* o rabo de cavalo curto, preso com elástico escuro */}
                  <path d="M184,236 C178,262 182,292 200,306 C218,292 222,262 216,236 Z" fill={C.cabeloGrisalho} />
                  <rect x={184} y={232} width={32} height={12} rx={5} fill="#3A3634" />
                  <path d="M150,110 Q164,190 182,236 M250,110 Q236,190 218,236 M200,70 L200,232 M174,100 Q182,170 192,234 M226,100 Q218,170 208,234 M136,150 Q146,200 164,244 M264,150 Q254,200 236,244 M194,250 L196,296 M206,250 L204,296" fill="none" stroke={C.fioBranco} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
                </>
              ) : null}
            </>
          ) : (
            <>
              <path d="M126,166 C126,96 160,72 200,72 C240,72 274,96 274,166 C274,218 256,256 222,266 Q200,272 178,266 C144,256 126,218 126,166 Z" fill={C.pele} />
              <path d="M252,110 C274,140 278,204 254,240 C244,252 230,260 216,264 C242,246 260,210 260,170 C260,142 256,124 252,110 Z" fill={C.peleSombra} opacity={0.4} />
              {hoje ? (
                <>
                  {/* barba grisalha comprida, até o peito */}
                  <path d="M128,186 C128,262 150,330 200,352 C250,330 272,262 272,186 C266,226 254,248 236,256 Q200,266 164,256 C146,248 134,226 128,186 Z" fill={C.barbaGrisalha} />
                  <path d="M172,284 Q180,318 196,340 M228,284 Q220,318 204,340 M200,290 L200,346" fill="none" stroke={C.barbaGrisalhaSombra} strokeWidth={3} strokeLinecap="round" />
                  {/* os fios brancos misturados na barba */}
                  <path d="M150,236 Q160,280 182,322 M186,270 Q190,306 198,338 M214,270 Q210,306 202,338 M250,236 Q240,280 218,322 M140,206 Q144,240 160,268 M260,206 Q256,240 240,268 M164,296 Q172,316 186,334 M236,296 Q228,316 214,334" fill="none" stroke={C.fioBranco} strokeWidth={3.5} strokeLinecap="round" opacity={0.85} />
                  {/* o cabelo grisalho dos lados, preso atrás */}
                  <path d="M124,186 C120,150 124,128 134,116 L140,184 Z M276,186 C280,150 276,128 266,116 L260,184 Z" fill={C.cabeloGrisalho} />
                  <path d="M128,180 L130,132 M134,182 L136,128 M272,180 L270,132 M266,182 L264,128" stroke={C.fioBranco} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
                </>
              ) : (
                <>
                  {/* barba curta escura */}
                  <path d="M132,196 C136,238 160,264 200,270 C240,264 264,238 268,196 C262,228 246,250 226,256 Q200,262 174,256 C154,250 138,228 132,196 Z" fill={C.barbaEscura} opacity={0.75} />
                  <path d="M126,170 C118,98 152,58 200,58 C248,58 282,98 274,170 C270,140 262,122 248,112 C232,102 214,100 200,100 C186,100 168,102 152,112 C138,122 130,140 126,170 Z" fill={C.cabeloEscuro} />
                </>
              )}
              <Rosto cx={200} ey={172} my={hoje ? 238 : 234} e={expressao} fechado={fechado} olhar={olhar} pele={C.pele} peleSombra={C.peleSombra} iris={C.iris} labio={C.labio} sobrancelha={sobrancelha} grossura={9} />
              {/* bigode */}
              <path d="M174,226 Q200,214 226,226" fill="none" stroke={hoje ? C.barbaGrisalha : C.barbaEscura} strokeWidth={hoje ? 10 : 7} strokeLinecap="round" opacity={hoje ? 1 : 0.8} />
              {hoje ? <path d="M182,222 Q192,218 198,220 M204,220 Q212,218 220,222" fill="none" stroke={C.fioBranco} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} /> : null}
            </>
          )}
          {hoje ? (
            <>
              {/* o gorro de lã mostarda: a marca que se vê de longe */}
              <path d="M120,118 C116,56 154,24 200,24 C246,24 284,56 280,118 Z" fill={C.gorro} />
              {[150, 176, 200, 224, 250].map((gx) => (
                <path key={gx} d={`M${gx},${gx === 200 ? 28 : 38} Q${200 + (gx - 200) * 1.2},70 ${200 + (gx - 200) * 1.3},112`} fill="none" stroke={C.gorroSombra} strokeWidth={3} opacity={0.6} />
              ))}
              <rect x={114} y={96} width={172} height={36} rx={16} fill={C.gorro} />
              {Array.from({ length: 14 }, (_, i) => (
                <rect key={i} x={124 + i * 11.4} y={102} width={4} height={24} rx={2} fill={C.gorroSombra} opacity={0.7} />
              ))}
            </>
          ) : null}
        </g>
      </g>
    </svg>
  );
};
