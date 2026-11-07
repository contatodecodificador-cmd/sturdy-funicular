import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Câmera: nenhuma cena fica parada.
// - zoom lento contínuo, de "de" até "ate", durante a cena (padrão 100% → 106%);
// - "socos": nos quadros indicados, um zoom rápido de 110% → 100% em 6 quadros (momentos fortes);
// - "foco": o ponto da tela para onde a câmera chega perto (em %, padrão o centro).
// Como o zoom nunca fica abaixo de 100%, a borda do cenário nunca aparece.

type Props = {
  duracao: number; // em quadros
  de?: number;
  ate?: number;
  socos?: number[]; // quadros (contados a partir do começo da cena)
  foco?: [number, number];
  children: React.ReactNode;
};

export const Camera: React.FC<Props> = ({ duracao, de = 1, ate = 1.06, socos = [], foco = [50, 50], children }) => {
  const q = useCurrentFrame();
  let escala = interpolate(q, [0, Math.max(1, duracao)], [de, ate], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  for (const s of socos) {
    if (q >= s && q < s + 6) {
      escala *= interpolate(q, [s, s + 6], [1.1, 1], { extrapolateRight: "clamp" });
    }
  }
  escala = Math.max(1, escala);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: `${foco[0]}% ${foco[1]}%` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
