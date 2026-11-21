import React from 'react';
import {Composition} from 'remotion';
import {Piloto6, PILOTO6_FIM} from './Piloto6';
import {Video6, FIM6} from './Video6';
export const Root: React.FC = () => (
  <>
    <Composition id="Piloto6" component={Piloto6} durationInFrames={Math.ceil(PILOTO6_FIM * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Video6" component={Video6} durationInFrames={Math.ceil(FIM6 * 30)} fps={30} width={1920} height={1080} />
  </>
);
