#!/usr/bin/env bash
# Publica a página de venda no Netlify (site estudiodonogueira), direto daqui.
# Precisa do token do Netlify salvo no ambiente da nuvem (o ambiente coloca a chave sozinho).
# Uso: bash produto/publicar/publicar.sh
set -euo pipefail
SITE_ID="9cae7aec-edcb-415d-95a3-42cdc7d9cb80"   # estudiodonogueira.netlify.app
cd "$(dirname "$0")/../.."
python3 produto/publicar/montar.py > /dev/null
curl -sS -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" \
  -H "Content-Type: application/zip" \
  --data-binary @produto/publicar/pagina-de-venda.zip \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('deploy', d.get('id'), d.get('state'), d.get('ssl_url'))"
