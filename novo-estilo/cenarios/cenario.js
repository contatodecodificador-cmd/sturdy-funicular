// Peças de cenário da linha "O Tempo Parou" · estilo Praça ao Sol. SVG puro, original.
// Todas as funções devolvem conteúdo SVG já posicionado (x, y = canto de cima à esquerda, salvo indicado).

const T = '#2B2420';
const ST = `stroke="${T}" stroke-width="3" stroke-linejoin="round"`;

function esc(hex, f = 0.8) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return '#' + ((1 << 24) + (c((n >> 16) & 255) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1);
}

// Cabecinha de passageiro visto pela janela (rosto simples, mas com cabelo e traço próprio)
function cabecinha(x, y, pele, cabelo, tipo, k = 1) {
  let s = `<g transform="translate(${x},${y}) scale(${k})">`;
  s += `<rect x="-26" y="34" width="52" height="40" rx="16" fill="${tipo === 'f' ? '#D96C4A' : '#5A6B7A'}" ${ST}/>`;
  if (tipo === 'f') s += `<path d="M-24,4 C-26,-26 26,-26 24,4 L26,40 L-26,40Z" fill="${cabelo}" ${ST}/>`;
  s += `<ellipse cx="0" cy="6" rx="19" ry="23" fill="${pele}" ${ST}/>`;
  if (tipo !== 'careca') s += `<path d="M-20,0 C-20,-24 20,-24 20,0 C12,-10 -12,-10 -20,0Z" fill="${cabelo}" ${ST}/>`;
  s += `<circle cx="-7" cy="6" r="2.6" fill="${T}"/><circle cx="7" cy="6" r="2.6" fill="${T}"/><path d="M-5,18 C-2,20 2,20 5,18" stroke="${T}" stroke-width="2" fill="none"/>`;
  return s + '</g>';
}

// Ônibus urbano visto de lado (frente para a direita). Tamanho base 1000 x 380.
function onibus(x, y, k = 1, linha = '8012  VILA ESPERANÇA') {
  let s = `<g transform="translate(${x},${y}) scale(${k})">`;
  s += `<ellipse cx="500" cy="384" rx="520" ry="22" fill="#000" opacity=".18"/>`;
  // caixas de roda
  s += `<path d="M120,330 C120,262 260,262 260,330Z M720,330 C720,262 860,262 860,330Z" fill="#3A3A3A"/>`;
  // carroceria
  s += `<path d="M20,10 L940,10 C975,10 996,40 998,90 L1000,320 C1000,336 990,346 974,346 L860,346 C860,276 720,276 720,346 L260,346 C260,276 120,276 120,346 L36,346 C22,346 10,336 10,322 L10,24 C10,16 14,10 20,10Z" fill="#F4F1EA" ${ST}/>`;
  s += `<path d="M10,232 L1000,232 L1000,262 L10,262Z" fill="#2F6FA3"/><path d="M10,264 L1000,264 L1000,276 L10,276Z" fill="#F2C14E"/>`;
  s += `<path d="M20,10 L940,10 C962,10 978,20 988,34 L14,34 L14,20Z" fill="#DCD6CB"/>`;
  // janelas com passageiros congelados
  const peles = ['#F1C7A8', '#9C6644', '#6B4430', '#D9A27E', '#B9805C'], cabelos = ['#2A1A14', '#6B4A2E', '#1A1210', '#B9B2A8', '#3A2618'];
  const jx = [40, 168, 296, 528, 656];
  jx.forEach((wx, i) => {
    s += `<rect x="${wx}" y="44" width="116" height="160" rx="10" fill="#9FC4D6" ${ST}/>`;
    if (i !== 2) s += cabecinha(wx + 58, 118, peles[i], cabelos[i], i % 2 ? 'f' : (i === 3 ? 'careca' : 'm'), 1.1);
    s += `<path d="M${wx + 10},${54} L${wx + 46},54 L${wx + 10},120Z" fill="#fff" opacity=".45"/>`;
    s += `<rect x="${wx}" y="44" width="116" height="160" rx="10" fill="none" ${ST}/>`;
  });
  // portas (meio e frente)
  [[420, 100], [786, 92]].forEach(([dx, w]) => {
    s += `<rect x="${dx}" y="44" width="${w}" height="296" rx="6" fill="#7FA9BE" ${ST}/><path d="M${dx + w / 2},44 L${dx + w / 2},340" ${ST}/>`;
    s += `<path d="M${dx + 8},${60} L${dx + 26},60 L${dx + 8},150Z" fill="#fff" opacity=".4"/><rect x="${dx + w / 2 - 14}" y="180" width="6" height="60" rx="3" fill="#C9CDD2"/><rect x="${dx + w / 2 + 8}" y="180" width="6" height="60" rx="3" fill="#C9CDD2"/>`;
  });
  // para-brisa, letreiro de linha, retrovisor, farol
  s += `<path d="M890,40 L960,40 C985,46 994,70 995,110 L996,220 L890,220Z" fill="#7FA9BE" ${ST}/><path d="M900,52 L930,52 L900,140Z" fill="#fff" opacity=".4"/>`;
  s += `<rect x="560" y="14" width="330" height="26" rx="4" fill="#1B1B1B"/><text x="725" y="34" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="22" fill="#FFA62B">${linha}</text>`;
  s += `<path d="M996,70 C1030,70 1036,96 1030,130 L1018,130 C1022,100 1016,86 996,86Z" fill="${T}"/><rect x="1014" y="128" width="22" height="46" rx="6" fill="#2B2B2B"/>`;
  s += `<rect x="960" y="290" width="40" height="26" rx="8" fill="#FFF2B3" ${ST}/><rect x="10" y="300" width="20" height="24" rx="5" fill="#D9483B"/>`;
  s += `<text x="80" y="300" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="26" fill="#2F6FA3">1047</text>`;
  // rodas
  [190, 790].forEach(cx => {
    s += `<circle cx="${cx}" cy="340" r="56" fill="#1E1E1E"/><circle cx="${cx}" cy="340" r="32" fill="#A8ADB3" ${ST}/><circle cx="${cx}" cy="340" r="10" fill="#5B6168"/>`;
    for (let a = 0; a < 6; a++) { const r = a * Math.PI / 3; s += `<circle cx="${cx + Math.cos(r) * 20}" cy="${340 + Math.sin(r) * 20}" r="3.5" fill="#5B6168"/>`; }
  });
  return s + '</g>';
}

// Pombo voando (asas pra cima), centro em (x, y). Tamanho ~240.
function pomboVoando(x, y, k = 1, rot = -8) {
  const cinza = '#8E97A3', claro = '#B4BCC6', escuro = '#5D6672';
  let s = `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})">`;
  const asa = (lado) => `<g transform="scale(${lado},1)"><path d="M10,-8 C30,-60 70,-110 120,-126 C112,-110 118,-100 130,-96 C118,-86 124,-76 134,-70 C120,-60 124,-50 132,-44 C110,-36 70,-20 30,4Z" fill="${claro}" ${ST}/>
    <path d="M40,-38 C62,-56 84,-66 104,-70 M30,-22 C56,-36 80,-44 98,-46" stroke="${escuro}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  s += asa(-1) + asa(1);
  s += `<path d="M-30,16 L-78,40 L-70,52 L-26,30Z" fill="${escuro}" ${ST}/>`; // cauda
  s += `<ellipse cx="0" cy="10" rx="46" ry="26" fill="${cinza}" ${ST}/>`;
  s += `<path d="M24,-2 C40,-14 54,-12 60,0 C52,8 40,10 28,10Z" fill="#6E8C7E"/><path d="M28,4 C40,10 50,10 58,4" stroke="#8C6E9E" stroke-width="5" fill="none"/>`;
  s += `<circle cx="62" cy="-8" r="16" fill="${cinza}" ${ST}/><circle cx="67" cy="-11" r="3.6" fill="#E8792B"/><circle cx="67" cy="-11" r="1.6" fill="#111"/>`;
  s += `<path d="M76,-6 L90,-2 L76,0Z" fill="#3A3A3A"/><path d="M-6,34 L-10,46 M6,34 L4,46" stroke="#D9776B" stroke-width="4"/>`;
  return s + '</g>';
}

// Pombo no chão, ciscando
function pomboChao(x, y, k = 1) {
  let s = `<g transform="translate(${x},${y}) scale(${k})">`;
  s += `<ellipse cx="0" cy="50" rx="44" ry="8" fill="#000" opacity=".15"/>`;
  s += `<path d="M-50,0 L-80,-4 L-74,10 L-46,14Z" fill="#5D6672" ${ST}/>`;
  s += `<ellipse cx="-6" cy="8" rx="46" ry="30" fill="#8E97A3" ${ST}/><path d="M-30,0 C-10,-8 14,-6 24,6 M-28,14 C-8,8 12,10 22,18" stroke="#5D6672" stroke-width="5" fill="none"/>`;
  s += `<path d="M24,-10 C36,-4 44,10 40,22 L30,18Z" fill="#6E8C7E"/><circle cx="40" cy="22" r="14" fill="#8E97A3" ${ST}/><circle cx="44" cy="20" r="3" fill="#E8792B"/><path d="M50,28 L60,36 L48,32Z" fill="#3A3A3A"/>`;
  s += `<path d="M-12,36 L-14,48 L-20,50 M4,36 L4,48 L10,50" stroke="#D9776B" stroke-width="4" fill="none"/>`;
  return s + '</g>';
}

// Sobrado com loja no térreo. (x,y) = topo; w x h.
function sobrado(x, y, w, h, o = {}) {
  const cor = o.cor || '#F2C14E', cs = esc(cor, .85);
  const terreo = h * 0.44, sup = h - terreo;
  let s = `<g>`;
  // fachada + platibanda com friso
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cor}" ${ST}/>`;
  s += `<rect x="${x - 8}" y="${y - 30}" width="${w + 16}" height="40" fill="${cs}" ${ST}/><rect x="${x - 12}" y="${y + 6}" width="${w + 24}" height="12" fill="${esc(cor, .7)}" ${ST}/>`;
  // manchas de tempo
  s += `<path d="M${x + 10},${y + sup - 40} q30,-20 60,0 q20,20 50,0 L${x + 120},${y + sup} L${x + 10},${y + sup}Z" fill="${cs}" opacity=".35"/>`;
  // janelas de cima com veneziana; uma com sacada
  const nj = Math.max(2, Math.floor(w / 140)), gap = w / nj;
  for (let i = 0; i < nj; i++) {
    const jx = x + gap * i + gap / 2 - 38, jy = y + 50;
    s += `<rect x="${jx - 8}" y="${jy - 8}" width="92" height="${sup - 110}" fill="#F4EDE1" ${ST}/>`;
    s += `<rect x="${jx}" y="${jy}" width="76" height="${sup - 126}" fill="${o.veneziana || '#5FA36A'}" ${ST}/>`;
    for (let ly = jy + 12; ly < jy + sup - 130; ly += 14) s += `<path d="M${jx + 4},${ly} L${jx + 72},${ly}" stroke="${esc(o.veneziana || '#5FA36A', .7)}" stroke-width="3"/>`;
    s += `<path d="M${jx + 38},${jy} L${jx + 38},${jy + sup - 126}" ${ST}/>`;
    s += `<rect x="${jx - 14}" y="${jy + sup - 124}" width="104" height="12" fill="#E9E1D2" ${ST}/>`;
    if (o.sacada === i) {
      const by = jy + sup - 112;
      s += `<rect x="${jx - 24}" y="${by}" width="124" height="10" fill="#4A4A4A"/>`;
      for (let bx = jx - 20; bx < jx + 100; bx += 12) s += `<path d="M${bx},${by - 50} L${bx},${by}" stroke="#4A4A4A" stroke-width="3"/>`;
      s += `<path d="M${jx - 24},${by - 50} L${jx + 100},${by - 50}" stroke="#4A4A4A" stroke-width="5"/>`;
      s += `<path d="M${jx + 60},${by - 50} L${jx + 66},${by - 70} L${jx + 86},${by - 70} L${jx + 92},${by - 50}Z" fill="#C0623C" ${ST}/><circle cx="${jx + 70}" cy="${by - 82}" r="14" fill="#5FA36A"/><circle cx="${jx + 84}" cy="${by - 88}" r="12" fill="#4E8E5A"/>`;
    }
    if (o.arCond === i) s += `<rect x="${jx + 96}" y="${jy + 20}" width="50" height="40" rx="4" fill="#EDEDED" ${ST}/><path d="M${jx + 102},${jy + 30} L${jx + 140},${jy + 30} M${jx + 102},${jy + 40} L${jx + 140},${jy + 40}" stroke="#AAA" stroke-width="3"/>`;
  }
  // térreo: letreiro, toldo, vitrine/porta de enrolar
  const ty = y + sup;
  s += `<rect x="${x}" y="${ty}" width="${w}" height="${terreo}" fill="${esc(cor, .92)}" ${ST}/>`;
  if (o.loja) {
    s += `<rect x="${x + 16}" y="${ty + 10}" width="${w - 32}" height="54" rx="6" fill="${o.corPlaca || '#FFF8EC'}" ${ST}/>`;
    s += `<text x="${x + w / 2}" y="${ty + 50}" text-anchor="middle" font-family="Anton, sans-serif" font-size="34" fill="${o.corLetra || T}">${o.loja}</text>`;
    // toldo listrado
    const tc = o.toldo || ['#D96C4A', '#FFF8EC'];
    const tw = w - 20, nl = 8;
    for (let i = 0; i < nl; i++) s += `<path d="M${x + 10 + i * tw / nl},${ty + 72} L${x + 10 + (i + 1) * tw / nl},${ty + 72} L${x + 10 + (i + 1) * tw / nl + 6},${ty + 124} L${x + 10 + i * tw / nl + 6},${ty + 124}Z" fill="${tc[i % 2]}"/>`;
    s += `<path d="M${x + 10},${ty + 72} L${x + w - 10},${ty + 72} L${x + w - 4},${ty + 124} L${x + 16},${ty + 124}Z" fill="none" ${ST}/>`;
    for (let i = 0; i < nl; i++) s += `<path d="M${x + 16 + i * tw / nl},${ty + 124} q${tw / nl / 2},18 ${tw / nl},0" fill="${tc[i % 2]}" ${ST}/>`;
  }
  const vy = ty + 140, vh = terreo - 150;
  if (o.porta === 'enrolar') {
    s += `<rect x="${x + 30}" y="${vy}" width="${w - 60}" height="${vh}" fill="#3A3A3A" ${ST}/><rect x="${x + 30}" y="${vy}" width="${w - 60}" height="${vh * .45}" fill="#B9BEC4" ${ST}/>`;
    for (let ly = vy + 10; ly < vy + vh * .45; ly += 12) s += `<path d="M${x + 32},${ly} L${x + w - 32},${ly}" stroke="#8D9399" stroke-width="2"/>`;
  } else {
    s += `<rect x="${x + 26}" y="${vy}" width="${w - 52}" height="${vh}" fill="#A9CADB" ${ST}/>`;
    s += `<path d="M${x + 40},${vy + 10} L${x + 90},${vy + 10} L${x + 40},${vy + 90}Z" fill="#fff" opacity=".45"/>`;
    if (o.vitrine === 'paes') for (let i = 0; i < 5; i++) s += `<ellipse cx="${x + 70 + i * (w - 140) / 4}" cy="${vy + vh - 30}" rx="26" ry="14" fill="#D9A25B" ${ST}/>`;
    if (o.vitrine === 'salao') s += `<circle cx="${x + w / 2}" cy="${vy + 60}" r="34" fill="#F4EDE1" ${ST}/><path d="M${x + w / 2 - 20},${vy + 60} L${x + w / 2 + 20},${vy + 60}" ${ST}/>`;
    s += `<rect x="${x + 26}" y="${vy}" width="${w - 52}" height="${vh}" fill="none" ${ST}/><path d="M${x + w / 2},${vy} L${x + w / 2},${vy + vh}" ${ST}/>`;
  }
  // relógio de luz e número
  s += `<rect x="${x + w - 26}" y="${ty + 150}" width="20" height="30" fill="#D8D2C6" ${ST}/>`;
  if (o.numero) s += `<rect x="${x + 6}" y="${ty + 150}" width="34" height="22" rx="3" fill="#2F6FA3"/><text x="${x + 23}" y="${ty + 167}" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="17" fill="#fff">${o.numero}</text>`;
  return s + '</g>';
}

// Poste de concreto com transformador. Base em (x, yBase), altura h.
function poste(x, yBase, h) {
  const y = yBase - h;
  let s = `<rect x="${x - 12}" y="${y}" width="24" height="${h}" fill="#BDB6A9" ${ST}/>`;
  s += `<rect x="${x - 90}" y="${y + 40}" width="180" height="14" fill="#8A847A" ${ST}/>`;
  s += `<rect x="${x + 14}" y="${y + 80}" width="44" height="70" rx="8" fill="#7D8A93" ${ST}/>`;
  s += `<path d="M${x - 40},${y + 140} q60,30 120,-6" stroke="#4A4A4A" stroke-width="4" fill="none"/>`;
  s += `<path d="M${x},${y} L${x + 70},${y - 20} L${x + 90},${y - 6}" stroke="#6D6D6D" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="${x + 76}" y="${y - 10}" width="34" height="14" rx="6" fill="#F4EDE1" ${ST}/>`;
  return s;
}

// Fios entre postes (catenárias)
function fios(x1, y1, x2, y2, n = 3) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<path d="M${x1 - 80 + i * 70},${y1 + 46} Q${(x1 + x2) / 2},${y1 + 120 + i * 18} ${x2 - 80 + i * 70},${y2 + 46}" stroke="#3E3E3E" stroke-width="3" fill="none"/>`;
  return s;
}

// Árvore de calçada (base do tronco em x, yBase)
function arvore(x, yBase, k = 1) {
  let s = `<g transform="translate(${x},${yBase}) scale(${k})">`;
  s += `<rect x="-60" y="-10" width="120" height="16" fill="#9C8F7A" ${ST}/>`;
  s += `<path d="M-14,0 L-10,-260 C-30,-300 -60,-310 -80,-330 M10,-200 C40,-250 70,-270 90,-300 M-12,0 L12,0 L10,-260" stroke="#6E4E36" stroke-width="22" fill="none" stroke-linecap="round"/>`;
  const folhas = [[-90, -380, 80, '#4E8E5A'], [70, -400, 90, '#4E8E5A'], [-10, -470, 100, '#5FA36A'], [-110, -470, 60, '#5FA36A'], [100, -320, 60, '#5FA36A'], [-40, -360, 70, '#6DB178'], [40, -480, 70, '#6DB178']];
  folhas.forEach(([fx, fy, r, c]) => s += `<circle cx="${fx}" cy="${fy}" r="${r}" fill="${c}" ${ST}/>`);
  folhas.forEach(([fx, fy, r, c]) => s += `<circle cx="${fx}" cy="${fy}" r="${r - 3}" fill="${c}"/>`);
  s += `<circle cx="-20" cy="-500" r="20" fill="#86C48F"/><circle cx="60" cy="-430" r="16" fill="#86C48F"/>`;
  return s + '</g>';
}

// Calçada de pedra portuguesa (ondas pretas sobre branco)
function calcada(y, h, w = 1080) {
  let s = `<rect x="0" y="${y}" width="${w}" height="${h}" fill="#EFE9DE"/>`;
  for (let r = 0; r < h / 60; r++) {
    let d = `M-60,${y + 30 + r * 60}`;
    for (let i = 0; i < w / 120 + 2; i++) d += ` q30,-24 60,0 t60,0`;
    s += `<path d="${d}" stroke="#5A5650" stroke-width="10" fill="none" opacity=".55" transform="translate(${(r % 2) * 60},0)"/>`;
  }
  return s;
}

// Rua com asfalto e faixa
function rua(y, h, w = 1080) {
  let s = `<rect x="0" y="${y}" width="${w}" height="${h}" fill="#6E6A66"/>`;
  for (let i = 0; i < 260; i++) s += `<circle cx="${(i * 97) % w}" cy="${y + (i * 53) % h}" r="${1 + (i % 3)}" fill="#8A8580" opacity=".6"/>`;
  for (let i = 0; i < w / 160 + 1; i++) s += `<rect x="${i * 160 + 20}" y="${y + h / 2 - 6}" width="90" height="12" fill="#F2C14E"/>`;
  s += `<rect x="0" y="${y - 14}" width="${w}" height="16" fill="#C9C1B3" ${ST}/><rect x="0" y="${y + h - 2}" width="${w}" height="16" fill="#C9C1B3" ${ST}/>`;
  return s;
}

if (typeof module !== 'undefined') module.exports = { onibus, pomboVoando, pomboChao, sobrado, poste, fios, arvore, calcada, rua };
