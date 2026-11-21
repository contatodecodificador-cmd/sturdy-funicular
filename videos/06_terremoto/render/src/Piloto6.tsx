import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {Shot, Cam, Etq, Grao, Vinheta, KO, KS, lerp, es, useT} from './base';
import {COR, ReguaMag, Sismografo, CartelaData, Manaus, Lustre, EscadaVazia, Noticia, MapaAS, Rotulo, Pulso, MapaOficial, PredioPendulo, Cozinha, NumeroGigante, EscadaMag, BrasilAcre, CorteTeaser, InfoNoticia} from './cenas6';
import oliberal from '../public/noticias/oliberal.json';
import sbt from '../public/noticias/sbt.json';
import cnn from '../public/noticias/cnn.json';

export const PILOTO6_FIM = 89.2;
const COL: [number, number] = [-76.26, 4.86], MAO: [number, number] = [-60.02, -3.12];
const VE75: [number, number] = [-67.22, 10.6], VE72: [number, number] = [-68.74, 10.34];
const CAP: [string, number, number, number][] = [['MANAUS', -60.02, -3.12, 2.1], ['BELÉM', -48.5, -1.45, 2.9], ['BOA VISTA', -60.67, 2.82, 3.7], ['MACAPÁ', -51.07, 0.03, 4.6]];

// zoom único, leve e contínuo (in), mais leve quando a cena já tem movimento
const Z: React.FC<{lt: number; d: number; mov?: boolean; ox?: number; oy?: number; children: React.ReactNode}> = ({lt, d, mov, ox = 50, oy = 50, children}) => <Cam lt={lt} d={d} z0={1} z1={mov ? 1.012 : 1.025} ox={ox} oy={oy}>{children}</Cam>;

export const Piloto6: React.FC = () => {
  const t = useT();
  const hud = t >= 62.0;
  const fundoMapaColombia = <MapaAS lt={0} d={1} lonC={-68} latC={0} s0={30} s1={30} />;
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      <Shot a={0} b={2.6}>{(lt, d) => <Z lt={lt} d={d}><CartelaData lt={lt} t={t} txt="10 DE AGOSTO DE 2026" sub="MANAUS · AMAZONAS" /></Z>}</Shot>
      <Shot a={2.6} b={5.4}>{(lt, d) => <Z lt={lt} d={d} oy={60}><Manaus lt={lt} t={t} /></Z>}</Shot>
      <Shot a={5.4} b={8.4}>{(lt, d) => <Z lt={lt} d={d} mov oy={35}><Lustre lt={lt} t={t} /></Z>}</Shot>
      <Shot a={8.4} b={12.2}>{(lt, d) => <Z lt={lt} d={d} mov><EscadaVazia lt={lt} t={t} /></Z>}</Shot>
      <Shot a={12.2} b={16.4}>{(lt, d) => <Z lt={lt} d={d} mov oy={70}><Manaus lt={lt} t={t} pessoas={1} /></Z>}</Shot>
      <Shot a={16.4} b={21.3}>{(lt, d) => <Noticia lt={lt} d={d} img="noticias/oliberal.png" info={oliberal as InfoNoticia} fonte="O LIBERAL" data="10/08/2026" fundo={<Manaus lt={0} t={t} />} />}</Shot>
      <Shot a={21.3} b={25.4}>{(lt, d) => <MapaAS lt={lt} d={d} lonC={-68} latC={0.5} s0={30} s1={30.8}
        children={(P) => { const a = P(...COL), b = P(...MAO), k = KS(lt, 0.4, 2.2); return <g>
          <line x1={a[0]} y1={a[1]} x2={lerp(a[0], b[0], k)} y2={lerp(a[1], b[1], k)} stroke={COR.ouro} strokeWidth={5} strokeDasharray="14 10" />
          <Pulso p={a} t={t} cor={COR.perigo} /><Pulso p={b} t={t} cor={COR.calmo} r={8} op={KO(lt, 2.0, 2.4)} />
        </g>; }}
        html={(P) => { const a = P(...COL), b = P(...MAO); return <>
          <Rotulo x={a[0]} y={a[1]} txt="COLÔMBIA · 7,4" lado={-1} cor={COR.perigo} op={KO(lt, 0.2, 0.6)} />
          <Rotulo x={b[0]} y={b[1]} txt="MANAUS" lado={1} cor={COR.calmo} op={KO(lt, 2.1, 2.5)} />
          <Rotulo x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2 - 60} txt="+1.500 KM" lado={1} op={KO(lt, 2.6, 3.0)} />
        </>; }} />}</Shot>
      <Shot a={25.4} b={28.2}>{(lt, d) => <MapaOficial lt={lt} d={d} img="colombia_2026_intensidade.jpg" titulo="COLÔMBIA · 10/08/2026 · 7,4" />}</Shot>
      <Shot a={28.2} b={30.8}>{(lt, d) => <Noticia lt={lt} d={d} img="noticias/sbt.png" info={sbt as InfoNoticia} fonte="SBT NEWS" data="10/08/2026" fundo={fundoMapaColombia} g0={0.3} />}</Shot>
      <Shot a={30.8} b={34.0}>{(lt, d) => <MapaAS lt={lt} d={d} lonC={-64} latC={4} s0={34} s1={34.8}
        children={(P) => <g><Pulso p={P(...VE72)} t={t} cor={COR.perigo} op={KO(lt, 1.2, 1.5)} /><Pulso p={P(...VE75)} t={t + 0.4} cor={COR.perigo} op={KO(lt, 2.4, 2.7)} /></g>}
        html={(P) => <><Rotulo x={P(...VE72)[0]} y={P(...VE72)[1] + 70} txt="7,2" lado={-1} cor={COR.perigo} op={KO(lt, 1.3, 1.6)} /><Rotulo x={P(...VE75)[0]} y={P(...VE75)[1] + 70} txt="7,5" sub="VENEZUELA · JUNHO DE 2026" lado={1} cor={COR.perigo} op={KO(lt, 2.5, 2.8)} /></>} />}</Shot>
      <Shot a={34.0} b={38.4}>{(lt, d) => <Noticia lt={lt} d={d} img="noticias/cnn.png" info={cnn as InfoNoticia} fonte="CNN BRASIL" data="24/06/2026" fundo={<MapaAS lt={0} d={1} lonC={-64} latC={4} s0={34} s1={34} />} />}</Shot>
      <Shot a={38.4} b={43.6}>{(lt, d) => <MapaAS lt={lt} d={d} lonC={-58} latC={-0.5} s0={42} s1={43}
        children={(P) => <g>{CAP.map(([n, lo, la, t0]) => <Pulso key={n} p={P(lo, la)} t={t} cor={COR.ouro} op={KO(lt, t0, t0 + 0.3)} r={9} />)}</g>}
        html={(P) => <>{CAP.map(([n, lo, la, t0], i) => <Rotulo key={n} x={P(lo, la)[0]} y={P(lo, la)[1]} txt={n} lado={i % 2 ? 1 : -1} op={KO(lt, t0, t0 + 0.3)} />)}</>} />}</Shot>
      <Shot a={43.6} b={48.6}>{(lt, d) => <Z lt={lt} d={d} mov><PredioPendulo lt={lt} t={t} amp={2.2} /></Z>}</Shot>
      <Shot a={48.6} b={52.9}>{(lt, d) => <Z lt={lt} d={d}><Cozinha lt={lt} t={t} onda={0} /></Z>}</Shot>
      <Shot a={52.9} b={57.1}>{(lt, d) => <NumeroGigante lt={lt} d={d} t={t} txt="9,5" sub="O MAIOR TERREMOTO JÁ MEDIDO" />}</Shot>
      <Shot a={57.1} b={62.0}>{(lt, d) => <Z lt={lt} d={d} mov><EscadaMag lt={lt} d={d} t={t} ate={3.6} /></Z>}</Shot>
      <Shot a={62.0} b={66.9}>{(lt, d) => <Z lt={lt} d={d}><Cozinha lt={lt} t={t} onda={0} close={0.12} /></Z>}</Shot>
      <Shot a={66.9} b={70.4}>{(lt, d) => <Cozinha lt={lt} t={t} onda={0.02} close={lerp(0.42, 0.47, es(lt / d))} />}</Shot>
      <Shot a={70.4} b={75.6}>{(lt, d) => <BrasilAcre lt={lt} d={d} t={t} />}</Shot>
      <Shot a={75.6} b={79.4}>{(lt, d) => <Z lt={lt} d={d}><CorteTeaser lt={lt} d={d} t={t} /></Z>}</Shot>
      <Shot a={79.4} b={82.4}>{(lt, d) => <Cozinha lt={lt} t={t} onda={0} close={lerp(0.5, 0.53, es(lt / d))} />}</Shot>
      <Shot a={82.4} b={86.2}>{(lt, d) => <Z lt={lt} d={d}><Cozinha lt={lt} t={t} onda={0} close={0.12} /></Z>}</Shot>
      <Shot a={86.2} b={PILOTO6_FIM}>{(lt, d) => <MapaAS lt={lt} d={d} lonC={-53} latC={-14} s0={24} s1={24.6} escuro={0.55}
        html={() => <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: KO(lt, 0.2, 0.6)}}><span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 170, color: '#fff', textShadow: `0 0 40px ${COR.perigo}, 0 8px 24px rgba(0,0,0,0.8)`}}>9,5 NO BRASIL?</span></div>} />}</Shot>

      {/* HUD: régua (sobe até 9,5 na pergunta final) e sismógrafo, a partir do momento em que são apresentados */}
      {hud && t < 86.2 && <ReguaMag k={KO(t, 62.2, 63.2)} valor={t >= 82.4 ? lerp(0, 9.5, KS(t, 82.8, 85.6)) : 0} t={t} />}
      {hud && t < 86.2 && t < 70.4 || (t >= 79.4 && t < 86.2) ? <Sismografo k={KO(t, 63.0, 64.0)} t={t} amp={0.04} /> : null}
      <Vinheta forca={0.3} />
      <Grao />
    </AbsoluteFill>
  );
};
