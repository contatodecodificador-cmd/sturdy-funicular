#!/bin/bash
# Encaixa os trechos re-renderizados com a cozinha 3D (out/seg3d/seg_<frame>.mp4) sobre o render 2D
# e junta com a mixagem final. Saída: out/video6_final.mp4 (< 400 MiB para o YouTube).
set -e
cd "$(dirname "$0")"
IN=(-i out/video6_2d.mp4); FC=""; prev="0:v"; k=1
for f in $(ls out/seg3d/seg_*.mp4 | sort -t_ -k2 -n); do
  s=$(basename $f .mp4); s=${s#seg_}
  IN+=(-i $f)
  FC+="[$k:v]setpts=PTS-STARTPTS+$s/30/TB[s$k];[$prev][s$k]overlay=eof_action=pass:repeatlast=0[v$k];"
  prev="v$k"; k=$((k+1))
done
IN+=(-i ../mix_final.wav)
ffmpeg -nostdin -y "${IN[@]}" -filter_complex "${FC%;}" -map "[$prev]" -map $k:a \
  -c:v libx264 -preset slow -crf 20 -maxrate 3800k -bufsize 7600k -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/video6_final.mp4
