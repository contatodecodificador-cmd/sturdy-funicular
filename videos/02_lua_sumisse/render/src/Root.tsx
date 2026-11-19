import React from 'react';
import {Composition} from 'remotion';
import {Video, FIM} from './Video';
export const Root: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={Math.ceil(FIM * 30)} fps={30} width={1920} height={1080} />
);
