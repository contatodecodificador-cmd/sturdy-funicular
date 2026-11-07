import { Composition, Still } from "remotion";
import { Teste } from "./Teste";
import { FolhaBase } from "./personagem/FolhaBase";

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
      <Still id="FolhaBase" component={FolhaBase} width={1080} height={1920} />
    </>
  );
};
