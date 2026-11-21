import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {Shot, Cam, Chave, Etq, Tag, Flash, Grao, Vinheta, KO, K, lerp, prog, sm, clamp01, FR, QU, useT} from './base';
import {Corredor} from './corredor';
import {Regua, AnnaTimer, Acorda, PortasPar, MapaBR, Espaco, Sol, AnnaGelo, SalaBlagden, Hospital, Placar, Terra, Laboratorio, Pergunta, Corpo37} from './cenas';

export const PILOTO_FIM = 74.4;

// barra de progresso das 19 portas
const Progresso: React.FC<{lt: number; atual: number}> = ({lt, atual}) => {
  const k = KO(lt, 0.3, 0.8);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: k}}>
      <div style={{display: 'flex', gap: 12, padding: '14px 22px', borderRadius: 30, background: 'rgba(6,10,20,0.82)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        {Array.from({length: 19}, (_, i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: i < atual ? (i < 4 ? '#F2F4F8' : '#3A4256') : '#262C3A', border: i === atual - 1 ? `3px solid ${QU.fogo}` : '3px solid transparent', opacity: i < 4 ? 1 : 0.8}} />)}
      </div>
      <div style={{marginTop: 10, fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: '#C3CAD8'}}>19 PORTAS · ATÉ AS DUAS PONTAS</div>
    </div>
  );
};

export const Piloto: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      {/* 1 · você acorda */}
      <Shot a={0} b={2.05}>{(lt) => <Acorda lt={lt} />}</Shot>
      {/* 2 · o corredor: frio à esquerda */}
      <Shot a={2.05} b={5.6}>{(lt, d) => <>
        <Corredor t={t} cam={lerp(-1.2, 0.4, sm(lt / d))} camX={lerp(0, -0.55, sm(lt / d))} pessoaZ={4.4} brilhoFim={0.6} />
        <Tag x={150} y={540} cor={FR.gelo} op={KO(lt, 0.35, 0.7)} size={30}>← MAIS FRIO</Tag>
      </>}</Shot>
      {/* 3 · calor à direita */}
      <Shot a={5.6} b={8.65}>{(lt, d) => <>
        <Corredor t={t} cam={lerp(0.6, 1.4, sm(lt / d))} camX={lerp(0.35, 0.9, sm(lt / d))} camY={-0.1} pessoaZ={3.6} pessoaX={-0.35} brilhoFim={0.6} />
        <Tag x={1770} y={540} anchor="end" cor={QU.fogo} op={KO(lt, 0.25, 0.6)} size={30}>MAIS QUENTE →</Tag>
      </>}</Shot>
      {/* 4 · cada porta tem um número */}
      <Shot a={8.65} b={10.8}>{(lt, d) => <Corredor t={t} cam={lerp(1.0, 1.6, sm(lt / d))} camX={-0.9} camY={-0.75} brilhoFim={0.5} />}</Shot>
      {/* 5 · −14 e +44 */}
      <Shot a={10.8} b={13.65}>{(lt, d) => <Cam lt={lt} d={d} z0={1.0} z1={1.12} ox={30}><PortasPar lt={lt + 10.8} t={t} tE={12.75} tD={14.45} /></Cam>}</Shot>
      <Shot a={13.65} b={16.05}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.08} z1={1.0} ox={62}><PortasPar lt={lt + 13.65} t={t} tE={12.75} tD={14.45} /></Cam>
        <Chave lt={lt} t0={2.35} cor={C_BR}>RECORDES DO BRASIL</Chave>
      </>}</Shot>
      {/* 6 · mapa real */}
      <Shot a={16.05} b={18.05}>{(lt, d) => <MapaBR lt={lt} d={d} t1={0.05} t2={0.3} />}</Shot>
      {/* 7 · o corredor não para */}
      <Shot a={18.05} b={20.6}>{(lt, d) => <Corredor t={t} cam={lerp(0, 17.5, Math.pow(lt / d, 1.6))} camX={Math.sin(lt * 2) * 0.1} brilhoFim={lerp(0.5, 0.9, lt / d)} />}</Shot>
      {/* 8 · frio do espaço / centro do Sol */}
      <Shot a={20.6} b={21.75}>{(lt) => <Espaco lt={lt} />}</Shot>
      <Shot a={21.75} b={24.05}>{(lt) => <Sol lt={lt} t={t} />}</Shot>
      {/* 9 · Anna (laço 1) */}
      <Shot a={24.05} b={26.5}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1} z1={1.05}><AnnaGelo lt={lt} t={t} d={5.4} /></Cam>
        <AnnaTimer lt={lt} d={5.4} />
        <Etq lt={lt} t0={0.2} small="NORUEGA · 1999" big="UMA MULHER SOB O GELO" cor={FR.azul} />
      </>}</Shot>
      <Shot a={26.5} b={29.55}>{(lt, d) => <><Cam lt={lt} d={d} z0={1.32} z1={1.4} oy={62}><AnnaGelo lt={lt + 2.45} t={t} d={5.4} /></Cam><AnnaTimer lt={lt + 2.45} d={5.4} /></>}</Shot>
      {/* 10 · Blagden (laço 2) */}
      <Shot a={29.55} b={33.95}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.0} z1={1.07} ox={55}><SalaBlagden lt={lt} t={t} d={d} /></Cam>
        <Etq lt={lt} t0={0.15} small="LONDRES · SÉCULO XVIII" big="UM OVO COZIDO PELO AR" cor={QU.fogo} />
      </>}</Shot>
      {/* 11 · Willie Jones */}
      <Shot a={33.95} b={38.3}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.0} z1={1.06} ox={40}><Hospital lt={lt} t={t} d={d} /></Cam>
        <Etq lt={lt} t0={0.15} small="EUA · 1980" big="UM HOMEM A 46,5 °C" cor={QU.lava} />
      </>}</Shot>
      {/* 12 · as duas pontas */}
      <Shot a={38.3} b={42.65}>{(lt, d) => <>
        <Corredor t={t} cam={lerp(19, 24.5, sm(lt / d))} brilhoFim={lerp(0.7, 1, lt / d)} />
        <Chave lt={lt} t0={2.3} cor={C_OURO}>AS DUAS PONTAS</Chave>
      </>}</Shot>
      {/* 13 · placar */}
      <Shot a={42.65} b={45.3}>{(lt, d) => <Cam lt={lt} d={d} z0={1} z1={1.04}><Placar lt={lt} t={t} /></Cam>}</Shot>
      <Shot a={45.3} b={48.0}>{(lt, d) => <Cam lt={lt} d={d} z0={1.16} z1={1.2} ox={50} oy={80}><Placar lt={lt + 3} t={t} /></Cam>}</Shot>
      {/* 14 · aqui na Terra */}
      <Shot a={48.0} b={52.95}>{(lt, d) => <>
        <Terra lt={lt} t={t} d={d} />
        <Chave lt={lt} t0={0.5} cor={C_OURO} sai={3.2}>QUASE NINGUÉM SABE</Chave>
        <Chave lt={lt} t0={3.55} cor={C_OURO}>AS DUAS ESTÃO AQUI</Chave>
      </>}</Shot>
      {/* 15 · feitas por nós */}
      <Shot a={52.95} b={55.45}>{(lt, d) => <>
        <Laboratorio lt={lt} t={t} d={d} />
        <Chave lt={lt} t0={0.4} cor={C_OURO}>FEITAS POR NÓS</Chave>
      </>}</Shot>
      {/* 16 · porta por porta */}
      <Shot a={55.45} b={60.35}>{(lt, d) => <>
        <Corredor t={t} cam={lerp(1.2, 1.9, sm(lt / d))} camX={-0.6} pessoaZ={3.6} pessoaX={-1.25} pessoaBraco={K(lt, 0.4, 1.4)} brilhoFim={0.55} portaAberta={{i: 0, k: K(lt, 1.8, 4.6) * 0.35}} />
        <Progresso lt={lt} atual={1} />
      </>}</Shot>
      {/* 17 · a pergunta */}
      <Shot a={60.35} b={62.45}>{(lt) => <Pergunta lt={lt} t={t} />}</Shot>
      {/* 18 · o número mais importante: o seu */}
      <Shot a={62.45} b={66.25}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.0} z1={1.05}><Corpo37 lt={lt} t={t} d={d} pele={0} centro={0} orgaos={0} regua={0} /></Cam>
        <svg width={1920} height={1080} style={{position: 'absolute'}}><Regua k={KO(lt, 0.5, 1.4)} valor={37} /></svg>
        <Chave lt={lt} t0={2.75} cor={QU.fogo}>O SEU</Chave>
      </>}</Shot>
      {/* 19 · Porta 1 — 37 °C */}
      <Shot a={66.25} b={70.35}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.08} z1={1.14} ox={42} oy={45}><Corpo37 lt={lt} t={t} d={d} pele={K(lt, 3.2, 3.6)} centro={0} orgaos={0} regua={1} /></Cam>
        <svg width={1920} height={1080} style={{position: 'absolute'}}><Regua k={1} valor={37} /></svg>
        <Etq lt={lt} t0={0.1} small="PORTA 1 · VOCÊ" big="37 °C POR DENTRO" cor={QU.fogo} />
        <Chave lt={lt} t0={3.25} cor={FR.azul}>NÃO A PELE</Chave>
      </>}</Shot>
      <Shot a={70.35} b={PILOTO_FIM}>{(lt, d) => <>
        <Cam lt={lt} d={d} z0={1.3} z1={1.36} ox={42} oy={42}><Corpo37 lt={lt} t={t} d={d} pele={0} centro={K(lt, 0.0, 0.5)} orgaos={K(lt, 1.0, 1.5)} regua={1} /></Cam>
        <svg width={1920} height={1080} style={{position: 'absolute'}}><Regua k={1} valor={37} /></svg>
        <Tag x={1000} y={520} cor={QU.fogo} op={KO(lt, 0.05, 0.4)} size={30}>O CENTRO: 37 °C</Tag>
        <Tag x={1000} y={330} cor="#F29BA6" op={KO(lt, 1.6, 1.9)} size={26}>← CÉREBRO</Tag>
        <Tag x={1000} y={640} cor="#E2453B" op={KO(lt, 1.15, 1.45)} size={26}>← CORAÇÃO</Tag>
      </>}</Shot>

      {/* clarões de corte */}
      {[2.05, 18.05, 20.6, 21.75, 24.05, 48.0, 60.35, 66.25].map((x) => <Flash key={x} t={x} cor={x === 21.75 ? '#FFB547' : '#DDEBFF'} />)}
      <Vinheta forca={0.35} />
      <Grao />
    </AbsoluteFill>
  );
};
const C_BR = '#3DDBB4';
const C_OURO = '#E3B04B';
