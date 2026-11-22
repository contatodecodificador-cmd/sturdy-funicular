/* Personagens 2D do vídeo 5 — estilo vetorial chapado com sombreamento suave.
   Origem = entre os pés; altura ~390 unidades. Vista de frente ou de costas. */
import React from 'react';

export type Expr = 'neutro' | 'susto' | 'frio' | 'calor' | 'fechado' | 'sorriso' | 'calmo' | 'dor';
export type Visual = {
  pele: string; peleSombra: string;
  cabelo: {tipo: 'curto' | 'longo' | 'peruca' | 'grisalho' | 'cacheado'; cor: string; cor2?: string};
  topo: {tipo: 'camiseta' | 'jaqueta' | 'casaca' | 'avental' | 'jaleco'; cor: string; cor2?: string};
  baixo: {tipo: 'bermuda' | 'calca' | 'calcao'; cor: string};
  pe: {tipo: 'chinelo' | 'bota' | 'sapato' | 'tenis'; cor: string};
  bigode?: boolean; oculos?: boolean; gorro?: string; oculosNeve?: boolean; meias?: string; barba?: boolean;
};

export const VOCE: Visual = {pele: '#B9805C', peleSombra: '#9A6646', cabelo: {tipo: 'cacheado', cor: '#2A1C15'}, topo: {tipo: 'camiseta', cor: '#2A9D8F', cor2: '#1F7A6F'}, baixo: {tipo: 'bermuda', cor: '#2F3B52'}, pe: {tipo: 'chinelo', cor: '#E9C46A'}};
export const ANNA: Visual = {pele: '#F1D3C0', peleSombra: '#D9B39C', cabelo: {tipo: 'longo', cor: '#E2BE6A', cor2: '#C9A24E'}, topo: {tipo: 'jaqueta', cor: '#D1495B', cor2: '#A8323F'}, baixo: {tipo: 'calca', cor: '#2B2D42'}, pe: {tipo: 'bota', cor: '#3A3A3A'}, gorro: '#F2F2F2', oculosNeve: true};
export const BLAGDEN: Visual = {pele: '#F0CDB5', peleSombra: '#D8AE95', cabelo: {tipo: 'peruca', cor: '#ECE8DE', cor2: '#CFC9BA'}, topo: {tipo: 'casaca', cor: '#5B3A29', cor2: '#C9A66B'}, baixo: {tipo: 'calcao', cor: '#4A2F21'}, pe: {tipo: 'sapato', cor: '#1E1A17'}, meias: '#EFEDE6'};
export const WILLIE: Visual = {pele: '#5E3D2A', peleSombra: '#4A2E1F', cabelo: {tipo: 'grisalho', cor: '#3A3634', cor2: '#8C8781'}, topo: {tipo: 'avental', cor: '#A9CBD9', cor2: '#7FA8BA'}, baixo: {tipo: 'calca', cor: '#A9CBD9'}, pe: {tipo: 'tenis', cor: '#DDD'}, bigode: true};
export const CIENTISTA: Visual = {pele: '#D9A88A', peleSombra: '#BF8C6E', cabelo: {tipo: 'curto', cor: '#3B2A20'}, topo: {tipo: 'jaleco', cor: '#F4F6F8', cor2: '#3E5C76'}, baixo: {tipo: 'calca', cor: '#34405A'}, pe: {tipo: 'sapato', cor: '#222'}, oculos: true};
export const CIENTISTA2: Visual = {pele: '#8C5B3E', peleSombra: '#73482F', cabelo: {tipo: 'longo', cor: '#1E1612', cor2: '#2E221B'}, topo: {tipo: 'jaleco', cor: '#F4F6F8', cor2: '#7A4E9C'}, baixo: {tipo: 'calca', cor: '#2D2D3A'}, pe: {tipo: 'tenis', cor: '#EEE'}};

const limb = (c: string, w: number) => ({stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'});
const rad = (d: number) => (d * Math.PI) / 180;

// braço: ombro (sx,sy), ângulo a (graus a partir de "para baixo", + = para fora), cotovelo b (graus, + = dobra para dentro/cima)
const braco = (sx: number, sy: number, lado: 1 | -1, a: number, b: number) => {
  const u = 74, f = 70;
  const ang = rad(a) * lado;
  const e = [sx + Math.sin(ang) * u, sy + Math.cos(ang) * u];
  const ang2 = ang - rad(b) * lado;
  const h = [e[0] + Math.sin(ang2) * f, e[1] + Math.cos(ang2) * f];
  return {e, h, ang, ang2};
};

export const Pessoa: React.FC<{v: Visual; vista?: 'frente' | 'costas'; expr?: Expr; t?: number; bE?: [number, number]; bD?: [number, number]; olhar?: [number, number]; luzFria?: number; luzQuente?: number; cabeloSolto?: number; suor?: number; geada?: number; semPernas?: boolean; sil?: boolean}> = ({sil = false, v, vista = 'frente', expr = 'neutro', t = 0, bE = [8, 8], bD = [8, 8], olhar = [0, 0], luzFria = 0, luzQuente = 0, cabeloSolto = 0, suor = 0, geada = 0, semPernas = false}) => {
  const resp = Math.sin(t * 2.2) * 1.6;
  const pisca = expr !== 'fechado' && (t % 3.9) < 0.11;
  const costas = vista === 'costas';
  // em vista de costas, esquerda/direita da tela se invertem para o personagem
  const SE: [number, number] = [-54, -298 - resp * 0.3], SD: [number, number] = [54, -298 - resp * 0.3];
  const A = braco(SE[0], SE[1], -1, bE[0], bE[1]);
  const B = braco(SD[0], SD[1], 1, bD[0], bD[1]);
  const top = v.topo, longo = top.tipo !== 'camiseta';
  const manga = (s: number[], arm: ReturnType<typeof braco>, lado: 1 | -1) => {
    if (top.tipo === 'avental') return <path d={`M${s[0]},${s[1]} L${s[0] + Math.sin(arm.ang) * 26},${s[1] + Math.cos(arm.ang) * 26}`} {...limb(top.cor, 30)} />;
    if (!longo) return <path d={`M${s[0]},${s[1]} L${s[0] + Math.sin(arm.ang) * 30},${s[1] + Math.cos(arm.ang) * 30}`} {...limb(top.cor, 31)} />;
    return <path d={`M${s[0]},${s[1]} L${arm.e[0]},${arm.e[1]} L${arm.h[0] - Math.sin(arm.ang2) * 10},${arm.h[1] - Math.cos(arm.ang2) * 10}`} {...limb(top.cor, 28)} />;
  };
  const bracoInteiro = (s: number[], arm: ReturnType<typeof braco>, lado: 1 | -1) => (
    <g>
      <path d={`M${s[0]},${s[1]} L${arm.e[0]},${arm.e[1]} L${arm.h[0]},${arm.h[1]}`} {...limb(v.pele, 21)} />
      {manga(s, arm, lado)}
      {top.tipo === 'casaca' && <path d={`M${arm.h[0] - Math.sin(arm.ang2) * 12},${arm.h[1] - Math.cos(arm.ang2) * 12} l${Math.sin(arm.ang2) * 3},${Math.cos(arm.ang2) * 3}`} {...limb('#F2EEE4', 26)} />}
      {top.tipo === 'jaqueta' ? <circle cx={arm.h[0]} cy={arm.h[1]} r={14} fill="#2B2D42" /> : <circle cx={arm.h[0]} cy={arm.h[1]} r={12} fill={v.pele} />}
    </g>
  );
  // pernas
  const perna = (x: number) => {
    const y0 = -168, y1 = -14;
    const b = v.baixo;
    const corte = b.tipo === 'bermuda' ? -110 : b.tipo === 'calcao' ? -95 : y1;
    return (
      <g>
        <path d={`M${x},${y0} L${x},${y1}`} {...limb(v.meias ?? v.pele, 30)} />
        <path d={`M${x},${y0} L${x},${corte}`} {...limb(b.cor, b.tipo === 'calca' ? 34 : 36)} />
        {v.pe.tipo === 'chinelo' && <><ellipse cx={x + (x < 0 ? -2 : 2)} cy={-4} rx={22} ry={7} fill={v.pe.cor} /><path d={`M${x - 8},${-6} L${x},${-14} L${x + 8},${-6}`} stroke="#1F2B3A" strokeWidth={3} fill="none" /><ellipse cx={x} cy={-10} rx={12} ry={7} fill={v.pele} /></>}
        {v.pe.tipo === 'bota' && <path d={`M${x - 18},${-40} L${x + 16},${-40} L${x + 20},${0} L${x - 24},${0} Z`} fill={v.pe.cor} />}
        {v.pe.tipo === 'sapato' && <><path d={`M${x - 20},${0} Q${x - 20},${-16} ${x},${-16} Q${x + 18},${-16} ${x + 20},${0} Z`} fill={v.pe.cor} /><rect x={x - 6} y={-14} width={12} height={6} fill="#C9A66B" /></>}
        {v.pe.tipo === 'tenis' && <path d={`M${x - 20},${0} Q${x - 20},${-18} ${x},${-18} Q${x + 18},${-18} ${x + 22},${0} Z`} fill={v.pe.cor} />}
      </g>
    );
  };
  // tronco
  const tronco = (() => {
    const c = top.cor, c2 = top.cor2 ?? c;
    const base = `M-22,-314 Q0,-306 22,-314 L54,-302 Q60,-296 60,-284 L${top.tipo === 'casaca' || top.tipo === 'jaleco' ? 58 : 50},${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -120 : -186} Q0,${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -112 : -178} ${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -58 : -50},${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -120 : -186} L-60,-284 Q-60,-296 -54,-302 Z`;
    return (
      <g>
        {(v.baixo.tipo === 'bermuda' || v.baixo.tipo === 'calcao' || v.baixo.tipo === 'calca') && <path d="M-52,-196 L52,-196 L54,-150 L-54,-150 Z" fill={v.baixo.cor} />}
        <path d={base} fill={c} />
        {/* sombreamento lateral */}
        <path d={`M20,-310 L54,-302 Q60,-296 60,-284 L${top.tipo === 'casaca' || top.tipo === 'jaleco' ? 58 : 50},${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -120 : -186} L28,${top.tipo === 'casaca' || top.tipo === 'jaleco' ? -116 : -182} Z`} fill="rgba(0,0,0,0.13)" />
        {!costas && top.tipo === 'camiseta' && <><path d="M-16,-312 Q0,-296 16,-312" stroke={c2} strokeWidth={5} fill="none" /><g transform="translate(-26,-268)"><rect x={-3} y={-12} width={6} height={20} rx={3} fill="#F2F4F8" /><circle cx={0} cy={10} r={6} fill="#F2F4F8" /><circle cx={0} cy={10} r={3.2} fill="#FF7A2F" /><rect x={-1.3} y={-4} width={2.6} height={13} fill="#FF7A2F" /></g><path d="M-50,-192 Q0,-184 50,-192" stroke={c2} strokeWidth={4} fill="none" /></>}
        {!costas && top.tipo === 'jaqueta' && <><path d="M0,-306 L0,-186" stroke={c2} strokeWidth={4} /><rect x={-50} y={-250} width={100} height={14} fill="#F2F2F2" opacity={0.85} /><path d="M-18,-314 L0,-296 L18,-314" stroke={c2} strokeWidth={8} fill="none" /></>}
        {!costas && top.tipo === 'casaca' && <><path d="M-20,-306 L-6,-120 L6,-120 L20,-306 Z" fill={c2} /><path d="M-10,-312 Q0,-290 10,-312 L6,-282 L-6,-282 Z" fill="#F7F4EC" />{[-260, -230, -200, -170].map((y) => <circle key={y} cx={-28} cy={y} r={3.5} fill="#E3C27A" />)}</>}
        {!costas && top.tipo === 'jaleco' && <><path d="M-22,-312 L0,-262 L22,-312" fill={c2} /><path d="M0,-262 L0,-120" stroke="#C9D1DA" strokeWidth={3} /><rect x={-48} y={-258} width={24} height={30} rx={3} fill="none" stroke="#C9D1DA" strokeWidth={3} /><rect x={-42} y={-262} width={4} height={18} fill="#3E8EDE" /></>}
        {!costas && top.tipo === 'avental' && <>{[-280, -250, -220, -190, -160].map((y, i) => [-36, -12, 12, 36].map((x, j) => <circle key={`${i}${j}`} cx={x + (i % 2) * 12} cy={y} r={2.5} fill={top.cor2} />))}</>}
        {costas && top.tipo === 'camiseta' && <path d="M-14,-312 Q0,-308 14,-312" stroke={c2} strokeWidth={4} fill="none" />}
      </g>
    );
  })();
  // cabeça
  const HY = -364;
  const cabeca = (() => {
    const h = v.cabelo;
    const solto = cabeloSolto;
    const atras = (
      <g>
        {h.tipo === 'longo' && <path d={`M-40,${HY - 10} Q-58,${HY + 60 - solto * 40} ${-46 - solto * 26},${HY + 96 - solto * 70} L${46 + solto * 26},${HY + 96 - solto * 70} Q58,${HY + 60 - solto * 40} 40,${HY - 10} Z`} fill={h.cor2 ?? h.cor} />}
        {h.tipo === 'peruca' && <><circle cx={-40} cy={HY + 16} r={15} fill={h.cor2} /><circle cx={40} cy={HY + 16} r={15} fill={h.cor2} /><path d={`M-12,${HY + 30} L0,${HY + 74} L12,${HY + 30}`} fill={h.cor2} /></>}
      </g>
    );
    const rosto = !costas && !sil && (() => {
      const ex = olhar[0] * 3, ey = olhar[1] * 3;
      const olhoAberto = !(pisca || expr === 'fechado');
      const grande = expr === 'susto' ? 1.3 : 1;
      const brow = expr === 'susto' ? -8 : expr === 'frio' || expr === 'dor' ? -2 : expr === 'calmo' ? 0 : -3;
      const browTilt = expr === 'frio' || expr === 'dor' ? 5 : expr === 'calor' ? 3 : 0;
      return (
        <g>
          {[-15, 15].map((x) => (
            <g key={x}>
              {olhoAberto ? <>
                <ellipse cx={x} cy={HY + 2} rx={6.5 * grande} ry={7.5 * grande} fill="#FBFBFB" />
                <circle cx={x + ex} cy={HY + 3 + ey} r={3.8} fill="#1C1A1A" />
                <circle cx={x + ex + 1.3} cy={HY + 1.5 + ey} r={1.2} fill="#fff" />
              </> : <path d={`M${x - 7},${HY + 3} Q${x},${HY + 8} ${x + 7},${HY + 3}`} stroke="#2A1E18" strokeWidth={2.6} fill="none" strokeLinecap="round" />}
              <path d={`M${x - 8},${HY - 12 + brow + (x < 0 ? -browTilt : browTilt) * 0} L${x + 8},${HY - 12 + brow + (x < 0 ? browTilt : -browTilt) * -1}`} stroke={h.tipo === 'peruca' ? '#8C7B66' : h.tipo === 'grisalho' ? '#2C2826' : h.cor} strokeWidth={3.6} strokeLinecap="round" transform={`rotate(${x < 0 ? -browTilt : browTilt} ${x} ${HY - 12})`} />
            </g>
          ))}
          <path d={`M-2,${HY + 6} Q-6,${HY + 18} 2,${HY + 19}`} stroke={v.peleSombra} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          {expr === 'neutro' && <path d={`M-9,${HY + 30} Q0,${HY + 33} 9,${HY + 30}`} stroke="#5A2F25" strokeWidth={2.8} fill="none" strokeLinecap="round" />}
          {expr === 'calmo' && <path d={`M-8,${HY + 30} Q0,${HY + 32} 8,${HY + 30}`} stroke="#5A2F25" strokeWidth={2.6} fill="none" strokeLinecap="round" />}
          {expr === 'fechado' && <path d={`M-8,${HY + 30} Q0,${HY + 32} 8,${HY + 30}`} stroke="#5A2F25" strokeWidth={2.6} fill="none" strokeLinecap="round" />}
          {expr === 'sorriso' && <path d={`M-12,${HY + 27} Q0,${HY + 38} 12,${HY + 27}`} stroke="#5A2F25" strokeWidth={3} fill="#7A3B30" strokeLinecap="round" />}
          {expr === 'susto' && <ellipse cx={0} cy={HY + 31} rx={6} ry={8} fill="#5A2520" />}
          {expr === 'dor' && <path d={`M-10,${HY + 33} Q0,${HY + 26} 10,${HY + 33}`} stroke="#5A2F25" strokeWidth={2.8} fill="none" strokeLinecap="round" />}
          {expr === 'frio' && <><rect x={-11} y={HY + 26} width={22} height={9} rx={3} fill="#F4F4F4" stroke="#5A2F25" strokeWidth={2} /><path d={`M-4,${HY + 26} v9 M4,${HY + 26} v9`} stroke="#999" strokeWidth={1.2} /></>}
          {expr === 'calor' && <ellipse cx={0} cy={HY + 31} rx={8} ry={5} fill="#5A2520" />}
          {(expr === 'calor' || luzQuente > 0.6) && <><ellipse cx={-22} cy={HY + 18} rx={8} ry={4.5} fill="#E2452B" opacity={0.28} /><ellipse cx={22} cy={HY + 18} rx={8} ry={4.5} fill="#E2452B" opacity={0.28} /></>}
          {expr === 'frio' && <><ellipse cx={-22} cy={HY + 18} rx={8} ry={4.5} fill="#7FB8E8" opacity={0.35} /><ellipse cx={22} cy={HY + 18} rx={8} ry={4.5} fill="#7FB8E8" opacity={0.35} /></>}
          {v.bigode && <path d={`M-14,${HY + 25} Q0,${HY + 18} 14,${HY + 25} Q0,${HY + 23} -14,${HY + 25} Z`} fill="#2C2826" stroke="#2C2826" strokeWidth={3} strokeLinejoin="round" />}
          {v.oculos && <g fill="none" stroke="#2A2F3A" strokeWidth={2.6}><circle cx={-15} cy={HY + 2} r={11} /><circle cx={15} cy={HY + 2} r={11} /><path d={`M-4,${HY + 1} L4,${HY + 1}`} /></g>}
        </g>
      );
    })();
    const frente = (
      <g>
        {h.tipo === 'curto' && <path d={`M-40,${HY - 4} Q-42,${HY - 52} 0,${HY - 50} Q40,${HY - 52} 40,${HY - 6} Q30,${HY - 30} 4,${HY - 30} Q-24,${HY - 32} -40,${HY - 4} Z`} fill={h.cor} />}
        {h.tipo === 'cacheado' && <g fill={h.cor}>{[[-30, -26, 15], [-16, -40, 16], [2, -44, 17], [20, -40, 16], [32, -26, 14], [-38, -10, 10], [38, -10, 10], [-6, -34, 14], [12, -32, 14]].map(([x, y, r], i) => <circle key={i} cx={x} cy={HY + y} r={r} />)}</g>}
        {h.tipo === 'grisalho' && <path d={`M-40,${HY - 8} Q-38,${HY - 48} 0,${HY - 46} Q38,${HY - 48} 40,${HY - 8} Q30,${HY - 30} 0,${HY - 32} Q-30,${HY - 30} -40,${HY - 8} Z`} fill={h.cor} />}
        {h.tipo === 'grisalho' && <path d={`M-38,${HY - 12} Q-34,${HY - 26} -26,${HY - 30} M38,${HY - 12} Q34,${HY - 26} 26,${HY - 30}`} stroke={h.cor2} strokeWidth={5} fill="none" strokeLinecap="round" />}
        {h.tipo === 'longo' && <path d={`M-42,${HY + 10} Q-46,${HY - 52} 0,${HY - 50} Q46,${HY - 52} 42,${HY + 10} Q36,${HY - 26} 10,${HY - 34} Q-14,${HY - 22} -42,${HY + 10} Z`} fill={h.cor} />}
        {h.tipo === 'peruca' && <><path d={`M-40,${HY - 2} Q-44,${HY - 54} 0,${HY - 52} Q44,${HY - 54} 40,${HY - 2} Q32,${HY - 32} 0,${HY - 34} Q-32,${HY - 32} -40,${HY - 2} Z`} fill={h.cor} />{[-1, 1].map((s) => [0, 1].map((r) => <ellipse key={`${s}${r}`} cx={s * 44} cy={HY - 4 + r * 18} rx={11} ry={8} fill={h.cor} stroke={h.cor2} strokeWidth={2} />))}</>}
        {v.gorro && <><path d={`M-41,${HY - 14} Q-40,${HY - 62} 0,${HY - 62} Q40,${HY - 62} 41,${HY - 14} Z`} fill={v.gorro} /><rect x={-43} y={HY - 22} width={86} height={14} rx={6} fill="#DADADA" /><circle cx={0} cy={HY - 66} r={10} fill={v.gorro} /></>}
        {v.oculosNeve && <><rect x={-36} y={HY - 40} width={72} height={18} rx={9} fill="#2B2D42" /><rect x={-32} y={HY - 37} width={64} height={12} rx={6} fill="#F4A259" opacity={0.85} /></>}
      </g>
    );
    const nuca = (
      <g>
        {h.tipo === 'cacheado' && <g fill={h.cor}>{[[-28, -26, 16], [-12, -40, 17], [6, -42, 17], [22, -36, 16], [32, -18, 14], [-34, -8, 13], [34, 2, 12], [-30, 10, 12], [0, -18, 26], [-14, 6, 16], [14, 6, 16], [0, 14, 15]].map(([x, y, r], i) => <circle key={i} cx={x} cy={HY + y} r={r} />)}</g>}
        {h.tipo !== 'cacheado' && <ellipse cx={0} cy={HY - 4} rx={40} ry={44} fill={h.cor} />}
        {v.gorro && <path d={`M-41,${HY - 14} Q-40,${HY - 62} 0,${HY - 62} Q40,${HY - 62} 41,${HY - 14} Z`} fill={v.gorro} />}
      </g>
    );
    return (
      <g>
        {atras}
        <rect x={-11} y={HY + 34} width={22} height={24} fill={v.peleSombra} />
        <circle cx={-38} cy={HY + 4} r={8} fill={v.peleSombra} />
        <circle cx={38} cy={HY + 4} r={8} fill={v.peleSombra} />
        <ellipse cx={0} cy={HY} rx={38} ry={44} fill={v.pele} />
        <path d={`M14,${HY - 40} Q42,${HY - 20} 36,${HY + 16} Q30,${HY + 40} 6,${HY + 44} Q30,${HY + 20} 14,${HY - 40} Z`} fill={v.peleSombra} opacity={0.45} />
        {rosto}
        {costas ? nuca : frente}
      </g>
    );
  })();
  const gotas = suor > 0 && !costas && (
    <g opacity={suor}>
      {[[-30, -390, 0], [32, -372, 0.8], [-24, -340, 1.6]].map(([x, y, ph], i) => {
        const k = ((t * 0.7 + ph) % 1.6) / 1.6;
        return <path key={i} d={`M${x},${y + k * 30} q-4,8 0,11 q4,-3 0,-11 Z`} fill="#BFE6FF" opacity={1 - k} />;
      })}
    </g>
  );
  return (
    <g>
      {!semPernas && <>{perna(-22)}{perna(22)}</>}
      {costas ? <>{bracoInteiro(SE, A, -1)}{bracoInteiro(SD, B, 1)}{tronco}</> : <>{tronco}{bracoInteiro(SE, A, -1)}{bracoInteiro(SD, B, 1)}</>}
      {cabeca}
      {gotas}
      {geada > 0 && <g opacity={geada} fill="#EAF6FF">{Array.from({length: 26}, (_, i) => <circle key={i} cx={-40 + ((i * 37) % 80)} cy={-410 + ((i * 53) % 60)} r={1.6 + (i % 3)} />)}</g>}
      {/* luz de recorte: fria pela esquerda, quente pela direita */}
      {luzFria > 0 && <path d="M-60,-300 Q-64,-200 -54,-120 L-48,-120 Q-58,-200 -54,-300 Z M-38,-400 Q-50,-364 -38,-330" stroke={'#9FD8FF'} strokeWidth={4} fill="none" opacity={luzFria * 0.9} strokeLinecap="round" />}
      {luzQuente > 0 && <path d="M60,-300 Q64,-200 54,-120 M38,-400 Q50,-364 38,-330" stroke={'#FFB547'} strokeWidth={4} fill="none" opacity={luzQuente * 0.9} strokeLinecap="round" />}
    </g>
  );
};
