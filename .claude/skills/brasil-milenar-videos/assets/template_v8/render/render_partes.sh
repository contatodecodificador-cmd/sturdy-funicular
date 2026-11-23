#!/bin/bash
# Render do Video7 em 4 partes (resistente a falhas) e junção.
cd "$(dirname "$0")"; N=19053; Q=$((N/4)); mkdir -p out/partes
for k in 0 1 2 3; do
  a=$((k*Q)); b=$(( k==3 ? N-1 : (k+1)*Q-1 )); f=out/partes/p$k.mp4
  [ -f $f ] && continue
  npx remotion render src/index.ts Video7 $f --frames=$a-$b --concurrency=4 --muted --crf=18 > out/partes/p$k.log 2>&1 && echo "OK parte $k" || echo "FALHA parte $k"
done
ls out/partes/p?.mp4 | sed "s#^#file '$(pwd)/#;s#\$#'#" > out/partes/lista.txt
ffmpeg -nostdin -v error -y -f concat -safe 0 -i out/partes/lista.txt -c copy out/video7_2d.mp4 && echo JUNTOU
