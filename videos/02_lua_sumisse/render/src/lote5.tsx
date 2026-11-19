import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F} from './theme';
import {useT, Cena, Caixa} from './ui';
import {prog, clamp01} from './prims';
import {Lua, Estrelas, Rio, SaoLuis, EspacoReal, MapaReal, Tag, K, lerp, rnd, CronoGrande, fmtCron, Andarilho, Surfista} from './piloto';
import {Mangue} from './lote2';
import {CarnavalRua} from './lote2';
import {Cais} from './lote1';

// foz do rio: aberta × fechada (esquema 2D)
const Foz: React.FC<{fechada: number; t: number; onda?: number}> = ({fechada, t, onda = 0}) => (
  <svg width={1920} height={1080}>
    <rect width={1920} height={1080} fill="#0f2a1c" />
    <path d="M1920,0 L1920,1080 L1380,1080 Q1300,700 1420,380 Q1480,180 1460,0 Z" fill="#14385c" />
    {Array.from({length: 14}, (_, i) => <rect key={i} x={1460 + (i % 3) * 120 + ((t * 20 + i * 40) % 80)} y={80 + i * 70} width={60} height={3} fill="#bfe3ff" opacity={0.25} />)}
    <path d="M0,560 C400,520 800,640 1200,560 Q1320,540 1440,560" stroke="#3b6e8f" strokeWidth={lerp(90, 60, fechada)} fill="none" strokeLinecap="round" />
    <path d="M1180,560 Q1320,540 1460,560" stroke="#6b5440" strokeWidth={100} fill="none" opacity={fechada} strokeLinecap="round" />
    {fechada > 0 && Array.from({length: 18}, (_, i) => <circle key={'v' + i} cx={1200 + rnd(i + 12000) * 240} cy={520 + rnd(i + 12100) * 80} r={6 + rnd(i + 12200) * 8} fill="#2f5a2a" opacity={fechada} />)}
    {/* canal novo (desvio) */}
    <path d="M1000,600 C1080,720 1200,820 1400,900" stroke="#3b6e8f" strokeWidth={lerp(0, 50, onda)} fill="none" strokeLinecap="round" />
    {onda > 0 && (() => { const k = (t * 0.25) % 1, x = lerp(1400, 1000, k), y = lerp(900, 600, k) + Math.sin(k * 3) * 40; return <g><circle cx={x} cy={y} r={18} fill="#fbf6ec" opacity={0.9 * onda} /><circle cx={x} cy={y} r={36} fill="#fbf6ec" opacity={0.25 * onda} /></g>; })()}
  </svg>
);
const Usina: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-120,-60 L120,-60 L150,60 L-150,60 Z" fill="#8a8f98" />
    {[-80, -40, 0, 40, 80].map((d) => <rect key={d} x={d - 12} y={-40} width={24} height={80} fill="#5a606a" />)}
    <path d="M-150,60 L150,60" stroke="#bfe3ff" strokeWidth={6} />
  </g>
);
const Bufalo: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="#1a1512">
    <ellipse cx={0} cy={-50} rx={70} ry={38} />
    <ellipse cx={70} cy={-56} rx={26} ry={20} />
    <path d="M60,-74 Q40,-100 20,-86 M80,-74 Q100,-100 120,-86" stroke="#1a1512" strokeWidth={8} fill="none" strokeLinecap="round" />
    {[-44, -20, 24, 48].map((d, i) => <rect key={d} x={d} y={-24 + Math.sin(f + i * 1.6) * 3} width={12} height={40} rx={4} />)}
  </g>
);

export const CenasLote5: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* B12a — de volta à pergunta: o cronômetro congela no centro */}
      <Cena from={620.3} to={625.9} zoom={0.03} fade={0.5} fixo={
        <>
          <CronoGrande seg={0} k={0} op={0} />
          <div style={{position: 'absolute', top: 380, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 620.6, 621.2)}}>
            <div style={{padding: '22px 46px', borderRadius: 18, background: 'rgba(6,10,20,0.86)', border: `2px solid ${C.ouro}`, fontFamily: F.titulo, fontSize: 92, letterSpacing: 6, color: C.info, boxShadow: '0 16px 40px rgba(0,0,0,0.6)'}}>{fmtCron(1e6 * 365.25 * 86400)}</div>
          </div>
          <div style={{position: 'absolute', top: 640, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 622.8, 623.4)}}><Caixa cor={C.ouro} size={52}>QUANTO TEMPO A GENTE AGUENTARIA?</Caixa></div>
        </>
      }>
        <EspacoReal />
      </Cena>
      {/* B12b — a resposta: espécie × escala das mudanças */}
      <Cena from={625.9} to={638.3} zoom={0.02} fade={0.45} fixo={
        <div style={{position: 'absolute', left: 300, top: 400, width: 1320, padding: '30px 36px', borderRadius: 16, background: 'rgba(6,10,20,0.88)', border: '1px solid rgba(227,176,75,0.25)', fontFamily: F.rotulo, color: C.info, opacity: K(t, 631.0, 631.6)}}>
          {[{n: 'NOSSA ESPÉCIE ATÉ HOJE', v: '~300 MIL ANOS', w: 0.12, c: C.impacto, at: 635.8}, {n: 'MUDANÇAS GRANDES NO EIXO E NO CLIMA', v: 'MILHÕES DE ANOS', w: 1, c: C.perigo, at: 631.6}].map((b) => (
            <div key={b.n} style={{marginTop: 14, opacity: K(t, b.at, b.at + 0.5)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, letterSpacing: 2}}><span>{b.n}</span><span style={{fontFamily: F.titulo, fontSize: 30}}>{b.v}</span></div>
              <div style={{marginTop: 10, height: 26, width: 1240 * b.w * K(t, b.at, b.at + 1.2), borderRadius: 5, background: b.c}} />
            </div>
          ))}
        </div>
      }>
        <EspacoReal />
      </Cena>
      {/* B12c — quem sente primeiro: montagem rápida */}
      <Cena from={638.3} to={643.0} zoom={0.04} fade={0.35}>
        <Cais nivel={lerp(2, 5, (Math.sin(t) + 1) / 2)} luz={0.45} />
      </Cena>
      <Cena from={643.0} to={644.8} zoom={0.06} fade={0.25} fixo={<Tag x={960} y={960} anchor="middle" cor={C.ouro}>O CARANGUEJO DA ANDADA</Tag>}>
        <Mangue lua={1} saem={1} />
      </Cena>
      <Cena from={644.8} to={645.7} zoom={0.06} fade={0.2} fixo={<Tag x={960} y={960} anchor="middle" cor={C.impacto}>O MANGUE</Tag>}>
        <Mangue lua={1} saem={0} luz={0.8} />
      </Cena>
      <Cena from={645.7} to={647.0} zoom={0.06} fade={0.2} fixo={<Tag x={960} y={960} anchor="middle" cor={C.dado}>O PEIXE DA BEIRA</Tag>}>
        <AbsoluteFill style={{background: 'linear-gradient(#0d2a44, #071a2e)'}} />
        <svg width={1920} height={1080}>
          {Array.from({length: 9}, (_, i) => { const x = 200 + i * 190, y = 540 + Math.sin(t * 3 + i) * 40; return <g key={i} transform={`translate(${x + ((t * 80) % 190)},${y})`}><ellipse rx={50} ry={18} fill="#9fb7c9" /><path d="M48,0 L84,-20 L84,20 Z" fill="#9fb7c9" /><circle cx={-30} cy={-4} r={4} fill="#111" /></g>; })}
        </svg>
      </Cena>
      <Cena from={647.0} to={650.0} zoom={0.05} fade={0.25} fixo={
        <>
          <Tag x={960} y={960} anchor="middle" cor={C.ouro}>O PESCADOR E A TÁBUA DE MARÉS</Tag>
          <div style={{position: 'absolute', left: 1080, top: 300, width: 420, padding: 24, background: '#f4efe3', borderRadius: 6, transform: 'rotate(4deg)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', fontFamily: F.rotulo, color: '#222'}}>
            <div style={{fontWeight: 700, fontSize: 20, letterSpacing: 2}}>TÁBUA DE MARÉS</div>
            {['04:12  0,6 m', '10:31  6,4 m', '16:40  0,8 m', '22:58  6,1 m'].map((l) => <div key={l} style={{fontFamily: 'monospace', fontSize: 24, marginTop: 10}}>{l}</div>)}
            <div style={{fontSize: 14, marginTop: 10, color: '#666'}}>valores ilustrativos</div>
          </div>
        </>
      }>
        <Cais nivel={1} luz={0.5} />
      </Cena>
      <Cena from={650.0} to={651.9} zoom={0.05} fade={0.25} fixo={<Tag x={960} y={960} anchor="middle" cor={C.ouro}>E A ONDA QUE SOBE O RIO</Tag>}>
        <Rio noite={0.4} lua={1} onda={0.4 + prog(t, 650, 652) * 0.2} ondaAlt={80} canoa={false} />
      </Cena>

      {/* FECHO a — Araguari no mapa */}
      <Cena from={651.9} to={663.8} zoom={0} fade={0.45} fixo={
        (() => { const z = K(t, 652.4, 655.0); const s = lerp(22, 140, z); const q = [960 + (-50.1 - lerp(-53, -50.6, z)) * s, 540 - (1.25 - lerp(-15, 1.0, z)) * s]; return <Tag x={q[0] + 30} y={q[1]} cor={C.ouro} op={K(t, 656.8, 657.4)}>FOZ DO RIO ARAGUARI (AP)</Tag>; })()
      }>
        {t < 660.6 ? (() => { const z = K(t, 652.4, 655.0); return (
          <MapaReal lonC={lerp(-53, -50.6, z)} latC={lerp(-15, 1.0, z)} s={lerp(22, 140, z)}>
            {(p) => { const q = p(-50.1, 1.25); return <g opacity={K(t, 656.4, 657.0)}><circle cx={q[0]} cy={q[1]} r={34 + 8 * Math.sin(t * 4)} fill={C.ouro} opacity={0.22} /><circle cx={q[0]} cy={q[1]} r={9} fill={C.ouro} stroke="#fff" strokeWidth={2} /></g>; }}
          </MapaReal>
        ); })() : <Foz fechada={K(t, 661.0, 662.8)} t={t} />}
      </Cena>
      {/* FECHO b — não foi a Lua: ela continuava puxando a maré */}
      <Cena from={663.8} to={668.6} zoom={0.04} fade={0.4} fixo={<Tag x={960} y={960} anchor="middle" cor={C.impacto} op={K(t, 665.4, 666.0)}>A LUA CONTINUAVA LÁ · TODO MÊS</Tag>}>
        <Rio noite={0.85} lua={1} onda={0} ondaAlt={0} canoa={false} />
      </Cena>
      {/* FECHO c — a foz fechou: lama, hidrelétricas, búfalos */}
      <Cena from={668.6} to={676.0} zoom={0.03} fade={0.4} fixo={
        <>
          <Tag x={1320} y={300} anchor="middle" cor={C.perigo} op={K(t, 669.4, 670.0)}>FOZ ENTUPIDA DE LAMA</Tag>
          <Tag x={360} y={300} anchor="middle" cor={C.cinza} op={K(t, 671.6, 672.2)}>HIDRELÉTRICAS RIO ACIMA</Tag>
          <Tag x={760} y={860} anchor="middle" cor={C.cinza} op={K(t, 673.6, 674.2)}>CANAIS ABERTOS PELOS BÚFALOS</Tag>
        </>
      }>
        <Foz fechada={1} t={t} />
        <svg width={1920} height={1080}>
          <g opacity={K(t, 671.6, 672.2)}><Usina x={360} y={520} /></g>
          <g opacity={K(t, 673.6, 674.2)}>{[0, 1, 2].map((i) => <Bufalo key={i} x={640 + i * 140} y={760 + (i % 2) * 20} s={0.9} f={t * 4 + i} />)}<path d="M600,640 C700,700 820,720 960,700" stroke="#3b6e8f" strokeWidth={14} fill="none" /></g>
        </svg>
      </Cena>
      {/* FECHO d — onze anos depois, ela voltou por um caminho novo */}
      <Cena from={676.0} to={680.8} zoom={0.04} fade={0.45} fixo={<Tag x={960} y={250} anchor="middle" cor={C.impacto} op={K(t, 678.2, 678.8)}>POR UM CAMINHO NOVO</Tag>}>
        <Foz fechada={1} t={t} onda={K(t, 676.6, 678.0)} />
      </Cena>
      {/* FECHO e — a Lua não vai sumir: São Luís / caranguejo / Carnaval */}
      <Cena from={680.8} to={684.7} zoom={0.05} fade={0.4}>
        <Rio noite={0.7} lua={1} ly={lerp(480, 300, prog(t, 680.8, 684.7))} onda={0} ondaAlt={0} canoa />
      </Cena>
      <Cena from={684.7} to={685.9} zoom={0.06} fade={0.2}><SaoLuis luz={1} lua={1} /></Cena>
      <Cena from={685.9} to={687.4} zoom={0.06} fade={0.2}><Mangue lua={1} saem={1} /></Cena>
      <Cena from={687.4} to={689.0} zoom={0.06} fade={0.2}><CarnavalRua /></Cena>
      <Cena from={689.0} to={691.9} zoom={0.04} fade={0.4} fixo={<div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 689.6, 690.2)}}><Caixa cor={C.ouro} size={54}>O QUE PODE SUMIR É O QUE A GENTE DEIXA SUMIR</Caixa></div>}>
        <Rio noite={0.8} lua={1} onda={0} ondaAlt={0} canoa={false} />
      </Cena>
      {/* FECHO f — olha pra ela hoje à noite */}
      <Cena from={691.9} to={698.7} zoom={0.06} fade={0.5}>
        <AbsoluteFill style={{background: 'linear-gradient(#08101f, #1a2a48 60%, #3a3a58)'}}><Estrelas k={0.6} /></AbsoluteFill>
        <svg width={1920} height={1080}>
          <defs><radialGradient id="lnasc"><stop offset="0%" stopColor="#ffe4b0" stopOpacity={0.5} /><stop offset="100%" stopColor="#ffe4b0" stopOpacity={0} /></radialGradient></defs>
          <circle cx={1260} cy={lerp(700, 470, prog(t, 691.9, 698.7))} r={300} fill="url(#lnasc)" />
          <Lua x={1260} y={lerp(700, 470, prog(t, 691.9, 698.7))} r={110} on={1} id="fim" />
          <rect y={720} width={1920} height={360} fill="#0b1426" />
          {Array.from({length: 10}, (_, i) => <rect key={i} x={1200 + Math.sin(t * 2 + i) * 16} y={740 + i * 30} width={140 - i * 10} height={4} rx={2} fill="#ffe4b0" opacity={0.4} />)}
          <path d="M0,760 L700,760 L760,1080 L0,1080 Z" fill="#05070c" />
          <g transform="translate(470,760) scale(1.5)"><Andarilho c="#05070c" fase={0} borda="rgba(255,228,176,0.5)" /></g>
        </svg>
      </Cena>
      {/* FECHO g — cronômetro zera + selo do canal */}
      <Cena from={698.7} to={712.0} zoom={0.02} fade={0.6} fixo={
        <>
          <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: K(t, 699.0, 699.6)}}>
            <div style={{padding: '18px 40px', borderRadius: 16, background: 'rgba(6,10,20,0.86)', border: `2px solid ${C.ouro}`, fontFamily: F.titulo, fontSize: 84, letterSpacing: 6, color: C.info}}>{fmtCron(0)}</div>
            <div style={{marginTop: 14, fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 8, color: '#B9C2D3'}}>A LUA CONTINUA AQUI</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, display: 'flex', justifyContent: 'center', opacity: K(t, 700.4, 701.2)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '20px 34px', borderRadius: 18, background: 'rgba(6,10,20,0.86)', border: '1px solid rgba(227,176,75,0.3)'}}>
              <Img src={staticFile('perfil.png')} style={{width: 120, height: 120, borderRadius: 60, border: `2px solid ${C.ouro}`}} />
              <div>
                <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 46, color: C.info, letterSpacing: 2}}>BRASIL MILENAR</div>
                <div style={{marginTop: 10, display: 'inline-block', padding: '10px 26px', borderRadius: 24, background: t > 703.0 ? '#3a3f4a' : '#e5322d', transform: `scale(${t > 702.8 && t < 703.2 ? 0.92 : 1})`, fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 1}}>{t > 703.0 ? 'INSCRITO ✓' : 'INSCREVER-SE'}</div>
              </div>
            </div>
          </div>
        </>
      }>
        <EspacoReal />
      </Cena>
    </>
  );
};

export const HUD_LOTE5: any[] = [];
