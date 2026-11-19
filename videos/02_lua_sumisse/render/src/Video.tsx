import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Palavras, Etiquetas, Fontes} from './ui';
import {CenasPiloto, HUD, HUD_EVS} from './piloto';
import {CenasLote1, HUD_LOTE1} from './lote1';
import {CenasLote2, HUD_LOTE2} from './lote2';
import {CenasLote3, HUD_LOTE3} from './lote3';
import {CenasLote4, HUD_LOTE4} from './lote4';
import {CenasLote5} from './lote5';

export const FIM = 712.0; // vídeo completo (narração termina em 705,8 s)

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#060A14'}}>
    <style>{'svg{position:absolute;top:0;left:0;overflow:visible} svg text{paint-order:stroke;stroke:rgba(4,7,14,0.85);stroke-width:6px;stroke-linejoin:round}'}</style>
    <CenasPiloto />
    <CenasLote1 />
    <CenasLote2 />
    <CenasLote3 />
    <CenasLote4 />
    <CenasLote5 />
    <Fontes />
    <Etiquetas />
    <Palavras />
    <HUD evs={[...HUD_EVS, ...HUD_LOTE1, ...HUD_LOTE2, ...HUD_LOTE3, ...HUD_LOTE4]} />
  </AbsoluteFill>
);
