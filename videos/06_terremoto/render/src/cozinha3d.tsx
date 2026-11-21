import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';

// liga quando os mp4 estiverem em public/cozinha3d/
export const USAR_3D = false;

// Planos 3D da cozinha (Blender/Cycles). Cada mp4 começa exatamente no instante "a" do plano.
export const PLANOS3D: [number, string][] = [
  [47.4, 'p1'], [60.3, 'p2'], [65.3, 'p3'], [78.5, 'p4'], [80.7, 'p5'],
  [87.5, 'c01'], [141.0, 'c02'], [216.0, 'c03'], [218.6, 'c04'], [221.2, 'c05'], [225.967, 'c06'], [230.733, 'c07'],
  [368.9, 'c08'], [372.8, 'c09'], [376.7, 'c10'], [425.1, 'c11'], [474.0, 'c12'], [477.8, 'c13'], [570.7, 'c14'],
  [676.5, 'c15'], [681.333, 'c16'], [686.167, 'c17'], [716.2, 'c18'], [718.75, 'c19'], [785.6, 'c20'], [790.0, 'c21'], [794.4, 'c22'],
];
export const plano3d = (a: number): string | null => { for (const [t, id] of PLANOS3D) if (Math.abs(t - a) < 0.05) return id; return null; };

export const Cozinha3D: React.FC<{a: number}> = ({a}) => {
  const id = plano3d(a);
  if (!id) return null;
  return (
    <Sequence from={Math.round(a * 30)} layout="none">
      <AbsoluteFill style={{background: '#000'}}>
        <OffthreadVideo src={staticFile(`cozinha3d/${id}.mp4`)} muted style={{width: '100%', height: '100%'}} />
      </AbsoluteFill>
    </Sequence>
  );
};
