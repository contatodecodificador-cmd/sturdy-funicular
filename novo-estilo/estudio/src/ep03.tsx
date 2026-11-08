// Ep. 3 "O dono do relógio": 34 cenas presas aos tempos reais da voz (tempos-ep03.json).
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import TEMPOS from './tempos-ep03.json';
import {Camera} from './camera';
import {Etiqueta, Ficha, Medidor, Cartao, Carimbo, Relogios, CartaoAB, COR, useT} from './pecas';
import {Rua, RUA, POS, RelogioRua, RELOGIO} from './cenarios';
import {Fachada, FACHADA, Relojoaria, LOJA2, REL, FotoClose} from './cenarios2';
import {Esconderijo, ESCOND, Fresta, Comparar} from './cenarios3';
import {rose} from './arte';
import {Cena, Episodio, Glitch, ladoRose, tempos} from './episodio';

const T = tempos(TEMPOS as any);
const {W} = T;
export const DURACAO03 = T.DUR;

const DEST = new Set(['parou', 'relojoaria', 'foto', 'sino', 'esconde', 'balcao', 'coracao', 'passos', 'tres', 'um', 'tenis', 'mancha', 'dois', 'luvas', 'mesmas', 'faixa', 'branco', 'relogio', 'sorri', 'rose', 'sabia', 'esconder', 'senhora', 'olhos', 'nariz', 'argolas', 'velha', 'parei', '1648', 'rapido', 'tempo', 'agora']);

const RET = {velha: rose({expr: 'feliz', velha: true, corpo: false})};
const L2 = {W: LOJA2.W, H: LOJA2.H, lim: LOJA2.lim};
const EC = {W: ESCOND.W, H: ESCOND.H, lim: ESCOND.lim};
const ROSE_B = 950;   // Rose atrás do balcão
const VELHA = 1180;   // a visita, na frente do balcão
const ROSTO_E = 935;  // altura do rosto da Rose no esconderijo
const CONT_INI = T.INI[30], CONT_DUR = T.DUR - 0.8 - T.INI[30];
const reloj = (o: Partial<React.ComponentProps<typeof Relojoaria>> = {}) => (t: number) => <Relojoaria t={t} ponteiro={t} {...o} />;
const rua = (t: number) => {
  const p: any = {congelado: 1, roseX: 1060, joaoX: POS.joao, onibusX: -20, cafeSuspenso: false, roseT: t, roseExpr: 'desconfiada'};
  return [<Rua key="b" {...p} camada="base" />, <Rua key="r" {...p} camada="rose" />];
};

/** Relógio de bolso grande (close), ponteiro acelerando */
const BolsoGrande: React.FC<{seg: number; mao?: boolean}> = ({seg, mao = true}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <rect width="1080" height="1920" fill="#3B2A1E" />
    {mao && <path d="M-60,1500 C200,1300 380,1240 520,1240 L640,1280 C700,1320 660,1400 600,1420 L360,1500 L200,1900 L-60,1900Z" fill="#AF7A58" stroke={COR.tinta} strokeWidth={4} />}
    <g transform="translate(540,900)">
      <path d="M90,-260 C220,-360 330,-240 340,-120" stroke="#C9A04A" strokeWidth={14} fill="none" />
      <rect x={-30} y={-300} width={60} height={52} rx={10} fill="#E2B85C" stroke={COR.tinta} strokeWidth={6} />
      <circle r={250} fill="#E2B85C" stroke={COR.tinta} strokeWidth={8} />
      <circle r={210} fill="#FFF8EC" stroke="#8A6A40" strokeWidth={6} />
      {Array.from({length: 60}, (_, i) => <rect key={i} x={-2} y={-200} width={4} height={i % 5 ? 10 : 26} fill={COR.tinta} transform={`rotate(${i * 6})`} />)}
      <rect x={-10} y={-110} width={20} height={120} rx={10} fill={COR.tinta} transform={`rotate(${((4 + 47 / 60) / 12) * 360})`} />
      <rect x={-7} y={-170} width={14} height={180} rx={7} fill={COR.tinta} transform={`rotate(${(47 / 60) * 360 + seg / 10})`} />
      <rect x={-3} y={-190} width={6} height={210} fill="#D9483B" transform={`rotate(${seg * 6})`} />
      <circle r={18} fill="#D9483B" />
    </g>
  </svg>
);

const Placar: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1080, display: 'flex', justifyContent: 'center', gap: 20}}>
    <div style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 20, padding: '8px 30px', fontFamily: 'Anton, sans-serif', fontSize: 56, color: COR.tinta}}>A · SE ESCONDER</div>
    <div style={{background: COR.praca, border: `5px solid ${COR.tinta}`, borderRadius: 20, padding: '8px 24px', fontFamily: 'Anton, sans-serif', fontSize: 56, color: '#fff'}}>VENCEU</div>
  </div>
);

const C: Cena[] = [
  /* 1 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua, cam: (d) => [{t: 0, x: 1250, y: 1120, z: 0.75}, {t: d, x: 1200, y: 1100, z: 0.55}], hud: () => <Relogios rose="" so="mundo" em={0.1} />},
  /* 2 */ {W: FACHADA.W, H: FACHADA.H, lim: FACHADA.lim, topo: 'RELOJOARIA · DIA 7', fundo: (t) => <Fachada t={t} rangido={0} />, cam: (d) => [{t: 0, x: 600, y: 1300, z: 0.9}, {t: d, x: 700, y: 900, z: 1.0}],
    marcas: () => [{x: 700, y: 290, texto: 'RELOJOARIA', em: W(1, 'relojoaria', 1.5)}], lado: 'dir'},
  /* 3 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: () => <FotoClose verso={false} giro={0} letra={0} tremor={0} />, cam: (d) => [{t: 0, x: 540, y: 900, z: 1.0}, {t: d, x: 600, y: 1000, z: 1.3}], socos: [W(2, 'foto', 0.5)],
    hud: () => <Carimbo x={540} y={1240} texto="SEG · 16:46" em={W(2, 'minuto', 1.8)} tam={96} />},
  /* 4 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => { const ts = W(3, 'tocou', 0.8); return <Relojoaria t={t} ponteiro={20 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.3} sombra={0.4} sinoBalanca={t > ts ? 18 * Math.sin((t - ts) * 14) * Math.exp(-(t - ts) * 1.5) : 0} />; },
    cam: (d) => [{t: 0, x: REL.sino.x + 80, y: REL.sino.y + 60, z: 2.0}, {t: d, x: REL.sino.x + 60, y: REL.sino.y + 40, z: 2.6}], socos: [W(3, 'tocou', 0.8)]},
  /* 5 */ {...L2, topo: 'RESULTADO DO EP. 2', fundo: reloj({roseX: ROSE_B, roseExpr: 'surpresa', fotoTirada: true, portaAbre: 0.35, sombra: 0.5}), escuro: 0.5, socos: [W(4, 'a', 1.2)],
    cam: (d) => [{t: 0, x: 1000, y: 900, z: 0.9}, {t: d, x: 1000, y: 900, z: 1.0}],
    hud: () => <><Cartao titulo="LETRA A" sub="VOCÊS ESCOLHERAM" em={0.05} y={560} /><Placar /></>},
  /* 6 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', lado: 'esq', fundo: (t) => { const k = interpolate(t, [W(5, 'esconde', 0.3), W(5, 'esconde', 0.3) + 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); return <Relojoaria t={t} ponteiro={22 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.4} sombra={0.6} roseAgachada={k} />; },
    cam: (d) => [{t: 0, x: ladoRose(ROSE_B, 1.5), y: 1200, z: 1.5}, {t: d, x: ladoRose(ROSE_B, 1.4), y: 1350, z: 1.4}]},
  /* 7 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t) => <Esconderijo t={t} expr="surpresa" />, cam: (d) => [{t: 0, x: ladoRose(540, 1.3), y: 1250, z: 1.3}, {t: d, x: ladoRose(540, 1.1), y: 1150, z: 1.1}], socos: [W(6, 'joga', 0.3)], lado: 'esq'},
  /* 8 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t) => <Esconderijo t={t} expr="desconfiada" />, cam: (d) => [{t: 0, x: ladoRose(540, 1.05), y: 1300, z: 1.05, r: -4}, {t: d, x: ladoRose(540, 1.15), y: 1300, z: 1.15, r: 4}], lado: 'esq',
    marcas: () => [{x: 110, y: 1270, texto: 'CAIXA DE RELÓGIO', em: W(7, 'caixas', 0.6), tam: 30}, {x: 920, y: 1230, texto: 'PEÇAS VELHAS', em: W(7, 'velho', 1.4), tam: 30}]},
  /* 9 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t) => <Esconderijo t={t} expr="surpresa" />, tremor: 4, lado: 'esq', leg: 1500,
    cam: (d) => [{t: 0, x: ladoRose(540, 2.4), y: ROSTO_E + 60, z: 2.4}, {t: d, x: ladoRose(540, 2.9), y: ROSTO_E + 40, z: 2.9}],
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={118} para={152} unid="BPM" em={0.2} seta="▲" corNum={COR.terracota} />},
  /* 10 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t, d) => <Esconderijo t={t} expr="surpresa" sombra={interpolate(t, [0, d], [0, 1])} />, cam: (d) => [{t: 0, x: 600, y: 950, z: 1.3}, {t: d, x: 580, y: 980, z: 1.45}], leg: 470,
    hud: (d) => <Medidor x={60} y={170} rotulo="DISTÂNCIA DOS PASSOS" de={6} para={1} unid="m" casas={1} em={0.2} dur={d - 0.4} corNum={COR.terracota} seta="▼" />},
  /* 11 */ {topo: 'PELA FRESTA', render: (t, d) => <Fresta alvo="sombra" abre={interpolate(t, [0, 0.8], [0.05, 1], {extrapolateRight: 'clamp'})} />,
    hud: () => <Medidor x={60} y={170} rotulo="DETALHES" de={0} para={0} em={W(10, 'três', 2.2)} textoFinal="0 / 3" largura={360} corNum={COR.ipe} />},
  /* 12 */ {topo: 'PELA FRESTA', render: () => <Fresta alvo="tenis" />, hud: () => <Cartao titulo="DETALHE 1" sub="O TÊNIS" em={0.05} y={330} />},
  /* 13 */ {topo: 'TÊNIS × TÊNIS', render: (t) => <Comparar alvo="tenis" rotE="VISITA" rotD="ROSE" t={t} />,
    hud: () => <><Etiqueta x={162} y={1200} texto="MANCHA" em={W(12, 'mancha', 1.5)} cor={COR.terracota} corTexto="#fff" /><Etiqueta x={682} y={1200} texto="MANCHA" em={W(12, 'mancha', 1.5) + 0.25} cor={COR.terracota} corTexto="#fff" /></>},
  /* 14 */ {topo: 'PELA FRESTA', render: () => <Fresta alvo="luvas" />, hud: () => <Cartao titulo="DETALHE 2" sub="AS LUVAS" em={0.05} y={330} />},
  /* 15 */ {topo: 'LUVAS × LUVAS', render: (t) => <Comparar alvo="luvas" rotE="VISITA" rotD="ROSE" t={t} />, hud: () => <Carimbo x={540} y={420} texto="IGUAIS" em={W(14, 'mesmas', 0.3)} tam={100} />},
  /* 16 */ {topo: 'PELA FRESTA', render: () => <Fresta alvo="cabelo" />, hud: () => <Cartao titulo="DETALHE 3" sub="A FAIXA" em={0.05} y={330} />},
  /* 17 */ {topo: 'PELA FRESTA', render: (t) => <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + t * 0.12})`}}><Fresta alvo="cabelo" /></div>,
    hud: () => <Carimbo x={540} y={560} texto="BRANCO" em={W(16, 'branco', 1.0)} tam={110} cor="#ECE8E1" />},
  /* 18 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => { const tp = W(17, 'pega', 0.4); return <Relojoaria t={t} ponteiro={30 + t} roseVisivel={false} fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaSil={1} velhaBraco={t > tp ? -38 : 0} relogioPego={t > tp + 0.35} />; },
    cam: (d) => [{t: 0, x: 1080, y: 1330, z: 2.2}, {t: d, x: 1040, y: 1250, z: 2.6}], marcas: () => [{x: REL.bolso.x, y: REL.bolso.y - 60, texto: 'O RELÓGIO', em: 0.2, tam: 30}]},
  /* 19 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={32 + t} roseVisivel={false} fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaSil={0.92} velhaBraco={-20} relogioPego />,
    cam: (d) => [{t: 0, x: VELHA, y: 1300, z: 2.0}, {t: d, x: VELHA - 100, y: 1250, z: 1.4}], lado: 'esq'},
  /* 20 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t) => <Esconderijo t={t} expr="surpresa" sombra={1} />, tremor: 5, lado: 'esq', leg: 1500, socos: [W(19, 'rose', 0.6)],
    cam: (d) => [{t: 0, x: ladoRose(540, 2.6), y: ROSTO_E + 50, z: 2.6}, {t: d, x: ladoRose(540, 3.2), y: ROSTO_E + 30, z: 3.2}],
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={152} para={168} unid="BPM" em={0.3} seta="▲" corNum={COR.terracota} />},
  /* 21 */ {...EC, topo: 'ATRÁS DO BALCÃO', fundo: (t) => <Esconderijo t={t} expr="desconfiada" sombra={1} />, lado: 'esq', leg: 1500,
    cam: (d) => [{t: 0, x: ladoRose(540, 2.2), y: ROSTO_E + 80, z: 2.2}, {t: d, x: ladoRose(540, 2.5), y: ROSTO_E + 60, z: 2.5}],
    hud: () => <><Etiqueta x={400} y={560} texto="VOCÊS ESCOLHERAM A…" em={W(20, 'sabia', 0.4)} seta="baixo" /><Glitch em={W(20, 'esconder', 1.2)} /></>},
  /* 22 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t, d) => <Relojoaria t={t} ponteiro={36 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} roseAgachada={interpolate(t, [0, d], [1, 0])} velhaX={VELHA} velhaSil={0.92} velhaBraco={-20} relogioPego />,
    cam: (d) => [{t: 0, x: 1060, y: 1300, z: 1.3}, {t: d, x: 1070, y: 1150, z: 1.4}], leg: 560},
  /* 23 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => { const ts = W(22, 'senhora', 1.2); return <Relojoaria t={t} ponteiro={38 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaSil={interpolate(t, [ts - 0.2, ts + 0.5], [0.92, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} velhaBraco={-20} relogioPego />; },
    cam: (d) => [{t: 0, x: 1065, y: 1150, z: 1.4}, {t: d, x: 1100, y: 1130, z: 1.8}], socos: [W(22, 'senhora', 1.2)], leg: 540},
  /* 24 */ {topo: 'ROSTO × ROSTO', render: (t) => <Comparar alvo="rosto" rotE="ELA" rotD="ROSE" t={t} />,
    hud: () => <><Etiqueta x={279} y={950} texto="OLHOS" em={W(23, 'olhos', 0.5)} /><Etiqueta x={799} y={1050} texto="NARIZ" em={W(23, 'nariz', 1.5)} /><Etiqueta x={111} y={1150} texto="ARGOLAS" em={W(23, 'argolas', 2.6)} /></>, leg: 1500},
  /* 25 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={42 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-20} relogioPego />,
    cam: (d) => [{t: 0, x: 1065, y: 1150, z: 1.5}, {t: d, x: 1065, y: 1120, z: 1.8}], socos: [W(24, 'ela', 0.2)], leg: 560,
    hud: () => <><Ficha x={60} y={180} nome="ROSE, 63" linha2="VEIO DO FUTURO?" retrato={RET.velha} em={W(24, 'trinta', 1.0)} /><Carimbo x={760} y={430} texto="É ELA" em={W(24, 'ela', 0.2)} tam={110} /></>},
  /* 26 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', lado: 'esq', fundo: (t) => <Relojoaria t={t} ponteiro={44 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-30} velhaFalando relogioPego />,
    cam: (d) => [{t: 0, x: VELHA - 60, y: 1110, z: 2.4}, {t: d, x: VELHA - 50, y: 1105, z: 2.7}], leg: 330},
  /* 27 */ {W: RELOGIO.W, H: RELOGIO.H, topo: 'O QUE VAI ACONTECER?', fundo: (t) => <RelogioRua tremeAgulha={t > W(26, '16:48', 0.4) ? 6 * Math.sin(t * 40) : 0} />, socos: [W(26, '16:48', 0.4)],
    cam: (d) => [{t: 0, x: 540, y: 800, z: 1.1}, {t: d, x: 540, y: 760, z: 1.4}], hud: () => <Carimbo x={540} y={330} texto="16:48?" em={W(26, '16:48', 0.4)} tam={130} />},
  /* 28 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', lado: 'esq', fundo: (t) => <Relojoaria t={t} ponteiro={48 + t} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaBraco={-30} velhaFalando relogioPego />, tremor: 2,
    cam: (d) => [{t: 0, x: ladoRose(ROSE_B, 2.2), y: 1160, z: 2.2}, {t: d, x: ladoRose(ROSE_B, 2.6), y: 1145, z: 2.6}]},
  /* 29 */ {topo: 'O RELÓGIO DE BOLSO', render: (t, d) => <BolsoGrande seg={t < 0.8 ? t : 0.8 + (t - 0.8) ** 2 * 18} />, tremor: 3,
    hud: (d) => <Medidor x={60} y={170} rotulo="VELOCIDADE DO RELÓGIO" de={1} para={4} prefixo="×" em={0.6} dur={d - 0.8} corNum={COR.terracota} seta="▲" largura={520} />},
  /* 30 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={60 + t * 4} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="desconfiada" velhaBraco={-30} velhaFalando relogioPego />,
    cam: (d) => [{t: 0, x: 1065, y: 1180, z: 1.5}, {t: d, x: 1065, y: 1160, z: 1.35}], leg: 560},
  /* 31 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={64 + t * 4} roseX={ROSE_B} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="desconfiada" velhaBraco={-30} relogioPego />, tremor: 3, leg: null,
    cam: (d) => [{t: 0, x: 1060, y: 1010, z: 1.2}, {t: d, x: 1060, y: 1000, z: 1.35}],
    hud: () => <CartaoAB a="" b="" emA={999} emB={999} y={240} contagem={{em: 0, dur: CONT_DUR}} />},
  /* 32 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={70 + t * 4} roseX={ROSE_B} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-30} relogioPego />, leg: null,
    cam: (d) => [{t: 0, x: 1060, y: 1050, z: 1.1}, {t: d, x: 1150, y: 1050, z: 1.15}],
    marcas: () => [{x: VELHA, y: 940, texto: 'ROSE DO FUTURO', em: W(31, 'a', 0.3) + 0.3, cor: '#E3C77A'}],
    hud: () => <CartaoAB a="CONFIAR E IR COM ELA" b="NÃO ACREDITAR E FUGIR" emA={W(31, 'a', 0.3)} emB={999} y={240} contagem={{em: -(T.INI[31] - CONT_INI), dur: CONT_DUR}} />},
  /* 33 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={76 + t * 4} roseX={ROSE_B} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-30} relogioPego />, leg: null,
    cam: (d) => [{t: 0, x: 1150, y: 1050, z: 1.1}, {t: d, x: 1500, y: 1040, z: 1.05}],
    marcas: () => [{x: 1810, y: 590, texto: 'FUNDOS', em: W(32, 'b', 0.3) + 0.3, cor: COR.ceu}],
    hud: () => <CartaoAB a="CONFIAR E IR COM ELA" b="NÃO ACREDITAR E FUGIR" emA={-2} emB={W(32, 'b', 0.3)} y={240} contagem={{em: -(T.INI[32] - CONT_INI), dur: CONT_DUR}} />},
  /* 34 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={84 + t * 4} roseX={ROSE_B} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-30} relogioPego />, leg: null,
    cam: (d) => [{t: 0, x: ladoRose(ROSE_B, 1.6), y: 970, z: 1.6}, {t: d, x: ladoRose(ROSE_B, 2.0), y: 995, z: 2.0}],
    hud: () => <><CartaoAB a="CONFIAR E IR COM ELA" b="NÃO ACREDITAR E FUGIR" emA={-2} emB={-2} y={240} contagem={{em: -(T.INI[33] - CONT_INI), dur: CONT_DUR}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', marginRight: 100}}><span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '10px 40px', fontFamily: 'Anton, sans-serif', fontSize: 64, color: COR.tinta}}>COMENTA A OU B</span></div></>},
];

export const Ep03: React.FC = () => <Episodio T={T} C={C} audio="ep03/audio.mp3" destaques={DEST} topoPadrao="CENTRO · SEG · 16:47" />;
