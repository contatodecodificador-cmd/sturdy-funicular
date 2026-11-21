/* O CORREDOR DAS PORTAS — perspectiva de um ponto, geometria 3D projetada. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {lerp, rnd, clamp01, FR, QU} from './base';
import {Pessoa, VOCE} from './personagens';

const VPX = 960, VPY = 430, FOC = 980;
const W = 2.6, CHAO = 1.75, TETO = -2.1, ZFAR = 34;

export type Placa = {lado: -1 | 1; z: number; txt: string; destaque?: number; brilho?: number};
export const PLACAS: Placa[] = [
  {lado: -1, z: 4, txt: '−14 °C'}, {lado: 1, z: 5.5, txt: '+44 °C'},
  {lado: -1, z: 8.5, txt: '−67,7 °C'}, {lado: 1, z: 10, txt: '+70,7 °C'},
  {lado: -1, z: 13, txt: '−89,2 °C'}, {lado: 1, z: 14.5, txt: '1.170 °C'},
  {lado: -1, z: 17.5, txt: '−196 °C'}, {lado: 1, z: 19, txt: '28.000 °C'},
  {lado: -1, z: 22, txt: '−270 °C'}, {lado: 1, z: 23.5, txt: '15 MI °C'},
  {lado: -1, z: 28, txt: '???'}, {lado: 1, z: 29.5, txt: '???'},
];

export const Corredor: React.FC<{t: number; cam?: number; camX?: number; camY?: number; zoom?: number; pessoaZ?: number; pessoaX?: number; pessoaBraco?: number; brilhoFim?: number; destaque?: number; placasOp?: number; placas?: Placa[]; portaAberta?: {i: number; k: number}}> = ({t, cam = 0, camX = 0, camY = 0, zoom = 1, pessoaZ, pessoaX = 0, pessoaBraco = 0, brilhoFim = 0.6, destaque = 0, placasOp = 1, placas = PLACAS, portaAberta}) => {
  const P = (x: number, y: number, z: number): [number, number] => {
    const zz = Math.max(0.2, z - cam);
    return [VPX + (FOC * (x - camX)) / zz, VPY + (FOC * (y - camY)) / zz];
  };
  const quad = (pts: [number, number][]) => 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') + ' Z';
  const zn = cam + 0.25;
  const pulso = 0.75 + 0.25 * Math.sin(t * 3.1);
  // paredes
  const pe = quad([P(-W, TETO, zn), P(-W, TETO, ZFAR), P(-W, CHAO, ZFAR), P(-W, CHAO, zn)]);
  const pd = quad([P(W, TETO, zn), P(W, TETO, ZFAR), P(W, CHAO, ZFAR), P(W, CHAO, zn)]);
  const chE = quad([P(-W, CHAO, zn), P(0, CHAO, zn), P(0, CHAO, ZFAR), P(-W, CHAO, ZFAR)]);
  const chD = quad([P(0, CHAO, zn), P(W, CHAO, zn), P(W, CHAO, ZFAR), P(0, CHAO, ZFAR)]);
  const teto = quad([P(-W, TETO, zn), P(W, TETO, zn), P(W, TETO, ZFAR), P(-W, TETO, ZFAR)]);
  const fundo = quad([P(-W, TETO, ZFAR), P(W, TETO, ZFAR), P(W, CHAO, ZFAR), P(-W, CHAO, ZFAR)]);
  const vis = (z: number) => z - cam > 0.35;
  // pingentes de gelo (parede esquerda, borda do teto)
  const gelos = Array.from({length: 60}, (_, i) => ({z: 0.5 + i * 0.55 + rnd(i) * 0.3, L: 0.12 + rnd(i + 40) * 0.42, x: -W + 0.05 + rnd(i + 80) * 0.5}));
  // rachaduras incandescentes (parede direita)
  const racha = Array.from({length: 34}, (_, i) => {
    const z0 = 0.8 + i * 0.95 + rnd(i + 7) * 0.5, y0 = TETO + 0.4 + rnd(i + 9) * 3.2;
    const pts: [number, number][] = [[y0, z0]];
    for (let k = 1; k < 5; k++) pts.push([pts[k - 1][0] + (rnd(i * 7 + k) - 0.3) * 0.5, pts[k - 1][1] + 0.12 + rnd(i * 3 + k) * 0.25]);
    return pts;
  });
  // partículas: neve à esquerda, brasas à direita (posições no mundo)
  const neve = Array.from({length: 110}, (_, i) => {
    const z = cam + 0.6 + ((rnd(i) * 16 - t * 0.0) % 16 + 16) % 16;
    const y = TETO + ((rnd(i + 11) * 3.9 + t * (0.25 + rnd(i + 3) * 0.2)) % 3.9);
    const x = -W + 0.2 + rnd(i + 21) * 1.9 + Math.sin(t + i) * 0.08;
    return {x, y, z, r: 0.012 + rnd(i + 31) * 0.02};
  });
  const brasas = Array.from({length: 90}, (_, i) => {
    const z = cam + 0.6 + rnd(i + 50) * 16;
    const y = CHAO - ((rnd(i + 61) * 3.9 + t * (0.35 + rnd(i + 5) * 0.3)) % 3.9);
    const x = W - 0.2 - rnd(i + 71) * 1.9 + Math.sin(t * 2 + i) * 0.1;
    return {x, y, z, r: 0.01 + rnd(i + 81) * 0.016};
  });
  // portas (no plano da parede)
  const porta = (pl: Placa, i: number) => {
    const x = pl.lado * W, z0 = pl.z, z1 = pl.z + 1.25, yT = CHAO - 2.55;
    if (!vis(z0)) return null;
    const fria = pl.lado < 0;
    const ab = portaAberta && portaAberta.i === i ? portaAberta.k : 0;
    const zFolha = lerp(z1, z0 + 0.15, ab);
    const xFolha = x - pl.lado * ab * 1.1;
    return (
      <g key={'p' + i}>
        <path d={quad([P(x, yT - 0.12, z0 - 0.1), P(x, yT - 0.12, z1 + 0.1), P(x, CHAO, z1 + 0.1), P(x, CHAO, z0 - 0.1)])} fill={fria ? '#0B2238' : '#1A0805'} />
        {ab > 0 && <path d={quad([P(x, yT, z0), P(x, yT, z1), P(x, CHAO, z1), P(x, CHAO, z0)])} fill={fria ? '#E8F6FF' : '#FFE2B0'} opacity={0.95} />}
        <path d={quad([P(x, yT, z0), P(xFolha, yT, zFolha), P(xFolha, CHAO, zFolha), P(x, CHAO, z0)])} fill={fria ? 'url(#portaF)' : 'url(#portaQ)'} stroke={fria ? FR.gelo : QU.fogo} strokeOpacity={fria ? 0.55 : 0.45 * pulso} strokeWidth={1.5} />
        {/* maçaneta */}
        {(() => { const [hx, hy] = P(lerp(x, xFolha, 0.85), CHAO - 1.2, lerp(z0, zFolha, 0.85)); const s = FOC / Math.max(0.3, z0 + 1 - cam); return <circle cx={hx} cy={hy} r={Math.max(1.5, s * 0.035)} fill={fria ? '#CFE9FF' : '#FFC37A'} />; })()}
        {/* fresta de luz embaixo */}
        <path d={quad([P(x, CHAO - 0.03, z0), P(x, CHAO - 0.03, z1), P(x - pl.lado * 0.5, CHAO, z1 + 0.2), P(x - pl.lado * 0.5, CHAO, z0 - 0.2)])} fill={fria ? FR.gelo : QU.fogo} opacity={(fria ? 0.22 : 0.3 * pulso)} />
      </g>
    );
  };
  // placas penduradas (de frente para a câmera)
  const placa = (pl: Placa, i: number) => {
    const zc = pl.z + 0.62;
    if (!vis(zc) || zc - cam > 31) return null;
    const x = pl.lado * (W - 0.62), y = CHAO - 2.95;
    const [cx, cy] = P(x, y, zc);
    const s = FOC / (zc - cam);
    const w = 1.05 * s, h = 0.36 * s;
    const fria = pl.lado < 0;
    const fog = clamp01(1 - (zc - cam - 5) / 14);
    const mist = pl.txt === '???';
    if (h < 15 && !mist) return null;
    const dz = pl.destaque ?? 0;
    return (
      <g key={'pl' + i} opacity={placasOp * (0.15 + 0.85 * fog)}>
        <line x1={cx - w * 0.3} y1={cy - h / 2} x2={cx - w * 0.3} y2={P(x, TETO, zc)[1]} stroke="#555" strokeWidth={Math.max(0.6, s * 0.012)} />
        <line x1={cx + w * 0.3} y1={cy - h / 2} x2={cx + w * 0.3} y2={P(x, TETO, zc)[1]} stroke="#555" strokeWidth={Math.max(0.6, s * 0.012)} />
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.16} fill="#0A0F1C" stroke={fria ? FR.gelo : QU.fogo} strokeWidth={Math.max(1, s * 0.016)} opacity={0.95} />
        {(dz > 0 || mist) && <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.16} fill="none" stroke={fria ? FR.gelo : QU.fogo} strokeWidth={s * 0.05} opacity={(mist ? 0.35 + 0.35 * Math.sin(t * 5) : dz) * 0.8} filter="url(#blur6)" />}
        <text x={cx} y={cy + h * 0.24} textAnchor="middle" fill={mist ? (fria ? FR.gelo : QU.fogo) : '#F2F4F8'} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: h * 0.68, letterSpacing: s * 0.004}}>{pl.txt}</text>
      </g>
    );
  };
  // luzes do teto (ritmo de profundidade)
  const luzes = Array.from({length: 16}, (_, i) => 1 + i * 2.1).filter((z) => vis(z));
  // pessoa
  let pessoa: React.ReactNode = null;
  if (pessoaZ !== undefined && pessoaZ - cam > 0.4) {
    const [px, py] = P(pessoaX, CHAO, pessoaZ);
    const s = (FOC / (pessoaZ - cam)) * (1.78 / 390);
    pessoa = (
      <g transform={`translate(${px},${py}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={90} ry={14} fill="rgba(0,0,0,0.45)" />
        <ellipse cx={-80} cy={6} rx={160} ry={10} fill="rgba(0,0,0,0.25)" transform="skewX(-30)" />
        <Pessoa v={VOCE} vista="costas" t={t} bD={[lerp(8, 62, pessoaBraco), lerp(8, 30, pessoaBraco)]} />
      </g>
    );
  }
  const [fx, fy] = P(0, (TETO + CHAO) / 2, ZFAR);
  return (
    <AbsoluteFill style={{background: '#05070D', transform: `scale(${zoom})`, transformOrigin: `${VPX / 19.2}% ${VPY / 10.8}%`}}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="pE" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={VPX} y2={0}><stop offset="0%" stopColor="#5FA8E0" /><stop offset="45%" stopColor="#1C4A74" /><stop offset="100%" stopColor="#0A1A2C" /></linearGradient>
          <linearGradient id="pD" gradientUnits="userSpaceOnUse" x1={1920} y1={0} x2={VPX} y2={0}><stop offset="0%" stopColor="#B4401F" /><stop offset="45%" stopColor="#5A1A0C" /><stop offset="100%" stopColor="#1E0905" /></linearGradient>
          <linearGradient id="cE" gradientUnits="userSpaceOnUse" x1={0} y1={1080} x2={0} y2={VPY}><stop offset="0%" stopColor="#CFE8FA" /><stop offset="40%" stopColor="#4A7EA8" /><stop offset="100%" stopColor="#0C1C2E" /></linearGradient>
          <linearGradient id="cD" gradientUnits="userSpaceOnUse" x1={0} y1={1080} x2={0} y2={VPY}><stop offset="0%" stopColor="#3A1A10" /><stop offset="40%" stopColor="#24100A" /><stop offset="100%" stopColor="#120806" /></linearGradient>
          <linearGradient id="portaF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9DDF5" /><stop offset="100%" stopColor="#4F86B4" /></linearGradient>
          <linearGradient id="portaQ" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4A1E12" /><stop offset="100%" stopColor="#2A0E08" /></linearGradient>
          <radialGradient id="fim"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="30%" stopColor="#FFF4E0" stopOpacity={0.9} /><stop offset="100%" stopColor="#FFF4E0" stopOpacity={0} /></radialGradient>
          <linearGradient id="reflexo" gradientUnits="userSpaceOnUse" x1={1920} y1={0} x2={VPX} y2={0}><stop offset="0%" stopColor="#FF7A2F" stopOpacity={0.55} /><stop offset="60%" stopColor="#FF7A2F" stopOpacity={0.12} /><stop offset="100%" stopColor="#FF7A2F" stopOpacity={0} /></linearGradient>
          <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="blur2"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>
        <path d={teto} fill="#0B0E16" />
        {luzes.map((z) => { const a = P(-0.5, TETO, z), b = P(0.5, TETO, z), c = P(0.5, TETO, z + 0.5), d = P(-0.5, TETO, z + 0.5); return <path key={z} d={quad([a, b, c, d])} fill="#E9F1FF" opacity={0.18 * clamp01(1 - (z - cam) / 30)} />; })}
        <path d={pe} fill="url(#pE)" />
        <path d={pd} fill="url(#pD)" />
        <path d={chE} fill="url(#cE)" />
        <path d={chD} fill="url(#cD)" />
        <path d={chD} fill="url(#reflexo)" opacity={0.5 * pulso} />
        {/* lava escorrendo no rodapé direito */}
        <path d={quad([P(W, CHAO - 0.08, zn), P(W, CHAO - 0.08, ZFAR), P(W - 0.35, CHAO, ZFAR), P(W - 0.35, CHAO, zn)])} fill={QU.brasa} opacity={0.55 * pulso} />
        {/* gelo acumulado no rodapé esquerdo */}
        <path d={quad([P(-W, CHAO - 0.12, zn), P(-W, CHAO - 0.12, ZFAR), P(-W + 0.45, CHAO, ZFAR), P(-W + 0.45, CHAO, zn)])} fill="#E3F3FF" opacity={0.6} />
        {/* rachaduras */}
        {racha.map((pts, i) => pts[0][1] - cam > 0.4 && <path key={'r' + i} d={'M' + pts.map(([y, z]) => P(W, y, z).map((v) => v.toFixed(1)).join(',')).join(' L')} stroke={QU.fogo} strokeWidth={Math.max(2, 22 / Math.max(1, pts[0][1] - cam))} fill="none" opacity={0.9 * pulso} filter={pts[0][1] - cam < 6 ? 'url(#blur2)' : undefined} />)}
        {racha.map((pts, i) => pts[0][1] - cam > 0.4 && <path key={'r2' + i} d={'M' + pts.map(([y, z]) => P(W, y, z).map((v) => v.toFixed(1)).join(',')).join(' L')} stroke="#FFE3A8" strokeWidth={Math.max(0.8, 6 / Math.max(1, pts[0][1] - cam))} fill="none" opacity={0.8 * pulso} />)}
        {/* geada: manchas claras na parede esquerda */}
        {Array.from({length: 40}, (_, i) => { const z = 0.6 + i * 0.8, y = TETO + 0.3 + rnd(i + 200) * 3.4; if (!vis(z)) return null; const [x1, y1] = P(-W, y, z); const s = FOC / (z - cam); return <ellipse key={'g' + i} cx={x1} cy={y1} rx={s * 0.08} ry={s * 0.3} fill="#EAF6FF" opacity={0.05} />; })}
        {/* fundo + clarão */}
        <path d={fundo} fill="#FFF8EC" opacity={0.25 + 0.75 * brilhoFim} />
        <circle cx={fx} cy={fy} r={lerp(120, 520, brilhoFim)} fill="url(#fim)" opacity={0.55 + 0.45 * brilhoFim} />
        {[...placas.keys()].map((i) => porta(placas[i], i))}
        {gelos.map((g, i) => vis(g.z) && <path key={'i' + i} d={(() => { const a = P(g.x, TETO, g.z), b = P(g.x + 0.1, TETO, g.z), c = P(g.x + 0.05, TETO + g.L, g.z); return `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} Z`; })()} fill="#DDF1FF" opacity={0.85} />)}
        {placas.map(placa)}
        {neve.map((p, i) => { if (p.z - cam < 0.4) return null; const [x, y] = P(p.x, p.y, p.z); return <circle key={'n' + i} cx={x} cy={y} r={(FOC * p.r) / (p.z - cam)} fill="#fff" opacity={0.7} />; })}
        {brasas.map((p, i) => { if (p.z - cam < 0.4) return null; const [x, y] = P(p.x, p.y, p.z); return <circle key={'b' + i} cx={x} cy={y} r={(FOC * p.r) / (p.z - cam)} fill={i % 3 ? QU.fogo : '#FFE3A8'} opacity={0.85} />; })}
        {pessoa}
      </svg>
      {/* névoa fria e calor: tingem cada metade */}
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(120,190,255,${0.12 + destaque * 0.0}) 0%, transparent 40%, transparent 60%, rgba(255,120,40,0.14) 100%)`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
