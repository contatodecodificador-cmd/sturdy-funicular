"""Monta o pacote da página de venda para arrastar no Netlify.

Como usar (o Claude roda isso sempre que a página mudar):
    python3 produto/publicar/montar.py

Gera produto/publicar/pagina-de-venda.zip com:
- index.html e img/ (a página de venda)
- _headers (segurança e, até o lançamento, a página fora do Google)

A Área do Estúdio NÃO entra aqui: ela só vai para o ar quando o login estiver pronto.
"""
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PAGINA = AQUI.parent / "pagina"
SAIDA = AQUI / "pagina-de-venda.zip"

# No lançamento, troque para False e rode de novo: a página passa a aparecer no Google.
FORA_DO_GOOGLE = True

HEADERS = """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
"""
if FORA_DO_GOOGLE:
    HEADERS += "  X-Robots-Tag: noindex, nofollow\n"
HEADERS += """
/img/*
  Cache-Control: public, max-age=604800
"""


def main():
    with zipfile.ZipFile(SAIDA, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(PAGINA.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(PAGINA))
        z.writestr("_headers", HEADERS)
    print("Pronto:", SAIDA)
    for i in zipfile.ZipFile(SAIDA).infolist():
        print(f"  {i.filename}  ({i.file_size // 1024} KB)")


if __name__ == "__main__":
    main()
