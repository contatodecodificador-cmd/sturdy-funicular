import { Composition } from "remotion";
import { Teste } from "./Teste";

// Formato do Reel: vertical, 1080x1920, 30 quadros por segundo.
export const Root = () => (
  <Composition
    id="Teste"
    component={Teste}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={150}
  />
);
