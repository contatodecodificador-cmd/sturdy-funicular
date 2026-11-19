import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Espaco, Contador, Palavras, Etiquetas, Fontes, P} from './ui';
import {Cenas} from './scenes';
import {Selo} from './prims';
import {FPS} from './theme';
import data from './data.json';

export const FIM = (data as any).fim_audio as number; // fim da narração
export const FIM_CARD = P(89); // "Agora você sabe."

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const selo = Math.min(1, Math.max(0, (t - (FIM_CARD + 1)) / 0.8));
  return (
    <AbsoluteFill style={{background: '#060A14'}}>
      <style>{'svg{position:absolute;top:0;left:0;overflow:visible}'}</style>
      <Espaco />
      <Cenas fim={FIM_CARD} />
      <Fontes />
      <Etiquetas />
      <Palavras />
      <Contador fimCentro={FIM_CARD} />
      {selo > 0 && <Selo op={selo} />}
    </AbsoluteFill>
  );
};
