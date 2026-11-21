#!/bin/bash
# Roda NA MÁQUINA DE GPU (RunPod). Renderiza os grupos pedidos (ou todos) e gera um mp4 por plano.
# uso: bash render_pod.sh [grupo ...]
cd /workspace/cozinha3d
command -v ffmpeg >/dev/null || (apt-get install -y -qq ffmpeg >/dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq ffmpeg >/dev/null))
G=${@:-p1 p2 p3 p4 p5 c01 c02 c03 g4 c08 c11 g7 c14 g95 c18 c20}
mkdir -p /workspace/out/img /workspace/out/mp4
for g in $G; do
  echo "INICIO $g $(date +%T)"
  /venv/bin/python planos3d.py $g --gpu --amostras 80 --saida /workspace/out/img > /workspace/out/log_$g.txt 2>&1 || echo "FALHA $g"
  for p in $(grep -o "^PLANO [a-z0-9]*" /workspace/out/log_$g.txt | cut -d' ' -f2); do
    ffmpeg -y -loglevel error -framerate 30 -i /workspace/out/img/$p/%04d.png -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p /workspace/out/mp4/$p.mp4 && echo "MP4 $p"
  done
  echo "FIM $g $(date +%T)"
done
echo TUDO_PRONTO
