import sys, glob
from PIL import Image, ImageDraw
# uso: folha.py saida.jpg colunas arq1 arq2 ...
out, cols, arqs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
W, H = 480, 270; rows = (len(arqs) + cols - 1) // cols
im = Image.new('RGB', (W * cols, H * rows), 'black'); d = ImageDraw.Draw(im)
for i, a in enumerate(arqs):
    x, y = (i % cols) * W, (i // cols) * H
    im.paste(Image.open(a).convert('RGB').resize((W, H)), (x, y)); d.text((x + 6, y + 4), f'{i+1}', fill='yellow')
im.save(out, quality=88)
