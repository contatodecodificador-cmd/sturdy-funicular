from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W,H=1280,720
im=Image.open('base_3d.png').convert('RGB')
im=im.rotate(-4,resample=Image.BICUBIC,expand=False).crop((70,40,1850,1041)).resize((W,H),Image.LANCZOS)
im=ImageEnhance.Contrast(im).enhance(1.25); im=ImageEnhance.Color(im).enhance(1.2)
# vinheta escura avermelhada
v=Image.new('L',(W,H),0); d=ImageDraw.Draw(v); d.ellipse((-250,-200,W+250,H+200),fill=255); v=v.filter(ImageFilter.GaussianBlur(160))
dark=Image.new('RGB',(W,H),(40,5,0)); im=Image.composite(im,dark,v)
# escurece o lado direito para o texto
g=Image.new('L',(W,H)); gd=ImageDraw.Draw(g)
for x in range(W): gd.line([(x,0),(x,H)],fill=int(max(0,min(170,(x-640)*0.45))))
im=Image.composite(Image.new('RGB',(W,H),(10,0,0)),im,g)
d=ImageDraw.Draw(im)
F='/usr/share/fonts/opentype/inter/InterDisplay-Black.otf'
f1=ImageFont.truetype(F,330); f2=ImageFont.truetype(F,78)
t='9,5'; bb=d.textbbox((0,0),t,font=f1); tw=bb[2]-bb[0]
x=W-tw-50-bb[0]; y=110-bb[1]
d.text((x+10,y+12),t,font=f1,fill=(0,0,0))
d.text((x,y),t,font=f1,fill=(255,214,0),stroke_width=12,stroke_fill=(0,0,0))
t2='NO BRASIL?'; b2=d.textbbox((0,0),t2,font=f2); w2=b2[2]-b2[0]; h2=b2[3]-b2[1]
bx=W-w2-50-30; by=y+bb[3]+40
d.rectangle((bx,by,bx+w2+60,by+h2+44),fill=(215,20,20))
d.text((bx+30-b2[0],by+22-b2[1]),t2,font=f2,fill=(255,255,255))
im.save('thumb_video6.jpg',quality=92)
