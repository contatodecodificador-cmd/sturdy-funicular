import { cookieSair } from "../../lib/sessao.mjs";

export const config = { path: "/api/sair" };

export default async () =>
  new Response(null, { status: 302, headers: { location: "/area/entrar.html", "set-cookie": cookieSair() } });
