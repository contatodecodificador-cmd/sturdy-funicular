// Cenários novos do Ep. 2 "O rastro na poeira": poeira com túnel, praça, ponte, rua de trás, relojoaria (fora e dentro), foto, verso.
import React from 'react';
import '@fontsource/caveat/600.css';
import {roseVivo, pessoa, FIG, cen, poe, PELES} from './arte';
import {POS} from './cenarios';

const T = '#2B2420';
const ST = `stroke="${T}" stroke-width="3" stroke-linejoin="round"`;
const Svg: React.FC<{W: number; H: number; html: string}> = ({W, H, html}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} dangerouslySetInnerHTML={{__html: html}} />
);

// ------------------------------------------------------------ gente nova (todos com rosto)
export const GENTE2: Record<string, any> = {
  aurelio: {nome: 'Seu Aurélio, 74', pele: PELES.clara, cabelo: 'grisalho', corCabelo: '#D8D3CB', idade: 74, barba: 'bigode', tipoRoupa: 'social', roupa: '#E8DCC2', avental: '#8B5A3C', lupa: true, calca: '#4A4038', sapato: '#3A2A20', expr: 'neutro', pose: 'entregando', nariz: 2, queixo: 'quadrado'},
  zefa: {nome: 'Dona Zefa, 66', pele: PELES.parda, cabelo: 'coque', corCabelo: '#B9B2A8', idade: 66, tipoRoupa: 'vestido', roupa: '#7FB98A', avental: '#FFF8EC', expr: 'rindo', pose: 'parado', nariz: 1, queixo: 'redondo', largCorpo: 1.1},
  toninho: {nome: 'Toninho, 40', pele: PELES.morena, cabelo: 'curto', corCabelo: '#1A1210', idade: 40, barba: 'rala', bone: '#2F6FA3', tipoRoupa: 'regata', roupa: '#F2C14E', calca: '#5A6B7A', tipoCalca: 'bermuda', expr: 'neutro', pose: 'parado', nariz: 2},
  julia: {nome: 'Júlia, 31', pele: PELES.negra, cabelo: 'crespo', corCabelo: '#1A1210', idade: 31, tipoRoupa: 'vestido', roupa: '#E89A7A', expr: 'rindo', pose: 'acenando', nariz: 1},
  caio: {nome: 'Caio, 33', pele: PELES.clara, cabelo: 'curto', corCabelo: '#6B4A2E', idade: 33, tipoRoupa: 'camiseta', roupa: '#2F6FA3', calca: '#3E4A5C', expr: 'rindo', pose: 'parado', barba: 'rala'},
};

// ------------------------------------------------------------ poeira com túnel (no mundo da RUA)
/** Nuvem de poeira parada com um "buraco" do tamanho de uma pessoa. cx/pe = pés do buraco. */
export function poeiraTunel(cx: number, pe: number, alt = 900, opac = 1, contorno = 0) {
  let s = '';
  const larg = alt * 0.26;
  const dentro = (x: number, y: number) => {
    const cab = (x - cx) ** 2 / (alt * 0.075) ** 2 + (y - (pe - alt * 0.9)) ** 2 / (alt * 0.09) ** 2 < 1;
    const corpo = Math.abs(x - cx) < larg / 2 && y > pe - alt * 0.8 && y < pe;
    return cab || corpo;
  };
  const id = `mq${Math.round(cx)}_${Math.round(pe)}_${Math.round(alt)}`;
  const silh = `<rect x="${cx - larg / 2}" y="${pe - alt * 0.8}" width="${larg}" height="${alt * 0.8}" rx="${larg * 0.3}"/><ellipse cx="${cx}" cy="${pe - alt * 0.9}" rx="${alt * 0.075}" ry="${alt * 0.09}"/>`;
  s += `<defs><mask id="${id}"><rect x="${cx - 600}" y="${pe - 1300}" width="1200" height="1400" fill="#fff"/><g fill="#000">${silh}</g></mask>
    <radialGradient id="${id}g"><stop offset="0" stop-color="#FFF1CF" stop-opacity=".75"/><stop offset=".7" stop-color="#FFF1CF" stop-opacity=".45"/><stop offset="1" stop-color="#FFF1CF" stop-opacity="0"/></radialGradient></defs>`;
  s += `<g mask="url(#${id})"><ellipse cx="${cx}" cy="${pe - alt * 0.5}" rx="${alt * 0.62}" ry="${alt * 0.72}" fill="url(#${id}g)" opacity="${opac}"/></g>`;
  for (let i = 0; i < 1100; i++) {
    const x = cx - 420 + ((i * 97.13) % 840), y = pe - 1150 + ((i * 53.71) % 1150);
    if (!dentro(x, y)) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${3 + (i % 4)}" fill="#FFF6E2" opacity="${(0.6 + (i % 4) * 0.1) * opac}"/>`;
  }
  if (contorno > 0) {
    const d = `M${cx - larg / 2},${pe} L${cx - larg / 2},${pe - alt * 0.8} Q${cx},${pe - alt * 0.84} ${cx + larg / 2},${pe - alt * 0.8} L${cx + larg / 2},${pe}`;
    s += `<path d="${d}" stroke="#F2C14E" stroke-width="6" stroke-dasharray="18 14" fill="none" opacity="${contorno}"/>`;
    s += `<ellipse cx="${cx}" cy="${pe - alt * 0.9}" rx="${alt * 0.075}" ry="${alt * 0.09}" stroke="#F2C14E" stroke-width="6" stroke-dasharray="18 14" fill="none" opacity="${contorno}"/>`;
  }
  return s;
}
export const PoeiraRua: React.FC<{tuneis: {x: number; o?: number; c?: number}[]}> = ({tuneis}) => {
  const html = React.useMemo(() => tuneis.map((t) => poeiraTunel(t.x, POS.pe, 900, t.o ?? 1, t.c ?? 0)).join(''), [JSON.stringify(tuneis)]);
  return <Svg W={2400} H={1920} html={html} />;
};

// ------------------------------------------------------------ PRAÇA (coreto, pipoqueira, casal)
export const PRACA = {W: 1600, H: 1920};
export const Praca: React.FC<{t: number; roseX?: number}> = ({t, roseX}) => {
  const fundo = React.useMemo(() => {
    let s = `<defs><linearGradient id="ceuP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FCBE6"/><stop offset="1" stop-color="#FCE3B0"/></linearGradient></defs>`;
    s += `<rect x="-200" y="-1000" width="2000" height="2100" fill="url(#ceuP)"/><rect y="1050" width="1600" height="900" fill="#8CC08A"/>`;
    s += `<path d="M0,1500 C400,1440 1200,1440 1600,1500 L1600,1920 L0,1920Z" fill="#E4DCCD"/>`;
    // coreto
    s += `<rect x="560" y="760" width="480" height="300" fill="#F4EDE1" ${ST}/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${575 + i * 70}" y="760" width="16" height="300" fill="#FFFFFF" ${ST}/>`;
    s += `<path d="M520,770 L800,560 L1080,770Z" fill="#D96C4A" ${ST}/><rect x="540" y="1040" width="520" height="40" fill="#C9C1B3" ${ST}/><circle cx="800" cy="540" r="18" fill="#F2C14E" ${ST}/>`;
    s += cen.arvore(180, 1100, 0.9) + cen.arvore(1420, 1100, 0.85);
    // banco
    s += `<rect x="1100" y="1250" width="320" height="30" fill="#8A6A40" ${ST}/><rect x="1110" y="1200" width="300" height="20" fill="#8A6A40" ${ST}/>`;
    // carrinho de pipoca
    s += `<rect x="200" y="1250" width="260" height="220" rx="12" fill="#D9483B" ${ST}/><rect x="220" y="1150" width="220" height="110" fill="#FFF8EC" opacity=".9" ${ST}/>`;
    for (let i = 0; i < 14; i++) s += `<circle cx="${235 + (i * 37) % 190}" cy="${1225 - (i % 3) * 18}" r="12" fill="#FFF3C4" ${ST}/>`;
    s += `<text x="330" y="1360" text-anchor="middle" font-family="Anton, sans-serif" font-size="46" fill="#fff">PIPOCA</text><circle cx="250" cy="1490" r="26" fill="${T}"/><circle cx="410" cy="1490" r="26" fill="${T}"/>`;
    // pipoca parada no ar
    for (let i = 0; i < 8; i++) s += `<circle cx="${300 + i * 22}" cy="${1080 - (i % 3) * 30}" r="10" fill="#FFF3C4" ${ST}/>`;
    s += poe(pessoa(GENTE2.zefa), 560, 1700, 0.5);
    s += poe(pessoa(GENTE2.julia), 1080, 1720, 0.5) + poe(pessoa(GENTE2.caio), 1260, 1720, 0.52);
    s += cen.pomboChao(900, 1600, 0.6) + cen.pomboVoando(1000, 380, 0.8, 6);
    s += poeiraTunel(820, 1720, 820, 0.8, 0.9);
    s += `<rect x="-200" y="-1000" width="2000" height="3000" fill="#9FB8D0" opacity=".18"/>`;
    return s;
  }, []);
  const rose = roseX !== undefined ? poe(roseVivo(t, {expr: 'desconfiada', andando: true}), roseX, 1760, 0.52) : '';
  return <Svg W={1600} H={1920} html={fundo + rose} />;
};

// ------------------------------------------------------------ PONTE (Toninho pescando, água parada)
export const PONTE = {W: 1600, H: 1920};
export const Ponte: React.FC<{t: number}> = ({t}) => {
  const html = React.useMemo(() => {
    let s = `<rect x="-200" y="-1000" width="2000" height="1900" fill="#9ED3EA"/><rect y="880" width="1600" height="1100" fill="#4E86B8"/>`;
    for (let i = 0; i < 26; i++) s += `<path d="M${(i * 173) % 1600},${940 + (i * 67) % 900} q30,-14 60,0 t60,0" stroke="#BFE0F0" stroke-width="5" fill="none" opacity=".8"/>`;
    s += `<path d="M-100,880 L1700,880 L1700,1000 L-100,1000Z" fill="#7FB98A"/>`;
    // ponte
    s += `<rect x="-100" y="1240" width="1800" height="120" fill="#BDB6A9" ${ST}/><rect x="-100" y="1100" width="1800" height="22" fill="#8A847A" ${ST}/>`;
    for (let x = -80; x < 1700; x += 70) s += `<rect x="${x}" y="1100" width="16" height="140" fill="#8A847A" ${ST}/>`;
    for (const x of [200, 800, 1400]) s += `<rect x="${x - 40}" y="1360" width="80" height="560" fill="#A9A294" ${ST}/>`;
    s += poe(pessoa(GENTE2.toninho), 900, 1250, 0.4);
    // vara de pesca + linha + respingo parado no ar
    s += `<path d="M960,1010 L1250,700" stroke="#5A3A28" stroke-width="8"/><path d="M1250,700 Q1270,900 1260,1500" stroke="#EEE" stroke-width="2" fill="none"/>`;
    for (let i = 0; i < 12; i++) s += `<circle cx="${1240 + (i * 37) % 60 - 20}" cy="${1480 - (i * 23) % 120}" r="${4 + i % 3}" fill="#E8F6FF" ${ST}/>`;
    s += `<path d="M1200,1500 C1220,1440 1300,1440 1320,1500" stroke="#E8F6FF" stroke-width="6" fill="none"/>`;
    s += cen.pomboVoando(400, 500, 0.8, -12);
    s += poeiraTunel(600, 1240, 700, 0.7, 0.9);
    s += `<rect x="-200" y="-1000" width="2000" height="3000" fill="#9FB8D0" opacity=".18"/>`;
    return s;
  }, []);
  return <Svg W={1600} H={1920} html={html} />;
};

// ------------------------------------------------------------ RUA DE TRÁS (beco, varal, gato no ar)
export const BECO = {W: 1080, H: 1920};
export const Beco: React.FC<{t: number}> = ({t}) => {
  const html = React.useMemo(() => {
    let s = `<rect x="-200" y="-800" width="1500" height="1400" fill="#F6E3B8"/>`;
    s += `<path d="M0,0 L380,520 L380,1500 L0,1920Z" fill="#E89A7A" ${ST}/><path d="M1080,0 L700,520 L700,1500 L1080,1920Z" fill="#B9A7DB" ${ST}/>`;
    s += `<path d="M380,1500 L700,1500 L1080,1920 L0,1920Z" fill="#CFC5B4" ${ST}/><rect x="380" y="520" width="320" height="980" fill="#F4EDE1"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${60 + i * 50}" y="${500 + i * 160}" width="40" height="70" fill="#5FA36A" ${ST}/><rect x="${940 - i * 50}" y="${500 + i * 160}" width="40" height="70" fill="#2F6FA3" ${ST}/>`;
    // varal com roupa parada no meio do vento
    s += `<path d="M200,700 Q540,780 880,700" stroke="#555" stroke-width="4" fill="none"/>`;
    const roupas = [['#D96C4A', 300], ['#F2C14E', 430], ['#7EC8E3', 560], ['#FFF8EC', 690]];
    for (const [c, x] of roupas) s += `<path d="M${x},${745} L${(x as number) + 80},${745} L${(x as number) + 110},${880} L${(x as number) + 10},${870}Z" fill="${c}" ${ST} transform="rotate(-14 ${x} 745)"/>`;
    // gato congelado no meio do pulo
    s += `<g transform="translate(560,1200) rotate(-18)"><ellipse rx="90" ry="40" fill="#E8792B" ${ST}/><circle cx="90" cy="-30" r="38" fill="#E8792B" ${ST}/><path d="M70,-62 L78,-96 L96,-66Z M104,-62 L118,-92 L124,-58Z" fill="#E8792B" ${ST}/>
      <circle cx="100" cy="-34" r="5" fill="${T}"/><circle cx="116" cy="-32" r="5" fill="${T}"/><path d="M-90,0 C-150,-30 -170,-90 -140,-120" stroke="#E8792B" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M-50,30 L-80,90 M-20,34 L-40,96 M40,34 L60,96 M70,28 L110,80" stroke="#E8792B" stroke-width="14" stroke-linecap="round"/></g>`;
    s += poeiraTunel(540, 1700, 760, 0.8, 0.9);
    s += `<rect x="-200" y="-800" width="1500" height="3000" fill="#9FB8D0" opacity=".18"/>`;
    return s;
  }, []);
  return <Svg W={1080} H={1920} html={html} />;
};

// ------------------------------------------------------------ RELOJOARIA (fachada)
export const FACHADA = {W: 1400, H: 1920, lim: {x0: 0, y0: -600, x1: 1400, y1: 2400}};
export const Fachada: React.FC<{t: number; rangido?: number}> = ({t, rangido = 0}) => {
  const html = React.useMemo(() => {
    let s = `<rect x="-100" y="-700" width="1600" height="1400" fill="#8FCBE6"/><rect x="0" y="200" width="1400" height="1380" fill="#C9A46A" ${ST}/>`;
    for (let y = 230; y < 1560; y += 46) s += `<path d="M0,${y} L1400,${y}" stroke="#B48E58" stroke-width="3"/>`;
    s += `<rect x="150" y="300" width="1100" height="200" rx="16" fill="#2B4A3A" ${ST}/><text x="700" y="400" text-anchor="middle" font-family="Anton, sans-serif" font-size="96" fill="#F2C14E">RELOJOARIA</text><text x="700" y="470" text-anchor="middle" font-family="Anton, sans-serif" font-size="54" fill="#FFF8EC">DO SEU AURÉLIO</text>`;
    s += `<rect x="560" y="520" width="280" height="70" rx="10" fill="#FFF8EC" ${ST}/><text x="700" y="572" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="44" fill="${T}">DESDE 1971</text>`;
    // vitrine com relógios
    s += `<rect x="110" y="700" width="420" height="560" fill="#A9CADB" ${ST}/>`;
    for (let i = 0; i < 6; i++) { const cx = 190 + (i % 3) * 130, cy = 820 + Math.floor(i / 3) * 220; s += `<circle cx="${cx}" cy="${cy}" r="50" fill="#FFF8EC" ${ST}/><path d="M${cx},${cy} L${cx},${cy - 38} M${cx},${cy} L${cx - 28},${cy + 10}" stroke="${T}" stroke-width="6"/>`; }
    s += `<rect x="1000" y="1640" width="20" height="10" fill="none"/>`;
    s += `<rect y="1580" width="1400" height="340" fill="#E4DCCD"/>`;
    s += cen.calcada(1640, 600, 1400);
    s += poeiraTunel(780, 1880, 860, 0.8, 0.9);
    s += `<rect x="-100" y="-700" width="1600" height="3200" fill="#9FB8D0" opacity=".16"/>`;
    return s;
  }, []);
  // porta de madeira (abre um tiquinho com o rangido)
  const porta = `<rect x="640" y="700" width="380" height="880" fill="#3A2A20" ${ST}/><g transform="translate(640,700) scale(${1 - 0.25 * rangido},1)"><rect x="0" y="0" width="380" height="880" fill="#6E4E36" ${ST}/><rect x="40" y="60" width="300" height="340" fill="#A9CADB" ${ST}/><circle cx="330" cy="470" r="16" fill="#F2C14E" ${ST}/></g>`;
  const rose = poe(roseVivo(t, {expr: 'desconfiada', andando: t < 1.2}), 400 + Math.min(t, 1.2) * 60, 1900, 0.5);
  return <Svg W={1400} H={1920} html={html + porta + rose} />;
};

// ------------------------------------------------------------ RELOJOARIA (dentro)
export const LOJA2 = {W: 2000, H: 1920, lim: {x0: 0, y0: -200, x1: 2000, y1: 2300}};
/** posições úteis (mundo) */
export const REL = {bolso: {x: 1000, y: 1150}, foto: {x: 1080, y: 1172}, aurelio: 1230, porta: 260, fundos: 1800, sino: {x: 260, y: 640}, rose: 700};
export const Relojoaria: React.FC<{t: number; ponteiro: number; roseX?: number; roseExpr?: string; roseAndando?: boolean; olhar?: number; sombra?: number; portaAbre?: number; fotoTirada?: boolean; sinoBalanca?: number}> = (
  {t, ponteiro, roseX = REL.rose, roseExpr = 'desconfiada', roseAndando, sombra = 0, portaAbre = 0, fotoTirada, sinoBalanca = 0}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect x="-100" y="-300" width="2200" height="1500" fill="#E9DCC2"/><rect y="1180" width="2000" height="1100" fill="#8A6A40"/>`;
    for (let x = 0; x < 2000; x += 120) s += `<path d="M${x},1180 L${x - 200},2300" stroke="#7A5C36" stroke-width="4"/>`;
    // parede inteira coberta de relógios (112)
    let k = 0;
    for (let r = 0; r < 7; r++) for (let c = 0; c < 16; c++) {
      const cx = 470 + c * 90 + (r % 2) * 40, cy = 90 + r * 105, raio = 30 + ((r * 7 + c * 3) % 4) * 6;
      if (cx > 1950) continue;
      const cor = ['#FFF8EC', '#F2D7A0', '#E8E2D6', '#D9C8A8'][(r + c) % 4], aro = ['#8A6A40', '#2B4A3A', '#5A3A28', '#C9A46A'][(r * 3 + c) % 4];
      const quad = (r + c) % 5 === 0;
      s += quad ? `<rect x="${cx - raio}" y="${cy - raio}" width="${raio * 2}" height="${raio * 2}" rx="8" fill="${cor}" stroke="${aro}" stroke-width="7"/>` : `<circle cx="${cx}" cy="${cy}" r="${raio}" fill="${cor}" stroke="${aro}" stroke-width="7"/>`;
      // 16:47 → ponteiro das horas perto do 5, minutos no 47
      const ah = ((4 + 47 / 60) / 12) * 2 * Math.PI, am = (47 / 60) * 2 * Math.PI;
      s += `<path d="M${cx},${cy} L${cx + Math.sin(ah) * raio * 0.5},${cy - Math.cos(ah) * raio * 0.5} M${cx},${cy} L${cx + Math.sin(am) * raio * 0.8},${cy - Math.cos(am) * raio * 0.8}" stroke="${T}" stroke-width="4" stroke-linecap="round"/>`;
      k++;
    }
    // relógio cuco grande
    s += `<rect x="1880" y="200" width="100" height="160" fill="#5A3A28" ${ST}/>`;
    // porta da rua (esquerda) com sino
    s += `<rect x="120" y="560" width="290" height="640" fill="#3A2A20" ${ST}/>`;
    // porta dos fundos (direita)
    s += `<rect x="1690" y="640" width="240" height="560" fill="#6E4E36" ${ST}/><rect x="1730" y="600" width="160" height="34" rx="6" fill="#2B4A3A"/><text x="1810" y="626" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="26" fill="#fff">FUNDOS</text><circle cx="1710" cy="930" r="12" fill="#F2C14E" ${ST}/>`;
    // Seu Aurélio atrás do balcão, mão estendida
    s += poe(pessoa(GENTE2.aurelio), REL.aurelio, 1520, 0.55, true);
    // balcão de vidro
    s += `<rect x="760" y="1180" width="820" height="400" fill="#7A5C36" ${ST}/><rect x="740" y="1150" width="860" height="40" fill="#5A3A28" ${ST}/><rect x="790" y="1230" width="760" height="300" fill="#BFE0EA" opacity=".55" ${ST}/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${850 + i * 120}" cy="1380" r="30" fill="#F2D7A0" stroke="#8A6A40" stroke-width="5"/>`;
    s += `<rect x="-100" y="-300" width="2200" height="2700" fill="#9FB8D0" opacity=".14"/>`;
    return s;
  }, []);
  // foto embaixo do relógio de bolso
  const foto = fotoTirada ? '' : `<g transform="translate(${REL.foto.x},${REL.foto.y}) rotate(-8)"><rect x="-46" y="-30" width="92" height="66" fill="#FFF8EC" ${ST}/><rect x="-38" y="-22" width="76" height="44" fill="#7FA9BE"/><circle cx="0" cy="-2" r="8" fill="#B9805C"/></g>`;
  // relógio de bolso (ponteiro andando)
  const b = REL.bolso;
  const ang = ponteiro * 6;
  const bolso = `<g transform="translate(${b.x},${b.y})"><path d="M20,-36 C60,-60 90,-30 110,-6" stroke="#C9A04A" stroke-width="5" fill="none"/><circle r="40" fill="#E2B85C" ${ST}/><circle r="32" fill="#FFF8EC" stroke="#8A6A40" stroke-width="3"/><rect x="-6" y="-50" width="12" height="12" rx="3" fill="#E2B85C" ${ST}/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="-1.5" y="-30" width="3" height="${i % 3 ? 4 : 7}" fill="${T}" transform="rotate(${i * 30})"/>`).join('')}
    <path d="M0,0 L${Math.sin((4.78 / 12) * 2 * Math.PI) * 15},${-Math.cos((4.78 / 12) * 2 * Math.PI) * 15}" stroke="${T}" stroke-width="3"/><path d="M0,0 L${Math.sin((47 / 60) * 2 * Math.PI) * 24},${-Math.cos((47 / 60) * 2 * Math.PI) * 24}" stroke="${T}" stroke-width="2.5"/>
    <path d="M0,0 L0,-27" stroke="#D9483B" stroke-width="1.6" transform="rotate(${ang})"/><circle r="3" fill="#D9483B"/></g>`;
  // porta da rua abrindo + sombra comprida no chão
  const luz = portaAbre > 0 ? `<path d="M410,1200 L${410 + 900 * portaAbre},1900 L${120 + 200 * portaAbre},1900 L120,1200Z" fill="#FFF3C4" opacity="${0.55 * portaAbre}"/>` : '';
  const porta = `<g transform="translate(120,560) scale(${1 - 0.8 * portaAbre},1)"><rect width="290" height="640" fill="#6E4E36" ${ST}/><rect x="40" y="60" width="210" height="260" fill="#A9CADB" ${ST}/><circle cx="260" cy="350" r="12" fill="#F2C14E" ${ST}/></g>`;
  const somb = sombra > 0 ? `<path d="M300,1220 C380,1300 ${380 + 600 * sombra},${1500 + 300 * sombra} ${420 + 700 * sombra},${1600 + 300 * sombra} L${330 + 700 * sombra},${1640 + 300 * sombra} C${300 + 500 * sombra},${1500 + 250 * sombra} 260,1320 240,1230Z" fill="#1B1410" opacity="${0.6 * sombra}"/>` : '';
  const sino = `<g transform="translate(${REL.sino.x},${REL.sino.y - 80}) rotate(${sinoBalanca})"><path d="M0,0 L0,40" stroke="#5A3A28" stroke-width="5"/><path d="M-30,80 C-30,40 30,40 30,80 L38,92 L-38,92Z" fill="#E2B85C" ${ST}/><circle cx="0" cy="98" r="8" fill="#C9A04A" ${ST}/></g>`;
  const rose = poe(roseVivo(t, {expr: roseExpr, andando: roseAndando}), roseX, 1900, 0.55);
  return <Svg W={2000} H={1920} html={fundo + luz + porta + sino + somb + foto + bolso + rose} />;
};

// ------------------------------------------------------------ FOTO (frente e verso, em close)
export const FotoClose: React.FC<{verso: boolean; giro: number; letra: number; tremor: number}> = ({verso, giro, letra, tremor}) => {
  const fr = React.useMemo(() => {
    let s = `<rect width="1080" height="1920" fill="#5A3A28"/>`;
    for (let y = 0; y < 1920; y += 60) s += `<path d="M0,${y} L1080,${y + 30}" stroke="#4A2E1E" stroke-width="6" opacity=".6"/>`;
    return s;
  }, []);
  const esc = Math.abs(Math.cos(giro * Math.PI));
  const cena = `<rect x="-300" y="-220" width="600" height="420" fill="#BFD7E6"/><rect x="-300" y="60" width="600" height="140" fill="#B9B2A6"/>
    <rect x="-40" y="-200" width="300" height="260" fill="#E4DED2" stroke="#8C949C" stroke-width="3"/>${Array.from({length: 12}, (_, i) => `<rect x="${-20 + (i % 4) * 70}" y="${-180 + Math.floor(i / 4) * 70}" width="44" height="44" fill="#9FC4D6"/>`).join('')}
    <rect x="40" y="0" width="120" height="60" fill="#7FA9BE"/>
    <g transform="translate(-90,-60) scale(0.15)">${roseVivo(0.4, {expr: 'feliz', piscar: false})}</g>
    <circle cx="-118" cy="-62" r="22" fill="none" stroke="#D9483B" stroke-width="5"/>`;
  const frente = `<g><rect x="-340" y="-300" width="680" height="640" fill="#FFF8EC" ${ST}/><g transform="translate(0,-20)">${cena}</g>
    <text x="230" y="300" text-anchor="end" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="40" fill="#D96C4A">SEG · 16:46</text></g>`;
  const frase = 'Volto pra buscar o relógio.';
  const verso_ = `<g><rect x="-340" y="-300" width="680" height="640" fill="#F4EDE1" ${ST}/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-300,${-180 + i * 80} L300,${-180 + i * 80}" stroke="#D8CDB8" stroke-width="3"/>`).join('')}
    <text x="-290" y="-20" font-family="Caveat, cursive" font-weight="600" font-size="84" fill="#2B2B6B">${frase.slice(0, Math.ceil(frase.length * letra)).slice(0, 17)}</text>
    <text x="-290" y="80" font-family="Caveat, cursive" font-weight="600" font-size="84" fill="#2B2B6B">${frase.slice(0, Math.ceil(frase.length * letra)).slice(17)}</text></g>`;
  const tx = tremor ? Math.sin(giro * 90) * 0 : 0;
  return <Svg W={1080} H={1920} html={fr + `<g transform="translate(${540 + tx},900) rotate(${-4 + tremor}) scale(${esc * 1.3},1.3)">${verso ? verso_ : frente}</g>`} />;
};

// ------------------------------------------------------------ MAPA do rastro (padaria → praça → ponte → rua de trás → relojoaria)
export const MapaRastro: React.FC<{prog: number}> = ({prog}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect x="-200" y="-400" width="1500" height="2700" fill="#EDE3CF"/>`;
    for (let x = -40; x < 1100; x += 260) for (let y = 200; y < 1900; y += 300) s += `<rect x="${x + 50}" y="${y + 50}" width="200" height="220" rx="16" fill="${['#F2C14E', '#7FB98A', '#E89A7A', '#B9A7DB'][((x + 40) / 260 + (y - 200) / 300) & 3]}" opacity=".5" ${ST}/>`;
    s += `<path d="M-200,1060 C200,1000 700,1140 1300,1040" stroke="#7EC8E3" stroke-width="70" fill="none" opacity=".9"/>`;
    const lugares: [number, number, string][] = [[120, 380, 'PADARIA'], [640, 690, 'PRAÇA'], [380, 1060, 'PONTE'], [780, 1380, 'RUA DE TRÁS'], [250, 1700, 'RELOJOARIA']];
    for (const [x, y, n] of lugares) s += `<rect x="${x - 10}" y="${y - 44}" width="${n.length * 22 + 20}" height="54" rx="10" fill="#fff" ${ST}/><text x="${x}" y="${y}" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="38" fill="${T}">${n}</text>`;
    return s;
  }, []);
  const rota = 'M160,420 L160,520 L640,520 L640,740 L420,740 L420,1080 L780,1080 L780,1420 L300,1420 L300,1740';
  const comp = 3200;
  return <Svg W={1080} H={1920} html={fundo + `<path d="${rota}" stroke="#D96C4A" stroke-width="14" fill="none" stroke-dasharray="${comp}" stroke-dashoffset="${comp * (1 - prog)}" stroke-linecap="round" stroke-linejoin="round"/>` + (prog > 0.97 ? `<g transform="translate(300,1740)"><path d="M0,0 C-40,-60 -50,-90 -50,-110 C-50,-150 50,-150 50,-110 C50,-90 40,-60 0,0Z" fill="#D96C4A" ${ST}/><circle cx="0" cy="-110" r="20" fill="#fff"/></g>` : '')} />;
};
