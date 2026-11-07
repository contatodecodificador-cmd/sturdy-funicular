// Cenários do Ep. 1. Cada cenário é um "mundo" SVG (W x H) que a Câmera enquadra.
import React from 'react';
import {rose, pessoa, FIG, EXTRAS, cen, poe} from './arte';

const T = '#2B2420';
const ST = `stroke="${T}" stroke-width="3" stroke-linejoin="round"`;
const Svg: React.FC<{W: number; H: number; html: string}> = ({W, H, html}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} dangerouslySetInnerHTML={{__html: html}} />
);

// ---------------------------------------------------------------- RUA (mundo principal)
export const RUA = {W: 2400, H: 1920, lim: {x0: 0, y0: -1300, x1: 2400, y1: 3200}};
// posições (pés) no primeiro plano, escala 0.5
export const POS = {joao: 640, joaoMovido: 860, priscila: 1300, marcos: 1660, predio: 2060, ciclista: 400, pe: 1890, k: 0.5};

function predioComercial() {
  let s = `<rect x="1810" y="250" width="620" height="1040" fill="#E4DED2" ${ST}/>`;
  s += `<rect x="1800" y="230" width="640" height="30" fill="#CFC7B8" ${ST}/>`;
  for (let y = 290; y < 1000; y += 92) for (let x = 1840; x < 2400; x += 92) s += `<rect x="${x}" y="${y}" width="68" height="70" fill="#9FC4D6" stroke="#8C949C" stroke-width="3"/><path d="M${x + 6},${y + 6} L${x + 26},${y + 6} L${x + 6},${y + 40}Z" fill="#fff" opacity=".4"/>`;
  s += `<rect x="1820" y="1020" width="600" height="40" fill="#2F6FA3" ${ST}/><text x="2120" y="1050" text-anchor="middle" font-family="Anton, sans-serif" font-size="30" fill="#fff" letter-spacing="3">EDIFÍCIO CENTRAL</text>`;
  s += `<rect x="1950" y="1080" width="230" height="210" fill="#7FA9BE" ${ST}/><path d="M2065,1080 L2065,1290" ${ST}/><path d="M1960,1092 L2000,1092 L1960,1180Z" fill="#fff" opacity=".4"/>`;
  s += `<rect x="1930" y="1066" width="270" height="18" fill="#8A847A" ${ST}/>`;
  return s;
}

function bicicleta(cx: number, pe: number, k: number) {
  let s = `<g transform="translate(${cx},${pe}) scale(${k})">`;
  for (const wx of [-260, 260]) {
    s += `<circle cx="${wx}" cy="-150" r="150" fill="none" stroke="#2B2B2B" stroke-width="22"/><circle cx="${wx}" cy="-150" r="10" fill="#555"/>`;
    for (let a = 0; a < 12; a++) { const r = a * Math.PI / 6; s += `<path d="M${wx},-150 L${wx + Math.cos(r) * 140},${-150 + Math.sin(r) * 140}" stroke="#9AA0A6" stroke-width="3"/>`; }
  }
  s += `<path d="M-260,-150 L-60,-160 L120,-420 L-90,-420 Z M-60,-160 L-90,-420 M120,-420 L260,-150" stroke="#D96C4A" stroke-width="20" fill="none" stroke-linejoin="round"/>`;
  s += `<path d="M120,-420 L150,-540 L230,-560" stroke="#2B2B2B" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-130,-450 L-20,-450" stroke="#2B2B2B" stroke-width="26" stroke-linecap="round"/>`;
  return s + '</g>';
}

function ciclista(cx: number, pe: number, k: number) {
  // Wesley de bike, congelado no meio da pedalada
  const corpo = pessoa(EXTRAS.wesley);
  let s = `<defs><clipPath id="cortaPerna"><rect x="-50" y="0" width="500" height="930"/></clipPath></defs>`;
  s += bicicleta(cx, pe, k);
  s += `<g transform="translate(${cx + (-75 - 200) * k},${pe + (-450 - 900) * k}) scale(${k})"><g clip-path="url(#cortaPerna)">${corpo}</g></g>`;
  s += `<path d="M${cx - 90 * k},${pe - 460 * k} L${cx - 40 * k},${pe - 160 * k} L${cx - 150 * k},${pe - 120 * k}" stroke="#2F3440" stroke-width="${70 * k}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}

function ruaFundo() {
  const {W} = RUA;
  let s = `<defs><linearGradient id="ceuR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FCBE6"/><stop offset=".62" stop-color="#F6E7C4"/><stop offset="1" stop-color="#FCE3B0"/></linearGradient></defs>`;
  s += `<rect x="-50" y="-1400" width="${W + 100}" height="1500" fill="#8FCBE6"/><rect width="${W}" height="1920" fill="url(#ceuR)"/><circle cx="1560" cy="600" r="90" fill="#FFE9A8"/><circle cx="1560" cy="600" r="140" fill="#FFE9A8" opacity=".25"/>`;
  const fundo = [[0, 470, 150], [170, 400, 120], [300, 520, 110], [430, 360, 140], [600, 450, 130], [760, 380, 160], [940, 500, 150], [1110, 420, 130], [1260, 340, 170], [1450, 470, 140], [1610, 390, 150]];
  for (const [x, y, w] of fundo) { s += `<rect x="${x}" y="${y}" width="${w}" height="${900 - y}" fill="#C9D6DE"/>`; for (let yy = y + 20; yy < 880; yy += 34) for (let xx = x + 14; xx < x + w - 20; xx += 28) s += `<rect x="${xx}" y="${yy}" width="16" height="20" fill="#E3ECF1"/>`; }
  s += cen.sobrado(-40, 760, 300, 530, {cor: '#F2C14E', loja: 'PADARIA PÃO DE OURO', vitrine: 'paes', sacada: 0, veneziana: '#2F6FA3', numero: '214', toldo: ['#D96C4A', '#FFF8EC']});
  s += cen.sobrado(270, 700, 280, 590, {cor: '#E89A7A', loja: 'SALÃO DA DEISE', vitrine: 'salao', veneziana: '#5FA36A', arCond: 1, numero: '220', toldo: ['#B9A7DB', '#FFF8EC']});
  s += cen.sobrado(560, 740, 290, 550, {cor: '#7FB98A', loja: 'LANCHES DO ZÉ', veneziana: '#F4EDE1', sacada: 1, toldo: ['#2F6FA3', '#FFF8EC'], corPlaca: '#F2C14E'});
  s += cen.sobrado(860, 690, 290, 600, {cor: '#4E86B8', loja: 'MERCADINHO', porta: 'enrolar', veneziana: '#F2C14E', arCond: 0, corPlaca: '#D96C4A', corLetra: '#fff'});
  s += cen.sobrado(1160, 720, 290, 570, {cor: '#F4EDE1', loja: 'DROGARIA', veneziana: '#2F6FA3', sacada: 0, toldo: ['#5FA36A', '#FFF8EC'], corPlaca: '#5FA36A', corLetra: '#fff', numero: '238'});
  s += cen.sobrado(1460, 700, 340, 590, {cor: '#B9A7DB', loja: 'MÓVEIS DA PRAÇA', veneziana: '#FFF8EC', arCond: 1, toldo: ['#F2C14E', '#FFF8EC']});
  s += predioComercial();
  s += cen.poste(480, 1300, 640) + cen.poste(1500, 1300, 640) + cen.fios(-200, 660, 2600, 660, 3);
  s += cen.arvore(130, 1305, 0.72) + cen.arvore(1150, 1305, 0.6);
  s += `<rect y="1290" width="${W}" height="70" fill="#E4DCCD"/>`;
  // segundo plano (todos com rosto)
  s += poe(pessoa(FIG.kaique), 200, 1356, 0.2) + poe(pessoa(FIG.tais), 340, 1350, 0.2) + poe(pessoa(EXTRAS.osmar), 720, 1352, 0.2);
  s += poe(pessoa(EXTRAS.beto), 1580, 1356, 0.2) + poe(pessoa(FIG.daniel), 1720, 1354, 0.2) + poe(pessoa(EXTRAS.lucia), 2280, 1352, 0.2, true);
  s += cen.pomboChao(300, 1335, 0.5);
  s += cen.rua(1360, 220, W);
  return s;
}

function ruaFrente() {
  let s = cen.calcada(1580, 1700, RUA.W);
  s += ciclista(POS.ciclista, POS.pe, POS.k);
  s += poe(pessoa(FIG.marcos), POS.marcos, 1900, 0.5);
  s += poe(pessoa(EXTRAS.nina), 2330, 1905, 0.52, true);
  return s;
}

const poeira = (() => { let s = ''; for (let i = 0; i < 90; i++) s += `<circle cx="${(i * 137) % 2380 + 10}" cy="${560 + (i * 251) % 1200}" r="${2 + (i % 3)}" fill="#fff" opacity=".7"/>`; return s; })();

export type EstadoRua = {
  congelado: number; roseX: number; roseExpr?: string; rosePiscar?: boolean; roseFlip?: boolean; roseSentada?: boolean; roseVisivel?: boolean;
  joaoX: number; onibusX?: number; cafeSuspenso?: boolean; bolso?: number; pombo?: boolean; camada?: 'base' | 'rose';
};

export const Rua: React.FC<EstadoRua> = (e) => {
  const fundo = React.useMemo(ruaFundo, []);
  const frente = React.useMemo(ruaFrente, []);
  const {W, H} = RUA;
  const k = POS.k;
  const roseSvg = rose({expr: e.roseExpr || 'surpresa', piscar: !!e.rosePiscar});
  const joao = poe(pessoa(FIG.seuJoao), e.joaoX, POS.pe, k);
  const pri = poe(pessoa({...FIG.priscila, cafeSuspenso: e.cafeSuspenso !== false}), POS.priscila, POS.pe, k);
  const bolso = e.bolso ? `<rect x="${e.joaoX + (226 - 200) * k}" y="${POS.pe - 1700 * k + 520 * k}" width="${50 * k}" height="${70 * k}" rx="4" fill="#BFE6FF" opacity="${e.bolso}"/><circle cx="${e.joaoX + 50 * k}" cy="${POS.pe - 1700 * k + 555 * k}" r="${60 * k}" fill="#BFE6FF" opacity="${0.35 * e.bolso}"/>` : '';
  let roseG = '';
  if (e.roseVisivel !== false) {
    if (e.roseSentada) roseG = `<defs><clipPath id="sentada"><rect x="0" y="0" width="400" height="1020"/></clipPath></defs><g transform="translate(${e.roseX - 200 * k},${1600 - 1020 * k}) scale(${k})"><g clip-path="url(#sentada)">${roseSvg}</g></g><rect x="${e.roseX - 140}" y="1596" width="280" height="40" rx="10" fill="#24364F" ${ST}/>`;
    else roseG = `<path d="M${e.roseX - 60},${POS.pe + 4} L${e.roseX + 300},${POS.pe + 40} L${e.roseX + 310},${POS.pe + 56} L${e.roseX - 50},${POS.pe + 18}Z" fill="#000" opacity=".14"/>` + poe(roseSvg, e.roseX, POS.pe, k, !!e.roseFlip);
  }
  const html = fundo + cen.onibus(820 + (e.onibusX || 0), 1320, 0.64) + frente + joao + pri + bolso
    + (e.pombo !== false ? cen.pomboVoando(1700, 640, 1.0, -8) + `<path d="M1660,700 C1650,720 1662,736 1676,740" stroke="#B4BCC6" stroke-width="5" fill="none"/>` : '')
    + (e.congelado > 0 ? poeira.replace(/opacity=".7"/g, `opacity="${0.7 * e.congelado}"`) + `<rect x="-50" y="-1400" width="${W + 100}" height="${H + 3000}" fill="#9FB8D0" opacity="${0.2 * e.congelado}"/>` : '')
    ;
  if (e.camada === 'rose') return <Svg W={W} H={H} html={roseG} />;
  return <Svg W={W} H={H} html={e.camada === 'base' ? html : html + roseG} />;
};

// ---------------------------------------------------------------- MUNDO (globo com luzes apagando)
export const MUNDO = {W: 1080, H: 1920};
export const Mundo: React.FC<{acesas: number; t: number}> = ({acesas, t}) => {
  const html = React.useMemo(() => {
    let s = `<rect width="1080" height="1920" fill="#0E1D36"/>`;
    for (let i = 0; i < 120; i++) s += `<circle cx="${(i * 233) % 1080}" cy="${(i * 397) % 1920}" r="${1 + (i % 2)}" fill="#fff" opacity=".5"/>`;
    s += `<circle cx="540" cy="900" r="430" fill="#1F4E79" stroke="#7EC8E3" stroke-width="6"/>`;
    const cont = ['M300,640 C360,560 470,560 520,620 C560,680 520,740 470,760 C430,800 440,880 400,900 C350,860 330,800 300,760 C270,720 270,680 300,640Z',
      'M450,920 C500,900 560,930 570,990 C580,1060 540,1140 500,1200 C470,1160 470,1080 440,1030 C420,980 420,940 450,920Z',
      'M600,600 C680,560 800,590 840,660 C870,720 820,760 760,770 C720,820 660,800 640,740 C610,700 580,650 600,600Z',
      'M660,860 C720,840 780,880 790,950 C800,1010 760,1050 720,1040 C680,1010 650,960 660,860Z'];
    s += cont.map(d => `<path d="${d}" fill="#5FA36A" opacity=".85"/>`).join('');
    return s;
  }, []);
  const pontos = React.useMemo(() => Array.from({length: 260}, (_, i) => {
    const a = (i * 137.5) * Math.PI / 180, r = Math.sqrt(i / 260) * 400;
    return [540 + Math.cos(a) * r, 900 + Math.sin(a) * r];
  }), []);
  let luz = '';
  pontos.forEach(([x, y], i) => { if (i / pontos.length < acesas) luz += `<circle cx="${x}" cy="${y}" r="5" fill="#FFE9A8"/>`; });
  const pulso = 10 + Math.sin(t * 8) * 4;
  luz += `<circle cx="505" cy="1000" r="${pulso + 14}" fill="#F2C14E" opacity=".35"/><circle cx="505" cy="1000" r="${pulso}" fill="#F2C14E" stroke="${T}" stroke-width="3"/>`;
  return <Svg W={1080} H={1920} html={html + luz} />;
};

// ---------------------------------------------------------------- ESCADA (prédio, 22 andares)
export const ESCADA = {W: 1080, H: 4200};
export const Escada: React.FC<{subida: number}> = ({subida}) => {
  const html = React.useMemo(() => {
    let s = `<rect width="1080" height="4200" fill="#D9D2C4"/>`;
    for (let i = 0; i < 12; i++) {
      const y = 4000 - i * 340;
      s += `<path d="M120,${y} L960,${y - 300}" stroke="#8A847A" stroke-width="40"/>`;
      for (let d = 0; d < 14; d++) s += `<rect x="${120 + d * 60}" y="${y - d * 21.4 - 20}" width="62" height="24" fill="#B9B2A6" ${ST}/>`;
      s += `<path d="M120,${y - 140} L960,${y - 440}" stroke="#4A4A4A" stroke-width="10"/>`;
      s += `<rect x="60" y="${y - 260}" width="140" height="80" rx="8" fill="#2F6FA3" ${ST}/><text x="130" y="${y - 206}" text-anchor="middle" font-family="Anton, sans-serif" font-size="46" fill="#fff">${i * 2 + 1}º</text>`;
    }
    s += `<rect width="1080" height="4200" fill="#9FB8D0" opacity=".15"/>`;
    return s;
  }, []);
  const y = 4000 - subida * 3740;
  const fr = (subida * 11) % 2;
  const x = 160 + (fr < 1 ? fr : 2 - fr) * 700;
  return <Svg W={1080} H={4200} html={html + poe(rose({expr: 'brava'}), x, y - (x - 160) * 0.357, 0.42)} />;
};

// ---------------------------------------------------------------- TERRAÇO (cidade toda parada)
export const TERRACO = {W: 2000, H: 1920, lim: {x0: 0, y0: -900, x1: 2000, y1: 2700}};
export const Terraco: React.FC<{}> = () => {
  const html = React.useMemo(() => {
    let s = `<defs><linearGradient id="ceuT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FBCDD"/><stop offset=".7" stop-color="#F8DDA8"/><stop offset="1" stop-color="#F7C98B"/></linearGradient></defs>`;
    s += `<rect x="-50" y="-1000" width="2100" height="1100" fill="#7FBCDD"/><rect width="2000" height="1920" fill="url(#ceuT)"/><circle cx="1500" cy="520" r="110" fill="#FFE29A"/><circle cx="1500" cy="520" r="180" fill="#FFE29A" opacity=".3"/>`;
    for (let i = 0; i < 40; i++) {
      const x = (i * 97) % 2000, h = 200 + (i * 173) % 500, w = 60 + (i * 31) % 90;
      s += `<rect x="${x}" y="${1300 - h}" width="${w}" height="${h + 300}" fill="${['#B8C7D1', '#C9D6DE', '#A9B9C4'][i % 3]}" stroke="#8C9AA5" stroke-width="2"/>`;
      for (let yy = 1320 - h; yy < 1300; yy += 30) for (let xx = x + 8; xx < x + w - 12; xx += 22) s += `<rect x="${xx}" y="${yy}" width="10" height="14" fill="#E9F0F4"/>`;
    }
    // chaminés com fumaça parada
    for (const [cx, cy] of [[420, 980], [1180, 1040], [1760, 960]]) {
      s += `<rect x="${cx - 18}" y="${cy}" width="36" height="140" fill="#9C4A32" ${ST}/>`;
      for (let k = 0; k < 6; k++) s += `<circle cx="${cx + k * 26}" cy="${cy - 30 - k * 46}" r="${22 + k * 6}" fill="#EDEDED" opacity="${0.85 - k * 0.1}"/>`;
    }
    // avião parado
    s += `<g transform="translate(560,420) rotate(-6)"><path d="M-160,0 C-120,-24 120,-24 170,0 C120,22 -120,22 -160,0Z" fill="#F4F1EA" ${ST}/><path d="M-20,0 L-90,-110 L-40,-110 L60,0Z M-20,0 L-90,110 L-40,110 L60,0Z M-140,0 L-180,-60 L-150,-60 L-110,0Z" fill="#DCD6CB" ${ST}/><circle cx="140" cy="-4" r="8" fill="#7FA9BE"/></g>`;
    s += `<path d="M380,440 C200,470 0,500 -100,520" stroke="#fff" stroke-width="10" opacity=".7" fill="none"/>`;
    s += `<rect width="2000" height="1920" fill="#9FB8D0" opacity=".18"/>`;
    // parapeito do terraço
    s += `<rect x="0" y="1560" width="2000" height="1200" fill="#BDB6A9" ${ST}/><rect x="0" y="1540" width="2000" height="40" fill="#D8D1C4" ${ST}/>`;
    s += `<rect x="1300" y="1420" width="160" height="140" fill="#9AA5AE" ${ST}/><text x="1380" y="1505" text-anchor="middle" font-family="Anton, sans-serif" font-size="40" fill="#fff">22º</text>`;
    return s;
  }, []);
  return <Svg W={2000} H={1920} html={html + poe(rose({expr: 'surpresa'}), 700, 1890, 0.5)} />;
};

// ---------------------------------------------------------------- RELÓGIO DE RUA (4:47)
export const RELOGIO = {W: 1080, H: 1920};
export const RelogioRua: React.FC<{tremeAgulha: number}> = ({tremeAgulha}) => {
  const ang = (m: number) => (m / 60) * 360;
  const ah = ((4 + 47 / 60) / 12) * 360, am = ang(47) + tremeAgulha;
  let s = `<rect width="1080" height="1920" fill="#F6E7C4"/><rect x="510" y="1000" width="60" height="920" fill="#2B4A3A" ${ST}/>`;
  s += `<circle cx="540" cy="760" r="330" fill="#2B4A3A" ${ST}/><circle cx="540" cy="760" r="290" fill="#FFF8EC" ${ST}/>`;
  for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; s += `<rect x="534" y="${760 - 270}" width="12" height="${i % 3 ? 26 : 46}" fill="${T}" transform="rotate(${i * 30} 540 760)"/>`; void a; }
  s += `<rect x="530" y="590" width="20" height="180" rx="10" fill="${T}" transform="rotate(${ah} 540 760)"/>`;
  s += `<rect x="534" y="520" width="12" height="250" rx="6" fill="${T}" transform="rotate(${am} 540 760)"/>`;
  s += `<rect x="537" y="500" width="6" height="280" fill="#D96C4A" transform="rotate(0 540 760)"/><circle cx="540" cy="760" r="16" fill="#D96C4A"/>`;
  s += `<rect width="1080" height="1920" fill="#9FB8D0" opacity=".2"/>`;
  return <Svg W={1080} H={1920} html={s} />;
};

// ---------------------------------------------------------------- PULSO (relógio da Rose)
export const Pulso: React.FC<{hora: string}> = ({hora}) => {
  let s = `<rect width="1080" height="1920" fill="#E9DCC6"/>`;
  s += `<path d="M-100,1150 C200,1060 700,1040 1200,1100 L1200,1460 C700,1380 200,1400 -100,1500Z" fill="#B9805C" ${ST}/>`;
  s += `<path d="M-100,1400 C200,1340 700,1330 1200,1380 L1200,1460 C700,1380 200,1400 -100,1500Z" fill="#96603F"/>`;
  s += `<path d="M-100,1150 C200,1060 700,1040 1200,1100" stroke="#2F6FA3" stroke-width="0"/>`;
  s += `<rect x="380" y="900" width="320" height="660" rx="40" fill="#2B2B2B" ${ST}/><rect x="340" y="1020" width="400" height="400" rx="70" fill="#3A3A3A" ${ST}/>`;
  s += `<rect x="380" y="1060" width="320" height="320" rx="40" fill="#C8E6C9" ${ST}/>`;
  s += `<text x="540" y="1180" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="58" fill="${T}">${hora.split(' ')[0]} ${hora.split(' ')[1] || ''}</text>`;
  s += `<text x="540" y="1300" text-anchor="middle" font-family="Anton, sans-serif" font-size="100" fill="${T}">${hora.split(' ').slice(2).join(' ')}</text>`;
  return <Svg W={1080} H={1920} html={s} />;
};

// ---------------------------------------------------------------- PADARIA (por dentro)
export const PADARIA = {W: 1600, H: 1920};
export const Padaria: React.FC<{roseX: number; roseExpr: string; dinheiro: number}> = ({roseX, roseExpr, dinheiro}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect width="1600" height="1920" fill="#F4EDE1"/>`;
    for (let y = 0; y < 1100; y += 60) for (let x = 0; x < 1600; x += 60) s += `<rect x="${x + 2}" y="${y + 2}" width="56" height="56" fill="${(x / 60 + y / 60) % 2 ? '#FFFFFF' : '#EAF2EE'}"/>`;
    s += `<rect x="80" y="160" width="700" height="420" fill="#C9A46A" ${ST}/>`;
    for (let r = 0; r < 3; r++) { s += `<rect x="80" y="${290 + r * 130}" width="700" height="14" fill="#8A6A40"/>`; for (let i = 0; i < 9; i++) s += `<ellipse cx="${130 + i * 75}" cy="${265 + r * 130}" rx="32" ry="20" fill="#D9A25B" ${ST}/>`; }
    s += `<rect x="900" y="160" width="560" height="300" rx="10" fill="#2B2420" ${ST}/><text x="1180" y="240" text-anchor="middle" font-family="Anton, sans-serif" font-size="56" fill="#F2C14E">PÃO DE OURO</text>`;
    s += `<text x="940" y="320" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="40" fill="#fff">PÃO FRANCÊS ..... R$ 0,90</text><text x="940" y="380" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="40" fill="#fff">SONHO ............ R$ 6,00</text><text x="940" y="440" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="40" fill="#fff">CAFÉ ............. R$ 4,50</text>`;
    // Dona Dunha atrás do balcão (congelada)
    s += poe(pessoa(FIG.dunha), 1100, 1700, 0.62);
    // balcão de vidro
    s += `<rect x="0" y="1180" width="1600" height="420" fill="#C79A64" ${ST}/><rect x="40" y="1120" width="1520" height="300" fill="#BFE0EA" opacity=".85" ${ST}/>`;
    for (let i = 0; i < 12; i++) s += `<ellipse cx="${110 + i * 120}" cy="${1360}" rx="44" ry="26" fill="${i % 3 ? '#D9A25B' : '#F2D7A0'}" ${ST}/>`;
    s += `<rect x="1180" y="1000" width="260" height="130" rx="10" fill="#4A4A4A" ${ST}/><rect x="1210" y="1020" width="200" height="50" fill="#9FE09F"/><text x="1310" y="1058" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="36" fill="${T}">CAIXA</text>`;
    s += `<rect y="1600" width="1600" height="320" fill="#D8CDB8"/>`;
    s += `<rect width="1600" height="1920" fill="#9FB8D0" opacity=".2"/>`;
    return s;
  }, []);
  let din = '';
  if (dinheiro > 0) din = `<g opacity="${dinheiro}"><rect x="1230" y="1090" width="120" height="60" rx="6" fill="#8FD18F" ${ST} transform="rotate(-8 1290 1120)"/><circle cx="1380" cy="1130" r="20" fill="#E8C35A" ${ST}/><circle cx="1410" cy="1124" r="20" fill="#E8C35A" ${ST}/></g>`;
  return <Svg W={1600} H={1920} html={fundo + din + poe(rose({expr: roseExpr}), roseX, 1900, 0.62)} />;
};

// ---------------------------------------------------------------- LOJA DE MÓVEIS (sofá de R$ 8.900)
export const LOJA = {W: 1400, H: 1920};
export const Loja: React.FC<{piscar: boolean}> = ({piscar}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect width="1400" height="1920" fill="#EFE6F7"/><rect y="1300" width="1400" height="620" fill="#C9B79C"/>`;
    for (let x = 0; x < 1400; x += 140) s += `<path d="M${x},1300 L${x - 200},1920" stroke="#B7A487" stroke-width="4"/>`;
    s += `<rect x="200" y="300" width="300" height="400" fill="#F4EDE1" ${ST}/><rect x="230" y="330" width="240" height="340" fill="#7FB98A"/>`;
    s += `<path d="M1000,300 L1000,820 M940,820 L1060,820" ${ST} stroke-width="8"/><path d="M920,300 L1080,300 L1040,420 L960,420Z" fill="#F2C14E" ${ST}/>`;
    s += `<ellipse cx="700" cy="1620" rx="620" ry="120" fill="#D96C4A" opacity=".5"/>`;
    // sofá
    s += `<rect x="160" y="1080" width="1080" height="300" rx="60" fill="#D96C4A" ${ST}/><rect x="120" y="1240" width="1160" height="260" rx="50" fill="#E07F5D" ${ST}/>`;
    s += `<rect x="90" y="1150" width="160" height="380" rx="60" fill="#C25F3F" ${ST}/><rect x="1150" y="1150" width="160" height="380" rx="60" fill="#C25F3F" ${ST}/>`;
    s += `<rect x="180" y="1500" width="30" height="80" fill="#5A3A28"/><rect x="1190" y="1500" width="30" height="80" fill="#5A3A28"/>`;
    s += `<rect width="1400" height="1920" fill="#9FB8D0" opacity=".18"/>`;
    return s;
  }, []);
  const deitada = `<g transform="translate(1200,1080) rotate(90) scale(0.5)">${rose({expr: 'feliz', piscar})}</g>`;
  return <Svg W={1400} H={1920} html={fundo + deitada} />;
};

// ---------------------------------------------------------------- MAPA DO BAIRRO
export const MAPA = {W: 1080, H: 1920};
export const MapaBairro: React.FC<{prog: number}> = ({prog}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect width="1080" height="1920" fill="#EDE3CF"/>`;
    for (let x = -40; x < 1100; x += 260) for (let y = 300; y < 1800; y += 300) s += `<rect x="${x + 50}" y="${y + 50}" width="200" height="220" rx="16" fill="${['#F2C14E', '#7FB98A', '#E89A7A', '#B9A7DB'][(x / 260 + y / 300) & 3]}" opacity=".55" ${ST}/>`;
    s += `<text x="560" y="335" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="34" fill="${T}">R. DAS FLORES</text>`;
    s += `<text x="110" y="1240" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="34" fill="${T}">PADARIA</text><text x="630" y="740" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="34" fill="${T}">EDIFÍCIO CENTRAL</text>`;
    return s;
  }, []);
  const rota = 'M650,700 L650,900 L380,900 L380,1200 L130,1200 L130,1500 L650,1500';
  const comp = 2010;
  const pin = prog > 0.95 ? `<g transform="translate(650,1500)"><path d="M0,0 C-40,-60 -50,-90 -50,-110 C-50,-150 50,-150 50,-110 C50,-90 40,-60 0,0Z" fill="#D96C4A" ${ST}/><circle cx="0" cy="-110" r="20" fill="#fff"/></g>` : '';
  return <Svg W={1080} H={1920} html={fundo + `<path d="${rota}" stroke="#D96C4A" stroke-width="14" fill="none" stroke-dasharray="${comp}" stroke-dashoffset="${comp * (1 - prog)}" stroke-linecap="round"/><path d="${rota}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="14 18" opacity="${prog > 0 ? 0.9 : 0}"/>` + pin} />;
};

// ---------------------------------------------------------------- CELULAR (mensagem pra Rose)
export const Celular: React.FC<{linhas: string[]; mostrar: number[]}> = ({linhas, mostrar}) => {
  let s = `<rect width="1080" height="1920" fill="#1B2436"/>`;
  s += `<rect x="190" y="230" width="700" height="1400" rx="90" fill="#111" ${ST}/><rect x="225" y="270" width="630" height="1320" rx="64" fill="#24324A"/>`;
  s += `<text x="540" y="420" text-anchor="middle" font-family="Anton, sans-serif" font-size="140" fill="#fff">16:47</text><text x="540" y="480" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="600" font-size="40" fill="#BFD3E6">segunda-feira</text>`;
  s += `<rect x="260" y="560" width="560" height="110" rx="24" fill="#fff"/><text x="290" y="606" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="30" fill="#7F93A8">NÚMERO DESCONHECIDO</text><text x="290" y="650" font-family="Anton, sans-serif" font-size="40" fill="${T}">PARA: ROSE</text>`;
  let y = 740;
  linhas.forEach((l, i) => {
    const vis = mostrar[i] || 0;
    if (vis <= 0) return;
    const txt = l.slice(0, Math.ceil(l.length * vis));
    const partes = txt.match(/.{1,22}(\s|$)/g) || [txt];
    const h = 40 + partes.length * 52;
    s += `<rect x="260" y="${y}" width="560" height="${h}" rx="28" fill="${i === linhas.length - 1 ? '#F2C14E' : '#E9EEF5'}"/>`;
    partes.forEach((p, j) => { s += `<text x="290" y="${y + 62 + j * 52}" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="46" fill="${T}">${p.trim()}</text>`; });
    y += h + 24;
  });
  return <Svg W={1080} H={1920} html={s} />;
};
