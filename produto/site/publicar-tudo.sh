#!/usr/bin/env bash
# Monta e publica o site inteiro do Estúdio do Nogueira no Netlify:
#   /            página de venda
#   /area/       Área do Estúdio (com o porteiro)
#   /area/entrar.html  tela de entrar
#   /api/...     login e o recebedor dos avisos da Cakto
#
# Uso (o Claude roda):  bash produto/site/publicar-tudo.sh
# Precisa do token do Netlify salvo no ambiente da nuvem (o ambiente coloca a chave sozinho).
set -euo pipefail
SITE_ID="9cae7aec-edcb-415d-95a3-42cdc7d9cb80"   # estudiodonogueira.netlify.app
AQUI="$(cd "$(dirname "$0")" && pwd)"
PRODUTO="$(dirname "$AQUI")"

python3 "$PRODUTO/area/gerar.py" > /dev/null
python3 "$PRODUTO/publicar/montar.py" > /dev/null

rm -rf "$AQUI/dist" && mkdir -p "$AQUI/dist/area"
cp -r "$PRODUTO/pagina/." "$AQUI/dist/"
unzip -o -q "$PRODUTO/publicar/pagina-de-venda.zip" _headers -d "$AQUI/dist"
cp -r "$PRODUTO/area/site/." "$AQUI/dist/area/"
cp "$AQUI/entrar.html" "$AQUI/dist/area/entrar.html"
cat >> "$AQUI/dist/_headers" <<'EOF'

/area/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: private, no-store
EOF

cd "$AQUI"
npm install --no-audit --no-fund --silent
# O ambiente troca este valor pelo token de verdade nos pedidos ao Netlify.
NETLIFY_AUTH_TOKEN="proxy-injected" npx --yes netlify-cli@27.13.0 deploy --prod --no-build \
  --site estudiodonogueira --dir dist --functions netlify/functions --message "Estúdio do Nogueira: página + Área + login"

# Trava de segurança: a Área NUNCA pode abrir sem login.
sleep 5
codigo=$(curl -sS -o /dev/null -w "%{http_code}" "https://estudiodonogueira.netlify.app/area/passos/passo-01.html" || echo erro)
if [ "$codigo" != "302" ]; then
  echo "ATENÇÃO: a Área abriu sem login (resposta $codigo). Tirando a Área do ar e publicando só a página de venda."
  bash "$PRODUTO/publicar/publicar.sh"
  exit 1
fi
echo "Trava de segurança: a Área está protegida (sem login → tela de entrar)."
