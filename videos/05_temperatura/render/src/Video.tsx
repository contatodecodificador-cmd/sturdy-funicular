import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {Shot, Cam, Chave, Etq, Tag, Grao, Vinheta, KO, KS, es, lerp, FR, QU, useT, Numero} from './base';
import {Corredor} from './corredor';
import {Piloto, PILOTO_FIM} from './Piloto';
import {Regua, AnnaTimer, MapaBR, Espaco, Sol, AnnaGelo, SalaBlagden, Terra, Laboratorio, Corpo37} from './cenas';
import {Carimbo, Janela, CorpoTemp, Nevasca, MonitorGrande, RioNoite, Leito, Comparacao, CerebroFrio, RuaQuente, ReguaVida} from './ato1';
import {DuasCidades, Siberia, Deserto, Suor, Limite31, Sauna, Panela, Moleculas, Documento, Lava, Antartida, BotaoInscrever} from './ato2';
import {Nitrogenio, EspacoPessoa, Garrafa, CMB, Raio, SolCorte, Nebulosa, Spray, Torre, ReguaZero, ISS, Assintota, Tokamak, LHC, PlacarCheio, UniversoFrio, CardFinal} from './ato34';
import {Pessoa, ANNA} from './personagens';
import cortes from './cortes.json';

export const FIM = 950.0;
const COR: Record<string, string> = {ouro: '#E3B04B', frio: FR.azul, dado: '#7CC4FF', fogo: QU.fogo, perigo: QU.lava, impacto: '#3DDBB4'};
type Corte = {a: number; b: number; c: string; p: any; o: any[]; d: string; f: number};
export const CORTES = cortes as Corte[];

// cena por chave
const cena = (c: string, p: any, lt: number, d: number, t: number): React.ReactNode => {
  const k = es(lt / d);
  const z = (z0: number, z1: number, ox = 50, oy = 50, node: React.ReactNode) => <Cam lt={lt} d={d} z0={z0} z1={z1} ox={ox} oy={oy}>{node}</Cam>;
  const zz = p.zoom ? 1.12 : 1.0;
  const T = lt + (p.off ?? 0);
  switch (c) {
    case 'corredor': return <Corredor t={t} cam={lerp(p.cam0, p.cam1 ?? p.cam0, k)} camX={lerp(p.x0 ?? 0, p.x1 ?? p.x0 ?? 0, k)} camY={lerp(p.y0 ?? 0, p.y1 ?? p.y0 ?? 0, k)} pessoaZ={p.pz} pessoaX={p.px ?? 0} brilhoFim={p.brilho ?? 0.6} abertas={p.ab ?? 0} />;
    case 'corpo': return z(1, 1.03, 45, 50, <CorpoTemp lt={lt} t={t} temp={lerp(p.temp0, p.temp1, KS(T, 0, d * (p.partes ?? 1)))} tremor={p.tremor ?? 0} suor={p.suor ?? 0} fundo={p.fundo ?? 'neutro'} expr={p.expr} />);
    case 'janela': return <Janela lt={lt} t={t} zoom={lerp(p.z0, p.z1, KS(T, 0, d * (p.partes ?? 1)))} />;
    case 'nevasca': return z(1, 1.03, 50, 50, <Nevasca lt={lt} t={t} tira={lerp(p.t0, p.t1, KS(lt, 0.3, d - 0.3))} />);
    case 'monitor': return <MonitorGrande t={t} bpm={p.bpm} irregular={p.irr ?? 0} temp={p.temp} cor={p.cor} />;
    case 'rio': return z(1, 1.03, 55, 60, <RioNoite lt={T} t={t} queda={lerp(p.q0, p.q1, KS(lt, 0.8, d - 0.2))} />);
    case 'anna': return <>{z(p.close ? 1.25 : 1, p.close ? 1.29 : 1.04, 50, 58, <AnnaGelo lt={T} t={t} d={p.d} />)}<AnnaTimer lt={T} d={p.d} /></>;
    case 'leito': return z(1, 1.03, 50, 50, <Leito lt={lt} t={t} pac={p.pac} maquina={p.maq ?? 0} temp={lerp(p.temp0, p.temp1, KS(lt, 0.3, d - 0.2))} legenda={p.leg} />);
    case 'comparacao': return <Comparacao lt={lt} a={{ic: '', n: p.a.n, l: p.a.l, cor: COR[p.a.cor]}} b={{ic: '', n: p.b.n, l: p.b.l, cor: COR[p.b.cor]}} vs={p.vs} />;
    case 'cerebro': return z(p.zoom ? 1.1 : 1, p.zoom ? 1.14 : 1.04, 50, 50, <CerebroFrio lt={T} t={t} />);
    case 'pessoaAnna': return z(1, 1.03, 50, 50, <CorpoTemp lt={lt} t={t} temp={37} v={{...ANNA, gorro: undefined, oculosNeve: false, topo: {tipo: 'jaleco', cor: '#F4F6F8', cor2: '#3E5C76'}}} expr="sorriso" />);
    case 'rua': return z(zz, zz + 0.04, 58, 60, <RuaQuente lt={lt} t={t} />);
    case 'reguaVida': return <ReguaVida lt={T} t={t} />;
    case 'mapa': return <MapaBR lt={lt} d={d} t1={p.t1} t2={p.t2} />;
    case 'cidades': return z(1, 1.03, 50, 50, <DuasCidades lt={T} t={t} />);
    case 'placar': return z(1, 1.03, 50, 60, <PlacarCheio lt={lt} t={t} linhas={p.linhas} fimF={p.fimF} fimQ={p.fimQ} />);
    case 'siberia': return z(zz, zz + 0.04, 50, 55, <Siberia lt={lt} t={t} modo={p.modo} timer={p.timer === 1 ? KS(T, 0.5, 8) * 0.5 : p.timer === 2 ? 0.5 + KS(lt, 0.2, 3) * 0.5 : undefined} />);
    case 'deserto': return z(1, 1.04, 50, 50, <Deserto lt={T} t={t} modo={p.modo} />);
    case 'suor': return <Suor lt={lt} t={t} foco={p.foco} />;
    case 'limite': return <Limite31 lt={p.k1 > 0 ? lt : -10} t={t} />;
    case 'sauna': return z(1, 1.04, 40, 55, <Sauna lt={lt} t={t} />);
    case 'panela': return z(1, 1.03, 45, 60, <Panela lt={lt} t={t} temp={p.temp} seg={p.seg} />);
    case 'moleculas': return z(1, 1.03, p.parte === 1 ? 25 : p.parte === 2 ? 75 : 50, 50, <Moleculas lt={lt} t={t} />);
    case 'documento': return z(1, 1.05, 50, 40, <Documento lt={lt} t={t} />);
    case 'blagden': return p.ovo ? z(1.5, 1.56, 76, 70, <SalaBlagden lt={T + 2} t={t} d={d * 2} />) : z(zz, zz + 0.04, 55, 60, <SalaBlagden lt={T} t={t} d={d * (p.partes ?? 1)} />);
    case 'cta': return <><Corredor t={t} cam={lerp(1 + (p.parte ?? 0) * 2, 3 + (p.parte ?? 0) * 2, k)} brilhoFim={0.7} pessoaZ={p.parte ? undefined : 4.2} />{p.parte === 0 && <BotaoInscrever lt={lt} />}</>;
    case 'lava': return z(zz, zz + 0.04, 60, 60, <Lava lt={lt} t={t} modo={p.modo} />);
    case 'antartida': return z(zz, zz + 0.04, 50, 50, <Antartida lt={T} t={t} modo={p.modo} />);
    case 'nitro': return z(zz, zz + 0.04, 50, 60, <Nitrogenio lt={T} t={t} modo={p.modo} />);
    case 'espacoP': return z(zz, zz + 0.04, 40, 55, <EspacoPessoa lt={lt} t={t} apaga={p.apaga ? KS(lt, 1.5, d) : 0} />);
    case 'garrafa': return z(1, 1.04, 50, 50, <Garrafa lt={T} t={t} />);
    case 'universo': return z(zz, zz + 0.04, 59, 55, <UniversoFrio lt={T} t={t} />);
    case 'cmb': return z(1, 1.04, 50, 50, <CMB lt={lt} t={t} />);
    case 'espaco': return <Espaco lt={T + 1} />;
    case 'raio': return z(1, 1.04, 55, 50, <Raio lt={lt} t={t} modo={p.modo} />);
    case 'sol': return <Sol lt={T + 1} t={t} num={p.num} />;
    case 'solCorte': return <SolCorte lt={T} t={t} mergulho={lerp(p.m0, p.m1, KS(T, 0, d * (p.partes ?? 1)))} />;
    case 'laboratorio': return z(1, 1.05, 50, 60, <Laboratorio lt={lt + 2} t={t} d={d} />);
    case 'nebulosa': return z(zz, zz + 0.04, 50, 50, <Nebulosa lt={T} t={t} />);
    case 'spray': return z(1, 1.04, 45, 55, <Spray lt={lt} t={t} />);
    case 'torre': return z(1, 1.04, 50, 45, <Torre lt={lt} t={t} queda={lerp(p.q0, p.q1, KS(T, 0.3, d * (p.partes ?? 1)))} nuvem={p.nuvem ? KS(T, 0, 0.8) : 0} />);
    case 'reguaZero': return <ReguaZero lt={T} t={t} />;
    case 'iss': return <ISS lt={T} t={t} />;
    case 'assintota': return <Assintota lt={T} t={t} />;
    case 'tokamak': return z(1, 1.05, 50, 55, <Tokamak lt={lt} t={t} campo={p.campo ? KS(T, 0.8, 2.5) : 0} />);
    case 'lhc': return z(1, 1.04, 50, 50, <LHC lt={p.modo === 'colisao' ? T : lt} t={t} modo={p.modo} />);
    case 'numero': return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #3A1205, #050101 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Numero cor={COR[p.cor]} size={180} style={{transform: `scale(${lerp(0.94, 1.02, k)})`}}>{p.txt}</Numero></AbsoluteFill>;
    case 'terra': return <Terra lt={lt} t={t} d={d} />;
    case 'corpo37': return <AbsoluteFill style={{transform: `scale(${lerp(1.0, 1.12, k)})`, transformOrigin: '42% 36%'}}><Corpo37 lt={lt} t={t} d={d} pele={0} centro={1} orgaos={1} regua={0} /></AbsoluteFill>;
    case 'card': return <CardFinal lt={lt} t={t} />;
  }
  return <AbsoluteFill style={{background: '#300'}} />;
};

// chip discreto de porta (canto superior esquerdo)
const Chip: React.FC<{lt: number; d: number; n: number; nome: string}> = ({lt, d, n, nome}) => {
  const k = KO(lt, 0.25, 0.7) * (1 - KS(lt, Math.min(d, 3.4) - 0.4, Math.min(d, 3.4)));
  return (
    <div style={{position: 'absolute', left: 70, top: 60, opacity: k, transform: `translateX(${(1 - KO(lt, 0.25, 0.7)) * -16}px)`, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px 10px 12px', borderRadius: 12, background: 'rgba(6,10,20,0.82)', boxShadow: '0 8px 24px rgba(0,0,0,0.45)'}}>
      <span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30, color: '#06080F', background: '#F2F4F8', borderRadius: 8, padding: '0 12px'}}>{n}</span>
      <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: '#E8ECF4'}}>{nome}</span>
    </div>
  );
};

const POS_CARIMBO: Record<string, [number, number]> = {corpo: [1360, 140], pessoaAnna: [1360, 140], leito: [1380, 250], comparacao: [960, 930], lava: [960, 170], nitro: [1650, 620], espacoP: [1360, 280], sol: [1560, 240], nebulosa: [960, 930], blagden: [960, 120], cidades: [960, 600], placar: [960, 960]};
const overlay = (o: any, lt: number, d: number, i: number, c: string) => {
  const cor = COR[o.cor] ?? COR.ouro;
  const lt2 = o.ja ? lt + 5 : lt;
  switch (o.tipo) {
    case 'chip': return <Chip key={i} lt={lt} d={d} n={o.n} nome={o.nome} />;
    case 'chave': return <Chave key={i} lt={lt2} t0={o.t0} cor={cor} top={110} sai={d - 0.3 + (o.ja ? 5 : 0)}>{o.txt}</Chave>;
    case 'etq': return <Etq key={i} lt={lt2} t0={o.t0} small={o.small} big={o.big} cor={cor} sai={d - 0.35 + (o.ja ? 5 : 0)} />;
    case 'carimbo': { const [x, y] = POS_CARIMBO[c] ?? [960, 540]; return <Carimbo key={i} lt={lt2} t0={o.t0} txt={o.txt} cor={cor} x={x} y={y} size={o.txt.length > 14 ? 64 : 84} />; }
    case 'tag': return <Tag key={i} x={o.x} y={o.y} cor={cor} op={KO(lt2, o.t0, o.t0 + 0.35) * (1 - KS(lt, d - 0.3, d))} size={44}>{o.txt}</Tag>;
  }
  return null;
};

export const Video: React.FC = () => {
  const t = useT();
  if (t < PILOTO_FIM) return <Piloto />;
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      {CORTES.filter((c) => t >= c.a - c.f && t < c.b).map((c, i) => (
        <Shot key={c.a} a={c.a} b={c.b} fade={c.f}>{(lt, d) => <>{cena(c.c, c.p, lt, d, t)}{c.o.map((o, j) => overlay(o, lt, d, j, c.c))}</>}</Shot>
      ))}
      <Vinheta forca={0.35} />
      <Grao />
    </AbsoluteFill>
  );
};
