#!/bin/bash
OUT=/home/user/sturdy-funicular/edicao/02-duenkirchen/storyboard/maps
mkdir -p $OUT
node render.js m00_flug $OUT --stills 2.5
node render.js m01_lage $OUT --stills 2.5,8.9,13.2
node render.js m02_fallgelb $OUT --stills 8,18
node render.js m03a_ardennen $OUT --stills 9
node render.js m03b_sichel $OUT --stills 6,19
node render.js m04_arras $OUT --stills 4,12
node render.js m04b_korridor $OUT --stills 13
node render.js m04c_fallrot $OUT --stills 10.5
node render.js m05_halt $OUT --stills 3,10.8
node render.js m06_aa $OUT --stills 12.5
node render.js m07_perimeter $OUT --stills 13.5
node render.js m08_ringsum $OUT --stills 7.5,14
node render.js m09_dynamo $OUT --stills 7.5,18.5
node render.js m10_belgien $OUT --stills 8.5
node render.js m11_flandern $OUT --stills 7,15,26
node render.js m12_england $OUT --stills 4
echo ALLDONE
