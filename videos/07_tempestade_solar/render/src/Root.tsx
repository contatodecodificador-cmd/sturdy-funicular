import React from 'react';
import {Composition} from 'remotion';
import {Video7, FIM7} from './Video7';
export const Root: React.FC = () => (
  <>
    <Composition id="Video7" component={Video7} durationInFrames={Math.ceil(FIM7 * 30)} fps={30} width={1920} height={1080} />
  </>
);
