import re,json,sys,subprocess
S=sys.argv[1]
t=open('roteiros/01-vira-lata-caramelo-NARRACAO-elevenlabs.txt').read()
parts=re.split(r'=== .*? ===\n',t)[1:]
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
off=0;out=[]
for pi,body in enumerate(parts,1):
    D=dur(f'narracao/davi-v4-parte{pi}.mp3')
    raw=[s.strip() for s in re.split(r'(?<=[.?!…:])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ"])|\n+',body.strip()) if s.strip()]
    sents=[]
    for s in raw:
        if sents and len(s)<14 and len(sents[-1])<40: sents[-1]+=' '+s
        else: sents.append(s)
    sil=[l.split(': ') for l in open(f'{S}/edit/sil{pi}.txt')]
    pauses=[];st=None
    for k,v in sil:
        v=float(v)
        if k=='silence_start': st=v
        elif st is not None: pauses.append(((st+v)/2,v-st,st,v)); st=None
    lead=0
    if pauses and pauses[0][2]<0.05: lead=pauses[0][3]; pauses=pauses[1:]
    tail=D
    if pauses and pauses[-1][3]>D-0.1: tail=pauses[-1][2]; pauses=pauses[:-1]
    n=len(sents); L=[len(s) for s in sents]; tot=sum(L)
    exp=[];c=0
    for l in L[:-1]:
        c+=l; exp.append(lead+(tail-lead)*c/tot)
    P=len(pauses); m=n-1; INF=1e18
    assert P>=m,(pi,P,m)
    dp=[[INF]*(P+1) for _ in range(m+1)]; bk=[[None]*(P+1) for _ in range(m+1)]
    for j in range(P+1): dp[0][j]=0
    for i in range(1,m+1):
        for j in range(i,P+1):
            a=dp[i][j-1]; b=dp[i-1][j-1]+abs(pauses[j-1][0]-exp[i-1])-1.5*pauses[j-1][1]
            if a<=b: dp[i][j]=a; bk[i][j]='s'
            else: dp[i][j]=b; bk[i][j]='u'
    sel=[];i,j=m,P
    while i>0:
        if bk[i][j]=='u': sel.append(pauses[j-1]); i-=1
        j-=1
    sel=sel[::-1]
    bounds=[lead]+[p[0] for p in sel]+[tail]
    for k,s in enumerate(sents):
        out.append({'part':pi,'t0':round(off+bounds[k],2),'t1':round(off+bounds[k+1],2),'text':s})
    off+=D+0.9
json.dump(out,open(f'{S}/edit/sentences.json','w'),ensure_ascii=False,indent=0)
d=[o['t1']-o['t0'] for o in out]
print(len(out),'frases; dur media %.2f min %.2f max %.2f'%(sum(d)/len(d),min(d),max(d)))
for o in out[:14]: print(o['t0'],o['t1'],o['text'][:70])
print('longas >5s:',len([x for x in d if x>5]))
