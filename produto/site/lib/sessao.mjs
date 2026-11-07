// Sessão do comprador: um "crachá" assinado guardado num cookie.
// Funciona igual nas funções (Node) e no porteiro (Edge), porque usa só Web Crypto.

export const COOKIE = "estudio_sessao";
export const DIAS = 7;

// Que produto libera cada parte da Área (o mesmo mapa da área/gerar.py).
export const ACESSO = {
  guia: ["guia", "completo"],
  passos: ["skill", "completo"],
  extra: ["ideias"],
};

// IDs dos produtos na Cakto (veja produto/cakto.md).
export const PRODUTOS_CAKTO = {
  "90f72b1c-d8d1-4501-8206-7e93c1aa1492": "completo",
  "8362c694-6d6f-46ad-8afd-1cfb5a4a765f": "guia",
  "94158afa-444c-48ab-aae2-3f446d10dfa3": "skill",
  "3946d0a2-f387-4e9a-b233-44700b03f41a": "ideias",
};

const enc = new TextEncoder();

const b64url = (bytes) => {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const deB64url = (s) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

const chave = (segredo) =>
  crypto.subtle.importKey("raw", enc.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

export async function criarCracha(segredo, email, produtos) {
  const corpo = b64url(enc.encode(JSON.stringify({ e: email, p: produtos, x: Date.now() + DIAS * 864e5 })));
  const assinatura = await crypto.subtle.sign("HMAC", await chave(segredo), enc.encode(corpo));
  return `${corpo}.${b64url(assinatura)}`;
}

export async function lerCracha(segredo, valor) {
  if (!segredo || !valor || !valor.includes(".")) return null;
  const [corpo, ass] = valor.split(".");
  try {
    const ok = await crypto.subtle.verify("HMAC", await chave(segredo), deB64url(ass), enc.encode(corpo));
    if (!ok) return null;
    const dados = JSON.parse(new TextDecoder().decode(deB64url(corpo)));
    if (!dados.x || dados.x < Date.now()) return null;
    return { email: dados.e, produtos: dados.p || [] };
  } catch {
    return null;
  }
}

export function lerCookie(req, nome = COOKIE) {
  const c = req.headers.get("cookie") || "";
  const m = c.split(/;\s*/).find((x) => x.startsWith(nome + "="));
  return m ? decodeURIComponent(m.slice(nome.length + 1)) : null;
}

export const cookieSessao = (valor) =>
  `${COOKIE}=${encodeURIComponent(valor)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`;
export const cookieSair = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export const normalEmail = (e) => String(e || "").trim().toLowerCase();
export const normalPedido = (p) => String(p || "").trim().replace(/^#/, "").toUpperCase();

// Comparação que não entrega o segredo pelo tempo de resposta.
export function iguais(a, b) {
  a = String(a || "");
  b = String(b || "");
  let dif = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) dif |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return dif === 0;
}
