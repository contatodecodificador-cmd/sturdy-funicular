/* =====================================================================================
   o-bunker/pecas: os elementos de "O Bunker" (ilustração chapada, SVG, sem marca nenhuma).
     <TVAviso x y escala aceso palavras />     a TV pequena; aceso = 0 a 1 (a tela vira vermelha);
                                               palavras = quantas palavras do aviso já apareceram
     <Radio x y escala />                       o rádio de pilha com o visor "TER 07:00" (pista)
     <Medidor x y escala pisca />               o medidor de ar: DENTRO (amarelo, pisca) e FORA (verde: pista)
     <Filtro x y escala giro para />            o filtro com o ventilador; giro = ângulo; para = 0 a 1
     <Escotilha x y escala aberta />            a tampa redonda vista de cima (no chão do quintal)
     <Riscos x y escala n />                    os risquinhos na parede, contando os dias (n grupos de 5)
     <Caneca x y escala />
   x, y = canto de cima à esquerda; escala = px por unidade.
   ===================================================================================== */
import React from 'react';
import { COR } from '../../kit/pecas';
import { FONTEM } from '../../tema';

export const AVISO = ['FIQUEM', 'EM', 'CASA.', 'NÃO', 'RESPIREM', 'A', 'NÉVOA.'];

export const METAL = { claro: '#8A8F92', medio: '#6B7073', escuro: '#43474A', breu: '#25282A', ferrugem: '#7A5A44' };
export const VERDE = '#3FD27A';
export const AMARELO = '#F2B33D';
/** o visor do rádio: âmbar, pra não confundir com o vermelho do canal */
export const VISOR = '#E8B04A';

/** a TV pequena de cozinha (desenho 420 x 330) */
/** o aviso novo da parte 2, que chama o Otávio pelo nome */
export const AVISO_NOVO = [['OTÁVIO,'], ['VOLTA', 'PRO', 'BUNKER.']];

export const TVAviso: React.FC<{ x: number; y: number; escala?: number; aceso?: number; palavras?: number; linhas?: string[][]; data?: string }> = ({
  x,
  y,
  escala = 1,
  aceso = 1,
  palavras = 99,
  linhas = [AVISO.slice(0, 3), AVISO.slice(3)],
  data,
}) => {
  const tela = `rgb(${Math.round(40 + (224 - 40) * aceso)},${Math.round(44 + (24 - 44) * aceso)},${Math.round(48 + (45 - 48) * aceso)})`;
  return (
    <svg width={420 * escala} height={330 * escala} viewBox="0 0 420 330" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      <rect x={130} y={286} width={160} height={18} rx={6} fill={METAL.escuro} />
      <rect x={196} y={260} width={28} height={30} fill={METAL.escuro} />
      <rect x={0} y={0} width={420} height={268} rx={22} fill="#2A2426" />
      <rect x={20} y={18} width={380} height={222} rx={12} fill={tela} />
      {aceso > 0.5 ? (
        <>
          <rect x={20} y={18} width={380} height={34} rx={12} fill="#0D0809" opacity={0.35} />
          <text x={210} y={42} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={18} letterSpacing="0.2em" fill={COR.janelaAcesa}>
            ALERTA
          </text>
          {linhas.map((linha, li) => ({ linha, y: 112 + li * 56, i0: linhas.slice(0, li).reduce((a, l) => a + l.length, 0) })).map(({ linha, y: ly, i0 }) => (
            <text key={ly} x={210} y={ly} textAnchor="middle" fontFamily={FONTEM.titulo} fontWeight={900} fontSize={27} letterSpacing="-0.01em" fill={COR.janelaAcesa}>
              {linha.map((p, k) => (
                <tspan key={k} opacity={i0 + k < palavras ? 1 : 0}>
                  {p}{' '}
                </tspan>
              ))}
            </text>
          ))}
          <rect x={60} y={196} width={300} height={8} rx={4} fill={COR.janelaAcesa} opacity={0.5} />
          {data ? (
            <text x={34} y={228} fontFamily={FONTEM.mono} fontWeight={700} fontSize={14} fill={COR.janelaAcesa} opacity={0.85}>
              {data}
            </text>
          ) : null}
        </>
      ) : null}
      <circle cx={392} cy={254} r={5} fill={aceso > 0.5 ? COR.acento : '#4A3F40'} />
    </svg>
  );
};

/** o rádio de pilha (desenho 360 x 240) */
export const Radio: React.FC<{ x: number; y: number; escala?: number; texto?: string }> = ({ x, y, escala = 1, texto = 'TER 07:00' }) => (
  <svg width={360 * escala} height={240 * escala} viewBox="0 0 360 240" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <path d="M290,40 L340,-90" stroke={METAL.claro} strokeWidth={6} strokeLinecap="round" />
    <circle cx={340} cy={-90} r={7} fill={METAL.claro} />
    <path d="M60,40 Q180,-10 300,40" fill="none" stroke={METAL.breu} strokeWidth={14} strokeLinecap="round" />
    <rect x={0} y={36} width={360} height={204} rx={26} fill="#3B3530" />
    <rect x={14} y={50} width={332} height={176} rx={18} fill="#4A433D" />
    {/* a grade do alto-falante */}
    {Array.from({ length: 5 }, (_, l) =>
      Array.from({ length: 6 }, (_, c) => <circle key={`${l}-${c}`} cx={44 + c * 22} cy={88 + l * 26} r={6} fill="#25201D" />),
    )}
    {/* o visor */}
    <rect x={180} y={72} width={156} height={64} rx={10} fill="#1A1512" />
    <text x={258} y={113} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={23} fill={VISOR}>
      {texto}
    </text>
    <circle cx={222} cy={186} r={20} fill={METAL.medio} />
    <circle cx={290} cy={186} r={20} fill={METAL.medio} />
    <path d="M222,170 L222,180 M290,170 L298,178" stroke={METAL.breu} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** o medidor de ar na parede (desenho 300 x 220) */
export const Medidor: React.FC<{ x: number; y: number; escala?: number; dentroLigado?: boolean }> = ({ x, y, escala = 1, dentroLigado = true }) => (
  <svg width={300 * escala} height={220 * escala} viewBox="0 0 300 220" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <rect x={0} y={0} width={300} height={220} rx={16} fill={METAL.medio} />
    <rect x={12} y={12} width={276} height={196} rx={10} fill={METAL.escuro} />
    <text x={150} y={48} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={20} letterSpacing="0.14em" fill="#C9C2B8">
      AR
    </text>
    {[
      { cx: 84, rot: 'DENTRO', cor: AMARELO, ligado: dentroLigado },
      { cx: 216, rot: 'FORA', cor: VERDE, ligado: true },
    ].map((l) => (
      <g key={l.rot}>
        <circle cx={l.cx} cy={116} r={38} fill={METAL.breu} />
        <circle cx={l.cx} cy={116} r={28} fill={l.ligado ? l.cor : '#3A3634'} />
        {l.ligado ? <circle cx={l.cx} cy={116} r={46} fill={l.cor} opacity={0.18} /> : null}
        <circle cx={l.cx - 9} cy={107} r={7} fill="#FFFFFF" opacity={0.35} />
        <text x={l.cx} y={190} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={20} fill="#C9C2B8">
          {l.rot}
        </text>
      </g>
    ))}
  </svg>
);

/** o filtro de ar com o ventilador (desenho 320 x 320) */
export const Filtro: React.FC<{ x: number; y: number; escala?: number; giro?: number }> = ({ x, y, escala = 1, giro = 0 }) => (
  <svg width={320 * escala} height={320 * escala} viewBox="0 0 320 320" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <rect x={0} y={0} width={320} height={320} rx={18} fill={METAL.medio} />
    <rect x={18} y={18} width={284} height={284} rx={142} fill={METAL.breu} />
    <g transform={`rotate(${giro} 160 160)`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a} 160 160)`} d="M160,160 C150,110 170,60 210,46 C218,90 196,140 160,160 Z" fill={METAL.claro} />
      ))}
      <circle cx={160} cy={160} r={24} fill={METAL.escuro} />
    </g>
    {/* a grade por cima */}
    {[60, 110, 160, 210, 260].map((g) => (
      <line key={g} x1={g} y1={22} x2={g} y2={298} stroke={METAL.escuro} strokeWidth={4} opacity={0.7} />
    ))}
    {[[20, 20], [300, 20], [20, 300], [300, 300]].map(([px, py]) => (
      <circle key={`${px}${py}`} cx={px === 20 ? 30 : 290} cy={py === 20 ? 30 : 290} r={7} fill={METAL.escuro} />
    ))}
    <rect x={90} y={-44} width={140} height={32} rx={6} fill="#C9C2B8" />
    <text x={160} y={-21} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={17} fill={METAL.breu}>
      FILTRO DE AR
    </text>
  </svg>
);

/** a tampa da escotilha vista de cima, no chão (desenho 360 x 260) */
export const Escotilha: React.FC<{ x: number; y: number; escala?: number; aberta?: boolean }> = ({ x, y, escala = 1, aberta = false }) => (
  <svg width={360 * escala} height={260 * escala} viewBox="0 0 360 260" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <ellipse cx={180} cy={150} rx={176} ry={104} fill="#5A5048" />
    {aberta ? (
      <>
        <ellipse cx={180} cy={150} rx={150} ry={86} fill="#0D0809" />
        <path d="M110,150 L110,240 M250,150 L250,240 M110,180 L250,180 M110,214 L250,214" stroke={METAL.escuro} strokeWidth={8} />
        {/* a tampa em pé, aberta pra trás */}
        <ellipse cx={180} cy={40} rx={150} ry={40} fill={METAL.escuro} />
        <ellipse cx={180} cy={36} rx={134} ry={32} fill={METAL.medio} />
      </>
    ) : (
      <>
        <ellipse cx={180} cy={146} rx={150} ry={86} fill={METAL.medio} />
        <ellipse cx={180} cy={140} rx={136} ry={76} fill={METAL.claro} />
        <ellipse cx={180} cy={140} rx={136} ry={76} fill="none" stroke={METAL.ferrugem} strokeWidth={6} opacity={0.5} />
        {/* o volante da tranca */}
        <ellipse cx={180} cy={138} rx={58} ry={32} fill="none" stroke={METAL.escuro} strokeWidth={12} />
        <path d="M122,138 L238,138 M180,106 L180,170" stroke={METAL.escuro} strokeWidth={10} />
        <ellipse cx={180} cy={138} rx={14} ry={9} fill={METAL.breu} />
      </>
    )}
  </svg>
);

/** os risquinhos na parede: grupos de 5 (4 em pé e 1 cortando) */
export const Riscos: React.FC<{ x: number; y: number; escala?: number; n?: number; colunas?: number; cor?: string }> = ({ x, y, escala = 1, n = 60, colunas = 10, cor = '#2E2A28' }) => (
  <svg width={colunas * 80 * escala} height={Math.ceil(n / colunas) * 64 * escala} viewBox={`0 0 ${colunas * 80} ${Math.ceil(n / colunas) * 64}`} style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    {Array.from({ length: n }, (_, i) => {
      const gx = (i % colunas) * 80 + 8;
      const gy = Math.floor(i / colunas) * 64 + 6;
      const t = (k: number) => ((i * 7 + k * 13) % 9) - 4;
      return (
        <g key={i} stroke={cor} strokeWidth={5} strokeLinecap="round">
          {[0, 1, 2, 3].map((k) => (
            <line key={k} x1={gx + k * 14 + t(k) * 0.4} y1={gy} x2={gx + k * 14 - t(k) * 0.4} y2={gy + 44} />
          ))}
          <line x1={gx - 6} y1={gy + 34 + t(5) * 0.5} x2={gx + 52} y2={gy + 8} />
        </g>
      );
    })}
  </svg>
);

/** a caneca (desenho 120 x 120) */
/** a caneca; seca = cinco anos depois (sem vapor, a marca seca do café escorrida e poeira em cima) */
export const Caneca: React.FC<{ x: number; y: number; escala?: number; seca?: boolean }> = ({ x, y, escala = 1, seca = false }) => (
  <svg width={120 * escala} height={120 * escala} viewBox="0 0 120 120" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <path d="M86,38 C116,38 116,86 86,86" fill="none" stroke={seca ? '#CFC6BA' : '#E8E0D6'} strokeWidth={12} />
    <rect x={10} y={20} width={80} height={96} rx={12} fill={seca ? '#CFC6BA' : '#E8E0D6'} />
    {seca ? (
      <>
        <ellipse cx={50} cy={22} rx={40} ry={10} fill="#3A2A20" />
        <ellipse cx={50} cy={22} rx={30} ry={6} fill="#2A1D16" />
        <path d="M24,26 C26,40 22,52 26,60 M70,26 C72,36 70,44 73,50" fill="none" stroke="#6E4A34" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        <rect x={10} y={20} width={80} height={10} fill="#B8AFA2" opacity={0.6} />
      </>
    ) : (
      <>
        <ellipse cx={50} cy={22} rx={40} ry={10} fill="#5A3B28" />
        <path d="M38,8 Q30,-8 40,-22 M58,8 Q50,-10 60,-26" fill="none" stroke="#E8E0D6" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      </>
    )}
  </svg>
);

/** o controle remoto da TV (desenho 70 x 200); limpo = sem poeira (a pista da parte 2) */
export const Controle: React.FC<{ x: number; y: number; escala?: number; limpo?: boolean }> = ({ x, y, escala = 1, limpo = true }) => (
  <svg width={70 * escala} height={200 * escala} viewBox="0 0 70 200" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <rect x={0} y={0} width={70} height={200} rx={18} fill="#1E1A1B" />
    <circle cx={35} cy={30} r={10} fill={COR.acento} />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={12 + (i % 3) * 17} y={60 + Math.floor(i / 3) * 26} width={12} height={12} rx={4} fill="#4A4244" />
    ))}
    <rect x={14} y={150} width={42} height={30} rx={8} fill="#4A4244" />
    {limpo ? <path d="M10,12 L22,4" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.35} /> : <rect x={0} y={0} width={70} height={200} rx={18} fill="#B8AFA2" opacity={0.55} />}
  </svg>
);

/** a torre de rádio do bairro (desenho 360 x 820): treliça, plataforma, antena e a luz vermelha no topo */
export const Torre: React.FC<{ x: number; y: number; escala?: number; luz?: number; cor?: string }> = ({ x, y, escala = 1, luz = 1, cor = '#2A2024' }) => (
  <svg width={360 * escala} height={820 * escala} viewBox="0 0 360 820" style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <path d="M60,820 L150,120 M300,820 L210,120" stroke={cor} strokeWidth={14} />
    {Array.from({ length: 9 }, (_, i) => {
      const y1 = 800 - i * 76;
      const y2 = y1 - 76;
      const w1 = 120 - (i * 60) / 9;
      const w2 = 120 - ((i + 1) * 60) / 9;
      return <path key={i} d={`M${180 - w1},${y1} L${180 + w2},${y2} M${180 + w1},${y1} L${180 - w2},${y2} M${180 - w2},${y2} L${180 + w2},${y2}`} stroke={cor} strokeWidth={7} />;
    })}
    <rect x={130} y={104} width={100} height={18} fill={cor} />
    <path d="M180,104 L180,10" stroke={cor} strokeWidth={8} />
    <rect x={150} y={600} width={60} height={30} rx={4} fill="#C9C2B8" opacity={0.85} />
    <text x={180} y={621} textAnchor="middle" fontFamily={FONTEM.mono} fontWeight={700} fontSize={14} fill="#2A2024">
      TORRE 7
    </text>
    <circle cx={180} cy={10} r={16} fill={`rgba(224,24,45,${0.25 + 0.75 * luz})`} />
    {luz > 0.5 ? <circle cx={180} cy={10} r={44} fill="rgba(224,24,45,0.25)" /> : null}
  </svg>
);
