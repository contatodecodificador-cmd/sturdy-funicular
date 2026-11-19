import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from './theme';
import {Cena, Espaco, P, PE, SEG, useT, Rotulo} from './ui';
import {mercator, orto} from './geo';
import {Mapa, Pin, Seta, Globo, Vulcao, Ceu, Estrela, Faixas, Predio, Linha, prog, sm, lerp, pt, clamp01} from './prims';

// deslocamento que leva o Nordeste (Cabo de São Roque) até o Golfo da Guiné, numa projeção dada
const encaixe = (center: [number, number], scale: number) => {
  const p = mercator(center, scale);
  const a = p([-35.2, -5.4]); const b = p([-9.0, 4.6]);
  return [b[0] - a[0], b[1] - a[1]] as [number, number];
};
const PANG: {c: [number, number]; s: number} = {c: [-12, -8], s: 620};

const Cidades: React.FC<{proj: any; op: number}> = ({proj, op}) => (
  <g opacity={op}>
    <Pin p={pt(proj, -34.9, -8.05)} label="RECIFE" size={18} />
    <Pin p={pt(proj, -35.2, -5.8)} label="NATAL" size={18} />
    <Pin p={pt(proj, -38.5, -12.97)} label="SALVADOR" size={18} />
    <Pin p={pt(proj, -43.2, -22.9)} label="RIO" size={18} />
  </g>
);

const Texto: React.FC<{y: number; children: React.ReactNode; cor?: string; size?: number; op?: number}> = ({y, children, cor = C.info, size = 40, op = 1}) => (
  <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: cor, opacity: op, letterSpacing: 1}}>{children}</div>
);

// ============ INTRO ============
const Intro: React.FC = () => {
  const t = useT();
  const v = encaixe(PANG.c, PANG.s);
  const a = P(1), b = P(2), third = (b - a) / 3;
  const kSky = prog(t, a + third, a + third + 3);
  return (
    <>
      <Cena from={0} to={a} zoom={0.06}>
        <Mapa center={PANG.c} scale={PANG.s} sa={v} semMar={1} extra={(pr) => <Cidades proj={pr} op={clamp01((t - 2) / 1.5)} />} />
      </Cena>
      <Cena from={a} to={a + third} fade={0.3}>
        <Mapa center={[-45, -4]} scale={2300} extra={(pr) => {
          const pts = [[-51.5, 1.8], [-48.5, -0.6], [-44.3, -2.5], [-40, -4.6], [-36.6, -6.6], [-34.6, -7.2]].map(([x, y]) => pt(pr, x, y));
          const d = 'M' + pts.map((p) => p.join(',')).join(' L');
          const k = prog(t, a + 0.3, a + third);
          return <g><path d={d} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={95} strokeLinecap="round" strokeDasharray={`${k * 2000} 3000`} /><path d={d} fill="none" stroke={C.impacto} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="8 8" /></g>;
        }} />
      </Cena>
      <Cena from={a + third} to={a + 2 * third} fade={0.3}>
        <Ceu><g opacity={kSky}><line x1={940} y1={330} x2={980} y2={330} stroke={C.impacto} strokeWidth={3} /><line x1={960} y1={310} x2={960} y2={350} stroke={C.impacto} strokeWidth={3} /></g><Estrela x={962} y={332} r={3.5} brilho={kSky} /></Ceu>
      </Cena>
      <Cena from={a + 2 * third} to={b} fade={0.3}>
        <Vulcao erosao={prog(t, a + 2 * third, b) * 0.8} regua={0} />
      </Cena>
      <Cena from={b} to={P(3)}>
        <Espaco />
        <Linha marcas={['HOJE', '100 ANOS', '10 MIL', '1 MILHÃO', '250 MILHÕES']} k={prog(t, b + 1, P(3) - 2)} />
      </Cena>
      <Cena from={P(3)} to={SEG(1).start}>
        <Mapa center={[-36, -5]} scale={lerp(1500, 4200, prog(t, P(3), SEG(1).start + 0.5))} extra={(pr) => <Pin p={pt(pr, -32.42, -3.85)} label="FERNANDO DE NORONHA" cor={C.impacto} />} />
      </Cena>
    </>
  );
};

// ============ BLOCO 1 — Noronha hoje ============
const B1: React.FC = () => {
  const t = useT();
  return (
    <Cena from={SEG(1).start} to={SEG(2).start} zoom={0.02}>
      <Vulcao zoomTopo={1 - prog(t, P(5), P(5) + 6)} regua={prog(t, P(5) + 3, P(5) + 6)} />
    </Cena>
  );
};

// ============ BLOCO 2 — eclipse 2045 ============
const B2: React.FC = () => {
  const t = useT();
  const s = SEG(2);
  return (
    <>
      <Cena from={s.start} to={P(11)}>
        <Mapa center={[-44, -4]} scale={2400} extra={(pr) => {
          const pts = [[-51.5, 1.8], [-48.5, -0.6], [-44.3, -2.5], [-40, -4.6], [-36.6, -6.6], [-34.6, -7.2]].map(([x, y]) => pt(pr, x, y));
          const d = 'M' + pts.map((p) => p.join(',')).join(' L');
          const k = prog(t, s.start + 1, P(9) + 6);
          const sl = pt(pr, -44.3, -2.53);
          return <g>
            <path d={d} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={100} strokeLinecap="round" strokeDasharray={`${k * 2200} 4000`} />
            <path d={d} fill="none" stroke={C.impacto} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="8 8" />
            <Pin p={sl} label="SÃO LUÍS  ≈ 4 MIN" cor={C.impacto} op={prog(t, P(9) + 4, P(9) + 5)} />
          </g>;
        }} />
      </Cena>
      <Cena from={P(11)} to={SEG(3).start}>
        <Espaco />
        <svg width={1920} height={1080}>
          {[['2045', 1], ['2046', 0], ['2059', 0], ['2071', 0], ['2075', 0]].map(([y, big], i) => {
            const op = prog(t, P(11) + i * 0.6, P(11) + i * 0.6 + 0.6);
            return <text key={i} x={360 + i * 300} y={570} textAnchor="middle" opacity={op} fill={big ? C.impacto : C.cinza} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: big ? 110 : 54}}>{y}</text>;
          })}
        </svg>
      </Cena>
    </>
  );
};

// ============ BLOCO 3 — Santos 2100 ============
const B3: React.FC = () => {
  const t = useT();
  const s = SEG(3);
  const k = prog(t, P(14), P(14) + 6);
  const x0 = 360, x1 = 1560, y0 = 820, sc = 9; // 1 cm = 9 px
  return (
    <>
      <Cena from={s.start} to={P(16)}>
        <Espaco dim={0.6} />
        <svg width={1920} height={1080}>
          <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.cinza} strokeOpacity={0.6} />
          {[0, 10, 20, 30, 40, 50].map((c) => <g key={c}><line x1={x0} y1={y0 - c * sc} x2={x1} y2={y0 - c * sc} stroke="#fff" strokeOpacity={0.06} /><Rotulo x={x0 - 20} y={y0 - c * sc + 7} anchor="end" size={18} cor={C.cinza}>{c} CM</Rotulo></g>)}
          <Rotulo x={x0} y={y0 + 40} size={20} cor={C.cinza}>2000</Rotulo><Rotulo x={x1} y={y0 + 40} anchor="end" size={20} cor={C.cinza}>2100</Rotulo>
          <polygon points={`${x0},${y0} ${lerp(x0, x1, k)},${y0 - 45 * sc * k} ${lerp(x0, x1, k)},${y0 - 27 * sc * k}`} fill={C.perigo} opacity={0.35} />
          <line x1={x0} y1={y0} x2={lerp(x0, x1, k)} y2={y0 - 36 * sc * k} stroke={C.perigo} strokeWidth={3} />
          <circle cx={lerp(x0, x1, k)} cy={y0 - 36 * sc * k} r={7} fill={C.perigo} />
          <Rotulo x={x1 - 10} y={y0 - 45 * sc - 20} anchor="end" size={24} cor={C.perigo} op={prog(t, P(14) + 6, P(14) + 7)}>SANTOS: +27 A +45 CM</Rotulo>
          <Rotulo x={x1 - 10} y={y0 - 45 * sc - 60} anchor="end" size={22} cor={C.dado} op={prog(t, P(15), P(15) + 1)}>MUNDO: ~30 CM A ~1 M</Rotulo>
        </svg>
      </Cena>
      <Cena from={P(16)} to={SEG(4).start}>
        <Espaco dim={0.6} />
        <svg width={1920} height={1080}>
          {/* régua */}
          <line x1={1100} y1={880} x2={1100} y2={880 - 60 * 9} stroke={C.info} strokeOpacity={0.6} />
          {[0, 15, 30, 45, 60].map((c) => <g key={c}><line x1={1085} y1={880 - c * 9} x2={1115} y2={880 - c * 9} stroke={C.info} /><Rotulo x={1130} y={880 - c * 9 + 8} size={22} cor={c === 45 ? C.perigo : C.cinza}>{c} CM</Rotulo></g>)}
          {/* cadeira */}
          <g fill="none" stroke={C.info} strokeWidth={6} strokeLinecap="round" opacity={0.85}>
            <line x1={820} y1={880} x2={820} y2={475} /><line x1={820} y1={475 + 0} x2={820} y2={475} />
            <line x1={820} y1={475} x2={820} y2={880 - 45 * 9} />
            <line x1={820} y1={880 - 45 * 9} x2={1020} y2={880 - 45 * 9} />
            <line x1={1010} y1={880 - 45 * 9} x2={1010} y2={880} />
            <line x1={820} y1={880 - 45 * 9} x2={820} y2={880 - 95 * 9 / 1.3} />
          </g>
          <rect x={0} y={880 - 45 * 9 * prog(t, P(16) + 2, P(16) + 6)} width={1920} height={45 * 9 * prog(t, P(16) + 2, P(16) + 6) + 200} fill="#1f6f8b" opacity={0.45} />
          <line x1={0} y1={880} x2={1920} y2={880} stroke={C.cinza} strokeOpacity={0.5} />
        </svg>
      </Cena>
    </>
  );
};

// ============ BLOCO 4 — Itaipu ============
const B4: React.FC = () => {
  const t = useT();
  const s = SEG(4);
  const k = prog(t, P(19), P(22) + 3);
  const sedY = lerp(900, 640, k);
  const ano = Math.round(lerp(1982, 2176, k));
  return (
    <Cena from={s.start} to={SEG(5).start}>
      <Espaco dim={0.5} />
      <svg width={1920} height={1080}>
        <defs><linearGradient id="lago" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a7ea0" /><stop offset="100%" stopColor="#0b2d4a" /></linearGradient></defs>
        <path d="M 200 540 L 1500 540 L 1500 900 L 200 900 Q 150 700 200 540 Z" fill="url(#lago)" opacity={0.85} />
        <path d={`M 190 ${sedY} Q 700 ${sedY - 40} 1500 ${sedY + 10} L 1500 900 L 200 900 Z`} fill="#7a5a36" opacity={0.95} />
        {Array.from({length: 40}, (_, i) => { const x = 250 + ((i * 97) % 1200); const y = 520 + ((t * 40 + i * 53) % (sedY - 520)); return <circle key={i} cx={x} cy={y} r={2.5} fill="#c9a26b" opacity={0.6} />; })}
        <rect x={1500} y={420} width={110} height={480} fill="#8b95a8" />
        <Rotulo x={1555} y={400} anchor="middle" size={22} cor={C.cinza}>BARRAGEM</Rotulo>
        <line x1={150} y1={900} x2={1750} y2={900} stroke={C.cinza} strokeOpacity={0.5} />
        <text x={860} y={455} textAnchor="middle" fill={k >= 1 ? C.perigo : C.info} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 80}} opacity={prog(t, P(19), P(19) + 1)}>{ano}</text>
        <Rotulo x={860} y={495} anchor="middle" size={20} cor={C.cinza} op={prog(t, P(19), P(19) + 1)}>SEDIMENTO ACUMULADO NO LAGO</Rotulo>
      </svg>
    </Cena>
  );
};

// ============ BLOCO 5 — 2300 + Lençóis ============
const B5: React.FC = () => {
  const t = useT();
  const s = SEG(5);
  return (
    <>
      <Cena from={s.start} to={P(25)}>
        <Espaco dim={0.6} />
        <Faixas maxV={7} k={prog(t, P(24), P(24) + 6)} itens={[
          {rot: 'CORTANDO EMISSÕES', min: 0.3, max: 3.1, cor: C.impacto, txt: '0,3 A 3,1 M'},
          {rot: 'EMISSÕES MUITO ALTAS', min: 1.7, max: 6.8, cor: C.perigo, txt: '1,7 A 6,8 M'}]} />
      </Cena>
      <Cena from={P(25)} to={P(26)}>
        <Espaco dim={0.5} />
        <Predio andares={2} agua={sm(prog(t, P(25) + 1, P(25) + 6)) * 1.0} label="≈ 7 METROS" />
      </Cena>
      <Cena from={P(26)} to={SEG(6).start}>
        <Mapa center={[-43.6, -2.9]} scale={9000} extra={() => (
          <g>{Array.from({length: 14}, (_, i) => { const dx = (t - P(26)) * 6; return <path key={i} d={`M ${300 + (i % 7) * 230 + dx} ${380 + Math.floor(i / 7) * 220} q 60 -50 120 0`} fill="none" stroke="#e8d9b0" strokeWidth={5} opacity={0.7} />; })}
            <Rotulo x={960} y={900} anchor="middle" size={26} cor={C.info}>DUNAS ANDAM 4 A 25 M POR ANO →</Rotulo></g>
        )} />
      </Cena>
    </>
  );
};

// ============ VIRADA — calendário ============
const Virada: React.FC = () => {
  const t = useT();
  const s = SEG(6);
  const anos = [2026, 2045, 2100, 2176, 2300, 3000, 5000, 9000];
  return (
    <Cena from={s.start} to={SEG(7).start}>
      <Espaco />
      {anos.map((a, i) => {
        const t0 = s.start + 1 + i * 1.1; const k = prog(t, t0, t0 + 1.4, );
        if (t < t0 - 1.2) return null;
        return <div key={i} style={{position: 'absolute', left: 760, top: 300, width: 400, height: 460, borderRadius: 14, background: '#e9e4d8', boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          transform: `translate(${k * 900}px, ${-k * 500}px) rotate(${k * 40}deg)`, opacity: 1 - k, zIndex: 100 - i, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{position: 'absolute', top: 0, width: '100%', height: 80, background: C.perigo, borderRadius: '14px 14px 0 0'}} />
          <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120, color: '#1b2233', marginTop: 40}}>{a}</div>
        </div>;
      })}
    </Cena>
  );
};

// ============ BLOCO 6 — 2.000 anos ============
const B6: React.FC = () => {
  const t = useT();
  const s = SEG(7);
  return (
    <>
      <Cena from={s.start} to={P(31)}>
        <Espaco dim={0.6} />
        <Faixas maxV={22} k={prog(t, P(30), P(30) + 6)} itens={[
          {rot: 'AQUECIMENTO DE 2 °C', min: 2, max: 6, cor: C.dado, txt: '2 A 6 M'},
          {rot: 'AQUECIMENTO DE ~5 °C', min: 19, max: 22, cor: C.perigo, txt: '~20 M'}]} />
      </Cena>
      <Cena from={P(31)} to={SEG(8).start}>
        <Espaco dim={0.5} />
        <Predio andares={7} agua={sm(prog(t, P(31), P(31) + 4))} label="≈ 20 METROS" />
      </Cena>
    </>
  );
};

// ============ CÉU: blocos 7, 8 ============
const POLO0: [number, number] = [960, 330];
const DV: [number, number] = [1190, 300]; // Delta Velorum (posição didática)
const CAN: [number, number] = [1430, 250];
const B7e8: React.FC = () => {
  const t = useT();
  const s = SEG(8), e = SEG(10).start;
  const k1 = sm(prog(t, P(35), P(36) + 2));
  const k2 = sm(prog(t, P(38), P(38) + 6));
  const px = lerp(lerp(POLO0[0], DV[0], k1), CAN[0] - 190, k2), py = lerp(lerp(POLO0[1], DV[1], k1), CAN[1] + 20, k2);
  const circ = prog(t, P(35), P(35) + 2);
  return (
    <Cena from={s.start} to={e} zoom={0.03}>
      <Ceu>
        <circle cx={1300} cy={600} r={450} fill="none" stroke={C.dado} strokeOpacity={0.35 * circ} strokeDasharray="6 10" />
        <Estrela x={POLO0[0] + 30} y={POLO0[1] + 26} r={1.3} brilho={0.4} label="SIGMA OCTANTIS" lop={1 - k1} />
        <Estrela x={DV[0]} y={DV[1]} r={3} brilho={0.8} label="DELTA VELORUM" lop={prog(t, P(36), P(36) + 1)} />
        <Estrela x={CAN[0]} y={CAN[1]} r={5} brilho={1.3} label="CANOPUS" lop={prog(t, P(38), P(38) + 1)} />
        <g opacity={prog(t, s.start + 0.5, s.start + 2)}>
          <line x1={px - 22} y1={py} x2={px + 22} y2={py} stroke={C.impacto} strokeWidth={3} />
          <line x1={px} y1={py - 22} x2={px} y2={py + 22} stroke={C.impacto} strokeWidth={3} />
          <Rotulo x={px} y={py + 56} anchor="middle" size={18} cor={C.impacto}>POLO SUL DO CÉU</Rotulo>
        </g>
        <g opacity={prog(t, P(40), P(40) + 1) * (1 - prog(t, P(41) + 1, P(41) + 2))}>
          <path d={`M ${px} ${py - 40} Q ${(px + CAN[0]) / 2} ${py - 140} ${CAN[0]} ${CAN[1] - 30}`} fill="none" stroke={C.ouro} strokeWidth={2} strokeDasharray="6 6" />
          <Rotulo x={(px + CAN[0]) / 2} y={py - 150} anchor="middle" size={24} cor={C.ouro}>≈ 10° ≈ UM PUNHO FECHADO</Rotulo>
        </g>
      </Ceu>
    </Cena>
  );
};

// ============ BLOCO 9 — Alfa do Centauro ============
const B9: React.FC = () => {
  const t = useT();
  const s = SEG(10);
  const ly = lerp(4.4, 2.9, sm(prog(t, P(43), P(43) + 5)));
  const X = (v: number) => 300 + v * 280;
  return (
    <Cena from={s.start} to={SEG(11).start}>
      <Espaco />
      <svg width={1920} height={1080}>
        <line x1={X(0)} y1={600} x2={X(5)} y2={600} stroke={C.cinza} strokeOpacity={0.6} />
        {[0, 1, 2, 3, 4, 5].map((v) => <g key={v}><line x1={X(v)} y1={588} x2={X(v)} y2={612} stroke={C.cinza} /><Rotulo x={X(v)} y={650} anchor="middle" size={20} cor={C.cinza}>{v} A.L.</Rotulo></g>)}
        <Estrela x={X(0)} y={600} r={9} brilho={1.2} cor="#ffd27a" />
        <Rotulo x={X(0)} y={540} anchor="middle" size={22} cor={C.ouro}>SOL</Rotulo>
        <Estrela x={X(ly)} y={600} r={7} brilho={lerp(1, 1.6, (4.4 - ly) / 1.5)} cor="#fff6e0" />
        <Rotulo x={X(ly)} y={540} anchor="middle" size={22}>ALFA DO CENTAURO</Rotulo>
        <text x={X(ly)} y={480} textAnchor="middle" fill={C.impacto} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 44}}>{ly.toFixed(1).replace('.', ',')} ANOS-LUZ</text>
        <g opacity={prog(t, P(44), P(44) + 1)}>
          <rect x={X(0) + (X(2.9) - X(0)) * prog(t, P(44), P(45) + 3) * 0.02 + 20} y={700} width={36} height={16} rx={4} fill={C.dado} />
          <Rotulo x={960} y={790} anchor="middle" size={26} cor={C.dado}>DE CARRO, A 100 KM/H: ≈ 30 MILHÕES DE ANOS</Rotulo>
        </g>
      </svg>
    </Cena>
  );
};

// ============ BLOCO 10 — Eta Carinae ============
const B10: React.FC = () => {
  const t = useT();
  const s = SEG(11);
  const rot = -(t - s.start) * 6;
  return (
    <>
      <Cena from={s.start} to={P(48)}>
        <Espaco />
        <Globo rot={[50 + rot, -10]} scale={380} capNorte={prog(t, P(46) + 2, P(46) + 4)} />
        <Texto y={940} size={30} cor={C.cinza} op={prog(t, P(46) + 3, P(46) + 4)}>AO NORTE DE 30°N, ELA NUNCA NASCE</Texto>
      </Cena>
      <Cena from={P(48)} to={P(49)}>
        <Ceu><Estrela x={960} y={360} r={4 + 4 * sm(prog(t, P(48), P(48) + 3))} brilho={1 + 1.5 * sm(prog(t, P(48), P(48) + 3))} cor="#fff3d6" label="ETA CARINAE" /></Ceu>
      </Cena>
      <Cena from={P(49)} to={SEG(12).start}>
        <Espaco />
        <Globo rot={[55, 20]} scale={380} capNorte={1} destaqueSul={prog(t, P(49) + 1, P(49) + 3)} />
      </Cena>
    </>
  );
};

// ============ BLOCO 11 — era do gelo ============
const B11: React.FC = () => {
  const t = useT();
  const s = SEG(12);
  const k = prog(t, P(51), P(51) + 8);
  return (
    <>
      <Cena from={s.start} to={P(52)}>
        <Espaco dim={0.6} />
        <svg width={1920} height={1080}>
          <Rotulo x={300} y={300} size={20} cor={C.cinza}>TEMPERATURA (CICLOS GLACIAIS)</Rotulo>
          <path d={Array.from({length: 121}, (_, i) => { const x = 300 + i * 11; const y = 560 + 120 * Math.sin(i / 7.5) * (i < 70 ? 1 : 1) + 40 * Math.sin(i / 2.7); return `${i ? 'L' : 'M'}${x},${y}`; }).join(' ')} fill="none" stroke={C.dado} strokeWidth={3} strokeDasharray={`${k * 1600} 3000`} />
          <line x1={1000} y1={350} x2={1000} y2={800} stroke={C.ouro} strokeDasharray="6 6" />
          <Rotulo x={1000} y={330} anchor="middle" size={22} cor={C.ouro}>HOJE</Rotulo>
          <g opacity={prog(t, P(51) + 9, P(51) + 10)}><Seta a={[1100, 760]} b={[1500, 760]} cor={C.impacto} k={prog(t, P(51) + 9, P(51) + 12)} />
            <Rotulo x={1300} y={820} anchor="middle" size={24} cor={C.impacto}>CO₂ EMPURRA A PRÓXIMA ERA DO GELO</Rotulo></g>
        </svg>
      </Cena>
      <Cena from={P(52)} to={P(54)}>
        <Mapa center={[-50, -15]} scale={1050} plataforma={sm(prog(t, P(52) + 2, P(52) + 9))} />
        <Texto y={950} size={30} cor={C.impacto} op={prog(t, P(52) + 8, P(52) + 9)}>MAR ≈ 120 M MAIS BAIXO: TERRA NOVA NO LITORAL</Texto>
      </Cena>
      <Cena from={P(54)} to={SEG(13).start}>
        <Vulcao mar={lerp(0, 24, sm(prog(t, P(54), P(54) + 4)))} />
      </Cena>
    </>
  );
};

// ============ VIRADA MENOR ============
const ViradaMenor: React.FC = () => {
  const t = useT();
  const s = SEG(13);
  return (
    <Cena from={s.start} to={SEG(14).start}>
      <AbsoluteFill style={{background: C.bg0}} />
      <svg width={1920} height={1080}>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M 0 ${380 + i * 70} Q 960 ${360 + i * 70 + Math.sin(t * 0.8 + i) * 25} 1920 ${380 + i * 70}`} fill="none" stroke={i % 2 ? '#5a4a38' : C.ouro} strokeOpacity={0.5} strokeWidth={i % 3 === 0 ? 10 : 4} transform={`translate(${(t - s.start) * (i % 2 ? 12 : -12)},0)`} />)}
      </svg>
    </Cena>
  );
};

// ============ BLOCO 12 — 1 milhão de anos ============
const B12: React.FC = () => {
  const t = useT();
  const s = SEG(14);
  return (
    <>
      <Cena from={s.start} to={P(59)}>
        <Mapa center={[-25, 2]} scale={1050} sa={[-30 * prog(t, P(58), P(58) + 4), 0]} extra={(pr) => {
          const a = pt(pr, -35.2, -5.2), b = pt(pr, -16.8, 12.4);
          return <g>
            <Seta a={a} b={b} cor={C.ouro} k={prog(t, P(57), P(57) + 3)} />
            <Rotulo x={(a[0] + b[0]) / 2 + 30} y={(a[1] + b[1]) / 2 + 60} size={26} cor={C.ouro} op={prog(t, P(57) + 2, P(57) + 3)}>≈ 2.850 KM HOJE</Rotulo>
            <Rotulo x={(a[0] + b[0]) / 2 + 30} y={(a[1] + b[1]) / 2 + 100} size={30} cor={C.impacto} op={prog(t, P(58) + 2, P(58) + 3)}>+30 KM EM 1 MILHÃO DE ANOS</Rotulo>
          </g>;
        }} />
      </Cena>
      <Cena from={P(59)} to={P(60)}>
        <Espaco dim={0.6} />
        <svg width={1920} height={1080}>
          {(() => { const k = sm(prog(t, P(59) + 2, P(59) + 12)); const top = lerp(330, 380, k);
            return <g>
              <path d={`M 0 900 L 300 760 L 620 ${top + 80} L 900 ${top} L 1150 ${top + 60} L 1450 700 L 1920 820 L 1920 1000 L 0 1000 Z`} fill="#2f3b2a" stroke={C.ouro} strokeOpacity={0.6} strokeWidth={2} />
              <path d={`M 620 ${330 + 80} L 900 330 L 1150 ${330 + 60}`} fill="none" stroke={C.info} strokeOpacity={0.35 * k} strokeDasharray="6 8" strokeWidth={2} />
              <Rotulo x={900} y={290} anchor="middle" size={26} cor={C.perigo} op={k}>−10 A −40 M POR MILHÃO DE ANOS</Rotulo>
              <Rotulo x={960} y={960} anchor="middle" size={22} cor={C.cinza}>SERRA DO MAR (PERFIL)</Rotulo>
            </g>; })()}
        </svg>
      </Cena>
      <Cena from={P(60)} to={P(61)}>
        <Espaco />
        <svg width={1920} height={1080}>
          {(() => { const k = sm(prog(t, P(60) + 1, P(60) + 8)); const mx = lerp(1300, 1400, k);
            return <g>
              <circle cx={600} cy={540} r={150} fill="#1d4f7a" stroke={C.dado} strokeOpacity={0.6} />
              <circle cx={mx} cy={540} r={42} fill="#b8b8b8" />
              <line x1={760} y1={640} x2={mx} y2={640} stroke={C.cinza} strokeDasharray="6 6" />
              <Rotulo x={(760 + mx) / 2} y={690} anchor="middle" size={26} cor={C.impacto} op={k}>+38 KM</Rotulo>
              <Rotulo x={960} y={850} anchor="middle" size={28} cor={C.info} op={prog(t, P(60) + 8, P(60) + 9)}>DIA: +18 A 20 SEGUNDOS</Rotulo>
            </g>; })()}
        </svg>
      </Cena>
      <Cena from={P(61)} to={SEG(15).start}>
        <Espaco />
        {['ONÇA-PINTADA', 'CAPIVARA', 'MICO-LEÃO-DOURADO'].map((n, i) => {
          const fade = prog(t, P(61) + 7 + i * 0.8, P(61) + 10 + i * 0.8);
          return <div key={i} style={{position: 'absolute', top: 360 + i * 110, width: '100%', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 72, color: C.info,
            opacity: prog(t, P(61) + i * 0.6, P(61) + 1 + i * 0.6) * (1 - fade * 0.85), letterSpacing: 4 + fade * 30, filter: `blur(${fade * 4}px)`}}>{n}</div>;
        })}
      </Cena>
    </>
  );
};

// ============ BLOCO 13 — asteroide / Araguainha ============
const B13: React.FC = () => {
  const t = useT();
  const s = SEG(15);
  return (
    <>
      <Cena from={s.start} to={P(65)}>
        <Espaco />
        <svg width={1920} height={1080}>
          {(() => { const k = prog(t, s.start, s.start + 3.5); const x = lerp(1700, 700, k), y = lerp(150, 650, k);
            return <g><line x1={x + 300} y1={y - 150} x2={x} y2={y} stroke="#ffd9a0" strokeWidth={4} opacity={0.5} /><circle cx={x} cy={y} r={14} fill="#ffe2b0" /></g>; })()}
          <g opacity={prog(t, P(64), P(64) + 1)}>
            <text x={960} y={470} textAnchor="middle" fill={C.perigo} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64}}>1 KM → A CADA ~700 MIL ANOS</text>
          </g>
          <g opacity={prog(t, P(64) + 6, P(64) + 7)}>
            <text x={960} y={580} textAnchor="middle" fill={C.perigo} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64}}>10 KM → A CADA ~100 MILHÕES</text>
          </g>
        </svg>
      </Cena>
      <Cena from={P(65)} to={SEG(16).start}>
        <Mapa center={[-52.98, -16.78]} scale={lerp(1400, 6500, sm(prog(t, P(65), P(65) + 9)))} extra={(pr) => {
          const S = lerp(1400, 6500, sm(prog(t, P(65), P(65) + 9))); const c = pt(pr, -52.98, -16.78); const r = (20 / 111) * S * Math.PI / 180;
          return <g><circle cx={c[0]} cy={c[1]} r={Math.max(r, 8)} fill="none" stroke={C.perigo} strokeWidth={4} /><circle cx={c[0]} cy={c[1]} r={Math.max(r, 8) + 18} fill="none" stroke={C.perigo} strokeOpacity={0.4} strokeDasharray="5 6" />
            <Rotulo x={c[0] + Math.max(r, 8) + 30} y={c[1] + 8} size={24} cor={C.perigo}>ARAGUAINHA · ~40 KM</Rotulo></g>;
        }} />
      </Cena>
    </>
  );
};

// ============ BLOCO 14 — Noronha → Rocas ============
const B14: React.FC = () => {
  const t = useT();
  const s = SEG(16);
  return (
    <>
      <Cena from={s.start} to={P(69)}>
        <Vulcao erosao={sm(prog(t, s.start + 2, P(69)))} />
      </Cena>
      <Cena from={P(69)} to={SEG(17).start}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #1a6a8a 0%, #0a2a44 60%, #051526 100%)'}} />
        <svg width={1920} height={1080}>
          <ellipse cx={960} cy={540} rx={420} ry={300} fill="none" stroke="#bfe9e0" strokeWidth={46} opacity={0.75} />
          <ellipse cx={960} cy={540} rx={420} ry={300} fill="none" stroke={C.impacto} strokeWidth={6} opacity={0.9} />
          <ellipse cx={960} cy={540} rx={370} ry={255} fill="#2ea3b5" opacity={0.35} />
          <Rotulo x={960} y={920} anchor="middle" size={28} cor={C.info}>ATOL DAS ROCAS — VISTO DE CIMA</Rotulo>
        </svg>
      </Cena>
    </>
  );
};

// ============ BLOCO 15 — Amazonas ============
const RIO: [number, number][] = [[-73.2, -4.4], [-70, -3.8], [-67, -3.3], [-63.5, -3.4], [-60.0, -3.1], [-57.5, -2.6], [-54.7, -2.4], [-52, -1.6], [-50, -0.6]];
const B15: React.FC = () => {
  const t = useT();
  const s = SEG(17);
  const kLagos = prog(t, P(72), P(72) + 3), kRio = prog(t, P(73), P(73) + 5);
  return (
    <Cena from={s.start} to={SEG(18).start}>
      <Mapa center={[-60, -4]} scale={1700} extra={(pr) => {
        const d = 'M' + RIO.map(([x, y]) => pt(pr, x, y).join(',')).join(' L');
        return <g>
          <g opacity={kLagos * (1 - kRio * 0.8)}>
            {[[-72, -4], [-69, -2], [-66, -5], [-70, -6], [-67, -1]].map(([x, y], i) => { const p = pt(pr, x, y); return <ellipse key={i} cx={p[0]} cy={p[1]} rx={70} ry={38} fill="#2a7ea0" opacity={0.7} />; })}
            <Seta a={pt(pr, -69, -1)} b={pt(pr, -68, 9)} cor={C.dado} k={kLagos} />
            <Rotulo x={pt(pr, -68, 9)[0] + 20} y={pt(pr, -68, 9)[1]} size={24} cor={C.dado}>RUMO AO CARIBE</Rotulo>
          </g>
          <path d={d} fill="none" stroke="#5fc3e8" strokeWidth={8} strokeLinecap="round" strokeDasharray={`${kRio * 2600} 4000`} />
        </g>;
      }} />
    </Cena>
  );
};

// ============ BLOCO 16 — Gibraltar ============
const B16: React.FC = () => {
  const t = useT();
  const s = SEG(18);
  return (
    <>
      <Cena from={s.start} to={P(78)}>
        <Espaco />
        <Globo rot={[25, -25]} scale={470} />
        <svg width={1920} height={1080} style={{position: 'absolute'}}>
          {(() => { const pr = orto([25, -25], 470); const g = pt(pr, -5.6, 36);
            const k = sm(prog(t, P(76), P(77) + 4));
            return <g><path d={`M ${g[0] - 20} ${g[1] - 60 - 120 * k} A ${60 + 140 * k} ${60 + 140 * k} 0 0 0 ${g[0] - 20} ${g[1] + 60 + 120 * k}`} fill="none" stroke={C.perigo} strokeWidth={6} opacity={prog(t, s.start + 2, s.start + 4)} />
              <Pin p={g} label="GIBRALTAR" cor={C.perigo} op={prog(t, s.start + 1, s.start + 2)} /></g>; })()}
        </svg>
      </Cena>
      <Cena from={P(78)} to={SEG(19).start}>
        <Mapa center={[-25, 0]} scale={850} sa={[-90 * sm(prog(t, P(78) + 2, P(78) + 10)), 15 * sm(prog(t, P(78) + 2, P(78) + 10))]} extra={(pr) => <Rotulo x={pt(pr, -30, 8)[0]} y={pt(pr, -30, 8)[1]} size={34} cor={C.dado} op={prog(t, P(78) + 4, P(78) + 5)}>+1.500 KM</Rotulo>} />
      </Cena>
    </>
  );
};

// ============ BLOCO 17 — Pangeia Próxima ============
const B17: React.FC = () => {
  const t = useT();
  const s = SEG(19);
  const v = encaixe(PANG.c, PANG.s);
  const k = sm(prog(t, P(81), P(82) + 3));
  const kSep = sm(prog(t, P(80), P(80) + 6));
  // passado: começa encaixado e se separa; futuro: volta a encaixar
  const sa: [number, number] = t < P(81) ? [v[0] * (1 - kSep), v[1] * (1 - kSep)] : [v[0] * k, v[1] * k];
  return (
    <Cena from={s.start} to={SEG(20).start} zoom={0.03}>
      <Mapa center={PANG.c} scale={PANG.s} sa={sa} semMar={prog(t, P(82), P(82) + 3)} calor={prog(t, P(83) + 4, P(83) + 8) * (1 - 0.6 * prog(t, P(84), P(84) + 3))}
        extra={(pr) => <Cidades proj={pr} op={prog(t, P(82), P(82) + 1.5)} />} />
      <Texto y={140} size={26} cor={C.cinza} op={t < P(81) ? prog(t, P(80), P(80) + 1) : 0}>HÁ ~100 MILHÕES DE ANOS: A SEPARAÇÃO</Texto>
    </Cena>
  );
};

// ============ FECHO ============
const Gnaisse: React.FC<{k: number}> = ({k}) => (
  <svg width={1920} height={1080}>
    <rect width={1920} height={1080} fill="#2b2620" />
    {Array.from({length: 26}, (_, i) => <path key={i} d={Array.from({length: 41}, (_, j) => `${j ? 'L' : 'M'}${j * 48},${i * 44 + 20 * Math.sin(j / 3 + i * 0.7) + 10 * Math.sin(j / 1.3 + i)}`).join(' ')} fill="none" stroke={i % 3 === 0 ? '#d8cfc0' : i % 3 === 1 ? '#5b4f43' : '#8c7a64'} strokeWidth={i % 3 === 0 ? 10 : 16} opacity={0.75} />)}
    <rect width={1920} height={1080} fill="#000" opacity={k} />
  </svg>
);
const Fecho: React.FC<{fim: number}> = ({fim}) => {
  const t = useT();
  const s = SEG(20);
  const v = encaixe(PANG.c, PANG.s);
  return (
    <>
      <Cena from={s.start} to={P(86)}>
        <Mapa center={PANG.c} scale={PANG.s} sa={v} semMar={1} extra={(pr) => {
          const p = pt(pr, -32.42, -3.85);
          return <g opacity={1 - prog(t, P(85) + 6, P(85) + 10)}><circle cx={p[0]} cy={p[1]} r={16} fill="none" stroke={C.impacto} strokeWidth={3} strokeDasharray="5 5" />
            <Rotulo x={p[0] + 30} y={p[1] + 8} size={26} cor={C.impacto}>NORONHA?</Rotulo></g>;
        }} />
      </Cena>
      <Cena from={P(86)} to={P(87)}>
        <AbsoluteFill style={{transform: `scale(${lerp(1.25, 1, prog(t, P(86), P(86) + 10))})`}}><Gnaisse k={prog(t, P(86) + 12, P(87))} /></AbsoluteFill>
      </Cena>
      <Cena from={P(87)} to={P(88)}>
        <Mapa center={[-52, -14]} scale={1000} />
      </Cena>
      <Cena from={P(88)} to={fim - 0.3}>
        <Vulcao por={1} regua={0} />
      </Cena>
      <Cena from={fim} to={fim + 30}>
        <Espaco />
      </Cena>
    </>
  );
};

export const Cenas: React.FC<{fim: number}> = ({fim}) => (
  <>
    <Intro /><B1 /><B2 /><B3 /><B4 /><B5 /><Virada /><B6 /><B7e8 /><B9 /><B10 /><B11 /><ViradaMenor /><B12 /><B13 /><B14 /><B15 /><B16 /><B17 /><Fecho fim={fim} />
  </>
);
