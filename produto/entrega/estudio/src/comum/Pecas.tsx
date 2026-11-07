import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Peças de tela que entram animadas. "em" é o quadro (dentro da cena) em que a peça entra.
// Dica: numa imagem parada (capa), use "em" negativo para a peça já aparecer pronta.

const useEntrada = (em: number) => {
  const q = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: q - em, fps, config: { damping: 13, stiffness: 160 } });
};

// Etiqueta: pílula com texto curto (lugar, hora, aviso).
export const Etiqueta: React.FC<{ texto: string; x: number; y: number; em?: number; fundo?: string; cor?: string; fonte?: string; tamanho?: number }> = ({
  texto, x, y, em = 0, fundo = "#FFF8EC", cor = "#1B2028", fonte = "sans-serif", tamanho = 44,
}) => {
  const e = useEntrada(em);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${e})`, transformOrigin: "left center", opacity: e,
      background: fundo, color: cor, fontFamily: fonte, fontSize: tamanho, padding: "10px 24px", borderRadius: 999,
      boxShadow: "0 10px 24px rgba(0,0,0,.35)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {texto}
    </div>
  );
};

// Cartão da escolha do fim da parte: duas opções e um relógio de 10 segundos.
export const CartaoEscolha: React.FC<{ pergunta: string; a: string; b: string; em?: number; fonte?: string; corA?: string; corB?: string; y?: number }> = ({
  pergunta, a, b, em = 0, fonte = "sans-serif", corA = "#F2C14E", corB = "#7EC8E3", y = 520,
}) => {
  const q = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useEntrada(em);
  const passou = Math.max(0, (q - em) / fps);
  const resta = Math.max(0, 10 - passou);
  const volta = interpolate(passou, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const r = 54, c = 2 * Math.PI * r;
  const opcao = (texto: string, corFundo: string, letra: string) => (
    <div style={{ flex: 1, background: corFundo, borderRadius: 28, padding: "34px 20px", textAlign: "center", boxShadow: "0 14px 30px rgba(0,0,0,.35)" }}>
      <div style={{ fontSize: 40, opacity: 0.7 }}>{letra}</div>
      <div style={{ fontSize: 84, lineHeight: 1 }}>{texto}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 90, right: 170, top: y, transform: `scale(${e})`, opacity: e, fontFamily: fonte, color: "#1B2028", textTransform: "uppercase" }}>
      <div style={{ background: "#FFF8EC", borderRadius: 28, padding: "26px 30px", fontSize: 58, lineHeight: 1.05, textAlign: "center", marginBottom: 24 }}>{pergunta}</div>
      <div style={{ display: "flex", gap: 24 }}>
        {opcao(a, corA, "A")}
        {opcao(b, corB, "B")}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <svg width={140} height={140} viewBox="0 0 140 140">
          <circle cx={70} cy={70} r={r} fill="#FFF8EC" />
          <circle cx={70} cy={70} r={r} fill="none" stroke="#1B2028" strokeWidth={10} strokeDasharray={c} strokeDashoffset={c * volta} transform="rotate(-90 70 70)" />
          <text x={70} y={86} textAnchor="middle" fontFamily={fonte} fontSize={52} fill="#1B2028">{Math.ceil(resta)}</text>
        </svg>
      </div>
    </div>
  );
};
