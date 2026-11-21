import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {Shot, Cam, Chave, Grao, Vinheta, KO, KS, lerp, es, useT, Numero} from './base';
import {Piloto6, PILOTO6_FIM} from './Piloto6';
import {COR, ReguaMag, Sismografo, Noticia, MapaAS, Rotulo, Pulso, MapaOficial, Cozinha, NumeroGigante, EscadaMag, BrasilAcre, Manaus, InfoNoticia} from './cenas6';
import {MapaPontos, Estacao, CrostaNE, EnergiaEsferas, MagIntens, Caminhao, Povoado, ParedeAdobe, JoaoCamara, CopoQuebra, Serra, CorteNazca, CelularBoato, Calendario, BordaOeste, PredioCasa, GloboOndas, Paulista, AptoAlto, Lisboa, OndaAtlantico, Tamandare, FotoReal, CubosEnergia, GloboSino, RasgoBrasil, PrediosChile, CartelaNao, GloboPlacas, Rachaduras, Seguranca, MapaComentarios, CardFinal6} from './cenas6b';
import {Carimbo} from './carimbo6';
import {Cozinha3D, plano3d, USAR_3D} from './cozinha3d';
import cortes from './cortes6.json';
import em from '../public/noticias/em.json';
import natgeo from '../public/noticias/natgeo.json';
import agenciabrasil from '../public/noticias/agenciabrasil.json';
import aosfatos from '../public/noticias/aosfatos.json';
import catraca from '../public/noticias/catraca.json';

export const FIM6 = 826.0;
const INFO: Record<string, any> = {'noticias/em.png': em, 'noticias/natgeo.png': natgeo, 'noticias/agenciabrasil.png': agenciabrasil, 'noticias/aosfatos.png': aosfatos, 'noticias/catraca.png': catraca};
const CORX: Record<string, string> = {ouro: COR.ouro, perigo: COR.perigo, calmo: COR.calmo};
type Corte = {a: number; b: number; c: string; p: any; o: any[]; d: string; f: number; hud: boolean};
export const CORTES6 = cortes as Corte[];

// valor da régua (a magnitude do "degrau" atual) ao longo do vídeo
const DEGRAUS: [number, number][] = [[87.5, 2], [204.9, 3], [221.2, 4], [237.3, 4.9], [274.6, 5.1], [320.2, 6.2], [358.1, 7.6], [467.3, 7.0], [481.6, 7.5], [520.6, 8.2], [545.2, 8.3], [564.1, 8.8], [577.6, 9.0], [627.6, 9.5]];
const mag = (t: number) => { let v = 2; let ta = 0; let va = 2; for (const [tt, m] of DEGRAUS) if (t >= tt) { ta = tt; va = v; v = m; } return lerp(va, v, KS(t, ta, ta + 1.2)); };

const Z: React.FC<{lt: number; d: number; mov?: boolean; ox?: number; oy?: number; children: React.ReactNode}> = ({lt, d, mov, ox = 50, oy = 50, children}) => <Cam lt={lt} d={d} z0={1} z1={mov ? 1.012 : 1.025} ox={ox} oy={oy}>{children}</Cam>;
const fundoNoticia = (f: string, t: number) => f === 'povoado' ? <Povoado lt={0} t={t} modo="calmo" /> : f === 'serra' ? <Serra lt={0} t={t} /> : f === 'paulista' ? <Paulista lt={0} t={t} /> : <MapaAS lt={0} d={1} lonC={-55} latC={-14} s0={26} s1={26} />;

const cena = (c: string, p: any, lt: number, d: number, t: number): React.ReactNode => {
  const T = lt + (p.off ?? 0), D = d * (p.partes ?? 1);
  switch (c) {
    case 'cozinha': return p.close ? <Cozinha lt={lt} t={t} onda={p.onda} tremorK={p.tremor ?? 0} close={lerp(p.close, p.close + 0.03, es(lt / d))} /> : <Z lt={lt} d={d} mov={!!p.tremor}><Cozinha lt={lt} t={t} onda={p.onda} tremorK={p.tremor ?? 0} /></Z>;
    case 'pontos': return <MapaPontos lt={T} d={D} t={t} foco={p.foco} marca={p.marca} />;
    case 'estacao': return <Z lt={lt} d={d} mov><Estacao lt={T} t={t} /></Z>;
    case 'crosta': return <Z lt={lt} d={d}><CrostaNE lt={T} t={t} /></Z>;
    case 'escada': return <Z lt={lt} d={d} mov><EscadaMag lt={T} d={D} t={t} ate={4} /></Z>;
    case 'energia': return <EnergiaEsferas lt={T} t={t} />;
    case 'magint': return <Z lt={lt} d={d} mov><MagIntens lt={T} t={t} /></Z>;
    case 'caminhao': return <Caminhao lt={T} t={t} d={D} />;
    case 'povoado': return <Z lt={lt} d={d} mov={p.modo !== 'calmo'} oy={70}><Povoado lt={T} t={t} modo={p.modo} /></Z>;
    case 'noticia': return <Noticia lt={lt} d={d} img={p.img} info={INFO[p.img] as InfoNoticia} fonte={p.fonte} data={p.data} fundo={fundoNoticia(p.fundo, t)} g0={p.g0} />;
    case 'adobe': return <Z lt={lt} d={d}><ParedeAdobe lt={T} t={t} /></Z>;
    case 'cartela': return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1A1E28, #05070D 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Numero cor={COR.perigo} size={120} op={KO(lt, 0.15, 0.5)} style={{transform: `scale(${lerp(1, 1.02, es(lt / d))})`}}>{p.txt}</Numero></AbsoluteFill>;
    case 'joao': return <Z lt={lt} d={d} mov={p.modo !== 'falha'}><JoaoCamara lt={T} t={t} modo={p.modo} /></Z>;
    case 'oficial': return <MapaOficial lt={lt} d={d} img={p.img} titulo={p.titulo} />;
    case 'copoquebra': return <CopoQuebra lt={lt} t={t} />;
    case 'serra': return <Z lt={lt} d={d} mov><Serra lt={T} t={t} treme={p.treme} /></Z>;
    case 'acre': return <BrasilAcre lt={T} d={D} t={t} />;
    case 'nazca': return <Z lt={lt} d={d} mov><CorteNazca lt={T} t={t} modo={p.modo} /></Z>;
    case 'cta': return <><EscadaMag lt={T + 3} d={D} t={t} ate={4} /><BotaoInscrever lt={lt} /></>;
    case 'celular': return <CelularBoato lt={T} t={t} />;
    case 'calendario': return <Calendario lt={lt} d={d} t={t} />;
    case 'borda': return <BordaOeste lt={T} d={D} t={t} />;
    case 'venezuela': return <MapaAS lt={T} d={D} lonC={-68} latC={4} s0={30} s1={31}
      children={(P) => <g><Pulso p={P(-68.74, 10.34)} t={t} cor={COR.perigo} op={KO(T, 0.5, 0.8)} /><Pulso p={P(-67.22, 10.6)} t={t + 0.4} cor={COR.perigo} op={KO(T, 3.0, 3.3)} /><Pulso p={P(-76.26, 4.86)} t={t + 0.8} cor={COR.perigo} op={KO(T, 6.0, 6.3)} /></g>}
      html={(P) => <><Rotulo x={P(-68.74, 10.34)[0]} y={P(-68.74, 10.34)[1] + 60} txt="7,2" lado={-1} cor={COR.perigo} op={KO(T, 3.0, 3.3)} /><Rotulo x={P(-67.22, 10.6)[0]} y={P(-67.22, 10.6)[1] + 60} txt="7,5" lado={1} cor={COR.perigo} op={KO(T, 5.4, 5.7)} /><Rotulo x={P(-76.26, 4.86)[0]} y={P(-76.26, 4.86)[1]} txt="COLÔMBIA · 7,4" lado={-1} cor={COR.perigo} op={KO(T, 7.7, 8.0)} /></>} />;
    case 'prediocasa': return <Z lt={lt} d={d} mov><PredioCasa lt={T} t={t} /></Z>;
    case 'globo': return <GloboOndas lt={T} t={t} lon={p.lon} lat={p.lat} alvos={p.alvos} />;
    case 'paulista': return <Z lt={lt} d={d} mov><Paulista lt={T} t={t} /></Z>;
    case 'apto': return <Z lt={lt} d={d} mov><AptoAlto lt={T} t={t} /></Z>;
    case 'lisboa': return <Z lt={lt} d={d} mov><Lisboa lt={T} t={t} modo={p.modo} /></Z>;
    case 'atlantico': return <OndaAtlantico lt={T} d={D} t={t} />;
    case 'tamandare': return <Z lt={lt} d={d} mov><Tamandare lt={T} d={D} t={t} /></Z>;
    case 'numero': return <NumeroGigante lt={lt} d={d} t={t} txt={p.txt} sub={p.sub} />;
    case 'foto': return <FotoReal lt={lt} d={d} img={p.img} legenda={p.legenda} credito={p.credito} />;
    case 'cubos': return <CubosEnergia lt={T} t={t} />;
    case 'sino': return <GloboSino lt={T} t={t} />;
    case 'rasgo': return <RasgoBrasil lt={T} d={D} t={t} aneis={p.aneis} />;
    case 'chile': return <Z lt={lt} d={d} mov><PrediosChile lt={T} t={t} /></Z>;
    case 'nao': return <CartelaNao lt={lt} />;
    case 'globoplacas': return <GloboPlacas lt={T} t={t} centro={p.centro} brasil={!!p.brasil} />;
    case 'rachaduras': return <Rachaduras lt={T} d={D} t={t} />;
    case 'seguranca': return <Seguranca lt={T} t={t} />;
    case 'comentarios': return <MapaComentarios lt={T} d={D} t={t} />;
    case 'card': return <CardFinal6 lt={lt} t={t} />;
  }
  return <AbsoluteFill style={{background: '#300'}} />;
};

const BotaoInscrever: React.FC<{lt: number}> = ({lt}) => {
  const k = KO(lt, 0.4, 0.9), clique = lt > 2.2;
  return (
    <div style={{position: 'absolute', left: 120, top: 120, opacity: k, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', borderRadius: 40, background: clique ? '#3A3F4A' : '#E62117', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
      <div style={{width: 40, height: 28, borderRadius: 8, background: '#fff', position: 'relative'}}><div style={{position: 'absolute', left: 15, top: 7, width: 0, height: 0, borderLeft: '13px solid ' + (clique ? '#3A3F4A' : '#E62117'), borderTop: '7px solid transparent', borderBottom: '7px solid transparent'}} /></div>
      <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: '#fff'}}>{clique ? 'INSCRITO' : 'INSCREVER-SE'}</span>
    </div>
  );
};

// etiqueta no canto superior esquerdo (o rodapé é do sismógrafo)
const EtqTopo: React.FC<{lt: number; d: number; t0: number; small: string; big: string; cor: string}> = ({lt, d, t0, small, big, cor}) => {
  const k = KO(lt, t0, t0 + 0.4) * (1 - KS(lt, d - 0.35, d));
  return (
    <div style={{position: 'absolute', left: 80, top: 70, opacity: k, transform: `translateX(${(1 - KO(lt, t0, t0 + 0.4)) * -20}px)`, padding: '14px 26px 16px 22px', borderRadius: 12, background: 'rgba(6,10,20,0.9)', borderLeft: `5px solid ${cor}`, boxShadow: '0 12px 36px rgba(0,0,0,0.6)'}}>
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 19, letterSpacing: 5, color: '#B9C2D3'}}>{small}</div>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 50, color: '#fff', letterSpacing: 1.5, lineHeight: 1.05, marginTop: 4}}>{big}</div>
    </div>
  );
};

const overlay = (o: any, lt: number, d: number, i: number) => {
  const cor = CORX[o.cor] ?? COR.ouro;
  const lt2 = o.ja ? lt + 5 : lt;
  switch (o.tipo) {
    case 'etq': return <EtqTopo key={i} lt={lt} d={d} t0={o.t0} small={o.small} big={o.big} cor={cor} />;
    case 'chave': return <Chave key={i} lt={lt2} t0={o.t0} cor={cor} top={110} sai={d - 0.3 + (o.ja ? 5 : 0)}>{o.txt}</Chave>;
    case 'carimbo': return <Carimbo key={i} lt={lt2} t0={o.t0} txt={o.txt} cor={cor} x={o.x} y={o.y} />;
  }
  return null;
};

export const Video6: React.FC = () => {
  const t = useT();
  if (t < PILOTO6_FIM) return <Piloto6 />;
  const atual = CORTES6.find((c) => t >= c.a && t < c.b);
  const hud = atual ? atual.hud : false;
  const m = mag(t);
  const amp = 0.04 + Math.max(0, (m - 2) / 7.5) * 0.9 * (atual && atual.c === 'cozinha' ? 1 : 0.4);
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      {CORTES6.filter((c) => t >= c.a - c.f && t < c.b).map((c) => (
        <Shot key={c.a} a={c.a} b={c.b} fade={c.f}>{(lt, d) => <>{USAR_3D && c.c === 'cozinha' && plano3d(c.a) ? <Cozinha3D a={c.a} /> : cena(c.c, c.p, lt, d, t)}{c.o.map((o, j) => overlay(o, lt, d, j))}</>}</Shot>
      ))}
      {hud && <ReguaMag k={1} valor={m} t={t} topoMisterio={t < 627.6} />}
      {hud && atual && atual.c === 'cozinha' && <Sismografo k={1} t={t} amp={amp} />}
      <Vinheta forca={0.3} />
      <Grao />
    </AbsoluteFill>
  );
};
