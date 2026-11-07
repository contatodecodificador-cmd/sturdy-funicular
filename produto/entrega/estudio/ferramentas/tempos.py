"""Gera o tempos.json de uma parte: em que segundo começa e termina cada palavra e cada frase (cena).

Uso:
    python3 ferramentas/tempos.py series/<serie>/partes/parte-NN

Lê da pasta da parte:
- VOZ.md: o texto da narração, uma frase (cena) por linha. Marcações entre colchetes, como
  [sussurrando], são ignoradas. As linhas antes da primeira linha em branco depois do título também.
- voz-palavras.json: a transcrição com o tempo de cada palavra (ElevenLabs speech-to-text com
  timestamps_granularity=word, ou faster-whisper convertido para {"words": [{"text","start","end"}]}).

Escreve tempos.json com:
- duracao: segundos da voz;
- cenas: [{n, frase, inicio, fim}] (cada cena começa na primeira palavra da sua frase);
- palavras: [{texto, inicio, fim, cena}] com o texto CERTO (o do roteiro), e o tempo da transcrição.
"""
import json
import re
import sys
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path


def normal(p: str) -> str:
    p = unicodedata.normalize("NFD", p.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", p)


def frases_do_texto(voz_md: Path) -> list[str]:
    linhas = voz_md.read_text(encoding="utf-8").splitlines()
    frases = []
    for l in linhas:
        if l.startswith("#") or not l.strip():
            continue
        l = re.sub(r"\[[^\]]*\]", "", l).strip()
        if l:
            frases.append(l)
    return frases


def main(pasta: Path):
    frases = frases_do_texto(pasta / "VOZ.md")
    trans = json.loads((pasta / "voz-palavras.json").read_text(encoding="utf-8"))
    falado = [w for w in trans.get("words", []) if w.get("type", "word") == "word"]

    roteiro = []  # (texto, cena)
    for n, f in enumerate(frases, start=1):
        for p in f.split():
            if normal(p):
                roteiro.append((p, n))

    a = [normal(t) for t, _ in roteiro]
    b = [normal(w["text"]) for w in falado]
    tempo = [None] * len(roteiro)
    for bloco in SequenceMatcher(a=a, b=b, autojunk=False).get_matching_blocks():
        for k in range(bloco.size):
            w = falado[bloco.b + k]
            tempo[bloco.a + k] = (float(w["start"]), float(w["end"]))

    # Palavras que a transcrição não reconheceu: estima entre as vizinhas.
    for i, t in enumerate(tempo):
        if t is None:
            antes = next((tempo[j][1] for j in range(i - 1, -1, -1) if tempo[j]), 0.0)
            depois = next((tempo[j][0] for j in range(i + 1, len(tempo)) if tempo[j]), antes + 0.4)
            tempo[i] = (antes, max(antes + 0.05, depois))

    palavras = [{"texto": t, "inicio": round(s, 3), "fim": round(e, 3), "cena": c}
                for (t, c), (s, e) in zip(roteiro, tempo)]
    duracao = max([float(w["end"]) for w in falado] + [palavras[-1]["fim"]])
    cenas = []
    for n, f in enumerate(frases, start=1):
        ps = [p for p in palavras if p["cena"] == n]
        cenas.append({"n": n, "frase": f, "inicio": ps[0]["inicio"], "fim": ps[-1]["fim"]})

    faltaram = sum(1 for i in range(len(roteiro)) if not any(
        bl.a <= i < bl.a + bl.size for bl in SequenceMatcher(a=a, b=b, autojunk=False).get_matching_blocks()))
    saida = {"duracao": round(duracao, 3), "cenas": cenas, "palavras": palavras}
    (pasta / "tempos.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"tempos.json: {len(cenas)} cenas, {len(palavras)} palavras, {duracao:.1f} s de voz")
    if faltaram:
        print(f"Atenção: {faltaram} palavra(s) do roteiro não apareceram na transcrição (tempo estimado). Ouça esses trechos.")
    for c in cenas:
        print(f"  cena {c['n']:>2}: {c['inicio']:6.2f}s  {c['frase'][:60]}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    main(Path(sys.argv[1]))
