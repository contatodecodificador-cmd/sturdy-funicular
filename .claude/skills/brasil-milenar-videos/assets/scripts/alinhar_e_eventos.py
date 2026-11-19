"""1) Forced alignment no ElevenLabs (texto exato narrado + áudio tratado) -> alinhamento.json
2) Cruza parágrafos do roteiro (com marcações) com o tempo de cada palavra -> render/src/data.json
Uso: python3 alinhar_e_eventos.py voz_tratada.mp3 texto_para_IA.txt tts_blocos.json roteiro_final.md render/src/data.json
A chave do ElevenLabs é injetada pelo proxy (ou exporte ELEVEN_KEY)."""
import sys,json,re,os,subprocess,unicodedata
audio,texto,blocos_f,roteiro,saida=sys.argv[1:6]
key=os.environ.get('ELEVEN_KEY','proxy-injected')
if not os.path.exists('alinhamento.json'):
    subprocess.run(['curl','-s','-X','POST','https://api.elevenlabs.io/v1/forced-alignment','-H',f'xi-api-key: {key}',
        '-F',f'file=@{audio}','--form-string','text='+open(texto).read(),'-o','alinhamento.json'],check=True)
al=[w for w in json.load(open('alinhamento.json'))['words'] if w['text'].strip()]
b=json.load(open(blocos_f))
tts=[(k,l) for k,x in enumerate(b) for l in x['texto'].split('\n') if l.strip()]
seg=[];i=0
for k,x in enumerate(b):
    n=len(x['texto'].split()); seg.append({'id':k,'start':al[i]['start'],'end':al[i+n-1]['end']}); i+=n
lines=open(roteiro).read().split('## (a)')[0].split('\n'); pars=[];pend=[]
for l in lines:
    if l.startswith('['): pend.append(l.strip()); continue
    if not l.strip() or l.startswith(('#','---','Contador fixo')): continue
    pars.append({'marks':pend}); pend=[]
assert len(pars)==len(tts), f'parágrafos do roteiro ({len(pars)}) != do texto IA ({len(tts)}) — mantenha 1 linha por parágrafo'
idx=0
for n,(p,(k,tl)) in enumerate(zip(pars,tts)):
    m=len(tl.split()); p.update({'i':n,'seg':k,'w0':idx,'w1':idx+m,'t':al[idx]['start'],'t_end':al[idx+m-1]['end']}); idx+=m
norm=lambda s:''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
COL={'AMARELO':'impacto','VERDE':'impacto','VERMELHO':'perigo','CORAL':'perigo','AZUL':'dado','BRANCO':'info','DOURADO':'info'}
ev={'counter':[],'etiqueta':[],'palavra':[],'fonte':[]}
for p in pars:
    for m in p['marks']:
        tag,_,val=m[1:-1].partition(':'); val=val.strip()
        if tag=='ETIQUETA':
            a,_,c=val.partition('/'); ev['etiqueta'].append({'t':p['t']+0.2,'small':a.strip().upper(),'big':c.strip().upper()})
        elif tag=='PALAVRA':
            txt,_,c=val.rpartition('|'); txt=txt.strip(); keys=[norm(k) for k in re.findall(r'[\wÀ-ú]+',txt) if len(k)>3]
            tt=next((w['start'] for w in al[p['w0']:p['w1']] if any(k[:5] in norm(w['text']) for k in keys)),p['t']+0.3)
            ev['palavra'].append({'t':tt,'texto':txt.upper(),'cor':COL.get(c.strip(),'info')})
        elif tag=='FONTE': ev['fonte'].append({'t':p['t']+0.5,'texto':'FONTE: '+val})
        elif tag=='CONTADOR': ev['counter'].append({'t':p['t'],'raw':val})
pw=ev['palavra']
for j,x in enumerate(pw):
    nxt=pw[j+1]['t'] if j+1<len(pw) else x['t']+4; x['dur']=max(2.2,min(4.0,nxt-x['t']-0.2))
json.dump({'paragrafos':[{k:p[k] for k in ('i','seg','t','t_end')} for p in pars],'segmentos':seg,'eventos':ev,'fim_audio':al[-1]['end']},open(saida,'w'),ensure_ascii=False,indent=1)
print('ok:',len(pars),'parágrafos,',len(seg),'trechos; contador (definir à mão em ui.tsx):')
for c in ev['counter']: print('  ',round(c['t'],1),c['raw'])
