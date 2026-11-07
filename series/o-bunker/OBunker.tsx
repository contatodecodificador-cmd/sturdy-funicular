/* =====================================================================================
   videos/o-bunker: "O Bunker", parte 1 (Reels/TikTok 1080x1920, 10 cenas).
   Roteiro, briefing e folhas de design aprovados: roteiro.md, briefing.md, Design.tsx.

   Cada cena é uma frase; tudo que acontece nela é preso a uma palavra: q(i) = quadro em que a
   palavra i da cena começa a ser dita (qFim(i), em que termina).

   Tempos sem narração (ritmo de leitura):
     node scripts/tempos-de-texto.mjs --ritmo=1.1 "FAZ CINCO ANOS QUE O OTÁVIO NÃO SAI DO BUNKER DO QUINTAL. | ATÉ AQUELA TERÇA, OS VIZINHOS ACHAVAM O BUNKER UM EXAGERO. | ÀS SETE DA MANHÃ, ELE TOMAVA CAFÉ QUANDO A TV FICOU VERMELHA. | UMA SIRENE E UMA FRASE SÓ: \"FIQUEM EM CASA. NÃO RESPIREM A NÉVOA.\" | PELA JANELA, UMA NÉVOA VERMELHA DESCIA A RUA. | ELE LARGOU O CAFÉ, CORREU PRO QUINTAL E SE TRANCOU. | DESDE ENTÃO, TODA NOITE, O RÁDIO REPETE O MESMO AVISO. | HOJE, O FILTRO DE AR COMEÇOU A FALHAR. | ELE TEM AR PRA TRÊS DIAS. E O SINAL VERDE... NUNCA VEIO. | ELE SAI OU FICA? COMENTA SAI OU FICA. SEGUE PRA VER A PARTE 2." > src/videos/o-bunker/tempos.json
   Com narração: o passo a passo do CLAUDE.md da raiz (palavras.py → alinhar.py → audio="narracao-o-bunker.mp3").
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition, random, Sequence } from 'remotion';
import { Fontes } from '../../base/Fontes';
import { Camera } from '../../visual';
import { useCenaM, type EntradaM } from '../../cena';
import { Capa } from '../../kit/capa';
import { CartaoEscolha, TelaParte } from '../../kit/final';
import { COR, Legenda } from '../../kit/pecas';
import { Som, Trilha } from '../../kit/som';
import { montarRoteiro, VideoMontado } from '../../montagem';
import { clamp01, janelaM, lerp, mola } from '../../tema';
import { criarTempos, type TemposJson } from '../../tempos';
import { fusao } from '../../transicoes/fusao';
import { BUNKER, CenaBunker } from './cenarios';
import { CenaCozinha, CenaFica, CenaQuintal, CenaRua, CenaSai, CenaTV, FundoCapa } from './lembranca';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
/** fim da fala + 3,5 s pra tela final (PARTE 2 EM BREVE) */
const DURACAO = Math.round((T.fimFala + 3.5) * FPS);
/** a narração (null = ainda sem voz, ritmo de leitura) */
const NARRACAO: string | null = 'narracao-o-bunker.mp3';

const usePalavra = (n: number) => {
  const c = useCenaM();
  const fala = T.falaDaCena(n);
  return { c, f: c.frame, fala, q: (i: number) => c.local(fala[i].s), qFim: (i: number) => c.local(fala[i].e) };
};

/** câmera que anda devagar pra frente durante a cena inteira */
const Anda: React.FC<{ zoom: [number, number]; origem: [number, number]; children: React.ReactNode }> = ({ zoom, origem, children }) => {
  const c = useCenaM();
  return (
    <Camera zoom={zoom} janela={[0, c.seqDuracao]} origem={origem} deriva={3} giro={0.12}>
      {children}
    </Camera>
  );
};

/* 1. "Faz cinco anos que o Otávio não sai do bunker do quintal." (o bunker na luz vermelha; a câmera
      anda devagar até a parede dos risquinhos) */
const C1: React.FC = () => {
  const { f, fala } = usePalavra(1);
  return (
    <AbsoluteFill>
      <Anda zoom={[1, 1.12]} origem={[BUNKER.riscos.x + 140, BUNKER.riscos.y + 160]}>
        <CenaBunker giro={f * 9} otavio={{ expressao: 'cansada', olhar: 0.6 }} />
      </Anda>
      <Legenda palavras={fala} cortes={[3, 6, 9]} destaque={['CINCO', 'ANOS']} enfase={['OTÁVIO', 'BUNKER', 'QUINTAL']} />
    </AbsoluteFill>
  );
};

/* 2. "Até aquela terça, os vizinhos achavam o bunker um exagero." (a lembrança: o quintal de dia) */
const C2: React.FC = () => {
  const { fala } = usePalavra(2);
  return (
    <AbsoluteFill>
      <Anda zoom={[1, 1.1]} origem={[520, 1260]}>
        <CenaQuintal />
      </Anda>
      <Som q={6} nome="passarinho" vol={1.2} />
      <Legenda palavras={fala} cortes={[3, 6, 8]} destaque={['EXAGERO']} enfase={['TERÇA', 'VIZINHOS', 'BUNKER']} />
    </AbsoluteFill>
  );
};

/* 3. "Às sete da manhã, ele tomava café quando a TV ficou vermelha." (a tela vira vermelha em "vermelha") */
const C3: React.FC = () => {
  const { f, fala, q } = usePalavra(3);
  const tv = janelaM(f, q(11) - 2, q(11) + 6, 'corte');
  return (
    <AbsoluteFill>
      <Anda zoom={[1, 1.08]} origem={[540, 900]}>
        <CenaCozinha tv={tv} expressao={tv > 0.5 ? 'preocupada' : 'neutra'} />
      </Anda>
      <Som q={2} nome="cafe" vol={1.1} />
      <Som q={q(11) - 2} nome="clique" vol={1.82} />
      <Legenda palavras={fala} cortes={[4, 7, 10]} destaque={['VERMELHA']} enfase={['SETE', 'CAFÉ', 'TV']} />
    </AbsoluteFill>
  );
};

/* 4. "Uma sirene e uma frase só: 'Fiquem em casa. Não respirem a névoa.'" (o aviso entra palavra por
      palavra na TV; o rosto muda pra assustado em "névoa") */
const C4: React.FC = () => {
  const { f, fala, q } = usePalavra(4);
  let palavras = 0;
  for (let k = 0; k < 7; k++) if (f >= q(6 + k) - 2) palavras = k + 1;
  return (
    <AbsoluteFill>
      <Anda zoom={[1, 1.06]} origem={[540, 600]}>
        <CenaTV palavras={palavras} expressao={f >= q(12) - 2 ? 'assustada' : 'preocupada'} />
      </Anda>
      <Som q={q(1)} nome="sirene" vol={1.82} />
      <Legenda palavras={fala} cortes={[2, 4, 6, 9, 11]} destaque={['NÉVOA']} enfase={['SIRENE', 'CASA']} />
    </AbsoluteFill>
  );
};

/* 5. "Pela janela, uma névoa vermelha descia a rua." (a névoa vem do fim da rua e cobre tudo) */
const C5: React.FC = () => {
  const { c, f, fala, q } = usePalavra(5);
  const nevoa = janelaM(f, q(2), c.seqDuracao, 'suave');
  return (
    <AbsoluteFill>
      <Anda zoom={[1, 1.1]} origem={[540, 760]}>
        <CenaRua nevoa={nevoa} />
      </Anda>
      <Legenda palavras={fala} cortes={[2, 5]} destaque={['DESCIA']} enfase={['NÉVOA', 'VERMELHA']} />
    </AbsoluteFill>
  );
};

/* 6. "Ele largou o café, correu pro quintal e se trancou." (ele corre até a escotilha, desce e a tampa
      fecha em "trancou": tela preta, o único susto da parte) */
const C6: React.FC = () => {
  const { c, f, fala, q } = usePalavra(6);
  const corre = clamp01((f - q(4)) / Math.max(1, q(7) - q(4)));
  const desceu = f >= q(7) + 4;
  const fecha = q(9);
  const tranco = f >= fecha && f < fecha + 8 ? Math.sin((f - fecha) * 2.4) * 14 * (1 - (f - fecha) / 8) : 0;
  const passos: number[] = [];
  for (let k = q(4); k < q(7); k += 8) passos.push(k);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${tranco}px, ${tranco * 0.4}px)` }}>
        <Anda zoom={[1, 1.06]} origem={[540, 1200]}>
          <CenaQuintal
            aberta={f < fecha}
            nevoa={lerp(0.2, 1, clamp01(f / c.seqDuracao))}
            otavio={desceu || f < q(3) ? null : { x: lerp(560, 490, corre), y: lerp(1980, 1330, corre), escala: lerp(1.05, 0.5, corre), passo: f * 2 }}
          />
        </Anda>
      </AbsoluteFill>
      {f >= fecha ? <AbsoluteFill style={{ background: COR.breu }} /> : null}
      {passos.map((k) => (
        <Som key={k} q={k} nome="passo" vol={0.41} />
      ))}
      <Som q={fecha} nome="tampa" vol={1.95} />
      <Legenda palavras={fala} cortes={[4, 7]} destaque={['TRANCOU']} enfase={['CAFÉ', 'QUINTAL']} />
    </AbsoluteFill>
  );
};

/* 7. "Desde então, toda noite, o rádio repete o mesmo aviso." (de volta ao bunker; a câmera chega no rádio) */
const C7: React.FC = () => {
  const { f, fala } = usePalavra(7);
  return (
    <AbsoluteFill>
      {/* o rádio sobe pro meio da tela, longe da legenda */}
      <AbsoluteFill style={{ transform: 'translate(-150px, -330px)' }}>
        <Anda zoom={[1.7, 1.95]} origem={[BUNKER.radio.x + 110, BUNKER.radio.y + 60]}>
          <CenaBunker giro={f * 9} otavio={{ expressao: 'cansada', olhar: 1 }} />
        </Anda>
      </AbsoluteFill>
      <Som q={0} nome="chiado" vol={2.16} />
      <Legenda palavras={fala} cortes={[2, 4, 7]} destaque={['MESMO', 'AVISO']} enfase={['NOITE', 'RÁDIO']} />
    </AbsoluteFill>
  );
};

/** o ventilador do filtro: gira normal, engasga em "começou" e para em "falhar" */
const giroDoFiltro = (f: number, engasga: number, para: number) => {
  let a = 0;
  for (let k = 0; k <= f; k++) {
    if (k < engasga) a += 9;
    else if (k < para) a += 9 * (1 - (k - engasga) / (para - engasga)) * (random(`giro-${Math.floor(k / 3)}`) > 0.35 ? 1 : 0.15);
  }
  return a;
};

/* 8. "Hoje, o filtro de ar começou a falhar." (o ventilador engasga e para; a luz DENTRO pisca; a FORA
      continua verde: o detalhe escondido) */
const C8: React.FC = () => {
  const { f, fala, q } = usePalavra(8);
  const engasga = q(5) - 4;
  const para = q(7) + 6;
  const pisca = f < engasga ? true : Math.floor(f / 8) % 2 === 0;
  const luz = f > engasga && f < para + 10 && random(`luz-${Math.floor(f / 2)}`) > 0.7 ? 0.7 : 1;
  return (
    <AbsoluteFill>
      <Anda zoom={[1.6, 1.85]} origem={[BUNKER.filtro.x + 90, BUNKER.filtro.y + 200]}>
        <CenaBunker giro={giroDoFiltro(f, engasga, para)} dentro={pisca} luz={luz} otavio={null} />
      </Anda>
      <Som q={engasga} nome="ventilador" vol={0.8} />
      <Legenda palavras={fala} cortes={[1, 5]} destaque={['FILTRO']} enfase={['HOJE', 'FALHAR']} />
    </AbsoluteFill>
  );
};

/* 9. "Ele tem ar pra três dias. E o sinal verde... nunca veio." (o rosto dele olhando pra escotilha no
      teto; a câmera chega no rosto em "nunca") */
const C9: React.FC = () => {
  const { f, fala, q } = usePalavra(9);
  const chega = 0.35 * janelaM(f, q(10) - 6, q(11) + 10, 'suave');
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transformOrigin: `${BUNKER.rosto.x}px ${BUNKER.rosto.y}px`, transform: `translate(304px, -80px) scale(${2.4 + chega})` }}>
        <Anda zoom={[1, 1.05]} origem={[BUNKER.rosto.x, BUNKER.rosto.y]}>
          <CenaBunker giro={0} dentro={Math.floor(f / 8) % 2 === 0} otavio={{ expressao: 'preocupada', cima: 1, olhar: 0.3 }} />
        </Anda>
      </AbsoluteFill>
      <Som q={q(6) - 6} nome="respira" vol={2.07} />
      <Legenda palavras={fala} cortes={[3, 6, 8, 10]} destaque={['NUNCA']} enfase={['TRÊS', 'DIAS', 'SINAL', 'VERDE']} />
    </AbsoluteFill>
  );
};

/* 10. "Ele sai ou fica? Comenta SAI ou FICA. Segue pra ver a parte 2." → tela final PARTE 2 EM BREVE */
const C10: React.FC = () => {
  const { f, fala, q, qFim } = usePalavra(10);
  const final = qFim(12) + 6;
  return (
    <AbsoluteFill>
      <CartaoEscolha
        a={{ rotulo: 'SAI', cena: <CenaSai />, zoom: 0.62, foco: [540, 820] }}
        b={{ rotulo: 'FICA', cena: <CenaFica />, zoom: 0.72, foco: [700, 860] }}
        pA={mola(f, 'assenta', q(1) - 2)}
        pB={mola(f, 'assenta', q(3) - 2)}
        pOu={mola(f, 'estalo', q(2))}
      />
      {f < final + 8 ? <Legenda palavras={fala} cortes={[4, 6, 8, 11]} destaque={['SAI', 'FICA']} enfase={['PARTE', '2']} /> : null}
      {f >= final ? <TelaParte t={f - final} titulo="O BUNKER" fundo={<CenaBunker otavio={null} giro={0} />} fundoFoco={[540, 700]} /> : null}
      <Som q={final + 10} nome="batida" vol={0.6} />
    </AbsoluteFill>
  );
};

/** fusão lenta (entra na lembrança; sai da lembrança) */
const FUSAO_LENTA: EntradaM = { nome: 'fusao-lenta', T: 24, k: 12, criar: () => fusao({ T: 24, k: 12 }), plano: 'fusão lenta, passando pelo escuro' };

const CENAS = montarRoteiro({
  cenasFala: T.CENAS_FALA,
  // cortes secos (null), com duas fusões lentas: 1 → 2 (a lembrança) e 6 → 7 (de volta pro bunker)
  entradas: [null, FUSAO_LENTA, null, null, null, null, FUSAO_LENTA, null, null, null],
  nomes: ['bunker', 'quintal', 'cozinha', 'tv', 'janela', 'corrida', 'radio', 'filtro', 'rosto', 'final'],
  duracao: DURACAO,
});

/* ------------------------------------------------------------------ a capa */
export const CapaOBunker: React.FC = () => <Capa titulo={['O', 'BUNKER']} destaque={1} parte={1} fundo={<FundoCapa />} />;

const CapaSolta: React.FC = () => (
  <Fontes>
    <CapaOBunker />
  </Fontes>
);

/** a capa nos últimos quadros: o TikTok só deixa escolher a capa entre os quadros do vídeo */
const QUADROS_CAPA = 3;

export const OBunker: React.FC = () => (
  <VideoMontado cenas={CENAS} componentes={[C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]} audio={NARRACAO}>
    <Trilha fimVoz={Math.round(T.fimFala * FPS)} duracao={DURACAO} arquivo="trilha-suspense.mp3" />
    <Sequence from={DURACAO} durationInFrames={QUADROS_CAPA} name="capa">
      <CapaOBunker />
    </Sequence>
  </VideoMontado>
);

export const ComposicaoOBunker: React.FC = () => (
  <>
    <Composition id="OBunker-P1" component={OBunker} durationInFrames={DURACAO + QUADROS_CAPA} fps={FPS} width={1080} height={1920} />
    <Composition id="OBunker-Capa" component={CapaSolta} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
