// Ep. 4 "16:48": 31 cenas presas aos tempos reais da voz (tempos-ep04.json).
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import TEMPOS from './tempos-ep04.json';
import {Camera} from './camera';
import {Etiqueta, Ficha, Medidor, Cartao, Carimbo, Relogios, CartaoAB, COR} from './pecas';
import {Rua, RUA, POS} from './cenarios';
import {Relojoaria, LOJA2, FotoClose} from './cenarios2';
import {Ladeira, LADEIRA, ruaY, OnibusDentro, DENTRO, Freio, GENTE4} from './cenarios4';
import {pessoa, FIG, rose} from './arte';
import {Cena, Episodio, Glitch, ladoRose, tempos} from './episodio';

const T = tempos(TEMPOS as any);
const {W} = T;
export const DURACAO04 = T.DUR;
const DEST = new Set(['mesma', 'velha', 'confia', 'parada', 'preciosa', 'corda', '30', 'flores', 'onibus', '1648', 'freio', 'ladeira', 'praca', 'dentro', 'mudou', 'congelada', 'jorge', 'dormindo', 'rachada', 'tres', 'bilhete', 'relogio', 'branca', 'minha', 'acordado', 'rapido', 'comecar', 'consertar', 'tirar']);
const RET = {velha: rose({expr: 'feliz', velha: true, corpo: false}), jorge: pessoa(FIG.jorge), sandra: pessoa(GENTE4.sandra), davi: pessoa(GENTE4.davi)};
const L2 = {W: LOJA2.W, H: LOJA2.H, lim: LOJA2.lim};
const LD = {W: LADEIRA.W, H: LADEIRA.H, lim: LADEIRA.lim};
const DT = {W: DENTRO.W, H: DENTRO.H, lim: DENTRO.lim};
const VELHA = 1180, ROSE_B = 950;
const RX = 980, VX = 820; // Roses na frente do ônibus, na ladeira
const BX = 1100;          // ônibus na ladeira
const rostoL = (x: number) => ruaY(x) - 70 - 850 + 112; // altura do rosto na ladeira (escala 0.5)
const CONT_INI = T.INI[27], CONT_DUR = T.DUR - 0.8 - T.INI[27];
const sepia = (n: React.ReactNode) => <div style={{position: 'absolute', inset: 0, filter: 'sepia(.85) contrast(1.05) brightness(.95)'}}>{n}</div>;

/** relógio de bolso em close, com a coroa da corda */
const Bolso: React.FC<{seg: number; corda?: number}> = ({seg, corda = 0}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute'}}>
    <rect width="1080" height="1920" fill="#3B2A1E" />
    <path d="M-60,1500 C200,1300 380,1240 520,1240 L640,1280 C700,1320 660,1400 600,1420 L360,1500 L200,1900 L-60,1900Z" fill="#AF7A58" stroke={COR.tinta} strokeWidth={4} />
    <path d="M300,1330 C330,1320 360,1322 380,1334 M260,1370 C300,1360 340,1362 360,1374" stroke={COR.tinta} strokeWidth={3} fill="none" opacity={0.5} />
    <g transform="translate(540,900)">
      <path d="M90,-260 C220,-360 330,-240 340,-120" stroke="#C9A04A" strokeWidth={14} fill="none" />
      <g transform={`translate(0,-274) rotate(${corda})`}><rect x={-34} y={-30} width={68} height={56} rx={12} fill="#E2B85C" stroke={COR.tinta} strokeWidth={6} />{[-24, -12, 0, 12, 24].map((x) => <path key={x} d={`M${x},-26 L${x},22`} stroke="#8A6A40" strokeWidth={4} />)}</g>
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
    <div style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 20, padding: '8px 30px', fontFamily: 'Anton, sans-serif', fontSize: 56, color: COR.tinta}}>A · CONFIAR</div>
    <div style={{background: COR.praca, border: `5px solid ${COR.tinta}`, borderRadius: 20, padding: '8px 24px', fontFamily: 'Anton, sans-serif', fontSize: 56, color: '#fff'}}>VENCEU</div>
  </div>
);
const rel = (o: any = {}) => (t: number) => <Relojoaria t={t} ponteiro={50 + t} roseX={ROSE_B} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={0.3} velhaX={VELHA} velhaExpr="feliz" velhaBraco={-30} relogioPego {...o} />;
const ld = (o: any = {}) => (t: number) => <Ladeira t={t} roseX={RX} velhaX={VX} {...o} />;
const ab = (a: number, b: number, i: number) => ({em: -(T.INI[i] - CONT_INI), dur: CONT_DUR});

const C: Cena[] = [
  /* 1 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: rel(), cam: (d) => [{t: 0, x: 1065, y: 1150, z: 1.6}, {t: d, x: 1065, y: 1100, z: 1.2}], leg: 560},
  /* 2 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: rel(), cam: (d) => [{t: 0, x: VELHA - 60, y: 1110, z: 2.3}, {t: d, x: VELHA - 50, y: 1105, z: 2.7}], leg: 330, socos: [W(1, 'mesma', 0.2)],
    hud: () => <Ficha x={60} y={1350} nome="ROSE, 63" linha2="ELA MESMA, DO FUTURO" retrato={RET.velha} em={W(1, 'velha', 1.5)} />},
  /* 3 */ {...L2, topo: 'RESULTADO DO EP. 3', fundo: rel(), escuro: 0.5, socos: [W(2, 'a', 1.2)], cam: (d) => [{t: 0, x: 1000, y: 900, z: 0.9}, {t: d, x: 1000, y: 900, z: 1.0}],
    hud: () => <><Cartao titulo="LETRA A" sub="VOCÊS ESCOLHERAM" em={0.05} y={560} /><Placar /></>},
  /* 4 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t, d) => { const k = interpolate(t, [0.2, d], [0, 1], {extrapolateLeft: 'clamp'}); return <Relojoaria t={t} ponteiro={52 + t} roseX={720 - 380 * k} roseAndando={k > 0 && k < 1} roseExpr="feliz" fotoTirada portaAbre={0.9} sombra={0} velhaX={900 - 380 * k} velhaAndando={k > 0 && k < 1} velhaExpr="feliz" relogioPego />; },
    cam: (d) => [{t: 0, x: 800, y: 1250, z: 1.0}, {t: d, x: 560, y: 1250, z: 1.0}], leg: 560},
  /* 5 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: (t, d) => { const k = t / d; const p: any = {congelado: 1, roseX: 700 + 700 * k, velhaX: 560 + 700 * k, roseAndando: true, velhaAndando: true, roseExpr: 'desconfiada', joaoX: POS.joao, onibusX: -20, cafeSuspenso: false, roseT: t}; return [<Rua key="b" {...p} camada="base" />, <Rua key="r" {...p} camada="rose" />]; },
    cam: (d) => [{t: 0, x: 760, y: 1250, z: 1.2}, {t: d, x: 1460, y: 1250, z: 1.2}], leg: 560, hud: () => <Relogios rose="DIA 7 · 19:40" em={0.2} y={170} />},
  /* 6 */ {topo: 'O RELÓGIO DE BOLSO', render: (t) => <Bolso seg={t} />, hud: () => <Etiqueta x={540} y={560} texto="A CHAVE DE TUDO" em={W(5, 'relógio', 0.8)} />},
  /* 7 */ {topo: 'O RELÓGIO DE BOLSO', render: (t) => <Bolso seg={t + 4} corda={t > W(6, 'corda', 2.0) ? (t - W(6, 'corda', 2.0)) * 200 : 0} />,
    hud: () => <Medidor x={60} y={170} rotulo="CORDA DO RELÓGIO" de={100} para={74} unid="%" em={W(6, 'corda', 2.0)} barra={100} corNum={COR.terracota} seta="▼" />},
  /* 8 */ {topo: 'O RELÓGIO DE BOLSO', render: (t) => <Bolso seg={t + 7} />, escuro: 0.4, hud: () => <Cartao titulo="30 DIAS" sub="DE CORDA" em={W(7, '30', 1.0)} y={560} />},
  /* 9 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({roseX: 420, velhaX: 300, expr: 'desconfiada'}), cam: (d) => [{t: 0, x: 400, y: 900, z: 1.2}, {t: d, x: 1300, y: 1150, z: 0.75}],
    marcas: () => [{x: 1000, y: ruaY(1000) - 520, texto: 'RUA DAS FLORES · DESCIDA', em: W(8, 'flores', 1.0)}]},
  /* 10 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({roseX: 420, velhaX: 300, expr: 'surpresa'}), cam: (d) => [{t: 0, x: 1200, y: 1300, z: 0.95}, {t: d, x: 1420, y: 1380, z: 1.35}],
    marcas: () => [{x: 1420, y: ruaY(1420) - 330, texto: '8012 · O DELA', em: W(9, 'ônibus', 1.0)}]},
  /* 11 */ {topo: 'LEMBRANÇA DA ROSE · 16:48', render: (t, d) => sepia(<Camera chaves={[{t: 0, x: 1400, y: 1380, z: 1.2}, {t: d, x: 1600, y: 1450, z: 1.05}]} {...LD}><Ladeira t={t} onibusDx={interpolate(t, [W(10, 'freio', 1.5), d], [0, 120], {extrapolateLeft: 'clamp'})} /></Camera>),
    socos: [], hud: () => <Carimbo x={540} y={420} texto="16:48 · SEM FREIO" em={W(10, 'freio', 1.5)} tam={90} />},
  /* 12 */ {topo: 'LEMBRANÇA DA ROSE · 16:48', tremor: 4, render: (t, d) => sepia(<Camera chaves={[{t: 0, x: 1650, y: 1500, z: 1.0}, {t: d, x: 2000, y: 1600, z: 0.95}]} {...LD} tremor={4}><Ladeira t={t} onibusDx={120 + interpolate(t, [0, d], [0, 520])} /></Camera>),
    hud: (d) => <Medidor x={60} y={170} rotulo="VELOCIDADE DO 8012" de={0} para={62} unid="km/h" em={0.05} dur={d} corNum={COR.terracota} seta="▲" />},
  /* 13 */ {topo: 'LEMBRANÇA DA ROSE · 16:48', render: (t, d) => sepia(<Camera chaves={[{t: 0, x: 2150, y: 1620, z: 1.1}, {t: d, x: 2350, y: 1700, z: 1.6}]} {...LD}><Ladeira t={t} onibusDx={640} /></Camera>),
    hud: () => <Etiqueta x={540} y={760} texto="PRAÇA · 37 PESSOAS" em={W(12, 'praça', 0.6)} cor={COR.terracota} corTexto="#fff" />},
  /* 14 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({velhaExpr: 'desconfiada', falando: true}), cam: (d) => [{t: 0, x: VX, y: rostoL(VX) + 30, z: 2.3}, {t: d, x: VX, y: rostoL(VX) + 25, z: 2.7}], leg: 330},
  /* 15 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({expr: 'surpresa', falando: true}), cam: (d) => [{t: 0, x: RX - 60, y: rostoL(RX) + 30, z: 2.3}, {t: d, x: RX - 60, y: rostoL(RX) + 25, z: 2.7}], leg: 330},
  /* 16 */ {...DT, topo: 'DENTRO DO 8012', fundo: (t) => <OnibusDentro t={t} />, cam: (d) => [{t: 0, x: 500, y: 900, z: 0.9}, {t: d, x: 1400, y: 900, z: 0.9}],
    hud: (d) => <Medidor x={60} y={170} rotulo="PASSAGEIROS CONGELADOS" de={0} para={14} em={0.2} dur={d - 0.4} corNum={COR.azul} />},
  /* 17 */ {...DT, topo: 'DENTRO DO 8012', fundo: (t) => <OnibusDentro t={t} />, cam: (d) => [{t: 0, x: 1700, y: 900, z: 1.4}, {t: d, x: 1820, y: 830, z: 1.9}],
    hud: () => <Ficha x={60} y={180} nome="SEU JORGE, 55" linha2="MOTORISTA DO 8012" retrato={RET.jorge} em={W(16, 'jorge', 0.4)} />},
  /* 18 */ {...DT, topo: 'DENTRO DO 8012', fundo: (t) => <OnibusDentro t={t} />, cam: (d) => [{t: 0, x: 1180, y: 900, z: 1.6}, {t: d, x: 1160, y: 960, z: 2.0}],
    hud: () => <><Ficha x={60} y={180} nome="SANDRA, 30" linha2="MÃE" retrato={RET.sandra} em={W(17, 'mãe', 0.3)} /><Ficha x={60} y={380} nome="DAVI, 4" linha2="DORMINDO" retrato={RET.davi} em={W(17, 'dormindo', 1.6)} lado={1} rot={3} /></>},
  /* 19 */ {topo: 'EMBAIXO DO 8012', render: (t, d) => <Camera chaves={[{t: 0, x: 600, y: 760, z: 1.0}, {t: W(18, 'rachada', 1.2), x: 610, y: 870, z: 1.6}, {t: d, x: 618, y: 1000, z: 2.0}]} W={1080} H={1920}><Freio t={t} gota={t} /></Camera>,
    hud: () => <><Etiqueta x={540} y={560} texto="MANGUEIRA DO FREIO" em={W(18, 'freio', 0.3)} /><Etiqueta x={540} y={1060} texto="RACHADURA" em={W(18, 'rachada', 1.2)} cor={COR.terracota} corTexto="#fff" /><Medidor x={60} y={170} rotulo="FLUIDO DO FREIO" de={100} para={12} unid="%" em={W(18, 'pingando', 2.0)} barra={100} corNum={COR.terracota} seta="▼" /></>},
  /* 20 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({velhaExpr: 'desconfiada', falando: true}), cam: (d) => [{t: 0, x: 1100, y: 1200, z: 1.0}, {t: d, x: 1100, y: 1180, z: 1.1}], leg: 560,
    hud: () => <Relogios rose="DIA 7 · 20:05" em={0.2} y={170} />},
  /* 21 */ {W: 1080, H: 1920, topo: 'O BILHETE', fundo: (t) => { const g = interpolate(t, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}); return <FotoClose verso={g > 0.5} giro={g} letra={1} tremor={0} />; }, cam: (d) => [{t: 0, x: 540, y: 900, z: 1.0}, {t: d, x: 540, y: 880, z: 1.1}], leg: 1500},
  /* 22 */ {W: 1080, H: 1920, topo: 'O BILHETE', fundo: () => <FotoClose verso giro={1} letra={1} tremor={0} />, cam: (d) => [{t: 0, x: 520, y: 880, z: 1.3}, {t: d, x: 520, y: 880, z: 1.5}], leg: null},
  /* 23 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({}), cam: (d) => [{t: 0, x: (RX + VX) / 2, y: rostoL(RX) + 40, z: 1.7}, {t: d, x: (RX + VX) / 2, y: rostoL(RX) + 35, z: 1.9}], leg: 330},
  /* 24 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({velhaExpr: 'surpresa'}), tremor: 3, cam: (d) => [{t: 0, x: VX, y: rostoL(VX) + 30, z: 2.5}, {t: d, x: VX, y: rostoL(VX) + 25, z: 3.0}], leg: 330,
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE DE 63" de={80} para={140} unid="BPM" em={0.2} seta="▲" corNum={COR.terracota} largura={520} />},
  /* 25 */ {W: 1080, H: 1920, topo: 'O BILHETE', fundo: (t) => <FotoClose verso giro={1} letra={1} tremor={Math.sin(t * 40) * 1.5} />, tremor: 3, socos: [W(24, 'minha', 0.8)], cam: (d) => [{t: 0, x: 540, y: 880, z: 1.2}, {t: d, x: 540, y: 880, z: 1.35}],
    hud: () => <Carimbo x={540} y={1300} texto="NÃO É DELA" em={W(24, 'minha', 0.8)} tam={110} />},
  /* 26 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: (t) => { const p: any = {congelado: 1, roseX: 1060, velhaX: 900, roseExpr: 'surpresa', joaoX: POS.joao, onibusX: -20, cafeSuspenso: false, roseT: t}; return [<Rua key="b" {...p} camada="base" />, <Rua key="r" {...p} camada="rose" />]; },
    cam: (d) => [{t: 0, x: 1100, y: 1150, z: 0.8}, {t: d, x: 1200, y: 1060, z: 0.46}], leg: 560,
    hud: () => <><Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={2} para={3} em={0.1} dur={W(25, 'acordado', 1.0)} textoFinal="2 → 3?" largura={560} corNum={COR.terracota} /><Glitch em={W(25, 'acordado', 1.0)} /></>},
  /* 27 */ {topo: 'O RELÓGIO DE BOLSO', tremor: 4, render: (t) => <Bolso seg={10 + t * 5 + t * t * 8} corda={-t * 120} />,
    hud: (d) => <Medidor x={60} y={170} rotulo="CORDA DO RELÓGIO" de={74} para={61} unid="%" em={0.3} dur={d - 0.5} barra={100} corNum={COR.terracota} seta="▼" />},
  /* 28 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({expr: 'desconfiada'}), tremor: 2, leg: null, cam: (d) => [{t: 0, x: 1150, y: 560, z: 0.85}, {t: d, x: 1150, y: 540, z: 0.9}],
    hud: () => <CartaoAB a="" b="" emA={999} emB={999} y={240} contagem={{em: 0, dur: CONT_DUR}} />},
  /* 29 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({expr: 'desconfiada'}), leg: null, cam: (d) => [{t: 0, x: 1300, y: 1250, z: 1.2}, {t: d, x: BX + 500, y: ruaY(BX + 500) - 60, z: 1.8}],
    marcas: () => [{x: BX + 500, y: ruaY(BX + 500) - 30, texto: 'FREIO', em: W(28, 'a', 0.3) + 0.3, cor: COR.ipe}],
    hud: () => <CartaoAB a="CONSERTAR O FREIO" b="TIRAR TODO MUNDO" emA={W(28, 'a', 0.3)} emB={999} y={240} contagem={ab(0, 0, 28)} />},
  /* 30 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({expr: 'desconfiada'}), leg: null, cam: (d) => [{t: 0, x: BX + 500, y: ruaY(BX + 500) - 60, z: 1.8}, {t: d, x: BX + 540, y: ruaY(BX + 540) - 230, z: 1.6}],
    marcas: () => [{x: BX + 560, y: ruaY(BX + 560) - 290, texto: 'PORTA', em: W(29, 'b', 0.3) + 0.3, cor: COR.ceu}],
    hud: () => <CartaoAB a="CONSERTAR O FREIO" b="TIRAR TODO MUNDO" emA={-2} emB={W(29, 'b', 0.3)} y={240} contagem={ab(0, 0, 29)} />},
  /* 31 */ {...LD, topo: 'RUA DAS FLORES · DIA 7', fundo: ld({expr: 'desconfiada', velhaExpr: 'desconfiada'}), leg: null, cam: (d) => [{t: 0, x: (RX + VX) / 2, y: rostoL(RX) - 119, z: 1.6}, {t: d, x: (RX + VX) / 2, y: rostoL(RX) - 105, z: 1.8}],
    hud: () => <><CartaoAB a="CONSERTAR O FREIO" b="TIRAR TODO MUNDO" emA={-2} emB={-2} y={240} contagem={ab(0, 0, 30)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', marginRight: 100}}><span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '10px 40px', fontFamily: 'Anton, sans-serif', fontSize: 64, color: COR.tinta}}>COMENTA A OU B</span></div></>},
];

export const Ep04: React.FC = () => <Episodio T={T} C={C} audio="ep04/audio.mp3" destaques={DEST} topoPadrao="CENTRO · SEG · 16:47" />;
