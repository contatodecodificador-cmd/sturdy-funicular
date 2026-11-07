// O porteiro da Área: roda antes de abrir qualquer página ou arquivo em /area/.
// Sem login → manda para a tela de entrar. Parte que a pessoa não comprou → volta para o início da Área.
import { ACESSO, lerCookie, lerCracha } from "../../lib/sessao.mjs";

export default async (req, context) => {
  const url = new URL(req.url);
  const caminho = url.pathname;
  const sessao = await lerCracha(Netlify.env.get("SESSAO_SEGREDO"), lerCookie(req));
  if (!sessao) return Response.redirect(new URL("/area/entrar.html", url), 302);

  const parte = caminho.split("/")[2]; // /area/<parte>/...
  const precisa = ACESSO[parte];
  if (precisa && !precisa.some((p) => sessao.produtos.includes(p))) {
    return Response.redirect(new URL("/area/index.html?bloqueado=" + parte, url), 302);
  }
  const resposta = await context.next();
  resposta.headers.set("cache-control", "private, no-store");
  resposta.headers.set("x-robots-tag", "noindex, nofollow");
  return resposta;
};

export const config = {
  path: "/area/*",
  excludedPath: ["/area/entrar.html", "/area/estilo-entrar.css"],
};
