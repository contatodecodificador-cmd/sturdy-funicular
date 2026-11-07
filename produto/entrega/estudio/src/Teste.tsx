import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Vídeo de teste de 3 segundos: se ele aparecer, o estúdio está funcionando.
export const Teste: React.FC = () => {
  const quadro = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrada = spring({ frame: quadro, fps, config: { damping: 14 } });
  const luz = interpolate(quadro, [0, 45, 90], [0.15, 0.45, 0.25]);
  const piscando = Math.floor(quadro / 12) % 2 === 0 ? 1 : 0.25;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0F14",
        backgroundImage: `radial-gradient(circle at 50% 42%, rgba(240,169,59,${luz}), transparent 55%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        color: "#E9E4DA",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#F0A93B",
          boxShadow: "0 0 40px #F0A93B",
          opacity: piscando,
          marginBottom: 60,
        }}
      />
      <div
        style={{
          fontSize: 110,
          fontWeight: 900,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1,
          transform: `scale(${0.8 + entrada * 0.2})`,
          opacity: entrada,
        }}
      >
        Estúdio
        <br />
        <span style={{ color: "#F0A93B" }}>pronto</span>
      </div>
      <div style={{ fontSize: 40, marginTop: 50, opacity: entrada * 0.7 }}>
        Teste de 3 segundos
      </div>
    </AbsoluteFill>
  );
};
