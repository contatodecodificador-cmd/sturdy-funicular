/* =====================================================================================
   o-bunker/Stories: os Stories da parte 1 de "O Bunker" (modelos do kit, com as cenas da série).
     Imagens: OBunker-Story-Hoje, -NoAr, -Vota, -Resultado (quadro 0 = SAI, 1 = FICA)
     Vídeos:  StoryVideo-Bunker-1-Hoje, -NoAr, -Vota, -Sai, -Fica
   Nenhum texto em cima de rosto. Sem música no arquivo: ela entra pela figurinha do app.
   ===================================================================================== */
import React, { useContext } from 'react';

import { AbsoluteFill, Composition, useCurrentFrame } from 'remotion';
import { FaixaTexto, Letreiro, Riscos, Sublinhado } from '../../kit/story';
import { FONTEM } from '../../tema';
import { comFontes, Fundo, RitmoStory, StoryHoje, StoryNoAr, StoryResultado, StoryVota } from '../stories/Stories';
import { composicoesEmVideo, DUR_STORY } from '../stories/StoriesVideo';
import { BUNKER, CenaBunker } from './cenarios';
import { CenaFica, CenaSai, CenaTV } from './lembranca';
import { CenaQuintalTarde, CenaSala, TV_SALA } from './parte2/cenarios';

const QUADRO = { fps: 30, width: 1080, height: 1920 } as const;

export const HojeBunker: React.FC = () => (
  <StoryHoje
    hora="21H30"
    linha="TEM PARTE NOVA!"
    fundo={
      <Fundo escuro={0.1} zoom={1.15} foco={[BUNKER.rosto.x, BUNKER.rosto.y]} desce={430}>
        <CenaBunker giro={20} otavio={{ expressao: 'cansada', olhar: 0.6 }} />
      </Fundo>
    }
  />
);

export const NoArBunker: React.FC = () => (
  <StoryNoAr
    parte="PARTE 1"
    chamada="Corre e deixa seu voto!"
    fundo={
      <Fundo borrado={14} escuro={0.4} zoom={1.05}>
        <CenaTV palavras={7} expressao="assustada" />
      </Fundo>
    }
  />
);

export const VotaBunker: React.FC = () => (
  <StoryVota
    pergunta={['ELE SAI', 'OU FICA?']}
    rodape="O mais votado vira a parte 2"
    fundo={
      <Fundo borrado={6} escuro={0.25} zoom={1.1}>
        <CenaSai />
      </Fundo>
    }
  />
);

const RESULTADOS: [string, React.ReactNode][] = [
  [
    'SAI!',
    <Fundo key="s" borrado={10} escuro={0.4} zoom={1.15} foco={[540, 520]}>
      <CenaSai />
    </Fundo>,
  ],
  [
    'FICA!',
    <Fundo key="f" borrado={10} escuro={0.4} zoom={1.1} foco={[BUNKER.filtro.x, 900]}>
      <CenaFica />
    </Fundo>,
  ],
];

/** n = 0 SAI, 1 FICA (sem n, o quadro escolhe) */
export const ResultadoBunker: React.FC<{ n?: number; quando?: string }> = ({ n, quando = 'PARTE 2 HOJE, 21H30' }) => {
  const f = useCurrentFrame();
  const [vencedor, fundo] = RESULTADOS[Math.min(n ?? f, RESULTADOS.length - 1)];
  return <StoryResultado vencedor={vencedor} quando={quando} fundo={fundo} />;
};

/** o resultado da parte 1 com o horário da parte 2 (16h45) */
const SaiAs1645: React.FC = () => <ResultadoBunker n={0} quando="PARTE 2 HOJE, 16H45" />;

/* ------------------------------------------------------------------ parte 2 */
export const NoArBunker2: React.FC = () => (
  <StoryNoAr
    parte="PARTE 2"
    chamada="Corre e deixa seu voto!"
    fundo={
      <Fundo borrado={12} escuro={0.4} zoom={1.3} foco={[TV_SALA.x + 200, TV_SALA.y + 150]}>
        <CenaSala aviso="novo" />
      </Fundo>
    }
  />
);

export const VotaBunker2: React.FC = () => (
  <StoryVota
    pergunta={['ELE VOLTA', 'OU DESLIGA?']}
    rodape="O mais votado vira a parte 3"
    fundo={
      <Fundo borrado={6} escuro={0.3} zoom={1.4} foco={[TV_SALA.x + 200, TV_SALA.y + 150]}>
        <CenaSala aviso="novo" />
      </Fundo>
    }
  />
);

const RESULTADOS2: [string, React.ReactNode][] = [
  [
    'VOLTA!',
    <Fundo key="v" borrado={10} escuro={0.4} zoom={1.2} foco={[540, 1200]}>
      <CenaQuintalTarde fundo="casa" anoitecer={1} />
    </Fundo>,
  ],
  [
    'DESLIGA!',
    <Fundo key="d" borrado={10} escuro={0.4} zoom={1.4} foco={[TV_SALA.x + 200, TV_SALA.y + 150]}>
      <CenaSala aviso="novo" />
    </Fundo>,
  ],
];

/** n = 0 VOLTA, 1 DESLIGA */
export const ResultadoBunker2: React.FC<{ n?: number; quando?: string }> = ({ n, quando = 'PARTE 3 HOJE, 21H30' }) => {
  const f = useCurrentFrame();
  const [vencedor, fundo] = RESULTADOS2[Math.min(n ?? f, RESULTADOS2.length - 1)];
  return <StoryResultado vencedor={vencedor} quando={quando} fundo={fundo} />;
};

/** o Story da decisão em frase de narração: "Vocês decidiram: / o Otávio / VAI VOLTAR / pro bunker." */
export const StoryDecisao: React.FC<{ antes: string; faixa: string; depois: string; quando: string; fundo: React.ReactNode }> = ({ antes, faixa, depois, quando, fundo }) => {
  const { t0 } = useContext(RitmoStory);
  const e = (d: number) => (t0 === undefined ? undefined : t0 + d);
  return (
    <AbsoluteFill>
      {fundo}
      <Letreiro x={540} y={520} tam={100} fonte={FONTEM.pincel} giro={-4} semente="dec-voces" entra={e(0)}>
        Vocês decidiram:
      </Letreiro>
      <Letreiro x={540} y={720} tam={150} giro={-5} espaco="0.02em" entra={e(12)}>
        {antes}
      </Letreiro>
      <FaixaTexto x={540} y={905} texto={faixa} tam={165} giro={-5} entra={e(20)} />
      <Riscos x={110} y={925} lado="esq" tam={80} giro={-5} entra={e(28)} />
      <Riscos x={970} y={870} lado="dir" tam={80} giro={-5} entra={e(30)} />
      <Letreiro x={540} y={1110} tam={130} giro={-5} espaco="0.02em" entra={e(36)}>
        {depois}
      </Letreiro>
      <Letreiro x={540} y={1330} tam={95} giro={-5} espaco="0.02em" entra={e(46)}>
        {quando}
      </Letreiro>
      <Sublinhado x1={270} y1={1372} x2={820} y2={1330} grossura={16} semente="dec-sub" entra={e(54)} />
    </AbsoluteFill>
  );
};

/** o resultado da parte 2 com o horário da parte 3 (10h), em frase */
const VoltaAs10: React.FC = () => (
  <StoryDecisao
    antes="O OTÁVIO"
    faixa="VAI VOLTAR"
    depois="PRO BUNKER."
    quando="PARTE 3 HOJE, 10H"
    fundo={
      <Fundo borrado={10} escuro={0.45} zoom={1.2} foco={[540, 1200]}>
        <CenaQuintalTarde fundo="casa" anoitecer={1} />
      </Fundo>
    }
  />
);

const ComposicoesVideo2 = composicoesEmVideo([
  { id: 'StoryVideo-Bunker-2-NoAr', C: NoArBunker2, dur: DUR_STORY.noar },
  { id: 'StoryVideo-Bunker-2-Vota', C: VotaBunker2, dur: DUR_STORY.enquete },
  { id: 'StoryVideo-Bunker-2-Volta', C: () => <ResultadoBunker2 n={0} />, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-2-Volta-10h', C: VoltaAs10, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-2-Desliga', C: () => <ResultadoBunker2 n={1} />, dur: DUR_STORY.resultado },
]);

/* ------------------------------------------------------------------ parte 3 */
const P3S = { caneca: true, riscoNovo: 1, escrita: 1, pegadas: true };
const cone3 = (x: number, y: number) => ({ x: 560, y: 1240, angulo: (Math.atan2(y - 1240, x - 560) * 180) / Math.PI, abertura: 30, alcance: 1100, forca: 0.95 });

export const NoArBunker3: React.FC = () => (
  <StoryNoAr
    parte="PARTE 3"
    chamada="Corre e deixa seu voto!"
    fundo={
      <Fundo borrado={10} escuro={0.35} zoom={2.4} foco={[653, 1050]}>
        <CenaBunker otavio={null} luz={0.25} p3={P3S} cones={[cone3(653, 1065)]} />
      </Fundo>
    }
  />
);

export const VotaBunker3: React.FC = () => (
  <StoryVota
    pergunta={['ELE PROCURA', 'OU FOGE?']}
    rodape="O mais votado vira a parte 4"
    fundo={
      <Fundo borrado={6} escuro={0.25} zoom={2.6} foco={[335, 800]}>
        <CenaBunker otavio={null} luz={0.25} p3={P3S} cones={[cone3(340, 800)]} />
      </Fundo>
    }
  />
);

const RESULTADOS3: [string, React.ReactNode][] = [
  [
    'PROCURA!',
    <Fundo key="p" borrado={10} escuro={0.4} zoom={1.3} foco={[400, 1150]}>
      <CenaBunker otavio={null} luz={0.25} p3={P3S} cones={[cone3(330, 1000)]} />
    </Fundo>,
  ],
  [
    'FOGE!',
    <Fundo key="f" borrado={10} escuro={0.4} zoom={1.2} foco={[540, 1200]}>
      <CenaQuintalTarde fundo="casa" anoitecer={1} />
    </Fundo>,
  ],
];

/** n = 0 PROCURA, 1 FOGE */
export const ResultadoBunker3: React.FC<{ n?: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const [vencedor, fundo] = RESULTADOS3[Math.min(n ?? f, RESULTADOS3.length - 1)];
  return <StoryResultado vencedor={vencedor} quando="PARTE 4 HOJE, 21H30" fundo={fundo} />;
};

const ComposicoesVideo3 = composicoesEmVideo([
  { id: 'StoryVideo-Bunker-3-NoAr', C: NoArBunker3, dur: DUR_STORY.noar },
  { id: 'StoryVideo-Bunker-3-Vota', C: VotaBunker3, dur: DUR_STORY.enquete },
  { id: 'StoryVideo-Bunker-3-Procura', C: () => <ResultadoBunker3 n={0} />, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-3-Foge', C: () => <ResultadoBunker3 n={1} />, dur: DUR_STORY.resultado },
]);

const ComposicoesVideo = composicoesEmVideo([
  { id: 'StoryVideo-Bunker-1-Hoje', C: HojeBunker, dur: DUR_STORY.hoje },
  { id: 'StoryVideo-Bunker-1-NoAr', C: NoArBunker, dur: DUR_STORY.noar },
  { id: 'StoryVideo-Bunker-1-Vota', C: VotaBunker, dur: DUR_STORY.enquete },
  { id: 'StoryVideo-Bunker-1-Sai', C: () => <ResultadoBunker n={0} />, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-1-Sai-1645', C: SaiAs1645, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-1-Fica', C: () => <ResultadoBunker n={1} />, dur: DUR_STORY.resultado },
]);

export const ComposicoesStoriesBunker: React.FC = () => (
  <>
    <Composition id="OBunker-Story-Hoje" component={comFontes(HojeBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-NoAr" component={comFontes(NoArBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-Vota" component={comFontes(VotaBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-Resultado" component={comFontes(ResultadoBunker)} durationInFrames={RESULTADOS.length} {...QUADRO} />
    <ComposicoesVideo />
    <Composition id="OBunker-Story-Sai-1645" component={comFontes(SaiAs1645)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker2-Story-NoAr" component={comFontes(NoArBunker2)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker2-Story-Vota" component={comFontes(VotaBunker2)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker2-Story-Resultado" component={comFontes(ResultadoBunker2)} durationInFrames={RESULTADOS2.length} {...QUADRO} />
    <ComposicoesVideo2 />
    <Composition id="OBunker2-Story-Volta-10h" component={comFontes(VoltaAs10)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker3-Story-NoAr" component={comFontes(NoArBunker3)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker3-Story-Vota" component={comFontes(VotaBunker3)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker3-Story-Resultado" component={comFontes(ResultadoBunker3)} durationInFrames={RESULTADOS3.length} {...QUADRO} />
    <ComposicoesVideo3 />
  </>
);
