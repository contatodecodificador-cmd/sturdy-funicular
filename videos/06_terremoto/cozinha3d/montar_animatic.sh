#!/bin/bash
# Junta os planos do animatic com a narração de cada trecho num único mp4 para aprovação.
OUT=/tmp/claude-0/3d/animatic; V=../audio/voz_tratada.wav; L=$OUT/lista.txt; : > $L
python3 - <<'PY' > $OUT/planos.txt
import sys; sys.path.insert(0,'.')
import planos3d as P
for g in P.GRUPOS.values():
    for pid,a,b,c,m in g['planos']: print(pid,a,b)
PY
while read p a b; do
  d=$(python3 -c "print($b-$a)")
  ffmpeg -nostdin -y -loglevel error -i $OUT/$p.mp4 -ss $a -t $d -i $V -map 0:v -map 1:a -vf "fps=30,scale=960:540,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='$p  $a s':x=20:y=20:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.5" -t $d -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -ar 48000 -ac 2 $OUT/rev_$p.mp4
  echo "file '$OUT/rev_$p.mp4'" >> $L
done < $OUT/planos.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i $L -c copy previas/animatic_cozinha3d.mp4 && echo MONTADO
