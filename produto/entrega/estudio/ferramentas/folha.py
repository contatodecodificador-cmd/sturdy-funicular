"""Folha de quadros: uma imagem com o quadro do meio de cada cena, para conferir antes de gerar o vídeo.

Uso:
    python3 ferramentas/folha.py <Composição> series/<serie>/partes/parte-NN
Exemplo:
    python3 ferramentas/folha.py Elevador-Parte01 series/o-elevador-das-seis/partes/parte-01

Lê o tempos.json da parte (para saber onde fica cada cena), gera um quadro por cena com o Remotion e
junta tudo numa grade em saida/folha-<Composição>.png.

O que conferir na folha:
- cena escura que virou mancha preta;
- legenda em cima de rosto ou fora do lugar (nada nos 380 px de baixo, 140 px de cima e 140 px da direita);
- personagem cortado, coisa sumindo atrás de outra, borda do cenário aparecendo;
- o personagem com o mesmo rosto, cores e marca em todas as cenas.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

FPS = 30


def main(comp: str, pasta: Path):
    raiz = Path(__file__).resolve().parent.parent
    tempos = json.loads((pasta / "tempos.json").read_text(encoding="utf-8"))
    cenas = tempos["cenas"]
    quadros = []
    for i, c in enumerate(cenas):
        fim = cenas[i + 1]["inicio"] if i + 1 < len(cenas) else tempos["duracao"]
        quadros.append((c["n"], int((c["inicio"] + fim) / 2 * FPS)))

    with tempfile.TemporaryDirectory() as d:
        imagens = []
        for n, q in quadros:
            saida = Path(d) / f"c{n}.png"
            r = subprocess.run(["npx", "remotion", "still", "src/index.ts", comp, str(saida), f"--frame={q}"],
                               cwd=raiz, capture_output=True, text=True)
            if r.returncode:
                sys.exit(f"Erro no quadro da cena {n}:\n{r.stderr[-800:]}")
            imagens.append((n, Image.open(saida).convert("RGB").resize((270, 480))))

    colunas = 5
    linhas = (len(imagens) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * 280 + 10, linhas * 520 + 10), (20, 20, 20))
    desenho = ImageDraw.Draw(folha)
    for k, (n, im) in enumerate(imagens):
        x, y = 10 + (k % colunas) * 280, 10 + (k // colunas) * 520
        folha.paste(im, (x, y))
        # zonas proibidas, em vermelho fraco: 380 px de baixo, 140 px de cima, 140 px da direita
        esc = 270 / 1080
        desenho.rectangle([x, y + int((1920 - 380) * esc), x + 269, y + 479], outline=(220, 60, 60))
        desenho.rectangle([x + int((1080 - 140) * esc), y, x + 269, y + 479], outline=(220, 60, 60))
        desenho.text((x + 4, y + 484), f"cena {n}", fill=(230, 230, 230))
    destino = raiz / "saida" / f"folha-{comp}.png"
    destino.parent.mkdir(exist_ok=True)
    folha.save(destino)
    print(f"Folha de quadros: {destino.relative_to(raiz)}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], Path(sys.argv[2]))
