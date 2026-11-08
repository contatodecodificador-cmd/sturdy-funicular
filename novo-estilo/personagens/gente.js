// Gerador de figurantes da linha "O Tempo Parou" · estilo Praça ao Sol.
// Cada pessoa tem rosto, cabelo, idade, roupa e pose próprios. SVG puro, original.
// Sistema de coordenadas igual ao da Rose: viewBox "0 0 400 1720", cabeça em y≈60–342, pés em y≈1700.
// Uso: pessoa({ ...opções }) devolve o conteúdo SVG (sem <svg>).

const TINTA = '#2B2420';

function escurece(hex, f = 0.78) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const PELES = { clara: '#F1C7A8', media: '#D9A27E', morena: '#B9805C', parda: '#9C6644', negra: '#6B4430', retinta: '#4E3022' };

function cabeloAtras(t, c, st) {
  switch (t) {
    case 'crespo': return [[200, 150, 108], [118, 210, 52], [282, 210, 52]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${st}/>`).join('');
    case 'liso_longo': return `<path d="M120,230 C108,140 150,92 200,92 C252,92 292,140 280,230 L292,470 C250,488 150,488 108,470Z" fill="${c}" ${st}/>`;
    case 'rabo': return `<path d="M250,150 C320,150 330,260 300,340 C290,300 280,230 250,200Z" fill="${c}" ${st}/>`;
    case 'trancas': {
      let s = `<path d="M118,230 C108,140 150,92 200,92 C252,92 292,140 282,230 L290,520 L110,520Z" fill="${c}" ${st}/>`;
      for (let i = 0; i < 9; i++) s += `<path d="M${122 + i * 20},250 L${118 + i * 20},515" stroke="${escurece(c, 1.5)}" stroke-width="3" opacity=".5"/>`;
      return s;
    }
    case 'coque': return `<circle cx="200" cy="70" r="42" fill="${c}" ${st}/>`;
    default: return '';
  }
}

function cabeloFrente(t, c, st) {
  const sombra = escurece(c, 1.35);
  switch (t) {
    case 'careca':
      return `<path d="M140,232 C136,214 140,200 146,196 L146,238Z M260,232 C264,214 260,200 254,196 L254,238Z" fill="${c}"/>
              <ellipse cx="182" cy="140" rx="22" ry="10" fill="#fff" opacity=".25"/>`;
    case 'curto':
      return `<path d="M136,206 C130,120 175,96 205,98 C250,100 272,136 264,206 C258,172 236,152 200,150 C166,150 146,170 136,206Z" fill="${c}" ${st}/>
              <path d="M170,118 C195,108 225,112 245,128" stroke="${sombra}" stroke-width="5" fill="none" opacity=".7"/>`;
    case 'grisalho':
      return `<path d="M136,206 C130,130 160,104 200,104 C240,104 270,130 264,206 C258,180 246,166 236,160 L226,132 C210,126 190,126 174,132 L164,160 C154,166 142,180 136,206Z" fill="${c}" ${st}/>`;
    case 'crespo':
      return `<path d="M134,196 C130,120 170,92 200,92 C230,92 270,120 266,196 C252,164 230,150 200,150 C170,150 148,164 134,196Z" fill="${c}" ${st}/>`;
    case 'liso_longo': case 'trancas':
      return `<path d="M136,230 C130,140 170,98 210,100 C250,104 272,140 264,230 C258,190 250,170 238,158 C210,170 170,168 150,160 C142,180 138,200 136,230Z" fill="${c}" ${st}/>`;
    case 'rabo': case 'coque':
      return `<path d="M136,200 C134,128 172,100 202,100 C236,100 268,130 264,200 C254,166 232,148 200,148 C170,148 146,166 136,200Z" fill="${c}" ${st}/>
              <path d="M160,130 C185,118 220,118 248,138" stroke="${sombra}" stroke-width="4" fill="none" opacity=".7"/>`;
    default: return '';
  }
}

function rosto(o, st) {
  const L = `stroke="${TINTA}" stroke-linecap="round" fill="none"`;
  const pele = o.pele, ps = escurece(pele, 0.82);
  const largura = o.larguraRosto || 1;
  let s = `<g transform="translate(200,0) scale(${largura},1) translate(-200,0)">`;
  // orelhas e rosto
  s += `<ellipse cx="137" cy="246" rx="14" ry="24" fill="${pele}" ${st}/><ellipse cx="263" cy="246" rx="14" ry="24" fill="${pele}" ${st}/>`;
  const queixo = o.queixo === 'quadrado'
    ? 'M138,215 C136,140 170,108 200,108 C230,108 264,140 262,215 L262,282 C258,318 236,340 200,342 C164,340 142,318 138,282Z'
    : o.queixo === 'redondo'
      ? 'M136,215 C134,138 170,106 200,106 C230,106 266,138 264,215 C266,300 240,344 200,346 C160,344 134,300 136,215Z'
      : 'M138,215 C136,140 170,108 200,108 C230,108 264,140 262,215 L260,262 C256,305 232,338 200,342 C168,338 144,305 140,262Z';
  s += `<path d="${queixo}" fill="${pele}" ${st}/>`;
  s += `<path d="M262,215 L260,270 C256,310 232,338 200,342 C224,326 242,300 245,262 L247,215 C247,192 242,174 234,162 C252,172 262,192 262,215Z" fill="${ps}"/>`;
  // idade
  if (o.idade >= 50) s += `<path d="M168,176 C185,170 215,170 232,176 M172,188 C188,183 212,183 228,188" ${L} stroke-width="2" opacity=".45"/>
    <path d="M170,280 C166,292 170,304 176,310 M230,280 C234,292 230,304 224,310" ${L} stroke-width="2.4" opacity=".45"/>
    <path d="M162,240 C170,246 184,246 192,240 M208,240 C216,246 230,246 238,240" ${L} stroke-width="2" opacity=".4"/>`;
  // barba
  if (o.barba === 'cheia') s += `<path d="M140,250 C142,310 170,350 200,352 C230,350 258,310 260,250 C254,280 240,300 226,300 C214,292 186,292 174,300 C160,300 146,280 140,250Z" fill="${o.corCabelo}" opacity=".95"/>`;
  if (o.barba === 'rala') s += `<path d="M146,262 C150,310 174,340 200,342 C226,340 250,310 254,262 C246,296 230,318 200,320 C170,318 154,296 146,262Z" fill="${o.corCabelo}" opacity=".35"/>`;
  if (o.barba === 'bigode' || o.barba === 'cavanhaque') s += `<path d="M174,290 C186,282 196,284 200,288 C204,284 214,282 226,290 C214,296 186,296 174,290Z" fill="${o.corCabelo}"/>`;
  if (o.barba === 'cavanhaque') s += `<path d="M186,322 C190,340 210,340 214,322 C206,328 194,328 186,322Z" fill="${o.corCabelo}"/>`;
  // bochechas
  s += `<ellipse cx="166" cy="276" rx="15" ry="9" fill="#E07A6F" opacity=".18"/><ellipse cx="234" cy="276" rx="15" ry="9" fill="#E07A6F" opacity=".18"/>`;
  // sobrancelhas
  const sg = o.sobrancelha || 6, cs = o.idade >= 60 ? '#9A948C' : o.corCabelo;
  const ergue = o.expr === 'surpresa' ? -8 : 0, franze = o.expr === 'bravo' ? 8 : 0;
  s += `<path d="M158,${203 + ergue} C170,${195 + ergue} 185,${195 + ergue + franze} 193,${200 + ergue + franze}" stroke="${cs}" stroke-width="${sg}" fill="none" stroke-linecap="round"/>
        <path d="M207,${200 + ergue + franze} C215,${195 + ergue + franze} 230,${195 + ergue} 242,${203 + ergue}" stroke="${cs}" stroke-width="${sg}" fill="none" stroke-linecap="round"/>`;
  // olhos
  const olho = (cx) => {
    if (o.expr === 'rindo') return `<path d="M${cx - 14},230 C${cx - 8},222 ${cx + 8},222 ${cx + 14},230" ${L} stroke-width="3.6"/>`;
    if (o.expr === 'dormindo') return `<path d="M${cx - 14},228 C${cx - 8},234 ${cx + 8},234 ${cx + 14},228" ${L} stroke-width="3.6"/>`;
    const baixo = o.olhar === 'baixo' ? 4 : 0;
    return `<path d="M${cx - 16},229 C${cx - 8},218 ${cx + 8},218 ${cx + 16},229 C${cx + 8},236 ${cx - 8},236 ${cx - 16},229Z" fill="#fff"/>
      <circle cx="${cx}" cy="${228 + baixo}" r="7" fill="${o.corOlho || '#4A2C1A'}"/><circle cx="${cx}" cy="${228 + baixo}" r="3.2" fill="#111"/>
      <circle cx="${cx + 2.3}" cy="${225.6 + baixo}" r="1.8" fill="#fff"/>
      <path d="M${cx - 18},229 C${cx - 8},${216 + baixo / 2} ${cx + 8},${216 + baixo / 2} ${cx + 18},228" ${L} stroke-width="3.4"/>`;
  };
  s += olho(178) + olho(222);
  // nariz
  const narizes = [
    'M201,238 C199,256 192,266 194,274 C198,279 205,279 209,275',
    'M200,238 C199,258 190,266 190,274 C194,282 206,282 210,274 C210,268 204,262 203,254',
    'M196,240 C194,258 184,266 186,276 C192,284 208,284 214,276 C216,266 206,258 204,240',
  ];
  s += `<path d="${narizes[o.nariz || 0]}" ${L} stroke-width="2.6" opacity=".75"/>`;
  // boca
  const lab = escurece(pele, 0.72);
  if (o.expr === 'rindo' || o.boca === 'aberta') s += `<path d="M178,296 C192,302 208,302 222,296 C218,324 182,324 178,296Z" fill="#5E2A22"/><path d="M180,297 C192,302 208,302 220,297 L218,303 C206,306 194,306 182,303Z" fill="#fff"/>`;
  else if (o.expr === 'surpresa') s += `<ellipse cx="200" cy="304" rx="11" ry="14" fill="#5E2A22"/>`;
  else if (o.expr === 'dormindo') s += `<path d="M190,304 C196,308 204,308 210,304" ${L} stroke-width="3"/>`;
  else if (o.expr === 'bravo' || o.boca === 'reta') s += `<path d="M182,304 C192,300 208,300 218,304" ${L} stroke-width="3.6"/>`;
  else s += `<path d="M180,298 C192,307 208,307 220,298 C210,314 190,314 180,298Z" fill="${lab}"/>`;
  s += `</g>`;
  return s;
}

function roupaTronco(o, st) {
  const c = o.roupa || '#5FA36A', cs = escurece(c, 0.8), t = o.tipoRoupa || 'camiseta';
  let s = `<path d="M104,454 C116,432 136,420 152,414 L200,440 L248,414 C264,420 284,432 296,454 L302,${t === 'vestido' ? 1180 : 920} L98,${t === 'vestido' ? 1180 : 920}Z" fill="${c}" ${st}/>`;
  if (t === 'vestido') s = `<path d="M118,454 C130,432 146,420 160,414 L200,450 L240,414 C254,420 270,432 282,454 L292,760 L338,1180 L62,1180 L108,760Z" fill="${c}" ${st}/>`;
  s += `<path d="M262,440 C282,470 292,700 298,920 L256,920 C262,760 262,560 242,470Z" fill="${cs}" opacity=".9"/>`;
  if (t === 'social') s += `<path d="M152,414 L184,470 L200,446Z M248,414 L216,470 L200,446Z" fill="#fff" ${st}/><path d="M200,446 L200,920" stroke="${cs}" stroke-width="3"/>` +
    [520, 600, 680, 760].map(y => `<circle cx="200" cy="${y}" r="5" fill="${cs}"/>`).join('');
  if (t === 'jaqueta') s += `<path d="M200,440 L200,920" stroke="${TINTA}" stroke-width="4"/><path d="M152,414 L176,500 L200,440 L224,500 L248,414" fill="${escurece(c, 0.65)}" ${st}/>`;
  if (t === 'camiseta' && o.estampa) s += `<circle cx="200" cy="600" r="54" fill="${o.estampa}" opacity=".9"/>`;
  if (t === 'listrada') for (let y = 470; y < 920; y += 50) s += `<rect x="100" y="${y}" width="200" height="22" fill="${o.roupa2 || '#fff'}" opacity=".85"/>`;
  if (t === 'regata') s = `<path d="M136,440 C150,430 166,424 176,420 L200,470 L224,420 C234,424 250,430 264,440 L296,920 L104,920Z" fill="${c}" ${st}/>`;
  return s;
}

function bracos(o, st) {
  const pele = o.pele, manga = (o.tipoRoupa === 'regata') ? null : (o.roupa || '#5FA36A');
  const comprida = ['social', 'jaqueta'].includes(o.tipoRoupa);
  const cs = escurece(pele, 0.82);
  const braco = (pts, mao) => {
    let s = `<path d="${pts}" stroke="${TINTA}" stroke-width="60" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="${pts}" stroke="${comprida ? manga : pele}" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    if (manga && !comprida) s += `<path d="${pts}" stroke="${TINTA}" stroke-width="68" stroke-linecap="butt" stroke-linejoin="round" fill="none" style="stroke-dasharray:124 4000"/>
      <path d="${pts}" stroke="${manga}" stroke-width="62" stroke-linecap="butt" stroke-linejoin="round" fill="none" style="stroke-dasharray:120 4000"/>`;
    s += `<circle cx="${mao[0]}" cy="${mao[1]}" r="28" fill="${pele}" ${st}/>`;
    return s;
  };
  const p = o.pose || 'parado';
  let esq, dir;
  if (p === 'andando') { esq = ['M118,470 L96,660 L150,800', [156, 812]]; dir = ['M282,470 L316,660 L330,840', [330, 864]]; }
  else if (p === 'cafe') { esq = ['M118,470 L96,680 L92,850', [92, 872]]; dir = ['M282,470 L320,620 L250,380', [244, 360]]; }
  else if (p === 'celular') { esq = ['M118,470 L100,640 L176,700', [184, 704]]; dir = ['M282,470 L300,640 L226,700', [218, 704]]; }
  else if (p === 'entregando') { esq = ['M118,470 L96,680 L92,850', [92, 872]]; dir = ['M282,470 L380,600 L470,610', [490, 612]]; }
  else if (p === 'acenando') { esq = ['M118,470 L96,680 L92,850', [92, 872]]; dir = ['M282,470 L340,330 L330,180', [330, 160]]; }
  else { esq = ['M118,470 L96,680 L92,850', [92, 872]]; dir = ['M282,470 L304,680 L308,850', [308, 872]]; }
  let s = braco(esq[0], esq[1]) + braco(dir[0], dir[1]);
  if (p === 'cafe') s += `<path d="M222,330 L268,330 L262,392 L228,392Z" fill="#fff" ${st}/><rect x="222" y="322" width="46" height="12" rx="4" fill="#7A4A2E"/>` +
    (o.cafeSuspenso === false ? '' : `<ellipse cx="236" cy="296" rx="10" ry="14" fill="#7A4A2E" opacity=".85"/><circle cx="252" cy="280" r="5" fill="#7A4A2E" opacity=".8"/><circle cx="224" cy="276" r="4" fill="#7A4A2E" opacity=".7"/>`);
  if (p === 'celular') s += `<rect x="176" y="640" width="48" height="84" rx="8" fill="#22262E" ${st}/><rect x="182" y="648" width="36" height="66" rx="4" fill="#6FB7E8"/>`;
  return s;
}

function pernas(o, st) {
  const c = o.calca || '#2F4A6B', cs = escurece(c, 0.8), t = o.tipoCalca || 'calca';
  const sap = o.sapato || '#F7F3EC';
  const andando = o.pose === 'andando';
  let s = '';
  if (o.tipoRoupa === 'vestido') {
    s += `<path d="M130,1170 L136,1630 L184,1630 L190,1170Z M210,1170 L216,1630 L264,1630 L270,1170Z" fill="${o.pele}" ${st}/>`;
  } else if (t === 'bermuda' || t === 'saia') {
    s += t === 'saia'
      ? `<path d="M100,900 L300,900 L330,1180 L70,1180Z" fill="${c}" ${st}/>`
      : `<path d="M100,900 L300,900 L304,1200 L212,1200 L204,1000 L196,1000 L188,1200 L96,1200Z" fill="${c}" ${st}/>`;
    s += `<path d="M120,1180 L126,1640 L180,1640 L188,1180Z" fill="${o.pele}" ${st}/>`;
    s += andando ? `<path d="M212,1190 L230,1420 L262,1580 L300,1572 L272,1410 L284,1190Z" fill="${o.pele}" ${st}/>`
      : `<path d="M212,1180 L220,1640 L274,1640 L280,1180Z" fill="${o.pele}" ${st}/>`;
  } else {
    s += `<path d="M100,900 L300,900 L304,960 L292,${andando ? 1300 : 1640} L216,${andando ? 1300 : 1640} L204,1000 L196,1000 L184,1640 L112,1640 L96,960Z" fill="${c}" ${st}/>`;
    if (andando) s += `<path d="M216,1290 L240,1570 L306,1556 L292,1290Z" fill="${c}" ${st}/>`;
    s += `<path d="M250,1000 L262,${andando ? 1300 : 1640} L290,${andando ? 1300 : 1640} L300,980Z" fill="${cs}"/>`;
  }
  // sapatos
  s += `<path d="M108,1636 L188,1636 L192,1676 C192,1692 182,1698 170,1698 L84,1698 C70,1698 64,1686 74,1674Z" fill="${sap}" ${st}/>`;
  s += andando
    ? `<path d="M236,1556 L308,1546 L336,1578 C344,1592 336,1604 322,1602 L246,1606 C234,1606 228,1596 232,1580Z" fill="${sap}" ${st}/>`
    : `<path d="M212,1636 L292,1636 L326,1674 C336,1686 330,1698 316,1698 L230,1698 C218,1698 208,1692 208,1676Z" fill="${sap}" ${st}/>`;
  return s;
}

function acessorio(o, st) {
  switch (o.acessorio) {
    case 'mochila': return `<path d="M128,440 L150,620 M272,440 L250,620" stroke="${escurece(o.corAcessorio || '#333', .8)}" stroke-width="12"/>`;
    case 'bolsa': return `<path d="M150,420 L300,800" stroke="#5A3A28" stroke-width="7"/><rect x="270" y="780" width="80" height="70" rx="12" fill="${o.corAcessorio || '#8B5A3C'}" ${st}/>`;
    case 'sacola': return `<path d="M76,860 C76,830 110,830 110,860" stroke="#E9E4DA" stroke-width="5" fill="none"/><path d="M60,860 L126,860 L120,960 L66,960Z" fill="#F4EFE6" ${st}/>`;
    default: return '';
  }
}

function pessoa(o = {}) {
  o = Object.assign({ pele: PELES.media, corCabelo: '#2A1A14', cabelo: 'curto', idade: 30, expr: 'neutro', pose: 'parado' }, o);
  const st = `stroke="${TINTA}" stroke-width="3" stroke-linejoin="round"`;
  const largCorpo = (o.largCorpo || 1) * 1.12;
  let s = cabeloAtras(o.cabelo, o.corCabelo, st);
  s += `<g transform="translate(200,0) scale(${largCorpo},1) translate(-200,0)">`;
  s += pernas(o, st) + roupaTronco(o, st) + acessorio(o, st);
  if (o.avental) s += `<path d="M140,500 L260,500 L280,1080 L120,1080Z" fill="${o.avental}" ${st}/><path d="M150,500 C150,450 250,450 250,500" stroke="${escurece(o.avental, .7)}" stroke-width="6" fill="none"/><rect x="170" y="700" width="60" height="50" rx="6" fill="${escurece(o.avental, .85)}" ${st}/>`;
  s += `</g>`;
  // pescoço
  s += `<path d="M172,318 L172,420 L200,446 L228,420 L228,318Z" fill="${o.pele}" ${st}/><path d="M172,330 C185,372 215,372 228,330 L228,320 L172,320Z" fill="${escurece(o.pele, .8)}"/>`;
  s += `<g transform="translate(200,0) scale(${largCorpo},1) translate(-200,0)">${bracos(o, st)}</g>`;
  s += rosto(o, st);
  s += cabeloFrente(o.cabelo, o.corCabelo, st);
  if (o.bone) s += `<path d="M134,190 C134,110 266,110 266,190Z" fill="${o.bone}" ${st}/><path d="M134,186 L282,186 C300,190 300,202 282,204 L134,200Z" fill="${escurece(o.bone, .8)}" ${st}/>`;
  if (o.lupa) s += `<circle cx="222" cy="228" r="22" fill="#CFE6F2" fill-opacity=".5" stroke="#2B2B2B" stroke-width="8"/><path d="M244,222 L268,214" stroke="#2B2B2B" stroke-width="6"/>`;
  if (o.oculos) s += `<rect x="154" y="212" width="44" height="32" rx="10" fill="#fff" fill-opacity=".15" stroke="${o.oculos}" stroke-width="5"/><rect x="202" y="212" width="44" height="32" rx="10" fill="#fff" fill-opacity=".15" stroke="${o.oculos}" stroke-width="5"/><path d="M198,226 L202,226" stroke="${o.oculos}" stroke-width="5"/>`;
  return s;
}

// Elenco fixo de figurantes (reaparecem pela série; cada um tem uma marca).
const FIGURANTES = {
  seuJoao:   { nome: 'Seu João, 68', marca: 'aposentado, bigode branco, camisa social', pele: PELES.parda, cabelo: 'grisalho', corCabelo: '#CFCAC2', idade: 68, barba: 'bigode', tipoRoupa: 'social', roupa: '#E8D9B5', calca: '#5B5348', sapato: '#3A2A20', oculos: '#7A5A3A', nariz: 2, expr: 'neutro', pose: 'parado', queixo: 'quadrado' },
  daniel:    { nome: 'Daniel, 26', marca: 'motoboy, cabelo raspado, jaqueta laranja', pele: PELES.negra, cabelo: 'curto', corCabelo: '#1A1210', idade: 26, barba: 'rala', tipoRoupa: 'jaqueta', roupa: '#D96C4A', calca: '#2F3440', nariz: 2, expr: 'rindo', pose: 'celular', largCorpo: 1.05 },
  dunha:     { nome: 'Dona Dunha, 61', marca: 'vendedora de bolo, coque, vestido florido', pele: PELES.morena, cabelo: 'coque', corCabelo: '#B9B2A8', idade: 61, tipoRoupa: 'vestido', roupa: '#E89A7A', nariz: 1, expr: 'surpresa', pose: 'parado', acessorio: 'sacola', queixo: 'redondo', largCorpo: 1.15 },
  kaique:    { nome: 'Kaique, 19', marca: 'estudante, boné, mochila', pele: PELES.media, cabelo: 'curto', corCabelo: '#3A2618', idade: 19, tipoRoupa: 'camiseta', roupa: '#2F6FA3', estampa: '#F2C14E', calca: '#3E4A5C', bone: '#5FA36A', acessorio: 'mochila', corAcessorio: '#2B2B2B', expr: 'neutro', pose: 'andando' },
  priscila:  { nome: 'Priscila, 38', marca: 'bancária, cabelo liso longo, óculos', pele: PELES.clara, cabelo: 'liso_longo', corCabelo: '#6B4A2E', idade: 38, tipoRoupa: 'social', roupa: '#B9A7DB', calca: '#2B2F3A', oculos: '#2B2420', acessorio: 'bolsa', corAcessorio: '#8B5A3C', expr: 'neutro', pose: 'cafe', corOlho: '#3F6B4A' },
  marcos:    { nome: 'Marcos, 44', marca: 'pedreiro, careca, barba cheia, regata', pele: PELES.retinta, cabelo: 'careca', corCabelo: '#1A1210', idade: 44, barba: 'cheia', tipoRoupa: 'regata', roupa: '#F4EDE1', calca: '#5A6B7A', tipoCalca: 'bermuda', nariz: 2, expr: 'bravo', pose: 'parado', largCorpo: 1.2, queixo: 'quadrado' },
  tais:      { nome: 'Taís, 29', marca: 'manicure, tranças longas, regata listrada', pele: PELES.negra, cabelo: 'trancas', corCabelo: '#24160F', idade: 29, tipoRoupa: 'listrada', roupa: '#D96C4A', roupa2: '#FFF8EC', calca: '#24364F', tipoCalca: 'saia', acessorio: 'bolsa', corAcessorio: '#F2C14E', expr: 'rindo', pose: 'acenando', nariz: 1 },
  jorge:     { nome: 'Seu Jorge, 55', marca: 'motorista do ônibus, cavanhaque, camisa da empresa', pele: PELES.media, cabelo: 'grisalho', corCabelo: '#8E877E', idade: 55, barba: 'cavanhaque', tipoRoupa: 'social', roupa: '#9ED8EE', calca: '#2B2F3A', sapato: '#2B2420', expr: 'neutro', pose: 'parado', largCorpo: 1.1 },
};

if (typeof module !== 'undefined') module.exports = { pessoa, FIGURANTES, PELES, escurece };
