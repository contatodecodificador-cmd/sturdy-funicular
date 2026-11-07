/* =====================================================================================
   videos/o-bunker: "O Bunker", parte 1 (Reels/TikTok 1080x1920, 10 cenas).
   Roteiro, briefing e folhas de design aprovados: roteiro.md, briefing.md, Design.tsx.

   Cada cena é uma frase; tudo que acontece nela é preso a uma palavra: q(i) = quadro em que a
   palavra i da cena começa a ser dita (qFim(i), em que termina).

   Tempos sem narração (ritmo de leitura):
     node scripts/tempos-de-texto.mjs --ritmo=1.1 "FAZ CINCO ANOS QUE O OTÁVIO NÃO SAI DO BUNKER DO QUINTAL. | ATÉ AQUELA TERÇA, OS VIZINHOS ACHAVAM O BUNKER UM EXAGERO. | ÀS SETE DA MANHÃ, ELE TOMAVA CAFÉ QUANDO A TV FICOU VERMELHA. | UMA SIRENE E UMA FRASE SÓ: \"FIQUEM EM CASA. NÃO RESPIREM A NÉVOA.\" | PELA JANELA, UMA NÉVOA VERMELHA DESCIA A RUA. | ELE LARGOU O CAFÉ, CORREU PRO QUINTAL E SE TRANCOU. | DESDE ENTÃO, TODA NOITE, O RÁDIO REPETE O MESMO AVISO. | HOJE, O FILTRO DE AR COMEÇOU A FALHAR. | ELE TEM AR PRA TRÊS DIAS. E O SINAL VERDE... NUNCA VEIO. | ELE SAI OU FICA? COMENTA SAI OU FICA. SEGUE PRA VER A PARTE 2." > src/videos/o-bunker/tempos.json
   Com narração: o passo a passo do CLAUDE.md da raiz (palavras.py → alinhar.py → audio="narracao-o-bunker.mp3").

   Cenas montadas: 1. As outras ainda são provisórias (fundo preto e a legenda).
   ===================================================================================== */
import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { Camera } from '../../visual';
import { useCenaM, type EntradaM } from '../../cena';
import { COR, Legenda } from '../../kit/pecas';
import { Som } from '../../kit/som';
import { montarRoteiro, VideoMontado } from '../../montagem';
import { criarTempos, type TemposJson } from '../../tempos';
import { fusao } from '../../transicoes/fusao';
import { BUNKER, CenaBunker } from './cenarios';
import TEMPOS from './tempos.json';

const T = criarTempos(TEMPOS as TemposJson);
const FPS = 30;
/** fim da fala + 3,5 s pra tela final (PARTE 2 EM BREVE) */
const DURACAO = Math.round((T.fimFala + 3.5) * FPS);

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
      <Anda zoom={[1, 1.12]} origem={[BUNKER.riscos.x + 160, BUNKER.riscos.y + 120]}>
        <CenaBunker giro={f * 9} otavio={{ expressao: 'cansada', olhar: 0.6 }} />
      </Anda>
      <Som q={0} nome="zumbido" vol={0.3} />
      <Legenda palavras={fala} cortes={[3, 6, 9]} destaque={['CINCO', 'ANOS']} />
    </AbsoluteFill>
  );
};

/** cena ainda não montada: fundo escuro e a legenda */
const provisoria = (n: number, cortes: number[]): React.FC => {
  const P: React.FC = () => {
    const { fala } = usePalavra(n);
    return (
      <AbsoluteFill style={{ background: COR.breu }}>
        <div style={{ position: 'absolute', top: 700, width: '100%', textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 34, color: COR.inkSoft }}>CENA {n} · EM CONSTRUÇÃO</div>
        <Legenda palavras={fala} cortes={cortes} />
      </AbsoluteFill>
    );
  };
  return P;
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

const COMPONENTES = [
  C1,
  provisoria(2, [3, 6, 9]),
  provisoria(3, [3, 6, 9]),
  provisoria(4, [3, 6, 9]),
  provisoria(5, [2, 5]),
  provisoria(6, [3, 6]),
  provisoria(7, [2, 4, 7]),
  provisoria(8, [3, 5]),
  provisoria(9, [3, 6, 9]),
  provisoria(10, [4, 8]),
];

export const OBunker: React.FC = () => <VideoMontado cenas={CENAS} componentes={COMPONENTES} audio={null} />;

export const ComposicaoOBunker: React.FC = () => <Composition id="OBunker-P1" component={OBunker} durationInFrames={DURACAO} fps={FPS} width={1080} height={1920} />;
