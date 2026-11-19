import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from './theme';
import {useT, Cena, Caixa} from './ui';
import {prog, sm, clamp01} from './prims';
import {Lua, Estrelas, Rio, EspacoReal, MapaReal, Tag, K, lerp, rnd} from './piloto';

// ---------- cais de São Luís com régua de maré e barcos ----------
const Barco: React.FC<{x: number; y: number; incl: number; cor: string; vela?: boolean; s?: number}> = ({x, y, incl, cor, vela, s = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${incl}) scale(${s})`}>
    <path d="M-120,-20 L120,-20 Q100,26 0,30 Q-100,26 -120,-20 Z" fill={cor} />
    <path d="M-120,-20 L120,-20" stroke="#f1e9d8" strokeWidth={5} />
    <rect x={-40} y={-50} width={60} height={30} fill="#e8dcc4" />
    <rect x={-30} y={-44} width={14} height={12} fill="#2a3a52" />
    {vela && <><line x1={40} y1={-20} x2={40} y2={-170} stroke="#2b2118" strokeWidth={5} /><path d="M44,-165 L44,-34 L130,-40 Z" fill="#c8553d" opacity={0.92} /></>}
  </g>
);
export const Cais: React.FC<{nivel: number; luz?: number; lama?: number}> = ({nivel, luz = 0.35, lama = 0}) => {
  const t = useT();
  const y0 = 900, mpx = 70; // nível 0 m em y0; 70 px por metro
  const wy = y0 - nivel * mpx;
  const deitado = clamp01((y0 - 60 - wy) / -60 + 1) ; // perto do fundo → deita
  return (
    <AbsoluteFill style={{background: `linear-gradient(#060b18, rgb(${lerp(10, 30, luz)},${lerp(18, 44, luz)},${lerp(34, 78, luz)}))`}}>
      <AbsoluteFill style={{opacity: 0.8}}><Estrelas k={0.6} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        {/* casario ao fundo */}
        {Array.from({length: 16}, (_, i) => <rect key={i} x={i * 128} y={330 - (i % 4) * 22} width={120} height={140 + (i % 4) * 22} fill={`rgb(${lerp(18, 50, luz)},${lerp(24, 60, luz)},${lerp(40, 92, luz)})`} />)}
        {Array.from({length: 30}, (_, i) => <rect key={'j' + i} x={20 + (i % 15) * 128 + (i > 14 ? 60 : 0)} y={360 + (i > 14 ? 50 : 0)} width={14} height={18} fill="#ffcf8a" opacity={rnd(i + 40) > 0.4 ? 0.7 : 0} />)}
        {/* lama do fundo da baía */}
        <path d={`M0,${y0 + 40} Q600,${y0 + 10} 1200,${y0 + 30} T1920,${y0 + 20} L1920,1080 L0,1080 Z`} fill="#3b2f25" />
        {/* água */}
        <rect y={wy} width={1920} height={1080 - wy} fill="rgba(30,58,84,0.92)" />
        {Array.from({length: 18}, (_, i) => <rect key={'o' + i} x={((i * 173 - t * 30) % 2000 + 2000) % 2000 - 80} y={wy + 14 + (i % 6) * 26} width={70} height={2.5} rx={1} fill="#cfe2ff" opacity={0.18} />)}
        {/* barcos (deitam quando a água some) */}
        <Barco x={760} y={Math.min(wy + 6, y0 + 22)} incl={lerp(0, 12, deitado)} cor="#1f6f8b" vela />
        <Barco x={1240} y={Math.min(wy + 8, y0 + 26)} incl={lerp(0, -10, deitado)} cor="#b5452b" s={0.85} />
        {/* cais de pedra com régua de maré */}
        <rect x={0} y={420} width={330} height={660} fill="#4a4740" />
        {Array.from({length: 24}, (_, i) => <rect key={'p' + i} x={(i % 3) * 110 + ((Math.floor(i / 3)) % 2) * 50 - 30} y={420 + Math.floor(i / 3) * 84} width={104} height={80} fill="none" stroke="#2f2d29" strokeWidth={3} />)}
        <rect x={250} y={y0 - 8 * mpx} width={40} height={8 * mpx} fill="#f2ede0" />
        {Array.from({length: 9}, (_, m) => (
          <g key={'m' + m}>
            <rect x={250} y={y0 - m * mpx - 3} width={m % 2 ? 22 : 40} height={6} fill="#c0392b" />
            <text x={238} y={y0 - m * mpx + 8} textAnchor="end" fill="#fff" style={{fontFamily: F.titulo, fontSize: 26}}>{m}</text>
          </g>
        ))}
        {lama > 0 && <path d={`M330,${y0 + 30} Q900,${y0 + 6} 1920,${y0 + 22}`} stroke="#5a4636" strokeWidth={10} fill="none" opacity={lama} />}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- onda gigante (mito) ----------
const OndaMito: React.FC<{k: number; x: number}> = ({k, x}) => (
  <svg width={1920} height={1080}>
    <rect width={1920} height={1080} fill="#0b1630" />
    <rect y={760} width={1920} height={320} fill="#d8c08f" />
    {Array.from({length: 9}, (_, i) => <rect key={i} x={1000 + i * 100} y={520 - (i % 3) * 60} width={84} height={240 + (i % 3) * 60} fill="#2a3550" />)}
    {Array.from({length: 40}, (_, i) => <rect key={'w' + i} x={1012 + (i % 9) * 100 + (i > 17 ? 40 : 0)} y={560 + Math.floor(i / 9) * 50} width={14} height={18} fill="#ffcf8a" opacity={0.75} />)}
    <g transform={`translate(${x},0)`}>
      <path d={`M-900,1080 L-900,${760 - 520 * k} Q-300,${760 - 600 * k} 0,${760 - 420 * k} Q120,${760 - 300 * k} 40,${760 - 200 * k} Q-40,${760 - 260 * k} -80,${760 - 160 * k} Q20,${760 - 40 * k} 160,760 L160,1080 Z`} fill="#1f4f7a" />
      <path d={`M-900,${760 - 520 * k} Q-300,${760 - 600 * k} 0,${760 - 420 * k} Q120,${760 - 300 * k} 40,${760 - 200 * k}`} stroke="#e9f4ff" strokeWidth={14} fill="none" />
    </g>
  </svg>
);
// ---------- perfil do oceano (maré < 1 m) ----------
const Perfil: React.FC<{bojo: number}> = ({bojo}) => {
  const R = 1600, cx = 960, cy = 520 + R;
  const pts = Array.from({length: 121}, (_, i) => {
    const a = -0.6 + (i / 120) * 1.2, r = R + 40 + bojo * 46 * Math.cos(a * 2.6) ** 2;
    return `${cx + Math.sin(a) * r},${cy - Math.cos(a) * r}`;
  }).join(' ');
  return (
    <svg width={1920} height={1080}>
      <circle cx={cx} cy={cy} r={R} fill="#0c2846" />
      <circle cx={cx} cy={cy} r={R - 140} fill="#2a2016" />
      <polyline points={pts} fill="none" stroke="#5fb3e8" strokeWidth={6} />
      <polygon points={`${pts} ${cx + Math.sin(0.6) * R},${cy - Math.cos(0.6) * R} ${cx - Math.sin(0.6) * R},${cy - Math.cos(0.6) * R}`} fill="#1f5c99" opacity={0.9} />
      <line x1={cx} y1={cy - R - 40} x2={cx} y2={cy - R - 40 - 46 * bojo} stroke={C.ouro} strokeWidth={4} />
    </svg>
  );
};
// ---------- diagrama de maré (Sol, Terra, Lua) ----------
const DiagMare: React.FC<{angLua: number; bojoL: number; bojoS: number; solOn?: number; luaOn?: number}> = ({angLua, bojoL, bojoS, solOn = 1, luaOn = 1}) => {
  const ex = 1100, ey = 560, R = 120;
  const pts = Array.from({length: 181}, (_, i) => {
    const a = (i / 180) * Math.PI * 2;
    const r = R + 18 + bojoL * 40 * Math.cos(a - angLua) ** 2 + bojoS * 18 * Math.cos(a - Math.PI) ** 2;
    return `${ex + Math.cos(a) * r},${ey + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg width={1920} height={1080}>
      <defs><radialGradient id="sol"><stop offset="0%" stopColor="#fff6c8" /><stop offset="55%" stopColor="#ffb23e" /><stop offset="100%" stopColor="#ff8a00" stopOpacity={0} /></radialGradient></defs>
      <circle cx={140} cy={560} r={200 * solOn} fill="url(#sol)" opacity={solOn} />
      <polygon points={pts} fill="#2f7bc4" opacity={0.55} />
      <circle cx={ex} cy={ey} r={R} fill="#1f5c99" />
      <path d={`M${ex - 60},${ey - 40} q40,-40 90,-10 q20,40 -30,60 q-50,10 -60,-50 Z M${ex + 20},${ey + 30} q50,-10 60,30 q-30,40 -70,10 Z`} fill="#5d8f4e" />
      <g opacity={luaOn}><Lua x={ex + Math.cos(angLua) * 420} y={ey + Math.sin(angLua) * 420} r={40} on={1} id="dm" /></g>
    </svg>
  );
};
// ---------- calendário com fases da Lua ----------
const fase = (d: number) => (d % 29.5) / 29.5;
const MiniLua: React.FC<{x: number; y: number; f: number; r?: number; op?: number}> = ({x, y, f, r = 16, op = 1}) => {
  const ill = 1 - Math.abs(f - 0.5) * 2; // 0 nova, 1 cheia
  const lado = f < 0.5 ? 1 : -1;
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill="#1b2433" stroke="#56627a" strokeWidth={1.5} />
      <path d={`M${x},${y - r} A${r},${r} 0 0 ${lado > 0 ? 1 : 0} ${x},${y + r} A${r * Math.abs(1 - 2 * ill)},${r} 0 0 ${(ill > 0.5) === (lado > 0) ? 1 : 0} ${x},${y - r} Z`} fill="#efe8d6" />
    </g>
  );
};
const Calendario: React.FC<{some: number; k: number; t: number}> = ({some, k, t}) => (
  <div style={{position: 'absolute', left: 360, top: 250, width: 1200, padding: 28, borderRadius: 18, background: 'rgba(8,13,26,0.88)', border: '1px solid rgba(227,176,75,0.25)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', opacity: k}}>
    <div style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 40, color: C.info, letterSpacing: 3, marginBottom: 14}}>UM MÊS DE MARÉS</div>
    <svg width={1144} height={430} style={{position: 'relative'}}>
      {Array.from({length: 30}, (_, d) => {
        const col = d % 10, row = Math.floor(d / 10), x = 40 + col * 112, y = 50 + row * 140, f = fase(d + 14.75);
        const grande = Math.abs(f - 0.5) < 0.12 || f < 0.1 || f > 0.9;
        const vis = 1 - clamp01((some - d / 30) * 6);
        const alt = lerp(grande ? 1 : 0.4, 0.3, some > 0 ? 1 - vis : 0);
        return (
          <g key={d}>
            <rect x={x - 48} y={y - 42} width={100} height={128} rx={10} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <text x={x - 38} y={y - 18} fill="#7d879b" stroke="none" style={{fontFamily: F.rotulo, fontSize: 16, fontWeight: 700}}>{d + 1}</text>
            <MiniLua x={x + 2} y={y + 8} f={f} op={vis} />
            <path d={`M${x - 34},${y + 70} q17,${-36 * alt} 34,0 t34,0`} stroke={grande && vis > 0.5 ? C.dado : '#4d6a8a'} strokeWidth={4} fill="none" />
            {vis < 0.5 && <circle cx={x + 2} cy={y + 8} r={16} fill="none" stroke="#56627a" strokeDasharray="3 4" />}
          </g>
        );
      })}
    </svg>
  </div>
);

export const CenasLote1: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* B3a — 6 horas: cais de São Luís, a maré sobe */}
      <Cena from={118.2} to={124.0} zoom={0.04} fade={0.45}>
        <Cais nivel={lerp(1.2, 3.4, K(t, 118.2, 124))} />
      </Cena>
      {/* B3b — o mito da onda gigante → "Não." */}
      <Cena from={124.0} to={130.3} zoom={0.04} fade={0.35} fixo={
        <>
          <Tag x={420} y={300} cor={C.perigo} size={30} op={K(t, 125.4, 125.9) * (1 - K(t, 129.6, 130.0))}>O MITO</Tag>
          <svg width={1920} height={1080} style={{opacity: K(t, 129.7, 129.95)}}>
            <line x1={560} y1={260} x2={1360} y2={860} stroke={C.perigo} strokeWidth={22} strokeLinecap="round" />
            <line x1={1360} y1={260} x2={560} y2={860} stroke={C.perigo} strokeWidth={22} strokeLinecap="round" />
          </svg>
        </>
      }>
        <OndaMito k={K(t, 124.6, 128.6)} x={lerp(300, 820, K(t, 124.6, 129.6))} />
      </Cena>
      {/* B3c — perfil do mar: menos de 1 metro, o oceano relaxa */}
      <Cena from={130.3} to={137.0} zoom={0.03} fade={0.4} fixo={
        <>
          <Tag x={1000} y={360} cor={C.ouro} size={30} op={K(t, 132.4, 133.0) * (1 - K(t, 135.4, 135.8))}>MARÉ DA LUA NO MAR ABERTO: {'<'} 1 M</Tag>
          <Tag x={960} y={850} anchor="middle" cor={C.impacto} size={26} op={K(t, 135.6, 136.1)}>O OCEANO RELAXA</Tag>
        </>
      }>
        <EspacoReal dim={0.7} />
        <Perfil bojo={1 - K(t, 135.6, 136.9)} />
      </Cena>
      {/* B3d — Sol × Lua: diferença de puxão (barras 100% × 46%) */}
      <Cena from={137.0} to={149.0} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={140} y={810} anchor="middle" cor={C.ouro} op={K(t, 138.6, 139.2)}>SOL</Tag>
          <Tag x={1520} y={860} anchor="middle" cor={C.cinza} op={K(t, 137.4, 138)}>LUA</Tag>
          <div style={{position: 'absolute', left: 1240, top: 250, width: 560, padding: '20px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.84)', border: '1px solid rgba(227,176,75,0.25)', opacity: K(t, 145.6, 146.2), fontFamily: F.rotulo, color: C.info}}>
            <div style={{fontSize: 17, letterSpacing: 4, fontWeight: 700, color: '#B9C2D3'}}>FORÇA DE MARÉ</div>
            {[{n: 'LUA', v: '100%', w: 1, c: '#efe8d6'}, {n: 'SOL', v: '~46%', w: 0.46, c: C.ouro}].map((b) => (
              <div key={b.n} style={{marginTop: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, letterSpacing: 2}}><span>{b.n}</span><span style={{fontFamily: F.titulo, fontSize: 26}}>{b.v}</span></div>
                <div style={{marginTop: 8, height: 22, width: 500 * b.w * K(t, 146.2, 147.4), borderRadius: 4, background: b.c}} />
              </div>
            ))}
          </div>
        </>
      }>
        <EspacoReal />
        <DiagMare angLua={0.55} bojoL={1} bojoS={K(t, 138.6, 140)} solOn={K(t, 138.4, 139.4)} />
        <svg width={1920} height={1080} style={{opacity: K(t, 140.6, 141.2) * (1 - K(t, 145.2, 145.6))}}>
          {[[960, 560, 70], [1240, 560, 40]].map(([x, y, L], i) => <g key={i}><line x1={x} y1={y} x2={x - L} y2={y} stroke={C.ouro} strokeWidth={6} /><path d={`M${x - L},${y} l14,-10 l0,20 Z`} fill={C.ouro} /></g>)}
        </svg>
      </Cena>
      {/* B3e — São Luís: régua de 7 m ao lado de uma casa de 2 andares → cai pra ~1/3 */}
      <Cena from={149.0} to={165.2} zoom={0.025} fade={0.45} fixo={
        (() => {
          const amp = lerp(7.2, 2.4, K(t, 161.0, 163.6));
          return (
            <>
              <Tag x={1340} y={280} cor={C.dado} size={28} op={K(t, 153.6, 154.2)}>{t < 161 ? 'SIZÍGIA: MAIS DE 7 M' : 'SEM A LUA: ~1/3 (≈ 2,4 M)'}</Tag>
              <svg width={1920} height={1080}>
                <g opacity={K(t, 155.2, 155.8)} transform="translate(560,900)">
                  <rect x={0} y={-430} width={200} height={430} fill="#4a6b8a" />
                  <path d="M-14,-430 L100,-500 L214,-430 Z" fill="#8a4b32" />
                  {[0, 1].map((r) => [0, 1].map((c) => <rect key={r + '' + c} x={34 + c * 90} y={-390 + r * 210} width={44} height={70} fill="#ffcf8a" />))}
                  <text x={100} y={36} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 3}}>2 ANDARES ≈ 7 M</text>
                </g>
                <rect x={320} y={900 - amp * 60} width={1600} height={amp * 60} fill={C.dado} opacity={0.12} />
                <line x1={320} y1={900 - amp * 60} x2={1920} y2={900 - amp * 60} stroke={C.dado} strokeWidth={3} strokeDasharray="12 8" />
                <line x1={320} y1={900} x2={1920} y2={900} stroke={C.dado} strokeWidth={3} strokeDasharray="12 8" />
              </svg>
            </>
          );
        })()
      }>
        <Cais nivel={lerp(0.4, 7.2, (Math.sin((t - 149) * 0.9 - 1.6) + 1) / 2 * (1 - K(t, 160.5, 162)) + K(t, 160.5, 162) * 0.05)} luz={0.5} />
      </Cena>
      {/* B3f — barcos deitados na lama, esperando */}
      <Cena from={165.2} to={171.4} zoom={0.04} fade={0.45} fixo={
        <svg width={1920} height={1080} style={{opacity: K(t, 168.6, 169.2)}}>
          <g transform="translate(1560,240)">
            <circle r={70} fill="rgba(6,10,20,0.8)" stroke={C.ouro} strokeWidth={4} />
            <line x1={0} y1={0} x2={Math.sin(t * 3) * 52} y2={-Math.cos(t * 3) * 52} stroke={C.info} strokeWidth={5} strokeLinecap="round" />
            <line x1={0} y1={0} x2={Math.sin(t * 0.25) * 34} y2={-Math.cos(t * 0.25) * 34} stroke={C.ouro} strokeWidth={6} strokeLinecap="round" />
          </g>
        </svg>
      }>
        <Cais nivel={0} lama={1} luz={0.45} />
      </Cena>

      {/* B4a — 15 dias: calendário de marés */}
      <Cena from={171.4} to={175.3} zoom={0.02} fade={0.4} fixo={<Calendario some={0} k={K(t, 171.6, 172.2)} t={t} />}>
        <EspacoReal dim={0.6} />
      </Cena>
      {/* B4b — sizígia × quadratura */}
      <Cena from={175.3} to={191.3} zoom={0.02} fade={0.45} fixo={
        <>
          <Tag x={1100} y={150 + 120} anchor="middle" cor={C.dado} size={26} op={K(t, 180.0, 180.5) * (1 - K(t, 183.6, 184.0))}>ALINHADOS: MARÉ GRANDE</Tag>
          <Tag x={1100} y={270} anchor="middle" cor={C.cinza} size={26} op={K(t, 184.6, 185.1) * (1 - K(t, 187.8, 188.2))}>DESENCONTRADOS: MARÉ PEQUENA</Tag>
          <Tag x={1100} y={270} anchor="middle" cor={C.ouro} size={26} op={K(t, 188.2, 188.7)}>A POROROCA VIVE DA MARÉ GRANDE</Tag>
        </>
      }>
        <EspacoReal />
        {(() => {
          const ang = t < 183.8 ? Math.PI : lerp(Math.PI, Math.PI * 1.5, K(t, 183.8, 185.4));
          const ali = t < 183.8 ? 1 : 1 - K(t, 183.8, 185.4);
          return <DiagMare angLua={ang} bojoL={1} bojoS={0.5 + 0.5 * ali} solOn={K(t, 179.8, 180.6)} />;
        })()}
      </Cena>
      {/* B4c — mapa: São Domingos do Capim (PA) */}
      <Cena from={191.3} to={194.4} zoom={0} fade={0.35} fixo={
        (() => { const z = K(t, 191.4, 193.4); const s = Math.exp(lerp(Math.log(22), Math.log(90), z)); const p = [960 + (-47.77 - lerp(-53, -48.2, z)) * s, 540 - (-1.68 - lerp(-15, -2.4, z)) * s]; return <Tag x={p[0] + 30} y={p[1]} cor={C.ouro} op={K(t, 192.3, 192.8)}>SÃO DOMINGOS DO CAPIM (PA)</Tag>; })()
      }>
        {(() => { const z = K(t, 191.4, 193.4); return (
          <MapaReal lonC={lerp(-53, -48.2, z)} latC={lerp(-15, -2.4, z)} s={Math.exp(lerp(Math.log(22), Math.log(90), z))}>
            {(p) => { const q = p(-47.77, -1.68); return <g opacity={K(t, 192.0, 192.5)}><circle cx={q[0]} cy={q[1]} r={30 + 8 * Math.sin(t * 4)} fill={C.ouro} opacity={0.25} /><circle cx={q[0]} cy={q[1]} r={9} fill={C.ouro} stroke="#fff" strokeWidth={2} /></g>; }}
          </MapaReal>
        ); })()}
      </Cena>
      {/* B4d — festival: a onda com surfistas, ~30 km/h */}
      <Cena from={194.4} to={202.2} zoom={0.05} fade={0.45} fixo={
        <Tag x={1660} y={960} anchor="end" cor={C.ouro} size={28} op={K(t, 198.8, 199.4)}>~30 KM/H · DEZENAS DE MINUTOS</Tag>
      }>
        <Rio noite={0.15} lua={0} onda={0.15 + prog(t, 194.4, 202.2) * 0.75} ondaAlt={80} festival={1} canoa={false} />
      </Cena>
      {/* B4e — as luas somem do calendário; a onda vira marola */}
      <Cena from={202.2} to={207.6} zoom={0.02} fade={0.4} fixo={<Calendario some={K(t, 202.4, 206.8)} k={1} t={t} />}>
        <EspacoReal dim={0.6} />
      </Cena>
      <Cena from={207.6} to={217.3} zoom={0.04} fade={0.45} fixo={
        <Tag x={960} y={330} anchor="middle" cor={C.cinza} size={24} op={K(t, 213.2, 213.7) * (1 - K(t, 216.6, 217.0))}>NINGUÉM PUBLICOU UM MODELO EXATO</Tag>
      }>
        <Rio noite={0.35} lua={0} onda={0.3 + prog(t, 207.6, 217.3) * 0.5} ondaAlt={lerp(80, 8, K(t, 208.4, 212.6))} canoa={false} />
      </Cena>
      {/* B4f — a primeira perda: surfistas sentados esperando */}
      <Cena from={217.3} to={227.8} zoom={0.05} fade={0.6}>
        <Rio noite={lerp(0.5, 0.9, prog(t, 217.3, 227.8))} lua={0} luaGhost={0.6} onda={0} ondaAlt={0} parados={K(t, 217.4, 218.4)} canoa={false} />
      </Cena>
    </>
  );
};

export const HUD_LOTE1 = [
  {a: 118.0, b: 124.0, s0: 118.2, s1: 119.6, v0: 2 * 3600, v1: 6 * 3600},
  {a: 171.3, b: 177.0, s0: 171.5, s1: 173.0, v0: 6 * 3600, v1: 15 * 86400 + 120},
];
