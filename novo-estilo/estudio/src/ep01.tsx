// Ep. 1 "16:47": as 41 cenas, presas aos tempos reais da voz (tempos-ep01.json).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import TEMPOS from './tempos-ep01.json';
import {Camera, Chave, Legenda, Palavra, Marca} from './camera';
import {Etiqueta, Ficha, Medidor, Cartao, Carimbo, Topo, Relogios, Checklist, Flash, Pergunta, COR, useT} from './pecas';
import {Rua, RUA, POS, Mundo, MUNDO, Escada, ESCADA, Terraco, TERRACO, RelogioRua, RELOGIO, Pulso, Padaria, PADARIA, Loja, LOJA, MapaBairro, MAPA, Celular} from './cenarios';
import {pessoa, FIG, rose} from './arte';

export const FPS = 30;
const PAL: Palavra[] = (TEMPOS as any).palavras;
const INI: number[] = (TEMPOS as any).inicio_cenas.map((x: number, i: number) => (i === 0 ? 0 : x - 0.12));
export const DURACAO: number = (TEMPOS as any).duracao + 0.6;
const FIM = INI.slice(1).concat([DURACAO]);

const norm = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const DESTAQUES = new Set(['quatro', 'cinco', 'parar', 'onibus', 'pombo', 'cafe', 'bilhoes', 'uma', 'rose', 'nada', 'coracao', 'um', 'fica', 'dois', 'bicicleta', 'estatua', 'metros', 'tres', 'vinte', 'aviao', 'sempre', 'muda', 'dinheiro', 'caro', 'ninguem', 'nunca', 'sete', 'pesar', 'ponto', 'volta', 'acende', 'mensagem', 'trinta', 'ficar', 'unica', 'acordada', 'observando', 'faria', 'estatua', 'pessoas']);

/** tempo (dentro da cena i) em que a palavra é falada */
function W(i: number, palavra: string, fallback = 0.3) {
  const a = INI[i], b = FIM[i];
  const p = PAL.find((x) => x.s >= a - 0.1 && x.s <= b + 0.1 && norm(x.w) === norm(palavra));
  return p ? p.s - a : fallback;
}

const RET = {
  rose: rose({expr: 'feliz', corpo: false}), jorge: pessoa(FIG.jorge), priscila: pessoa(FIG.priscila), joao: pessoa(FIG.seuJoao), dunha: pessoa(FIG.dunha),
};

const Escuro: React.FC<{o?: number}> = ({o = 0.4}) => <AbsoluteFill style={{background: `rgba(20,22,27,${o})`}} />;

/** Faixas de glitch (quando a mensagem diz que ela não é a única) */
const Glitch: React.FC<{em: number}> = ({em}) => {
  const t = useT();
  const d = t - em;
  if (d < 0 || d > 0.6) return null;
  const f = Math.floor(d * 30);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      {[0, 1, 2, 3, 4].map((k) => (
        <div key={k} style={{position: 'absolute', left: 0, right: 0, top: ((f * 37 + k * 211) % 1700), height: 30 + ((f + k) % 4) * 22, background: k % 2 ? 'rgba(255,40,80,.45)' : 'rgba(40,200,255,.45)', transform: `translateX(${((f * 13 + k * 7) % 60) - 30}px)`}} />
      ))}
    </AbsoluteFill>
  );
};

type Cena = {
  fundo: (t: number, d: number) => React.ReactNode; W: number; H: number; lim?: {x0: number; y0: number; x1: number; y1: number};
  cam: (d: number) => Chave[]; socos?: number[]; tremor?: number;
  hud?: (d: number) => React.ReactNode; topo?: string; leg?: number | null; escuro?: number; lado?: 'esq' | 'centro' | 'dir';
  marcas?: (d: number) => MarcaDef[];
};
type MarcaDef = {x: number; y: number; texto: string; em?: number; seta?: 'baixo' | 'cima' | 'esq' | 'dir'; cor?: string; corTexto?: string; tam?: number};

const duas = (p: React.ComponentProps<typeof Rua>) => [<Rua key="b" {...p} camada="base" />, <Rua key="r" {...p} camada="rose" />];
const rua = (o: Partial<React.ComponentProps<typeof Rua>> = {}) => (t: number) => duas({congelado: 1, roseX: POS.predio, joaoX: POS.joao, ...o} as any);
const piscaRose = (t: number) => (t % 3.1) > 2.95;
/** centro da câmera pra Rose (no x do mundo rx) ficar à direita da tela, com a legenda do lado esquerdo */
const ladoRose = (rx: number, z: number) => rx - 260 / z;

// ------------------------------------------------------------------ as 41 cenas
const C: Cena[] = [
  /* 1 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · SEG · 16:45',
    fundo: (t) => duas({congelado: 0, roseX: POS.predio, roseExpr: 'feliz', rosePiscar: piscaRose(t), joaoX: POS.joao, onibusX: -320 + t * 60}),
    cam: (d) => [{t: 0, x: ladoRose(POS.predio, 1.2), y: 1240, z: 1.2}, {t: d, x: ladoRose(POS.predio, 1.5), y: 1200, z: 1.5}], lado: 'esq',
    hud: () => <Ficha x={60} y={180} nome="ROSE, 33" linha2="FAXINEIRA · SAINDO DO SERVIÇO" retrato={RET.rose} em={1.0} />},
  /* 2 */ {W: RUA.W, H: RUA.H, lim: RUA.lim,
    fundo: (t) => { const fz = W(1, 'parar', 1.0); const c = t >= fz ? 1 : 0; return duas({congelado: c, roseX: POS.predio, roseExpr: c ? 'surpresa' : 'feliz', joaoX: POS.joao, onibusX: -320 + (INI[1] + Math.min(t, fz)) * 60}); },
    cam: (d) => { const fz = W(1, 'parar', 1.0); return [{t: 0, x: ladoRose(POS.predio, 1.5), y: 1200, z: 1.5}, {t: fz, x: ladoRose(POS.predio, 1.6), y: 1190, z: 1.6}, {t: fz + 0.5, x: 1650, y: 1150, z: 0.72}, {t: d, x: 1600, y: 1140, z: 0.68}]; }, lado: 'esq',
    socos: [], hud: (d) => { const fz = W(1, 'parar', 1.0); return <><Flash em={fz} /><Relogios rose="16:47:00" so="mundo" em={fz + 0.1} /><Carimbo x={540} y={860} texto="PARADO" em={fz + 0.35} tam={110} /></>; }},
  /* 3 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -320 + 5.0 * 60 > 0 ? 0 : -320 + 5.0 * 60}),
    cam: (d) => [{t: 0, x: 1050, y: 1420, z: 1.3}, {t: d, x: 1330, y: 1410, z: 1.38}],
    marcas: () => [{x: 1120, y: 1315, texto: '8012 · VILA ESPERANÇA · O DELA', em: 0.5}],
    hud: () => <><Ficha x={60} y={180} nome="SEU JORGE, 55" linha2="MOTORISTA DO 8012" retrato={RET.jorge} em={1.0} /></>},
  /* 4 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}),
    cam: (d) => [{t: 0, x: 1690, y: 650, z: 2.0, r: -4}, {t: d, x: 1700, y: 660, z: 2.5, r: 4}],
    marcas: () => [{x: 1700, y: 515, texto: 'POMBO · 1,2 m DO CHÃO', em: 0.6}]},
  /* 5 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}),
    cam: (d) => [{t: 0, x: 1300, y: 1250, z: 2.0}, {t: d, x: 1322, y: 1215, z: 3.2}], marcas: () => [{x: 1330, y: 1190, texto: 'CAFÉ', em: W(4, 'café', 0.4)}],
    hud: () => <><Ficha x={60} y={180} nome="PRISCILA, 38" linha2="BANCÁRIA" retrato={RET.priscila} em={0.2} /><Medidor x={480} y={1060} rotulo="CAFÉ" de={20} para={63} unid="°C" em={1.1} largura={380} corNum={COR.terracota} /></>},
  /* 6 */ {W: MUNDO.W, H: MUNDO.H, fundo: (t, d) => <Mundo acesas={interpolate(t, [0, d], [1, 0.05], {extrapolateRight: 'clamp'})} t={t} />,
    cam: (d) => [{t: 0, x: 540, y: 900, z: 1.05}, {t: d, x: 540, y: 920, z: 0.9}], topo: 'PLANETA TERRA · 16:47',
    hud: (d) => <Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={8120000000} para={2} em={0.2} dur={d} largura={900} tamNum={92} corNum={COR.terracota} seta="▼" />},
  /* 7 */ {W: MUNDO.W, H: MUNDO.H, fundo: (t) => <Mundo acesas={0} t={t} />, topo: 'PLANETA TERRA · 16:47',
    cam: (d) => [{t: 0, x: 530, y: 960, z: 1.2}, {t: d, x: 505, y: 1000, z: 2.4}], socos: [W(6, 'uma', 0.2)],
    hud: () => <Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={1} para={1} em={0} largura={900} tamNum={110} corNum={COR.ipe} />},
  /* 8 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}), leg: 1480,
    cam: (d) => [{t: 0, x: ladoRose(POS.predio, 2.6), y: 1180, z: 2.6}, {t: d, x: ladoRose(POS.predio, 3.3), y: 1160, z: 3.3}], lado: 'esq',
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={84} para={128} unid="BPM" em={0.4} seta="▲" corNum={COR.terracota} />},
  /* 9 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}),
    cam: (d) => [{t: 0, x: 1200, y: 1150, z: 0.62}, {t: d, x: 1200, y: 1100, z: 0.46}],
    hud: (d) => <Medidor x={60} y={170} rotulo="SOM NA RUA" de={72} para={0} unid="dB" em={0.2} dur={d * 0.7} barra={80} />},
  /* 10 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}), tremor: 5, leg: 1480,
    cam: (d) => [{t: 0, x: ladoRose(POS.predio, 1.8), y: 1300, z: 1.8}, {t: d, x: ladoRose(POS.predio, 2.2), y: 1240, z: 2.2}], lado: 'esq',
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={128} para={141} unid="BPM" em={0.1} seta="▲" corNum={COR.terracota} />},
  /* 11 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({onibusX: -20}), escuro: 0.45,
    cam: (d) => [{t: 0, x: 1300, y: 1150, z: 0.85}, {t: d, x: 1300, y: 1150, z: 0.98}], socos: [0.35],
    hud: () => <Cartao titulo="TESTE 1" sub="AS COISAS" em={0.05} />},
  /* 12 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: (t) => duas({congelado: 1, roseX: 1150, roseExpr: 'desconfiada', joaoX: POS.joao, onibusX: -20, cafeSuspenso: t < W(11, 'copo', 1.2)}),
    cam: (d) => [{t: 0, x: 1230, y: 1260, z: 1.7}, {t: W(11, 'copo', 1.2), x: 1300, y: 1225, z: 2.6}, {t: d, x: 1318, y: 1215, z: 2.9}], lado: 'dir',
    marcas: () => [{x: 1330, y: 1190, texto: 'CAFÉ', em: W(11, 'café', 0.6)}],
    hud: () => <><Medidor x={60} y={170} rotulo="COISAS MEXIDAS" de={0} para={1} em={W(11, 'copo', 1.2)} dur={0.3} corNum={COR.praca} /></>},
  /* 13 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 1150, roseExpr: 'feliz', onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: 1320, y: 1240, z: 2.7}, {t: d, x: 1322, y: 1236, z: 3.2}], lado: 'dir',
    hud: () => <Carimbo x={540} y={900} texto="FICOU" em={W(12, 'fica', 0.5)} cor={COR.praca} />},
  /* 14 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 1150, onibusX: -20, cafeSuspenso: false}), escuro: 0.45,
    cam: (d) => [{t: 0, x: 900, y: 1150, z: 0.85}, {t: d, x: 900, y: 1150, z: 0.98}], socos: [0.35],
    hud: () => <Cartao titulo="TESTE 2" sub="AS PESSOAS" em={0.05} />},
  /* 15 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 840, roseExpr: 'desconfiada', onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: 600, y: 1300, z: 1.4}, {t: W(14, 'bicicleta', 1.4), x: 520, y: 1430, z: 1.35}, {t: d, x: 520, y: 1440, z: 1.6}],
    hud: () => <><Ficha x={60} y={180} nome="SEU JOÃO, 68" linha2="APOSENTADO" retrato={RET.joao} em={0.3} /><Medidor x={60} y={420} rotulo="DISTÂNCIA DA BICICLETA" de={80} para={30} unid="cm" em={1.2} corNum={COR.terracota} seta="▼" /></>},
  /* 16 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 800, roseExpr: 'surpresa', onibusX: -20, cafeSuspenso: false}), tremor: 2,
    cam: (d) => [{t: 0, x: 680, y: 1420, z: 2.0}, {t: W(15, 'frio', 1.0), x: 640, y: 1330, z: 2.3}, {t: d, x: 640, y: 1250, z: 2.6}], lado: 'esq',
    marcas: () => [{x: 590, y: 1360, texto: 'PELE · 19 °C', em: W(15, 'estátua', 2.0)}],
    hud: () => <Carimbo x={540} y={760} texto="SEM PULSO" em={W(15, 'frio', 1.0)} />},
  /* 17 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: (t, d) => { const k = interpolate(t, [0.2, d - 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); const jx = POS.joao + (POS.joaoMovido - POS.joao) * k; return duas({congelado: 1, roseX: jx + 150, roseExpr: 'brava', joaoX: jx, onibusX: -20, cafeSuspenso: false}); },
    cam: (d) => [{t: 0, x: ladoRose(POS.joao + 150, 1.4), y: 1380, z: 1.4}, {t: d, x: ladoRose(POS.joaoMovido + 150, 1.4), y: 1380, z: 1.4}], lado: 'esq',
    hud: (d) => <Medidor x={60} y={170} rotulo="DISTÂNCIA DA BICICLETA" de={30} para={200} unid="cm" em={0.2} dur={d - 0.6} textoFinal="2 m" corNum={COR.praca} seta="▲" />},
  /* 18 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 1010, joaoX: POS.joaoMovido, onibusX: -20, cafeSuspenso: false}), escuro: 0.45,
    cam: (d) => [{t: 0, x: 1500, y: 1150, z: 0.85}, {t: d, x: 1500, y: 1150, z: 0.98}], socos: [0.35],
    hud: () => <Cartao titulo="TESTE 3" sub="O MUNDO" em={0.05} />},
  /* 19 */ {W: ESCADA.W, H: ESCADA.H, topo: 'EDIFÍCIO CENTRAL · ESCADA', fundo: (t, d) => <Escada subida={interpolate(t, [0, d], [0, 1])} />,
    cam: (d) => [0, 0.2, 0.4, 0.6, 0.8, 1].map((k) => ({t: k * d, x: 540, y: 4000 - k * 3740 - 520, z: 1.0})),
    hud: (d) => <Medidor x={60} y={170} rotulo="ANDAR" de={1} para={22} unid="º" em={0.1} dur={d - 0.2} corNum={COR.azul} />},
  /* 20 */ {W: TERRACO.W, H: TERRACO.H, lim: TERRACO.lim, topo: 'EDIFÍCIO CENTRAL · 22º ANDAR', fundo: () => <Terraco />,
    cam: (d) => [{t: 0, x: 600, y: 520, z: 1.1}, {t: W(19, 'fumaça', 1.4) - 0.2, x: 620, y: 540, z: 1.2}, {t: W(19, 'fumaça', 1.4) + 0.3, x: 1220, y: 820, z: 1.2}, {t: d, x: 1240, y: 840, z: 1.3}], lado: 'dir',
    marcas: () => [{x: 560, y: 365, texto: 'AVIÃO · 3.000 m', em: 0.3}, {x: 1260, y: 760, texto: 'FUMAÇA PARADA', em: W(19, 'fumaça', 1.4)}]},
  /* 21 */ {W: TERRACO.W, H: TERRACO.H, lim: TERRACO.lim, topo: 'EDIFÍCIO CENTRAL · 22º ANDAR', fundo: () => <Terraco />,
    cam: (d) => [{t: 0, x: 1400, y: 700, z: 0.9}, {t: d, x: 1500, y: 540, z: 1.9}], socos: [W(20, 'sempre', 3.0)],
    marcas: () => [{x: 1500, y: 395, texto: 'SOL · NÃO SE PÕE', em: 0.4, cor: COR.terracota, corTexto: '#fff'}]},
  /* 22 */ {W: RELOGIO.W, H: RELOGIO.H, fundo: (t) => <RelogioRua tremeAgulha={t > 0.3 && t < 0.45 ? 2 : 0} />,
    cam: (d) => [{t: 0, x: 540, y: 820, z: 1.05}, {t: d, x: 540, y: 790, z: 1.3}],
    hud: () => <Relogios rose="" so="mundo" em={0.15} y={1190} />},
  /* 23 */ {W: 1080, H: 1920, topo: 'CENTRO · DIA 3', fundo: () => <Pulso hora="DIA 3 15:40" />,
    cam: (d) => [{t: 0, x: 540, y: 1160, z: 1.0}, {t: d, x: 540, y: 1200, z: 1.25}], socos: [0.3],
    hud: () => <><Cartao titulo="DIA 3" em={0.05} y={260} /><Relogios rose="DIA 3 · 15:40" em={0.6} y={540} /></>},
  /* 24 */ {W: PADARIA.W, H: PADARIA.H, marcas: () => [{x: 230, y: 1325, texto: 'PÃO FRANCÊS', em: W(23, 'pão', 0.6)}], topo: 'PADARIA PÃO DE OURO · DIA 3', fundo: (t) => <Padaria roseX={420} roseExpr="feliz" dinheiro={t > W(23, 'dinheiro', 1.2) ? 1 : 0} />,
    cam: (d) => [{t: 0, x: 690, y: 1250, z: 1.0}, {t: W(23, 'dinheiro', 1.2) - 0.1, x: 720, y: 1250, z: 1.05}, {t: W(23, 'dinheiro', 1.2) + 0.4, x: 1300, y: 1100, z: 1.4}, {t: d, x: 1310, y: 1100, z: 1.5}], lado: 'dir',
    hud: () => <><Ficha x={60} y={180} nome="DONA DUNHA, 61" linha2="BALCONISTA" retrato={RET.dunha} em={0.25} /><Medidor x={60} y={420} rotulo="DINHEIRO DEIXADO" de={0} para={12.5} prefixo="R$ " casas={2} em={W(23, 'dinheiro', 1.2)} corNum={COR.praca} /></>},
  /* 25 */ {W: LOJA.W, H: LOJA.H, topo: 'MÓVEIS DA PRAÇA · DIA 3', fundo: () => <Loja piscar />,
    cam: (d) => [{t: 0, x: 700, y: 1250, z: 0.8}, {t: d, x: 720, y: 1240, z: 0.95}],
    marcas: () => [{x: 700, y: 1075, texto: 'SOFÁ · R$ 8.900', em: W(24, 'caro', 0.7), cor: COR.terracota, corTexto: '#fff'}]},
  /* 26 */ {W: LOJA.W, H: LOJA.H, topo: 'MÓVEIS DA PRAÇA · DIA 3', fundo: () => <Loja piscar />,
    cam: (d) => [{t: 0, x: 1000, y: 1200, z: 1.5}, {t: d, x: 1080, y: 1180, z: 2.1, r: 3}],
    hud: () => <Checklist x={60} y={180} itens={['BOLETO', 'PATRÃO', 'DESPERTADOR']} em={0.3} passo={0.5} />},
  /* 27 */ {W: PADARIA.W, H: PADARIA.H, topo: 'PADARIA PÃO DE OURO · DIA 5', fundo: () => <Padaria roseX={620} roseExpr="feliz" dinheiro={1} />,
    cam: (d) => [{t: 0, x: 860, y: 1150, z: 0.9}, {t: d, x: 900, y: 1100, z: 1.05}], socos: [0.3], lado: 'dir',
    hud: () => <><Cartao titulo="DIA 5" em={0.02} y={300} /><Relogios rose="DIA 5 · 10:12" so="rose" em={0.8} y={560} /></>},
  /* 28 */ {W: PADARIA.W, H: PADARIA.H, topo: 'PADARIA PÃO DE OURO · DIA 5', fundo: () => <Padaria roseX={620} roseExpr="desconfiada" dinheiro={1} />, leg: 1480,
    cam: (d) => [{t: 0, x: 1100, y: 820, z: 2.3}, {t: d, x: 1100, y: 800, z: 2.9}],
    hud: () => <Medidor x={60} y={170} rotulo="RESPOSTAS DA DONA DUNHA" de={0} para={0} em={0.6} largura={520} corNum={COR.terracota} />},
  /* 29 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1010, roseExpr: 'brava', joaoX: POS.joaoMovido, onibusX: -20, cafeSuspenso: false}), escuro: 0.5,
    cam: (d) => [{t: 0, x: 1200, y: 1150, z: 0.8}, {t: d, x: 1200, y: 1150, z: 0.9}], socos: [0.25],
    hud: () => <><Cartao titulo="DIA 7" em={0.02} y={300} /><Relogios rose="DIA 7 · 18:03" so="rose" em={0.3} y={560} /></>},
  /* 30 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1000, roseExpr: 'desconfiada', joaoX: POS.joaoMovido, onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: ladoRose(1000, 1.5), y: 1380, z: 1.5}, {t: d, x: ladoRose(1000, 1.0), y: 1300, z: 1.0}], lado: 'esq',
    hud: () => <><Medidor x={60} y={170} rotulo="SOM NA RUA" de={0} para={0} unid="dB" em={0.2} barra={80} /><Medidor x={60} y={400} rotulo="BATIMENTOS DA ROSE" de={80} para={72} unid="BPM" em={0.5} /></>},
  /* 31 */ {W: MAPA.W, H: MAPA.H, topo: 'VILA ESPERANÇA · DIA 7', fundo: (t, d) => <MapaBairro prog={interpolate(t, [0.1, d - 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />,
    cam: (d) => [{t: 0, x: 500, y: 1000, z: 1.0}, {t: d, x: 560, y: 1300, z: 1.15}],
    marcas: (d) => [{x: 650, y: 1375, texto: 'PONTO DO 8012', em: d - 0.5}]},
  /* 32 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, roseExpr: 'surpresa', onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: ladoRose(1060, 1.3), y: 1400, z: 1.3}, {t: d, x: ladoRose(1060, 1.7), y: 1380, z: 1.7}], lado: 'esq',
    hud: () => <><Medidor x={60} y={170} rotulo="ONDE ELA DEIXOU O SEU JOÃO" de={2} para={0} unid="m" casas={1} em={W(31, 'não', 0.9)} dur={0.4} largura={560} corNum={COR.terracota} seta="▼" /><Carimbo x={330} y={900} texto="MEXERAM" em={W(31, 'deixou', 1.6)} tam={100} /></>},
  /* 33 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, roseExpr: 'surpresa', onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: 900, y: 1380, z: 1.7}, {t: 0.3, x: 660, y: 1330, z: 1.6}, {t: d, x: 640, y: 1310, z: 1.75}],
    marcas: () => [{x: 640, y: 1015, texto: 'POSIÇÃO ORIGINAL', em: 0.5, cor: COR.terracota, corTexto: '#fff'}]},
  /* 34 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, onibusX: -20, cafeSuspenso: false}), tremor: 2, leg: 1480,
    cam: (d) => [{t: 0, x: 640, y: 1150, z: 4.0}, {t: d, x: 640, y: 1146, z: 5.2}],
    marcas: () => [{x: 640, y: 1088, texto: 'OLHAR → ROSE', em: 0.35, cor: COR.terracota, corTexto: '#fff'}]},
  /* 35 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: (t) => duas({congelado: 1, roseX: 1060, joaoX: POS.joao, onibusX: -20, cafeSuspenso: false, bolso: interpolate(t, [W(34, 'acende', 1.0), W(34, 'acende', 1.0) + 0.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}),
    cam: (d) => [{t: 0, x: 655, y: 1330, z: 3.0}, {t: d, x: 655, y: 1320, z: 3.7}],
    marcas: () => [{x: 653, y: 1300, texto: 'CELULAR · 1 MENSAGEM', em: W(34, 'celular', 0.9)}]},
  /* 36 */ {W: 1080, H: 1920, topo: 'BOLSO DO SEU JOÃO', fundo: () => <Celular linhas={[]} mostrar={[]} />,
    cam: (d) => [{t: 0, x: 540, y: 700, z: 1.0}, {t: d, x: 540, y: 640, z: 1.5}]},
  /* 37 */ {W: 1080, H: 1920, topo: 'BOLSO DO SEU JOÃO', fundo: (t, d) => <Celular linhas={['O tempo volta em 30 dias.']} mostrar={[interpolate(t, [0, d * 0.8], [0, 1], {extrapolateRight: 'clamp'})]} />,
    cam: (d) => [{t: 0, x: 540, y: 820, z: 1.15}, {t: d, x: 540, y: 860, z: 1.25}],
    hud: () => <Medidor x={60} y={170} rotulo="O TEMPO VOLTA EM" de={30} para={23} unid="DIAS" em={W(36, 'trinta', 1.0)} corNum={COR.terracota} seta="▼" />},
  /* 38 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: 1150, y: 1250, z: 0.55}, {t: d, x: 1150, y: 1230, z: 0.62}],
    marcas: () => [{x: 1330, y: 1185, texto: 'CAFÉ · FICA', em: 0.3, tam: 28}, {x: 640, y: 1015, texto: 'SEU JOÃO · FICA', em: 0.6, tam: 28}, {x: 1250, y: 1315, texto: 'ÔNIBUS · FICA', em: 0.9, tam: 26}]},
  /* 39 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, roseExpr: 'surpresa', onibusX: -20, cafeSuspenso: false}), tremor: 6, leg: 1480,
    cam: (d) => [{t: 0, x: ladoRose(1060, 2.5), y: 1190, z: 2.5}, {t: d, x: ladoRose(1060, 3.1), y: 1170, z: 3.1}], lado: 'esq', socos: [W(38, 'única', 1.2)],
    hud: () => <><Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={1} para={2} em={0.1} dur={W(38, 'única', 1.2)} textoFinal="1 → ?" largura={560} corNum={COR.terracota} /><Glitch em={W(38, 'acordada', 1.5)} /></>},
  /* 40 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, roseExpr: 'desconfiada', onibusX: -20, cafeSuspenso: false}),
    cam: (d) => [{t: 0, x: ladoRose(1060, 0.75), y: 1150, z: 0.75}, {t: d, x: 1200, y: 1060, z: 0.46}], lado: 'esq',
    hud: () => <Relogios rose="DIA 7 · 18:20" em={0.2} />},
  /* 41 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseX: 1060, roseExpr: 'desconfiada', onibusX: -20, cafeSuspenso: false}), leg: null, escuro: 0.25,
    cam: (d) => [{t: 0, x: 1060, y: 1090, z: 2.0}, {t: d, x: 1060, y: 1105, z: 2.5}],
    hud: () => <Pergunta em={0.15} />},
];

const CenaView: React.FC<{c: Cena; d: number}> = ({c, d}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera chaves={c.cam(d)} socos={c.socos} tremor={c.tremor} W={c.W} H={c.H} lim={c.lim}>
        {(() => {
          const f = c.fundo(t, d);
          const camadas = Array.isArray(f) ? f : [f];
          const ms = (c.marcas ? c.marcas(d) : []).map((m, k) => (
            <Marca key={'m' + k} x={m.x} y={m.y}><Etiqueta x={0} y={0} texto={m.texto} em={m.em} seta={m.seta} cor={m.cor} corTexto={m.corTexto} tam={m.tam} /></Marca>
          ));
          return <>{camadas[0]}{ms}{camadas.slice(1)}</>;
        })()}
      </Camera>
      {c.escuro ? <Escuro o={c.escuro} /> : null}
      {c.hud ? c.hud(d) : null}
    </AbsoluteFill>
  );
};

export const Ep01: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const idx = Math.max(0, INI.findIndex((x, i) => t >= x && t < FIM[i]));
  const fz = INI[1] + W(1, 'parar', 1.0);
  const topo = C[idx].topo || (t < fz ? 'CENTRO · SEG · 16:45' : 'CENTRO · SEG · 16:47');
  const legY = (tt: number) => {
    const i = Math.max(0, INI.findIndex((x, k) => tt >= x && tt < FIM[k]));
    const l = C[i].leg;
    return l === null ? -9999 : (l || 1430);
  };
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {C.map((c, i) => (
        <Sequence key={i} from={Math.round(INI[i] * fps)} durationInFrames={Math.max(1, Math.round((FIM[i] - INI[i]) * fps))}>
          <CenaView c={c} d={FIM[i] - INI[i]} />
        </Sequence>
      ))}
      <Topo texto={topo} />
      <Legenda pal={PAL} destaques={DESTAQUES} y={legY} lado={(tt) => { const i = Math.max(0, INI.findIndex((x, k) => tt >= x && tt < FIM[k])); return C[i].lado || 'centro'; }} />
      <Audio src={staticFile('ep01/audio.mp3')} />
    </AbsoluteFill>
  );
};
