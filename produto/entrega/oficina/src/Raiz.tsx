import { Composition } from "remotion";
import { Teste } from "./Teste";

// Cada vídeo do canal é registrado aqui.
export const Raiz: React.FC = () => {
  return (
    <>
      <Composition
        id="Teste"
        component={Teste}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
