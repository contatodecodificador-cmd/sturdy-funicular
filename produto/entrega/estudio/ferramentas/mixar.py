"""Mixa a voz com os efeitos e o ambiente, seguindo as regras de volume do Estúdio.

Uso:
    python3 ferramentas/mixar.py series/<serie>/partes/parte-NN

Lê da pasta da parte:
- voz.mp3
- tempos.json (de ferramentas/tempos.py)
- SOM.json: a lista dos sons, por exemplo:
    {
      "ambiente": {"som": "ambiente", "db": -25},
      "efeitos": [
        {"som": "clique", "palavra": "apertou"},        <- toca no começo dessa palavra
        {"som": "sino", "cena": 9},                     <- toca no começo dessa cena
        {"som": "pop", "em": 24.4, "ajuste_db": -3}     <- toca nesse segundo, 3 dB mais baixo
      ]
    }
  "palavra" usa a primeira vez que a palavra aparece; para outra, use {"palavra": "treze", "vez": 2}.

Regras aplicadas:
- voz igualada a -16 LUFS;
- cada efeito fica uns 15 dB abaixo da voz (medido com todas as frequências), mais o "ajuste_db";
- ambiente contínuo no "db" indicado (padrão: 25 dB abaixo da voz);
- tudo abaixo de 40 Hz é cortado nos efeitos e no ambiente;
- volume final -14 LUFS e pico abaixo de -1,5 dB.

Escreve: audio-final.mp3 e audio-final.wav na pasta da parte, e mostra o volume medido no fim.
Precisa do ffmpeg.
"""
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

TAXA = 44100
RAIZ = Path(__file__).resolve().parent.parent
SONS = RAIZ / "public" / "sons"


def ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-y", *args], capture_output=True, text=True)


def ler(caminho: Path) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        saida = Path(d) / "a.wav"
        r = ff("-i", str(caminho), "-ac", "1", "-ar", str(TAXA), "-c:a", "pcm_f32le", str(saida))
        if r.returncode:
            sys.exit(f"Não consegui ler {caminho}: {r.stderr[-400:]}")
        return wavfile.read(saida)[1].astype(np.float64)


def gravar(caminho: Path, s: np.ndarray):
    wavfile.write(caminho, TAXA, s.astype(np.float32))


def loudnorm(entrada: Path, saida: Path, alvo: float, pico: float = -1.5):
    """Normaliza em duas passadas (mais preciso)."""
    r = ff("-i", str(entrada), "-af", f"loudnorm=I={alvo}:TP={pico}:LRA=11:print_format=json", "-f", "null", "-")
    m = json.loads(re.findall(r"\{[\s\S]*?\}", r.stderr)[-1])
    filtro = (f"loudnorm=I={alvo}:TP={pico}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
              f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    r = ff("-i", str(entrada), "-af", filtro, "-ar", str(TAXA), "-ac", "1", "-c:a", "pcm_f32le", str(saida))
    if r.returncode:
        sys.exit(r.stderr[-400:])


def medir(caminho: Path):
    r = ff("-i", str(caminho), "-af", "loudnorm=print_format=json", "-f", "null", "-")
    m = json.loads(re.findall(r"\{[\s\S]*?\}", r.stderr)[-1])
    return float(m["input_i"]), float(m["input_tp"])


def rms_db(s: np.ndarray) -> float:
    ativo = s[np.abs(s) > 1e-4]
    if not len(ativo):
        return -120.0
    return 20 * np.log10(np.sqrt(np.mean(ativo ** 2)) + 1e-12)


def corta_grave(s: np.ndarray) -> np.ndarray:
    return sosfilt(butter(4, 40, btype="highpass", fs=TAXA, output="sos"), s)


def normal(p: str) -> str:
    p = unicodedata.normalize("NFD", p.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in p if unicodedata.category(c) != "Mn"))


def quando(efeito: dict, tempos: dict) -> float:
    if "em" in efeito:
        return float(efeito["em"])
    if "cena" in efeito:
        return float(next(c["inicio"] for c in tempos["cenas"] if c["n"] == efeito["cena"]))
    if "palavra" in efeito:
        alvo, vez = normal(efeito["palavra"]), int(efeito.get("vez", 1))
        achadas = [p for p in tempos["palavras"] if normal(p["texto"]) == alvo]
        if len(achadas) < vez:
            sys.exit(f"Palavra não encontrada no tempos.json: {efeito['palavra']} (vez {vez})")
        return float(achadas[vez - 1]["inicio"])
    sys.exit(f"Efeito sem 'em', 'cena' ou 'palavra': {efeito}")


def main(pasta: Path):
    tempos = json.loads((pasta / "tempos.json").read_text(encoding="utf-8"))
    som = json.loads((pasta / "SOM.json").read_text(encoding="utf-8"))
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        bruto = d / "voz.wav"
        gravar(bruto, ler(pasta / "voz.mp3"))
        loudnorm(bruto, d / "voz16.wav", -16)
        voz = wavfile.read(d / "voz16.wav")[1].astype(np.float64)
        ref = rms_db(voz)
        total = np.zeros(len(voz) + TAXA)  # 1 s de folga no fim

        amb = som.get("ambiente")
        if amb:
            a = corta_grave(ler(SONS / f"{amb['som']}.wav"))
            a = np.tile(a, int(np.ceil(len(total) / len(a))))[: len(total)]
            a *= 10 ** ((ref + float(amb.get("db", -25)) - rms_db(a)) / 20)
            n = int(TAXA * 0.8)
            a[:n] *= np.linspace(0, 1, n)
            a[-n:] *= np.linspace(1, 0, n)
            total += a

        for ef in som.get("efeitos", []):
            s = corta_grave(ler(SONS / f"{ef['som']}.wav"))
            alvo = ref - 15 + float(ef.get("ajuste_db", 0))
            s *= 10 ** ((alvo - rms_db(s)) / 20)
            i = int(quando(ef, tempos) * TAXA)
            fim = min(len(total), i + len(s))
            total[i:fim] += s[: fim - i]

        total[: len(voz)] += voz
        gravar(d / "mix.wav", total)
        loudnorm(d / "mix.wav", pasta / "audio-final.wav", -14)
        r = ff("-i", str(pasta / "audio-final.wav"), "-c:a", "libmp3lame", "-b:a", "192k", str(pasta / "audio-final.mp3"))
        if r.returncode:
            sys.exit(r.stderr[-400:])
    i, tp = medir(pasta / "audio-final.wav")
    print(f"audio-final.mp3 pronto: volume {i:.1f} LUFS, pico {tp:.1f} dB")
    if tp > -1.0:
        print("Atenção: o pico passou de -1 dB. Abaixe o efeito mais alto (ajuste_db) e rode de novo.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    main(Path(sys.argv[1]))
