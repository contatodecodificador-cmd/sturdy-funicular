import json,sys,importlib.util
S=sys.argv[1]
spec=importlib.util.spec_from_file_location('scenes',f'{S}/scenes.py');sc=importlib.util.module_from_spec(spec);spec.loader.exec_module(sc)
sent=json.load(open(f'{S}/sentences.json'))
cov=[0]*len(sent)
shots=[];sec=None;music=None
for g in sc.SEC:
    for i in range(g['a'],g['b']+1): cov[i]+=1
    t0=sent[g['a']]['t0']; t1=sent[g['b']+1]['t0'] if g['b']+1<len(sent) else sent[g['b']]['t1']+1.5
    n=len(g['shots']); d=(t1-t0)/n
    if g['sec']: sec=g['sec']
    for k,s in enumerate(g['shots']):
        a=t0+k*d
        parts=max(1,int(-(-d//5.0)))  # dividir planos >5s
        for p in range(parts):
            s2=dict(s); 
            if p>0 and s2['t']=='gfx' and (s2.get('bgkey') or s2.get('bg') or s2.get('lkey')):
                k2=s2.get('bgkey') or s2.get('bg') or s2.get('rkey') or s2.get('lkey')
                s2=dict(t='img',key=k2,n=p+1,fx='zin',sfx=None)
            elif p>0 and s2['t']=='gfx':
                s2['note']='continuação animada do gráfico (os itens entram um a um)'; s2['sfx']=None
            if p>0 and s2['t']=='img' and s['t']=='img': s2['n']=s2['n']+p; s2['fx']={'zin':'panr','panr':'zout','zout':'panl'}.get(s2.get('fx'),'zin'); s2.pop('text',None); s2.pop('stamp',None)
            s2.update(t0=round(a+p*d/parts,2),t1=round(a+(p+1)*d/parts,2),sec=sec,music=g['music'] if (k==0 and p==0) else None,
                      narr=' '.join(x['text'] for x in sent[g['a']:g['b']+1]) if (k==0 and p==0) else None)
            shots.append(s2)
miss=[i for i,c in enumerate(cov) if c!=1]
print('frases sem cobertura/duplicadas:',miss)
d=[s['t1']-s['t0'] for s in shots]
print('planos',len(shots),'media %.2f min %.2f max %.2f'%(sum(d)/len(d),min(d),max(d)))
print('<1.5s:',sum(1 for x in d if x<1.5),' >5s:',sum(1 for x in d if x>5.01))
intro=[x for s,x in zip(shots,d) if s['t0']<113]; print('intro media %.2f'%(sum(intro)/len(intro)))
json.dump(shots,open(f'{S}/shots.json','w'),ensure_ascii=False)
keys=sorted(x for x in ({s['key'] for s in shots if s['t']=='img'}|{s.get('bgkey') or s.get('bg') for s in shots if s['t']=='gfx'}|{s.get(k) for s in shots for k in ('lkey','rkey')}) if x)
print('assets usados',len(keys))
Q=json.load(open(f'{S}/queries.json')); print('sem query:',[k for k in keys if k and k not in Q])
