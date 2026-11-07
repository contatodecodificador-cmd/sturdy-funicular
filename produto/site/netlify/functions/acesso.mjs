// Diz à Área o que a pessoa logada comprou (para mostrar os cadeados certos).
// Relê a ficha na hora: se houve reembolso depois do login, o produto some daqui.
import { getStore } from "@netlify/blobs";
import { cookieSessao, criarCracha, lerCookie, lerCracha } from "../../lib/sessao.mjs";
import { produtosAtivos } from "./entrar.mjs";

export const config = { path: "/api/acesso" };

export default async (req) => {
  const segredo = process.env.SESSAO_SEGREDO;
  const sessao = await lerCracha(segredo, lerCookie(req));
  if (!sessao) return new Response(JSON.stringify({ logado: false }), { status: 401, headers: { "content-type": "application/json" } });
  const ficha = await getStore({ name: "compradores", consistency: "strong" }).get(sessao.email, { type: "json" });
  const produtos = produtosAtivos(ficha);
  const cabecalhos = { "content-type": "application/json", "cache-control": "no-store" };
  // Atualiza o crachá se os produtos mudaram (compra nova ou reembolso).
  if (produtos.join() !== sessao.produtos.join()) cabecalhos["set-cookie"] = cookieSessao(await criarCracha(segredo, sessao.email, produtos));
  return new Response(JSON.stringify({ logado: true, email: sessao.email, nome: ficha?.nome || "", produtos }), { headers: cabecalhos });
};
