import React from 'react';
import {Composition, Still} from 'remotion';
import {Ep01, DURACAO, FPS} from './ep01';
import {CapaEp01, StoriesEp01, STORIES_DUR} from './extras';
import {Ep02, DURACAO02} from './ep02';
import {CapaEp02, StoriesEp02, STORIES2_DUR, EnqueteEp02} from './extras2';
import {ResultadoEp02, AvisoEp03} from './extras3';
import {Ep03, DURACAO03} from './ep03';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} durationInFrames={Math.ceil(DURACAO * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Ep02" component={Ep02} durationInFrames={Math.ceil(DURACAO02 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Ep03" component={Ep03} durationInFrames={Math.ceil(DURACAO03 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="StoriesEp01" component={StoriesEp01} durationInFrames={STORIES_DUR * FPS} fps={FPS} width={1080} height={1920} />
    <Composition id="StoriesEp02" component={StoriesEp02} durationInFrames={Math.round(STORIES2_DUR * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="ResultadoEp02" component={ResultadoEp02} width={1080} height={1920} />
    <Still id="AvisoEp03" component={AvisoEp03} width={1080} height={1920} />
    <Still id="EnqueteEp02" component={EnqueteEp02} width={1080} height={1920} />
    <Still id="CapaEp02" component={CapaEp02} width={1080} height={1920} />
    <Still id="CapaEp01" component={CapaEp01} width={1080} height={1920} />
  </>
);
