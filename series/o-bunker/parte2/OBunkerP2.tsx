/* =====================================================================================
   videos/o-bunker/parte2: "O Bunker", parte 2 (caminho SAI). Roteiro e briefing: roteiro.md, briefing.md.
   Tempos sem narração (ritmo de leitura): node scripts/tempos-de-texto.mjs --ritmo=1.1 "<as 10 frases em
   MAIÚSCULAS, separadas por |>" > src/videos/o-bunker/parte2/tempos.json
   Com a voz do dono: CLAUDE.md (seção Voz): loudnorm -16 LUFS → transcrição do ElevenLabs → alinhar.py.
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
import { Camera } from '../../../visual';
import { CenaCozinha, CenaSai } from '../lembranca';
import { Otavio } from '../personagens';
import { Mov } from './camera';
import { CenaQuintalTarde, CenaRuaVazia, CenaSala, CenaTVData, LARANJA, TV_SALA } from './cenarios';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
const DURACAO = Math.round((T.fimFala + 3.5) * FPS);
/** a narração do dono (null = ainda sem voz, ritmo de leitura) */
const NARRACAO: string | null = 'narracao-o-bunker-p2.mp3';

const usePalavra = (n: number) => {
  const c = useCenaM();
  const fala = T.falaDaCena(n);
  return { c, f: c.frame, fala, q: (i: number) => c.local(fala[i].s), qFim: (i: number) => c.local(fala[i].e) };
};

const Anda: React.FC<{ zoom: [number, number]; origem: [number, number]; children: React.ReactNode }> = ({ zoom, origem, children }) => {
  const c = useCenaM();
  return (
    <Camera zoom={zoom} janela={[0, c.seqDuracao]} origem={origem} deriva={3} giro={0.12}>
      {children}
    </Camera>
  );
};

/* 1. "Pela primeira vez em cinco anos, o Otávio abriu a escotilha." (começa colado nas costas dele na escada;
      em "abriu" a câmera sobe junto com a luz até o buraco da escotilha) */
const C1: React.FC = () => {
  const { c, f, fala, q } = usePalavra(1);
  const abre = janelaM(f, q(8) - 4, q(9) + 6, 'suave');
  const sobe = janelaM(f, 0, c.seqDuracao, 'suave');
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 1450, 1.55], [q(7), 540, 1250, 1.4], [q(9) + 10, 540, 640, 1.15], [c.seqDuracao, 540, 600, 1.2]]}>
        <CenaSai tom={LARANJA}>
          <Otavio x={540} y={lerp(2200, 1960, sobe)} escala={1.25} vista="costas" cima={1} respira passo={f * 0.5} />
        </CenaSai>
      </Mov>
      <AbsoluteFill style={{ background: `rgba(14,8,10,${0.72 * (1 - abre)})` }} />
      <Som q={q(8) - 4} nome="rangido" vol={0.73} />
      <Legenda palavras={fala} cortes={[3, 6, 8]} destaque={['ESCOTILHA']} enfase={['CINCO', 'ANOS', 'OTÁVIO']} />
    </AbsoluteFill>
  );
};

/* 2. "Lá fora, não tinha névoa nenhuma." (colado na borda da escotilha enquanto a cabeça sai; em "névoa" a
      câmera abre e mostra o céu limpo) */
const C2: React.FC = () => {
  const { c, f, fala, q } = usePalavra(2);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 1220, 1.7], [q(3), 540, 1150, 1.45], [c.seqDuracao, 540, 900, 1.0]]}>
        <CenaQuintalTarde fundo="cerca" cabeca={lerp(0.25, 1, janelaM(f, 0, c.seqDuracao * 0.55, 'suave'))} />
      </Mov>
      <Som q={0} nome="vento" vol={1.68} />
      <Legenda palavras={fala} cortes={[2, 4]} destaque={['NENHUMA']} enfase={['NÉVOA']} />
    </AbsoluteFill>
  );
};

/* 3. "Ele pôs a máscara velha e atravessou o quintal tomado de mato." (close no rosto pondo a máscara; depois a
      câmera vai atrás dele pelo mato até a casa) */
const C3: React.FC = () => {
  const { c, f, fala, q } = usePalavra(3);
  const anda = janelaM(f, q(4), q(11) + 6, 'suave');
  const ox = lerp(600, 540, anda);
  const oy = lerp(1980, 1180, anda);
  const oz = lerp(1.15, 0.55, anda);
  const passos: number[] = [];
  for (let k = q(4); k < q(11); k += 15) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 600, 1050, 1.5], [q(4), 600, 1150, 1.35], [c.seqDuracao, 540, 900, 1.1]]} tremor={5}>
        <CenaQuintalTarde fundo="casa" otavio={{ x: ox, y: oy, escala: oz, passo: f >= q(4) ? f : null, mascara: f >= q(3), vista: f < q(4) ? 'frente' : 'costas', expressao: 'desconfiada' }} />
      </Mov>
      {passos.map((k) => (
        <Som key={k} q={k} nome="mato" vol={1.6} />
      ))}
      <Legenda palavras={fala} cortes={[3, 5, 8, 10]} destaque={['MATO']} enfase={['MÁSCARA', 'QUINTAL']} />
    </AbsoluteFill>
  );
};

/* 4. "A cerca tinha caído, e a rua estava vazia." (a câmera corre pelas tábuas caídas e sobe pra rua vazia) */
const C4: React.FC = () => {
  const { c, fala, q } = usePalavra(4);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 330, 1290, 1.6], [q(4), 640, 1260, 1.5], [q(7), 540, 980, 1.25], [c.seqDuracao, 760, 900, 1.35]]}>
        <CenaRuaVazia />
      </Mov>
      <Som q={0} nome="vento" vol={1.68} />
      <Legenda palavras={fala} cortes={[4, 7]} destaque={['VAZIA']} enfase={['CERCA', 'RUA']} />
    </AbsoluteFill>
  );
};

/* 5. "Dentro de casa, a caneca de café ainda estava na mesa." (a cozinha inteira; em "caneca" a câmera vai até ela) */
const C5: React.FC = () => {
  const { c, fala, q } = usePalavra(5);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 900, 1.0], [q(4), 480, 1000, 1.25], [q(6) + 6, 400, 1075, 2.1], [c.seqDuracao, 400, 1060, 2.25]]}>
        <CenaCozinha otavio={false} seca />
      </Mov>
      <Legenda palavras={fala} cortes={[3, 6, 8]} destaque={['CANECA']} enfase={['CAFÉ', 'MESA']} />
    </AbsoluteFill>
  );
};

/* 6. "E a TV continuava ligada, com o mesmo aviso vermelho." (a TV; no fim, a câmera desce rápido até o
      controle remoto limpo no sofá: a pista) */
const C6: React.FC = () => {
  const { c, fala, qFim } = usePalavra(6);
  const pista = qFim(9);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, TV_SALA.x + 200, TV_SALA.y + 150, 1.6], [pista - 12, TV_SALA.x + 200, TV_SALA.y + 160, 1.8], [pista + 6, 178, 1495, 2.6], [c.seqDuracao, 178, 1495, 2.75]]} curva="rapida">
        <CenaSala aviso="antigo" />
      </Mov>
      <Som q={0} nome="chiado" vol={2.18} />
      <Som q={pista - 2} nome="estalo" vol={0.8} />
      <Legenda palavras={fala} cortes={[3, 5, 8]} destaque={['LIGADA']} enfase={['TV', 'AVISO']} />
    </AbsoluteFill>
  );
};

/** onde ele para na frente da TV */
const PARADO = { x: 690, y: 1500, escala: 0.82 };

/* 7. "Ele chegou perto, devagar, e leu a data na tela." (a câmera vai por cima do ombro dele até a TV) */
const C7: React.FC = () => {
  const { c, f, fala } = usePalavra(7);
  const anda = janelaM(f, 0, c.seqDuracao * 0.85, 'suave');
  const passos: number[] = [];
  for (let k = 4; k < c.seqDuracao * 0.85; k += 22) passos.push(k);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 560, 1250, 1.15], [c.seqDuracao, TV_SALA.x + 230, TV_SALA.y + 200, 1.6]]} tremor={4}>
        <CenaSala aviso="antigo" otavio={{ x: lerp(560, PARADO.x, anda), y: lerp(1980, PARADO.y, anda), escala: lerp(1.2, PARADO.escala, anda), passo: anda < 1 ? f * 0.7 : null }} />
      </Mov>
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Legenda palavras={fala} cortes={[3, 4, 7]} destaque={['DATA']} enfase={['DEVAGAR']} />
    </AbsoluteFill>
  );
};

/* 8. "Era aquela terça. A TV nunca tinha desligado." (a câmera fecha na data; em "nunca" volta pros olhos dele) */
const C8: React.FC = () => {
  const { c, f, fala, q } = usePalavra(8);
  return (
    <AbsoluteFill>
      <Mov chaves={[[0, 540, 960, 1.0], [q(2) + 4, 230, 570, 2.1], [q(5) - 4, 240, 580, 2.15], [q(5) + 12, 300, 1025, 1.6], [c.seqDuracao, 300, 1035, 1.68]]}>
        <CenaTVData expressao={f >= q(5) ? 'desconfiada' : 'preocupada'} />
      </Mov>
      <Legenda palavras={fala} cortes={[3, 5]} destaque={['TERÇA']} enfase={['NUNCA', 'TV']} />
    </AbsoluteFill>
  );
};

/* 9. "Aí, na frente dele, o aviso mudou pela primeira vez: 'Otávio, volta pro bunker.'" (aproxima devagar; quando
      o nome aparece, a câmera dá um soco rápido na tela; ele recua) */
const C9: React.FC = () => {
  const { c, f, fala, q } = usePalavra(9);
  const muda = q(6) - 2;
  const novo = q(10) - 2;
  const aviso = f < muda ? 'antigo' : f < novo ? 'pisca' : 'novo';
  let palavras = 0;
  for (let k = 0; k < 4; k++) if (f >= q(10 + k) - 2) palavras = k + 1;
  const recua = mola(f, 'assenta', novo);
  const tremeTv = f >= muda && f < novo ? Math.sin(f * 2.3) * 6 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${tremeTv}px, 0)` }}>
        <Mov chaves={[[0, 560, 1150, 1.2], [novo - 6, 470, 1000, 1.45], [novo + 8, TV_SALA.x + 200, TV_SALA.y + 140, 2.3], [c.seqDuracao, TV_SALA.x + 200, TV_SALA.y + 140, 2.45]]} curva="rapida">
          <CenaSala
            aviso={aviso}
            palavras={palavras}
            otavio={{ x: PARADO.x + recua * 10, y: PARADO.y + recua * 50, escala: PARADO.escala + recua * 0.05, passo: null, expressao: f >= novo ? 'choque' : 'preocupada' }}
          />
        </Mov>
      </AbsoluteFill>
      <Som q={muda} nome="estalo" vol={1.82} />
      <Legenda palavras={fala} cortes={[4, 7, 10, 12]} destaque={['OTÁVIO']} enfase={['AVISO', 'BUNKER']} foco={[10, 11, 12, 13]} />
    </AbsoluteFill>
  );
};

/* 10. "Ele obedece ou desliga a TV? Comenta VOLTA ou DESLIGA. Segue pra ver a parte 3." → PARTE 3 EM BREVE */
const C10: React.FC = () => {
  const { f, fala, q, qFim } = usePalavra(10);
  const final = qFim(14) + 6;
  return (
    <AbsoluteFill>
      <CartaoEscolha
        a={{ rotulo: 'VOLTA', cena: <CenaQuintalTarde fundo="casa" anoitecer={1} />, zoom: 0.62, foco: [540, 1200] }}
        b={{ rotulo: 'DESLIGA', cena: <CenaSala aviso="novo" />, zoom: 0.72, foco: [TV_SALA.x + 220, TV_SALA.y + 160] }}
        pA={mola(f, 'assenta', 0)}
        pB={mola(f, 'assenta', q(3) - 2)}
        pOu={mola(f, 'estalo', q(2))}
      />
      {f < final + 8 ? <Legenda palavras={fala} cortes={[3, 6, 8, 10, 13]} destaque={['VOLTA', 'DESLIGA']} enfase={['PARTE', '3']} /> : null}
      {f >= final ? <TelaParte t={f - final} parte={3} titulo="O BUNKER" fundo={<CenaSala aviso="novo" />} fundoFoco={[TV_SALA.x + 200, TV_SALA.y + 150]} /> : null}
      <Som q={final + 10} nome="batida" vol={0.6} />
    </AbsoluteFill>
  );
};

const FUSAO_LENTA: EntradaM = { nome: 'fusao-lenta', T: 24, k: 12, criar: () => fusao({ T: 24, k: 12 }), plano: 'fusão lenta, passando pelo escuro' };

const CENAS = montarRoteiro({
  cenasFala: T.CENAS_FALA,
  // cortes secos, com duas fusões lentas: 1 → 2 (de dentro pra fora) e 7 → 8 (do Otávio pra tela)
  entradas: [null, FUSAO_LENTA, null, null, null, null, null, FUSAO_LENTA, null, null],
  nomes: ['escotilha', 'fora', 'mato', 'rua', 'caneca', 'tv', 'chega', 'data', 'aviso', 'final'],
  duracao: DURACAO,
});

/* ------------------------------------------------------------------ a capa */
export const CapaOBunkerP2: React.FC = () => (
  <Capa
    titulo={['O', 'BUNKER']}
    destaque={1}
    parte={2}
    fundo={<CenaSala aviso="novo" otavio={{ x: 800, y: 1660, escala: 0.95, passo: null }} />}
  />
);

const CapaSolta: React.FC = () => (
  <Fontes>
    <CapaOBunkerP2 />
  </Fontes>
);

const QUADROS_CAPA = 3;

export const OBunkerP2: React.FC = () => (
  <VideoMontado cenas={CENAS} componentes={[C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]} audio={NARRACAO}>
    <Trilha fimVoz={Math.round(T.fimFala * FPS)} duracao={DURACAO} arquivo="trilha-suspense.mp3" />
    <Sequence from={DURACAO} durationInFrames={QUADROS_CAPA} name="capa">
      <CapaOBunkerP2 />
    </Sequence>
  </VideoMontado>
);

export const ComposicaoOBunkerP2: React.FC = () => (
  <>
    <Composition id="OBunker-P2" component={OBunkerP2} durationInFrames={DURACAO + QUADROS_CAPA} fps={FPS} width={1080} height={1920} />
    <Composition id="OBunker-P2-Capa" component={CapaSolta} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
