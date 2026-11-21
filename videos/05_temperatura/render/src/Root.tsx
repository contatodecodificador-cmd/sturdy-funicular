import React from 'react';
import {Composition, Still} from 'remotion';
import {Folha} from './Folha';
import {Piloto, PILOTO_FIM} from './Piloto';
import {Video, FIM} from './Video';
export const Root: React.FC = () => (
  <>
    <Composition id="Piloto" component={Piloto} durationInFrames={Math.ceil(PILOTO_FIM * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Video" component={Video} durationInFrames={Math.ceil(FIM * 30)} fps={30} width={1920} height={1080} />
    <Still id="Folha" component={Folha} width={1920} height={1080} />
  </>
);
