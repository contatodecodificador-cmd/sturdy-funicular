import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Palavras, Etiquetas, Fontes} from './ui';
import {CenasPiloto, HUD, HUD_EVS} from './piloto';

export const FIM = 119.5; // piloto: Intro + Bloco 1 + Bloco 2

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#060A14'}}>
    <style>{'svg{position:absolute;top:0;left:0;overflow:visible}'}</style>
    <CenasPiloto />
    <Fontes />
    <Etiquetas />
    <Palavras />
    <HUD evs={HUD_EVS} />
  </AbsoluteFill>
);
