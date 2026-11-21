import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shot, Cam, Chave, Etq, Tag, Flash, Grao, Vinheta, KO, KS, es, lerp, FR, QU, useT} from './base';
import {Corredor} from './corredor';
import {Regua, AnnaTimer, Acorda, PortasPar, MapaBR, Espaco, Sol, AnnaGelo, SalaBlagden, Hospital, Placar, Terra, Laboratorio, Pergunta, Corpo37} from './cenas';

export const PILOTO_FIM = 74.4;

// barra de progresso das 19 portas (só pontos, sem legenda)
export const Progresso: React.FC<{lt: number; atual: number}> = ({lt, atual}) => {
  const k = KO(lt, 0.4, 1.0);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', opacity: k}}>
      <div style={{display: 'flex', gap: 12, padding: '13px 22px', borderRadius: 30, background: 'rgba(6,10,20,0.78)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        {Array.from({length: 19}, (_, i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: i < atual ? '#F2F4F8' : '#2A3142', boxShadow: i === atual - 1 ? `0 0 0 3px ${QU.fogo}` : 'none'}} />)}
      </div>
    </div>
  );
};

// câmera do corredor: interpolação suave entre dois "pontos de vista"
type PV = {cam: number; x?: number; y?: number};
export const pv = (lt: number, d: number, a: PV, b: PV) => {
  const k = es(lt / d);
  return {cam: lerp(a.cam, b.cam, k), camX: lerp(a.x ?? 0, b.x ?? 0, k), camY: lerp(a.y ?? 0, b.y ?? 0, k)};
};

export const Piloto: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      {/* 1 · você acorda */}
      <Shot a={0} b={2.05}>{(lt) => <Acorda lt={lt} />}</Shot>
      {/* 2 · o corredor (frio à esquerda) — câmera avança devagar e pende para o gelo */}
      <Shot a={2.05} b={5.6}>{(lt, d) => <Corredor t={t} {...pv(lt, d, {cam: -0.7}, {cam: -0.1, x: -0.22})} pessoaZ={4.4} brilhoFim={0.6} />}</Shot>
      {/* 3 · calor à direita — novo ângulo, deriva lenta para a direita */}
      <Shot a={5.6} b={8.65} fade={0.35}>{(lt, d) => <Corredor t={t} {...pv(lt, d, {cam: 0.5, x: 0.3, y: -0.1}, {cam: 0.85, x: 0.5, y: -0.1})} pessoaZ={3.6} pessoaX={-0.35} brilhoFim={0.6} />}</Shot>
      {/* 4 · cada porta tem um número */}
      <Shot a={8.65} b={10.8}>{(lt, d) => <Corredor t={t} {...pv(lt, d, {cam: 1.0, x: -0.85, y: -0.72}, {cam: 1.25, x: -0.9, y: -0.75})} brilhoFim={0.5} />}</Shot>
      {/* 5 · −14 e +44 (mesma cena, câmera passa de uma porta à outra sem cortar) */}
      <Shot a={10.8} b={13.6} fade={0.3}>{(lt, d) => <AbsoluteFill style={{transform: `scale(${lerp(1.16, 1.12, es(lt / d))}) translateX(${lerp(190, 170, es(lt / d))}px)`}}><PortasPar lt={lt + 10.8} t={t} tE={12.75} tD={14.45} /></AbsoluteFill>}</Shot>
      <Shot a={13.6} b={16.05} fade={0.4}>{(lt, d) => <AbsoluteFill style={{transform: `scale(${lerp(1.08, 1.04, es(lt / d))}) translateX(${lerp(-40, 0, es(lt / d))}px)`}}><PortasPar lt={lt + 13.6} t={t} tE={12.75} tD={14.45} /></AbsoluteFill>}</Shot>
      {/* 6 · mapa real */}
      <Shot a={16.05} b={18.05} fade={0.3}>{(lt, d) => <MapaBR lt={lt} d={d} t1={0.1} t2={0.35} />}</Shot>
      {/* 7 · o corredor não para — avanço que acelera e freia suave */}
      <Shot a={18.05} b={20.6}>{(lt, d) => <Corredor t={t} cam={lerp(0, 15, es(lt / d))} brilhoFim={lerp(0.5, 0.9, lt / d)} />}</Shot>
      {/* 8 · frio do espaço / centro do Sol */}
      <Shot a={20.6} b={21.75}>{(lt) => <Espaco lt={lt} />}</Shot>
      <Shot a={21.75} b={24.05}>{(lt) => <Sol lt={lt} t={t} />}</Shot>
      {/* 9 · Anna: um plano aberto que vira close por fusão (sem pulo de zoom) */}
      <Shot a={24.05} b={26.6} fade={0.3}>{(lt, d) => <Cam lt={lt} d={d} z0={1} z1={1.04}><AnnaGelo lt={lt} t={t} d={5.5} /></Cam>}</Shot>
      <Shot a={26.6} b={29.55} fade={0.45}>{(lt, d) => <Cam lt={lt} d={d} z0={1.24} z1={1.29} oy={58}><AnnaGelo lt={lt + 2.55} t={t} d={5.5} /></Cam>}</Shot>
      <Shot a={24.05} b={29.55}>{(lt) => <AnnaTimer lt={lt} d={5.5} />}</Shot>
      {/* 10 · Blagden */}
      <Shot a={29.55} b={33.95}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.0} z1={1.04} ox={60}><SalaBlagden lt={lt} t={t} d={d} /></Cam>
        <Etq lt={lt} t0={0.3} small="LONDRES · 1774" big="UM OVO COZIDO PELO AR" cor={QU.fogo} sai={d - 0.45} />
      </>}</Shot>
      {/* 11 · Willie Jones */}
      <Shot a={33.95} b={38.3}>{(lt, d) => <Cam lt={lt} d={d} z0={1.0} z1={1.04} ox={40}><Hospital lt={lt} t={t} d={d} /></Cam>}</Shot>
      {/* 12 · as duas pontas */}
      <Shot a={38.3} b={42.65} fade={0.4}>{(lt, d) => <Corredor t={t} cam={lerp(19.5, 22.5, es(lt / d))} brilhoFim={lerp(0.7, 1, lt / d)} />}</Shot>
      {/* 13 · placar (um plano só, aproximação lenta da linha "???") */}
      <Shot a={42.65} b={45.3} fade={0.35}>{(lt, d) => <Cam lt={lt} d={d} z0={1.0} z1={1.04}><Placar lt={lt} t={t} /></Cam>}</Shot>
      <Shot a={45.3} b={48.0} fade={0.4}>{(lt, d) => <Cam lt={lt} d={d} z0={1.12} z1={1.16} oy={82}><Placar lt={lt + 2.65} t={t} /></Cam>}</Shot>
      {/* 14 · aqui na Terra */}
      <Shot a={48.0} b={52.95}>{(lt, d) => <>
        <Terra lt={lt} t={t} d={d} />
        <Chave lt={lt} t0={3.5} cor={C_OURO} top={110}>AQUI NA TERRA</Chave>
      </>}</Shot>
      {/* 15 · feitas por nós */}
      <Shot a={52.95} b={55.45} fade={0.3}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.0} z1={1.05} oy={60}><Laboratorio lt={lt} t={t} d={d} /></Cam>
        <Chave lt={lt} t0={0.45} cor={C_OURO} top={110}>FEITAS POR NÓS</Chave>
      </>}</Shot>
      {/* 16 · porta por porta */}
      <Shot a={55.45} b={60.35} fade={0.35}>{(lt, d) => <>
        <Corredor t={t} {...pv(lt, d, {cam: 1.2, x: -0.55}, {cam: 1.6, x: -0.65})} pessoaZ={3.6} pessoaX={-1.25} pessoaBraco={KS(lt, 0.4, 1.6)} brilhoFim={0.55} portaAberta={{i: 0, k: KS(lt, 1.8, 4.6) * 0.35}} />
        <Progresso lt={lt} atual={1} />
      </>}</Shot>
      {/* 17 · a pergunta */}
      <Shot a={60.35} b={62.45} fade={0.3}>{(lt) => <Pergunta lt={lt} t={t} />}</Shot>
      {/* 18-20 · Porta 1: uma câmera contínua sobre o corpo (sem saltos), três batidas */}
      {[[62.45, 66.25, 1.0], [66.25, 70.35, 1.12], [70.35, PILOTO_FIM, 1.26]].map(([A, Bb, Z]) => <Shot key={A} a={A} b={Bb} fade={0.4}>{(lt, d) => {
        const T = lt + A;
        const z = lerp(Z, Z + 0.035, es(lt / d));
        const pele = KS(T, 69.4, 69.9) * (1 - KS(T, 70.3, 70.7));
        return <>
          <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '42% 36%'}}>
            <Corpo37 lt={lt} t={t} d={12} pele={pele} centro={KS(T, 70.35, 70.9)} orgaos={KS(T, 71.3, 71.9)} regua={0} />
          </AbsoluteFill>
          <svg width={1920} height={1080} style={{position: 'absolute'}}><Regua k={KS(T, 63.0, 64.2)} valor={37} /></svg>
          <Tag x={1060} y={600} cor={QU.fogo} op={KO(T, 70.5, 70.9)} size={34}>37 °C</Tag>
        </>;
      }}</Shot>)}

      {/* clarões só nas viradas grandes */}
      {[2.05, 18.05, 48.0].map((x) => <Flash key={x} t={x} cor="#DDEBFF" dur={0.22} />)}
      <Vinheta forca={0.35} />
      <Grao />
    </AbsoluteFill>
  );
};
const C_OURO = '#E3B04B';
