// Recebe os avisos da Cakto (webhook): compra aprovada, reembolso e chargeback.
// Guarda, para cada e-mail, os números dos pedidos e os produtos liberados.
import { getStore } from "@netlify/blobs";
import { PRODUTOS_CAKTO, iguais, normalEmail, normalPedido } from "../../lib/sessao.mjs";

export const config = { path: "/api/cakto" };

const TIRA_ACESSO = new Set(["refund", "chargeback"]);

export default async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });
  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return new Response("json inválido", { status: 400 });
  }
  const segredo = process.env.CAKTO_WEBHOOK_SECRET;
  if (!segredo || !iguais(corpo.secret, segredo)) return new Response("não autorizado", { status: 401 });

  const evento = corpo.event;
  const pedidos = Array.isArray(corpo.data) ? corpo.data : [corpo.data];
  const loja = getStore({ name: "compradores", consistency: "strong" });
  const vistos = getStore({ name: "eventos", consistency: "strong" });

  for (const d of pedidos) {
    if (!d || !d.customer) continue;
    const idEvento = `${evento}:${d.id}`;
    if (await vistos.get(idEvento)) continue; // a Cakto pode reenviar o mesmo aviso
    const email = normalEmail(d.customer.email);
    const produto = PRODUTOS_CAKTO[d.product && d.product.id];
    if (!email || !produto) continue;

    const ficha = (await loja.get(email, { type: "json" })) || { pedidos: {}, nome: "" };
    ficha.nome = d.customer.name || ficha.nome;
    const ref = normalPedido(d.refId);
    if (evento === "purchase_approved" && d.status === "paid") {
      ficha.pedidos[ref] = { produto, status: "pago", em: d.paidAt || new Date().toISOString() };
    } else if (TIRA_ACESSO.has(evento)) {
      if (ficha.pedidos[ref]) ficha.pedidos[ref].status = evento === "refund" ? "reembolsado" : "chargeback";
    } else {
      continue;
    }
    await loja.setJSON(email, ficha);
    await vistos.set(idEvento, "1");
  }
  return new Response("recebido", { status: 200 });
};
