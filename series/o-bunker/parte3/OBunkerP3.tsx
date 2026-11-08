/* =====================================================================================
   videos/o-bunker/parte3: "O Bunker", parte 3 (caminho VOLTA): a caneca quente e o "falta pouco".
   Roteiro e caminhos: roteiro.md, caminhos.md. Voz do dono, sincronizada pela transcrição do ElevenLabs.
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition, Sequence } from 'remotion';
import { Fontes } from '../../../base/Fontes';
import { useCenaM, type EntradaM } from '../../../cena';
import { Capa } from '../../../kit/capa';
import { CartaoEscolha, TelaParte } from '../../../kit/final';
import { Legenda } from '../../../kit/pecas';
import { Som, Trilha } from '../../../kit/som';
import { montarRoteiro, VideoMontado } from '../../../montagem';
import { clamp01, janelaM, lerp, mola } from '../../../tema';
import { criarTempos, type TemposJson } from '../../../tempos';
import { fusao } from '../../../transicoes/fusao';
import { CenaBunker } from '../cenarios';
import { CenaCozinha } from '../lembranca';
import { Mov } from '../parte2/camera';
import { CenaQuintalTarde } from '../parte2/cenarios';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
const DURACAO = Math.round((T.fimFala + 3.5) * FPS);
const NARRACAO = 'narracao-o-bunker-p3.mp3';

const usePalavra = (n: number) => {
  const c = useCenaM();
  const fala = T.falaDaCena(n);
  return { c, f: c.frame, fala, q: (i: number) => c.local(fala[i].s), qFim: (i: number) => c.local(fala[i].e) };
};

/** a lanterna na mão dele: de onde sai o cone */
const MAO = { x: 560, y: 1240 };
const cone = (angulo: number, forca = 0.95) => ({ x: MAO.x, y: MAO.y, angulo, abertura: 30, alcance: 1100, forca });
/** ângulo da lanterna até um ponto */
const mira = (x: number, y: number) => (Math.atan2(y - MAO.y, x - MAO.x) * 180) / Math.PI;
const CANECA = { x: 653, y: 1065 };
const P3 = { caneca: true, riscoNovo: 1, escrita: 0, pegadas: true };

/* 1. "O Otávio voltou pro bunker. Mas alguém tinha estado lá." (ele desce a escada de máscara; a câmera
      desce junto; em "alguém" ela vira devagar pro quarto escuro) */
const C1: React.FC = () => {
  const { c, f, fala, q } = usePalavra(1);
  const desce = janelaM(f, 0, q(4) + 6, 'suave');
  const passos: number[] = [];
  for (let k = 2; k < q(4); k += 9) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 640, 1.8], [q(4) + 6, 540, 1150, 1.25], [c.seqDuracao, 620, 1050, 1.45]]}>
        <CenaBunker otavio={null} luz={0.65} p3={P3} emPe={{ x: 540, y: lerp(1050, 1560, desce), escala: lerp(0.7, 0.88, desce), vista: 'costas', mascara: true, passo: desce < 1 ? f : null }} />
      </Mov>
      <Som q={0} nome="tampa" vol={1.95} />
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Legenda palavras={fala} cortes={[2, 5, 7]} destaque={['ALGUÉM']} enfase={['OTÁVIO', 'BUNKER']} />
    </AbsoluteFill>
  );
};

/* 2. "Ele só tinha ficado fora uns minutos." (de frente, ofegante, a câmera fecha nos olhos dele) */
const C2: React.FC = () => {
  const { c, fala } = usePalavra(2);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 1000, 1.4], [c.seqDuracao, 540, 930, 1.95]]} tremor={5}>
        <CenaBunker otavio={null} luz={0.7} p3={P3} emPe={{ x: 540, y: 1650, escala: 0.9, vista: 'frente', mascara: true, expressao: 'assustada', olhar: 0.5 }} />
      </Mov>
      <Som q={0} nome="respira" vol={2.07} />
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['MINUTOS']} enfase={['FORA']} />
    </AbsoluteFill>
  );
};

/* 3. "Ele acendeu a lanterna e olhou em volta." (a luz cai, a lanterna acende e varre o quarto) */
const C3: React.FC = () => {
  const { c, f, fala, q } = usePalavra(3);
  const acende = f >= q(1);
  const ang = lerp(200, 300, janelaM(f, q(4), c.seqDuracao, 'suave'));
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 560, 1200, 1.2], [q(4), 480, 1050, 1.25], [c.seqDuracao, 640, 950, 1.3]]}>
        <CenaBunker otavio={null} luz={0.25} p3={P3} cones={acende ? [cone(ang)] : []} emPe={{ x: 560, y: 1700, escala: 0.95, vista: 'costas', mascara: true }} />
      </Mov>
      <Som q={q(1)} nome="clique" vol={1.82} />
      <Legenda palavras={fala} cortes={[2, 4, 6]} destaque={['LANTERNA']} enfase={['VOLTA']} />
    </AbsoluteFill>
  );
};

/* 4. "Na mesinha, estava a caneca de café da cozinha." (a lanterna para na mesinha; a câmera vai até a caneca) */
const C4: React.FC = () => {
  const { c, f, fala, q } = usePalavra(4);
  const ang = lerp(300, mira(CANECA.x, CANECA.y), janelaM(f, 0, q(3), 'suave'));
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 640, 950, 1.3], [q(4), 650, 1050, 2.0], [c.seqDuracao, CANECA.x, CANECA.y, 2.8]]}>
        <CenaBunker otavio={null} luz={0.25} p3={P3} cones={[cone(ang)]} />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 5, 7]} destaque={['CANECA']} enfase={['MESINHA', 'COZINHA']} />
    </AbsoluteFill>
  );
};

/* 5. "A mesma que ele tinha visto seca lá em cima." (a lembrança: a caneca seca na cozinha, sem cor) */
const C5: React.FC = () => {
  const { c, fala } = usePalavra(5);
  return (
    <AbsoluteFill style={{ filter: 'grayscale(0.75) sepia(0.25) brightness(0.9)' }}>
      <Mov chaves={[[0, 420, 1060, 1.7], [c.seqDuracao, 400, 1075, 2.3]]}>
        <CenaCozinha otavio={false} seca />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 5, 7]} destaque={['SECA']} enfase={['CIMA']} />
    </AbsoluteFill>
  );
};

/* 6. "Só que agora ela estava cheia. E quente." (a caneca de perto, o vapor subindo; soco em "quente") */
const C6: React.FC = () => {
  const { c, fala, q } = usePalavra(6);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, CANECA.x, CANECA.y - 10, 3.0], [q(6) - 2, CANECA.x, CANECA.y - 20, 3.2], [q(6) + 6, CANECA.x, CANECA.y - 30, 3.9], [c.seqDuracao, CANECA.x, CANECA.y - 30, 4.0]]} curva="rapida" tremor={2}>
        <CenaBunker otavio={null} luz={0.25} p3={P3} cones={[cone(mira(CANECA.x, CANECA.y))]} />
      </Mov>
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['QUENTE']} enfase={['CHEIA']} />
    </AbsoluteFill>
  );
};

/* 7. "Ele chegou perto da parede dos risquinhos, devagar." (de costas, a lanterna na parede; a câmera vai
      por cima do ombro dele) */
const C7: React.FC = () => {
  const { c, f, fala } = usePalavra(7);
  const anda = janelaM(f, 0, c.seqDuracao * 0.9, 'suave');
  const passos: number[] = [];
  for (let k = 4; k < c.seqDuracao * 0.9; k += 20) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 520, 1150, 1.15], [c.seqDuracao, 360, 760, 1.7]]} tremor={4}>
        <CenaBunker
          otavio={null}
          luz={0.25}
          p3={P3}
          cones={[cone(mira(330, 640))]}
          emPe={{ x: lerp(600, 520, anda), y: lerp(1800, 1500, anda), escala: lerp(1.0, 0.78, anda), vista: 'costas', mascara: true, passo: anda < 1 ? f * 0.6 : null }}
        />
      </Mov>
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Legenda palavras={fala} cortes={[3, 6]} destaque={['RISQUINHOS']} enfase={['DEVAGAR']} />
    </AbsoluteFill>
  );
};

/* 8. "Tinha um risco novo. E não foi ele que fez." (os risquinhos de perto; a câmera acha o risco claro) */
const C8: React.FC = () => {
  const { c, fala, q } = usePalavra(8);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 340, 640, 2.4], [q(3), 470, 760, 3.3], [c.seqDuracao, 478, 770, 3.6]]}>
        <CenaBunker otavio={null} luz={0.25} p3={P3} cones={[cone(mira(420, 720))]} />
      </Mov>
      <Legenda palavras={fala} cortes={[4, 7]} destaque={['NOVO']} enfase={['RISCO']} />
    </AbsoluteFill>
  );
};

/* 9. "Embaixo do risco, alguém escreveu: 'falta pouco.'" (a câmera desce até a escrita, que aparece no tempo
      da fala; soco no "falta pouco") */
const C9: React.FC = () => {
  const { c, f, fala, q, qFim } = usePalavra(9);
  const escrita = clamp01((f - q(5) + 2) / Math.max(1, qFim(6) - q(5)));
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 478, 770, 3.4], [q(5) - 4, 380, 805, 2.6], [q(5) + 8, 335, 815, 3.3], [c.seqDuracao, 335, 815, 3.45]]} curva="rapida" tremor={2}>
        <CenaBunker otavio={null} luz={0.25} p3={{ ...P3, escrita }} cones={[cone(mira(340, 800))]} />
      </Mov>
      <Som q={q(5) - 4} nome="respira" vol={1.5} />
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['FALTA', 'POUCO']} enfase={['RISCO', 'ALGUÉM']} foco={[5, 6]} />
    </AbsoluteFill>
  );
};

/* 10. "Ele procura quem esteve ali ou foge de novo? Comenta PROCURA ou FOGE. Segue pra ver a parte 4." */
const C10: React.FC = () => {
  const { f, fala, q, qFim } = usePalavra(10);
  const final = qFim(17) + 6;
  return (
    <AbsoluteFill>
      <CartaoEscolha
        a={{ rotulo: 'PROCURA', cena: <CenaBunker otavio={null} luz={0.25} p3={{ ...P3, escrita: 1 }} cones={[cone(mira(330, 1000))]} />, zoom: 0.8, foco: [400, 1050] }}
        b={{ rotulo: 'FOGE', cena: <CenaQuintalTarde fundo="casa" anoitecer={1} />, zoom: 0.62, foco: [540, 1200] }}
        pA={mola(f, 'assenta', 0)}
        pB={mola(f, 'assenta', q(9) - 4)}
        pOu={mola(f, 'estalo', q(7))}
      />
      {f < final + 8 ? <Legenda palavras={fala} cortes={[3, 6, 9, 11, 13, 16]} destaque={['PROCURA', 'FOGE']} enfase={['PARTE', '4']} /> : null}
      {f >= final ? <TelaParte t={f - final} parte={4} titulo="O BUNKER" fundo={<CenaBunker otavio={null} luz={0.25} p3={{ ...P3, escrita: 1 }} />} fundoFoco={[340, 800]} /> : null}
      <Som q={final + 10} nome="batida" vol={0.6} />
    </AbsoluteFill>
  );
};

const FUSAO_LENTA: EntradaM = { nome: 'fusao-lenta', T: 24, k: 12, criar: () => fusao({ T: 24, k: 12 }), plano: 'fusão lenta, passando pelo escuro' };

const CENAS = montarRoteiro({
  cenasFala: T.CENAS_FALA,
  // cortes secos, com duas fusões lentas: entra e sai da lembrança da caneca seca (4 → 5 e 5 → 6)
  entradas: [null, null, null, null, FUSAO_LENTA, FUSAO_LENTA, null, null, null, null],
  nomes: ['desce', 'minutos', 'lanterna', 'mesinha', 'lembranca', 'quente', 'parede', 'risco', 'escrita', 'final'],
  duracao: DURACAO,
});

/* ------------------------------------------------------------------ a capa */
export const CapaOBunkerP3: React.FC = () => (
  <Capa
    titulo={['O', 'BUNKER']}
    destaque={1}
    parte={3}
    fundo={
      <Mov chaves={[[0, 470, 900, 1.25]]} tremor={0}>
        <CenaBunker otavio={null} luz={0.3} p3={{ ...P3, escrita: 1 }} cones={[cone(mira(340, 800))]} emPe={{ x: 640, y: 1640, escala: 0.9, vista: 'costas', mascara: true }} />
      </Mov>
    }
  />
);

const CapaSolta: React.FC = () => (
  <Fontes>
    <CapaOBunkerP3 />
  </Fontes>
);

const QUADROS_CAPA = 3;

export const OBunkerP3: React.FC = () => (
  <VideoMontado cenas={CENAS} componentes={[C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]} audio={NARRACAO}>
    <Trilha fimVoz={Math.round(T.fimFala * FPS)} duracao={DURACAO} arquivo="trilha-suspense.mp3" />
    <Sequence from={DURACAO} durationInFrames={QUADROS_CAPA} name="capa">
      <CapaOBunkerP3 />
    </Sequence>
  </VideoMontado>
);

export const ComposicaoOBunkerP3: React.FC = () => (
  <>
    <Composition id="OBunker-P3" component={OBunkerP3} durationInFrames={DURACAO + QUADROS_CAPA} fps={FPS} width={1080} height={1920} />
    <Composition id="OBunker-P3-Capa" component={CapaSolta} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
