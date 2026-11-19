import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Palavras, Etiquetas, Fontes} from './ui';
import {CenasPiloto, HUD, HUD_EVS} from './piloto';

export const FIM = 119.5; // piloto: Intro + Bloco 1 + Bloco 2

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#060A14'}}>
    <style>{'svg{position:absolute;top:0;left:0;overflow:visible} svg text{paint-order:stroke;stroke:rgba(4,7,14,0.85);stroke-width:6px;stroke-linejoin:round}'}</style>
    <CenasPiloto />
    <Fontes />
    <Etiquetas />
    <Palavras />
    <HUD evs={HUD_EVS} />
  </AbsoluteFill>
);
