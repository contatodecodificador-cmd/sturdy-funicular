import React from 'react';
import {F} from './theme';
import {lerp, prog, es, QU} from './base';
// ---------- carimbo (selo que bate na tela) ----------
export const Carimbo: React.FC<{lt: number; t0?: number; txt: string; cor?: string; x?: number; y?: number; rot?: number; size?: number}> = ({lt, t0 = 0, txt, cor = QU.lava, x = 960, y = 540, rot = -8, size = 92}) => {
  if (lt < t0) return null;
  const k = prog(lt, t0, t0 + 0.22);
  const sc = lerp(1.7, 1, es(k));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: k}}>
      <div style={{padding: '14px 36px', border: `8px solid ${cor}`, borderRadius: 16, fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: cor, letterSpacing: 6, whiteSpace: 'nowrap', background: 'rgba(6,10,20,0.55)', boxShadow: `0 0 30px ${cor}55`, textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>{txt}</div>
    </div>
  );
};

