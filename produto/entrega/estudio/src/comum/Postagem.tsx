import { AbsoluteFill } from "remotion";

// Peças para a postagem (passo 9). Imagens paradas: o que estiver animado precisa já aparecer pronto.
// Regra da grade do perfil: o Instagram mostra a capa cortada no meio (formato 3:4). Título e rosto
// ficam na faixa do meio: mais ou menos de y 300 a y 1620.

type Base = { fonte?: string; corDestaque?: string; children?: React.ReactNode };

// Capa do vídeo: o cenário com os personagens (children), um título curto e o número da parte.
export const Capa: React.FC<Base & { titulo: string; destaque?: string; parte: string; serie?: string }> = ({
  titulo, destaque, parte, serie, fonte = "sans-serif", corDestaque = "#F2C14E", children,
}) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,.6) 100%)" }} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 330, textAlign: "center", fontFamily: fonte, textTransform: "uppercase", color: "#fff",
      fontSize: 120, lineHeight: 0.95, WebkitTextStroke: "16px #1B2028", paintOrder: "stroke fill" }}>
      {titulo}
      {destaque ? <><br /><span style={{ color: corDestaque }}>{destaque}</span></> : null}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", gap: 18, fontFamily: fonte, textTransform: "uppercase" }}>
      {serie ? <div style={{ background: "#FFF8EC", color: "#1B2028", fontSize: 44, padding: "10px 26px", borderRadius: 999 }}>{serie}</div> : null}
      <div style={{ background: corDestaque, color: "#1B2028", fontSize: 44, padding: "10px 26px", borderRadius: 999 }}>{parte}</div>
    </div>
  </AbsoluteFill>
);

// Stories da enquete: a pergunta, as duas opções e um espaço vazio no meio para o adesivo de enquete da rede.
export const StoriesEnquete: React.FC<Base & { pergunta: string; a: string; b: string; rodape?: string }> = ({
  pergunta, a, b, rodape = "a mais votada vira a próxima parte", fonte = "sans-serif", corDestaque = "#F2C14E", children,
}) => (
  <AbsoluteFill>
    {children}
    <AbsoluteFill style={{ background: "rgba(10,14,18,.6)" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 260, textAlign: "center", fontFamily: fonte, textTransform: "uppercase", color: "#fff", fontSize: 92, lineHeight: 1 }}>
      {pergunta}
    </div>
    <div style={{ position: "absolute", left: 140, right: 140, top: 760, height: 420, border: "6px dashed rgba(255,255,255,.55)", borderRadius: 40,
      display: "grid", placeItems: "center", fontFamily: fonte, color: "rgba(255,255,255,.75)", fontSize: 40, textTransform: "uppercase", textAlign: "center" }}>
      cole aqui o adesivo de enquete
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 1290, display: "flex", gap: 24, fontFamily: fonte, textTransform: "uppercase" }}>
      <div style={{ flex: 1, background: corDestaque, color: "#1B2028", borderRadius: 28, padding: "26px 10px", textAlign: "center", fontSize: 72 }}>A · {a}</div>
      <div style={{ flex: 1, background: "#FFF8EC", color: "#1B2028", borderRadius: 28, padding: "26px 10px", textAlign: "center", fontSize: 72 }}>B · {b}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: fonte, color: "#fff", fontSize: 40, textTransform: "uppercase" }}>{rodape}</div>
  </AbsoluteFill>
);

// Faixa "parte nova no ar" por cima de um trecho do vídeo (Stories de chamada).
export const FaixaChamada: React.FC<{ texto?: string; fonte?: string; corDestaque?: string }> = ({
  texto = "parte nova no ar", fonte = "sans-serif", corDestaque = "#F2C14E",
}) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 180, display: "flex", justifyContent: "center" }}>
    <div style={{ background: corDestaque, color: "#1B2028", fontFamily: fonte, textTransform: "uppercase", fontSize: 60, padding: "12px 34px", borderRadius: 999,
      boxShadow: "0 12px 30px rgba(0,0,0,.4)" }}>{texto}</div>
  </div>
);
