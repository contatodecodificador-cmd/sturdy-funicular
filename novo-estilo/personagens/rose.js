// Rose (Rosângela), 33 anos, faxineira da prefeitura que vira prefeita.
// Personagem original da linha "A cidade que você governa" · estilo Praça ao Sol.
// Desenho em SVG puro: viewBox "0 0 400 1720" (corpo inteiro), cabeça entre y≈20 e y≈342.
// Uso: rose({expr:'feliz'|'surpresa'|'brava'|'desconfiada'|'rindo', corpo:true|false})

const ROSE = {
  pele: '#B9805C', peleSombra: '#96603F', cabelo: '#2A1A14', cabeloSombra: '#4A3024',
  faixa: '#F2C14E', polo: '#2F6FA3', poloSombra: '#24578A', gola: '#F4EDE1',
  calca: '#24364F', calcaSombra: '#1A283B', tenis: '#F7F3EC', tenisSola: '#C9BFB0',
  luva: '#F2C14E', cracha: '#D96C4A', iris: '#4A2C1A', boca: '#9E4B3C', tinta: '#2B2420',
};

function roseRosto(expr, c, olhar = 0) {
  const L = `stroke="${c.tinta}" stroke-linecap="round" fill="none"`;
  const olhoAberto = (cx, irisR = 7.5) => {
    const x0 = cx - 16, x1 = cx + 16;
    return `<path d="M${x0},229 C${x0 + 8},218 ${x1 - 8},218 ${x1},229 C${x1 - 8},236 ${x0 + 8},236 ${x0},229Z" fill="#fff"/>
      <circle cx="${cx + 5 * olhar}" cy="228" r="${irisR}" fill="${c.iris}"/><circle cx="${cx + 5 * olhar}" cy="228" r="3.4" fill="#111"/>
      <circle cx="${cx + 5 * olhar + 2.5}" cy="225.5" r="2" fill="#fff"/>
      <path d="M${x0 - 2},229 C${x0 + 8},216 ${x1 - 8},216 ${x1 + 2},228" ${L} stroke-width="3.6"/>`;
  };
  const sobr = (d) => `<path d="${d}" stroke="${c.cabelo}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  let s = '';
  switch (expr) {
    case 'surpresa':
      s += sobr('M158,192 C170,182 185,182 193,188') + sobr('M207,188 C215,182 230,182 242,192');
      s += olhoAberto(178, 6) + olhoAberto(222, 6);
      s += `<ellipse cx="200" cy="304" rx="13" ry="17" fill="${c.boca}"/><ellipse cx="200" cy="309" rx="8" ry="8" fill="#5E2A22"/>`;
      break;
    case 'brava':
      s += sobr('M158,200 C172,200 185,206 194,214') + sobr('M206,214 C215,206 228,200 242,200');
      s += olhoAberto(178) + olhoAberto(222);
      s += `<path d="M160,222 L196,226 M204,226 L240,222" stroke="${c.pele}" stroke-width="9"/>`;
      s += `<path d="M182,306 C192,300 208,300 218,306" ${L} stroke-width="4"/>`;
      break;
    case 'desconfiada':
      s += sobr('M158,206 C170,203 185,204 193,207') + sobr('M207,196 C215,188 230,188 242,198');
      s += olhoAberto(178) + olhoAberto(222);
      s += `<path d="M160,229 C170,214 188,214 196,228 L196,222 C186,212 168,212 160,222Z" fill="${c.pele}"/>
            <path d="M160,226 C170,224 186,224 196,226" ${L} stroke-width="3.6"/>`;
      s += `<path d="M184,304 C196,306 208,302 220,294" ${L} stroke-width="4"/>`;
      break;
    case 'rindo':
      s += sobr('M158,200 C170,191 185,191 193,196') + sobr('M207,196 C215,191 230,191 242,200');
      s += `<path d="M164,230 C170,222 186,222 192,230 M208,230 C214,222 230,222 236,230" ${L} stroke-width="4"/>`;
      s += `<path d="M176,294 C190,300 210,300 224,294 C220,326 180,326 176,294Z" fill="#5E2A22"/>
            <path d="M178,295 C192,300 208,300 222,295 L220,302 C206,306 194,306 180,302Z" fill="#fff"/>
            <path d="M188,316 C196,312 204,312 212,316 C206,322 194,322 188,316Z" fill="#D9776B"/>`;
      break;
    default: // feliz
      s += sobr('M158,203 C170,195 185,195 193,200') + sobr('M207,200 C215,195 230,195 242,203');
      s += olhoAberto(178) + olhoAberto(222);
      s += `<path d="M178,298 C192,308 210,308 224,298 C212,318 190,318 178,298Z" fill="${c.boca}"/>
            <path d="M184,301 C195,307 208,307 218,301 L216,305 C206,310 196,310 186,305Z" fill="#fff"/>`;
  }
  // nariz
  s += `<path d="M201,240 C199,256 192,266 194,274 C198,279 205,279 209,275" ${L} stroke-width="2.6" opacity=".8"/>`;
  return s;
}

/**
 * rose(op)
 *  expr: 'feliz'|'surpresa'|'brava'|'desconfiada'|'rindo'  · corpo: true/false · piscar: true/false
 *  anim (tudo opcional, em graus/px):
 *    resp 0..1 (respiração: peito sobe), cab (inclinação da cabeça, °), cabY (cabeça sobe/desce, px),
 *    bE/bD (braço esquerdo/direito, ° a partir do ombro), pE/pD (perna esquerda/direita, ° a partir do quadril),
 *    pulo (corpo sobe no passo, px), olhar (-1..1, íris pra esquerda/direita), falar 0..1 (boca abrindo)
 */
function rose({ expr = 'feliz', corpo = true, piscar = false, anim = {}, velha = false } = {}) {
  // velha: a Rose 30 anos mais velha (cabelo branco, rugas, casaco comprido, faixa desbotada)
  const c = velha ? Object.assign({}, ROSE, { cabelo: '#ECE8E1', cabeloSombra: '#C9C3B8', faixa: '#E3C77A', polo: '#7A5236', poloSombra: '#5E3E28', gola: '#E3C77A', pele: '#AF7A58', peleSombra: '#8C5B3E', cracha: '#7A5236' }) : ROSE;
  const a = Object.assign({ resp: 0, cab: 0, cabY: 0, bE: 0, bD: 0, pE: 0, pD: 0, pulo: 0, olhar: 0, falar: 0 }, anim);
  const st = `stroke="${c.tinta}" stroke-width="3" stroke-linejoin="round"`;
  const sobe = -a.pulo;                        // corpo inteiro sobe no passo
  const peito = 1 + 0.012 * a.resp;            // respiração
  const tCab = `translate(0,${sobe - 6 * a.resp + a.cabY}) rotate(${a.cab} 200 330)`;
  const tTronco = `translate(0,${sobe}) translate(200,920) scale(1,${peito}) translate(-200,-920)`;
  const tBraco = (ang, px) => `${tTronco} rotate(${ang} ${px} 470)`;
  const tPerna = (ang, px) => `translate(0,${sobe}) rotate(${ang} ${px} 960)`;
  let s = '';
  // cabelo de trás (cachos volumosos) + coque alto — anda junto com a cabeça
  const cachos = [[150, 150, 52], [250, 150, 52], [200, 120, 62], [128, 210, 40], [272, 210, 40], [135, 262, 30], [265, 262, 30]];
  const coque = [[200, 58, 46], [168, 70, 30], [232, 70, 30], [200, 30, 28]];
  s += `<g transform="${tCab}">`;
  s += cachos.concat(coque).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.cabelo}" ${st}/>`).join('');
  s += cachos.concat(coque).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3}" fill="${c.cabelo}"/>`).join('');
  s += `<circle cx="214" cy="46" r="10" fill="${c.cabeloSombra}"/><circle cx="244" cy="140" r="14" fill="${c.cabeloSombra}"/><circle cx="148" cy="132" r="12" fill="${c.cabeloSombra}"/></g>`;
  if (corpo) {
    // pernas (cada uma gira no quadril) + tênis
    const perna = (lado) => lado < 0
      ? `<path d="M100,940 L202,940 L196,1000 L184,1640 L112,1640Z" fill="${c.calca}" ${st}/>
         <path d="M108,1636 L188,1636 L192,1676 C192,1692 182,1698 170,1698 L84,1698 C70,1698 64,1686 74,1674Z" fill="${c.tenis}" ${st}/><path d="M70,1688 L192,1688" stroke="${c.tenisSola}" stroke-width="8"/><path d="M80,1676 C88,1664 104,1666 110,1674 C108,1684 92,1688 84,1684Z" fill="#E9DFC4" opacity=".95"/><circle cx="118" cy="1680" r="4" fill="#E9DFC4"/>`
      : `<path d="M198,940 L300,940 L288,1640 L216,1640 L204,1000Z" fill="${c.calca}" ${st}/><path d="M250,1000 L262,1640 L288,1640 L298,980Z" fill="${c.calcaSombra}"/>
         <path d="M212,1636 L292,1636 L326,1674 C336,1686 330,1698 316,1698 L230,1698 C218,1698 208,1692 208,1676Z" fill="${c.tenis}" ${st}/><path d="M208,1688 L330,1688" stroke="${c.tenisSola}" stroke-width="8"/>`;
    // a perna que vai pra trás é desenhada primeiro
    const ordem = a.pE > a.pD ? [1, -1] : [-1, 1];
    for (const l of ordem) s += `<g transform="${tPerna(l < 0 ? a.pE : a.pD, l < 0 ? 150 : 250)}">${perna(l)}</g>`;
    s += `<g transform="translate(0,${sobe})"><path d="M104,900 L296,900 L300,980 L100,980Z" fill="${c.calca}" ${st}/><path d="M200,930 L200,980" ${st} fill="none"/></g>`;
    // braços (pele + mão), giram no ombro
    s += `<g transform="${tBraco(a.bE, 110)}"><path d="M78,560 L66,760 C64,800 70,840 80,866 L106,866 C108,830 108,800 110,760 L120,566Z" fill="${c.pele}" ${st}/><ellipse cx="92" cy="884" rx="21" ry="29" fill="${c.pele}" ${st}/></g>`;
    s += `<g transform="${tBraco(a.bD, 290)}"><path d="M322,560 L334,760 C336,800 330,840 320,866 L294,866 C292,830 292,800 290,760 L280,566Z" fill="${c.pele}" ${st}/>
          <path d="M322,560 L334,760 C336,800 330,840 320,866 L308,866 C312,820 312,780 306,740 L296,570Z" fill="${c.peleSombra}"/><ellipse cx="308" cy="884" rx="21" ry="29" fill="${c.pele}" ${st}/></g>`;
    // tronco (polo, luvas, crachá) respirando
    s += `<g transform="${tTronco}">`;
    s += `<path d="M292,912 L322,918 L318,986 L298,982Z" fill="${c.luva}" ${st}/><path d="M300,982 L296,1004 M308,984 L306,1006 M316,986 L316,1004" stroke="${c.tinta}" stroke-width="3"/>`;
    s += `<path d="M104,454 C116,432 136,420 152,414 L200,456 L248,414 C264,420 284,432 296,454 L302,920 L98,920Z" fill="${c.polo}" ${st}/>
          <path d="M260,440 C282,470 292,700 298,920 L254,920 C262,760 262,560 240,470Z" fill="${c.poloSombra}"/>
          <path d="M98,880 L302,880" stroke="${c.faixa}" stroke-width="12"/>
          <path d="M152,414 L180,462 L200,456Z M248,414 L220,462 L200,456Z" fill="${c.gola}" ${st}/>
          <rect x="190" y="470" width="20" height="60" rx="4" fill="${c.poloSombra}"/>`;
    if (velha) s += `<path d="M98,600 L84,1250 L196,1250 L200,700Z M302,600 L316,1250 L204,1250 L200,700Z" fill="${c.polo}" ${st}/>
      <path d="M152,414 L200,520 L248,414 L262,430 L210,560 L200,540 L190,560 L138,430Z" fill="${c.poloSombra}" ${st}/>
      <path d="M262,940 L300,940 L298,1010 L262,1010Z" fill="${c.poloSombra}" ${st}/><path d="M270,930 L292,936 L290,1000 L272,996Z" fill="${c.luva}"/>`;
    if (!velha) s += `<path d="M180,440 L232,620 M220,436 L262,620" stroke="${c.cracha}" stroke-width="6" fill="none"/>
          <rect x="216" y="612" width="70" height="92" rx="8" fill="#fff" ${st}/><rect x="216" y="612" width="70" height="20" rx="6" fill="${c.cracha}"/>
          <circle cx="251" cy="656" r="14" fill="${c.pele}"/><rect x="228" y="678" width="46" height="6" rx="3" fill="#999"/><rect x="232" y="690" width="38" height="5" rx="2" fill="#bbb"/>`;
    s += `</g>`;
    // mangas (por cima do tronco, giram junto com o braço)
    s += `<g transform="${tBraco(a.bE, 110)}"><path d="M104,454 C86,470 74,510 70,570 L124,584 L128,500Z" fill="${c.polo}" ${st}/></g>`;
    s += `<g transform="${tBraco(a.bD, 290)}"><path d="M296,454 C314,470 326,510 330,570 L276,584 L272,500Z" fill="${c.poloSombra}" ${st}/></g>`;
  }
  // pescoço
  s += `<g transform="translate(0,${sobe - 4 * a.resp})"><path d="M172,318 L172,410 L200,452 L228,410 L228,318Z" fill="${c.pele}" ${st}/>
        <path d="M172,330 C185,372 215,372 228,330 L228,320 L172,320Z" fill="${c.peleSombra}"/></g>`;
  // cabeça
  s += `<g transform="${tCab}">`;
  s += `<ellipse cx="137" cy="246" rx="14" ry="24" fill="${c.pele}" ${st}/><ellipse cx="263" cy="246" rx="14" ry="24" fill="${c.pele}" ${st}/>
        <circle cx="134" cy="286" r="13" fill="none" stroke="${c.faixa}" stroke-width="4"/><circle cx="266" cy="286" r="13" fill="none" stroke="${c.faixa}" stroke-width="4"/>`;
  s += `<path d="M138,215 C136,140 170,108 200,108 C230,108 264,140 262,215 L260,262 C256,305 232,338 200,342 C168,338 144,305 140,262Z" fill="${c.pele}" ${st}/>
        <path d="M262,215 L260,262 C256,305 232,338 200,342 C222,328 240,300 244,262 L247,215 C247,192 242,174 234,162 C252,172 262,192 262,215Z" fill="${c.peleSombra}"/>
        <ellipse cx="166" cy="276" rx="15" ry="9" fill="#E07A6F" opacity=".25"/><ellipse cx="236" cy="276" rx="15" ry="9" fill="#E07A6F" opacity=".25"/>`;
  s += `<path d="M136,186 C140,130 176,104 200,104 C224,104 260,130 264,186 C250,160 226,146 200,146 C174,146 150,160 136,186Z" fill="${c.cabelo}" ${st}/>
        <circle cx="146" cy="184" r="14" fill="${c.cabelo}"/><circle cx="254" cy="184" r="14" fill="${c.cabelo}"/>
        <path d="M140,150 C160,108 240,108 260,150 L254,128 C236,92 164,92 146,128Z" fill="${c.faixa}" ${st}/>
        <path d="M252,120 C270,108 284,112 290,96 C278,116 266,126 256,130Z" fill="${c.faixa}" ${st}/>`;
  s += roseRosto(expr, c, a.olhar);
  if (velha) s += `<path d="M166,170 C185,164 215,164 234,170 M170,182 C188,177 212,177 230,182" stroke="${c.tinta}" stroke-width="2" fill="none" opacity=".45"/>
    <path d="M158,244 C166,250 180,252 192,246 M208,246 C220,252 234,250 242,244 M150,226 L140,222 M250,226 L260,222" stroke="${c.tinta}" stroke-width="2.2" fill="none" opacity=".45"/>
    <path d="M176,284 C170,296 172,306 180,312 M224,284 C230,296 228,306 220,312" stroke="${c.tinta}" stroke-width="2.6" fill="none" opacity=".45"/>`;
  if (a.falar > 0.05) {
    const ab = 4 + 14 * a.falar;
    s += `<ellipse cx="200" cy="302" rx="28" ry="17" fill="${c.pele}"/><ellipse cx="200" cy="303" rx="${14 + 4 * a.falar}" ry="${ab}" fill="#5E2A22"/>
          <path d="M${188 - 2 * a.falar},${303 - ab + 3} L${212 + 2 * a.falar},${303 - ab + 3}" stroke="#fff" stroke-width="${3 + 2 * a.falar}" stroke-linecap="round"/>`;
  }
  if (piscar) s += `<path d="M156,212 C170,208 186,208 198,214 L198,238 L156,238Z M202,214 C214,208 230,208 244,212 L244,238 L202,238Z" fill="${c.pele}"/>
    <path d="M160,230 C170,236 186,236 196,230 M204,230 C214,236 230,236 240,230" stroke="${c.tinta}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
  s += `</g>`;
  return s;
}

if (typeof module !== 'undefined') module.exports = { rose, ROSE };
