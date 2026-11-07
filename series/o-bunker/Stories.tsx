/* =====================================================================================
   o-bunker/Stories: os Stories da parte 1 de "O Bunker" (modelos do kit, com as cenas da série).
     Imagens: OBunker-Story-Hoje, -NoAr, -Vota, -Resultado (quadro 0 = SAI, 1 = FICA)
     Vídeos:  StoryVideo-Bunker-1-Hoje, -NoAr, -Vota, -Sai, -Fica
   Nenhum texto em cima de rosto. Sem música no arquivo: ela entra pela figurinha do app.
   ===================================================================================== */
import React from 'react';
import { Composition, useCurrentFrame } from 'remotion';
import { comFontes, Fundo, StoryHoje, StoryNoAr, StoryResultado, StoryVota } from '../stories/Stories';
import { composicoesEmVideo, DUR_STORY } from '../stories/StoriesVideo';
import { BUNKER, CenaBunker } from './cenarios';
import { CenaFica, CenaSai, CenaTV } from './lembranca';

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
export const ResultadoBunker: React.FC<{ n?: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const [vencedor, fundo] = RESULTADOS[Math.min(n ?? f, RESULTADOS.length - 1)];
  return <StoryResultado vencedor={vencedor} quando="PARTE 2 HOJE, 21H30" fundo={fundo} />;
};

const ComposicoesVideo = composicoesEmVideo([
  { id: 'StoryVideo-Bunker-1-Hoje', C: HojeBunker, dur: DUR_STORY.hoje },
  { id: 'StoryVideo-Bunker-1-NoAr', C: NoArBunker, dur: DUR_STORY.noar },
  { id: 'StoryVideo-Bunker-1-Vota', C: VotaBunker, dur: DUR_STORY.enquete },
  { id: 'StoryVideo-Bunker-1-Sai', C: () => <ResultadoBunker n={0} />, dur: DUR_STORY.resultado },
  { id: 'StoryVideo-Bunker-1-Fica', C: () => <ResultadoBunker n={1} />, dur: DUR_STORY.resultado },
]);

export const ComposicoesStoriesBunker: React.FC = () => (
  <>
    <Composition id="OBunker-Story-Hoje" component={comFontes(HojeBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-NoAr" component={comFontes(NoArBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-Vota" component={comFontes(VotaBunker)} durationInFrames={1} {...QUADRO} />
    <Composition id="OBunker-Story-Resultado" component={comFontes(ResultadoBunker)} durationInFrames={RESULTADOS.length} {...QUADRO} />
    <ComposicoesVideo />
  </>
);
