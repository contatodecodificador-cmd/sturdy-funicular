import React from 'react';
import {Composition} from 'remotion';
import {Ep01, DURACAO, FPS} from './ep01';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} durationInFrames={Math.ceil(DURACAO * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
