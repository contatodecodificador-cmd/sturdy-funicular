import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Legenda palavra por palavra, feita a partir do tempos.json (ferramentas/tempos.py).
// - Mostra de 1 a 3 palavras por vez (um "bloco"), sempre da mesma cena.
// - Cada palavra aparece no instante em que é falada.
// - As palavras da lista "destaques" ganham a cor de destaque.
// - "y" é a altura do meio da legenda na tela (1920 de altura). Fuja dos rostos e das zonas proibidas:
//   nada nos 380 px de baixo (y até 1540) nem nos 140 px de cima.

export type Palavra = { texto: string; inicio: number; fim: number; cena: number };

type Props = {
  palavras: Palavra[];
  destaques?: string[];
  fonte?: string;
  cor?: string;
  corDestaque?: string;
  contorno?: string;
  tamanho?: number;
  y?: number | ((cena: number) => number);
  porBloco?: number;
};

const limpa = (p: string) => p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

export const montarBlocos = (palavras: Palavra[], porBloco = 3) => {
  const blocos: Palavra[][] = [];
  let atual: Palavra[] = [];
  palavras.forEach((p, i) => {
    const anterior = palavras[i - 1];
    const quebra =
      atual.length >= porBloco ||
      (anterior && anterior.cena !== p.cena) ||
      (anterior && /[.,!?…:]$/.test(anterior.texto));
    if (quebra && atual.length) {
      blocos.push(atual);
      atual = [];
    }
    atual.push(p);
  });
  if (atual.length) blocos.push(atual);
  return blocos;
};

export const Legenda: React.FC<Props> = ({
  palavras,
  destaques = [],
  fonte = "sans-serif",
  cor = "#FFFFFF",
  corDestaque = "#F2C14E",
  contorno = "#1B2028",
  tamanho = 96,
  y = 1300,
  porBloco = 3,
}) => {
  const q = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = q / fps;
  const blocos = montarBlocos(palavras, porBloco);
  const bloco = blocos.find((b, i) => {
    const fimDoBloco = blocos[i + 1] ? blocos[i + 1][0].inicio : b[b.length - 1].fim + 0.6;
    return t >= b[0].inicio && t < fimDoBloco;
  });
  if (!bloco) return null;
  const altura = typeof y === "function" ? y(bloco[0].cena) : y;
  const marcadas = new Set(destaques.map(limpa));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 160,
          top: altura - tamanho,
          textAlign: "center",
          fontFamily: fonte,
          fontSize: tamanho,
          lineHeight: 1.05,
          textTransform: "uppercase",
          color: cor,
          WebkitTextStroke: `${Math.round(tamanho / 6)}px ${contorno}`,
          paintOrder: "stroke fill",
        }}
      >
        {bloco.map((p, i) => {
          const visivel = t >= p.inicio - 0.02;
          const entrada = Math.min(1, Math.max(0, (t - p.inicio) / 0.12));
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                opacity: visivel ? 1 : 0,
                transform: `scale(${0.85 + 0.15 * entrada})`,
                color: marcadas.has(limpa(p.texto)) ? corDestaque : cor,
              }}
            >
              {p.texto}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
