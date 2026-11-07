// Peças de tela (HUD) da série "O Tempo Parou" · estilo Praça ao Sol. Tudo original.
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import '@fontsource/anton';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/nunito/800.css';

export const COR = {
  tinta: '#2B2420', ipe: '#F2C14E', terracota: '#D96C4A', praca: '#5FA36A', azul: '#2F6FA3', papel: '#FFF8EC', ceu: '#7EC8E3', parado: '#7F93A8',
};
const BARLOW = "'Barlow Condensed', sans-serif";
const ANTON = "Anton, sans-serif";

/** progresso de entrada com mola (0 → 1), começando em `em` segundos dentro da cena */
export function useEntrada(em = 0, rigidez = 190, amort = 13) {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - Math.round(em * fps), fps, config: {stiffness: rigidez, damping: amort}});
}
export function useT() {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
}

const sombra = '0 10px 26px rgba(0,0,0,.28)';

/** Bannerzinho amarelo com seta apontando pra uma coisa. (x,y) = ponta da seta. */
export const Etiqueta: React.FC<{x: number; y: number; texto: string; em?: number; seta?: 'baixo' | 'cima' | 'esq' | 'dir'; cor?: string; corTexto?: string; tam?: number}> = ({x, y, texto, em = 0, seta = 'baixo', cor = COR.ipe, corTexto = COR.tinta, tam = 34}) => {
  const p = useEntrada(em, 260, 12);
  if (p <= 0.001) return null;
  const off: Record<string, string> = {baixo: 'translate(-50%, calc(-100% - 22px))', cima: 'translate(-50%, 22px)', esq: 'translate(22px, -50%)', dir: 'translate(calc(-100% - 22px), -50%)'};
  const tri: Record<string, React.CSSProperties> = {
    baixo: {left: '50%', bottom: -18, transform: 'translateX(-50%)', borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderTop: `20px solid ${cor}`},
    cima: {left: '50%', top: -18, transform: 'translateX(-50%)', borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: `20px solid ${cor}`},
    esq: {top: '50%', left: -18, transform: 'translateY(-50%)', borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderRight: `20px solid ${cor}`},
    dir: {top: '50%', right: -18, transform: 'translateY(-50%)', borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: `20px solid ${cor}`},
  };
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `${off[seta]} scale(${p}) rotate(${(1 - p) * -8}deg)`, transformOrigin: seta === 'baixo' ? '50% 130%' : '50% 50%'}}>
      <div style={{position: 'relative', background: cor, color: corTexto, fontFamily: BARLOW, fontWeight: 800, fontSize: tam, padding: '6px 18px', borderRadius: 10, whiteSpace: 'nowrap', boxShadow: sombra, border: `3px solid ${COR.tinta}`, letterSpacing: 1}}>
        {texto}
        <div style={{position: 'absolute', width: 0, height: 0, ...tri[seta]}} />
      </div>
    </div>
  );
};

/** Ficha de pessoa: cartão de papel com retrato 3x4, entra deslizando e gira. */
export const Ficha: React.FC<{x: number; y: number; nome: string; linha2: string; retrato: string; em?: number; rot?: number; lado?: 1 | -1}> = ({x, y, nome, linha2, retrato, em = 0, rot = -3, lado = -1}) => {
  const p = useEntrada(em, 170, 14);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 430, transform: `translateX(${(1 - p) * 500 * lado}px) rotate(${rot + (1 - p) * 10 * lado}deg)`, opacity: Math.min(1, p * 2)}}>
      <div style={{background: COR.papel, border: `3px solid ${COR.tinta}`, borderRadius: 14, boxShadow: sombra, display: 'flex', gap: 16, padding: 14, alignItems: 'center'}}>
        <svg viewBox="110 70 180 240" width={108} height={144} style={{background: '#CFE3EC', borderRadius: 8, border: `3px solid ${COR.tinta}`, flex: 'none'}} dangerouslySetInnerHTML={{__html: retrato}} />
        <div>
          <div style={{fontFamily: ANTON, fontSize: 46, color: COR.tinta, lineHeight: 1.05}}>{nome}</div>
          <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 30, color: COR.terracota, letterSpacing: 1}}>{linha2}</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: -16, left: 40, width: 22, height: 58, border: '5px solid #8D939A', borderRadius: 12}} />
    </div>
  );
};

const fmt = (v: number, casas = 0) => v.toLocaleString('pt-BR', {minimumFractionDigits: casas, maximumFractionDigits: casas});

/** Medidor/contador: número que vai de `de` até `para` na frente de quem assiste. */
export const Medidor: React.FC<{x: number; y: number; rotulo: string; de: number; para: number; unid?: string; em?: number; dur?: number; casas?: number; barra?: number; corNum?: string; seta?: '▲' | '▼' | ''; largura?: number; tamNum?: number; textoFinal?: string; prefixo?: string}> = (
  {x, y, rotulo, de, para, unid = '', em = 0, dur = 0.8, casas = 0, barra, corNum = COR.tinta, seta = '', largura = 420, tamNum = 76, textoFinal, prefixo = ''}) => {
  const p = useEntrada(em, 230, 15);
  const t = useT();
  if (p <= 0.001) return null;
  const k = interpolate(t, [em + 0.15, em + 0.15 + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = de + (para - de) * k;
  const fim = k >= 1 && textoFinal;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: largura, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: '0 0', opacity: p}}>
      <div style={{background: '#fff', borderRadius: 24, padding: '16px 24px', boxShadow: sombra, border: `3px solid ${COR.tinta}`}}>
        <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 28, color: COR.tinta, opacity: 0.7, letterSpacing: 1}}>{rotulo}</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
          <span style={{fontFamily: ANTON, fontSize: tamNum, color: corNum, lineHeight: 1.05}}>{fim ? textoFinal : prefixo + fmt(v, casas)}</span>
          {!fim && <span style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 38, color: COR.tinta}}>{unid}</span>}
          {seta && <span style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: seta === '▲' ? COR.praca : COR.terracota}}>{seta}</span>}
        </div>
        {barra !== undefined && (
          <div style={{height: 18, background: '#E8E2D6', borderRadius: 9, marginTop: 6, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${Math.max(0, Math.min(1, v / barra)) * 100}%`, background: corNum === COR.tinta ? COR.ipe : corNum, borderRadius: 9}} />
          </div>
        )}
      </div>
    </div>
  );
};

/** Cartão grande no centro (TESTE 1 · COISAS, DIA 3...) */
export const Cartao: React.FC<{titulo: string; sub?: string; em?: number; y?: number; cor?: string}> = ({titulo, sub, em = 0, y = 640, cor = COR.ipe}) => {
  const p = useEntrada(em, 300, 11);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${p}) rotate(${(1 - p) * 12 - 2}deg)`, background: '#fff', border: `5px solid ${COR.tinta}`, borderRadius: 30, padding: '26px 60px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.4)'}}>
        <div style={{fontFamily: ANTON, fontSize: 120, color: COR.tinta, lineHeight: 1}}>{titulo.split(' ').map((w, i) => /\d/.test(w) ? <span key={i} style={{color: cor, WebkitTextStroke: `4px ${COR.tinta}`}}>{w} </span> : <span key={i}>{w} </span>)}</div>
        {sub && <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 56, color: COR.terracota, letterSpacing: 4, marginTop: 6}}>{sub}</div>}
      </div>
    </div>
  );
};

/** Carimbo torto que bate na tela */
export const Carimbo: React.FC<{x: number; y: number; texto: string; em?: number; rot?: number; cor?: string; tam?: number}> = ({x, y, texto, em = 0, rot = -10, cor = COR.terracota, tam = 70}) => {
  const p = useEntrada(em, 420, 18);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{fontFamily: ANTON, fontSize: tam, color: cor, border: `7px solid ${cor}`, borderRadius: 12, padding: '2px 22px', background: 'rgba(255,248,236,.85)', letterSpacing: 3}}>{texto}</div>
    </div>
  );
};

/** Pílula do topo: LUGAR · DIA · HORA */
export const Topo: React.FC<{texto: string}> = ({texto}) => (
  <div style={{position: 'absolute', left: 60, top: 70, background: '#fff', borderRadius: 40, padding: '10px 30px', fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: COR.tinta, boxShadow: sombra, border: `3px solid ${COR.tinta}`}}>
    <span style={{display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: COR.terracota, marginRight: 14, verticalAlign: 'middle'}} />{texto}
  </div>
);

/** Os dois relógios (marca da série) */
export const Relogios: React.FC<{rose: string; em?: number; y?: number; so?: 'mundo' | 'rose'}> = ({rose, em = 0, y = 160, so}) => {
  const p = useEntrada(em, 220, 15);
  if (p <= 0.001) return null;
  const card = (rot: string, val: string, cor: string, icone: string, ic: string) => (
    <div style={{background: '#fff', borderRadius: 24, padding: '12px 24px', border: `3px solid ${COR.tinta}`, boxShadow: sombra, minWidth: 370}}>
      <div style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 26, color: COR.tinta, opacity: 0.7}}>{rot}</div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><span style={{fontFamily: ANTON, fontSize: 70, color: cor}}>{val}</span><span style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: ic}}>{icone}</span></div>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 60, top: y, display: 'flex', gap: 20, transform: `translateY(${(1 - p) * -60}px)`, opacity: p}}>
      {so !== 'rose' && card('RELÓGIO DO MUNDO', '16:47:00', COR.parado, '❚❚', COR.parado)}
      {so !== 'mundo' && card('RELÓGIO DA ROSE', rose, COR.tinta, '▶', COR.praca)}
    </div>
  );
};

export const Checklist: React.FC<{x: number; y: number; itens: string[]; em?: number; passo?: number}> = ({x, y, itens, em = 0, passo = 0.4}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: x, top: y, background: COR.papel, border: `3px solid ${COR.tinta}`, borderRadius: 18, padding: '16px 26px', boxShadow: sombra, transform: 'rotate(2deg)', opacity: t > em ? 1 : 0}}>
      {itens.map((it, i) => (
        <div key={i} style={{fontFamily: BARLOW, fontWeight: 800, fontSize: 40, color: COR.tinta, display: 'flex', gap: 16, alignItems: 'center', opacity: t > em + i * passo ? 1 : 0.15}}>
          <span>{it}</span><span style={{marginLeft: 'auto', color: COR.parado, border: `3px solid ${COR.parado}`, borderRadius: 8, padding: '0 10px', fontSize: 28}}>PARADO</span>
        </div>
      ))}
    </div>
  );
};

/** Clarão de congelamento */
export const Flash: React.FC<{em: number; cor?: string; dur?: number}> = ({em, cor = '#fff', dur = 0.35}) => {
  const t = useT();
  const o = interpolate(t, [em, em + 0.04, em + dur], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return o > 0 ? <div style={{position: 'absolute', inset: 0, background: cor, opacity: o}} /> : null;
};

/** Pergunta final */
export const Pergunta: React.FC<{em?: number}> = ({em = 0}) => {
  const p = useEntrada(em, 260, 12);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${p})`, textAlign: 'center'}}>
        <div style={{fontFamily: ANTON, fontSize: 130, color: '#fff', WebkitTextStroke: `10px ${COR.tinta}`, paintOrder: 'stroke', lineHeight: 1.05}}>O QUE <span style={{color: COR.ipe}}>VOCÊ</span><br />FARIA?</div>
        <div style={{display: 'inline-block', marginTop: 20, background: COR.ipe, border: `4px solid ${COR.tinta}`, borderRadius: 40, padding: '8px 36px', fontFamily: BARLOW, fontWeight: 800, fontSize: 46, color: COR.tinta}}>COMENTA AQUI EMBAIXO</div>
      </div>
    </div>
  );
};
