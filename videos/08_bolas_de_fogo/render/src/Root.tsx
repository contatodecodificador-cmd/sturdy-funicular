import React from 'react';
import {Composition} from 'remotion';
import {Video8, FIM8, PLANOS} from './Video8';
import {Graficos, FIM_G} from './Graficos';
const FIM_P2 = PLANOS.find((p) => p.par === 21)!.t0;
const FIM_INTRO = PLANOS.find((p) => p.par === 10)!.t0;
export const Root: React.FC = () => (
  <>
    <Composition id="Video8" component={Video8} durationInFrames={Math.ceil(FIM8 * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Intro8" component={Video8} durationInFrames={Math.ceil(FIM_INTRO * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Piloto8" component={Video8} durationInFrames={Math.ceil(FIM_P2 * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Graficos" component={Graficos} durationInFrames={Math.ceil(FIM_G * 30)} fps={30} width={1920} height={1080} />
  </>
);
