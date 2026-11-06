import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Cena de teste: madrugada, luz vermelha e a mensagem chegando no celular.
export const Teste = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const pulso = 0.55 + 0.15 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0607", fontFamily: "Inter, Arial, sans-serif" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(224,24,45,${pulso}) 0%, rgba(10,6,7,0) 60%)`,
        }}
      />
      <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", color: "#fff", fontSize: 180, fontWeight: 800, opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) }}>
        03:00
      </div>
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 90,
          right: 90,
          padding: "40px 48px",
          borderRadius: 40,
          background: "rgba(255,255,255,0.12)",
          color: "#fff",
          transform: `translateY(${(1 - entrada) * -200}px)`,
          opacity: entrada,
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.7 }}>Mãe</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12 }}>Filha, abre o portão.</div>
      </div>
    </AbsoluteFill>
  );
};
