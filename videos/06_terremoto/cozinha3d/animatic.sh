#!/bin/bash
# Gera o animatic (workbench 640x360) de todos os grupos e codifica um mp4 por plano.
cd "$(dirname "$0")"; OUT=/tmp/claude-0/3d/animatic; mkdir -p $OUT
for g in p1 p2 p3 p4 p5 c01 c02 c03 g4 c08 c11 g7 c14 g95 c18 c20; do
  python3 planos3d.py $g --previa workbench --res 480x270 --passo 2 --saida $OUT/img > $OUT/log_$g.txt 2>&1 || echo "FALHA $g"
  echo "ok $g"
done
for d in $OUT/img/*/; do p=$(basename $d); ffmpeg -y -loglevel error -framerate 15 -i $d/%04d.jpg -c:v libx264 -crf 20 -pix_fmt yuv420p $OUT/$p.mp4; done
echo FIM
