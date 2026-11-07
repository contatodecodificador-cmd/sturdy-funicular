// Login: e-mail da compra + número do pedido (vem no e-mail de confirmação da Cakto).
import { getStore } from "@netlify/blobs";
import { cookieSessao, criarCracha, normalEmail, normalPedido } from "../../lib/sessao.mjs";

export const config = { path: "/api/entrar" };

const resposta = (dados, status = 200, extra = {}) =>
  new Response(JSON.stringify(dados), { status, headers: { "content-type": "application/json", ...extra } });

export const produtosAtivos = (ficha) => [
  ...new Set(Object.values(ficha?.pedidos || {}).filter((p) => p.status === "pago").map((p) => p.produto)),
];

export default async (req) => {
  if (req.method !== "POST") return resposta({ erro: "use POST" }, 405);
  const segredo = process.env.SESSAO_SEGREDO;
  if (!segredo) return resposta({ erro: "Login ainda não configurado." }, 500);

  let dados;
  try {
    dados = await req.json();
  } catch {
    return resposta({ erro: "Pedido inválido." }, 400);
  }
  const email = normalEmail(dados.email);
  const pedido = normalPedido(dados.pedido);
  if (!email || !pedido) return resposta({ erro: "Preencha o e-mail e o número do pedido." }, 400);

  // Trava contra tentativa e erro: no máximo 8 tentativas erradas por e-mail a cada hora.
  const tentativas = getStore({ name: "tentativas", consistency: "strong" });
  const hora = new Date().toISOString().slice(0, 13);
  const chaveT = `${email}:${hora}`;
  const erradas = Number((await tentativas.get(chaveT)) || 0);
  if (erradas >= 8) return resposta({ erro: "Muitas tentativas. Espere uma hora e tente de novo." }, 429);

  const ficha = await getStore({ name: "compradores", consistency: "strong" }).get(email, { type: "json" });
  const confere = ficha && Object.keys(ficha.pedidos || {}).some((ref) => ref === pedido);
  const produtos = produtosAtivos(ficha);
  if (!confere || !produtos.length) {
    await tentativas.set(chaveT, String(erradas + 1));
    return resposta({ erro: "Não encontramos uma compra com esse e-mail e esse número de pedido." }, 401);
  }
  const cracha = await criarCracha(segredo, email, produtos);
  return resposta({ ok: true, produtos }, 200, { "set-cookie": cookieSessao(cracha) });
};
