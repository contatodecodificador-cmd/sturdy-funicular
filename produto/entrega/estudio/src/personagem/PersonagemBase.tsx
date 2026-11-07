import { useCurrentFrame } from "remotion";

// Personagem-base do Estúdio do Nogueira.
// Um rosto, olhos, boca e corpo. Cabelo, roupa, acessório, cores e expressão são escolhidos por você.
// Desenho em SVG: 320 de largura por 336 de altura. Para mudar o tamanho, use a propriedade "altura".
// Referências úteis para peças novas: centro do rosto (160, 148), raio 74; olhos em y 146 (x 134 e 186);
// boca em y 188; pescoço de y 214 a 248; ombros a partir de y 244.

export type Cabelo = "nenhum" | "curto" | "longo" | "coque" | "cacheado";
export type Roupa = "nenhuma" | "camiseta" | "xadrez" | "gola-v";
export type Acessorio = "nenhum" | "oculos" | "gorro" | "bone" | "laco";
export type Expressao = "neutro" | "feliz" | "surpreso" | "triste" | "bravo" | "desconfiado";

export type PersonagemProps = {
  altura?: number;
  pele?: string;
  cabelo?: Cabelo;
  corCabelo?: string;
  roupa?: Roupa;
  corRoupa?: string;
  acessorio?: Acessorio;
  corAcessorio?: string;
  expressao?: Expressao;
  falando?: boolean;
  piscar?: boolean;
  // Peças extras que o base não tem (fone, cachecol, barba, avental…), desenhadas no mesmo espaço
  // de 320 x 336: "frente" fica por cima do personagem; "atras" fica por trás dele.
  frente?: React.ReactNode;
  atras?: React.ReactNode;
};

const escurecer = (hex: string, quanto = 0.22) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const c = (v: number) => Math.max(0, Math.round(v * (1 - quanto)));
  const r = c((n >> 16) & 255), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const OLHO_Y = 146;

const Olhos: React.FC<{ expressao: Expressao; fechado: boolean }> = ({ expressao, fechado }) => {
  const cor = "#1B2028";
  if (fechado) {
    return (
      <g stroke={cor} strokeWidth={4} strokeLinecap="round">
        <path d={`M124 ${OLHO_Y} H144`} />
        <path d={`M176 ${OLHO_Y} H196`} />
      </g>
    );
  }
  const ry = expressao === "surpreso" ? 14 : expressao === "desconfiado" ? 6 : 11;
  return (
    <g fill={cor}>
      <ellipse cx={134} cy={OLHO_Y} rx={8} ry={ry} />
      <ellipse cx={186} cy={OLHO_Y} rx={8} ry={ry} />
      <circle cx={137} cy={OLHO_Y - 4} r={2.5} fill="#fff" />
      <circle cx={189} cy={OLHO_Y - 4} r={2.5} fill="#fff" />
    </g>
  );
};

const Sobrancelhas: React.FC<{ expressao: Expressao; cor: string }> = ({ expressao, cor }) => {
  const formas: Record<Expressao, [string, string]> = {
    neutro: ["M120 122 Q134 116 148 122", "M172 122 Q186 116 200 122"],
    feliz: ["M120 120 Q134 112 148 120", "M172 120 Q186 112 200 120"],
    surpreso: ["M120 112 Q134 104 148 112", "M172 112 Q186 104 200 112"],
    triste: ["M120 120 Q134 122 148 114", "M172 114 Q186 122 200 120"],
    bravo: ["M120 116 Q134 120 148 128", "M172 128 Q186 120 200 116"],
    desconfiado: ["M120 128 Q134 124 148 128", "M172 116 Q186 110 200 118"],
  };
  const [e, d] = formas[expressao];
  return (
    <g fill="none" stroke={cor} strokeWidth={5} strokeLinecap="round">
      <path d={e} />
      <path d={d} />
    </g>
  );
};

const Boca: React.FC<{ expressao: Expressao; aberta: boolean }> = ({ expressao, aberta }) => {
  const cor = "#7A4A33";
  if (aberta) return <ellipse cx={160} cy={188} rx={12} ry={9} fill="#5A2E22" />;
  const formas: Record<Expressao, string> = {
    neutro: "M144 188 Q160 192 176 188",
    feliz: "M136 182 Q160 202 184 182",
    surpreso: "",
    triste: "M140 194 Q160 180 180 194",
    bravo: "M142 192 Q160 186 178 192",
    desconfiado: "M144 190 Q164 192 178 184",
  };
  if (expressao === "surpreso") return <ellipse cx={160} cy={190} rx={8} ry={10} fill="#5A2E22" />;
  return <path d={formas[expressao]} fill="none" stroke={cor} strokeWidth={5} strokeLinecap="round" />;
};

const CabeloAtras: React.FC<{ tipo: Cabelo; cor: string }> = ({ tipo, cor }) => {
  if (tipo === "longo") return <path d="M82 150 Q76 64 160 60 Q244 64 238 150 L246 250 Q160 266 74 250 Z" fill={cor} />;
  if (tipo === "cacheado")
    return (
      <g fill={cor}>
        {[[96, 96], [124, 70], [160, 60], [196, 70], [224, 96], [236, 132], [84, 132], [90, 168], [230, 168]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={30} />
        ))}
      </g>
    );
  return null;
};

const CabeloFrente: React.FC<{ tipo: Cabelo; cor: string }> = ({ tipo, cor }) => {
  const brilho = escurecer(cor, -0.35);
  if (tipo === "curto" || tipo === "longo")
    return (
      <g>
        <path d="M86 140 Q80 70 160 66 Q242 70 234 140 Q226 104 196 98 Q176 112 140 104 Q104 104 86 140 Z" fill={cor} />
        <path d="M120 82 Q150 70 176 78" fill="none" stroke={brilho} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  if (tipo === "coque")
    return (
      <g fill={cor}>
        <circle cx={160} cy={58} r={30} />
        <path d="M86 140 Q80 74 160 70 Q240 74 234 140 Q220 100 160 96 Q100 100 86 140 Z" />
      </g>
    );
  if (tipo === "cacheado")
    return (
      <g fill={cor}>
        {[[112, 92], [140, 80], [170, 78], [200, 88], [222, 108], [98, 112]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={20} />
        ))}
      </g>
    );
  return null;
};

const Corpo: React.FC<{ roupa: Roupa; cor: string; pele: string }> = ({ roupa, cor, pele }) => {
  const ombro = "M66 336 Q66 252 160 244 Q254 252 254 336 Z";
  const sombra = escurecer(cor);
  return (
    <g>
      <rect x={146} y={214} width={28} height={34} rx={8} fill={escurecer(pele, 0.08)} />
      <path d={ombro} fill={roupa === "nenhuma" ? "#2A3340" : cor} stroke={roupa === "nenhuma" ? "#4A5566" : sombra} strokeWidth={2} />
      {roupa === "xadrez" && (
        <g opacity={0.35}>
          <defs>
            <pattern id="estudio-xadrez" width={24} height={24} patternUnits="userSpaceOnUse">
              <rect width={12} height={24} fill="#000" opacity={0.5} />
              <rect width={24} height={12} fill="#000" opacity={0.35} />
            </pattern>
          </defs>
          <path d={ombro} fill="url(#estudio-xadrez)" />
        </g>
      )}
      {(roupa === "gola-v" || roupa === "xadrez") && (
        <path d="M136 248 L160 284 L184 248" fill={sombra} stroke={sombra} strokeWidth={3} strokeLinejoin="round" />
      )}
      {roupa === "camiseta" && <path d="M138 250 Q160 266 182 250" fill="none" stroke={sombra} strokeWidth={4} />}
    </g>
  );
};

const AcessorioPeca: React.FC<{ tipo: Acessorio; cor: string }> = ({ tipo, cor }) => {
  const sombra = escurecer(cor);
  if (tipo === "oculos")
    return (
      <g fill="none" stroke={cor} strokeWidth={4}>
        <circle cx={134} cy={OLHO_Y} r={19} fill="rgba(200,230,255,.18)" />
        <circle cx={186} cy={OLHO_Y} r={19} fill="rgba(200,230,255,.18)" />
        <path d={`M153 ${OLHO_Y - 2} Q160 ${OLHO_Y - 8} 167 ${OLHO_Y - 2} M115 ${OLHO_Y - 4} L90 ${OLHO_Y - 10} M205 ${OLHO_Y - 4} L230 ${OLHO_Y - 10}`} />
      </g>
    );
  if (tipo === "gorro")
    return (
      <g>
        <path d="M84 124 Q86 46 160 42 Q234 46 236 124 Z" fill={cor} />
        <rect x={80} y={110} width={160} height={24} rx={10} fill={sombra} />
        <circle cx={160} cy={40} r={14} fill={escurecer(cor, -0.25)} />
      </g>
    );
  if (tipo === "bone")
    return (
      <g>
        <path d="M88 122 Q90 58 160 54 Q230 58 232 122 Z" fill={cor} />
        <path d="M150 116 Q226 104 270 124 Q232 136 150 126 Z" fill={sombra} />
        <circle cx={160} cy={56} r={6} fill={sombra} />
      </g>
    );
  if (tipo === "laco")
    return (
      <g fill={cor}>
        <path d="M206 78 L182 64 L184 96 Z" />
        <path d="M206 78 L232 62 L230 96 Z" />
        <circle cx={206} cy={80} r={8} fill={sombra} />
      </g>
    );
  return null;
};

export const PersonagemBase: React.FC<PersonagemProps> = ({
  altura = 600,
  pele = "#D9A984",
  cabelo = "nenhum",
  corCabelo = "#3B2A22",
  roupa = "nenhuma",
  corRoupa = "#3F6B57",
  acessorio = "nenhum",
  corAcessorio = "#1B2028",
  expressao = "neutro",
  falando = false,
  piscar = true,
  frente,
  atras,
}) => {
  const quadro = useCurrentFrame();
  // Pisca a cada 4 segundos (3 quadros de olho fechado). Cada personagem pode ter um ritmo diferente
  // se você passar piscar={false} e controlar por fora.
  const fechado = piscar && quadro % 120 >= 117;
  // Boca abre e fecha enquanto fala (a cada 4 quadros).
  const aberta = falando && Math.floor(quadro / 4) % 2 === 0;

  return (
    <svg viewBox="0 0 320 336" height={altura} width={(altura * 320) / 336} style={{ overflow: "visible" }}>
      {atras}
      <CabeloAtras tipo={cabelo} cor={corCabelo} />
      <Corpo roupa={roupa} cor={corRoupa} pele={pele} />
      <circle cx={160} cy={148} r={74} fill={pele} stroke={escurecer(pele, 0.15)} strokeWidth={2} />
      <CabeloFrente tipo={cabelo} cor={corCabelo} />
      <Sobrancelhas expressao={expressao} cor={cabelo === "nenhum" ? escurecer(pele, 0.45) : corCabelo} />
      <Olhos expressao={expressao} fechado={fechado} />
      <circle cx={118} cy={172} r={9} fill="#E58E73" opacity={0.3} />
      <circle cx={202} cy={172} r={9} fill="#E58E73" opacity={0.3} />
      <Boca expressao={expressao} aberta={aberta} />
      <AcessorioPeca tipo={acessorio} cor={corAcessorio} />
      {frente}
    </svg>
  );
};
