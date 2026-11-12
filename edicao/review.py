import json,os,hashlib,sys
from PIL import Image,ImageDraw,ImageFont
C=json.load(open('cands.json'))
keys=sys.argv[2].split(',') if len(sys.argv)>2 else list(C)
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',16)
TW,TH=240,150;rows=[]
for k in keys:
    row=Image.new('RGB',(150+6*TW,TH),(30,30,30));d=ImageDraw.Draw(row);d.text((6,60),k[:16],font=f,fill='yellow')
    for j,c in enumerate(C[k][:6]):
        p='thumbs/'+hashlib.md5(c['title'].encode()).hexdigest()[:12]+'.jpg'
        if os.path.exists(p):
            im=Image.open(p);im.thumbnail((TW-4,TH-24));row.paste(im,(150+j*TW,0))
        else: d.text((150+j*TW+10,60),'(baixando)',font=f,fill='gray')
        d.text((150+j*TW+4,TH-20),f'{j} {c["lic"][:14]}',font=f,fill='white')
    rows.append(row)
out=sys.argv[1]
sh=Image.new('RGB',(150+6*TW,TH*len(rows)));[sh.paste(r,(0,i*TH)) for i,r in enumerate(rows)];sh.save(out,quality=75)
