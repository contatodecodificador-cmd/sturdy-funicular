import React from 'react';
import {Composition, Still} from 'remotion';
import {Ep01, DURACAO, FPS} from './ep01';
import {CapaEp01, StoriesEp01, STORIES_DUR} from './extras';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} durationInFrames={Math.ceil(DURACAO * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="StoriesEp01" component={StoriesEp01} durationInFrames={STORIES_DUR * FPS} fps={FPS} width={1080} height={1920} />
    <Still id="CapaEp01" component={CapaEp01} width={1080} height={1920} />
  </>
);
