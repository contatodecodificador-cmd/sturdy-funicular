/* =====================================================================================
   o-bunker/Design: as folhas de design de "O Bunker" pra aprovação do dono (quadros parados, 1080x1920).
     OBunker-Design-Personagens  quadro 0 = o Otávio hoje, 1 = o Otávio na lembrança, 2 = os elementos,
                                 3 = a máscara (parte 2), 4 = os elementos da parte 2
     node scripts/stills.mjs OBunker-Design-Personagens out/design-bunker 1 0 1 2
   ===================================================================================== */
import React from 'react';
import { Composition, useCurrentFrame } from 'remotion';
import { Fontes } from '../../base/Fontes';
import { Amostras, Folha, Quadro, Rotulo } from '../abre-o-portao/Design';
import { AVISO_NOVO, Caneca, Controle, Escotilha, Filtro, Medidor, Radio, Riscos, Torre, TVAviso } from './pecas';
import { MASCARA } from './personagens';
import { type Epoca, type Expressao, OTAVIO, Otavio } from './personagens';

const TAG = 'O BUNKER · DESIGN';

const Expressoes: React.FC<{ epoca: Epoca; lista: [Expressao, string][] }> = ({ epoca, lista }) => (
  <>
    {lista.map(([e, nome], i) => {
      const w = 216;
      const x = 80 + i * (w + 24);
      return (
        <React.Fragment key={e}>
          <Quadro x={x} y={1120} w={w} h={270}>
            <Otavio x={w / 2} y={150 + 830 * 1.15} escala={1.15} epoca={epoca} expressao={e} pisca={false} respira={false} olhar={e === 'desconfiada' ? -0.6 : 0} />
          </Quadro>
          <Rotulo x={x + w / 2} y={1404} texto={nome} w={w + 20} />
        </React.Fragment>
      );
    })}
  </>
);

const FolhaHoje: React.FC = () => (
  <Folha titulo="OTÁVIO · HOJE" sub="47 anos · cinco anos no bunker · calado, metódico" tag={TAG}>
    <Otavio x={290} y={1010} escala={0.7} pisca={false} respira={false} expressao="cansada" />
    <Otavio x={790} y={1010} escala={0.7} vista="costas" pisca={false} respira={false} />
    <Rotulo x={290} y={1040} texto="FRENTE · GORRO MOSTARDA" w={460} />
    <Rotulo x={790} y={1040} texto="COSTAS · CABELO PRESO" w={460} />
    <Expressoes
      epoca="hoje"
      lista={[
        ['cansada', 'CANSADO'],
        ['preocupada', 'PREOCUPADO'],
        ['desconfiada', 'DESCONFIADO'],
        ['assustada', 'ASSUSTADO'],
      ]}
    />
    <Quadro x={80} y={1470} w={440} h={350}>
      <Otavio x={220} y={60 + 940 * 0.86} escala={0.86} pose="chave" expressao="preocupada" pisca={false} respira={false} />
    </Quadro>
    <Rotulo x={300} y={1834} texto="COM A CHAVE DE FENDA" w={440} />
    <Amostras
      x={580}
      y={1500}
      cores={[
        ['pele', OTAVIO.pele],
        ['barba', OTAVIO.barbaGrisalha],
        ['gorro', OTAVIO.gorro],
        ['camisa', OTAVIO.camisa],
        ['calça', OTAVIO.calca],
      ]}
    />
  </Folha>
);

const FolhaLembranca: React.FC = () => (
  <Folha titulo="LEMBRANÇA" sub="Otávio · 42 anos · a terça do alerta · sem gorro" tag={TAG}>
    <Otavio x={290} y={1010} escala={0.7} epoca="lembranca" pisca={false} respira={false} />
    <Otavio x={790} y={1010} escala={0.7} epoca="lembranca" vista="costas" pisca={false} respira={false} />
    <Rotulo x={290} y={1040} texto="FRENTE" />
    <Rotulo x={790} y={1040} texto="COSTAS" />
    <Expressoes
      epoca="lembranca"
      lista={[
        ['neutra', 'TRANQUILO'],
        ['preocupada', 'PREOCUPADO'],
        ['assustada', 'ASSUSTADO'],
        ['desconfiada', 'DECIDIDO'],
      ]}
    />
    <Quadro x={80} y={1470} w={440} h={350}>
      <Otavio x={220} y={689} escala={0.7} epoca="lembranca" pose="caneca" pisca={false} respira={false} />
    </Quadro>
    <Rotulo x={300} y={1834} texto="COM A CANECA DE CAFÉ" w={440} />
    <Amostras
      x={580}
      y={1500}
      cores={[
        ['pele', OTAVIO.pele],
        ['barba', OTAVIO.barbaEscura],
        ['camisa', OTAVIO.camisaNova],
        ['calça', OTAVIO.calca],
      ]}
    />
  </Folha>
);

const FolhaElementos: React.FC = () => (
  <Folha titulo="ELEMENTOS" sub="sem marca nenhuma · o vermelho é luz" tag={TAG}>
    <TVAviso x={80} y={300} />
    <Rotulo x={290} y={650} texto="A TV · O AVISO" w={440} />
    <Radio x={600} y={400} />
    <Rotulo x={780} y={650} texto="O RÁDIO · TER 07:00" w={440} />
    <Medidor x={80} y={740} escala={1.2} />
    <Rotulo x={260} y={1020} texto="MEDIDOR · FORA VERDE" w={440} />
    <Filtro x={640} y={770} escala={0.92} />
    <Rotulo x={787} y={1080} texto="O FILTRO DE AR" w={420} />
    <Escotilha x={80} y={1150} escala={1.1} />
    <Rotulo x={278} y={1450} texto="ESCOTILHA FECHADA" w={440} />
    <Escotilha x={600} y={1150} escala={1.1} aberta />
    <Rotulo x={798} y={1450} texto="ESCOTILHA ABERTA" w={440} />
    <Quadro x={80} y={1520} w={640} h={290} fundo="#8A847C">
      <Riscos x={24} y={30} escala={0.74} n={40} />
    </Quadro>
    <Rotulo x={400} y={1824} texto="A PAREDE DOS RISQUINHOS" w={640} />
    <Caneca x={820} y={1600} escala={1.3} />
    <Rotulo x={898} y={1824} texto="A CANECA" w={240} />
  </Folha>
);

const FolhaMascara: React.FC = () => (
  <Folha titulo="A MÁSCARA" sub="Otávio · a máscara de gás velha · o medo nos olhos" tag="O BUNKER · PARTE 2 · DESIGN">
    <Otavio x={290} y={1010} escala={0.7} mascara pisca={false} respira={false} expressao="desconfiada" olhar={-0.4} />
    <Otavio x={790} y={1010} escala={0.7} mascara vista="costas" pisca={false} respira={false} />
    <Rotulo x={290} y={1040} texto="FRENTE · DE MÁSCARA" w={460} />
    <Rotulo x={790} y={1040} texto="COSTAS · AS ALÇAS" w={460} />
    {(
      [
        ['desconfiada', 'DESCONFIADO'],
        ['preocupada', 'PREOCUPADO'],
        ['choque', 'CHOQUE'],
        ['assustada', 'ASSUSTADO'],
      ] as [Expressao, string][]
    ).map(([e, nome], i) => {
      const w = 216;
      const x = 80 + i * (w + 24);
      return (
        <React.Fragment key={e}>
          <Quadro x={x} y={1120} w={w} h={270}>
            <Otavio x={w / 2} y={150 + 830 * 1.15} escala={1.15} mascara expressao={e} pisca={false} respira={false} olhar={e === 'desconfiada' ? -0.6 : 0} />
          </Quadro>
          <Rotulo x={x + w / 2} y={1404} texto={nome} w={w + 20} />
        </React.Fragment>
      );
    })}
    <Quadro x={80} y={1470} w={440} h={350}>
      <Otavio x={220} y={1100} escala={1.15} mascara cima={1} expressao="preocupada" pisca={false} respira={false} />
    </Quadro>
    <Rotulo x={300} y={1834} texto="OLHANDO PRA ESCOTILHA" w={440} />
    <Amostras
      x={580}
      y={1500}
      cores={[
        ['borracha', MASCARA.borracha],
        ['filtros', MASCARA.filtro],
        ['alças', MASCARA.alca],
      ]}
    />
  </Folha>
);

const FolhaElementos2: React.FC = () => (
  <Folha titulo="ELEMENTOS" sub="a casa parada no tempo · o aviso que muda" tag="O BUNKER · PARTE 2 · DESIGN">
    <TVAviso x={80} y={300} data="TER 09/11/2021 · 07:00" />
    <Rotulo x={290} y={650} texto="A TV · A DATA" w={440} />
    <TVAviso x={580} y={300} linhas={AVISO_NOVO} data="TER 09/11/2021 · 07:00" />
    <Rotulo x={790} y={650} texto="O AVISO NOVO" w={440} />
    <Caneca x={120} y={800} escala={2} seca />
    <Rotulo x={240} y={1080} texto="A CANECA SECA" w={360} />
    <Controle x={440} y={780} escala={1.2} />
    <Controle x={560} y={780} escala={1.2} limpo={false} />
    <Rotulo x={540} y={1080} texto="LIMPO × SUJO" w={300} />
    <Quadro x={740} y={720} w={260} h={720} fundo="#3A2A3A">
      <Torre x={-20} y={-60} escala={0.82} />
    </Quadro>
    <Rotulo x={870} y={1456} texto="A TORRE 7" w={300} />
    <Quadro x={80} y={1140} w={620} h={300} fundo="#C9B79A">
      <Escotilha x={130} y={20} escala={1.0} aberta />
    </Quadro>
    <Rotulo x={390} y={1456} texto="A ESCOTILHA NO MATO" w={620} />
  </Folha>
);

const FOLHAS = [FolhaHoje, FolhaLembranca, FolhaElementos, FolhaMascara, FolhaElementos2];

const Personagens: React.FC = () => {
  const f = useCurrentFrame();
  const F = FOLHAS[Math.min(f, FOLHAS.length - 1)];
  return (
    <Fontes>
      <F />
    </Fontes>
  );
};

export const ComposicoesDesignBunker: React.FC = () => (
  <Composition id="OBunker-Design-Personagens" component={Personagens} durationInFrames={FOLHAS.length} fps={30} width={1080} height={1920} />
);
