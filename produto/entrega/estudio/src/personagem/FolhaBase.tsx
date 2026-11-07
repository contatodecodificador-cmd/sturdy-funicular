import { AbsoluteFill } from "remotion";
import { Expressao, PersonagemBase, PersonagemProps } from "./PersonagemBase";

// Folha de exemplo: o personagem-base puro e alguns jeitos de vestir, mais as expressões.
// Gere a imagem com: npx remotion still src/index.ts FolhaBase saida/folha-base.png

const exemplos: { nome: string; props: PersonagemProps }[] = [
  { nome: "base", props: {} },
  { nome: "cabelo curto + xadrez", props: { cabelo: "curto", roupa: "xadrez" } },
  { nome: "coque + óculos", props: { pele: "#8D5A3B", cabelo: "coque", corCabelo: "#1E1410", roupa: "gola-v", corRoupa: "#2F6FA3", acessorio: "oculos" } },
  { nome: "gorro", props: { pele: "#C68B63", cabelo: "curto", corCabelo: "#5A4134", roupa: "camiseta", corRoupa: "#7A5C3E", acessorio: "gorro", corAcessorio: "#C9962B" } },
  { nome: "cacheado + laço", props: { pele: "#6E4630", cabelo: "cacheado", corCabelo: "#24170F", roupa: "camiseta", corRoupa: "#D96C4A", acessorio: "laco", corAcessorio: "#F2C14E" } },
  { nome: "longo + boné", props: { pele: "#F1C7A5", cabelo: "longo", corCabelo: "#B5651D", roupa: "gola-v", corRoupa: "#5FA36A", acessorio: "bone", corAcessorio: "#2F5D8A" } },
];

const expressoes: Expressao[] = ["neutro", "feliz", "surpreso", "triste", "bravo", "desconfiado"];

const Rotulo: React.FC<{ texto: string }> = ({ texto }) => (
  <div style={{ fontFamily: "sans-serif", fontSize: 26, color: "#E9E4DA", textAlign: "center", marginTop: 6 }}>{texto}</div>
);

export const FolhaBase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F14", padding: 60, color: "#E9E4DA" }}>
      <div style={{ fontFamily: "sans-serif", fontSize: 56, fontWeight: 900, textTransform: "uppercase" }}>
        Personagem-<span style={{ color: "#F0A93B" }}>base</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: 30, marginTop: 40 }}>
        {exemplos.map((e) => (
          <div key={e.nome} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PersonagemBase altura={360} piscar={false} {...e.props} />
            <Rotulo texto={e.nome} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "sans-serif", fontSize: 40, fontWeight: 900, marginTop: 50, textTransform: "uppercase" }}>
        Expressões
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", marginTop: 20 }}>
        {expressoes.map((x) => (
          <div key={x} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PersonagemBase altura={180} piscar={false} cabelo="curto" roupa="camiseta" corRoupa="#2F6FA3" expressao={x} />
            <Rotulo texto={x} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
