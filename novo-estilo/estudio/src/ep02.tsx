// Ep. 2 "O rastro na poeira": 38 cenas presas aos tempos reais da voz (tempos-ep02.json).
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import TEMPOS from './tempos-ep02.json';
import {Camera} from './camera';
import {Etiqueta, Ficha, Medidor, Cartao, Carimbo, Relogios, CartaoAB, COR} from './pecas';
import {Rua, RUA, POS, Celular, RelogioRua, RELOGIO} from './cenarios';
import {PoeiraRua, Praca, PRACA, Ponte, PONTE, Beco, BECO, Fachada, FACHADA, Relojoaria, LOJA2, REL, FotoClose, MapaRastro, GENTE2} from './cenarios2';
import {pessoa, rose} from './arte';
import {Cena, Episodio, Glitch, MarcasView, ladoRose, tempos} from './episodio';

const T = tempos(TEMPOS as any);
const {W} = T;
export const DURACAO02 = T.DUR;

const DEST = new Set(['parou', 'rose', 'unica', 'acordada', 'alguem', 'nome', 'um', 'mensagem', '1647', 'todo', 'acordado', 'dentro', 'dois', 'poeira', 'buraco', 'pessoa', 'depois', 'tres', 'caminho', 'praca', 'ponte', 'quilometros', 'porta', 'relojoaria', 'relogios', 'menos', 'andando', 'tic', 'tac', 'congelado', 'entregar', 'foto', 'segundafeira', '1646', 'antes', 'vigiando', 'volto', 'sino', 'entrando', 'dez']);

const RET = {rose: rose({expr: 'desconfiada', corpo: false}), aurelio: pessoa(GENTE2.aurelio), zefa: pessoa(GENTE2.zefa), toninho: pessoa(GENTE2.toninho)};

type RuaP = Partial<React.ComponentProps<typeof Rua>>;
const rua = (o: RuaP = {}, tuneis?: {x: number; o?: number; c?: number}[]) => (t: number) => {
  const p: any = {congelado: 1, roseX: 1060, joaoX: POS.joao, onibusX: -20, cafeSuspenso: false, roseT: t, ...o};
  return [<React.Fragment key="b"><Rua {...p} camada="base" />{tuneis ? <PoeiraRua tuneis={tuneis} /> : null}</React.Fragment>, <Rua key="r" {...p} camada="rose" />];
};
const cartao = (titulo: string, sub: string, x = 1200): Cena => ({W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseX: 1060}), escuro: 0.45, cam: (d) => [{t: 0, x, y: 1150, z: 0.85}, {t: d, x, y: 1150, z: 0.98}], socos: [0.35], hud: () => <Cartao titulo={titulo} sub={sub} em={0.05} />});
const MSG = ['Você não é a única acordada.'];
const reloj = (o: Partial<React.ComponentProps<typeof Relojoaria>> = {}) => (t: number) => <Relojoaria t={t} ponteiro={t} {...o} />;
const L2 = {W: LOJA2.W, H: LOJA2.H, lim: LOJA2.lim};
const ROSE_REL = 700;
// contagem de 10 s: começa na cena 36 e vai até o fim
const CONT_INI = T.INI[35], CONT_DUR = T.DUR - 0.6 - T.INI[35];

const C: Cena[] = [
  /* 1 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseExpr: 'desconfiada'}), cam: (d) => [{t: 0, x: 1250, y: 1120, z: 0.75}, {t: d, x: 1200, y: 1100, z: 0.55}],
    hud: () => <><Relogios rose="" so="mundo" em={0.1} /><Etiqueta x={540} y={560} texto="NO EPISÓDIO 1…" em={0.05} seta="baixo" /></>},
  /* 2 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseExpr: 'surpresa'}), lado: 'esq', cam: (d) => [{t: 0, x: ladoRose(1060, 1.8), y: 1250, z: 1.8}, {t: d, x: ladoRose(1060, 2.3), y: 1210, z: 2.3}],
    hud: () => <Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={1} para={1} em={0.1} largura={520} corNum={COR.ipe} />},
  /* 3 */ {W: 1080, H: 1920, topo: 'CELULAR DO SEU JOÃO', fundo: () => <Celular linhas={MSG} mostrar={[1]} />, cam: (d) => [{t: 0, x: 540, y: 700, z: 1.1}, {t: d, x: 540, y: 760, z: 1.5}],
    hud: () => <Glitch em={W(2, 'acordada', 2.5)} />},
  /* 4 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseExpr: 'desconfiada'}), lado: 'esq', cam: (d) => [{t: 0, x: ladoRose(1060, 1.4), y: 1300, z: 1.4, r: -3}, {t: d, x: ladoRose(1060, 1.6), y: 1280, z: 1.6, r: 3}],
    hud: () => <Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={1} para={2} em={0.1} dur={W(3, 'alguém', 1.2)} textoFinal="1 → ?" largura={560} corNum={COR.terracota} />},
  /* 5 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, fundo: rua({roseExpr: 'surpresa'}), lado: 'esq', cam: (d) => [{t: 0, x: ladoRose(1060, 2.5), y: 1180, z: 2.5}, {t: d, x: ladoRose(1060, 3.0), y: 1165, z: 3.0}], socos: [W(4, 'nome', 1.0)],
    hud: () => <><Ficha x={60} y={180} nome="ROSE, 33" linha2="FAXINEIRA" retrato={RET.rose} em={0.2} /><Carimbo x={330} y={640} texto="CONHECIDA" em={W(4, 'nome', 1.0)} tam={90} /></>},
  /* 6 */ {...cartao('PISTA 1', 'A MENSAGEM'), topo: 'CENTRO · DIA 7'},
  /* 7 */ {W: 1080, H: 1920, topo: 'CELULAR DO SEU JOÃO', fundo: () => <Celular linhas={MSG} mostrar={[1]} />, cam: (d) => [{t: 0, x: 540, y: 600, z: 1.3}, {t: d, x: 540, y: 520, z: 1.8}],
    marcas: () => [{x: 540, y: 330, texto: 'HORÁRIO: 16:47', em: W(6, 'horário', 0.8)}]},
  /* 8 */ {W: RELOGIO.W, H: RELOGIO.H, topo: 'CENTRO · DIA 7', fundo: () => <RelogioRua tremeAgulha={0} />, cam: (d) => [{t: 0, x: 540, y: 820, z: 1.1}, {t: d, x: 540, y: 780, z: 1.35}], socos: [W(7, 'marca', 2.5)],
    hud: () => <><Relogios rose="" so="mundo" em={0.2} y={1190} /><Carimbo x={540} y={330} texto="TODO RELÓGIO: 16:47" em={W(7, 'marca', 2.5)} tam={76} /></>},
  /* 9 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'CENTRO · DIA 7', fundo: rua({roseExpr: 'desconfiada'}), lado: 'esq', cam: (d) => [{t: 0, x: ladoRose(1060, 2.0), y: 1220, z: 2.0}, {t: d, x: ladoRose(1060, 2.5), y: 1190, z: 2.5}],
    hud: () => <Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={90} para={118} unid="BPM" em={0.3} seta="▲" corNum={COR.terracota} />},
  /* 10 */ {...cartao('PISTA 2', 'A POEIRA', 600), topo: 'FRENTE DA PADARIA · DIA 7'},
  /* 11 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'FRENTE DA PADARIA · DIA 7', fundo: rua({roseX: 520, roseExpr: 'desconfiada'}, [{x: 160}]), cam: (d) => [{t: 0, x: 620, y: 1250, z: 1.5}, {t: d, x: 380, y: 1200, z: 1.9}],
    marcas: () => [{x: 330, y: 1030, texto: 'POEIRA PARADA · DIA 1', em: W(10, 'parada', 0.8)}], lado: 'dir'},
  /* 12 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'FRENTE DA PADARIA · DIA 7', fundo: rua({roseX: 520, roseExpr: 'surpresa'}, [{x: 160}]), cam: (d) => [{t: 0, x: 300, y: 1450, z: 1.3}, {t: d, x: 230, y: 1420, z: 1.6}],
    marcas: () => [{x: 160, y: 960, texto: 'BURACO', em: W(11, 'buraco', 1.2), cor: COR.terracota, corTexto: '#fff'}], lado: 'dir'},
  /* 13 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'FRENTE DA PADARIA · DIA 7', fundo: (t) => rua({roseX: 520, roseExpr: 'surpresa'}, [{x: 160, c: Math.min(1, t * 2)}])(t), cam: (d) => [{t: 0, x: 240, y: 1700, z: 1.5}, {t: d, x: 240, y: 1180, z: 1.5}],
    hud: () => <Medidor x={60} y={170} rotulo="ALTURA DO BURACO" de={0} para={1.82} unid="m" casas={2} em={0.1} dur={1.0} corNum={COR.terracota} />, lado: 'dir'},
  /* 14 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'FRENTE DA PADARIA · DIA 7', fundo: (t, d) => rua({roseX: interpolate(t, [0, 1.2], [520, 175], {extrapolateRight: 'clamp'}), roseAndando: t < 1.2, roseExpr: 'desconfiada'}, [{x: 160, c: 1}])(t), cam: (d) => [{t: 0, x: 360, y: 1300, z: 1.25}, {t: d, x: 300, y: 1280, z: 1.4}], socos: [W(13, 'depois', 1.5)],
    hud: () => <Carimbo x={720} y={640} texto="RASTRO" em={W(13, 'depois', 1.5)} tam={110} />, lado: 'dir'},
  /* 15 */ {...cartao('PISTA 3', 'O CAMINHO', 1000), topo: 'FRENTE DA PADARIA · DIA 7'},
  /* 16 */ {W: RUA.W, H: RUA.H, lim: RUA.lim, topo: 'SEGUINDO O RASTRO · DIA 7', fundo: (t, d) => rua({roseX: interpolate(t, [0, d], [300, 1250]), roseAndando: true, roseExpr: 'desconfiada'}, [{x: 160, o: 0.8, c: 0.5}, {x: 600, o: 0.9, c: 0.6}, {x: 1000, o: 0.9, c: 0.6}, {x: 1420, o: 0.9, c: 0.6}, {x: 1800, o: 0.9, c: 0.6}])(t),
    cam: (d) => [{t: 0, x: ladoRose(300, 1.1), y: 1300, z: 1.1}, {t: d, x: ladoRose(1250, 1.1), y: 1300, z: 1.1}], lado: 'esq',
    hud: (d) => <Medidor x={60} y={170} rotulo="BURACOS NA POEIRA" de={1} para={37} em={0.1} dur={d - 0.3} corNum={COR.terracota} />},
  /* 17 */ {topo: 'PRAÇA · PONTE · RUA DE TRÁS', render: (t, d) => {
      const tp = W(16, 'ponte', 0.7), tr = W(16, 'rua', 1.4);
      if (t < tp) return <><Camera chaves={[{t: 0, x: 800, y: 1300, z: 0.95}, {t: tp, x: 760, y: 1280, z: 1.05}]} W={PRACA.W} H={PRACA.H} lim={{x0: 0, y0: -900, x1: 1600, y1: 1920}}><Praca t={t} roseX={1450} /></Camera>
        <Ficha x={60} y={180} nome="DONA ZEFA, 66" linha2="PIPOQUEIRA" retrato={RET.zefa} em={0.15} /><Etiqueta x={540} y={1080} texto="PRAÇA" em={0.05} /></>;
      if (t < tr) return <><Camera chaves={[{t: tp, x: 800, y: 1150, z: 0.9}, {t: tr, x: 860, y: 1120, z: 1.0}]} W={PONTE.W} H={PONTE.H} lim={{x0: 0, y0: -900, x1: 1600, y1: 1920}}><Ponte t={t} /></Camera>
        <Ficha x={60} y={180} nome="TONINHO, 40" linha2="PESCADOR" retrato={RET.toninho} em={tp + 0.1} /><Etiqueta x={540} y={1080} texto="PONTE" em={tp} /></>;
      return <><Camera chaves={[{t: tr, x: 540, y: 1150, z: 1.0}, {t: d, x: 540, y: 1100, z: 1.15}]} W={BECO.W} H={BECO.H} lim={{x0: 0, y0: -700, x1: 1080, y1: 1920}}><Beco t={t} /></Camera><Etiqueta x={540} y={1080} texto="RUA DE TRÁS" em={tr} /></>;
    }},
  /* 18 */ {W: 1080, H: 1920, topo: 'VILA ESPERANÇA · DIA 7', fundo: (t, d) => <MapaRastro prog={interpolate(t, [0, d - 0.2], [0.35, 1], {extrapolateRight: 'clamp'})} />, cam: (d) => [{t: 0, x: 540, y: 1150, z: 1.0}, {t: d, x: 500, y: 1350, z: 1.05}],
    hud: (d) => <Medidor x={60} y={170} rotulo="DISTÂNCIA DO RASTRO" de={0} para={2.5} unid="km" casas={1} em={0.05} dur={d - 0.3} corNum={COR.terracota} />},
  /* 19 */ {W: FACHADA.W, H: FACHADA.H, lim: FACHADA.lim, topo: 'RELOJOARIA · DIA 7', fundo: (t) => <Fachada t={t} rangido={interpolate(t, [W(18, 'porta', 1.2), W(18, 'porta', 1.2) + 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />,
    cam: (d) => [{t: 0, x: 620, y: 1350, z: 0.9}, {t: d, x: 800, y: 1200, z: 1.1}], marcas: () => [{x: 830, y: 690, texto: 'FIM DO RASTRO', em: W(18, 'porta', 1.2), cor: COR.terracota, corTexto: '#fff'}], lado: 'dir'},
  /* 20 */ {W: FACHADA.W, H: FACHADA.H, lim: FACHADA.lim, topo: 'RELOJOARIA · DIA 7', fundo: (t) => <Fachada t={t + 2} rangido={1} />, cam: (d) => [{t: 0, x: 700, y: 560, z: 1.0}, {t: d, x: 700, y: 480, z: 1.3}]},
  /* 21 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: reloj({roseX: ROSE_REL}), cam: (d) => [{t: 0, x: 760, y: 420, z: 1.15}, {t: d, x: 1450, y: 440, z: 1.15}],
    hud: () => <Medidor x={60} y={1100} rotulo="RELÓGIOS NA PAREDE" de={0} para={112} em={W(20, 'coberta', 1.0)} dur={1.2} corNum={COR.azul} />},
  /* 22 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: reloj({roseX: ROSE_REL}), cam: (d) => [{t: 0, x: 960, y: 260, z: 2.3}, {t: d, x: 1250, y: 260, z: 2.3}],
    marcas: () => [{x: 960, y: 158, texto: '16:47', em: 0.2}, {x: 1100, y: 52, texto: '16:47', em: 0.5}, {x: 1280, y: 262, texto: '16:47', em: 0.8}]},
  /* 23 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: reloj({roseX: ROSE_REL}), cam: (d) => [{t: 0, x: 1150, y: 700, z: 1.4}, {t: d, x: REL.bolso.x, y: REL.bolso.y, z: 4.0}], socos: [W(22, 'um', 0.3)]},
  /* 24 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={t} roseX={ROSE_REL} />, cam: (d) => [{t: 0, x: REL.bolso.x, y: REL.bolso.y, z: 4.5}, {t: d, x: REL.bolso.x, y: REL.bolso.y, z: 6.5}],
    marcas: () => [{x: REL.bolso.x, y: REL.bolso.y - 58, texto: 'ANDANDO', em: W(23, 'andando', 2.0), cor: COR.praca, corTexto: '#fff', tam: 30}]},
  /* 25 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={4 + t} roseX={ROSE_REL} />, tremor: 3, cam: (d) => [{t: 0, x: REL.bolso.x, y: REL.bolso.y, z: 7.5}, {t: d, x: REL.bolso.x, y: REL.bolso.y, z: 8.5}], socos: [W(24, 'tac', 0.6)]},
  /* 26 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={6 + t} roseX={ROSE_REL} />, cam: (d) => [{t: 0, x: 1180, y: 760, z: 2.2}, {t: d, x: 1230, y: 720, z: 2.8}],
    hud: () => <Ficha x={60} y={180} nome="SEU AURÉLIO, 74" linha2="RELOJOEIRO" retrato={RET.aurelio} em={W(25, 'aurélio', 0.9)} />},
  /* 27 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={9 + t} roseX={ROSE_REL} />, cam: (d) => [{t: 0, x: 1150, y: 860, z: 2.4}, {t: d, x: 1075, y: 925, z: 3.4}],
    marcas: () => [{x: 1072, y: 890, texto: 'MÃO VAZIA', em: W(26, 'mão', 0.5), cor: COR.terracota, corTexto: '#fff'}]},
  /* 28 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={12 + t} roseX={ROSE_REL} />, cam: (d) => [{t: 0, x: 1020, y: 1160, z: 3.6}, {t: d, x: REL.foto.x, y: REL.foto.y, z: 5.5}],
    marcas: () => [{x: REL.foto.x, y: REL.foto.y - 40, texto: 'FOTO', em: W(27, 'foto', 1.5), tam: 30}]},
  /* 29 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: () => <FotoClose verso={false} giro={0} letra={0} tremor={0} />, cam: (d) => [{t: 0, x: 540, y: 900, z: 0.95}, {t: d, x: 540, y: 880, z: 1.15}], socos: [W(28, 'rose', 0.5)]},
  /* 30 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: () => <FotoClose verso={false} giro={0} letra={0} tremor={0} />, cam: (d) => [{t: 0, x: 600, y: 1000, z: 1.2}, {t: d, x: 680, y: 1150, z: 1.8}],
    hud: () => <Carimbo x={540} y={1180} texto="SEG · 16:46" em={W(29, '16:46', 1.8)} tam={100} />},
  /* 31 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <FotoClose verso={false} giro={0} letra={0} tremor={Math.sin(t * 40) * 1.2} />, tremor: 3, cam: (d) => [{t: 0, x: 540, y: 900, z: 1.1}, {t: d, x: 540, y: 880, z: 1.25}],
    hud: () => <><Medidor x={60} y={170} rotulo="BATIMENTOS DA ROSE" de={118} para={147} unid="BPM" em={0.2} seta="▲" corNum={COR.terracota} /><Carimbo x={540} y={330} texto="UM MINUTO ANTES" em={W(30, 'antes', 1.0)} tam={70} /></>},
  /* 32 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => { const g = interpolate(t, [0.3, 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); return <FotoClose verso={g > 0.5} giro={g} letra={0} tremor={0} />; }, cam: (d) => [{t: 0, x: 540, y: 900, z: 1.1}, {t: d, x: 540, y: 880, z: 1.2}]},
  /* 33 */ {W: 1080, H: 1920, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t, d) => <FotoClose verso giro={1} letra={interpolate(t, [0, d * 0.85], [0, 1], {extrapolateRight: 'clamp'})} tremor={0} />, cam: (d) => [{t: 0, x: 540, y: 880, z: 1.25}, {t: d, x: 520, y: 880, z: 1.45}], leg: null},
  /* 34 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t, d) => { const ts = W(33, 'toca', 2.6); return <Relojoaria t={t} ponteiro={20 + t} roseX={ROSE_REL} roseExpr="surpresa" fotoTirada sinoBalanca={t > ts ? 18 * Math.sin((t - ts) * 14) * Math.exp(-(t - ts) * 1.5) : 0} />; },
    cam: (d) => { const ts = W(33, 'sino', 2.2); return [{t: 0, x: ladoRose(ROSE_REL, 1.6), y: 1300, z: 1.6}, {t: ts, x: ladoRose(ROSE_REL, 1.7), y: 1290, z: 1.7}, {t: ts + 0.35, x: REL.sino.x + 40, y: REL.sino.y, z: 2.6}, {t: d, x: REL.sino.x + 40, y: REL.sino.y, z: 2.9}]; },
    socos: [W(33, 'toca', 2.6)], lado: 'esq'},
  /* 35 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t, d) => { const k = interpolate(t, [0, d], [0, 1]); return <Relojoaria t={t} ponteiro={24 + t} roseX={ROSE_REL + 300} roseExpr="surpresa" fotoTirada portaAbre={0.15 + 0.5 * k} sombra={0.2 + 0.8 * k} />; },
    cam: (d) => [{t: 0, x: 620, y: 1250, z: 1.0}, {t: d, x: 640, y: 1300, z: 0.95}], lado: 'esq',
    hud: () => <Medidor x={60} y={170} rotulo="PESSOAS SE MEXENDO" de={1} para={2} em={0.1} dur={0.5} corNum={COR.terracota} seta="▲" largura={520} />},
  /* 36 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={26 + t} roseX={1300} roseExpr="surpresa" fotoTirada portaAbre={0.65} sombra={1} />, tremor: 3, lado: 'esq',
    cam: (d) => [{t: 0, x: ladoRose(1300, 1.9), y: 1180, z: 1.9}, {t: d, x: ladoRose(1300, 2.2), y: 1160, z: 2.2}],
    hud: () => <CartaoAB a="" b="" emA={999} emB={999} y={240} contagem={{em: 0, dur: CONT_DUR}} />},
  /* 37 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={28 + t} roseX={1300} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={1} />, lado: 'esq',
    leg: null, cam: (d) => { const ta = W(36, 'a', 0.3), tb = W(36, 'b', 3.0); return [{t: 0, x: 1250, y: 1050, z: 1.0}, {t: ta, x: 1000, y: 1080, z: 1.0}, {t: tb - 0.2, x: 1000, y: 1080, z: 1.0}, {t: tb + 0.3, x: 1500, y: 1050, z: 1.0}, {t: d, x: 1520, y: 1040, z: 1.05}]; },
    marcas: () => [{x: 950, y: 1140, texto: 'ESCONDERIJO', em: W(36, 'a', 0.3) + 0.3}, {x: 1810, y: 590, texto: 'FUNDOS', em: W(36, 'b', 3.0) + 0.3, cor: COR.ceu}],
    hud: () => <CartaoAB a="SE ESCONDER E ESPERAR" b="PEGAR O RELÓGIO E FUGIR" emA={W(36, 'a', 0.3)} emB={W(36, 'b', 3.0)} y={240} contagem={{em: -(T.INI[36] - CONT_INI), dur: CONT_DUR}} />},
  /* 38 */ {...L2, topo: 'RELOJOARIA DO SEU AURÉLIO', fundo: (t) => <Relojoaria t={t} ponteiro={34 + t} roseX={1300} roseExpr="desconfiada" fotoTirada portaAbre={0.65} sombra={1} />, leg: null,
    cam: (d) => [{t: 0, x: ladoRose(1300, 1.6), y: 970, z: 1.6}, {t: d, x: ladoRose(1300, 2.0), y: 995, z: 2.0}],
    hud: () => <><CartaoAB a="SE ESCONDER E ESPERAR" b="PEGAR O RELÓGIO E FUGIR" emA={-2} emB={-2} y={240} contagem={{em: -(T.INI[37] - CONT_INI), dur: CONT_DUR}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', marginRight: 100}}><span style={{background: COR.ipe, border: `5px solid ${COR.tinta}`, borderRadius: 40, padding: '10px 40px', fontFamily: 'Anton, sans-serif', fontSize: 64, color: COR.tinta}}>COMENTA A OU B</span></div></>},
];

export const Ep02: React.FC = () => <Episodio T={T} C={C} audio="ep02/audio.mp3" destaques={DEST} topoPadrao="CENTRO · SEG · 16:47" />;
