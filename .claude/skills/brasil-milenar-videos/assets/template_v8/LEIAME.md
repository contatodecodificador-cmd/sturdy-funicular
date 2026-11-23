# Modelo de montagem do vídeo 8 (Remotion)

- `render/`: projeto Remotion. Instalar: `npm i` (versões em package.json; remotion 4.0.242, react 18.3.1, d3-geo, topojson-client, world-atlas, @fontsource/oswald e inter).
  - `src/Video8.tsx`: composição principal, sequências sem loop (SEQ), HUD, palavra-chave (Chave).
  - `src/fotos8.tsx`: cenas com imagem/vídeo de fundo + camadas animadas (bolas de fogo, pó, clarões, círculo, listas).
  - `src/cenas8a/b/c.tsx`: motion graphics (mapas com relevo, régua de energia, jornal, sismograma, pasta do caso). As silhuetas vetoriais de pessoas foram REPROVADAS: não usar.
  - `public/`: colocar `mapa_as.jpg` (Natural Earth HYP, recorte da América do Sul), `grao.png`, `espaco.jpg` e as imagens em `public/img/`.
- `scripts/`:
  - `gerar_voz.py`: narração em partes, voz PVC.
  - `planos8.py`: lista de planos ≤5 s a partir do alinhamento.
  - `gerar_sons8.py`: músicas e efeitos no ElevenLabs.
  - `mixar7.py`: mixagem com ducking, −14 LUFS.
  - `kit_capcut.py`: kit para editar no CapCut.
  - `folha.py`: grade de quadros para revisão.
  - `wthumb.py`: miniatura do Wikimedia.
