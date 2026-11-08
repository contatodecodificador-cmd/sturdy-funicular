/* =====================================================================================
   videos/o-bunker/parte4: "O Bunker", parte 4 (caminho PROCURA): o túnel. Parte longa (~65 s, 18 cenas):
   2 frases de resumo do episódio anterior + 16 frases. Roteiro e caminhos: roteiro.md, caminhos.md.
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition, random, Sequence } from 'remotion';
import { Fontes } from '../../../base/Fontes';
import { useCenaM, type EntradaM } from '../../../cena';
import { Capa } from '../../../kit/capa';
import { CartaoEscolha, TelaParte } from '../../../kit/final';
import { Legenda } from '../../../kit/pecas';
import { Som, Trilha } from '../../../kit/som';
import { montarRoteiro, VideoMontado } from '../../../montagem';
import { clamp01, FONTEM, janelaM, lerp } from '../../../tema';
import { mola } from '../../../tema';
import { criarTempos, type TemposJson } from '../../../tempos';
import { fusao } from '../../../transicoes/fusao';
import { CenaBunker } from '../cenarios';
import { Torre } from '../pecas';
import { Otavio } from '../personagens';
import { Mov } from '../parte2/camera';
import { CenaSalaTelas, CenaTunel, TELA } from './cenarios';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
const DURACAO = Math.round((T.fimFala + 3.5) * FPS);
const NARRACAO = 'narracao-o-bunker-p4.mp3';

const usePalavra = (n: number) => {
  const c = useCenaM();
  const fala = T.falaDaCena(n);
  return { c, f: c.frame, fala, q: (i: number) => c.local(fala[i].s), qFim: (i: number) => c.local(fala[i].e) };
};

const MAO = { x: 560, y: 1240 };
const cone = (x: number, y: number, forca = 0.95) => ({ x: MAO.x, y: MAO.y, angulo: (Math.atan2(y - MAO.y, x - MAO.x) * 180) / Math.PI, abertura: 30, alcance: 1100, forca });
const CANECA = { x: 653, y: 1065 };
const P3 = { caneca: true, riscoNovo: 1, escrita: 1, pegadas: 'fortes' as const };

/** o selo do resumo, no alto da tela */
const SeloAnterior: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(10,6,7,0.75)', padding: '14px 28px', borderRadius: 14, fontFamily: FONTEM.mono, fontWeight: 700, fontSize: 30, letterSpacing: '0.12em', color: '#F5EFEA' }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: '#E0182D' }} />
      NO EPISÓDIO ANTERIOR
    </div>
  </div>
);

/** o que a CAM 07 mostra: o bunker dele, visto da câmera do canto do teto */
const Cam7: React.FC<{ alguem?: 'nao' | 'costas' | 'frente' }> = ({ alguem = 'nao' }) => {
  const s = 0.354;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(0px, ${-560 * s}px) scale(${s})` }}>
      <CenaBunker giro={20} luz={0.6} p3={P3} p4={{ abre: 0, camera: false }} otavio={alguem === 'nao' ? null : { costas: alguem === 'costas', sombra: alguem === 'frente', expressao: 'neutra' }} />
    </div>
  );
};

/* R1. "Antes: alguém entrou no bunker do Otávio enquanto ele estava fora." */
const C1: React.FC = () => {
  const { c, fala } = usePalavra(1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.6)' }}>
        <Mov chaves={[[0, CANECA.x, CANECA.y - 30, 3.4], [c.seqDuracao, CANECA.x - 40, CANECA.y - 20, 2.8]]}>
          <CenaBunker otavio={null} luz={0.25} p3={P3} cones={[cone(CANECA.x, CANECA.y)]} />
        </Mov>
      </AbsoluteFill>
      <SeloAnterior />
      <Legenda palavras={fala} cortes={[3, 7, 9]} destaque={['ALGUÉM']} enfase={['BUNKER', 'OTÁVIO']} />
    </AbsoluteFill>
  );
};

/* R2. "Deixou a caneca quente, um risco novo e um recado: 'falta pouco'." (cortes rápidos: caneca, risco, escrita) */
const C2: React.FC = () => {
  const { c, fala, q } = usePalavra(2);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.6)' }}>
        <Mov
          chaves={[[0, CANECA.x, CANECA.y - 30, 3.2], [q(4) - 3, CANECA.x, CANECA.y - 30, 3.3], [q(4) + 3, 478, 770, 3.6], [q(9) - 3, 478, 770, 3.7], [q(9) + 3, 335, 815, 3.4], [c.seqDuracao, 335, 815, 3.6]]}
          curva="rapida"
          tremor={2}
        >
          <CenaBunker otavio={null} luz={0.25} p3={P3} cones={[cone(420, 800)]} />
        </Mov>
      </AbsoluteFill>
      <SeloAnterior />
      <Legenda palavras={fala} cortes={[4, 7, 10]} destaque={['FALTA', 'POUCO']} enfase={['CANECA', 'RISCO']} foco={[10, 11]} />
    </AbsoluteFill>
  );
};

/* 1. "O Otávio empurrou a prateleira de latas." (a estante desliza e revela o escuro atrás) */
const C3: React.FC = () => {
  const { c, f, fala, q } = usePalavra(3);
  const abre = janelaM(f, q(2), c.seqDuracao, 'suave');
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 420, 1150, 1.5], [c.seqDuracao, 380, 1080, 1.75]]} tremor={4}>
        <CenaBunker otavio={null} luz={0.3} p3={P3} p4={{ abre, camera: true }} cones={[cone(330, 1000)]} emPe={{ x: 340 + abre * 230, y: 1560, escala: 0.82, vista: 'costas', mascara: true }} />
      </Mov>
      <Som q={q(2)} nome="rangido" vol={0.73} />
      <Legenda palavras={fala} cortes={[2, 4]} destaque={['PRATELEIRA']} enfase={['OTÁVIO']} />
    </AbsoluteFill>
  );
};

/* 2. "Atrás dela, tinha uma passagem que ele nunca construiu." (a câmera entra na passagem) */
const C4: React.FC = () => {
  const { c, fala } = usePalavra(4);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 380, 1060, 1.4], [c.seqDuracao, 325, 1030, 2.7]]}>
        <CenaBunker otavio={null} luz={0.3} p3={P3} p4={{ abre: 1, camera: true }} cones={[cone(325, 1030)]} />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 5, 7]} destaque={['PASSAGEM']} enfase={['NUNCA']} />
    </AbsoluteFill>
  );
};

/* 3. "No chão, pegadas de terra molhada. Não eram dele. E entravam ali." (close nas pegadas, seguindo até a passagem) */
const C5: React.FC = () => {
  const { c, f, fala, q } = usePalavra(5);
  const alvo = lerp(0, 1, janelaM(f, 0, c.seqDuracao, 'suave'));
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 1400, 2.6], [q(6), 460, 1320, 2.5], [q(9), 380, 1240, 2.3], [c.seqDuracao, 330, 1120, 2.1]]}>
        <CenaBunker
          otavio={null}
          luz={0.3}
          p3={P3}
          p4={{ abre: 1, camera: true }}
          cones={[{ x: 640, y: 900, angulo: (Math.atan2(lerp(1420, 1180, alvo) - 900, lerp(540, 330, alvo) - 640) * 180) / Math.PI, abertura: 34, alcance: 1000, forca: 0.98 }]}
        />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 6, 9]} destaque={['PEGADAS']} enfase={['MOLHADA', 'DELE']} />
    </AbsoluteFill>
  );
};

/* 4. "Ele desceu, com a lanterna tremendo na mão." (dentro do túnel; a lanterna treme) */
const C6: React.FC = () => {
  const { c, f, fala } = usePalavra(6);
  const passos: number[] = [];
  for (let k = 3; k < c.seqDuracao; k += 14) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 900, 1.15], [c.seqDuracao, 540, 880, 1.25]]} tremor={6}>
        <CenaTunel avanca={lerp(0, 0.2, clamp01(f / c.seqDuracao))} />
      </Mov>
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Legenda palavras={fala} cortes={[2, 5]} destaque={['TREMENDO']} enfase={['LANTERNA']} />
    </AbsoluteFill>
  );
};

/* 5. "O túnel era estreito, cavado na terra, e cheirava a café." (a câmera avança pelo túnel) */
const C7: React.FC = () => {
  const { c, f, fala } = usePalavra(7);
  const passos: number[] = [];
  for (let k = 3; k < c.seqDuracao; k += 16) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 880, 1.25], [c.seqDuracao, 540, 860, 1.4]]} tremor={5}>
        <CenaTunel avanca={lerp(0.2, 0.5, clamp01(f / c.seqDuracao))} />
      </Mov>
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Legenda palavras={fala} cortes={[4, 7, 9]} destaque={['CAFÉ']} enfase={['TÚNEL']} />
    </AbsoluteFill>
  );
};

/* 6. "Nas paredes, tinha risquinhos. Centenas. Iguais aos dele." (a lanterna vai pra parede; close nos risquinhos) */
const C8: React.FC = () => {
  const { c, fala, q } = usePalavra(8);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 960, 1.2], [q(3), 260, 900, 1.9], [c.seqDuracao, 220, 860, 2.2]]} tremor={4}>
        <CenaTunel avanca={0.5} treme={false} />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 4, 5]} destaque={['CENTENAS']} enfase={['RISQUINHOS']} />
    </AbsoluteFill>
  );
};

/* 7. "Ele não era o único contando os dias." (a câmera recua e mostra o túnel inteiro riscado) */
const C9: React.FC = () => {
  const { c, fala } = usePalavra(9);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 220, 860, 2.2], [c.seqDuracao, 540, 960, 1.0]]}>
        <CenaTunel avanca={0.5} treme={false} />
      </Mov>
      <Legenda palavras={fala} cortes={[4, 6]} destaque={['ÚNICO']} enfase={['DIAS']} />
    </AbsoluteFill>
  );
};

/* 8. "No fim do túnel, uma grade. E uma luz vermelha piscando." */
const C10: React.FC = () => {
  const { c, f, fala, q } = usePalavra(10);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 880, 1.0], [c.seqDuracao, 540, 860, 1.6]]} tremor={4}>
        <CenaTunel avanca={lerp(0.5, 0.95, clamp01(f / c.seqDuracao))} fim={janelaM(f, q(4) - 8, q(5) + 4, 'suave')} />
      </Mov>
      <Legenda palavras={fala} cortes={[4, 6, 9]} destaque={['GRADE']} enfase={['LUZ', 'VERMELHA']} />
    </AbsoluteFill>
  );
};

/* 9. "Do outro lado, uma sala cheia de telas." (pela grade, a parede de telas) */
const C11: React.FC = () => {
  const { c, fala } = usePalavra(11);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 900, 1.15], [c.seqDuracao, 540, 880, 1.35]]}>
        <CenaSalaTelas grade={1} />
      </Mov>
      <Som q={0} nome="chiado" vol={1.5} />
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['TELAS']} enfase={['SALA']} />
    </AbsoluteFill>
  );
};

const centro = (n: number): [number, number] => {
  const t = TELA(n);
  return [t.x + t.w / 2, t.y + t.h / 2];
};

/* 10. "Cada tela mostrava um quintal do bairro. E um bunker." (panorâmica pelas telas) */
const C12: React.FC = () => {
  const { c, fala, q } = usePalavra(12);
  const [x2, y2] = centro(2);
  const [x5, y5] = centro(5);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, x2, y2, 2.4], [q(7), x2 + 120, y2 + 120, 2.3], [c.seqDuracao, x5, y5, 2.6]]}>
        <CenaSalaTelas grade={0} />
      </Mov>
      <Legenda palavras={fala} cortes={[3, 7]} destaque={['BUNKER']} enfase={['QUINTAL', 'BAIRRO']} />
    </AbsoluteFill>
  );
};

/* 11. "Em todos, tinha alguém lá embaixo. Esperando o sinal verde." (as telas de bunker, cada uma com alguém) */
const C13: React.FC = () => {
  const { c, fala } = usePalavra(13);
  const [x3, y3] = centro(3);
  const [x9, y9] = centro(9);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, x3, y3, 3.0], [c.seqDuracao * 0.5, x9, y9, 2.8], [c.seqDuracao, 540, 900, 1.3]]} curva="suave">
        <CenaSalaTelas />
      </Mov>
      <Legenda palavras={fala} cortes={[2, 6, 8]} destaque={['ALGUÉM']} enfase={['SINAL', 'VERDE']} />
    </AbsoluteFill>
  );
};

/* 12. "Na tela sete, ele reconheceu a cama de campanha. Era o bunker dele." (a câmera vai até a CAM 07) */
const C14: React.FC = () => {
  const { c, fala, q } = usePalavra(14);
  const [x7, y7] = centro(7);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 900, 1.3], [q(3), x7, y7, 2.6], [c.seqDuracao, x7, y7, 3.6]]} curva="suave">
        <CenaSalaTelas cam7={<Cam7 alguem="nao" />} />
      </Mov>
      <Legenda palavras={fala} cortes={[3, 6, 9]} destaque={['DELE']} enfase={['SETE']} />
    </AbsoluteFill>
  );
};

/* 13. "E tinha alguém sentado nela. De gorro mostarda." (a imagem falha e alguém aparece na cama, de costas) */
const C15: React.FC = () => {
  const { c, f, fala, q } = usePalavra(15);
  const [x7, y7] = centro(7);
  const aparece = q(2) - 2;
  const falha = f >= aparece - 4 && f < aparece + 3;
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, x7, y7, 3.7], [c.seqDuracao, x7, y7 + 10, 4.1]]} tremor={2}>
        <CenaSalaTelas cam7={falha ? null : <Cam7 alguem={f >= aparece ? 'costas' : 'nao'} />} />
      </Mov>
      {falha ? <AbsoluteFill style={{ background: `rgba(245,239,234,${0.15 + random(`f15-${f}`) * 0.25})`, mixBlendMode: 'screen' }} /> : null}
      <Som q={aparece - 4} nome="estalo" vol={1.2} />
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['GORRO']} enfase={['ALGUÉM', 'MOSTARDA']} />
    </AbsoluteFill>
  );
};

/* 14. "A pessoa virou devagar... e olhou direto pra câmera." (vira; o rosto na sombra, só os olhos; soco; a tela apaga) */
const C16: React.FC = () => {
  const { c, f, fala, q, qFim } = usePalavra(16);
  const [x7, y7] = centro(7);
  const vira = q(3);
  const apaga = qFim(8) + 4;
  const falhando = f >= apaga - 8 && f < apaga;
  return (
    <AbsoluteFill>
      {f < apaga ? (
        <Mov chaves={[[0, x7, y7, 4.1], [q(6), x7 - 40, y7 - 10, 4.3], [q(6) + 8, x7 - 60, y7 - 20, 6.2], [c.seqDuracao, x7 - 60, y7 - 20, 6.4]]} curva="rapida" tremor={2}>
          <CenaSalaTelas cam7={falhando && random(`f16-${f}`) > 0.5 ? null : <Cam7 alguem={f >= vira ? 'frente' : 'costas'} />} />
        </Mov>
      ) : (
        <AbsoluteFill style={{ background: '#050304' }} />
      )}
      {falhando ? <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, rgba(245,239,234,0.25) 0px, rgba(245,239,234,0.25) 3px, transparent 3px, transparent 9px)`, transform: `translateY(${(f % 6) * 4}px)` }} /> : null}
      <Som q={apaga - 8} nome="estalo" vol={1.82} />
      <Legenda palavras={fala} cortes={[4, 7]} destaque={['CÂMERA']} enfase={['DEVAGAR']} foco={[0, 1, 2, 3]} />
    </AbsoluteFill>
  );
};

/* 15. "Aí, atrás do Otávio, uma voz sussurrou: 'Falta pouco.'" (a sala escura, o rosto dele; atrás, a luz do
       microfone acende) */
const C17: React.FC = () => {
  const { c, f, fala, q } = usePalavra(17);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 1000, 1.25], [q(7), 540, 960, 1.45], [c.seqDuracao, 540, 950, 1.6]]} tremor={3}>
        <CenaSalaTelas apagadas luzMic={f >= q(7) - 2 ? 1 : 0} />
        <Otavio x={540} y={2300} escala={1.6} mascara expressao={f >= q(7) ? 'assustada' : 'preocupada'} olhar={f >= q(7) ? -0.8 : 0} />
      </Mov>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 540px 980px, rgba(0,0,0,0) 0%, rgba(5,3,4,0.7) 70%)' }} />
      <Som q={q(6)} nome="respira" vol={2.07} />
      <Legenda palavras={fala} cortes={[4, 7]} destaque={['FALTA', 'POUCO']} enfase={['OTÁVIO']} foco={[7, 8]} />
    </AbsoluteFill>
  );
};

/** a torre de noite (o cartão SOBE) */
const TorreNoite: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0E0A16 0%, #1E1426 60%, #2A1A24 100%)' }}>
    <Torre x={250} y={400} escala={1.4} luz={1} cor="#1A1218" />
  </AbsoluteFill>
);

/* 16. "Ele sobe a torre ou volta pro bunker? Comenta SOBE ou VOLTA. Segue pra ver a parte 5." */
const C18: React.FC = () => {
  const { f, fala, q, qFim } = usePalavra(18);
  const final = qFim(16) + 6;
  return (
    <AbsoluteFill>
      <CartaoEscolha
        a={{ rotulo: 'SOBE', cena: <TorreNoite />, zoom: 0.6, foco: [500, 900] }}
        b={{ rotulo: 'VOLTA', cena: <CenaTunel avanca={0.3} treme={false} />, zoom: 0.62, foco: [540, 900] }}
        pA={mola(f, 'assenta', 0)}
        pB={mola(f, 'assenta', q(5) - 4)}
        pOu={mola(f, 'estalo', q(4))}
      />
      {f < final + 8 ? <Legenda palavras={fala} cortes={[3, 5, 8, 10, 12, 15]} destaque={['SOBE', 'VOLTA']} enfase={['PARTE', '5']} /> : null}
      {f >= final ? <TelaParte t={f - final} parte={5} titulo="O BUNKER" fundo={<CenaSalaTelas />} fundoFoco={[540, 900]} /> : null}
      <Som q={final + 10} nome="batida" vol={0.6} />
    </AbsoluteFill>
  );
};

const FUSAO_LENTA: EntradaM = { nome: 'fusao-lenta', T: 24, k: 12, criar: () => fusao({ T: 24, k: 12 }), plano: 'fusão lenta, passando pelo escuro' };

const CENAS = montarRoteiro({
  cenasFala: T.CENAS_FALA,
  // cortes secos, com duas fusões lentas: da passagem pro túnel (5 → 6) e da grade pra sala (10 → 11)
  entradas: [null, null, null, null, null, FUSAO_LENTA, null, null, null, null, FUSAO_LENTA, null, null, null, null, null, null, null],
  nomes: ['resumo1', 'resumo2', 'estante', 'passagem', 'pegadas', 'desce', 'tunel', 'paredes', 'unico', 'grade', 'sala', 'telas', 'todos', 'cam7', 'alguem', 'olhou', 'atras', 'final'],
  duracao: DURACAO,
});

/* ------------------------------------------------------------------ a capa */
export const CapaOBunkerP4: React.FC = () => {
  const [x7, y7] = centro(7);
  const z = 2.2;
  return (
    <Capa
      titulo={['O', 'BUNKER']}
      destaque={1}
      parte={4}
      fundo={
        <AbsoluteFill style={{ transformOrigin: '0 0', transform: `translate(${540 - (x7 + 120) * z}px, ${700 - y7 * z}px) scale(${z})` }}>
          <CenaSalaTelas cam7={<Cam7 alguem="frente" />} />
        </AbsoluteFill>
      }
    />
  );
};

const CapaSolta: React.FC = () => (
  <Fontes>
    <CapaOBunkerP4 />
  </Fontes>
);

const QUADROS_CAPA = 3;

export const OBunkerP4: React.FC = () => (
  <VideoMontado
    cenas={CENAS}
    componentes={[C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14, C15, C16, C17, C18]}
    audio={NARRACAO}
  >
    <Trilha fimVoz={Math.round(T.fimFala * FPS)} duracao={DURACAO} arquivo="trilha-suspense.mp3" />
    <Sequence from={DURACAO} durationInFrames={QUADROS_CAPA} name="capa">
      <CapaOBunkerP4 />
    </Sequence>
  </VideoMontado>
);

export const ComposicaoOBunkerP4: React.FC = () => (
  <>
    <Composition id="OBunker-P4" component={OBunkerP4} durationInFrames={DURACAO + QUADROS_CAPA} fps={FPS} width={1080} height={1920} />
    <Composition id="OBunker-P4-Capa" component={CapaSolta} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
